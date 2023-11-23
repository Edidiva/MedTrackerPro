
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ENV = require("../config/env");
const otpGenerator = require("otp-generator");

dotenv.config();

const generateAuthToken = (user) => {
    const payload = { userEmail: user.email, userType: user.userType };
    const options = { expiresIn: 60*60*24*30 }; 
    return jwt.sign(payload, ENV.jwtSecret, options);
  };

const generateOTP =()=>{
    // Generate a random 5-digit OTP
  const otp = otpGenerator.generate(5, { digits: true, upperCase: false, specialChars: false, alphabets: false });

  return otp;
}
  module.exports = {generateAuthToken, generateOTP}