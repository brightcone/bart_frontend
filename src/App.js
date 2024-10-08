import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignupForm from './pages/SignupForm';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Agent from './pages/Agent';
import History from './pages/History';
import Settings from './pages/Settings';
import Ticket from './pages/Ticket';
import Search from './pages/Search';
import SuggestedTemplates from './pages/SuggestedTemplates';
import Jira_Agent from './pages/Jira_Agent';
import Knowledgebase from './pages/Knowledgebase';
import Managinghardware from './pages/Managinghardware';
import { UserProvider } from './components/UserContext'; 
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 
  const handleLogout = () => {
    setIsAuthenticated(false);  
   
  };

  return (
    <UserProvider>  
      <Router>
        <Routes>
   
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignupForm onSignup={() => <Navigate to="/login" />} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
          <Route path="/tickets" element={isAuthenticated ? <Ticket /> : <Navigate to="/login" />} />
          <Route path="/search" element={isAuthenticated ? <Search /> : <Navigate to="/login" />} />
          <Route path="/agent" element={isAuthenticated ? <Agent /> : <Navigate to="/login" />}/>
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/templates" element={isAuthenticated ? <SuggestedTemplates /> : <Navigate to="/login" />} />
          <Route path="/jira_agent" element={isAuthenticated ? <Jira_Agent /> : <Navigate to="/login" />} />
          <Route path="/knowledgebase" element={isAuthenticated ? <Knowledgebase /> : <Navigate to="/login" />} />
          <Route path="/managinghardware" element={isAuthenticated ? <Managinghardware /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;


