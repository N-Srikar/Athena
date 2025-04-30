// src/components/auth/LoginForm.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthContext from '../../contexts/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // default to member
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/auth/login', { email, password });
      // Assuming the token is returned in res.data.token and user role is determined by our selection
      localStorage.setItem('token', res.data.token);
      // Store user info based on selected role (for demo, we use role from form selection)
      login({ email, role });
      // Redirect based on selected role
      if (role === 'admin') navigate('/admin');
      else if (role === 'librarian') navigate('/librarian');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
          <option value="admin">Admin</option>
          <option value="librarian">Librarian</option>
          <option value="member">Student</option>
        </select>
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
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
  error: {
    color: 'red',
  },
};

export default LoginForm;
