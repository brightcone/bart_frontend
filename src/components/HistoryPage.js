import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { v4 as uuidv4 } from 'uuid';
import ChatInput from './ChatInput';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Kolkata');

const HistoryPage = () => {
    const [messagesBySession, setMessagesBySession] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

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

        return contentPreview.length > 50 ? `${contentPreview.substring(0, 50)}...` : contentPreview;
    };
    const dotFlashing = keyframes`
    0% {
      opacity: 1;
    }
    50%, 100% {
      opacity: 0;
    }
  `;

    const Dot = styled.span`
    font-size: 34px;
    color: #001f3f;
    animation: ${dotFlashing} 1s infinite linear;
    background: '#fff'; 
    margin: 0 1px;  // Adjust margin to control spacing between dots

    &:nth-child(2) {
      animation-delay: 0.3s;
    }
    &:nth-child(3) {
      animation-delay: 0.6s;
    }
   
 
  `;

    const DotLoader = () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', height: '7px', padding: '0', background: '#fff', }}>
            <Dot>•</Dot>
            <Dot>•</Dot>
            <Dot>•</Dot>

        </div>
    );

    const typingEffect = (messageText, sessionId) => {
        return new Promise((resolve) => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                setMessagesBySession((prevMessages) => {
                    const newMessages = { ...prevMessages };
                    if (newMessages[sessionId]) {
                        const lastMessageIndex = newMessages[sessionId].length - 1;
                        const lastMessage = newMessages[sessionId][lastMessageIndex];

                        // Append one more character to the last message
                        lastMessage.Message = messageText.substring(0, currentIndex + 1);
                    }
                    return newMessages;
                });

                currentIndex++;
                if (currentIndex === messageText.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50); // Adjust typing speed by changing this interval (50ms per character)
        });
    };

    const handleMessageSend = async (input) => {
        try {
            const username = localStorage.getItem('username');
            const password = localStorage.getItem('password');
            const sessionId = selectedSessionId || uuidv4();

            // Store the message in the database
            await axios.post('https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat', {
                action: 'store',
                username: username,
                password: password,
                sessionId: sessionId,
                message: input,
                isUserMessage: true
            });

            // Update the messages state
            setMessagesBySession((prevMessages) => ({
                ...prevMessages,
                [sessionId]: [
                    ...(prevMessages[sessionId] || []),
                    {
                        IsUserMessage: true,
                        Message: input,
                        Timestamp: new Date().toISOString(),
                    }
                ]
            }));

            setSelectedSessionId(sessionId);
            setIsTyping(true);
            setShowLoader(true);

            // Fetch the response from the agent
            await fetchAgentResponse(input, sessionId);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const fetchAgentResponse = async (input, sessionId) => {
        const client = new BedrockAgentRuntimeClient({
            region: "us-east-1",
            credentials: {
                accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
            }
        });

        const command = new InvokeAgentCommand({
            agentId: "U3YHVQFHVA",
            agentAliasId: "5OMM0I4NH3",
            sessionId: sessionId,
            inputText: input
        });

        try {
            let fullResponse = '';
            const decoder = new TextDecoder('utf-8');

            const response = await client.send(command);
            console.log('API Response:', response);

            if (response.completion) {
                setShowLoader(false);
                for await (const event of response.completion) {
                    if (event.chunk && event.chunk.bytes) {
                        try {
                            const byteArray = new Uint8Array(event.chunk.bytes);
                            const decodedString = decoder.decode(byteArray, { stream: true });
                            fullResponse += decodedString;
                        } catch (decodeError) {
                            console.error("Error decoding chunk:", decodeError);
                        }
                    }
                }

                // Check if the fullResponse already exists in the session
                const existingMessages = messagesBySession[sessionId] || [];
                const isDuplicate = existingMessages.some(msg => msg.Message === fullResponse && !msg.IsUserMessage);

                if (!isDuplicate) {
                    // Store the agent's response in the database
                    await axios.post('https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat', {
                        action: 'store',
                        username: localStorage.getItem('username'),
                        password: localStorage.getItem('password'),
                        sessionId: sessionId,
                        message: fullResponse,
                        isUserMessage: false
                    });

                    //await typingEffect(fullResponse); // Add typing effect here

                    setMessagesBySession((prevMessages) => ({
                        ...prevMessages,
                        [sessionId]: [
                            ...(prevMessages[sessionId] || []),
                            {
                                Message: fullResponse,
                                IsUserMessage: false,
                                showOptions: fullResponse.includes("Which application do you want to change the password for?"),
                                showOTP: fullResponse.includes("Can you please provide me with the correct OTP?") || fullResponse.includes("An OTP has been sent to your email:")
                            }
                        ]
                    }));
                    await typingEffect(fullResponse, sessionId);

                    const existingHistory = JSON.parse(localStorage.getItem('history') || '[]');
                    const newEntry = { input, response: fullResponse };
                    const updatedHistory = [...existingHistory, newEntry];
                    localStorage.setItem('history', JSON.stringify(updatedHistory));
                }
            } else {
                console.error('Unexpected API response structure:', response);
            }
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = "An error occurred while fetching the response.";

            // Store the error message in the database
            await axios.post('https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat', {
                action: 'store',
                username: localStorage.getItem('username'),
                password: localStorage.getItem('password'),
                sessionId: sessionId,
                message: errorMessage,
                isUserMessage: false
            });

            setMessagesBySession((prevMessages) => ({
                ...prevMessages,
                [sessionId]: [
                    ...(prevMessages[sessionId] || []),
                    { Message: errorMessage, IsUserMessage: false }
                ]
            }));
        } finally {
            setIsTyping(false);
            setShowLoader(false); // Hide DotLoader
        }
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
            height: '100vh',
            padding: '20px',
            backgroundColor: '#f4f4f4',
        }}>
            {/* Chat List */}
            <div style={{
                width: '30%',
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                marginRight: '20px',
                overflowY: 'auto',
            }}>
                <h2>Chats</h2>
                {Object.keys(messagesBySession).map((sessionId) => {
                    const messages = messagesBySession[sessionId];
                    const sessionTitle = generateSessionTitle(messages);
                    return (
                        <div
                            key={sessionId}
                            style={{
                                padding: '10px',
                                backgroundColor: selectedSessionId === sessionId ? '#e0e0e0' : '#f9f9f9',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                marginBottom: '10px'
                            }}
                            onClick={() => setSelectedSessionId(sessionId)}
                        >
                            <strong>{sessionTitle}</strong>
                        </div>
                    );
                })}
            </div>

            {/* Chat View */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            }}>
                {selectedSessionId ? (
                    <>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {messagesBySession[selectedSessionId].map((msg, index) => (
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
                                            {dayjs.utc(msg.Timestamp)
                                                .tz('Asia/Kolkata')
                                                .format('YYYY-MM-DD HH:mm:ss')}
                                        </div>
                                        {msg.Message}
                                    </div>
                                </div>
                            ))}
                            {showLoader && isTyping && <DotLoader />}
                        </div>
                        <ChatInput onSend={handleMessageSend} isLoading={isLoading} />
                    </>
                ) : (
                    <div>Select a chat to view messages.</div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;