import React from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from '../components/TemplateCard'; // Reusing TemplateCard component from the Dashboard
import PasswordResetSVG from '../assets/Frame 2147226995.svg';
import RequestNewEquipmentSVG from '../assets/Frame 2147226995-1.svg';
import ManageHardwareSVG from '../assets/Frame 2147226998.svg';
import InstallNewSoftwareSVG from '../assets/Frame 2147226998-1.svg';
import WiFiSetupSVG from '../assets/Frame 2147226995-2.svg';
import ScheduleMaintenanceSVG from '../assets/Frame 2147226995-3.svg';

const styles = {
    sidebar: {
        width: '0',
        transition: 'width 0.3s',
        position: 'fixed',
        top: '0',
        left: '300px', // Adjust if needed to align next to the existing sidebar
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)', // Shadow effect to cover space
        borderRadius: '0', // Remove rounded corners for full-space effect
        overflowY: 'auto', // Ensure scrolling if content overflows
        zIndex: 1000, // Ensure it appears on top
        borderRight: 'none', // Remove right border for full-space effect
    },
    sidebarOpen: {
        width: 'calc(100% - 300px)',
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
   templates: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    padding: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    maxWidth: '750px',
  }
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
      prompt: 'Hey there, I need to reset my password'
    },
    {
      title: 'Draft and Send an email',
      description: 'Drafting and Sending an emails.',
      icon: (
        <img
          src={RequestNewEquipmentSVG}
          alt="Draft and Send an email"
          style={{ width: '30px', height: '30px', marginRight: '10px' }}
        />
      ),
      link: '/agent',
      prompt: 'Hi, I want to draft and send an email.'
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
      prompt: 'Hi, I want to summarize a piece of text.'
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
      prompt: 'Please help me reset my project management tools password.'
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
      prompt: 'Please help me to handle my hardware issues.'
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
      prompt: 'Hey, I need to raise a JIRA ticket.'
    }
];

const TemplatesSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
  
    const handleClick = (link, prompt) => {
      navigate(link, { state: { initialPrompt: prompt } });
      onClose(); // Close the sidebar when navigating
    };

    return (
        <div
            style={{
                ...styles.sidebar,
                ...(isOpen ? styles.sidebarOpen : {}),
            }}
        >

<div style={styles.templates}>
        <h2 style={styles.heading}>Suggested Templates</h2>
        {templates.map((template, index) => (
          <TemplateCard
            key={index}
            title={template.title}
            description={template.description}
            icon={template.icon}
            onClick={() => handleClick(template.link, template.prompt)}
          />
        ))}
      </div>
        </div>
    );
};

export default TemplatesSidebar;
