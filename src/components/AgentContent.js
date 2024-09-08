import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import FacialAuthComponent from '../components/FacialAuthComponent';
import LeftPanel from "../components/LeftPanel";
import "../styles/common.css";
import DashboardContent from "../components/AgentContent";
import { useNavigate } from "react-router-dom";
import Icon8 from "../assets/arrow-circle-up.svg";
import LogoutIcon from "../assets/Genie.svg";
import Icon7 from "../assets/plus-circle.svg";
import "../styles/common.css";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const AgentContent = () => {
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
    const [chatMessage, setChatMessage] = useState("");
    const options = [
        { id: 1, text: 'Email' },
        { id: 2, text: 'Employee Portal' },
        { id: 3, text: 'HR Management' },
        { id: 4, text: 'Project Management Tools' },
        { id: 5, text: 'Other' }
    ];
    const location = useLocation();
    const initialPrompt = location.state?.initialPrompt || 'Hey there, I need to reset my password';



    useEffect(() => {
        setSessionId(uuidv4());
        handleMessageSend1(initialPrompt, false);
    }, []);

    const handleMessageSend = () => {
        setMessages(e => [...messages, {text: chatMessage}]);
        handleMessageSend1(chatMessage, false);
    }


    useEffect(() => {
        if (sessionId && !hasSentInitialMessage.current) {

            handleMessageSend1(initialPrompt, false);
            hasSentInitialMessage.current = true;
        }
    }, [sessionId, initialPrompt]);

    const handleMessageSend1 = async (input, displayMessage = true, actualOTP = null) => {
        if (!displayMessage) {

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
                    sessionId: uuidv4(),
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
                    setMessages(e => [...messages, {text: fullResponse}]);
                    
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

        
    };

    useEffect(() => {
        setSessionId(uuidv4());
    }, []);

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

    return (
        <div className="content-box" style={{ position: 'relative' }}>
            <div className="logout-container">
                <div>

                </div>

            </div>

            <div style={{color:'white'}}>
                {messages.map((message, index) => (
                    <div key={index}>
                        {message.text}
                    </div>
                ))}
            </div>

            <div className="chat" style={{ position: 'absolute' }}>
                <img src={Icon7} alt="Icon 7" />
                
                <input type="text" placeholder="Ask BART Genie" 
                value={chatMessage} onChange={e => setChatMessage(() => e.target.value)}/>
                <img src={Icon8} alt="Icon 8"  onClick={handleMessageSend}
                className="template-icon1" />
                
            </div>
        </div>
    )
}

export default AgentContent;