// components/Auth/AdminAuth.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

// Hardcoded admin credentials
const validCredentials = {
  email: 'admin2@gmail.com',
  password: 'admin1234',
};

// Hardcoded token
const validToken = '12as34wryt';

const AdminAuth = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Reset error on new submission

    // Check if the provided credentials and token match
    if (email === validCredentials.email && password === validCredentials.password && token === validToken) {
      onLogin(); 
      navigate('/admin'); 
    } else {
      setError("Invalid credentials or token. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h1>Admin Login</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Token" 
          value={token} 
          onChange={(e) => setToken(e.target.value)} 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminAuth;
