// routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes using only authentication
router.use(authMiddleware);

// POST /api/member/borrow - Request to borrow a book
router.post('/borrow', memberController.requestBorrow);

// GET /api/member/due - View due/borrowed books for the member
router.get('/due', memberController.viewDueBooks);

module.exports = router;
