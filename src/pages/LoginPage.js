import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';
import Webcam from 'react-webcam';
import trainLogo from '../assets/image 45.svg';
import background from '../assets/b1.jpg';
import successIcon from '../assets/success-icon.png';
import errorIcon from '../assets/error-icon.png'; // Make sure you have an error icon
import { Buffer } from 'buffer';

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
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        zIndex: 2,
        marginBottom: '20px',
    },
    trainLogo: {
        width: '120px',
        height: '120px',
    },
    profileText: {
        color: '#fff',
        fontSize: '40px',
        fontWeight: 'bold',
        marginLeft: '20px',
    },
    loginBox: {
        position: 'relative',
        zIndex: 2,
        width: '350px',
        padding: '25px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
    },
    switchBar: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '20px',
        overflow: 'hidden',
    },
    switchOption: {
        flex: 1,
        padding: '10px 0',
        cursor: 'pointer',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        transition: 'background-color 0.3s ease',
    },
    switchOptionInactive: {
        backgroundColor: '#ccc',
        color: '#333',
    },
    webcamContainer: {
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    circularWebcam: {
        position: 'relative',
        borderRadius: '50%',
        overflow: 'hidden',
        width: '200px',
        height: '200px',
        border: '5px solid #007bff',
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'transparent', // Optional: Remove if unnecessary
    },
    photoPreview: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: '50%',
    },
    successIcon: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        width: '40px',
        height: '40px',
    },
    errorIcon: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        width: '40px',
        height: '40px',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '20px',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '15px',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '20px',
        marginBottom: '15px',
        fontSize: '16px',
    },
    linkContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontSize: '14px',
    },

};

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
});
const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

const LoginPage = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [capturedImage, setCapturedImage] = useState(null);
    const [isPhotoLogin, setIsPhotoLogin] = useState(false);
    const [error, setError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(null); // Change to null for initial state
    const [isWebcamEnabled, setIsWebcamEnabled] = useState(true);
    const navigate = useNavigate();
    const webcamRef = useRef(null);

    const capture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);
            setIsWebcamEnabled(false);
        }
    };

    const handleLogin = async () => {
        setError('');
        setLoginSuccess(null); // Reset success status before login attempt
        try {
            if (!isPhotoLogin) {
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
            } else {
                if (capturedImage) {
                    const allUsersParams = {
                        Bucket: 'face-authen',
                        Prefix: 'facialdata/profile_images/',
                    };
                    const allUsers = await s3.listObjectsV2(allUsersParams).promise();

                    let authenticated = false;

                    for (let item of allUsers.Contents) {
                        const photoKey = item.Key;
                        const photoData = await s3.getObject({ Bucket: 'face-authen', Key: photoKey }).promise();

                        const base64Image = capturedImage.split(",")[1];
                        const binaryImage = Buffer.from(base64Image, 'base64');

                        const params = {
                            SourceImage: {
                                Bytes: binaryImage
                            },
                            TargetImage: {
                                Bytes: photoData.Body
                            }
                        };

                        try {
                            const result = await rekognition.compareFaces(params).promise();

                            if (result.FaceMatches && result.FaceMatches.length > 0) {
                                authenticated = true;
                                break;
                            }
                        } catch (rekognitionErr) {
                            console.error('Rekognition Error:', rekognitionErr);
                            setError('Face recognition service failed. Please try again.');
                            return;
                        }
                    }

                    if (authenticated) {
                        setIsAuthenticated(true);
                        setLoginSuccess(true);
                        setTimeout(() => {
                            navigate('/');
                        }, 1000);
                    } else {
                        setLoginSuccess(false);
                        setError('Face recognition failed. Please try again.');
                    }
                } else {
                    setError('Please capture a photo.');
                }
            }
        } catch (err) {
            if (err.name === 'CredentialsError') {
                setError('Authentication failed. Please check your AWS credentials.');
            } else {
                setError('Login failed. Please try again.');
            }
            console.error('Login Error:', err);
        }
    };

    const handleSwitch = (type) => {
        setIsPhotoLogin(type === 'photo');
        setError('');
        if (type === 'photo') {
            setIsWebcamEnabled(true);
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
                <div style={styles.switchBar}>
                    <div
                        style={{
                            ...styles.switchOption,
                            ...(isPhotoLogin ? styles.switchOptionInactive : {}),
                        }}
                        onClick={() => handleSwitch('email')}
                    >
                        Email/Password
                    </div>
                    <div
                        style={{
                            ...styles.switchOption,
                            ...(isPhotoLogin ? {} : styles.switchOptionInactive),
                        }}
                        onClick={() => handleSwitch('photo')}
                    >
                        Photo Login
                    </div>
                </div>
                {isPhotoLogin ? (
                    <div style={styles.webcamContainer}>
                        {isWebcamEnabled && (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                style={styles.circularWebcam}
                            />
                        )}
                        {capturedImage && (
                            <div style={styles.circularWebcam}>
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    style={styles.photoPreview}
                                />
                                {loginSuccess === true && (
                                    <img
                                        src={successIcon}
                                        alt="Success"
                                        style={styles.successIcon}
                                    />
                                )}
                                {loginSuccess === false && (
                                    <img
                                        src={errorIcon}
                                        alt="Error"
                                        style={styles.errorIcon}
                                    />
                                )}
                            </div>
                        )}
                        <button style={styles.button} onClick={capture}>
                            Capture Photo
                        </button>
                        <button style={styles.button} onClick={handleLogin}>
                            Login
                        </button>
                    </div>
                ) : (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            style={styles.button}
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                        <div style={styles.linkContainer}>
                            <a href="/signup" style={styles.link}>
                                New User Signup
                            </a>
                            <a href="/forgot-password" style={styles.link}>
                                Forgot Password
                            </a>
                        </div>
                    </>
                )}
                {loginSuccess === true && <img src={successIcon} alt="Success" style={styles.successIcon} />}
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            </div>
        </div>
    );
};

export default LoginPage;
