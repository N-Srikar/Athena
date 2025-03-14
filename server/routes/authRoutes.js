// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register - Member registration
router.post('/register', authController.register);

// POST /api/auth/login - Login for Admin, Librarian, and Member
router.post('/login', authController.login);

module.exports = router;
