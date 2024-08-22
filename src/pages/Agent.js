import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';

const Agent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [messages, setMessages] = useState([]);
    const endOfMessagesRef = useRef(null);
    const hasSentInitialMessage = useRef(false);
    const typingTimeoutRef = useRef(null); // Ref to manage typing timeout
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // Added OTP state

    const [showOTP, setShowOTP] = useState(false);

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
            handleMessageSend(initialPrompt);
            hasSentInitialMessage.current = true;
        }
    }, [sessionId]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);





    const OptionCard = ({ option, onClick }) => (
        <div
            onClick={onClick}
            style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                width: '100%',
                maxWidth: '300px',
                backgroundColor: '#e9ecef',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '16px',
                border: '1px solid #ccc',
                color: '#007bff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d6d6d6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
        >
            <span>{option.text}</span>
            <span>&rarr;</span>
        </div>
    );

    const OTPInputCard = ({ onSubmitOTP, otp, setOtp }) => {
        const inputRefs = useRef([]);
        const [isMasked, setIsMasked] = useState(true);

        useEffect(() => {
            // Focus on the first input initially
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus();
            }
        }, []);

        useEffect(() => {
            // Automatically move focus to the next input field when otp changes
            const firstEmptyIndex = otp.findIndex(value => value === '');
            if (firstEmptyIndex >= 0 && inputRefs.current[firstEmptyIndex]) {
                inputRefs.current[firstEmptyIndex].focus();
            }
        }, [otp]);

        const handleChange = (index, value) => {
            const newOtp = otp.slice();
            newOtp[index] = value.slice(-1); // Ensure only one character is added
            setOtp(newOtp);
        };

        const handleSubmit = () => {
            handleMessageSend(otp.join(''), true);
        };

        const handleKeyDown = (index, e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
            }
        };

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginBottom: '10px',
                padding: '20px',
                //backgroundColor: '#f8f8f8',
                borderRadius: '8px',
                //boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px',
            }}>
                <div style={{
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: '#333',
                    textAlign: 'left',
                    width: '100%',
                    paddingLeft: '10px',
                }}>
                    Please enter below
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: '10px',
                    gap: '10px',
                    paddingLeft: '10px',
                }}>
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            value={isMasked ? (value ? '*' : '') : value}  // Display '' if value exists
                            onChange={(e) => {
                                handleChange(index, e.target.value);
                                if (e.target.value && index < otp.length - 1) {
                                    // Move to the next input field if value is not empty and current index is not the last
                                    inputRefs.current[index + 1]?.focus();
                                }
                            }}
                            maxLength="1"
                            ref={el => inputRefs.current[index] = el}
                            style={{
                                width: '30px',
                                height: '40px',
                                textAlign: 'center',
                                fontSize: '25px',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '5px',
                                color: '#007bff',
                                fontWeight: '600',
                            }}
                            onFocus={(e) => e.target.select()}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                    ))}
                    <IconButton onClick={() => setIsMasked(!isMasked)}>
                        {isMasked ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </div>
                <button
                    onClick={handleSubmit}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        alignSelf: 'flex-start',
                    }}
                >
                    Submit
                </button>
            </div>
        );
    };

    const TicketCard = ({ ticketNo, link, assignedTo, time }) => (
        <div
            style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '-10px',
                marginTop: '-10px',
                marginLeft: '-20px',
                marginRight: '-10px',
                width: '100%',
                maxWidth: '500px',
                padding: '10px 45px',
                borderRadius: '10px',
                fontSize: '16px',
                border: '1px solid #001f3f',
                color: '#fff',
                backgroundColor: '#001f3f',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3A5D80'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#001f3f'}
            onClick={() => window.open(link, '_blank')}
        >
            <div style={{ display: 'flex', width: '100%', marginBottom: '8px' }}>
                <div style={{ flex: 1, fontWeight: 'bold' }}>Ticket No:</div>
                <div style={{ flex: 1, fontWeight: 'bold' }}>Assigned To:</div>
            </div>
            <div style={{ display: 'flex', width: '100%', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>{ticketNo}</div>
                <div style={{ flex: 1 }}>{assignedTo}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ fontSize: '13px', color: '#fafafa' }}>{time}</div>
                <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>View Ticket</a>

            </div>
        </div>
    );

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '7px', padding: '0', background: '#fff', }}>
            <Dot>•</Dot>
            <Dot>•</Dot>
            <Dot>•</Dot>

        </div>
    );



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
                username: username,
                password: password,
                sessionId: sessionId,
                message: message,
                isUserMessage: isUserMessage
            });
        } catch (error) {
            console.error('Error storing message:', error);
        }
    };


    const handleMessageSend = async (input, actualOTP = null) => {
        setIsLoading(true);

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
            agentAliasId: "5OMM0I4NH3",
            sessionId: sessionId,
            inputText: actualOTP ? input : newMessage.text  // Use actual OTP if present
        });

        try {
            if (actualOTP) {
                console.log("OTP received by the agent:", actualOTP); // Log the OTP
            }

            let fullResponse = '';
            const decoder = new TextDecoder('utf-8');

            const response = await client.send(command);
            console.log('API Response:', response);

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

                const isOptionMessage = fullResponse.includes("Can you please provide me with the application for which you need to change the password") || fullResponse.includes("Can you please provide me with the following details? - Application for which the password needs to be changed");
                const isOTPMessage = fullResponse.includes("Can you please provide me with the correct OTP?") || fullResponse.includes("An OTP has been sent to your email:");
                const isTicketMessage = fullResponse.includes("The Jira ticket was created successfully!");

                await typingEffect(fullResponse);

                setMessages(prevMessages => {
                    const newMessages = prevMessages.slice(0, -1);
                    newMessages.push({
                        text: fullResponse,
                        isUserMessage: false,
                        showOptions: isOptionMessage,
                        showOTP: isOTPMessage
                    });
                    return newMessages;

                });
                if (isTicketMessage) {
                    console.log("Full Response:", fullResponse);

                    // Extract the URL from 'https://' up to the first space
                    const linkMatch = fullResponse.match(/https:\/\/\S+/);
                    const link = linkMatch ? linkMatch[0].split(' ')[0] : '';

                    // Extract assignedTo and ticketNo using the link or fullResponse
                    const assignedToMatch = fullResponse.match(/https:\/\/([^\.\n]+)/);
                    const ticketNoMatch = link.match(/([A-Z]+-\d+)/);

                    console.log("Link:", link);
                    console.log("Assigned To Match:", assignedToMatch);
                    console.log("Ticket No Match:", ticketNoMatch);

                    const assignedTo = assignedToMatch ? assignedToMatch[1].trim() : 'Unknown';
                    const ticketNo = ticketNoMatch ? ticketNoMatch[1] : 'Unknown';

                    // Get the current time
                    const now = new Date();
                    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString();

                    console.log("Assigned To:", assignedTo);
                    console.log("Ticket No:", ticketNo);
                    console.log("time:", time);

                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: '', showTicket: true, assignedTo, ticketNo, link, time }
                    ]);
                }




                setShowOTP(isOTPMessage);
                await storeMessage(fullResponse, false);

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


            await storeMessage(errorMessage, false);
        } finally {
            setIsLoading(false);
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
            <div style={styles.chatInputWrapper}>
                <button style={styles.chatButton} onClick={handleAttachFile}>
                    <img src={require('../assets/plus.svg').default} alt="Attach File" style={styles.icon} />
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    style={styles.chatInput}
                    disabled={isOTPActive} // Disable input when OTP is active
                />
                <button style={styles.chatButton} onClick={handleSubmit} disabled={isLoading || isOTPActive}>
                    <img src={require('../assets/arrow-up-right.svg').default} alt="Send Message" style={styles.icon} />
                </button>
            </div>
        );
    };

    const styles = {
        chatInputWrapper: {
            position: 'sticky',
            bottom: '0',
            left: '20px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#f8f8f8',
            borderTop: '1px solid #ddd',
            borderRadius: '20px',
            boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
            width: 'calc(100% - 40px)',
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
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px',
        },


    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100vh',
            boxSizing: 'border-box',
            padding: '20px',
            backgroundColor: '#fff',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flexGrow: 1,
                width: '100%',
                maxWidth: '1200px',
                overflowY: 'auto',
                marginBottom: '20px',
            }}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            alignSelf: message.isUserMessage ? 'flex-end' : 'flex-start',
                            backgroundColor: message.isUserMessage ? '#001F3F' : '#f8f8f8',
                            color: message.isUserMessage ? '#fff' : '#000',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            marginBottom: '10px',
                            maxWidth: '80%',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {message.text}
                        {message.isLoading && message.typingEffect}


                        {message.showOptions && (
                            <div>
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
                                otp={otp} // Pass otp state
                                setOtp={setOtp} // Pass setOtp function
                                onSubmitOTP={(displayText) => setMessages(prevMessages => [...prevMessages, { text: displayText, isUserMessage: true }])} // Update the message display with "Done!"
                            />
                        )}
                        {message.showTicket && (
                            <TicketCard
                                ticketNo={message.ticketNo}
                                link={message.link}
                                assignedTo={message.assignedTo} // Ensure this prop is included
                                time={message.time}  // Use the dynamically generated time

                            />
                        )}
                    </div>
                ))}
                <div ref={endOfMessagesRef} />
            </div>
            <ChatInput onSend={handleMessageSend} isLoading={isLoading} isOTPActive={showOTP} />
        </div>
    );
};

export default Agent;