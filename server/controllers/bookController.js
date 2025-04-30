// controllers/bookController.js
const Book = require('../models/Book');

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, category, totalCopies } = req.body;

    const book = await Book.create({
      title,
      author,
      category,
      totalCopies,
      availableCopies: totalCopies
    });

    res.status(201).json({ message: 'Book added successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add book', error: error.message });
  }
};

// Update book details
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.totalCopies !== undefined) {
      updates.availableCopies = updates.totalCopies;
    }

    const book = await Book.findByIdAndUpdate(id, updates, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.status(200).json({ message: 'Book updated', book });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
};


// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
};

// Get all books (with optional filters)
exports.getBooks = async (req, res) => {
  try {
    const { title, author, category } = req.query;
    let query = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (author) query.author = { $regex: author, $options: 'i' };
    if (category) query.category = category;

    const books = await Book.find(query);
    res.status(200).json({ message: 'Books retrieved', books });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve books', error: error.message });
  }
};
