import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import TemplatesSidebar from './components/TemplatesSidebar';
import TicketsSidebar from './components/TicketsSidebar';
import NewChatSidebar from './components/NewChatSidebar';
import SearchSidebar from './components/SearchSidebar';
import Agent from './pages/Agent';
import ChatPage from './components/ChatPage';
import HistoryPage from './components/HistoryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FacialAuthComponent from './components/FacialAuthComponent';

const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
  },
  sidebarContainer: {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '100%',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    width: '280px',
  },
  mainContent: {
    flexGrow: 1,
    padding: '20px',
    height: '100%',
    overflow: 'auto',
    marginLeft: '300px',
    transition: 'margin-left 0.3s',
  },
  fullScreenContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundImage: 'url(/path/to/background-image.jpg)', // Update the path to your background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  authCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // More opaque background
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '400px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sidebar: {
    width: '0',
    height: '100%',
    backgroundColor: 'black',
    zIndex: 1000,
    position: 'absolute',
    top: '0',
    left: '0',
  },
  sidebarOpen: {
    width: '280px',
  },
};

const AppWrapper = ({ children, isAuthenticated }) => {
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup') {
      window.location.href = '/login';
    }
  }, [isAuthenticated, location]);

  return children;
};

const App = () => {
  const [activeSidebar, setActiveSidebar] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const toggleSidebar = (sidebarName) => {
    setActiveSidebar((prevSidebar) => (prevSidebar === sidebarName ? null : sidebarName));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveSidebar(null); // Close any open sidebar
  };
  const isAnySidebarOpen = Boolean(activeSidebar);

  return (
    <Router>
      <AppWrapper isAuthenticated={isAuthenticated}>
        <div style={styles.app}>
          {isAuthenticated ? (
            <>
              <div style={styles.sidebarContainer}>
                <Sidebar
                  toggleTemplates={() => toggleSidebar('Templates')}
                  toggleNewChat={() => toggleSidebar('NewChat')}
                  toggleSearch={() => toggleSidebar('Search')}
                  toggleHistory={() => toggleSidebar('History')}
                  toggleTickets={() => toggleSidebar('Tickets')}
                  onLogout={handleLogout} // Pass logout handler to Sidebar
                />
                <TemplatesSidebar
                  isOpen={activeSidebar === 'Templates'}
                  style={{
                    ...styles.sidebar,
                    ...(activeSidebar === 'Templates' ? styles.sidebarOpen : {}),
                  }}
                />
                <NewChatSidebar
                  isOpen={activeSidebar === 'NewChat'}
                  style={{
                    ...styles.sidebar,
                    ...(activeSidebar === 'NewChat' ? styles.sidebarOpen : {}),
                  }}
                />
                <SearchSidebar
                  isOpen={activeSidebar === 'Search'}
                  style={{
                    ...styles.sidebar,
                    ...(activeSidebar === 'Search' ? styles.sidebarOpen : {}),
                  }}
                />
                <TicketsSidebar
                  isOpen={activeSidebar === 'Tickets'}
                  style={{
                    ...styles.sidebar,
                    ...(activeSidebar === 'Tickets' ? styles.sidebarOpen : {}),
                  }}
                />
              </div>
              <div style={{ ...styles.mainContent, marginLeft: isAuthenticated ? '300px' : '0' }}>
                <Routes>
                  <Route path="/" element={<Dashboard isAnySidebarOpen={isAnySidebarOpen} />} />
                  <Route path="/agent" element={<Agent />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/facial-auth" element={<FacialAuthComponent />} />
                  <Route path="*" element={<Navigate to="/" />} />

                </Routes>
              </div>
            </>
          ) : (
            <div style={styles.fullScreenContainer}>
              <div style={styles.authCard}>
                <Routes>
                  <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </div>
            </div>
          )}
        </div>
      </AppWrapper>
    </Router>
  );
};

export default App;
