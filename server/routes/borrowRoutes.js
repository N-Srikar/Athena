// routes/borrowRoutes.js
const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Protect the route with librarian access
router.use(authMiddleware);
router.use(roleMiddleware(['librarian']));

// PATCH /api/borrow/updateFines - Recalculate fines for overdue borrow records
router.patch('/updateFines', borrowController.updateFines);

module.exports = router;
