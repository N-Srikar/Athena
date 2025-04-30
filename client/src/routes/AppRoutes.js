// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import LibrarianDashboard from '../pages/dashboards/LibrarianDashboard';
import StudentDashboard from '../pages/dashboards/StudentDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />

      {/* Dashboard Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/librarian" element={<LibrarianDashboard />} />
      <Route path="/student" element={<StudentDashboard />} />

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
