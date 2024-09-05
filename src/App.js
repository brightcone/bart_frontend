import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignupForm from './pages/SignupForm';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Agent from './pages/Agent';
import History from './pages/History';
import Settings from './pages/Settings'
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/agent" />} />
        <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/agent" />} />
        <Route path="/agent" element={isAuthenticated ? <Agent /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/agent" />} />
      </Routes>
    </Router>
  );
};

export default App;
