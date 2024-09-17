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
import PrivateRoute from './components/PrivateRoute';

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     () => JSON.parse(localStorage.getItem('isAuthenticated')) || false
//   );

//   useEffect(() => {
//     localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
//   }, [isAuthenticated]);

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem('isAuthenticated');
//   };

//   return (
//     <UserProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
//           <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
//           <Route path="/signup" element={<SignupForm onSignup={() => <Navigate to="/login" />} />} />
          
//           {/* Protected Routes */}
//           <Route path="/dashboard" element={
//             <PrivateRoute isAuthenticated={isAuthenticated}>
//               <Dashboard onLogout={handleLogout} />
//             </PrivateRoute>
//           } />
//           <Route path="/history" element={
//             <PrivateRoute isAuthenticated={isAuthenticated}>
//               <History />
//             </PrivateRoute>
//           } />
//           <Route path="/tickets" element={
//             <PrivateRoute isAuthenticated={isAuthenticated}>
//               <Ticket />
//             </PrivateRoute>
//           } />
//           <Route path="/search" element={
//             <PrivateRoute isAuthenticated={isAuthenticated}>
//               <Search />
//             </PrivateRoute>
//           } />
//           <Route path="/agent" element={
//             <PrivateRoute isAuthenticated={isAuthenticated}>
//               <Agent />
//             </PrivateRoute>
//           } />
//           <Route path="/settings" element={
//             <PrivateRoute isAuthenticated={isAuthenticated}>
//               <Settings />
//             </PrivateRoute>
//           } />
//           <Route path="/templates" element={
//             <PrivateRoute isAuthenticated={isAuthenticated}>
//               <SuggestedTemplates />
//             </PrivateRoute>
//           } />
//           <Route path="/jira_agent" element={
//             <PrivateRoute isAuthenticated={isAuthenticated}>
//               <Jira_Agent />
//             </PrivateRoute>
//           } />
//           <Route path="/knowledgebase" element={
//             <PrivateRoute isAuthenticated={isAuthenticated}>
//               <Knowledgebase />
//             </PrivateRoute>
//           } />
//           <Route path="/managinghardware" element={
//             <PrivateRoute isAuthenticated={isAuthenticated}>
//               <Managinghardware />
//             </PrivateRoute>
//           } />
//         </Routes>
//       </Router>
//     </UserProvider>
//   );
// };

// export default App;

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


