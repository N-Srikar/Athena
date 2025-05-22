// controllers/librarianController.js
const BorrowHistory = require('../models/BorrowHistory');
const Book = require('../models/Book');
const calculateFine = require('../utils/calculateFine');

// Approve a borrow request
exports.approveBorrowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    // Update borrow request status to approved
    const updatedRequest = await BorrowHistory.findByIdAndUpdate(
      requestId,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    // Decrease available copies for the borrowed book
    await Book.findByIdAndUpdate(updatedRequest.book, { $inc: { availableCopies: -1 } });
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
    const { fine } = req.body;

    // Find the borrow record first
    let record = await BorrowHistory.findById(requestId);
    if (!record) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }
    
    // Mark as returned and record the return time
    record.status = 'returned';
    record.returnedAt = new Date();
    record.fine = fine;

    // // Calculate fine using dueDate and returnedAt
    // record.fine = calculateFine(record.dueDate, record.returnedAt);
    
    // Save updated record
    const updatedRecord = await record.save();
    
    // Increment available copies for the returned book
    if (updatedRecord) {
      await Book.findByIdAndUpdate(updatedRecord.book, { $inc: { availableCopies: 1 } });
    }
    
    res.status(200).json({ message: 'Book marked as returned', record: updatedRecord });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark return', error: error.message });
  }
};


// Check overdue books (this could be extended to send notifications, etc.)
exports.checkOverdueBooks = async (req, res) => {
  try {
    const now = new Date();
    // Populate book and user so that details are available
    const overdueRecords = await BorrowHistory.find({
      dueDate: { $lt: now },
      status: 'approved'
    }).populate('book').populate('user');
      
    res.status(200).json({ message: 'Overdue books retrieved', overdueRecords });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch overdue books', error: error.message });
  }
};


exports.getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await BorrowHistory.find({ status: 'pending' })
      .populate('book')
      .populate('user'); // Optionally populate user details
    res.status(200).json({ message: 'Pending requests retrieved', pendingRequests });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve pending requests', error: error.message });
  }
};
