// models/Fine.js
const mongoose = require('mongoose');

const FineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    borrowRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BorrowHistory',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fine', FineSchema);
