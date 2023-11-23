const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
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
    enum: ['patient'],
    default: 'patient',
  },
  
  dateOfBirth: {
    type: Date,
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

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
