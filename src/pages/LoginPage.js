import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';
import Webcam from 'react-webcam';
// import trainLogo from '../assets/image 45.svg';
// import background from '../assets/b1.jpg';
import successIcon from '../assets/success-icon.png';
import backgroundImage from '../assets/sparkles.svg';
import Genie from '../assets/Genie.svg';
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
        height: '100vh',
        width: '100vw',
        backgroundColor: 'black',
        backgroundImage: `url(${backgroundImage})`, // Updated to use sparkles.svg
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
    },
    videoContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F1F1F',
        width:'50%'
        
    },
    video: {
        width: '80%',
        height: '90%',
        objectFit: 'cover',
        borderRadius: '30px',
    },
    loginContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#1F1F1F',
        boxShadow: '-4px 0 6px rgba(0, 0, 0, 0.3)',
        backgroundImage:`url(${backgroundImage})`
    },
    loginBox: {
        width: '360px',
        padding: '32px',
        backgroundColor: '#2C2C2C',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        color: 'white',
    },
    input: {
        width: '90%',
        padding: '12px',
        margin: '8px 0',
        borderRadius: '30px',
        border: '1px solid #333333',
        backgroundColor: '#2C2C2C',
        color: '#FFFFFF',
        fontSize: '16px',
    },
    button: {
        width: '100%',
        padding: '12px',
        margin: '16px 0',
        borderRadius: '30px',
        border: 'none',
        backgroundColor: 'white',  // White background
        color: 'black',           // Black text color
        fontSize: '16px',
        cursor: 'pointer',
    },
    linkContainer: {
        marginTop: '16px',
    },
    link: {
        color: 'white',
        textDecoration: 'underline',
    },
    switchContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    switchButton: {
        padding: '10px 20px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#333333',
        color: '#FFFFFF',
        margin: '0 10px',
    },
    switchActive: {
        backgroundColor: '#007bff',
    },
    webcamContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    instruction: {
        marginTop: '16px',
        color: '#FFFFFF',
        fontSize: '16px',
    },
    progressBar: {
        width: '100%',
        height: '8px',
        backgroundColor: '#333333',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '12px',
    },
    progress: {
        height: '100%',
        backgroundColor: '#007bff',
    },
    successIcon: {
        width: '50px',
        height: '50px',
        margin: '20px auto 0',
        transition: 'opacity 0.3s ease',
        opacity: 0,
    },
    successIconVisible: {
        opacity: 1,
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
            let matchedEmail = '';

            for (let item of allUsers.Contents) {
                const photoKey = item.Key;
                const photoData = await s3.getObject({ Bucket: 'face-authen', Key: photoKey }).promise();

                const compareFacesParams = {
                    SourceImage: { Bytes: binaryImage },
                    TargetImage: { Bytes: photoData.Body }
                };


                const compareFacesResult = await rekognition.compareFaces(compareFacesParams).promise();

                if (compareFacesResult.FaceMatches && compareFacesResult.FaceMatches.length > 0) {
                    const match = compareFacesResult.FaceMatches[0];
                    if (match.Face.Confidence > 90) {
                        faceMatchFound = true;
                        // Extract email from the photo key
                        matchedEmail = photoKey.split('/').pop().replace('.jpg', '');
                        break;
                    }
                }
            }

            if (faceMatchFound && matchedEmail) {
                setIsAuthenticated(true);
                setLoginSuccess(true);
                localStorage.setItem('username', matchedEmail);
                localStorage.setItem('password', password);
                // Note: We're not storing the password for facial recognition login
                stopAnalysis();
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                setError('Face not recognized or email not found. Please try again.');
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

        <div style={styles.videoContainer}>
                        <video
                            style={styles.video}
                            src='/videos/BART.mp4'
                            autoPlay
                            muted
                            loop
                        ></video>
            </div>
            <div style={styles.loginContainer}>
            <div style={styles.loginBox}>
                 <img src={Genie} alt="Genie Logo" style={styles.trainLogo} />
                <h2>Login</h2>
                <div style={styles.switchContainer}>
                    <button
                        style={{ ...styles.switchButton, ...(isPhotoLogin ? {} : styles.switchActive) }}
                        onClick={() => handleSwitch('email')}
                    >
                        Email
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
                            Enter
                        </button>
                    </>
                )}
                {loginSuccess && <img src={successIcon} alt="Success" style={{ ...styles.successIcon, ...styles.successIconVisible }} />}
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <div style={styles.linkContainer}>
                    <a href="/signup" style={styles.link}>
                        Forget your password?
                    </a>
                </div>
                <div style={styles.linkContainer}>
                    <a href="/signup" style={styles.link}>
                        Don't have an account? Signup
                    </a>
                </div>
            </div>
            </div>
        </div>
    );
};

export default LoginPage;

// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AWS from 'aws-sdk';
// import Webcam from 'react-webcam';
// import trainLogo from '../assets/image 45.svg';
// import background from '../assets/b1.jpg';
// import successIcon from '../assets/success-icon.png';
// import backgroundImage from '../assets/sparkles.svg'; 
// import { Buffer } from 'buffer';

// // Configure AWS SDK
// AWS.config.update({
//     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
//     region: process.env.REACT_APP_AWS_REGION,
// });

// const s3 = new AWS.S3();
// const rekognition = new AWS.Rekognition();
// const styles = {
//     container: {
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '110vh',
//         backgroundColor: 'black',
//         backgroundImage: `url(${backgroundImage})`, // Updated to use sparkles.svg
//         backgroundRepeat: 'repeat',
//         backgroundPosition: 'center',
//         backgroundSize: 'cover',
//         width: '100vw',
//         position: 'absolute',
//         top: 0,
//         left: 0,
//     },
//     overlay: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         zIndex: 1,
//     },
//     header: {
//         position: 'absolute',
//         top: '20px',
//         textAlign: 'center',
//         zIndex: 3,
//     },
//     trainLogo: {
//         width: '120px',
//         marginBottom: '10px',
//     },
//     profileText: {
//         color: '#FFFFFF',
//         fontSize: '24px',
//         fontWeight: 'bold',
//     },
//     loginBox: {
//         width: '360px',
//         padding: '32px',
//         backgroundColor: '#1F1F1F',
//         borderRadius: '16px',
//         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//         textAlign: 'center',
//         zIndex: 2,
//         color: 'white'
//     },
//     input: {
//         width: '90%',
//         padding: '12px',
//         margin: '8px 0',
//         borderRadius: '30px',
//         border: '1px solid #333333',
//         backgroundColor: '#2C2C2C',
//         color: '#FFFFFF',
//         fontSize: '16px',
//     },
//     button: {
//         width: '100%',
//         padding: '12px',
//         margin: '16px 0',
//         borderRadius: '30px',
//         border: 'none',
//         backgroundColor: 'white',  // White background
//         color: 'black',           // Black text color
//         fontSize: '16px',
//         cursor: 'pointer',
//     },
//     linkContainer: {
//         marginTop: '16px',
//     },
//     link: {
//         color: 'white',
//         textDecoration: 'none',
//     },
//     switchContainer: {
//         display: 'flex',
//         justifyContent: 'center',
//         marginBottom: '20px',
//     },
//     switchButton: {
//         padding: '10px 20px',
//         cursor: 'pointer',
//         border: 'none',
//         borderRadius: '8px',
//         backgroundColor: '#333333',
//         color: '#FFFFFF',
//         margin: '0 10px',
//     },
//     switchActive: {
//         backgroundColor: '#007bff',
//     },
//     webcamContainer: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//     },
//     instruction: {
//         marginTop: '16px',
//         color: '#FFFFFF',
//         fontSize: '16px',
//     },
//     progressBar: {
//         width: '100%',
//         height: '8px',
//         backgroundColor: '#333333',
//         borderRadius: '4px',
//         overflow: 'hidden',
//         marginTop: '12px',
//     },
//     progress: {
//         height: '100%',
//         backgroundColor: '#007bff',
//     },
//     successIcon: {
//         width: '50px',
//         height: '50px',
//         margin: '20px auto 0',
//         transition: 'opacity 0.3s ease',
//         opacity: 0,
//     },
//     successIconVisible: {
//         opacity: 1,
//     },
// };


// const LoginPage = ({ setIsAuthenticated }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isPhotoLogin, setIsPhotoLogin] = useState(false);
//     const [error, setError] = useState('');
//     const [loginSuccess, setLoginSuccess] = useState(false);
//     const [isAnalyzing, setIsAnalyzing] = useState(false);
//     const [instruction, setInstruction] = useState('');
//     const [progress, setProgress] = useState(0);
//     const navigate = useNavigate();
//     const webcamRef = useRef(null);
//     const analyzeIntervalRef = useRef(null);
//     const lastFacePositionRef = useRef(null);
//     const blinkCountRef = useRef(0);
//     const actionSequenceRef = useRef([]);

//     useEffect(() => {
//         if (isPhotoLogin) {
//             startLivenessCheck();
//         } else {
//             stopAnalysis();
//         }

//         return () => stopAnalysis();
//     }, [isPhotoLogin]);

//     const startLivenessCheck = () => {
//         setIsAnalyzing(true);
//         setProgress(0);
//         blinkCountRef.current = 0;
//         actionSequenceRef.current = generateActionSequence();
//         setInstruction(getNextInstruction());
//         analyzeIntervalRef.current = setInterval(analyzeFrame, 500);
//     };

//     const stopAnalysis = () => {
//         setIsAnalyzing(false);
//         if (analyzeIntervalRef.current) {
//             clearInterval(analyzeIntervalRef.current);
//         }
//     };

//     const generateActionSequence = () => {
//         const actions = ['left', 'right', 'blink'];
//         return actions.sort(() => 0.5 - Math.random()).slice(0, 3);
//     };

//     const getNextInstruction = () => {
//         const action = actionSequenceRef.current[0];
//         switch (action) {
//             case 'right': return 'Please turn your head to the left';
//             case 'left': return 'Please turn your head to the right';
//             case 'blink': return 'Please blink twice';
//             default: return 'Verifying...';
//         }
//     };
//     const TIMEOUT_DURATION = 60000; // 1 minute

//     useEffect(() => {
//         let timeout;

//         if (isPhotoLogin) {
//             timeout = setTimeout(() => {
//                 setError('Session timed out. Please try again.');
//                 stopAnalysis();
//             }, TIMEOUT_DURATION);
//         }

//         return () => {
//             clearTimeout(timeout);
//             stopAnalysis();
//         };
//     }, [isPhotoLogin]);

//     const analyzeFrame = async () => {
//         if (webcamRef.current) {
//             const imageSrc = webcamRef.current.getScreenshot();
//             if (imageSrc) {
//                 const base64Image = imageSrc.split(",")[1];
//                 const binaryImage = Buffer.from(base64Image, 'base64');

//                 try {
//                     const detectFacesParams = {
//                         Image: { Bytes: binaryImage },
//                         Attributes: ['ALL']
//                     };
//                     const detectFacesResult = await rekognition.detectFaces(detectFacesParams).promise();

//                     if (detectFacesResult.FaceDetails && detectFacesResult.FaceDetails.length > 0) {
//                         const faceDetails = detectFacesResult.FaceDetails[0];
//                         const currentAction = actionSequenceRef.current[0];

//                         if (currentAction === 'blink') {
//                             handleBlinkDetection(faceDetails);
//                         } else {
//                             handleHeadMovement(faceDetails, currentAction);
//                         }

//                         // Check if all actions are completed
//                         if (actionSequenceRef.current.length === 0) {
//                             // All actions completed, proceed with authentication
//                             await handlePhotoLogin(binaryImage);
//                         }
//                     } else {
//                         // Retry face detection if no face is detected
//                         setTimeout(() => {
//                             setError('No face detected. Please ensure your face is visible.');
//                         }, 5000); // Adjust delay as needed
//                     }
//                 } catch (error) {
//                     console.error('Error during face analysis:', error);
//                     setError('Face analysis failed. Please try again.');
//                 }
//             }
//         }
//     };



//     const handleBlinkDetection = (faceDetails) => {
//         if (faceDetails.EyesOpen.Value === false) {
//             blinkCountRef.current++;
//             if (blinkCountRef.current >= 2) {
//                 actionCompleted();
//             }
//         }
//     };

//     const handleHeadMovement = (faceDetails, expectedAction) => {
//         const { Pose } = faceDetails;
//         const threshold = 15; // degrees

//         let actionDetected = false;

//         switch (expectedAction) {
//             case 'left':
//                 actionDetected = Pose.Yaw <= -threshold;
//                 break;
//             case 'right':
//                 actionDetected = Pose.Yaw >= threshold;
//                 break;
//         }

//         if (actionDetected) {
//             actionCompleted();
//         }
//     };

//     const actionCompleted = () => {
//         actionSequenceRef.current.shift();
//         setProgress((prevProgress) => prevProgress + 100 / 3);
//         if (actionSequenceRef.current.length > 0) {
//             setInstruction(getNextInstruction());
//         } else {
//             setInstruction('Verifying...');
//         }
//     };

//     const handlePhotoLogin = async (binaryImage) => {
//         try {
//             const allUsersParams = {
//                 Bucket: 'face-authen',
//                 Prefix: 'facialdata/profile_images/',
//             };
//             const allUsers = await s3.listObjectsV2(allUsersParams).promise();
//             let faceMatchFound = false;
//             let matchedEmail = '';

//             for (let item of allUsers.Contents) {
//                 const photoKey = item.Key;
//                 const photoData = await s3.getObject({ Bucket: 'face-authen', Key: photoKey }).promise();

//                 const compareFacesParams = {
//                     SourceImage: { Bytes: binaryImage },
//                     TargetImage: { Bytes: photoData.Body }
//                 };


//                 const compareFacesResult = await rekognition.compareFaces(compareFacesParams).promise();

//                 if (compareFacesResult.FaceMatches && compareFacesResult.FaceMatches.length > 0) {
//                     const match = compareFacesResult.FaceMatches[0];
//                     if (match.Face.Confidence > 90) {
//                         faceMatchFound = true;
//                         // Extract email from the photo key
//                         matchedEmail = photoKey.split('/').pop().replace('.jpg', '');
//                         break;
//                     }
//                 }
//             }

//             if (faceMatchFound && matchedEmail) {
//                 setIsAuthenticated(true);
//                 setLoginSuccess(true);
//                 localStorage.setItem('username', matchedEmail);
//                 localStorage.setItem('password', password);
//                 // Note: We're not storing the password for facial recognition login
//                 stopAnalysis();
//                 setTimeout(() => {
//                     navigate('/');
//                 }, 1000);
//             } else {
//                 setError('Face not recognized or email not found. Please try again.');
//             }
//         } catch (err) {
//             console.error('Photo login error:', err);
//             setError('Photo login failed. Please try again.');
//         }
//     };


//     const handleEmailPasswordLogin = async () => {
//         setError('');
//         try {
//             if (email && password) {
//                 const userParams = {
//                     Bucket: 'face-authen',
//                     Key: `facialdata/data/${email}.json`,
//                 };

//                 try {
//                     const userData = await s3.getObject(userParams).promise();
//                     const user = JSON.parse(userData.Body.toString());

//                     if (user.password === password) {
//                         setIsAuthenticated(true);
//                         setLoginSuccess(true);
//                         localStorage.setItem('username', email);
//                         localStorage.setItem('password', password);
//                         setTimeout(() => {
//                             navigate('/');
//                         }, 1000);
//                     } else {
//                         setError('Invalid email or password.');
//                     }
//                 } catch (err) {
//                     if (err.code === 'NoSuchKey') {
//                         setError('User not found. Please check your email.');
//                     } else {
//                         throw err;
//                     }
//                 }
//             } else {
//                 setError('Please provide both email and password.');
//             }
//         } catch (err) {
//             console.error('Login Error:', err);
//             setError('Login failed. Please try again.');
//         }

//     };

//     const handleSwitch = (type) => {
//         setIsPhotoLogin(type === 'photo');
//         setError('');
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             handleEmailPasswordLogin();
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <div style={styles.overlay}></div>
//             <div style={styles.header}>
//                 <img src={trainLogo} alt="BART Logo" style={styles.trainLogo} />
//                 <div style={styles.profileText}>BARTGenie</div>
//             </div>
//             <div style={styles.loginBox}>
//                 <h2>Login</h2>
//                 <div style={styles.switchContainer}>
//                     <button
//                         style={{ ...styles.switchButton, ...(isPhotoLogin ? {} : styles.switchActive) }}
//                         onClick={() => handleSwitch('email')}
//                     >
//                         email
//                     </button>
//                     <button
//                         style={{ ...styles.switchButton, ...(isPhotoLogin ? styles.switchActive : {}) }}
//                         onClick={() => handleSwitch('photo')}
//                     >
//                         Photo Login
//                     </button>
//                 </div>
//                 {isPhotoLogin ? (
//                     <div style={styles.webcamContainer}>
//                         <Webcam
//                             audio={false}
//                             ref={webcamRef}
//                             screenshotFormat="image/jpeg"
//                             width="100%"
//                         />
//                         {isAnalyzing && (
//                             <>
//                                 <div style={styles.instruction}>{instruction}</div>
//                                 <div style={styles.progressBar}>
//                                     <div style={{ ...styles.progress, width: `${progress}%` }}></div>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 ) : (
//                     <>
//                         <input
//                             type="email"
//                             placeholder="Email"
//                             style={styles.input}
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             onKeyDown={handleKeyDown}
//                         />
//                         <input
//                             type="password"
//                             placeholder="Password"
//                             style={styles.input}
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             onKeyDown={handleKeyDown}
//                         />
//                         <button style={styles.button} onClick={handleEmailPasswordLogin}>
//                             Enter
//                         </button>
//                     </>
//                 )}
//                 {loginSuccess && <img src={successIcon} alt="Success" style={{ ...styles.successIcon, ...styles.successIconVisible }} />}
//                 {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
//                 <div style={styles.linkContainer}>
//                     <a href="/signup" style={styles.link}>
//                         Forget your password?
//                     </a>
//                 </div>
//                 <div style={styles.linkContainer}>
//                     <a href="/signup" style={styles.link}>
//                         Don't have an account? Signup
//                     </a>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;
