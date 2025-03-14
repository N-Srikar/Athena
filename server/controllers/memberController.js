// controllers/memberController.js
const BorrowHistory = require('../models/BorrowHistory');
const Book = require('../models/Book');
const calculateFine = require('../utils/calculateFine');

// Member requests to borrow a book
exports.requestBorrow = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id; // Assumes auth middleware sets req.user

    // Check if the book is available
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies < 1) {
      return res.status(400).json({ message: 'Book not available' });
    }

    // Create a new borrow record with pending status
    const borrowRecord = await BorrowHistory.create({
      user: userId,
      book: bookId,
      requestDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // e.g., 14 days from now
      status: 'pending'
    });

    res.status(201).json({ message: 'Borrow request submitted', borrowRecord });
  } catch (error) {
    res.status(500).json({ message: 'Failed to request borrow', error: error.message });
  }
};

// Member returns a book
exports.returnBook = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Find the borrow record first
    let record = await BorrowHistory.findById(requestId);
    if (!record) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }
    
    // Update the borrow record to mark as returned
    record.status = 'returned';
    record.returnedAt = new Date();
    
    // Automatically calculate fine if overdue
    record.fine = calculateFine(record.dueDate, record.returnedAt);
    
    await record.save();
    
    res.status(200).json({ message: 'Book returned successfully', record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to return book', error: error.message });
  }
};

// View due books for the member
exports.viewDueBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const dueBooks = await BorrowHistory.find({
      user: userId,
      dueDate: { $gte: now },
      status: 'approved'
    });
    res.status(200).json({ message: 'Due books retrieved', dueBooks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve due books', error: error.message });
  }
};

