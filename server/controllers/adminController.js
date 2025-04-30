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
    
    // Auto-generate password (for demonstration purposes)
    const autoPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(autoPassword, 10);
    
    // Create the librarian and store the plain password in plainPassword field
    const librarian = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'librarian',
      plainPassword: autoPassword
    });
    
    res.status(201).json({ 
      message: 'Librarian added successfully', 
      librarianId: librarian._id, 
      password: autoPassword 
    });
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

// NEW: Get all librarians (including their plain text password)
exports.getLibrarians = async (req, res) => {
  try {
    // Fetch all librarians; make sure to select the plainPassword field explicitly if needed.
    const librarians = await User.find({ role: 'librarian' });
    res.status(200).json({ message: 'Librarians retrieved', librarians });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve librarians', error: error.message });
  }
};
