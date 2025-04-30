// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    // Add a field for storing plain text password (only for librarians)
    plainPassword: {
      type: String
    },
    role: {
      type: String,
      enum: ['admin', 'librarian', 'member'],
      required: true,
      default: 'member'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
