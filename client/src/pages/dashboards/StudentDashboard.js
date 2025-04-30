// src/pages/dashboards/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SearchBar from '../../components/book/SearchBar';
import BookCard from '../../components/book/BookCard';

const StudentDashboard = () => {
  // State for available books
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [error, setError] = useState('');
  const [borrowMessage, setBorrowMessage] = useState('');

  // State for borrowed books (approved requests only)
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loadingBorrowed, setLoadingBorrowed] = useState(false);

  // Fetch all available books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      setLoadingBooks(true);
      setError('');
      try {
        const res = await api.get('/api/books');
        setBooks(res.data.books);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching books');
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchBooks();
  }, []);

  // Fetch the student's borrowed books (only approved)
  const fetchBorrowedBooks = async () => {
    setLoadingBorrowed(true);
    try {
      const res = await api.get('/api/member/due');
      // Only return records with status "approved"
      const approvedRecords = res.data.dueBooks.filter((record) => record.status === 'approved');
      setBorrowedBooks(approvedRecords);
    } catch (err) {
      console.error('Error fetching borrowed books:', err);
    } finally {
      setLoadingBorrowed(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  // Update search state
  const handleSearch = (value) => {
    setSearch(value);
  };

  // Filter available books based on search term
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    (book.category && book.category.toLowerCase().includes(search.toLowerCase()))
  );

  // Request to borrow a book
  const handleBorrow = async (bookId) => {
    setBorrowMessage('');
    try {
      const res = await api.post('/api/member/borrow', { bookId });
      setBorrowMessage(res.data.message || 'Borrow request submitted successfully');
      fetchBorrowedBooks();
    } catch (err) {
      setBorrowMessage(err.response?.data?.message || 'Error requesting borrow');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Student Dashboard</h1>
      {error && <p style={styles.error}>{error}</p>}

      {/* Section: Available Books */}
      <section style={styles.section}>
        <h2>Available Books</h2>
        <SearchBar search={search} setSearch={handleSearch} />
        {loadingBooks ? (
          <p>Loading books...</p>
        ) : filteredBooks.length > 0 ? (
          <div style={styles.bookList}>
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} onBorrow={handleBorrow} />
            ))}
          </div>
        ) : (
          <p>No books found.</p>
        )}
        {borrowMessage && <p style={styles.message}>{borrowMessage}</p>}
      </section>

      {/* Section: Borrowed Books */}
      <section style={styles.section}>
        <h2>My Borrowed Books</h2>
        {loadingBorrowed ? (
          <p>Loading borrowed books...</p>
        ) : borrowedBooks.length > 0 ? (
          <div style={styles.borrowList}>
            {borrowedBooks.map((record) => (
              <div key={record._id} style={styles.borrowCard}>
                <h3>{record.book?.title || 'Book Title'}</h3>
                <p>Borrow Date: {new Date(record.requestDate).toLocaleDateString()}</p>
                <p>Due Date: {new Date(record.dueDate).toLocaleDateString()}</p>
                {/* Fine is not shown to the student */}
              </div>
            ))}
          </div>
        ) : (
          <p>You have no borrowed books.</p>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '2rem',
  },
  error: {
    color: 'red',
  },
  message: {
    color: 'green',
    marginTop: '1rem',
  },
  bookList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  borrowList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  borrowCard: {
    border: '1px solid #007bff',
    borderRadius: '5px',
    padding: '1rem',
  },
};

export default StudentDashboard;
