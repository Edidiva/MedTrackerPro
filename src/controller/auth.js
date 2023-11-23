const {generateAuthToken, generateOTP} =require('../helper/index')
const bcrypt = require('bcrypt');
const HealthProfessional = require('../models/healthProfessional');
const Patient = require('../models/patient');
const dotenv = require("dotenv");
const ENV = require("../config/env");
const {sendVerificationEmail}= require("../helper/sendMail");

dotenv.config();


const BaseController = require("./base");

class AuthController extends BaseController {
  constructor() {
    super();
  }

  async SignUp(req, res, User) {
    const { email, userType, password} = req.body;

    let UserModel;

    if (userType === 'patient') {
      UserModel = Patient;
    } else if (userType === 'healthProfessional') {
      UserModel = HealthProfessional;
    } else {
      return this.error(res, '--error', 'Invalid user type', 400, null);
    }
    const existingUser = await UserModel.findOne({ email });

    if (existingUser||existingUser.verified) {
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

    // Send verification email
    sendVerificationEmail(email, otp, (error, message) => {
        if (error) {
          return this.error(res, '--error', 'Error sending verification email', 500, null);
        }
        return this.success(res, '--success', 'User registered successfully. Verification email sent.', 201, null);
      });
   
}

    

  async verifyOTP(req, res, User) {
    const { email, userType, otp } = req.body;

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
      return this.error(res, '--error', 'Invalid or already verified OTP', 404, null);
    }

    // Clear OTP and mark user as verified after successful verification
    user.otp = null;
    user.verified = true;
    await user.save();

    return this.success(res, '--success', 'OTP verified successfully', 200, null);
  }

    
    async Register(req, res, User){
    
      const { fisrtName, lastName, additionalFields } = req.body;
     
      let UserModel;
      let fixedAdditionalFields = {};
  
      if (userType === 'patient') {
        UserModel = Patient;
        fixedAdditionalFields = {
          dateOfBirth: additionalFields.dateOfBirth,
        };
      } else if (userType === 'healthProfessional') {
        UserModel = HealthProfessional;
        fixedAdditionalFields = {
          specialty: additionalFields.specialty,
        };
      } else {
        return this.error(res, "--error","invalid user type", 400, null )
      }
  
      const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return this.error(res, "--error", "email address already registered for the specified user type", 404,null);
    }


      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({ fisrtName, lastName, email, password: hashedPassword, ...fixedAdditionalFields });
      await user.save();
      const token = generateAuthToken(user);
      return this.success(res, '--sucess', 'successfully registered', 201, {user,token});
}
  
    async Login (req, res, User){
        const { email, password, userType } = req.body;

        // Check the user type and retrieve the user from the appropriate model
        let User;
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
      return this.success(res, '--sucess', 'successfully logged in', 201, user);
    }
    async updateUserDetails(req, res) {
        try {
          const userId = req.params.id;
          const { name, dateOfBirth, specialty } = req.body;
    
          // Assuming your User model has fields like name, dateOfBirth, specialty, etc.
          const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: {
              name,
              dateOfBirth,
              specialty,
              // Add other fields based on your user type
            },
          }, { new: true });
    
          if (!updatedUser) {
            return this.error(res, 'User not found', 404);
          }
    
          return this.success(res, 'User details updated successfully', { user: updatedUser });
        } catch (error) {
          return this.error(res, 'Internal Server Error', 500);
        }
      }
    
  };


module.exports = AuthController;