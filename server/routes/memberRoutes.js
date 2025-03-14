// routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Protect all routes in this file (member-only access)
router.use(authMiddleware);
router.use(roleMiddleware(['member']));

// POST /api/member/borrow - Request to borrow a book
router.post('/borrow', memberController.requestBorrow);

// PATCH /api/member/borrow/:requestId/return - Return a borrowed book
router.patch('/borrow/:requestId/return', memberController.returnBook);

// GET /api/member/due - View due books for the member
router.get('/due', memberController.viewDueBooks);

module.exports = router;
