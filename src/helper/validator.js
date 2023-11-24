const Joi = require('joi');

const signUpValidation = Joi.object({
  email: Joi.string().email().required(),
  userType: Joi.string().valid('patient', 'healthProfessional').required(),
  password: Joi.string().required(),
});

const verifyOTPValidation = Joi.object({
  email: Joi.string().email().required(),
  userType: Joi.string().valid('patient', 'healthProfessional').required(),
  otp: Joi.number().required(),
});

const verifyResetOTPValidation = Joi.object({
  email: Joi.string().email().required(),
  userType: Joi.string().valid('patient', 'healthProfessional').required(),
  otp: Joi.number().required(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  userType: Joi.string().valid('patient', 'healthProfessional').required(),
});

const forgetPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
  userType: Joi.string().valid('patient', 'healthProfessional').required(),
});
const updateUserValidation = (userType) => {
    return Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phoneNumber: Joi.number().required(),
      dateOfBirth: Joi.when('userType', {
        is: 'patient',
        then: Joi.date().required(),
        otherwise: Joi.optional(),
      }),
      specialty: Joi.when('userType', {
        is: 'healthProfessional',
        then: Joi.string().required(),
        otherwise: Joi.optional(),
      }),
    }).custom((value, helpers) => {
      const { userType } = value;
  
      if (!userType) {
        return helpers.error('any.required', { missing: 'userType' });
      }
  
      if (userType === 'patient' && !value.dateOfBirth) {
        return helpers.error('any.required', { missing: 'dateOfBirth' });
      }
  
      if (userType === 'healthProfessional' && !value.specialty) {
        return helpers.error('any.required', { missing: 'specialty' });
      }
  
      return value;
    });
  };
  const resetPasswordValidation = Joi.object({
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required()});

module.exports = {
  signUpValidation,
  verifyOTPValidation,
  verifyResetOTPValidation,
  loginValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
  updateUserValidation
};
