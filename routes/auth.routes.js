const express = require("express");
const { signUp, signIn, signOut, verifyOtp, resendOtp, changePassword, getMe } = require("../controllers/auth.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);
router.get("/me", protect, getMe);

module.exports = router;
