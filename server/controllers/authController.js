// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User'); // Assumes a unified User model for Admin, Librarian, Member

// Member registration
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new member with role 'member'
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'member'
    });

    res.status(201).json({ message: 'Registration successful', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login for all users (Admin, Librarian, Member)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Special handling for Admin with fixed credentials
    if (email === config.ADMIN_EMAIL) {
      if (password === config.ADMIN_PASSWORD) {
        // Create token payload
        const token = jwt.sign({ email, role: 'admin' }, config.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ message: 'Admin logged in', token });
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    }

    // For Librarian and Member, find user in database
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
