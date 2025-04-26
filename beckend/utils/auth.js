// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare passwords
const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = { generateToken, hashPassword, comparePasswords };