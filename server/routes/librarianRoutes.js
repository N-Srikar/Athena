// routes/librarianRoutes.js
const express = require('express');
const router = express.Router();
const librarianController = require('../controllers/librarianController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Protect all routes in this file (librarian-only access)
router.use(authMiddleware);
router.use(roleMiddleware(['librarian']));

// PATCH /api/librarian/borrow/:requestId/approve - Approve a borrow request
router.patch('/borrow/:requestId/approve', librarianController.approveBorrowRequest);

// PATCH /api/librarian/borrow/:requestId/reject - Reject a borrow request
router.patch('/borrow/:requestId/reject', librarianController.rejectBorrowRequest);

// PATCH /api/librarian/borrow/:requestId/return - Mark a book as returned
router.patch('/borrow/:requestId/return', librarianController.markBookReturned);

// GET /api/librarian/overdue - Check overdue books
router.get('/overdue', librarianController.checkOverdueBooks);

// PATCH /api/librarian/borrow/:requestId/payfine - Mark fine as paid
router.patch('/borrow/:requestId/payfine', librarianController.markFineAsPaid);

module.exports = router;
