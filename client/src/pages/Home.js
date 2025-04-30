// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to the Library Management System</h1>
      <div style={styles.section}>
        <Link to="/login" style={styles.link}>Login</Link>
      </div>
      <div style={styles.section}>
        <Link to="/signup" style={styles.link}>Sign Up (Students Only)</Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '2rem',
  },
  section: {
    margin: '1rem 0',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '1.2rem',
  },
};

export default Home;
