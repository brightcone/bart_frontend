import React from 'react';

const styles = {
    sidebar: {
        width: '0',
        transition: 'width 0.3s',
        position: 'fixed',
        top: '0',
        left: '300px', // Adjust based on your layout
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '-4px 0 10px rgba(0,0,0,0.2)', // Enhanced shadow for card effect
        borderRadius: '8px', // Rounded corners for card effect
        overflowY: 'auto', // Ensure scrolling if content overflows
        zIndex: 1000, // Ensure it appears on top
        borderRight: '3px solid #ddd', // Added right border for emphasis
    },
    sidebarOpen: {
        width: '280px', // Adjust width as needed
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
        transition: 'background-color 0.3s', // Smooth transition for hover effect
        cursor: 'pointer',
    },
    cardHover: {
        backgroundColor: '#f4f4f4', // Lighter background on hover
    },
    cardContent: {
        fontSize: '16px',
        color: '#333', // Darker text color for better contrast
    },
};

const TicketsSidebar = ({ isOpen }) => {
    return (
        <div
            style={{
                ...styles.sidebar,
                ...(isOpen ? styles.sidebarOpen : {}),
            }}
        >
            <h2 style={styles.heading}>Tickets</h2>
            <ul style={styles.list}>
                <li style={styles.card}>
                    <div style={styles.cardContent}>Ticket 1</div>
                </li>
                <li style={styles.card}>
                    <div style={styles.cardContent}>Ticket 2</div>
                </li>
                <li style={styles.card}>
                    <div style={styles.cardContent}>Ticket 3</div>
                </li>
                {/* Add more ticket items as needed */}
            </ul>
        </div>
    );
};

export default TicketsSidebar;
