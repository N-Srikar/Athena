// models/BorrowHistory.js
const mongoose = require('mongoose');

const BorrowHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    requestDate: {
      type: Date,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    approvedAt: {
      type: Date
    },
    rejectedAt: {
      type: Date
    },
    returnedAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'returned'],
      default: 'pending'
    },
    fine: {
      type: Number,
      default: 0
    },
    finePaid: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BorrowHistory', BorrowHistorySchema);
