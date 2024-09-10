import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import Profile from "../assets/profile.svg"; // Import the Profile logo

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

    const ChatMessage = ({ message, userName }) => {
        // Get the current time in HH:MM format
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
        return (
            <div className="chat-message">
                <div className={`message-row ${message.isUserMessage ? 'user' : 'agent'}`}>
                    <img
                        src={message.isUserMessage ? Profile : ChatLogo}
                        alt={message.isUserMessage ? userName : "BART Buddy"}
                        className="avatar"
                    />
                    <div className="message-info">
                        <div className="header">
                            {message.isUserMessage ? (
                                <span className="user-name">Floyd Miles</span>
                            ) : (
                                <span className="agent-name">BART Buddy</span>
                            )}
                            <span className="timestamp"> • {currentTime}</span>
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                            {(message.showOptions || message.showOTP || message.showVideoVerification || message.ticketInfo) && <div className='gradient-bar'></div>}
                            <div>
                        <div className="message-text">{message.text}</div>
                        {message.showOptions && (
                            <div className="option-cards">
                                {options.map((option) => (
                                    <OptionCard
                                        key={option.id}
                                        option={option}
                                        onClick={() => handleMessageSend(option.text)}
                                    />
                                ))}
                            </div>
                        )}
                        {message.showOTP && (
                            <OTPInputCard
                                otp={otp}
                                setOtp={setOtp}
                                onSubmitOTP={(displayText) =>
                                    setMessages((prevMessages) => [
                                        ...prevMessages,
                                        { text: displayText, isUserMessage: true },
                                    ])
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
            </div>
        );
    };
    
    
    

    const OptionCard = ({ option, onClick }) => (
        <button className="option-card" onClick={onClick}>
            {option.text}
        </button>
    );

    const OTPInputCard = ({ onSubmitOTP, otp, setOtp }) => {
        const inputRefs = useRef([]);

        useEffect(() => {
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus();
            }
        }, []);

        useEffect(() => {
            const firstEmptyIndex = otp.findIndex(value => value === '');
            if (firstEmptyIndex >= 0 && inputRefs.current[firstEmptyIndex]) {
                inputRefs.current[firstEmptyIndex].focus();
            }
        }, [otp]);

        const handleChange = (index, value) => {
            const newOtp = otp.slice();
            newOtp[index] = value.slice(-1);
            setOtp(newOtp);

            if (value && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        };

        const handleSubmit = () => {
            handleMessageSend(otp.join(''), true);
        };


        return (
            <div className="otp-input-card">
                <div className="otp-label">Please enter OTP below</div>
                <div className="otp-inputs">
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onFocus={(e) => e.target.select()}
                            maxLength="1"
                            ref={el => inputRefs.current[index] = el}
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

    const VideoVerificationCard = ({ link, onVerificationComplete }) => (
        <button className="video-verification-card" onClick={() => {
            setFacialAuthLink(link);
            setShowFacialAuth(true);
        }}>
            Face Recognition
        </button>
    );

    const handleMessageSend = async (input, displayMessage = true, actualOTP = null) => {
        if (!displayMessage) {
            if (initialPromptProcessed) {
                return;
            }

            setIsLoading(true);
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
                    agentAliasId: "GX5MSL1QQU",
                    sessionId: sessionId,
                    inputText: input
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
            const newMessage = { text: actualOTP ? "Done!" : input, isUserMessage: true };
            setMessages(prevMessages => [
                ...prevMessages,
                newMessage,
                { text: <DotLoader />, isUserMessage: false, isLoading: true }
            ]);
            await storeMessage(input, true);

            const client = new BedrockAgentRuntimeClient({
                region: "us-east-1",
                credentials: {
                    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
                }
            });

            const command = new InvokeAgentCommand({
                agentId: "U3YHVQFHVA",
                agentAliasId: "GX5MSL1QQU",
                sessionId: sessionId,
                inputText: actualOTP ? input : newMessage.text
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
                newMessages.push({ text: errorMessage, isUserMessage: false });
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

        setMessages((prevMessages) => {
            if (!displayMessage) {
                return prevMessages;
            }

            const newMessages = [...prevMessages.slice(0, -1)];

            const responseMessage = {
                text: fullResponse,
                isUserMessage: false,
                showOptions: isOptionMessage,
                showOTP: isOTPMessage,
                showVideoVerification: isVideoVerificationMessage,
                link: videoVerificationLink,
                videoVerificationCard: null,
                ticketInfo: null,
            };

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
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
            }
        };

        return (
            <form onSubmit={handleSubmit} className="chat-input-container">
                <button type="button" onClick={handleAttachFile} className="attach-button">
                    <img src={Icon7} alt="Attach" className="attach-icon" />
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask BART Buddy"
                    disabled={isLoading || isOTPActive}
                    className="chat-input"
                />
                <button type="submit" disabled={isLoading || isOTPActive} className="send-button">
                    <img src={Icon8} alt="Send" className="send-icon" />
                </button>
            </form>
        );
    };

    return (
        <div className="agent-container">
            <LeftPanel />
            <div className="chat-container">
                <div className="chat-header">
                    Password Reset
                </div>
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <ChatMessage key={index} message={message} userName="Floyd Miles" />
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>
                <ChatInput onSend={handleMessageSend} isLoading={isLoading} isOTPActive={showOTP} />
            </div>
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
    );
};

export default Agent;









// import React, { useState, useRef, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
// import { v4 as uuidv4 } from 'uuid';
// import axios from 'axios';
// import FacialAuthComponent from '../components/FacialAuthComponent';
// import LeftPanel from "../components/LeftPanel";
// import "../styles/common.css";
// import DashboardContent from "../components/AgentContent";
// import Icon8 from "../assets/arrow-circle-up.svg";
// import Icon7 from "../assets/plus-circle.svg";
// import ChatLogo from "../assets/Genie.svg";

// const Agent = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [sessionId, setSessionId] = useState('');
//     const [messages, setMessages] = useState([]);
//     const endOfMessagesRef = useRef(null);
//     const hasSentInitialMessage = useRef(false);
//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const [showOTP, setShowOTP] = useState(false);
//     const [showFacialAuth, setShowFacialAuth] = useState(false);
//     const [facialAuthLink, setFacialAuthLink] = useState('');
//     const [hasShownVideoVerification, setHasShownVideoVerification] = useState(false);
//     const [isVerificationCompleted, setIsVerificationCompleted] = useState(false);
//     const [hasSentVerificationMessage, setHasSentVerificationMessage] = useState(false);
//     const [initialPromptProcessed, setInitialPromptProcessed] = useState(false);

//     const options = [
//         { id: 1, text: 'Email' },
//         { id: 2, text: 'Employee Portal' },
//         { id: 3, text: 'HR Management' },
//         { id: 4, text: 'Project Management Tools' },
//         { id: 5, text: 'Other' }
//     ];
//     const location = useLocation();
//     const initialPrompt = location.state?.initialPrompt || '';

//     useEffect(() => {
//         setSessionId(uuidv4());
//     }, []);

//     useEffect(() => {
//         if (sessionId && !hasSentInitialMessage.current) {
//             handleMessageSend(initialPrompt, false);
//             hasSentInitialMessage.current = true;
//         }
//     }, [sessionId, initialPrompt]);

//     useEffect(() => {
//         endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     useEffect(() => {
//         if (isVerificationCompleted && !hasSentVerificationMessage) {
//             handleMessageSend("User verified successfully.");
//             setHasSentVerificationMessage(true);
//         }
//     }, [isVerificationCompleted, hasSentVerificationMessage]);

//     const handleAuthComplete = () => {
//         setShowFacialAuth(false);
//         setIsVerificationCompleted(true);
//     };

//     const handleAuthClose = () => {
//         setShowFacialAuth(false);
//     };



//     const ChatMessage = ({ message, userName }) => (
//         <div className="chat-message">
//             <div className="avatar">
//                 <img
//                     src={ChatLogo}
//                     alt={message.isUserMessage ? userName : "BART Buddy"}
//                 />
//             </div>
//             <div className="message-content">
//                 {!message.isUserMessage && <div className="agent-name">BART Buddy</div>}
//                 <div className="message-text">{message.text}</div>
//                 {message.showOptions && (
//                     <div className="option-cards">
//                         {options.map((option) => (
//                             <OptionCard
//                                 key={option.id}
//                                 option={option}
//                                 onClick={() => handleMessageSend(option.text)}
//                             />
//                         ))}
//                     </div>
//                 )}
//                 {message.showOTP && (
//                     <OTPInputCard
//                         otp={otp}
//                         setOtp={setOtp}
//                         onSubmitOTP={(displayText) =>
//                             setMessages((prevMessages) => [
//                                 ...prevMessages,
//                                 { text: displayText, isUserMessage: true },
//                             ])
//                         }
//                     />
//                 )}
//                 {message.showVideoVerification && message.videoVerificationCard && (
//                     <VideoVerificationCard
//                         link={message.link}
//                         onVerificationComplete={handleAuthComplete}
//                     />
//                 )}
//                 {message.ticketInfo && message.ticketInfo.showTicket && (
//                     <TicketCard
//                         ticketNo={message.ticketInfo.ticketNo}
//                         link={message.ticketInfo.link}
//                         assignedTo={message.ticketInfo.assignedTo}
//                         time={message.ticketInfo.time}
//                     />
//                 )}
//             </div>
//         </div>
//     );
    
    

//     const OptionCard = ({ option, onClick }) => (
//         <button className="option-card" onClick={onClick}>
//             {option.text}
//         </button>
//     );

//     const OTPInputCard = ({ onSubmitOTP, otp, setOtp }) => {
//         const inputRefs = useRef([]);

//         useEffect(() => {
//             if (inputRefs.current[0]) {
//                 inputRefs.current[0].focus();
//             }
//         }, []);

//         useEffect(() => {
//             const firstEmptyIndex = otp.findIndex(value => value === '');
//             if (firstEmptyIndex >= 0 && inputRefs.current[firstEmptyIndex]) {
//                 inputRefs.current[firstEmptyIndex].focus();
//             }
//         }, [otp]);

//         const handleChange = (index, value) => {
//             const newOtp = otp.slice();
//             newOtp[index] = value.slice(-1);
//             setOtp(newOtp);

//             if (value && index < otp.length - 1) {
//                 inputRefs.current[index + 1]?.focus();
//             }
//         };

//         const handleSubmit = () => {
//             handleMessageSend(otp.join(''), true);
//         };

//         return (
//             <div>
//                 <div>Please enter below</div>
//                 <div>
//                     {otp.map((value, index) => (
//                         <input
//                             key={index}
//                             type="text"
//                             value={value}
//                             onChange={(e) => handleChange(index, e.target.value)}
//                             onFocus={(e) => e.target.select()}
//                             maxLength="1"
//                             ref={el => inputRefs.current[index] = el}
//                         />
//                     ))}
//                 </div>
//                 <button onClick={handleSubmit}>Submit</button>
//             </div>
//         );
//     };

//     const TicketCard = ({ ticketNo, link, assignedTo, time }) => (
//         <div className="ticket-card" onClick={() => window.open(link, '_blank')}>
//             <div className="ticket-info">
//                 <div className="ticket-label">Ticket No:</div>
//                 <div className="ticket-value">{ticketNo}</div>
//             </div>
//             <div className="ticket-info">
//                 <div className="ticket-label">Assigned To:</div>
//                 <div className="ticket-value">{assignedTo}</div>
//             </div>
//             <div className="ticket-footer">
//                 <div className="ticket-time">{time}</div>
//                 <a href={link} target="_blank" rel="noopener noreferrer" className="view-ticket">View Ticket</a>
//             </div>
//         </div>
//     );
//     const DotLoader = () => (
//         <div>
//             <span>•</span>
//             <span>•</span>
//             <span>•</span>
//         </div>
//     );

//     const handleAttachFile = () => {
//         // Implement file attachment logic here
//     };

//     const typingEffect = (messageText, delay = 50) => {
//         return new Promise(resolve => {
//             let currentIndex = 0;
//             let interval = setInterval(() => {
//                 if (currentIndex < messageText.length) {
//                     setMessages(prevMessages => {
//                         const newMessages = prevMessages.slice(0, -1);
//                         newMessages.push({
//                             text: messageText.substring(0, currentIndex + 1),
//                             isUserMessage: false,
//                             isLoading: true
//                         });
//                         return newMessages;
//                     });
//                     currentIndex++;
//                 } else {
//                     clearInterval(interval);
//                     resolve();
//                 }
//             }, delay);
//         });
//     };

//     const storeMessage = async (message, isUserMessage) => {
//         try {
//             const username = localStorage.getItem('username');
//             const password = localStorage.getItem('password');

//             if (!username || !password) {
//                 console.error('Username or password not found in localStorage');
//                 return;
//             }

//             await axios.post('https://n6nf7fbb02.execute-api.us-east-1.amazonaws.com/prod/chat', {
//                 action: 'store',
//                 email: username,
//                 password: password,
//                 sessionId: sessionId,
//                 message: message,
//                 isUserMessage: isUserMessage
//             });
//         } catch (error) {
//             console.error('Error storing message:', error);
//         }
//     };

//     const VideoVerificationCard = ({ link, onVerificationComplete }) => (
//         <button className="video-verification-card" onClick={() => {
//             setFacialAuthLink(link);
//             setShowFacialAuth(true);
//         }}>
//             Face Recognition
//         </button>
//     );

//     const handleMessageSend = async (input, displayMessage = true, actualOTP = null) => {
//         if (!displayMessage) {
//             if (initialPromptProcessed) {
//                 return;
//             }

//             setIsLoading(true);
//             try {
//                 const client = new BedrockAgentRuntimeClient({
//                     region: "us-east-1",
//                     credentials: {
//                         accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//                         secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
//                     }
//                 });

//                 const command = new InvokeAgentCommand({
//                     agentId: "U3YHVQFHVA",
//                     agentAliasId: "GX5MSL1QQU",
//                     sessionId: sessionId,
//                     inputText: input
//                 });

//                 const response = await client.send(command);
//                 console.log('API Response:', response);

//                 let fullResponse = '';
//                 const decoder = new TextDecoder('utf-8');

//                 if (response.completion) {
//                     for await (const event of response.completion) {
//                         if (event.chunk && event.chunk.bytes) {
//                             const byteArray = new Uint8Array(event.chunk.bytes);
//                             fullResponse += decoder.decode(byteArray, { stream: true });
//                         }
//                     }

//                     await processAndDisplayResponse(fullResponse, true);
//                     setInitialPromptProcessed(true);
//                 } else {
//                     console.error('Unexpected API response structure:', response);
//                 }
//             } catch (error) {
//                 console.error("Error:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//             return;
//         }

//         if (input === "User verified successfully." && hasSentVerificationMessage) {
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const newMessage = { text: actualOTP ? "Done!" : input, isUserMessage: true };
//             setMessages(prevMessages => [
//                 ...prevMessages,
//                 newMessage,
//                 { text: <DotLoader />, isUserMessage: false, isLoading: true }
//             ]);
//             await storeMessage(input, true);

//             const client = new BedrockAgentRuntimeClient({
//                 region: "us-east-1",
//                 credentials: {
//                     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//                     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
//                 }
//             });

//             const command = new InvokeAgentCommand({
//                 agentId: "U3YHVQFHVA",
//                 agentAliasId: "GX5MSL1QQU",
//                 sessionId: sessionId,
//                 inputText: actualOTP ? input : newMessage.text
//             });

//             const response = await client.send(command);
//             console.log('API Response:', response);

//             let fullResponse = '';
//             const decoder = new TextDecoder('utf-8');

//             if (response.completion) {
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

//                 await typingEffect(fullResponse);
//                 await processAndDisplayResponse(fullResponse, true);
//             } else {
//                 console.error('Unexpected API response structure:', response);
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             const errorMessage = "An error occurred while fetching the response.";

//             setMessages(prevMessages => {
//                 const newMessages = prevMessages.slice(0, -1);
//                 newMessages.push({ text: errorMessage, isUserMessage: false });
//                 return newMessages;
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const processAndDisplayResponse = async (fullResponse, displayMessage) => {
//         console.log("processAndDisplayResponse called with:", fullResponse, displayMessage);

//         const isOptionMessage = fullResponse.includes("application") || fullResponse.includes("Application");
//         const isOTPMessage = fullResponse.includes("enter the OTP") || fullResponse.includes("invalid") || fullResponse.includes("expired");
//         const isTicketMessage = fullResponse.includes("The Jira ticket was created successfully!");
//         const isVideoVerificationMessage = fullResponse.includes("video verification");
//         const videoVerificationLink = isVideoVerificationMessage ? fullResponse.match(/https:\/\/\S+/)?.[0]?.split(' ')[0] : null;

//         setMessages((prevMessages) => {
//             if (!displayMessage) {
//                 return prevMessages;
//             }

//             const newMessages = [...prevMessages.slice(0, -1)];

//             const responseMessage = {
//                 text: fullResponse,
//                 isUserMessage: false,
//                 showOptions: isOptionMessage,
//                 showOTP: isOTPMessage,
//                 showVideoVerification: isVideoVerificationMessage,
//                 link: videoVerificationLink,
//                 videoVerificationCard: null,
//                 ticketInfo: null,
//             };

//             if (isVideoVerificationMessage && !hasShownVideoVerification) {
//                 responseMessage.videoVerificationCard = (
//                     <div>
//                         <VideoVerificationCard link={videoVerificationLink} />
//                     </div>
//                 );
//                 setHasShownVideoVerification(true);
//             }

//             if (isTicketMessage) {
//                 const linkMatch = fullResponse.match(/https:\/\/\S+/);
//                 const link = linkMatch ? linkMatch[0].split(' ')[0] : '';
//                 const assignedToMatch = fullResponse.match(/https:\/\/([^\.\n]+)/);
//                 const ticketNoMatch = link.match(/([A-Z]+-\d+)/);
//                 const assignedTo = assignedToMatch ? assignedToMatch[1].trim() : 'Unknown';
//                 const ticketNo = ticketNoMatch ? ticketNoMatch[1] : 'Unknown';
//                 const now = new Date();
//                 const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString();

//                 responseMessage.ticketInfo = { showTicket: true, assignedTo, ticketNo, link, time };
//             }

//             newMessages.push(responseMessage);

//             return newMessages;
//         });

//         setShowOTP(isOTPMessage);

//         if (displayMessage) {
//             await storeMessage(fullResponse, false);
//         }
//     };

   
//     const ChatInput = ({ onSend, isLoading, isOTPActive }) => {
//         const [input, setInput] = useState('');

//         const handleSubmit = (e) => {
//             e.preventDefault();
//             if (!isLoading && input.trim()) {
//                 onSend(input);
//                 setInput('');
//             }
//         };

//         const handleKeyDown = (e) => {
//             if (e.key === 'Enter') {
//                 e.preventDefault();
//                 handleSubmit(e);
//             }
//         };

//         return (
//             <form onSubmit={handleSubmit} className="chat-input-container">
//                 <button type="button" onClick={handleAttachFile} className="attach-button">
//                     <img src={Icon7} alt="Attach" className="attach-icon" />
//                 </button>
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     placeholder="Ask BART Buddy"
//                     disabled={isLoading || isOTPActive}
//                     className="chat-input"
//                 />
//                 <button type="submit" disabled={isLoading || isOTPActive} className="send-button">
//                     <img src={Icon8} alt="Send" className="send-icon" />
//                 </button>
//             </form>
//         );
//     };

//     return (
//         <div className="agent-container">
//             <LeftPanel />
//             <div className="chat-container">
//                 <div className="chat-header">
//                     Password Reset
//                 </div>
//                 <div className="chat-messages">
//                     {messages.map((message, index) => (
//                         <ChatMessage key={index} message={message} userName="Floyd Miles" />
//                     ))}
//                     <div ref={endOfMessagesRef} />
//                 </div>
//                 <ChatInput onSend={handleMessageSend} isLoading={isLoading} isOTPActive={showOTP} />
//             </div>
//             {showFacialAuth && (
//                 <div className="facial-auth-overlay">
//                     <FacialAuthComponent
//                         link={facialAuthLink}
//                         onClose={handleAuthClose}
//                         onComplete={handleAuthComplete}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Agent;






