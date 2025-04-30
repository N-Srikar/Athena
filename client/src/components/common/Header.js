// src/components/common/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Library Management System</h1>
      <nav>
        <Link to="/" style={styles.link}>Home</Link>
        {!user && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </>
        )}
        {user && (
          <>
            {user.role === 'admin' && <Link to="/admin" style={styles.link}>Admin Dashboard</Link>}
            {user.role === 'librarian' && <Link to="/librarian" style={styles.link}>Librarian Dashboard</Link>}
            {user.role === 'member' && <Link to="/student" style={styles.link}>Student Dashboard</Link>}
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    background: '#007bff',
    color: '#fff',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    margin: 0,
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '1rem',
  },
  button: {
    marginLeft: '1rem',
    padding: '0.5rem 1rem',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Header;
