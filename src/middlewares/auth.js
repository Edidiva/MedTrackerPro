const jwt = require('jsonwebtoken');
const HealthProfessional = require('../models/healthProfessional');
const Patient = require('../models/patient');
const dotenv = require("dotenv");
const ENV = require("../config/env");
dotenv.config()

const isAuthenticated = async (req, res, next) => {
  try {
    // Extracting token from the Authorization header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, ENV.jwtSecret); // Replace with your actual secret key

    // Check the user type and retrieve the user from the appropriate model
    let user;
    if (decoded.userType === 'patient') {
      user = await Patient.findById(decoded.userId);
    } else if (decoded.userType === 'healthProfessional') {
      user = await HealthProfessional.findById(decoded.userId);
    } else {
      return res.status(401).json({ error: 'Unauthorized - Invalid user type' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - User not found' });
    }

    // Attach the user object to the request for further use in the route handlers
    req.user = user;
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = isAuthenticated;
