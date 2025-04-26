// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, hashPassword, comparePasswords } = require('../utils/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, ...profileData } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password: await hashPassword(password),
      role,
      profile: profileData
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({ token, user: { id: user._id, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({ token, user: { id: user._id, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;