// controllers/librarianController.js
const BorrowHistory = require('../models/BorrowHistory');
const Book = require('../models/Book');

// Approve a borrow request
exports.approveBorrowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    // Logic to update borrow request status to approved
    const updatedRequest = await BorrowHistory.findByIdAndUpdate(
      requestId,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: 'Borrow request approved', request: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve request', error: error.message });
  }
};

// Reject a borrow request
exports.rejectBorrowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const updatedRequest = await BorrowHistory.findByIdAndUpdate(
      requestId,
      { status: 'rejected', rejectedAt: new Date() },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: 'Borrow request rejected', request: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject request', error: error.message });
  }
};

// Mark a book as returned
exports.markBookReturned = async (req, res) => {
  try {
    const { requestId } = req.params;
    // Update the borrow record to mark returned
    const updatedRecord = await BorrowHistory.findByIdAndUpdate(
      requestId,
      { status: 'returned', returnedAt: new Date() },
      { new: true }
    );
    
    // Optionally update the book's available copies
    if (updatedRecord) {
      await Book.findByIdAndUpdate(updatedRecord.book, { $inc: { availableCopies: 1 } });
    }
    
    res.status(200).json({ message: 'Book marked as returned', record: updatedRecord });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark return', error: error.message });
  }
};

// Mark fine as paid (librarian action)
exports.markFineAsPaid = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    let record = await BorrowHistory.findById(requestId);
    if (!record) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }
    
    // Check if there is a fine to be marked as paid
    if (record.fine <= 0) {
      return res.status(400).json({ message: 'No fine to mark as paid' });
    }
    
    // Mark the fine as paid
    record.finePaid = true;
    await record.save();
    
    res.status(200).json({ message: 'Fine marked as paid', record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark fine as paid', error: error.message });
  }
};

// Check overdue books (this could be extended to send notifications, etc.)
exports.checkOverdueBooks = async (req, res) => {
  try {
    const now = new Date();
    const overdueRecords = await BorrowHistory.find({
      dueDate: { $lt: now },
      status: { $ne: 'returned' }
    });
    res.status(200).json({ message: 'Overdue books retrieved', overdueRecords });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch overdue books', error: error.message });
  }
};
