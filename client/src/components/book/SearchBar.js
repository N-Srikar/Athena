// src/components/book/SearchBar.js
import React from 'react';

const SearchBar = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search by title, author, or category..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={styles.input}
    />
  );
};

const styles = {
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
};

export default SearchBar;
