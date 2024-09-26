import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';
import Webcam from 'react-webcam';
import trainLogo from '../assets/image 45.svg';
import background from '../assets/b1.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import eye icons
import { v4 as uuidv4 } from 'uuid';


const styles = {
    container: {
        display: 'flex',
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
    signupBox: {
        position: 'relative',
        width: '400px',
        maxHeight: '80vh', // Set a maximum height
        padding: '30px',
        backgroundColor: 'lightgray',
        borderRadius: '25px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        zIndex: 2,
        overflowY: 'auto', // Enable vertical scrolling if needed
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    trainLogo: {
        width: '50px',
        height: '50px',
        marginRight: '10px',
    },
    profileText: {
        color: '#000', // Black color for text
        fontSize: '24px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '8px',
        marginBottom: '15px',
        borderRadius: '25px',
        border: '1px solid #ddd',
        fontSize: '14px',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '25px',
        fontSize: '16px',
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
        color: '#007bff',
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
        width: '100%',
        padding: '8px',
        paddingRight: '10px', // Adjust padding to make space for the icon
        marginBottom: '15px',
        borderRadius: '25px',
        border: '1px solid #ddd',
        fontSize: '14px',
        display: 'flex',
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
            const userId = uuidv4(); // Generate a unique ID for the user
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
                    userId,
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
            setError('Signup failed. Please try again later.'+err);
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
                    <img src={trainLogo} alt="BART Logo" style={styles.trainLogo} />
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


// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AWS from 'aws-sdk';
// import Webcam from 'react-webcam';
// import trainLogo from '../assets/image 45.svg';
// import background from '../assets/b1.jpg';

// const styles = {
//     container: {
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         backgroundImage: `url(${background})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         width: '100vw',
//         position: 'absolute',
//         top: 0,
//         left: 0,
//     },
//     overlay: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     },
//     signupBox: {
//         position: 'relative',
//         width: '400px',
//         maxHeight: '80vh', // Set a maximum height
//         padding: '30px',
//         backgroundColor: 'lightgray',
//         borderRadius: '25px',
//         boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//         textAlign: 'center',
//         zIndex: 2,
//         overflowY: 'auto', // Enable vertical scrolling if needed
//     },
//     header: {
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: '20px',
//     },
//     trainLogo: {
//         width: '50px',
//         height: '50px',
//         marginRight: '10px',
//     },
//     profileText: {
//         color: '#000', // Black color for text
//         fontSize: '24px',
//         fontWeight: 'bold',
//     },
//     input: {
//         width: '100%',
//         padding: '8px',
//         marginBottom: '15px',
//         borderRadius: '25px',
//         border: '1px solid #ddd',
//         fontSize: '14px',
//     },
//     button: {
//         width: '100%',
//         padding: '10px',
//         backgroundColor: '#007bff',
//         color: '#fff',
//         border: 'none',
//         borderRadius: '25px',
//         fontSize: '16px',
//         cursor: 'pointer',
//         marginBottom: '15px',
//     },
//     webcamContainer: {
//         marginBottom: '15px',
//     },
//     errorBox: {
//         color: 'red',
//         marginBottom: '15px',
//     },
//     linkContainer: {
//         marginTop: '20px',
//     },
//     link: {
//         color: '#007bff',
//         textDecoration: 'none',
//     },
// };



// // Configure AWS SDK
// AWS.config.update({
//     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
//     region: process.env.REACT_APP_AWS_REGION,
// });

// const s3 = new AWS.S3();

// const SignupPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [fullName, setFullName] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [capturedImage, setCapturedImage] = useState(null);
//     const [error, setError] = useState('');
//     const [cameraOn, setCameraOn] = useState(false);
//     const navigate = useNavigate();
//     const webcamRef = useRef(null);

//     const capture = () => {
//         setCameraOn(true); // Turn on the camera

//         // Delay capture to give the webcam time to initialize
//         setTimeout(() => {
//             if (webcamRef.current) {
//                 const imageSrc = webcamRef.current.getScreenshot();
//                 if (imageSrc) {
//                     setCapturedImage(imageSrc);
//                     setCameraOn(false); // Turn off the camera after capturing
//                 } else {
//                     console.error('Failed to capture image.');
//                 }
//             } else {
//                 console.error('Webcam reference is null.');
//             }
//         }, 500); // Delay capture by 500ms
//     };

//     const handleSignup = async () => {
//         if (!email || !password || !confirmPassword || !capturedImage) {
//             setError('Please fill all fields and capture a photo.');
//             return;
//         }
//         if (password !== confirmPassword) {
//             setError('Passwords do not match.');
//             return;
//         }
//         if (!validatePassword(password)) {
//             setError('Password must be at least 8 characters long and contain at least one number.');
//             return;
//         }

//         try {
//             // Decode base64 image
//             const base64Image = capturedImage.split(',')[1];
//             const binaryImage = atob(base64Image);
//             const arrayBuffer = new ArrayBuffer(binaryImage.length);
//             const uint8Array = new Uint8Array(arrayBuffer);

//             for (let i = 0; i < binaryImage.length; i++) {
//                 uint8Array[i] = binaryImage.charCodeAt(i);
//             }

//             // Create a Blob from the image data
//             const blob = new Blob([uint8Array], { type: 'image/jpeg' });

//             // Store captured image in S3
//             const imageParams = {
//                 Bucket: process.env.REACT_APP_S3_BUCKET,
//                 Key: `facialdata/profile_images/${email}.jpg`, // Separate folder for images
//                 Body: blob,
//                 ContentType: 'image/jpeg',
//             };

//             await s3.upload(imageParams).promise();

//             // Store user details in S3
//             const userParams = {
//                 Bucket: process.env.REACT_APP_S3_BUCKET,
//                 Key: `facialdata/data/${email}.json`, // Separate folder for data
//                 Body: JSON.stringify({
//                     email,
//                     password,
//                     profilePhoto: `facialdata/profile_images/${email}.jpg`,
//                     fullName,
//                     phoneNumber,
//                 }),
//                 ContentType: 'application/json',
//             };

//             await s3.upload(userParams).promise();

//             alert('Signup successful');
//             navigate('/login');
//         } catch (err) {
//             console.error('Signup failed:', err);
//             setError('Signup failed. Please try again later.');
//         }
//     };

//     const validatePassword = (password) => {
//         return password.length >= 8 && /\d/.test(password);
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             handleSignup();
//         }
//     };

//     const isButtonDisabled = () => {
//         const isEmailEmpty = !email;
//         const isPasswordInvalid = !validatePassword(password);
//         const isPasswordMismatch = password !== confirmPassword;
//         const isCapturedImageMissing = !capturedImage;

//         return isEmailEmpty || isPasswordInvalid || isPasswordMismatch || isCapturedImageMissing;
//     };

//     return (
//         <div style={styles.container}>
//             <div style={styles.overlay}></div>
//             <div style={styles.signupBox}>
//                 <div style={styles.header}>
//                     <img src={trainLogo} alt="BART Logo" style={styles.trainLogo} />
//                     <div style={styles.profileText}>BARTGenie</div>
//                 </div>
//                 <h2>Signup</h2>
//                 <input
//                     type="text"
//                     placeholder="Full Name"
//                     style={styles.input}
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Phone Number"
//                     style={styles.input}
//                     value={phoneNumber}
//                     onChange={(e) => setPhoneNumber(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                 />
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     style={styles.input}
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     style={styles.input}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Re-enter Password"
//                     style={styles.input}
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                 />
//                 {cameraOn && (
//                     <div style={styles.webcamContainer}>
//                         <Webcam
//                             audio={false}
//                             ref={webcamRef}
//                             screenshotFormat="image/jpeg"
//                             width="100%"
//                         />
//                     </div>
//                 )}
//                 <button
//                     style={styles.button}
//                     onClick={capture}
//                 >
//                     Capture Photo
//                 </button>
//                 {capturedImage && <img src={capturedImage} alt="Captured" style={{ width: '100%', marginBottom: '10px' }} />}
//                 {error && <div style={styles.errorBox}>{error}</div>}
//                 <button
//                     style={styles.button}
//                     onClick={handleSignup}
//                     disabled={isButtonDisabled()}
//                 >
//                     Signup
//                 </button>
//                 <div style={styles.linkContainer}>
//                     <a href="/login" style={styles.link}>
//                         Already have an account? Login
//                     </a>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SignupPage;


