// src/pages/dashboards/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [librarians, setLibrarians] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  // For adding a new librarian
  const [addForm, setAddForm] = useState({ name: '', email: '' });
  // For updating an existing librarian
  const [updateForm, setUpdateForm] = useState({ id: '', name: '', email: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch all librarians from the backend
  const fetchLibrarians = async () => {
    try {
      const res = await api.get('/api/admin/librarians');
      setLibrarians(res.data.librarians);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching librarians');
    }
  };

  useEffect(() => {
    fetchLibrarians();
  }, []);

  // Handler to add a new librarian
  const handleAddLibrarian = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/admin/librarians', addForm);
      setMessage(`Librarian added successfully! Password: ${res.data.password}`);
      setAddForm({ name: '', email: '' });
      fetchLibrarians();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding librarian');
    }
  };

  // Handler to initiate editing an existing librarian
  const handleEditLibrarian = (lib) => {
    setIsUpdating(true);
    setUpdateForm({ id: lib._id, name: lib.name, email: lib.email });
  };

  // Handler to update a librarian's details
  const handleUpdateLibrarian = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/admin/librarians/${updateForm.id}`, {
        name: updateForm.name,
        email: updateForm.email,
      });
      setMessage('Librarian updated successfully');
      setIsUpdating(false);
      setUpdateForm({ id: '', name: '', email: '' });
      fetchLibrarians();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating librarian');
    }
  };

  // Handler to delete a librarian
  const handleDeleteLibrarian = async (id) => {
    if (!window.confirm('Are you sure you want to delete this librarian?')) return;
    try {
      await api.delete(`/api/admin/librarians/${id}`);
      setMessage('Librarian deleted successfully');
      fetchLibrarians();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting librarian');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>
      {error && <p style={styles.error}>{error}</p>}
      {message && <p style={styles.message}>{message}</p>}

      {/* Section to view current librarians */}
      <section style={styles.section}>
        <h2>Current Librarians</h2>
        {librarians.length === 0 ? (
          <p>No librarians found.</p>
        ) : (
          <ul style={styles.list}>
            {librarians.map((lib) => (
              <li key={lib._id} style={styles.listItem}>
                <div>
                  <strong>{lib.name}</strong> ({lib.email}) - Password: {lib.plainPassword}
                </div>
                <div>
                  <button onClick={() => handleEditLibrarian(lib)} style={styles.buttonEdit}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteLibrarian(lib._id)} style={styles.buttonDelete}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Section to add a new librarian or update an existing one */}
      <section style={styles.section}>
        {isUpdating ? (
          <>
            <h2>Update Librarian</h2>
            <form onSubmit={handleUpdateLibrarian} style={styles.form}>
              <input
                type="text"
                placeholder="Name"
                value={updateForm.name}
                onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                style={styles.input}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={updateForm.email}
                onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button}>
                Update Librarian
              </button>
              <button
                type="button"
                onClick={() => setIsUpdating(false)}
                style={styles.buttonCancel}
              >
                Cancel
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Add New Librarian</h2>
            <form onSubmit={handleAddLibrarian} style={styles.form}>
              <input
                type="text"
                placeholder="Name"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                style={styles.input}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button}>
                Add Librarian
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
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
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '1rem',
    marginBottom: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1rem',
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
    marginTop: '1rem',
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
};

export default AdminDashboard;
