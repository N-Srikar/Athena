// routes/borrowRoutes.js
const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect the route using only authentication
router.use(authMiddleware);

// PATCH /api/borrow/updateFines - Recalculate fines for overdue borrow records
router.patch('/updateFines', borrowController.updateFines);

router.get('/history', borrowController.getBorrowHistory);

// Get student's own borrowing history (returned books)
router.get('/member/history',  borrowController.getMyBorrowHistory);

module.exports = router;
