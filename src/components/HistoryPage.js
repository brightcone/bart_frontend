import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Kolkata'); 

const HistoryPage = () => {
    const [messagesBySession, setMessagesBySession] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedSessions, setExpandedSessions] = useState({});

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const username = localStorage.getItem('username');
            const password = localStorage.getItem('password');

            if (!username || !password) {
                throw new Error('Username or password not found in localStorage');
            }

            const response = await axios.get(
                `https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat?username=${username}&password=${password}`
            );

            const parsedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

            const groupedMessages = parsedData.reduce((acc, message) => {
                if (!acc[message.sessionId]) {
                    acc[message.sessionId] = [];
                }
                if (message.Messages && Array.isArray(message.Messages)) {
                    acc[message.sessionId].push(...message.Messages);
                } else {
                    acc[message.sessionId].push(message);
                }
                return acc;
            }, {});

            // Sort sessions by the first message's timestamp in descending order (newest to oldest)
            const sortedSessions = Object.keys(groupedMessages).sort((a, b) => {
                const firstMessageA = groupedMessages[a][0];
                const firstMessageB = groupedMessages[b][0];
                return dayjs(firstMessageB.Timestamp).diff(dayjs(firstMessageA.Timestamp));
            });

            const sortedMessagesBySession = sortedSessions.reduce((acc, sessionId) => {
                acc[sessionId] = groupedMessages[sessionId];
                return acc;
            }, {});

            setMessagesBySession(sortedMessagesBySession);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    const generateSessionTitle = (messages) => {
        if (!messages || messages.length === 0) return 'Untitled Conversation';
        
        const userMessage = messages.find((msg) => msg.IsUserMessage);
        const contentPreview = userMessage ? userMessage.Message : 'Chat Conversation';

        return contentPreview.length > 50 ? `${contentPreview.substring(0, 50)}... `: contentPreview;
    };

    const toggleSessionExpansion = (sessionId) => {
        setExpandedSessions((prev) => ({
            ...prev,
            [sessionId]: !prev[sessionId],
        }));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            padding: '20px',
            backgroundColor: '#f4f4f4',
        }}>
            <h1 style={{ marginBottom: '20px' }}>Chat History</h1>
            <div style={{
                flex: 1,
                overflowY: 'auto',
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '20px',
            }}>
                {Object.keys(messagesBySession).length > 0 ? (
                    Object.keys(messagesBySession).map((sessionId) => {
                        const messages = messagesBySession[sessionId];
                        const sessionTitle = generateSessionTitle(messages);

                        return (
                            <div key={sessionId} style={{ marginBottom: '20px' }}>
                                <div
                                    style={{
                                        padding: '10px',
                                        backgroundColor: '#e0e0e0',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                    onClick={() => toggleSessionExpansion(sessionId)}
                                >
                                    <div>
                                        <strong>{sessionTitle}</strong>
                                    </div>
                                    <div>{expandedSessions[sessionId] ? '▼' : '▶'}</div>
                                </div>
                                {expandedSessions[sessionId] && (
                                    <div style={{ marginTop: '10px' }}>
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: msg.IsUserMessage ? 'flex-end' : 'flex-start',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        maxWidth: '60%',
                                                        padding: '10px',
                                                        borderRadius: '8px',
                                                        backgroundColor: msg.IsUserMessage ? '#001F3F' : '#f8f8f8',
                                                        color: msg.IsUserMessage ? '#fff' : '#000',
                                                        wordBreak: 'break-word'
                                                    }}
                                                >
                                                    <div style={{ fontSize: '12px', color: '#888' }}>
                                                        {dayjs.utc(msg.Timestamp) // Treat timestamp as UTC first
                                                            .tz('Asia/Kolkata') // Convert to IST
                                                            .format('YYYY-MM-DD HH:mm:ss')} {/* Explicitly format with IST */}
                                                    </div>
                                                    {msg.Message}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div>No messages found.</div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';

// const HistoryPage = () => {
//     const [messagesBySession, setMessagesBySession] = useState({});
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [expandedSessions, setExpandedSessions] = useState({});

//     useEffect(() => {
//         fetchMessages();
//     }, []);

//     const fetchMessages = async () => {
//         try {
//             const username = localStorage.getItem('username');
//             const password = localStorage.getItem('password');

//             if (!username || !password) {
//                 throw new Error('Username or password not found in localStorage');
//             }

//             const response = await axios.get(
//                 https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat?username=${username}&password=${password}
//             );

//             const parsedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

//             const groupedMessages = parsedData.reduce((acc, message) => {
//                 if (!acc[message.sessionId]) {
//                     acc[message.sessionId] = [];
//                 }
//                 if (message.Messages && Array.isArray(message.Messages)) {
//                     acc[message.sessionId].push(...message.Messages);
//                 } else {
//                     acc[message.sessionId].push(message);
//                 }
//                 return acc;
//             }, {});

//             setMessagesBySession(groupedMessages);
//             setIsLoading(false);
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//             setError(error.message);
//             setIsLoading(false);
//         }
//     };

//     const toggleSessionExpansion = (sessionId) => {
//         setExpandedSessions((prev) => ({
//             ...prev,
//             [sessionId]: !prev[sessionId],
//         }));
//     };

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             height: '100vh',
//             padding: '20px',
//             backgroundColor: '#f4f4f4',
//         }}>
//             <h1 style={{ marginBottom: '20px' }}>Chat History</h1>
//             <div style={{
//                 flex: 1,
//                 overflowY: 'auto',
//                 backgroundColor: '#fff',
//                 borderRadius: '8px',
//                 padding: '20px',
//             }}>
//                 {Object.keys(messagesBySession).length > 0 ? (
//                     Object.keys(messagesBySession).map((sessionId) => (
//                         <div key={sessionId} style={{ marginBottom: '20px' }}>
//                             <div
//                                 style={{
//                                     padding: '10px',
//                                     backgroundColor: '#e0e0e0',
//                                     borderRadius: '8px',
//                                     cursor: 'pointer',
//                                     display: 'flex',
//                                     justifyContent: 'space-between',
//                                     alignItems: 'center',
//                                 }}
//                                 onClick={() => toggleSessionExpansion(sessionId)}
//                             >
//                                 <div>
//                                     <strong>Session ID:</strong> {sessionId}
//                                 </div>
//                                 <div>{expandedSessions[sessionId] ? '▼' : '▶'}</div>
//                             </div>
//                             {expandedSessions[sessionId] && (
//                                 <div style={{ marginTop: '10px' }}>
//                                     {messagesBySession[sessionId].map((msg, index) => (
//                                         <div
//                                             key={index}
//                                             style={{
//                                                 display: 'flex',
//                                                 justifyContent: msg.IsUserMessage ? 'flex-end' : 'flex-start',
//                                                 marginBottom: '10px'
//                                             }}
//                                         >
//                                             <div
//                                                 style={{
//                                                     maxWidth: '60%',
//                                                     padding: '10px',
//                                                     borderRadius: '8px',
//                                                     backgroundColor: msg.IsUserMessage ? '#001F3F' : '#f8f8f8',
//                                                     color: msg.IsUserMessage ? '#fff' : '#000',
//                                                     wordBreak: 'break-word'
//                                                 }}
//                                             >
//                                                 <div style={{ fontSize: '12px', color: '#888' }}>
//                                                     {dayjs(msg.Timestamp).format('YYYY-MM-DD HH:mm:ss')}
//                                                 </div>
//                                                 {msg.Message}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     ))
//                 ) : (
//                     <div>No messages found.</div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default HistoryPage;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const HistoryPage = () => {
//     const [messages, setMessages] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchMessages();
//     }, []);

//     const fetchMessages = async () => {
//         try {
//             const username = localStorage.getItem('username');
//             const password = localStorage.getItem('password');
    
//             if (!username || !password) {
//                 throw new Error('Username or password not found in localStorage');
//             }
    
//             console.log('Fetching messages for:', username); // Log the username
    
//             const response = await axios.get(https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat?username=${username}&password=${password});
            
//             console.log('API response:', response.data); // Log the entire response
    
//             // Parse the response data if it's a string
//             const parsedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    
//             // Extract messages, considering nested structures
//             const flattenedMessages = parsedData.flatMap(item => {
//                 if (item.Messages && Array.isArray(item.Messages)) {
//                     return item.Messages;
//                 } else {
//                     return item;
//                 }
//             });

//             // Now, set the flattened messages array to state
//             setMessages(flattenedMessages);
//             setIsLoading(false);
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//             setError(error.message);
//             setIsLoading(false);
//         }
//     };
    
//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             height: '100vh',
//             padding: '20px',
//             backgroundColor: '#fff',
//         }}>
//             <h1 style={{ marginBottom: '20px' }}>Chat History</h1>
//             <div style={{
//                 flex: 1,
//                 overflowY: 'auto',
//                 backgroundColor: 'rgba(255, 255, 255, 0.8)',
//                 borderRadius: '8px',
//                 padding: '20px',
//             }}>
//                 {messages.length > 0 ? (
//                     messages.map((msg, index) => (
//                         <div key={index} style={{
//                             display: 'flex',
//                             justifyContent: msg.IsUserMessage ? 'flex-end' : 'flex-start',
//                             marginBottom: '10px'
//                         }}>
//                             <div style={{
//                                 maxWidth: '60%',
//                                 padding: '10px',
//                                 borderRadius: '8px',
//                                 backgroundColor: msg.IsUserMessage ? '#001F3F' : '#f8f8f8',
//                                 color: msg.IsUserMessage ? '#fff' : '#000',
//                                 wordBreak: 'break-word'
//                             }}>
//                                 {msg.Message}
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div>No messages found.</div>
//                 )}
//             </div>
//         </div>
//     );
// };

// // export default HistoryPage;
// HistoryPage.js
// Displaying HistoryPage.js.