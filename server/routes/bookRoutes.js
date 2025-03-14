// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Protect all routes in this file (librarian-only access)
router.use(authMiddleware);
router.use(roleMiddleware(['librarian']));

// POST /api/books - Add a new book
router.post('/', bookController.addBook);

// PUT /api/books/:id - Update a book
router.put('/:id', bookController.updateBook);

// DELETE /api/books/:id - Delete a book
router.delete('/:id', bookController.deleteBook);

// GET /api/books - Get all books (optional filters via query parameters)
router.get('/', bookController.getBooks);

module.exports = router;
