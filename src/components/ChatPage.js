// ChatPage.js
import React from 'react';
import ChatInput from './ChatInput'; // Import the ChatInput component

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f5f5f5', // Light gray background to match the layout
    },
    content: {
        flexGrow: 1,
        padding: '20px',
        overflowY: 'auto',
        backgroundColor: '#fff', // White background for chat content
        borderRadius: '15px 15px 0 0', // Rounded corners at the top
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for elevation
    },
    chatInputWrapper: {
        padding: '10px', // Padding around the input area
        backgroundColor: '#fff', // White background to match the content area
        borderRadius: '0 0 15px 15px', // Rounded corners at the bottom
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for elevation
    },
};

const ChatPage = () => {
    return (
        <div style={styles.pageContainer}>
            <div style={styles.content}>
                {/* Chat content will go here */}
                <p>Start chatting here...</p> {/* Placeholder for chat history */}
            </div>
            <div style={styles.chatInputWrapper}>
                <ChatInput /> {/* Chat input at the bottom */}
            </div>
        </div>
    );
};

export default ChatPage;
