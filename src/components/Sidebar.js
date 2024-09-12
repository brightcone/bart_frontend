import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import profileImage from '../assets/image 44.svg';
import trainLogo from '../assets/trainLogo.png';
import SearchSVG from '../assets/magnifying-glass.svg'; // Example SVGs
import TemplatesSVG from '../assets/circles-four.svg';
import HistorySVG from '../assets/clock-counter-clockwise.svg';
import TicketsSVG from '../assets/file.svg';
import SettingsSVG from '../assets/gear-six.svg';
import PlusSVG from '../assets/plus.svg';

const styles = {
  sidebar: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '250px',
    backgroundColor: '#fff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh',
    zIndex: 4,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '15px',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
  },
  profileImage: {
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    marginRight: '15px',
  },
  profileText: {
    display: 'flex',
    flexDirection: 'column',
  },
  profileHeading: {
    margin: '0',
    fontSize: '18px',
    color: 'black',
  },
  profileParagraph: {
    margin: '5px 0 0',
    color: '#666',
  },
  navList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  },
  navItem: {
    margin: '10px 0',
    borderRadius: '15px',
    transition: 'background-color 0.3s, color 0.3s',
  },
  navItemHovered: {
    backgroundColor: '#f0f0f0',
  },
  navLink: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none',
    padding: '10px 15px',
    color: '#333',
  },
  text: {
    fontSize: '16px',
    fontWeight: '500',
  },
  icon: {
    width: '24px',
    height: '24px',
  },
  bottomSection: {
    marginTop: '0px', // Ensure there's no margin-top
    paddingTop: '0px', // Ensure there's no padding-top
    marginBottom: '25px', // Ensure there's no margin-bottom
  },
  trainCard: {
    marginTop: '0px', // Remove margin-top to eliminate space above
    padding: '10px',
    backgroundColor: '#f8f8f8',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  },
  trainInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  trainLogo: {
    width: '40px',
    height: '54px',
    marginRight: '10px',
  },
};

const Sidebar = ({ toggleTemplates, toggleSearch, toggleHistory, toggleTickets }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();

  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleNavClick = (section) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }

    switch (section) {
      case 'templates':
        toggleTemplates();
        break;
      case 'search':
        toggleSearch();
        break;
      case 'history':
        toggleHistory();
        break;
      case 'tickets':
        toggleTickets();
        break;
      default:
        // Close all open sections
        if (openSection) {
          switch (openSection) {
            case 'templates':
              toggleTemplates();
              break;
            case 'search':
              toggleSearch();
              break;
            case 'history':
              toggleHistory();
              break;
            case 'tickets':
              toggleTickets();
              break;
          }
          setOpenSection(null);
        }
    }
  };

  return (
    <div style={styles.sidebar}>
      <div>
        <NavLink to="/dashboard" style={{ textDecoration: 'none' }} onClick={() => handleNavClick('profile')}>
          <div style={styles.profile}>
            <img
              src={trainLogo}
              alt="BART Logo"
              style={styles.trainLogo}
            />
            <div style={styles.profileText}>
              <h4 style={styles.profileHeading}>BARTGenie</h4>
            </div>
          </div>
        </NavLink>
        <nav>
          <ul style={styles.navList}>
            <li
              style={{
                ...styles.navItem,
                ...(hoveredItem === 'newChat' ? styles.navItemHovered : {}),
              }}
              onMouseEnter={() => handleMouseEnter('newChat')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/dashboard" style={styles.navLink} onClick={() => handleNavClick('newChat')}>
                <span style={styles.text}>New Chat</span>
                <img src={PlusSVG} alt="New Chat" style={styles.icon} />
              </NavLink>
            </li>
            <li
              style={{
                ...styles.navItem,
                ...(hoveredItem === 'search' ? styles.navItemHovered : {}),
              }}
              onMouseEnter={() => handleMouseEnter('search')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/search" style={styles.navLink} onClick={() => handleNavClick('search')}>
                <span style={styles.text}>Search</span>
                <img src={SearchSVG} alt="Search" style={styles.icon} />
              </NavLink>
            </li>
            <li
              style={{
                ...styles.navItem,
                ...(hoveredItem === 'templates' ? styles.navItemHovered : {}),
              }}
              onMouseEnter={() => handleMouseEnter('templates')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="#" style={styles.navLink} onClick={() => handleNavClick('templates')}>
                <span style={styles.text}>Templates</span>
                <img src={TemplatesSVG} alt="Templates" style={styles.icon} />
              </NavLink>
            </li>
            <li
              style={{
                ...styles.navItem,
                ...(hoveredItem === 'history' ? styles.navItemHovered : {}),
              }}
              onMouseEnter={() => handleMouseEnter('history')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/history" style={styles.navLink} onClick={() => handleNavClick('history')}>
                <span style={styles.text}>History</span>
                <img src={HistorySVG} alt="History" style={styles.icon} />
              </NavLink>
            </li>
            <li
              style={{
                ...styles.navItem,
                ...(hoveredItem === 'tickets' ? styles.navItemHovered : {}),
              }}
              onMouseEnter={() => handleMouseEnter('tickets')}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink to="/tickets" style={styles.navLink} onClick={() => handleNavClick('tickets')}>
                <span style={styles.text}>Tickets</span>
                <img src={TicketsSVG} alt="Tickets" style={styles.icon} />
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div style={styles.bottomSection}>
        <div
          style={{
            ...styles.navItem,
            ...(hoveredItem === 'settings' ? styles.navItemHovered : {}),
          }}
          onMouseEnter={() => handleMouseEnter('settings')}
          onMouseLeave={handleMouseLeave}
        >
          <NavLink to="#" style={styles.navLink} onClick={() => handleNavClick('settings')}>
            <span style={styles.text}>Settings</span>
            <img src={SettingsSVG} alt="Settings" style={styles.icon} />
          </NavLink>
        </div>
        <div style={styles.trainCard}>
          <div style={styles.trainInfo}>
            <img
              src={trainLogo}
              alt="BART Logo"
              style={styles.trainLogo}
            />
            <div>
              <p style={styles.profileParagraph}><strong>BART</strong></p>
              <p style={styles.profileParagraph}>Bay Area Rapid Transit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;