const dotenv = require("dotenv");
const ENV = require("../config/env");
const nodemailer = require('nodemailer');

const sendVerificationEmail = (email, otp, callback) => {
  // Send OTP to the user's email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'edikanakpan5@gmail.com',
      pass: ENV.mailPassword,
    },
  });

  const mailOptions = {
    from: 'edikanakpan5@gmail.com',
    to: email,
    subject: 'Verify Your Email',
    text: `You are receiving this message from MedTrackerPro.\nYour verification code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP email:', error);
      return callback(error, null);
    }

    console.log('Email sent:', info.response);
    return callback(null, 'OTP sent successfully');
  });
};

module.exports = { sendVerificationEmail };
