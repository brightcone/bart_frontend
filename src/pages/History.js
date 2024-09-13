import React, { useState, useEffect, useRef, useContext  } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { v4 as uuidv4 } from 'uuid';
import styled, { keyframes } from 'styled-components';
import Icon12 from "../assets/magnifying-glass.svg";
import DashboardContent from "../components/DashboardContent";
import LeftPanel from "../components/LeftPanel";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import "../styles/common.css";
import Icon8 from "../assets/arrow-circle-up.svg";
import Icon7 from "../assets/plus-circle.svg";
import LogoutIcon from "../assets/Genie.svg";
import ChatLogo from "../assets/Genie.svg"; 
import UserContext from '../components/UserContext';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Kolkata');

const History = () => {
    const [messagesBySession, setMessagesBySession] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentChat, setCurrentChat] = useState([]);
    const { profilePhoto, fullName } = useContext(UserContext);
    const chatContainerRef = useRef(null);
    const [groupedSessions, setGroupedSessions] = useState({});
    const [messages, setMessages] = useState([]);
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showFacialAuth, setShowFacialAuth] = useState(false);
    const [facialAuthLink, setFacialAuthLink] = useState('');
    const [isVerificationCompleted, setIsVerificationCompleted] = useState(false);
    const [hasSentVerificationMessage, setHasSentVerificationMessage] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasShownVideoVerification, setHasShownVideoVerification] = useState(false);
    const [sessionId, setSessionId] = useState('');
        const handleOptionClick = (option) => {
        setSelectedOption(option.id);
        handleNewMessageSend(option.text);
        };

        const handleAuthComplete = () => {
        setShowFacialAuth(false);
        setIsVerificationCompleted(true);
        };


    const options = [
        { id: 1, text: 'Email' },
        { id: 2, text: 'Employee Portal' },
        { id: 3, text: 'HR Management' },
        { id: 4, text: 'Project Management Tools' },
        { id: 5, text: 'Other' }
    ];

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        groupSessionsByDate();
    }, [messagesBySession, searchTerm]);

    useEffect(() => {
        if (isVerificationCompleted && !hasSentVerificationMessage) {
            handleMessageSend("User verified successfully.");
            setHasSentVerificationMessage(true);
        }
    }, [isVerificationCompleted, hasSentVerificationMessage]);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogoutButton, setShowLogoutButton] = useState(false);

    const navigate = useNavigate();
    const handleTemplateClick = (path) => {
        navigate(path);
    };
    const handleConfirmLogout = () => {
        // Redirect to the LoginPage
        navigate('/login');
    };
    const handleLogoutClick = () => {
        // Toggle the visibility of the logout button
        setShowLogoutButton(true);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getCurrentTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        console.log(`Generated Time: ${timeString}`); // Debug statement to check the generated time
        return timeString;
    };
    const createMessage = (text, isUserMessage) => {
        const message = {
            text,
            isUserMessage,
            timestamp: getCurrentTime(), // Ensure a unique time for each message
        };
        console.log(`Message Created:`, message); // Debug statement to verify message creation
        return message;
    };

    const OptionCard = ({ option, onClick, isSelected }) => (
        <button
            className={`option-card ${isSelected ? 'selected' : ''}`} // Add selected class if the option is selected
            onClick={onClick}
            style={{
                backgroundColor: isSelected ? '#d3d3d3' : '#2d2d3e', // Change to your preferred selected color
                cursor: 'pointer',
                border: isSelected ? '2px solid #000' : '1px solid #2d2d3e', // Optional: Add border style when selected
            }}
        >
            {option.text}
        </button>
    );
    
 
    const OTPInputCard = ({ onSubmitOTP, otp, setOtp }) => {
        const inputRefs = useRef([]);
        const [isSubmitted, setIsSubmitted] = useState(false);
    
        useEffect(() => {
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus();
            }
        }, []);
    
        useEffect(() => {
            const firstEmptyIndex = otp.findIndex((value) => value === '');
            if (firstEmptyIndex >= 0 && inputRefs.current[firstEmptyIndex]) {
                inputRefs.current[firstEmptyIndex].focus();
            }
        }, [otp]);
    
        const handleChange = (index, value, event) => {
            const newOtp = otp.slice();
            newOtp[index] = value.slice(-1); // Keep only the last entered character
            setOtp(newOtp);
    
            // Move focus to the next input field if a value is entered and it's not the last field
            if (value && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        };
    
        const handleKeyDown = (index, event) => {
            const isBackspace = event.key === 'Backspace';
            if (isBackspace) {
                event.preventDefault(); // Prevent the default backspace behavior to manage focus manually
                if (!otp[index] && index > 0) {
                    // Move to the previous input if current is empty and backspace is pressed
                    inputRefs.current[index - 1]?.focus();
                    const updatedOtp = otp.slice();
                    updatedOtp[index - 1] = ''; // Optionally clear the previous input when backspace is hit
                    setOtp(updatedOtp);
                } else {
                    // Clear current value if not already empty
                    const updatedOtp = otp.slice();
                    updatedOtp[index] = '';
                    setOtp(updatedOtp);
                }
            } else if (event.key === 'Enter') {
                handleSubmit(); // Handle the Enter key for submission
            }
        };
    
        const handleSubmit = () => {
            setIsSubmitted(true);
            onSubmitOTP('Done');
        };
    
        if (isSubmitted) {
            return null; // Remove the component from the DOM after submission
        }
    
        return (
            <div className="otp-input-card">
                <div className="otp-label">Please enter OTP below</div>
                <div className="otp-inputs">
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(index, e.target.value, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onFocus={(e) => e.target.select()}
                            maxLength="1"
                            ref={(el) => (inputRefs.current[index] = el)}
                            className="otp-input"
                        />
                    ))}
                </div>
                <button className="otp-submit-btn" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        );
    };
    
    

    const TicketCard = ({ ticketNo, link, assignedTo, time }) => (
        <div className="ticket-card" onClick={() => window.open(link, '_blank')}>
            <div className="ticket-info">
                <div className="ticket-label">Ticket No:</div>
                <div className="ticket-value">{ticketNo}</div>
            </div>
            <div className="ticket-info">
                <div className="ticket-label">Assigned To:</div>
                <div className="ticket-value">{assignedTo}</div>
            </div>
            <div className="ticket-footer">
                <div className="ticket-time">{time}</div>
                <a href={link} target="_blank" rel="noopener noreferrer" className="view-ticket">View Ticket</a>
            </div>
        </div>
    );
    const VideoVerificationCard = ({ link, onVerificationComplete }) => {
        const [isSelected, setIsSelected] = useState(false);
    
        const handleClick = () => {
            setFacialAuthLink(link);
            setShowFacialAuth(true);
            //setIsVerificationCompleted(true);
        };

        useEffect(() => {
            if(isVerificationCompleted) {
                console.log(isSelected);
                setIsSelected((e) => true); 
            }
        }, [isVerificationCompleted]);
    
        return (
            <button
                className={`video-verification-card ${isSelected ? 'selected' : ''}`} // Add selected class if the option is selected
                onClick={handleClick}
                style={{
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #000' : '1px solid #2d2d3e', // Apply similar border style
                }} 
            >
                Face Recognition
            </button>
        );
    };


    const fetchMessages = async () => {
        try {
            const username = localStorage.getItem('username');
            const password = localStorage.getItem('password');

            if (!username || !password) {
                throw new Error('Username or password not found in localStorage');
            }

            const response = await axios.get(
                `https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat?email=${username}&password=${password}`
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

    const groupSessionsByDate = () => {
        const grouped = Object.entries(messagesBySession).reduce((acc, [sessionId, messages]) => {
            const latestMessage = messages[messages.length - 1];
            const date = dayjs(latestMessage.Timestamp).format('YYYY-MM-DD');
            const sessionTitle = generateSessionTitle(messages);
            
            if (sessionTitle.toLowerCase().includes(searchTerm.toLowerCase())) {
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push({ sessionId, title: sessionTitle, timestamp: latestMessage.Timestamp });
            }
            return acc;
        }, {});

        
        Object.keys(grouped).forEach(date => {
            grouped[date].sort((a, b) => dayjs(b.timestamp).diff(dayjs(a.timestamp)));
        });

        
        const sortedGrouped = Object.entries(grouped)
            .sort(([dateA], [dateB]) => dayjs(dateB).diff(dayjs(dateA)))
            .reduce((acc, [date, sessions]) => {
                acc[date] = sessions;
                return acc;
            }, {});

        setGroupedSessions(sortedGrouped);
    };

    const generateSessionTitle = (messages) => {
        if (!messages || messages.length === 0) return 'Untitled Conversation';

        const userMessage = messages.find((msg) => msg.IsUserMessage);
        const contentPreview = userMessage ? userMessage.Message : 'Chat Conversation';

        return contentPreview.length > 50 ? `${contentPreview.substring(0, 50)}...` : contentPreview;
    };

    const dotFlashing = keyframes`
        0% { opacity: 1; }
        50%, 100% { opacity: 0; }
    `;

    const Dot = styled.span`
        font-size: 34px;
        color: #001f3f;
        animation: ${dotFlashing} 1s infinite linear;
        background: '#fff'; 
        margin: 0 1px;

        &:nth-child(2) { animation-delay: 0.3s; }
        &:nth-child(3) { animation-delay: 0.6s; }
    `;

    const DotLoader = () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', height: '7px', padding: '0', background: '#fff', }}>
            <Dot>•</Dot>
            <Dot>•</Dot>
            <Dot>•</Dot>
        </div>
    );

    const handleSessionClick = (sessionId) => {
        setSelectedSessionId(sessionId);
        const sessionMessages = messagesBySession[sessionId] || [];
        setCurrentChat(sessionMessages.map(msg => ({
            text: msg.Message,
            isUserMessage: msg.IsUserMessage,
            timestamp: dayjs(msg.Timestamp).format('HH:mm'),
            showOptions: msg.showOptions,
            showOTP: msg.showOTP,
          
        })));
    };
    const typingEffect = (messageText, sessionId) => {
        return new Promise((resolve) => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                setMessagesBySession((prevMessages) => {
                    const newMessages = { ...prevMessages };
                    if (newMessages[sessionId]) {
                        const lastMessageIndex = newMessages[sessionId].length - 1;
                        const lastMessage = newMessages[sessionId][lastMessageIndex];

                      
                        lastMessage.Message = messageText.substring(0, currentIndex + 1);
                    }
                    return newMessages;
                });

                currentIndex++;
                if (currentIndex === messageText.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50); 
        });
    };
    const handleNewMessageSend = async (input) => {
        const newMessage = {
            text: input,
            isUserMessage: true,
            timestamp: dayjs().format('HH:mm'),
        };
        setCurrentChat(prev => [...prev, newMessage]);

        try {
             await handleMessageSend(input);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };


    const handleMessageSend = async (input) => {
        try {
            const username = localStorage.getItem('username');
            const password = localStorage.getItem('password');
            const sessionId = selectedSessionId || uuidv4();

            await axios.post('https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat', {
                action: 'store',
                email: username,
                password: password,
                sessionId: sessionId,
                message: input,
                isUserMessage: true
            });

            setMessagesBySession((prevMessages) => ({
                ...prevMessages,
                [sessionId]: [
                    ...(prevMessages[sessionId] || []),
                    {
                        IsUserMessage: true,
                        Message: input,
                        Timestamp: new Date().toISOString(),
                    },
                

                ],
            }));

            setSelectedSessionId(sessionId);
            setIsTyping(true);
            setShowLoader(true);

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
            agentAliasId: "FS3BRWFZ15",
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

                const existingMessages = messagesBySession[sessionId] || [];
                const isDuplicate = existingMessages.some(msg => msg.Message === fullResponse && !msg.IsUserMessage);

                if (!isDuplicate) {
                    await axios.post('https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat', {
                        action: 'store',
                        email: localStorage.getItem('username'),
                        password: localStorage.getItem('password'),
                        sessionId: sessionId,
                        message: fullResponse,
                        isUserMessage: false
                    });

                    const newMessage = {
                        Message: fullResponse,
                        IsUserMessage: false,
                        showOptions: fullResponse.includes("Which application do you want to change the password for?"),
                        showOTP: fullResponse.includes("Can you please provide me with the correct OTP?") || fullResponse.includes("An OTP has been sent to your email:"),
                        showVideoVerification: fullResponse.includes("video verification"),
                        link: fullResponse.includes("video verification") ? fullResponse.match(/https:\/\/\S+/)?.[0]?.split(' ')[0] : null
                    };
                    
    
                    setMessagesBySession((prevMessages) => ({
                        ...prevMessages,
                        [sessionId]: [
                            ...(prevMessages[sessionId] || []),
                            newMessage
                        ]
                    }));
    
                    setCurrentChat(prevChat => [...prevChat, {
                        text: fullResponse,
                        isUserMessage: false,
                        timestamp: dayjs().format('HH:mm'),
                        ...newMessage
                    }]);
    
                    await typingEffect(fullResponse);
                    await processAndDisplayResponse(fullResponse, true);
    
                    // Handle video verification
                    if (newMessage.showVideoVerification) {
                        setFacialAuthLink(newMessage.link);
                        setShowFacialAuth(true);
                    }
    
                    // Update chat history in local storage
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
    
            // Store error message
            await axios.post('https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat', {
                action: 'store',
                email: localStorage.getItem('username'),
                password: localStorage.getItem('password'),
                sessionId: sessionId,
                message: errorMessage,
                isUserMessage: false
            });
    
            setMessagesBySession((prevMessages) => ({
                ...prevMessages,
                [sessionId]: [
                    ...(prevMessages[sessionId] || []),
                    {
                        IsUserMessage: false,
                        Message: errorMessage,
                        Timestamp: new Date().toISOString(),
                    },
                ],
            }));
        }
    };

    const processAndDisplayResponse = async (fullResponse, displayMessage) => {
        console.log("processAndDisplayResponse called with:", fullResponse, displayMessage);

        const isOptionMessage = fullResponse.includes("application") || fullResponse.includes("Application");
        const isOTPMessage = fullResponse.includes("enter the OTP") || fullResponse.includes("invalid") || fullResponse.includes("expired");
        const isTicketMessage = fullResponse.includes("The Jira ticket was created successfully!");
        const isVideoVerificationMessage = fullResponse.includes("video verification");
        const videoVerificationLink = isVideoVerificationMessage ? fullResponse.match(/https:\/\/\S+/)?.[0]?.split(' ')[0] : null;

        setMessages(prevMessages => {
            if (!displayMessage) {
                return prevMessages;
            }

            const newMessages = [...prevMessages.slice(0, -1)];

            const responseMessage = createMessage(fullResponse, false);
            responseMessage.showOptions = isOptionMessage;
            responseMessage.showOTP = isOTPMessage;
            responseMessage.showVideoVerification = isVideoVerificationMessage;
            responseMessage.link = videoVerificationLink;
            responseMessage.videoVerificationCard = null;
            responseMessage.ticketInfo = null;

            if (isVideoVerificationMessage && !hasShownVideoVerification) {
                responseMessage.videoVerificationCard = (
                    <div>
                        <VideoVerificationCard link={videoVerificationLink} />
                    </div>
                );
                setHasShownVideoVerification(true);
            }

            if (isTicketMessage) {
                const linkMatch = fullResponse.match(/https:\/\/\S+/);
                const link = linkMatch ? linkMatch[0].split(' ')[0] : '';
                const assignedToMatch = fullResponse.match(/https:\/\/([^\.\n]+)/);
                const ticketNoMatch = link.match(/([A-Z]+-\d+)/);
                const assignedTo = assignedToMatch ? assignedToMatch[1].trim() : 'Unknown';
                const ticketNo = ticketNoMatch ? ticketNoMatch[1] : 'Unknown';
                const now = new Date();
                const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString();

                responseMessage.ticketInfo = { showTicket: true, assignedTo, ticketNo, link, time };
            }

            newMessages.push(responseMessage);

            return newMessages;
        });

        setShowOTP(isOTPMessage);

        if (displayMessage) {
            await storeMessage(fullResponse, false);
        }
    };

    
    const ChatMessage = ({ message, userName, messages }) => {
        const { profilePhoto, fullName } = useContext(UserContext);
        const messagesEndRef = useRef(null);
        const chatContainerRef = useRef(null);
        const [hasScrolled, setHasScrolled] = useState(false);
    
        const scrollToBottom = () => {
            if (!hasScrolled) {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        };
    
        
        const handleScroll = () => {
            if (!chatContainerRef.current) return;
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50; 
            setHasScrolled(!isAtBottom); 
        };
    
        useEffect(() => {
            const chatContainer = chatContainerRef.current;
            if (chatContainer) {
                chatContainer.addEventListener('scroll', handleScroll);
            }
            return () => {
                if (chatContainer) {
                    chatContainer.removeEventListener('scroll', handleScroll);
                }
            };
        }, []);
    
        // Automatically scroll when new messages are added if the user is at/near the bottom
        useEffect(() => {
            scrollToBottom();
        }, [messages]);
    
        return (
            <div ref={chatContainerRef} className="chat-message-container" style={{ overflowY: 'auto', maxHeight: '500px' }}>
                <div className="chat-message">
                    <div className={`message-row ${message.isUserMessage ? 'user' : 'agent'}`}>
                        <img
                            src={message.isUserMessage ? profilePhoto : ChatLogo}
                            alt={message.isUserMessage ? userName : 'BART Genie'}
                            className="avatar"
                        />
                        <div className="message-info">
                            <div className="header">
                                {message.isUserMessage ? (
                                    <span className="user-name">{fullName || userName || localStorage.getItem('username')}</span>
                                ) : (
                                    <span className="agent-name">BART Genie</span>
                                )}
                                <span style={{ display: 'inline-block', width: '3px', height: '3px', backgroundColor: 'white', borderRadius: '100%', paddingLeft: '0.5px', marginLeft: '5px' }}></span>
                                <span className="timestamp" style={{ fontSize: '14px' }}>
                                    {message.timestamp || ' '}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {(message.showOptions || message.showOTP || message.showVideoVerification || message.ticketInfo) && (
                                    <div className="gradient-bar" style={{ display: 'flex' }}></div>
                                )}
                                <div>
                                    <div className="message-text">
                                        {message.text === "Done" ? "Done" : message.text}
                                    </div>
                                    {message.showOptions && (
                                        <div className="option-cards">
                                            {options.map((option) => (
                                                <OptionCard
                                                    key={option.id}
                                                    option={option}
                                                    onClick={() => handleOptionClick(option)}
                                                    isSelected={selectedOption === option.id}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {message.showOTP && (
                                        <OTPInputCard
                                            otp={otp}
                                            setOtp={setOtp}
                                            onSubmitOTP={(displayText) =>
                                                handleMessageSend(displayText, true, otp.join(''))
                                            }
                                        />
                                    )}
                                    {message.showVideoVerification && message.videoVerificationCard && (
                                        <VideoVerificationCard
                                            link={message.link}
                                            onVerificationComplete={handleAuthComplete}
                                        />
                                    )}
                                    {message.ticketInfo && message.ticketInfo.showTicket && (
                                        <TicketCard
                                            ticketNo={message.ticketInfo.ticketNo}
                                            link={message.ticketInfo.link}
                                            assignedTo={message.ticketInfo.assignedTo}
                                            time={message.ticketInfo.time}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref={messagesEndRef} />
                </div>
            </div>
        );
    };

    const storeMessage = async (message, isUserMessage) => {
        try {
            const username = localStorage.getItem('username');
            const password = localStorage.getItem('password');

            if (!username || !password) {
                console.error('Username or password not found in localStorage');
                return;
            }

            await axios.post('https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat', {
                action: 'store',
                email: username,
                password: password,
                sessionId: sessionId,
                message: message,
                isUserMessage: isUserMessage
            });
        } catch (error) {
            console.error('Error storing message:', error);
        }
    };

    const filteredSessions = Object.entries(messagesBySession).filter(([sessionId, messages]) => {
        const sessionTitle = generateSessionTitle(messages);
        return sessionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
            <div className="dashboard">
                <LeftPanel />
                

              
                <div className='historyscroll' style={{ padding: '2rem', color: '#A9A9A9', width: '12%', overflowY: 'auto', marginLeft:'0px' }}>
                <h1 style={{fontFamily:'Pockota Light', fontSize:'18px'}}>History</h1>
                    <div className="searchbar">
                        <img src={Icon12} alt="Icon 7" />
                        <input type="text" placeholder="Search History" style={{ padding: '0 10px', fontSize: 14 }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    {Object.entries(groupedSessions).map(([date, sessions]) => (
                        <div className='date'>
                            <p style={{ opacity: 1, fontWeight: 'bold', paddingTop:'20px',paddingBottom:'0px', color:'grey' }}>{dayjs(date).format('MMMM D, YYYY')}</p>
                            {sessions.map(({ sessionId, title }) => (
                                <p 
                                    className='history'
                                    style={{ 
                                        padding: '3px', 
                                        color:'white',
                                        cursor: 'pointer',
                                        backgroundColor: selectedSessionId === sessionId ? '#333333' : 'transparent',
                                        borderRadius: '8px',
                                        
                                    }}
                                    onClick={() => handleSessionClick(sessionId)}
                                >
                                    {title}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
                <main className="content" style={{ width: 'auto', backgroundColor: '#1a1a2e', color: '#fff', padding: '20px' }}>
                    {selectedSessionId ? (
                        <div className="content-box">
                           
                            <div className="logout-container" style={{ marginLeft: 'auto' }}>
                                <Button
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    <img src={LogoutIcon} alt="Logout" />
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={handleConfirmLogout}>Logout</MenuItem>
                                </Menu>
                            </div>
                            
                            <div ref={chatContainerRef} className="chat-message-container" style={{ maxHeight:'85%',overflowY: 'auto' }}>
                                {currentChat.map((msg, index) => (
                                    <ChatMessage
                                        key={index}
                                        message={msg}
                                        userName={localStorage.getItem('username')}
                                    />
                                ))}
                            </div>
                            <div className="chat">
                                <img src={Icon7} alt="New message" />
                                <input 
                                    type="text" 
                                    placeholder="Ask BART Genie" 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleNewMessageSend(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                                <img src={Icon8} alt="Send message" className="template-icon1" onClick={() => {
                                    const input = document.querySelector('.chat input');
                                    if (input.value) {
                                        handleNewMessageSend(input.value);
                                        input.value = '';
                                    }
                                }}/>
                            </div>
                        </div>
                    ) : (
                        <DashboardContent />
                    )}
                </main>
            </div>
        );
    };
    
export default History;



// import React, { useState, useEffect, useRef, useContext  } from 'react';
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
// import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
// import { v4 as uuidv4 } from 'uuid';
// import styled, { keyframes } from 'styled-components';
// import Icon12 from "../assets/magnifying-glass.svg";
// import DashboardContent from "../components/DashboardContent";
// import LeftPanel from "../components/LeftPanel";
// import Button from '@mui/material/Button';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import "../styles/common.css";
// import Icon8 from "../assets/arrow-circle-up.svg";
// import Icon7 from "../assets/plus-circle.svg";
// import LogoutIcon from "../assets/Genie.svg";
// import ChatLogo from "../assets/Genie.svg"; 
// import UserContext from '../components/UserContext';
// import FacialAuthComponent from '../components/FacialAuthComponent';

// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault('Asia/Kolkata');

// const History = () => {
//     const [messagesBySession, setMessagesBySession] = useState({});
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedSessionId, setSelectedSessionId] = useState(null);
//     const [isTyping, setIsTyping] = useState(false);
//     const [showLoader, setShowLoader] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentChat, setCurrentChat] = useState([]);
//     const { profilePhoto, fullName } = useContext(UserContext);
//     const chatContainerRef = useRef(null);
//     const [groupedSessions, setGroupedSessions] = useState({});
//     const [messages, setMessages] = useState([]);
//     const [showOTP, setShowOTP] = useState(false);
//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const [showFacialAuth, setShowFacialAuth] = useState(false);
//     const [facialAuthLink, setFacialAuthLink] = useState('');
//     const [isVerificationCompleted, setIsVerificationCompleted] = useState(false);
//     const [hasSentVerificationMessage, setHasSentVerificationMessage] = useState(false);
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [hasShownVideoVerification, setHasShownVideoVerification] = useState(false);

//     useEffect(() => {
//         fetchMessages();
//     }, []);

//     useEffect(() => {
//         groupSessionsByDate();
//     }, [messagesBySession, searchTerm]);

//     useEffect(() => {
//         if (isVerificationCompleted && !hasSentVerificationMessage) {
//             handleMessageSend("User verified successfully.");
//             setHasSentVerificationMessage(true);
//         }
//     }, [isVerificationCompleted, hasSentVerificationMessage]);

//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [showLogoutButton, setShowLogoutButton] = useState(false);

//     const navigate = useNavigate();
//     const handleTemplateClick = (path) => {
//         navigate(path);
//     };
//     const handleConfirmLogout = () => {
//         navigate('/login');
//     };
//     const handleLogoutClick = () => {
//         setShowLogoutButton(true);
//     };

//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const open = Boolean(anchorEl);
//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
//     const handleClose = () => {
//         setAnchorEl(null);
//     };

//     const fetchMessages = async () => {
//         // ... (existing fetchMessages function)
//     };

//     const groupSessionsByDate = () => {
//         // ... (existing groupSessionsByDate function)
//     };

//     const generateSessionTitle = (messages) => {
//         // ... (existing generateSessionTitle function)
//     };

//     const dotFlashing = keyframes`
//         0% { opacity: 1; }
//         50%, 100% { opacity: 0; }
//     `;

//     const Dot = styled.span`
//         font-size: 34px;
//         color: #001f3f;
//         animation: ${dotFlashing} 1s infinite linear;
//         background: '#fff'; 
//         margin: 0 1px;

//         &:nth-child(2) { animation-delay: 0.3s; }
//         &:nth-child(3) { animation-delay: 0.6s; }
//     `;

//     const DotLoader = () => (
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', height: '7px', padding: '0', background: '#fff', }}>
//             <Dot>•</Dot>
//             <Dot>•</Dot>
//             <Dot>•</Dot>
//         </div>
//     );

//     const handleSessionClick = (sessionId) => {
//         setSelectedSessionId(sessionId);
//         const sessionMessages = messagesBySession[sessionId] || [];
//         setCurrentChat(sessionMessages.map(msg => ({
//             text: msg.Message,
//             isUserMessage: msg.IsUserMessage,
//             timestamp: dayjs(msg.Timestamp).format('HH:mm'),
//             showOptions: msg.showOptions,
//             showOTP: msg.showOTP,
//         })));
//     };

//     const typingEffect = (messageText, sessionId) => {
//         return new Promise((resolve) => {
//             let currentIndex = 0;
//             const interval = setInterval(() => {
//                 setMessagesBySession((prevMessages) => {
//                     const newMessages = { ...prevMessages };
//                     if (newMessages[sessionId]) {
//                         const lastMessageIndex = newMessages[sessionId].length - 1;
//                         const lastMessage = newMessages[sessionId][lastMessageIndex];
//                         lastMessage.Message = messageText.substring(0, currentIndex + 1);
//                     }
//                     return newMessages;
//                 });

//                 currentIndex++;
//                 if (currentIndex === messageText.length) {
//                     clearInterval(interval);
//                     resolve();
//                 }
//             }, 50); 
//         });
//     };

//     const handleNewMessageSend = async (input) => {
//         const newMessage = {
//             text: input,
//             isUserMessage: true,
//             timestamp: dayjs().format('HH:mm'),
//         };
//         setCurrentChat(prev => [...prev, newMessage]);

//         try {
//              await handleMessageSend(input);
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     const handleMessageSend = async (input) => {
//         try {
//             const username = localStorage.getItem('username');
//             const password = localStorage.getItem('password');
//             const sessionId = selectedSessionId || uuidv4();

//             await axios.post('https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat', {
//                 action: 'store',
//                 email: username,
//                 password: password,
//                 sessionId: sessionId,
//                 message: input,
//                 isUserMessage: true
//             });

//             setMessagesBySession((prevMessages) => ({
//                 ...prevMessages,
//                 [sessionId]: [
//                     ...(prevMessages[sessionId] || []),
//                     {
//                         IsUserMessage: true,
//                         Message: input,
//                         Timestamp: new Date().toISOString(),
//                     },
//                 ],
//             }));

//             setSelectedSessionId(sessionId);
//             setIsTyping(true);
//             setShowLoader(true);

//             await fetchAgentResponse(input, sessionId);
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     const fetchAgentResponse = async (input, sessionId) => {
//         const client = new BedrockAgentRuntimeClient({
//             region: "us-east-1",
//             credentials: {
//                 accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//                 secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
//             }
//         });

//         const command = new InvokeAgentCommand({
//             agentId: "U3YHVQFHVA",
//             agentAliasId: "FS3BRWFZ15",
//             sessionId: sessionId,
//             inputText: input
//         });

//         try {
//             let fullResponse = '';
//             const decoder = new TextDecoder('utf-8');

//             const response = await client.send(command);
//             console.log('API Response:', response);

//             if (response.completion) {
//                 setShowLoader(false);
//                 for await (const event of response.completion) {
//                     if (event.chunk && event.chunk.bytes) {
//                         try {
//                             const byteArray = new Uint8Array(event.chunk.bytes);
//                             const decodedString = decoder.decode(byteArray, { stream: true });
//                             fullResponse += decodedString;
//                         } catch (decodeError) {
//                             console.error("Error decoding chunk:", decodeError);
//                         }
//                     }
//                 }

//                 const existingMessages = messagesBySession[sessionId] || [];
//                 const isDuplicate = existingMessages.some(msg => msg.Message === fullResponse && !msg.IsUserMessage);

//                 if (!isDuplicate) {
//                     await axios.post('https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat', {
//                         action: 'store',
//                         email: localStorage.getItem('username'),
//                         password: localStorage.getItem('password'),
//                         sessionId: sessionId,
//                         message: fullResponse,
//                         isUserMessage: false
//                     });

//                     const newMessage = {
//                         Message: fullResponse,
//                         IsUserMessage: false,
//                         showOptions: fullResponse.includes("Which application do you want to change the password for?"),
//                         showOTP: fullResponse.includes("Can you please provide me with the correct OTP?") || fullResponse.includes("An OTP has been sent to your email:"),
//                         showVideoVerification: fullResponse.includes("video verification"),
//                         link: fullResponse.includes("video verification") ? fullResponse.match(/https:\/\/\S+/)?.[0]?.split(' ')[0] : null
//                     };
    
//                     setMessagesBySession((prevMessages) => ({
//                         ...prevMessages,
//                         [sessionId]: [
//                             ...(prevMessages[sessionId] || []),
//                             newMessage
//                         ]
//                     }));
    
//                     setCurrentChat(prevChat => [...prevChat, {
//                         text: fullResponse,
//                         isUserMessage: false,
//                         timestamp: dayjs().format('HH:mm'),
//                         ...newMessage
//                     }]);
    
//                     await typingEffect(fullResponse, sessionId);
    
//                     if (newMessage.showVideoVerification) {
//                         setFacialAuthLink(newMessage.link);
//                         setShowFacialAuth(true);
//                     }
    
//                     const existingHistory = JSON.parse(localStorage.getItem('history') || '[]');
//                     const newEntry = { input, response: fullResponse };
//                     const updatedHistory = [...existingHistory, newEntry];
//                     localStorage.setItem('history', JSON.stringify(updatedHistory));
//                 }
//             } else {
//                 console.error('Unexpected API response structure:', response);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             const errorMessage = "An error occurred while fetching the response.";
    
//             await axios.post('https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat', {
//                 action: 'store',
//                 email: localStorage.getItem('username'),
//                 password: localStorage.getItem('password'),
//                 sessionId: sessionId,
//                 message: errorMessage,
//                 isUserMessage: false
//             });
    
//             setMessagesBySession((prevMessages) => ({
//                 ...prevMessages,
//                 [sessionId]: [
//                     ...(prevMessages[sessionId] || []),
//                     {
//                         IsUserMessage: false,
//                         Message: errorMessage,
//                         Timestamp: new Date().toISOString(),
//                     },
//                 ],
//             }));
//         }
//     };
    
//     const ChatMessage = ({ message, userName }) => {
//         const options = [
//             { id: 1, text: 'Email' },
//             { id: 2, text: 'Employee Portal' },
//             { id: 3, text: 'HR Management' },
//             { id: 4, text: 'Project Management Tools' },
//             { id: 5, text: 'Other' }
//         ];

//         const handleOptionClick = (option) => {
//             console.log('Clicked Option ID:', option.id);
//             setSelectedOption(option.id);
//             handleMessageSend(option.text);
//         };

//         const handleAuthComplete = () => {
//             setShowFacialAuth(false);
//             setIsVerificationCompleted(true);
//         };

//         const handleAuthClose = () => {
//             setShowFacialAuth(false);
//         };

//         return (
//             <div className="chat-message">
//                 <div className={`message-row ${message.isUserMessage ? 'user' : 'agent'}`}>
//                     <img
//                         src={message.isUserMessage ? profilePhoto : ChatLogo}
//                         alt={message.isUserMessage ? userName : 'BART Genie'}
//                         className="avatar"
//                     />
//                     <div className="message-info">
//                         <div className="header">
//                             {message.isUserMessage ? (
//                                 <span className="user-name">{fullName || userName || localStorage.getItem('username')}</span>
//                             ) : (
//                                 <span className="agent-name">BART Genie</span>
//                             )}
//                             <span style={{ display: 'inline-block', width: '3px', height: '3px', backgroundColor: 'white', borderRadius: '100%', paddingLeft: '0.5px', marginLeft: '5px' }}></span>
//                             <span className="timestamp" style={{ fontSize: '14px' }}>
//                                 {message.timestamp}
//                             </span>
//                         </div>
//                         <div style={{ display: 'flex', gap: '0.5rem' }}>
//                             {(message.showOptions || message.showOTP || message.showVideoVerification || message.ticketInfo) && (
//                                 <div className="gradient-bar" style={{ display: 'flex' }}></div>
//                             )}
//                             <div>
//                                 <div className="message-text">
//                                     {message.text}
//                                 </div>
//                                 {message.showOptions && (
//                                     <div className="option-cards">
//                                         {options.map((option) => (
//                                             <OptionCard
//                                                 key={option.id}
//                                                 option={option}
//                                                 onClick={() => handleOptionClick