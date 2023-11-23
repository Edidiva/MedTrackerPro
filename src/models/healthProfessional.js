const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const healthProfessionalSchema = new Schema({
  name: {
    type: String,
    required: true,
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
    required: true,
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
    unique:true,
    required:false,
  }
});

const HealthProfessional = mongoose.model('HealthProfessional', healthProfessionalSchema);

module.exports = HealthProfessional;
