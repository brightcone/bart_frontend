import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';
import Webcam from 'react-webcam';
import backgroundImage from '../assets/sparkles.svg'; // Updated to use sparkles.svg
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import eye icons
import Genie from '../assets/Genie.svg';
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '110vh',
        backgroundColor: 'black',
        backgroundImage: `url(${backgroundImage})`, // Updated to use sparkles.svg
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        width: '100vw',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    signupBox: {
        width: '360px',
        padding: '32px',
        backgroundColor: '#1F1F1F',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        color:'white',
        zIndex: 2,
        overflowY: 'fixed', // Enable vertical scrolling if needed
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px',
    },
    trainLogo: {
        width: '50px',
        height: '50px',
        marginRight: '10px',
    },
    profileText: {
        color: 'white', // Updated to white for consistency
        fontSize: '24px',
        fontWeight: 'bold',
    },
    input: {
        width: '95%',
        padding: '12px 16px',
        marginBottom: '24px',
        backgroundColor: '#333',
        border: 'none',
        borderRadius: '30px',
        color: 'white',
        fontSize: '16px',
    },
    button: {
        width: '100%',
        padding: '12px 16px',
        backgroundColor: 'white',
        border: 'none',
        borderRadius: '30px',
        color: 'black',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginBottom: '15px',
    },
    webcamContainer: {
        marginBottom: '15px',
    },
    errorBox: {
        color: 'red',
        marginBottom: '15px',
    },
    linkContainer: {
        marginTop: '20px',
    },
    link: {
        color: '#6F6AF8', // Updated to match the original link color
        textDecoration: 'none',
    },
    passwordToggle: {
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
    },
    inputContainer: {
        position: 'relative',
    },
    passwordInput: {
        width: '90%',
        padding: '12px 16px',
        paddingRight: '30px', // Adjust padding to make space for the icon
        marginBottom: '24px',
        backgroundColor: '#333',
        border: 'none',
        borderRadius: '30px',
        color: 'white',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
    },
};

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState('');
    const [cameraOn, setCameraOn] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State for confirm password visibility
    const navigate = useNavigate();
    const webcamRef = useRef(null);

    const capture = () => {
        setCameraOn(true); // Turn on the camera

        // Delay capture to give the webcam time to initialize
        setTimeout(() => {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    setCapturedImage(imageSrc);
                    setCameraOn(false); // Turn off the camera after capturing
                } else {
                    console.error('Failed to capture image.');
                }
            } else {
                console.error('Webcam reference is null.');
            }
        }, 500); // Delay capture by 500ms
    };

    

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword || !capturedImage) {
            setError('Please fill all fields and capture a photo.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long and contain at least one number.');
            return;
        }

        try {
            const response = await fetch('https://bqiqiw7dn8.execute-api.us-east-1.amazonaws.com/prod/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to create user');
            }
    
            const result = await response.json();
            console.log('User created:', result);
            
            // Decode base64 image
            const base64Image = capturedImage.split(',')[1];
            const binaryImage = atob(base64Image);
            const arrayBuffer = new ArrayBuffer(binaryImage.length);
            const uint8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < binaryImage.length; i++) {
                uint8Array[i] = binaryImage.charCodeAt(i);
            }

            // Create a Blob from the image data
            const blob = new Blob([uint8Array], { type: 'image/jpeg' });

            // Store captured image in S3
            const imageParams = {
                Bucket: process.env.REACT_APP_S3_BUCKET,
                Key: `facialdata/profile_images/${email}.jpg`, // Separate folder for images
                Body: blob,
                ContentType: 'image/jpeg',
            };

            await s3.upload(imageParams).promise();

            // Store user details in S3
            const userParams = {
                Bucket: process.env.REACT_APP_S3_BUCKET,
                Key: `facialdata/data/${email}.json`, // Separate folder for data
                Body: JSON.stringify({
                    email,
                    password,
                    profilePhoto: `facialdata/profile_images/${email}.jpg`,
                    fullName,
                    phoneNumber,
                }),
                ContentType: 'application/json',
            };

            await s3.upload(userParams).promise();

            alert('Signup successful');
            navigate('/login');
        } catch (err) {
            console.error('Signup failed:', err);
            setError('Signup failed. Please try again later.');
        }
    };

    const validatePassword = (password) => {
        return password.length >= 8 && /\d/.test(password);
    };

 
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSignup();
        }
    };

    const isButtonDisabled = () => {
        const isEmailEmpty = !email;
        const isPasswordInvalid = !validatePassword(password);
        const isPasswordMismatch = password !== confirmPassword;
        const isCapturedImageMissing = !capturedImage;

        return isEmailEmpty || isPasswordInvalid || isPasswordMismatch || isCapturedImageMissing;
    };

    return (
        <div style={styles.container}>
            <div style={styles.overlay}></div>
            <div style={styles.signupBox}>
                <div style={styles.header}>
                    <img src={Genie} alt="Genie Logo" style={styles.trainLogo} />
                    <div style={styles.profileText}>BARTGenie</div>
                </div>
                <h2>Signup</h2>
                <input
                    type="text"
                    placeholder="Full Name"
                    style={styles.input}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    style={styles.input}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <input
                    type="email"
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div style={styles.inputContainer}>
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Password"
                        style={styles.passwordInput}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <FontAwesomeIcon
                        icon={passwordVisible ? faEye : faEyeSlash}
                        style={styles.passwordToggle}
                        onClick={() => setPasswordVisible(!passwordVisible)}
                    />
                </div>
                <div style={styles.inputContainer}>
                    <input
                        type={confirmPasswordVisible ? 'text' : 'password'}
                        placeholder="Re-enter Password"
                        style={styles.passwordInput}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <FontAwesomeIcon
                        icon={confirmPasswordVisible ? faEye : faEyeSlash}
                        style={styles.passwordToggle}
                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    />
                </div>
                {cameraOn && (
                    <div style={styles.webcamContainer}>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                        />
                    </div>
                )}
                <button
                    style={styles.button}
                    onClick={capture}
                >
                    Capture Photo
                </button>
                {capturedImage && <img src={capturedImage} alt="Captured" style={{ width: '100%', marginBottom: '10px' }} />}
                {error && <div style={styles.errorBox}>{error}</div>}
                <button
                    style={styles.button}
                    onClick={handleSignup}
                    disabled={isButtonDisabled()}
                >
                    Signup
                </button>
                <div style={styles.linkContainer}>
                    <a href="/login" style={styles.link}>
                        Already have an account? Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;








    


