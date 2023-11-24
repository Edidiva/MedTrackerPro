
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ENV = require("../config/env");

dotenv.config();

const generateAuthToken = (user) => {
    const payload = { userEmail: user.email, userType: user.userType, userId:user._id};
    const options = { expiresIn: 60*60*24*30 }; 
    return jwt.sign(payload, ENV.jwtSecret, options);
  };

  const generateOTP = () => {
    // Generate a random 5-digit number as OTP
    const otp = Math.floor(10000 + Math.random() * 90000);
    console.log(otp);
    return otp
  };
  
  module.exports = {generateAuthToken, generateOTP}