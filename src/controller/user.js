const HealthProfessional = require('../models/healthProfessional');
const Patient = require('../models/patient');
const BaseController = require("./base");
const bcrypt = require('bcryptjs');
const {
  resetPasswordValidation,
  updateUserValidation
} = require("../helper/validator")


class UserController extends BaseController {
  constructor() {
    super();
  }

  async getUser(req, res) {
    const userdata = [
      {
        name: "john doe",
        email: "john@mail.com",
      },
      {
        name: "brain tracy",
        email: "brian@mail.com",
      },
    ];
    this.success(
      res,
      "--user/fake-data",
      "user data fetched successfully",
      200,
      userdata
    );
  }

  async updateUser(req, res, User){
    
    const { firstName, lastName, phoneNumber, specialty, dateOfBirth } = req.body;
    
     // Validate the request body
     const { error, value } = updateUserValidation(req.user.userType).validate(req.body);
     if (error) {
      return this.error(res, '--error', error.details[0].message, 400, null);
    }
    const { userType } = req.user; 
    console.log(userType)
    let UserModel;

    if (userType === 'patient') {
      UserModel = Patient;
    } else if (userType === 'healthProfessional') {
      UserModel = HealthProfessional;
    } else {
      return this.error(res, '--error', 'Invalid user type', 400, null);
    }

    const userId = req.user._id; 

    // Update user details based on user type
   const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName,
          lastName,
          phoneNumber,
          ...(userType === 'patient' && { dateOfBirth }),
          ...(userType === 'healthProfessional' && { specialty }),
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return this.error(res, '--error', 'User not found', 404, null);
    }
    return this.success(res, '--success', 'User details updated successfully', 200, null);
}

async resetPassword(req, res) {
  const { newPassword, confirmPassword } = req.body;
  // Validate the request body
  const { error, value } = resetPasswordValidation.validate(req.body);

  if (error) {
    return this.error(res, '--error', error.details[0].message, 400, null);
  }
  const { userType } = req.user;

  console.log(userType);

  let UserModel;

  if (userType === 'patient') {
    UserModel = Patient;
  } else if (userType === 'healthProfessional') {
    UserModel = HealthProfessional;
  } else {
    return this.error(res, '--error', 'Invalid user type', 400, null);
  }
  const userId = req.user._id
  const user = await UserModel.findById(userId);

  if (!user) {
    return this.error(res, '--error', 'User not found', 404, null);
  }

  // Check if newPassword and confirmPassword match
  if (newPassword !== confirmPassword) {
    return this.error(res, '--error', 'New password and confirm password do not match', 400, null);
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password
  user.password = hashedPassword;
  await user.save();
  return this.success(res, '--success', 'Password updated successfully', 200, null);
}
}

module.exports = UserController;
