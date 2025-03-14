// controllers/adminController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Add a new librarian (only admin can perform)
exports.addLibrarian = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if librarian already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Librarian already exists' });
    }
    
    // Auto-generate password (you might want to send this via email or display securely)
    const autoPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(autoPassword, 10);
    
    const librarian = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'librarian'
    });
    
    res.status(201).json({ message: 'Librarian added successfully', librarianId: librarian._id, password: autoPassword });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add librarian', error: error.message });
  }
};

// Update librarian details
exports.updateLibrarian = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    const librarian = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );
    
    if (!librarian) {
      return res.status(404).json({ message: 'Librarian not found' });
    }
    
    res.status(200).json({ message: 'Librarian updated', librarian });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Remove a librarian
exports.removeLibrarian = async (req, res) => {
  try {
    const { id } = req.params;
    
    const librarian = await User.findByIdAndDelete(id);
    if (!librarian) {
      return res.status(404).json({ message: 'Librarian not found' });
    }
    
    res.status(200).json({ message: 'Librarian removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove librarian', error: error.message });
  }
};
