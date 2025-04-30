// src/components/common/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Library Management System</p>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#f1f1f1',
    textAlign: 'center',
    padding: '1rem',
    marginTop: '2rem',
  },
};

export default Footer;
