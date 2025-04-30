// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1>404 - Page Not Found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/" style={styles.link}>Go back Home</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '2rem',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '1.2rem',
  },
};

export default NotFound;
