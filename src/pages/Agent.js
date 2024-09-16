import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import FacialAuthComponent from '../components/FacialAuthComponent';
import LeftPanel from "../components/LeftPanel";
import "../styles/common.css";
import DashboardContent from "../components/AgentContent";
import Icon8 from "../assets/arrow-circle-up.svg";
import Icon7 from "../assets/plus-circle.svg";
import ChatLogo from "../assets/Genie.svg";
import Profile from "../assets/profile.svg"; 
import Lock from "../assets/lock.svg";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from "../assets/Genie.svg";
import UserContext from '../components/UserContext';



const Agent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [messages, setMessages] = useState([]);
    const endOfMessagesRef = useRef(null);
    const hasSentInitialMessage = useRef(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showOTP, setShowOTP] = useState(false);
    const [showFacialAuth, setShowFacialAuth] = useState(false);
    const [facialAuthLink, setFacialAuthLink] = useState('');
    const [hasShownVideoVerification, setHasShownVideoVerification] = useState(false);
    const [isVerificationCompleted, setIsVerificationCompleted] = useState(false);
    const [hasSentVerificationMessage, setHasSentVerificationMessage] = useState(false);
    const [initialPromptProcessed, setInitialPromptProcessed] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);


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
  // Handle option click, update state and check values
  const handleOptionClick = (option) => {
    console.log('Clicked Option ID:', option.id); // Debug: Log clicked option ID
    setSelectedOption(option.id); // Update the selected option state
    console.log('Selected Option State:', selectedOption); // Debug: Check if state updates correctly
    handleMessageSend(option.text);
  };

    const options = [
        { id: 1, text: 'Email' },
        { id: 2, text: 'Employee Portal' },
        { id: 3, text: 'HR Management' },
        { id: 4, text: 'Project Management Tools' },
        { id: 5, text: 'Other' }
    ];
    const location = useLocation();
    const initialPrompt = location.state?.initialPrompt || '';

    useEffect(() => {
        setSessionId(uuidv4());
    }, []);

    useEffect(() => {
        if (sessionId && !hasSentInitialMessage.current) {
            handleMessageSend(initialPrompt, false);
            hasSentInitialMessage.current = true;
        }
    }, [sessionId, initialPrompt]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isVerificationCompleted && !hasSentVerificationMessage) {
            handleMessageSend("User verified successfully.");
            setHasSentVerificationMessage(true);
        }
    }, [isVerificationCompleted, hasSentVerificationMessage]);

    const handleAuthComplete = () => {
        setShowFacialAuth(false);
        setIsVerificationCompleted(true);
    };

    const handleAuthClose = () => {
        setShowFacialAuth(false);
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
 
    const ChatMessage = ({ message, userName, messages }) => {
        const profilePhoto = localStorage.getItem("profilePhoto");
        const fullName = localStorage.getItem("fullName");
        //console.log(`Rendering ChatMessage with Timestamp:`, message.timestamp); // Debug to check the timestamp
        const messagesEndRef = useRef(null);
        const chatContainerRef = useRef(null);
        const [hasScrolled, setHasScrolled] = useState(false);
    
        const scrollToBottom = () => {
            if (!hasScrolled) {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        };
    
        // Track if the user has manually scrolled up
        const handleScroll = () => {
            if (!chatContainerRef.current) return;
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50; // 50px threshold
            setHasScrolled(!isAtBottom); // If the user is not at the bottom, they've scrolled
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
    const DotLoader = () => (
        <div className="dot-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    );

    const handleAttachFile = () => {
        // Implement file attachment logic here
    };

    const typingEffect = (messageText, delay = 50) => {
        return new Promise(resolve => {
            let currentIndex = 0;
            let interval = setInterval(() => {
                if (currentIndex < messageText.length) {
                    setMessages(prevMessages => {
                        const newMessages = prevMessages.slice(0, -1);
                        newMessages.push({
                            text: messageText.substring(0, currentIndex + 1),
                            isUserMessage: false,
                            isLoading: true
                        });
                        return newMessages;
                    });
                    currentIndex++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, delay);
        });
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

    const handleMessageSend = async (input, displayMessage = true, actualOTP = null) => {
        const initialMessage = "Hey BARTGenie, I want to reset my password";
    
        if (!initialPromptProcessed) {
            setIsLoading(true);
    
            setMessages(prevMessages => [
                ...prevMessages,
                createMessage(initialMessage, true),
                { text: <DotLoader />, isUserMessage: false, isLoading: true, timestamp: getCurrentTime() }
            ]);
    
            try {
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
                    inputText: initialMessage
                });
    
                const response = await client.send(command);
                console.log('API Response:', response);
    
                let fullResponse = '';
                const decoder = new TextDecoder('utf-8');
    
                if (response.completion) {
                    for await (const event of response.completion) {
                        if (event.chunk && event.chunk.bytes) {
                            const byteArray = new Uint8Array(event.chunk.bytes);
                            fullResponse += decoder.decode(byteArray, { stream: true });
                        }
                    }
    
                    await typingEffect(fullResponse);
                    await processAndDisplayResponse(fullResponse, true);
                    setInitialPromptProcessed(true);
                } else {
                    console.error('Unexpected API response structure:', response);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
            return;
        }
    
        if (input === "User verified successfully." && hasSentVerificationMessage) {
            return;
        }
    
        setIsLoading(true);
        try {
            const newMessage = { 
                text: input === "Done" ? "Done" : (actualOTP ? "Done" : input), 
                isUserMessage: true, 
                timestamp: getCurrentTime() 
            };
            setMessages(prevMessages => [
                ...prevMessages,
                newMessage,
                { text: <DotLoader />, isUserMessage: false, isLoading: true, timestamp: getCurrentTime() }
            ]);
            await storeMessage(actualOTP || input, true);
    
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
                inputText: actualOTP || input
            });
    
            const response = await client.send(command);
            console.log('API Response:', response);
    
            let fullResponse = '';
            const decoder = new TextDecoder('utf-8');
    
            if (response.completion) {
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
    
                await typingEffect(fullResponse);
                await processAndDisplayResponse(fullResponse, true);
            } else {
                console.error('Unexpected API response structure:', response);
            }
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = "An error occurred while fetching the response.";
    
            setMessages(prevMessages => {
                const newMessages = prevMessages.slice(0, -1);
                newMessages.push({ text: errorMessage, isUserMessage: false, timestamp: getCurrentTime() });
                return newMessages;
            });
        } finally {
            setIsLoading(false);
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

    const ChatInput = ({ onSend, isLoading, isOTPActive }) => {
        const [input, setInput] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!isLoading && input.trim()) {
                onSend(input);
                setInput('');
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && e.shiftKey) {
                return; 
            } else if (e.key === 'Enter') {
                e.preventDefault(); 
                handleSubmit(e); 
            }
            

        };

        return (
            <div className="chat">
                <img src={Icon7} alt="Icon 7" />
                <input
                    type="text"
                    placeholder="Ask BART Genie"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <img
                    src={Icon8}
                    alt="Icon 8"
                    onClick={() => onSend(input)}
                    className="template-icon1"
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                />
            </div>
        );
    };

    return (
        <div className="dashboard">
            <LeftPanel />
            <main className="content">
                <div className="content-box">
                    <div className="chat-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                            <img src={Lock} style={{ marginRight: '10px', borderRight: '1px solid grey', borderBottom: '1px solid grey', borderRadius: '5px' }} />
                            <h2 style={{ fontFamily: 'sans-serif', fontSize: '18px', textAlign: 'center', color: 'grey', padding: '10px' }}>Password Reset</h2>
                        </div>

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
                    </div>

                    <div className='scrollmessages' style={{ paddingBottom: '80px', color: 'white', overflow: 'auto', maxHeight:'75%' }}>
                        {messages.map((message, index) => (
                            <ChatMessage key={index} message={message} />
                        ))}
                        <ChatInput onSend={handleMessageSend} isLoading={isLoading} isOTPActive={showOTP} />

                        {showFacialAuth && (
                            <div className="facial-auth-overlay">
                                <FacialAuthComponent
                                    link={facialAuthLink}
                                    onClose={handleAuthClose}
                                    onComplete={handleAuthComplete}
                                />
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>

    );
};

export default Agent;
