// routes/librarianRoutes.js
const express = require('express');
const router = express.Router();
const librarianController = require('../controllers/librarianController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes using only authentication
router.use(authMiddleware);
// GET /api/librarian/pending - Check pending book requests
router.get('/pending', librarianController.getPendingRequests);

// PATCH /api/librarian/borrow/:requestId/approve - Approve a borrow request
router.patch('/borrow/:requestId/approve', librarianController.approveBorrowRequest);

// PATCH /api/librarian/borrow/:requestId/reject - Reject a borrow request
router.patch('/borrow/:requestId/reject', librarianController.rejectBorrowRequest);

// PATCH /api/librarian/borrow/:requestId/return - Mark a book as returned
router.patch('/borrow/:requestId/return', librarianController.markBookReturned);

// GET /api/librarian/overdue - Check overdue books
router.get('/overdue', librarianController.checkOverdueBooks);


module.exports = router;
