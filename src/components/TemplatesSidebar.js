import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
    sidebar: {
        width: '0',
        transition: 'width 0.3s',
        position: 'fixed',
        top: '0',
        left: '300px', // Align it immediately next to the Sidebar
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '-4px 0 10px rgba(0,0,0,0.2)', // Enhanced shadow for card effect
        borderRadius: '8px', // Rounded corners for card effect
        overflowY: 'auto', // Ensure scrolling if content overflows
        zIndex: 1000, // Ensure it appears on top
        borderRight: '3px solid #ddd', // Added right border for emphasis
    },
    sidebarOpen: {
        width: '300px',
    },
    heading: {
        padding: '20px',
        borderBottom: '2px solid #ddd', // Slightly thicker border for emphasis
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333', // Darker color for better contrast
    },
    list: {
        listStyle: 'none',
        padding: '0',
        margin: '0', // Remove default margin
    },
    card: {
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Card shadow effect
        borderRadius: '8px', // Rounded corners for card effect
        margin: '15px', // Spacing between cards
        padding: '15px', // Padding inside the card
        display: 'flex',
        alignItems: 'flex-start',
        transition: 'background-color 0.3s', // Smooth transition for hover effect
        cursor: 'pointer',
    },
    cardHover: {
        backgroundColor: '#f4f4f4', // Lighter background on hover
    },
    icon: {
        fontSize: '24px',
        marginRight: '15px',
    },
    text: {
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontSize: '16px',
        fontWeight: 'bold',
    },
    description: {
        fontSize: '14px',
        color: '#666',
    },
};

const templates = [
    { title: 'WiFi Setup', description: 'Detect and fix WiFi issues with real-time support.', icon: '📡', link: '/wifi-setup' },
    { title: 'Install New Software', description: 'Install software with guided instructions and ticket updates.', icon: '🖥️', link: '/install-new-software' },
    { title: 'Schedule Maintenance', description: 'Schedule equipment maintenance effortlessly.', icon: '🛠️', link: '/schedule-maintenance' },
    { title: 'Password Reset', description: 'Quickly reset your application passwords with ease.', icon: '🔒', link: '/password-reset' },
    { title: 'Manage Hardware', description: 'Setup, maintain, and troubleshoot all your devices.', icon: '💻', link: '/manage-hardware' },
    { title: 'Request New Equipment', description: 'Seamlessly request and track new equipment approvals.', icon: '📱', link: '/request-new-equipment' },
];

const TemplatesSidebar = ({ isOpen }) => (
    <div
        style={{
            ...styles.sidebar,
            ...(isOpen ? styles.sidebarOpen : {}),
        }}
    >
        <h2 style={styles.heading}>Templates</h2>
        <ul style={styles.list}>
            {templates.map((template, index) => (
                <li
                    key={index}
                    style={styles.card}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.cardHover.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.card.backgroundColor}
                >
                    <span style={styles.icon}>{template.icon}</span>
                    <Link to={template.link} style={styles.text}>
                        <div style={styles.title}>{template.title}</div>
                        <div style={styles.description}>{template.description}</div>
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

export default TemplatesSidebar;
