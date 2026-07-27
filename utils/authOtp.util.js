const generateOtp = () => {
  // generates a 6 digit number like 483920
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};

module.exports = { generateOtp, generatePassword };