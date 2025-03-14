// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Protect all routes in this file
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// POST /api/admin/librarians - Add a new librarian
router.post('/librarians', adminController.addLibrarian);

// PUT /api/admin/librarians/:id - Update a librarian's details
router.put('/librarians/:id', adminController.updateLibrarian);

// DELETE /api/admin/librarians/:id - Remove a librarian
router.delete('/librarians/:id', adminController.removeLibrarian);

module.exports = router;
