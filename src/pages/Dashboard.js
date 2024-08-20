import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from '../components/TemplateCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PasswordResetSVG from '../assets/Frame 2147226995.svg';
import RequestNewEquipmentSVG from '../assets/Frame 2147226995-1.svg';
import ManageHardwareSVG from '../assets/Frame 2147226998.svg';
import InstallNewSoftwareSVG from '../assets/Frame 2147226998-1.svg';
import WiFiSetupSVG from '../assets/Frame 2147226995-2.svg';
import ScheduleMaintenanceSVG from '../assets/Frame 2147226995-3.svg';
import PlusSVG from '../assets/plus.svg';
import SendSVG from '../assets/arrow-up-right.svg';

const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    paddingLeft: '250px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // To align items between header and footer
  },
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Align items to the center
    width: '100%',
    padding: '0px 20px 20px 0px',
    transition: 'filter 0.7s ease',
    zIndex: 1,
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '20px',
    color: 'lightgray',
    gridColumn: 'span 2', // Span across both columns
    marginBottom: '20px', // Add margin to separate from grid items
  },
  userIcon: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '24px',
    cursor: 'pointer',
  },
  profileCard: {
    position: 'absolute',
    top: '60px',
    right: '20px',
    width: '200px',
    padding: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    zIndex: 2,
  },
  logoutButton: {
    backgroundColor: 'gray',
    color: 'black',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center',
  },
  templates: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    maxWidth: '750px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  chatInputContainer: {
    width: 'calc(100% - 50px)', // Extend to the left and right ends
    display: 'flex',
    justifyContent: 'center',
    padding: '5px',
    backgroundColor: '#fff',
  },
  chatInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '850px',
    borderRadius: '30px',
    padding: '8px 15px',
    backgroundColor: '#f8f8f8',
  },
  chatInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '10px',
    borderRadius: '30px',
    fontSize: '16px',
    backgroundColor: 'transparent',
  },
  chatButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  icon: {
    width: '24px', // Adjust size of the icon
    height: '24px',
  },
  PasswordResetSVG: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  },
  RequestNewEquipmentSVG: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  },
  ManageHardwareSVG: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  },
  InstallNewSoftwareSVG: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  },
  WiFiSetupSVG: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  },
  ScheduleMaintenanceSVG: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  },
};

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [isProfileCardVisible, setProfileCardVisible] = useState(false);
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleAttachFile = () => {
    console.log('Attachment button clicked');
    // Handle file attachment logic
  };
  const handleProfileIconClick = () => {
    setProfileCardVisible(!isProfileCardVisible);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login'); // Redirect to the login page
    window.location.reload(); // Ensures all state is reset, and sidebar is not shown
  };

  const templates = [
    {
      title: 'Password Reset',
      description: 'Quickly reset your application passwords with ease.',
      icon: (
        <img
          src={PasswordResetSVG}
          alt="Password Reset"
          style={{ width: '30px', height: '30px', marginRight: '10px' }}
        />
      ),
      link: '/agent',
      prompt: 'Please help me reset my email password.' // Use the appropriate prompt
    },

    {
      title: 'Draft and Send an email ',
      description: 'Drafting and Sending an emails.',
      icon: (
        <img
          src={RequestNewEquipmentSVG}
          alt="Draft and Send an email"
          style={{ width: '30px', height: '30px', marginRight: '10px' }}
        />
      ),
      link: '/agent',
      prompt: 'Hi, I want to draft and send an email.' // Use the appropriate prompt
    },

    {
      title: 'Summarize Text',
      description: 'Here you can summarize any context.',
      icon: (
        <img
          src={ManageHardwareSVG}
          alt="Summarize Text"
          style={{ width: '30px', height: '30px', marginRight: '10px' }}
        />
      ),
      link: '/agent',
      prompt: 'Hi, I want to summarize a piece of text.' // Use the appropriate prompt
    },
    {
      title: 'Install New Software',
      description: 'Install software with guided instructions and ticket updates.',
      icon: (
        <img
          src={InstallNewSoftwareSVG}
          alt="Install New Software"
          style={{ width: '30px', height: '30px', marginRight: '10px' }}
        />
      ),
      link: '/agent',
      prompt: 'Please help me reset my project management tools password.' // Use the appropriate prompt
    },

    {
      title: 'Manage Hardware',
      description: 'Setup, maintain, and troubleshoot all your devices.',
      icon: (
        <img
          src={ManageHardwareSVG}
          alt="Manage Hardware"
          style={{ width: '30px', height: '30px', marginRight: '10px' }}
        />
      ),
      link: '/agent',
      prompt: 'Please help me to handle my hardware issues.' // Use the appropriate prompt
    },


    {
      title: 'Raise a JIRA Ticket',
      description: 'Here you can raise any ticket.',
      icon: (
        <img
          src={ScheduleMaintenanceSVG}
          alt="Raise a JIRA Ticket"
          style={{ width: '30px', height: '30px', marginRight: '10px' }}
        />
      ),
      link: '/agent',
      prompt: 'Hey, I need to raise a JIRA ticket.' // Leave empty if not needed
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.dashboard}>
        <FontAwesomeIcon
          icon={faUser}
          style={styles.userIcon}
          onClick={handleProfileIconClick}
        />
        {isProfileCardVisible && (
          <div style={styles.profileCard}>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
        <h2 style={styles.heading}>Suggested Templates</h2>
        <div style={styles.templates}>
          {templates.map((template, index) => (
            <TemplateCard
              key={index}
              {...template}
              onClick={() => navigate(template.link, { state: { initialPrompt: template.prompt } })}
            />
          ))}
        </div>
      </div>
      <div style={styles.chatInputContainer}>
        <div style={styles.chatInputWrapper}>
          <button style={styles.chatButton} onClick={handleAttachFile}>
            <img src={PlusSVG} alt="Attach File" style={styles.icon} />
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.chatInput}
          />
          <button style={styles.chatButton} onClick={handleSendMessage}>
            <img src={SendSVG} alt="Send Message" style={styles.icon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
