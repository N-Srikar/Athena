// controllers/borrowController.js
const BorrowHistory = require('../models/BorrowHistory');
const calculateFine = require('../utils/calculateFine'); // Utility to calculate fine if needed

// Get borrow history for a user (member) or all records (librarian)
exports.getBorrowHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    let records;
    
    if (userId) {
      // If a userId is provided, filter by that member's records
      records = await BorrowHistory.find({ user: userId });
    } else {
      // Otherwise, return all borrow records (for librarian view)
      records = await BorrowHistory.find();
    }
    
    res.status(200).json({ message: 'Borrow history retrieved', records });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve borrow history', error: error.message });
  }
};

// Optionally, a route to recalculate and update fines for overdue books
// controllers/borrowController.js
exports.updateFines = async (req, res) => {
  try {
    const overdueRecords = await BorrowHistory.find({
      status: { $ne: 'returned' }
    });
    
    for (let record of overdueRecords) {
      if (new Date() > record.dueDate) {
        record.fine = calculateFine(record.dueDate, new Date());
        await record.save();
      }
    }
    
    res.status(200).json({ message: 'Fines updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update fines', error: error.message });
  }
};
