import React from 'react';

const styles = {
    sidebar: {
        width: '0',
        transition: 'width 0.3s',
        position: 'fixed',
        top: '0',
        left: '300px', // Align it immediately next to the Sidebar
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        zIndex: 1000, // Ensure it's on top
    },
    sidebarOpen: {
        width: '250px',
    },
    heading: {
        padding: '20px',
        borderBottom: '1px solid #ddd',
    },
    list: {
        listStyle: 'none',
        padding: '0',
    },
    listItem: {
        padding: '15px 20px',
        borderBottom: '1px solid #ddd',
        cursor: 'pointer',
    },
    listItemHover: {
        backgroundColor: '#f4f4f4',
    },
};

const NewChatSidebar = ({ isOpen }) => {
    return (
        <div
            style={{
                ...styles.sidebar,
                ...(isOpen ? styles.sidebarOpen : {}),
            }}
        >
            <h2 style={styles.heading}>New Chat</h2>
            <ul style={styles.list}>
                {/* Add New Chat specific items here */}
                <li style={styles.listItem}>Chat Overview</li>
                <li style={styles.listItem}>Create New Chat</li>
                <li style={styles.listItem}>Chat Settings</li>
            </ul>
        </div>
    );
};

export default NewChatSidebar;
