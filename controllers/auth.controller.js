const User = require("../models/user.model.js");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/auth.util.js");
const { generateOtp } = require("../utils/authOtp.util.js");
const { sendOtpEmail } = require("../utils/mailer.util.js");

const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already exist" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Passwors must be atleast 6 latter" });
    }
    if (mobile.length < 10) {
      return res.status(400).json({ message: "mobile must 10 latter" });
    }

    const hashedPassword = await hashPassword(password);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role,
      otp,
      otpExpiry,
      isVerified: false,
    });
    await sendOtpEmail(email, otp);
    return res.status(201).json({
      message: "Signup successful. OTP sent to your email.",
      userId: newUser._id,
    });
  } catch (error) {
    return res.status(500).json({ message: `Sign up error: ${error.message}` });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already varified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Success — mark verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.otp;
    delete safeUser.otpExpiry;

    return res
      .status(200)
      .json({ message: "Email verified successfully", user: safeUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Verify OTP error: ${error.message}` });
  }
};


const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Already verified" });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Resend OTP error: ${error.message}` });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });


    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    console.log("user : ",user)
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge:  7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.otp;
    delete safeUser.otpExpiry;

    return res.status(200).json({ message: "Sign in successful", user: safeUser,token:token });
  } catch (error) {
    return res.status(500).json({ message: `Sign in error: ${error.message}` });
  }
};

const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({ message: "Sign out successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Sign out error: ${error.message}` });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Old password, new password and confirm password are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be atleast 6 letters" });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Change password error: ${error.message}` });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = {
  signUp,
  signIn,
  signOut,
  verifyOtp,
  resendOtp,
  changePassword,
  getMe,
};
