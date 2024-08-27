import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';
import Webcam from 'react-webcam';
import trainLogo from '../assets/image 45.svg';
import background from '../assets/b1.jpg';
import successIcon from '../assets/success-icon.png';
import { Buffer } from 'buffer';

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Increased opacity for a more dramatic effect
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        zIndex: 2,
        marginBottom: '15px',
        textAlign: 'center',
    },
    trainLogo: {
        width: '100px',
        height: '100px',
        marginRight: '15px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '50%',
        padding: '7px',
        objectFit: 'contain', // Ensures the entire image fits within the circle
    },


    profileText: {
        color: '#fff',
        fontSize: '45px',
        fontWeight: 'bold',
        textShadow: '2px 2px 10px rgba(0, 0, 0, 0.7)',
    },
    loginBox: {
        position: 'relative',
        zIndex: 2,
        width: '350px',
        padding: '40px 30px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent for modern look
        borderRadius: '15px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', // Enhanced shadow for a floating effect
        textAlign: 'center',
        backdropFilter: 'blur(10px)', // Added blur effect
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px', // Reduced margin
        borderRadius: '20px',
        border: '1px solid #ddd',
        fontSize: '14px',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '20px',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '10px', // Reduced margin
    },
    buttonHover: {
        backgroundColor: '#005bb5', // Hover effect
    },
    linkContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '5px',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontSize: '14px',
    },
    linkHover: {
        color: '#004a99', // Hover effect
    },
    webcamContainer: {
        marginBottom: '20px',
    },
    switchContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '15px', // Reduced margin
        backgroundColor: '#007bff', // Background color for the button bar
        borderRadius: '20px', // Rounded corners
        overflow: 'hidden', // Ensures buttons are rounded within the container
    },
    switchButton: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease', // Smooth color transition on hover
    },
    switchActive: {
        backgroundColor: '#0056b3', // Color on hover or active
    },
    successIcon: {
        display: 'none',
        width: '60px',
        height: '60px',
        margin: '20px auto',
    },
    successIconVisible: {
        display: 'block',
    },
    instruction: {
        fontSize: '20px',
        marginBottom: '20px',
        color: '#0066cc',
        fontWeight: 'bold',
    },
    progressBar: {
        width: '100%',
        height: '8px',
        backgroundColor: '#e0e0e0',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    },
    progress: {
        height: '100%',
        backgroundColor: '#007bff',
        borderRadius: '10px',
        transition: 'width 0.5s ease-in-out',
    },
};


const LoginPage = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPhotoLogin, setIsPhotoLogin] = useState(false);
    const [error, setError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [instruction, setInstruction] = useState('');
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const analyzeIntervalRef = useRef(null);
    const lastFacePositionRef = useRef(null);
    const blinkCountRef = useRef(0);
    const actionSequenceRef = useRef([]);

    useEffect(() => {
        if (isPhotoLogin) {
            startLivenessCheck();
        } else {
            stopAnalysis();
        }

        return () => stopAnalysis();
    }, [isPhotoLogin]);

    const startLivenessCheck = () => {
        setIsAnalyzing(true);
        setProgress(0);
        blinkCountRef.current = 0;
        actionSequenceRef.current = generateActionSequence();
        setInstruction(getNextInstruction());
        analyzeIntervalRef.current = setInterval(analyzeFrame, 500);
    };

    const stopAnalysis = () => {
        setIsAnalyzing(false);
        if (analyzeIntervalRef.current) {
            clearInterval(analyzeIntervalRef.current);
        }
    };

    const generateActionSequence = () => {
        const actions = ['left', 'right', 'blink'];
        return actions.sort(() => 0.5 - Math.random()).slice(0, 3);
    };

    const getNextInstruction = () => {
        const action = actionSequenceRef.current[0];
        switch (action) {
            case 'right': return 'Please turn your head to the left';
            case 'left': return 'Please turn your head to the right';
            case 'blink': return 'Please blink twice';
            default: return 'Verifying...';
        }
    };
    const TIMEOUT_DURATION = 60000; // 1 minute

    useEffect(() => {
        let timeout;

        if (isPhotoLogin) {
            timeout = setTimeout(() => {
                setError('Session timed out. Please try again.');
                stopAnalysis();
            }, TIMEOUT_DURATION);
        }

        return () => {
            clearTimeout(timeout);
            stopAnalysis();
        };
    }, [isPhotoLogin]);

    const analyzeFrame = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                const base64Image = imageSrc.split(",")[1];
                const binaryImage = Buffer.from(base64Image, 'base64');

                try {
                    const detectFacesParams = {
                        Image: { Bytes: binaryImage },
                        Attributes: ['ALL']
                    };
                    const detectFacesResult = await rekognition.detectFaces(detectFacesParams).promise();

                    if (detectFacesResult.FaceDetails && detectFacesResult.FaceDetails.length > 0) {
                        const faceDetails = detectFacesResult.FaceDetails[0];
                        const currentAction = actionSequenceRef.current[0];

                        if (currentAction === 'blink') {
                            handleBlinkDetection(faceDetails);
                        } else {
                            handleHeadMovement(faceDetails, currentAction);
                        }

                        // Check if all actions are completed
                        if (actionSequenceRef.current.length === 0) {
                            // All actions completed, proceed with authentication
                            await handlePhotoLogin(binaryImage);
                        }
                    } else {
                        // Retry face detection if no face is detected
                        setTimeout(() => {
                            setError('No face detected. Please ensure your face is visible.');
                        }, 5000); // Adjust delay as needed
                    }
                } catch (error) {
                    console.error('Error during face analysis:', error);
                    setError('Face analysis failed. Please try again.');
                }
            }
        }
    };



    const handleBlinkDetection = (faceDetails) => {
        if (faceDetails.EyesOpen.Value === false) {
            blinkCountRef.current++;
            if (blinkCountRef.current >= 2) {
                actionCompleted();
            }
        }
    };

    const handleHeadMovement = (faceDetails, expectedAction) => {
        const { Pose } = faceDetails;
        const threshold = 15; // degrees

        let actionDetected = false;

        switch (expectedAction) {
            case 'left':
                actionDetected = Pose.Yaw <= -threshold;
                break;
            case 'right':
                actionDetected = Pose.Yaw >= threshold;
                break;
        }

        if (actionDetected) {
            actionCompleted();
        }
    };

    const actionCompleted = () => {
        actionSequenceRef.current.shift();
        setProgress((prevProgress) => prevProgress + 100 / 3);
        if (actionSequenceRef.current.length > 0) {
            setInstruction(getNextInstruction());
        } else {
            setInstruction('Verifying...');
        }
    };

    const handlePhotoLogin = async (binaryImage) => {
        try {
            const allUsersParams = {
                Bucket: 'face-authen',
                Prefix: 'facialdata/profile_images/',
            };
            const allUsers = await s3.listObjectsV2(allUsersParams).promise();
            let faceMatchFound = false;

            for (let item of allUsers.Contents) {
                const photoKey = item.Key;
                const photoData = await s3.getObject({ Bucket: 'face-authen', Key: photoKey }).promise();

                const compareFacesParams = {
                    SourceImage: { Bytes: binaryImage },
                    TargetImage: { Bytes: photoData.Body }
                };

                const compareFacesResult = await rekognition.compareFaces(compareFacesParams).promise();

                // Ensure a high confidence score for the match
                if (compareFacesResult.FaceMatches && compareFacesResult.FaceMatches.length > 0) {
                    const match = compareFacesResult.FaceMatches[0];
                    if (match.Face.Confidence > 90) { // Adjust confidence threshold as needed
                        faceMatchFound = true;
                        break;
                    }
                }
            }

            if (faceMatchFound) {
                setIsAuthenticated(true);
                setLoginSuccess(true);
                localStorage.setItem('username', email);
                localStorage.setItem('password', password);
                stopAnalysis();
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                setError('Face not recognized. Please try again.');
            }
        } catch (err) {
            console.error('Photo login error:', err);
            setError('Photo login failed. Please try again.');
        }
    };


    const handleEmailPasswordLogin = async () => {
        setError('');
        try {
            if (email && password) {
                const userParams = {
                    Bucket: 'face-authen',
                    Key: `facialdata/data/${email}.json`,
                };

                try {
                    const userData = await s3.getObject(userParams).promise();
                    const user = JSON.parse(userData.Body.toString());

                    if (user.password === password) {
                        setIsAuthenticated(true);
                        setLoginSuccess(true);
                        localStorage.setItem('username', email);
                        localStorage.setItem('password', password);
                        setTimeout(() => {
                            navigate('/');
                        }, 1000);
                    } else {
                        setError('Invalid email or password.');
                    }
                } catch (err) {
                    if (err.code === 'NoSuchKey') {
                        setError('User not found. Please check your email.');
                    } else {
                        throw err;
                    }
                }
            } else {
                setError('Please provide both email and password.');
            }
        } catch (err) {
            console.error('Login Error:', err);
            setError('Login failed. Please try again.');
        }

    };

    const handleSwitch = (type) => {
        setIsPhotoLogin(type === 'photo');
        setError('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEmailPasswordLogin();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.overlay}></div>
            <div style={styles.header}>
                <img src={trainLogo} alt="BART Logo" style={styles.trainLogo} />
                <div style={styles.profileText}>BARTGenie</div>
            </div>
            <div style={styles.loginBox}>
                <h2>Login</h2>
                <div style={styles.switchContainer}>
                    <button
                        style={{ ...styles.switchButton, ...(isPhotoLogin ? {} : styles.switchActive) }}
                        onClick={() => handleSwitch('email')}
                    >
                        Email/Password
                    </button>
                    <button
                        style={{ ...styles.switchButton, ...(isPhotoLogin ? styles.switchActive : {}) }}
                        onClick={() => handleSwitch('photo')}
                    >
                        Photo Login
                    </button>
                </div>
                {isPhotoLogin ? (
                    <div style={styles.webcamContainer}>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                        />
                        {isAnalyzing && (
                            <>
                                <div style={styles.instruction}>{instruction}</div>
                                <div style={styles.progressBar}>
                                    <div style={{ ...styles.progress, width: `${progress}%` }}></div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button style={styles.button} onClick={handleEmailPasswordLogin}>
                            Login
                        </button>
                    </>
                )}
                {loginSuccess && <img src={successIcon} alt="Success" style={{ ...styles.successIcon, ...styles.successIconVisible }} />}
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <div style={styles.linkContainer}>
                    <a href="/signup" style={styles.link}>
                        Don't have an account? Signup
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;