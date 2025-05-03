// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes in this file using only authentication
router.use(authMiddleware);

// GET /api/admin/librarians - View all current librarians
router.get('/librarians', adminController.getLibrarians);

// POST /api/admin/librarians - Add a new librarian
router.post('/librarians', adminController.addLibrarian);

// PUT /api/admin/librarians/:id - Update a librarian's details
router.put('/librarians/:id', adminController.updateLibrarian);

// DELETE /api/admin/librarians/:id - Remove a librarian
router.delete('/librarians/:id', adminController.removeLibrarian);

module.exports = router;
