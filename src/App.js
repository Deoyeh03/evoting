import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import './App.css';
import UserDashboard from './pages/user/dashboard';
import Voting from './pages/user/voting';
import VoteForPosition from './pages/user/VoteForPosition'; 
import Home from './pages/Home';
import AdminDashboard from './pages/admin/AdminDashboard';

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase'; // Import the auth instance
import AdminAuth from './pages/admin/AdminAuth';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminLogin = () => {
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdmin(true); // Set admin to true if user is logged in
      } else {
        setIsAdmin(false); // Set admin to false if user is logged out
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Userdashboard" element={<UserDashboard />} />
          <Route path="/Voting" element={<Voting />} />
          <Route path="/vote/:positionId" element={<VoteForPosition />} />

          {/* Admin Auth route */}
          <Route 
            path="/admin" 
            element={isAdmin ? <AdminDashboard onLogout={handleAdminLogout} /> : <Navigate to="/admin-auth" />} 
          /> 
          
          {/* Admin authentication route */}
          <Route 
            path="/admin-auth" 
            element={<AdminAuth onLogin={handleAdminLogin} />} 
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
