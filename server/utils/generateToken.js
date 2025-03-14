// utils/generateToken.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (payload, expiresIn = '1d') => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
};

module.exports = generateToken;
