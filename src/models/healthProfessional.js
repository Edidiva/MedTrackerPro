const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const healthProfessionalSchema = new Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },

  userType: {
    type: String,
    enum: ['healthProfessional'],
    default: 'healthProfessional',
  },
  
  specialty: {
    type: String,
    required: false,
  },
   gender: {
    type: String,
    enum: ['male', 'female', 'preferNotToSay'],
    default: 'preferNotToSay',
  },

  otp: {
    type: Number, 
  },

  verified: {
    type: Boolean,
    default: false,
  },
  phoneNumber :{
    type:Number,
    required:false,
  }
});

const HealthProfessional = mongoose.model('HealthProfessional', healthProfessionalSchema);

module.exports = HealthProfessional;
