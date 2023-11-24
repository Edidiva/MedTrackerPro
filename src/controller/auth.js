const {generateAuthToken, generateOTP} =require('../helper/index')
const bcrypt = require('bcryptjs');
const HealthProfessional = require('../models/healthProfessional');
const Patient = require('../models/patient');
const dotenv = require("dotenv");
const ENV = require("../config/env");
const {sendVerificationEmail}= require("../helper/sendMail");
const {
    signUpValidation,
    verifyOTPValidation,
    verifyResetOTPValidation,
    loginValidation,
    forgetPasswordValidation,
    
  } = require("../helper/validator")
  

dotenv.config();


const BaseController = require("./base");

class AuthController extends BaseController {
  constructor() {
    super();
  }

  async SignUp(req, res, User) {
    const { email, userType, password} = req.body;
    const { error, value } = signUpValidation.validate(req.body);

    if (error) {
      return this.error(res, '--error', error.details[0].message, 400, null);
    }

    let UserModel;

    if (userType === 'patient') {
      UserModel = Patient;
    } else if (userType === 'healthProfessional') {
      UserModel = HealthProfessional;
    } else {
      return this.error(res, '--error', 'Invalid user type', 400, null);
    }
    const existingUser = await UserModel.findOne({ email });

    if (existingUser && existingUser.verified) {
      return this.error(res, '--error', 'Invalid or already verified email address', 404, null);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and save user (without additional fields)
    const otp = generateOTP();
    const newUser = new UserModel({
      email,
      password: hashedPassword,
      userType,
      otp,
    });
    await newUser.save();
    const text = "email verification code is"
    // Send verification email
    sendVerificationEmail(email, otp, text,(error, message) => {
        if (error) {
          return this.error(res, '--error', 'Error sending verification email', 500, null);
        }
        return this.success(res, '--success', 'User registered successfully. Verification email sent.', 201, null);
      });
   
}

    

  async verifyOTP(req, res, User) {
    const { email, userType, otp } = req.body;
    const { error, value } = verifyOTPValidation.validate(req.body);

    if (error) {
      return this.error(res, '--error', error.details[0].message, 400, null);
    }

    let UserModel;
    if (userType === 'patient') {
      UserModel = Patient;
    } else if (userType === 'healthProfessional') {
      UserModel = HealthProfessional;
    } else {
      return this.error(res, '--error', 'Invalid user type', 400, null);
    }

    const user = await UserModel.findOne({ email, otp });

    if (!user || user.verified) {
      return this.error(res, '--error', 'Invalid email or already verified OTP', 404, null);
    }

    // Clear OTP and mark user as verified after successful verification
    user.otp = null;
    user.verified = true;
    await user.save();
    // Generate authentication token
    return this.success(res, '--success', 'OTP verified successfully', 200, null);
  }

    
  async verifyResetOTP(req, res, User) {
    const { email, userType, otp } = req.body;
    const { error, value } = verifyResetOTPValidation.validate(req.body);

    if (error) {
      return this.error(res, '--error', error.details[0].message, 400, null);
    }

    let UserModel;
    if (userType === 'patient') {
      UserModel = Patient;
    } else if (userType === 'healthProfessional') {
      UserModel = HealthProfessional;
    } else {
      return this.error(res, '--error', 'Invalid user type', 400, null);
    }

    const user = await UserModel.findOne({ email, otp });

    if (!user) {
      return this.error(res, '--error', 'Invalid email or already verified OTP', 404, null);
    }

    // Clear OTP and mark user as verified after successful verification
    user.otp = null;
    await user.save();
    // Generate authentication token
    const token = generateAuthToken(user);
    return this.success(res, '--success', 'OTP verified successfully', 200, token);
  }

    
    
  
    async Login (req, res, User){
        const { email, password, userType } = req.body;
        const { error, value } = loginValidation.validate(req.body);

        if (error) {
          return this.error(res, '--error', error.details[0].message, 400, null);
        }
    
        // Check the user type and retrieve the user from the appropriate model
        if (userType === 'patient') {
          User = Patient;
        } else if (userType === 'healthProfessional') {
          User = HealthProfessional;
        } else {
          return res.status(400).json({ error: 'Invalid user type' });
        }
    
        // Find the user by email
        const user = await User.findOne({ email });
    
        if (!user) {
          return this.error(res, '--error', 'invalid credentials', 401, null)
        }
    
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
         return this.error(res, '--error', 'invalid credentials', 401, null)
        }
  
      const token = generateAuthToken(user); 
      const newUser = {
        email: user.email,
        userId : user._id,
        userType: user.userType,
        verified: user.verified

      }
      return this.success(res, '--sucess', 'successfully logged in', 201, {newUser, token});
    }

  async forgetPassword(req, res){
    const { email, userType } = req.body;
    const { error, value } = forgetPasswordValidation.validate(req.body);

    if (error) {
      return this.error(res, '--error', error.details[0].message, 400, null);
    }

    let UserModel;

    if (userType === 'patient') {
      UserModel = Patient;
    } else if (userType === 'healthProfessional') {
      UserModel = HealthProfessional;
    } else {
      return this.error(res, '--error', 'Invalid user type', 400, null);
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to the user model
    user.otp = otp;
    await user.save();
    const text = "OTP to reset password is"
    // Send verification email
    sendVerificationEmail(email, otp,text,(error, message) => {
        if (error) {
          return this.error(res, '--error', 'Error sending reset password otp', 500, null);
        }
        return this.success(res, '--success', 'reset password otp sent successfully', 201, null);
      });
  }
  };


module.exports = AuthController;