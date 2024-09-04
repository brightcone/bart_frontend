import React, { useState } from 'react';
import PlusSVG from '../assets/plus.svg'; // Import your SVG image for the attach button
import SendSVG from '../assets/arrow-up-right.svg'; // Import your SVG image for the send button

const styles = {
    chatContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '5px',
        backgroundColor: '#fff',
        bottompadding: '50px',
    },
    chatInputWrapper: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '850px',
        borderRadius: '30px',
        padding: '8px 15px',
        backgroundColor: '#f8f8f8',
        border: '2px solid #e0e0e0', // Add border for distinction
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow for depth
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
        background: 'none', // No background for attach button
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        marginLeft: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatButtonSend: {
        background: 'transparent', // Transparent background for circular button
        border: '2px solid #f8f8f8', // Border color for circular button
        borderRadius: '50%', // Make the button circular
        cursor: 'pointer',
        padding: '5px', // Padding inside the button
        marginLeft: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: '20px', // Adjust size of the icon
        height: '20px',
        fill: '#007bff', // Icon color to match the border
    },
};

// const ChatInput = ({ onSend, isLoading }) => {
//     const [input, setInput] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!isLoading && input.trim()) {
//             onSend(input);
//             setInput('');
//         }
//     };
    const ChatInput = ({ onSend, isLoading, isOTPActive, isTyping, onStop }) => {
    const [input, setInput] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (isTyping) {
        onStop();
      } else if (!isLoading && input.trim()) {
        onSend(input);
        setInput('');
      }
    };  

 
    const handleAttachFile = () => {
        console.log('Attachment button clicked');
        // Handle file attachment logic
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
    };


    return (
        <div style={styles.chatContainer}>
            <div style={styles.chatInputWrapper}>
                <button style={styles.chatButton} onClick={handleAttachFile}>
                    <img src={PlusSVG} alt="Attach File" style={styles.icon} />
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown} // Add onKeyDown handler here
                    placeholder="Type your message..."
                    style={styles.chatInput}
                />
                <button style={styles.chatButtonSend} onClick={handleSubmit} disabled={isLoading}>
                    <img src={SendSVG} alt="Send Message" style={styles.icon} />
                </button>

                <button 
                        style={styles.chatButton} 
                        onClick={handleSubmit} 
                        disabled={isLoading || isOTPActive}
                    >
                        <img 
                        src={require('../assets/' + (isTyping ? 'stop.svg' : 'arrow-up-right.svg')).default} 
                        alt={isTyping ? "Stop" : "Send Message"} 
                        style={styles.icon} 
                        />
              </button>
            </div>
        </div>
    );
};

export default ChatInput;