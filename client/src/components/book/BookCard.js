// src/components/book/BookCard.js
import React from 'react';

const BookCard = ({ book, onBorrow }) => {
  return (
    <div style={styles.card}>
      <h3>{book.title}</h3>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Category:</strong> {book.category || 'N/A'}</p>
      <p><strong>Available Copies:</strong> {book.availableCopies}</p>
      <button onClick={() => onBorrow(book._id)} style={styles.button}>
        Request to Borrow
      </button>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '1rem',
    width: 'calc(33% - 1rem)',
    boxSizing: 'border-box',
    marginBottom: '1rem',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
  },
};

export default BookCard;
