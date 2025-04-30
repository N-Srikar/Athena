// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

const App = () => {
  return (
    <Router>
      <Header />
      <main style={{ minHeight: '80vh' }}>
        <AppRoutes />
      </main>
      <Footer />
    </Router>
  );
};

export default App;
