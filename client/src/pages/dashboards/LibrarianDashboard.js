// src/pages/dashboards/LibrarianDashboard.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const LibrarianDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [overdueRecords, setOverdueRecords] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [bookForm, setBookForm] = useState({ title: '', author: '', category: '', totalCopies: '' });
  const [isEditingBook, setIsEditingBook] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);

  // Fetch Pending Requests
  const fetchPendingRequests = async () => {
    try {
      const res = await api.get('/api/librarian/pending');
      setPendingRequests(res.data.pendingRequests);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching pending requests');
    }
  };

  // Fetch Overdue Records
  const fetchOverdueRecords = async () => {
    try {
      const res = await api.get('/api/librarian/overdue');
      setOverdueRecords(res.data.overdueRecords);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching overdue records');
    }
  };

  // Fetch Current Borrowed Books from borrow history (filter for approved records)
  const fetchBorrowedBooks = async () => {
    try {
      const res = await api.get('/api/borrow/history');
      const currentBorrowed = res.data.records.filter(rec => rec.status === 'approved');
      setBorrowedBooks(currentBorrowed);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching borrowed books');
    }
  };

  // Fetch all books (for management)
  const fetchBooks = async () => {
    try {
      const res = await api.get('/api/books');
      setBooks(res.data.books);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching books');
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    fetchOverdueRecords();
    fetchBorrowedBooks();
    fetchBooks();
  }, []);

  // Approve a borrow request
  const handleApprove = async (requestId) => {
    try {
      const res = await api.patch(`/api/librarian/borrow/${requestId}/approve`);
      setMessage(res.data.message);
      fetchPendingRequests();
      fetchBorrowedBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Error approving request');
    }
  };

  // Reject a borrow request
  const handleReject = async (requestId) => {
    try {
      const res = await api.patch(`/api/librarian/borrow/${requestId}/reject`);
      setMessage(res.data.message);
      fetchPendingRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Error rejecting request');
    }
  };

  // Mark a book as returned (this calculates fine and updates available copies)
  const handleReturn = async (requestId) => {
    try {
      const res = await api.patch(`/api/librarian/borrow/${requestId}/return`);
      // Extract the returned record from the response
      const returnedRecord = res.data.record;
      // Get the calculated fine
      const fine = returnedRecord.fine;
      // Set a message that includes the fine amount
      setMessage(`Book marked as returned. Fine: $${fine}`);
      // Refresh the overdue and borrowed lists
      fetchOverdueRecords();
      fetchBorrowedBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Error marking book as returned');
    }
  };

  // Book Management Handlers
  const handleBookFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingBook) {
        await api.put(`/api/books/${editingBookId}`, {
          title: bookForm.title,
          author: bookForm.author,
          category: bookForm.category,
          totalCopies: Number(bookForm.totalCopies),
        });
        setMessage('Book updated successfully');
        setIsEditingBook(false);
        setEditingBookId(null);
      } else {
        await api.post('/api/books', {
          title: bookForm.title,
          author: bookForm.author,
          category: bookForm.category,
          totalCopies: Number(bookForm.totalCopies),
        });
        setMessage('Book added successfully');
      }
      setBookForm({ title: '', author: '', category: '', totalCopies: '' });
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting book form');
    }
  };

  const handleEditBook = (book) => {
    setIsEditingBook(true);
    setEditingBookId(book._id);
    setBookForm({
      title: book.title,
      author: book.author,
      category: book.category,
      totalCopies: book.totalCopies,
    });
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/api/books/${bookId}`);
      setMessage('Book deleted successfully');
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting book');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Librarian Dashboard</h1>
      {error && <p style={styles.error}>{error}</p>}
      {message && <p style={styles.message}>{message}</p>}

      {/* Pending Borrow Requests */}
    <section style={styles.section}>
      <h2>Pending Borrow Requests</h2>
      {pendingRequests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Book</th>
              <th style={styles.th}>Borrower</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map(req => (
              <tr key={req._id}>
                <td style={styles.td}>{req.book?.title || 'N/A'}</td>
                <td style={styles.td}>{req.user?.name || 'N/A'}</td>
                <td style={styles.td}>{new Date(req.dueDate).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <button onClick={() => handleApprove(req._id)} style={styles.buttonApprove}>Approve</button>
                  <button onClick={() => handleReject(req._id)} style={styles.buttonReject}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>

    {/* Overdue Records */}
    <section style={styles.section}>
      <h2>Overdue Records</h2>
      {overdueRecords.length === 0 ? (
        <p>No overdue records.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Book</th>
              <th style={styles.th}>Borrower</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {overdueRecords.map(rec => (
              <tr key={rec._id}>
                <td style={styles.td}>{rec.book?.title || 'N/A'}</td>
                <td style={styles.td}>{rec.user?.name || 'N/A'}</td>
                <td style={styles.td}>{new Date(rec.dueDate).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <button onClick={() => handleReturn(rec._id)} style={styles.buttonReturn}>Mark Returned</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>

    {/* Currently Borrowed Books */}
    <section style={styles.section}>
      <h2>Currently Borrowed Books</h2>
      {borrowedBooks.length === 0 ? (
        <p>No borrowed books.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Book</th>
              <th style={styles.th}>Borrower</th>
              <th style={styles.th}>Borrow Date</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map(rec => (
              <tr key={rec._id}>
                <td style={styles.td}>{rec.book?.title || 'N/A'}</td>
                <td style={styles.td}>{rec.user?.name || 'N/A'}</td>
                <td style={styles.td}>{new Date(rec.requestDate).toLocaleDateString()}</td>
                <td style={styles.td}>{new Date(rec.dueDate).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <button onClick={() => handleReturn(rec._id)} style={styles.buttonReturn}>Mark Returned</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>

      {/* Section: Book Management */}
      <section style={styles.section}>
        <h2>Book Management</h2>
        <form onSubmit={handleBookFormSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Title"
            value={bookForm.title}
            onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={bookForm.author}
            onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={bookForm.category}
            onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Total Copies"
            value={bookForm.totalCopies}
            onChange={(e) => setBookForm({ ...bookForm, totalCopies: e.target.value })}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            {isEditingBook ? 'Update Book' : 'Add Book'}
          </button>
          {isEditingBook && (
            <button
              type="button"
              onClick={() => {
                setIsEditingBook(false);
                setEditingBookId(null);
                setBookForm({ title: '', author: '', category: '', totalCopies: '' });
              }}
              style={styles.buttonCancel}
            >
              Cancel
            </button>
          )}
        </form>
        <h3>Current Books</h3>
        {books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Total Copies</th>
                <th>Available Copies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.totalCopies}</td>
                  <td>{book.availableCopies}</td>
                  <td>
                    <button onClick={() => handleEditBook(book)} style={styles.buttonEdit}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteBook(book._id)} style={styles.buttonDelete}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    marginBottom: '1rem',
  },
  message: {
    color: 'green',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1rem',
  },
  th: {
    textAlign: 'left',
    padding: '8px',
    borderBottom: '2px solid #ddd',
  },
  td: {
    textAlign: 'left',
    padding: '8px',
    borderBottom: '1px solid #eee',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
  input: {
    margin: '0.5rem 0',
    padding: '0.5rem',
    fontSize: '1rem',
  },
  button: {
    padding: '0.7rem',
    fontSize: '1rem',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  buttonEdit: {
    padding: '0.5rem 1rem',
    background: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
  buttonDelete: {
    padding: '0.5rem 1rem',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  buttonCancel: {
    padding: '0.5rem 1rem',
    background: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  buttonReturn: {
    padding: '0.5rem 1rem',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default LibrarianDashboard;
