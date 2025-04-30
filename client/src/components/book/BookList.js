// src/components/book/BookList.js
import React from 'react';
import BookCard from './BookCard.js';

const BookList = ({ books, onBorrow }) => {
  return (
    <div style={styles.listContainer}>
      {books.map((book) => (
        <BookCard key={book._id} book={book} onBorrow={onBorrow} />
      ))}
    </div>
  );
};

const styles = {
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
};

export default BookList;
