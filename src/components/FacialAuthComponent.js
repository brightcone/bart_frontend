import React, { useState, useRef, useEffect } from 'react';
import AWS from 'aws-sdk';
import Webcam from 'react-webcam';
import { Buffer } from 'buffer';
import styled from 'styled-components';
import Eye from '../assets/eye.svg';
import Face from '../assets/Face.gif';
// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

const styles = {
    loginBox: {
        position: 'relative',
        zIndex: 2,
        width: '350px',
        padding: '40px 30px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '15px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
    },
    webcamContainer: {
        padding: '40px',
        borderRadius: '20px',  // Ensures curved corners
        overflow: 'hidden',    // Ensures content inside follows the curved border
        backgroundColor: '#292929'
    },
    instruction: {
        marginTop: '16px',
        color: '#FFFFFF',
        fontSize: '16px',
        textAlign: 'center',
    },
    progressBar: {
        width: '100%',
        height: '12px',
        backgroundColor: '#000', // A light background for the empty part of the bar
        borderRadius: '6px',
        overflow: 'hidden',
        margin: '12px 0',
    },
    progress: {
        height: '100%',
        background: 'linear-gradient(to right, #e189b0 0%, #6b1df5 100%)',
        transition: 'width 0.4s ease', // Smooth transition as the progress bar fills
    },
};
const CircularWebcam = styled(Webcam)`
  width: 400px;
  height: 300px;
  object-fit: cover;
  border-radius: 20px;
`;

const OverlayContent = styled.div`
  color: white;
  text-align: center;
`;

// Adjust the `Instruction` styled component to move the text down a bit
const Instruction = styled.div`
  font-size: 18px;
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 20px;
  position: relative; /* Position relative to adjust the position */
  top: 200px; /* Move the text slightly down */
`;
const ProgressBar = styled.div`
  width: 70%;
  height: 7px;
  background-color: #e0e0e0;
    border-radius: 10px;
  //margin-bottom: 20px;
position: relative; /* Position relative to adjust the position */
  top: 140px; /* Move the text slightly down */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Progress = styled.div`
  height: 100%;
  background-color: #007bff;
  border-radius: 10px;
  transition: width 0.5s ease-in-out;
`;

const Heading = styled.h2`
  position: absolute;
  top: 28px; /* Position the heading at the top */
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 24px;
  margin: 0;
  text-align: center;
  z-index: 10; /* Ensure the heading is above other elements */
`;
const GifContainer = styled.div`
        position: 'relative',
        zIndex: 2,
        padding: '40px 30px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '15px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
`;

const GifImage = styled.img`
width:20%;
height:20%;
align:center;
  object-fit: cover;
`;

const WebcamContainer = styled.div`
  width: 400px;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  background-color: #292929;
`;
const FacialAuthComponent = ({ link, onClose, onComplete }) => {
    const [error, setError] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [instruction, setInstruction] = useState('');
    const [progress, setProgress] = useState(0);
    const webcamRef = useRef(null);
    const analyzeIntervalRef = useRef(null);
    const blinkCountRef = useRef(0);
    const actionSequenceRef = useRef([]);
    const [showGif, setShowGif] = useState(false);
    useEffect(() => {
        startLivenessCheck();
        return () => stopAnalysis();
    }, []);

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

    const handleAuthSuccess = () => {
        if (onComplete && typeof onComplete === 'function') {
            onComplete();
        }
        handleClose();  // Automatically close after successful verification
    };

    const handleClose = () => {
        if (onClose && typeof onClose === 'function') {
            onClose();
        }
    };

    const getNextInstruction = () => {
        const action = actionSequenceRef.current[0];
        if (action === 'Verifying...') {
            setShowGif(true);
            return null;
        }
    
        switch (action) {
            case 'right': return 'Please turn your head to the left';
            case 'left': return 'Please turn your head to the right';
            case 'blink': 
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img 
                            src={Eye}
                            alt="Eye Blink"
                            style={{  
                                width: '24px',             
                                height: '24px',              
                                marginRight: '20px',          
                                marginLeft: '80px',          
                                display: 'flex',             
                                justifyContent: 'center',    
                                alignItems: 'center' 
                            }} 
                        />
                        Please blink twice
                    </div>
                );
            default: return null;  // Default case can be null or any other appropriate value
        }
    };

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

                        if (actionSequenceRef.current.length === 0) {
                            await handlePhotoLogin(binaryImage);
                        }
                    } else {
                        setTimeout(() => {
                            setError('No face detected. Please ensure your face is visible.');
                        }, 5000);
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

                if (compareFacesResult.FaceMatches && compareFacesResult.FaceMatches.length > 0) {
                    const match = compareFacesResult.FaceMatches[0];
                    if (match.Face.Confidence > 90) {
                        faceMatchFound = true;
                        break;
                    }
                }
            }

            if (faceMatchFound) {
                stopAnalysis();
                setShowGif(true);
                setTimeout(() => {
                    handleAuthSuccess();
                }, 6000);
            } else {
                stopAnalysis();
                setError('Face not recognized. Please try again.');
            }
        } catch (err) {
            console.error('Photo login error:', err);
            setError('Photo login failed. Please try again.');
        }
    };

    return (
        <div style={styles.webcamContainer}>
            <CircularWebcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
            />
            <OverlayContent>
                {isAnalyzing && !showGif && (
                    <>
                        <div style={styles.instructionContainer}>
                            <div style={styles.instruction}>{instruction}</div>
                            <div style={styles.progressBarContainer}>
                                <div style={styles.progressBar}>
                                    <div style={{ ...styles.progress, width: `${progress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {showGif && (
                    <GifContainer>
                        <GifImage src={Face} alt="Verifying" />
                    </GifContainer>
                )}
                {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
            </OverlayContent>
        </div>
    );
};

export default FacialAuthComponent;

// import React, { useState, useRef, useEffect } from 'react';
// import AWS from 'aws-sdk';
// import Webcam from 'react-webcam';
// import { Buffer } from 'buffer';
// import styled from 'styled-components';
// import Eye from '../assets/eye.svg';
// import Face from '../assets/Face.gif';
// // Configure AWS SDK
// AWS.config.update({
//     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
//     region: process.env.REACT_APP_AWS_REGION,
// });

// const s3 = new AWS.S3();
// const rekognition = new AWS.Rekognition();

// const styles = {
//     loginBox: {
//         position: 'relative',
//         zIndex: 2,
//         width: '350px',
//         padding: '40px 30px',
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         borderRadius: '15px',
//         boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
//         textAlign: 'center',
//         backdropFilter: 'blur(10px)',
//     },
//     webcamContainer: {
//         padding: '40px',
//         borderRadius: '20px',  // Ensures curved corners
//         overflow: 'hidden',    // Ensures content inside follows the curved border
//         backgroundColor: '#292929'
//     },
//     instruction: {
//         marginTop: '16px',
//         color: '#FFFFFF',
//         fontSize: '16px',
//         textAlign: 'center',
//     },
//     progressBar: {
//         width: '100%',
//         height: '12px',
//         backgroundColor: '#000', // A light background for the empty part of the bar
//         borderRadius: '6px',
//         overflow: 'hidden',
//         margin: '12px 0',
//     },
//     progress: {
//         height: '100%',
//         background: 'linear-gradient(to right, #e189b0 0%, #6b1df5 100%)',
//         transition: 'width 0.4s ease', // Smooth transition as the progress bar fills
//     },
// };
// const CircularWebcam = styled(Webcam)`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// `;


// const OverlayContent = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   color: white;
// `;

// // Adjust the `Instruction` styled component to move the text down a bit
// const Instruction = styled.div`
//   font-size: 18px;
//   color: #ffffff;
//   font-weight: bold;
//   margin-bottom: 20px;
// `;

// const ProgressBar = styled.div`
//   width: 70%;
//   height: 7px;
//   background-color: #e0e0e0;
//   border-radius: 10px;
//   overflow: hidden;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
// `;

// const Progress = styled.div`
//   height: 100%;
//   background-color: #007bff;
//   border-radius: 10px;
//   transition: width 0.5s ease-in-out;
// `;

// const Heading = styled.h2`
//   position: absolute;
//   top: 28px; /* Position the heading at the top */
//   left: 50%;
//   transform: translateX(-50%);
//   color: white;
//   font-size: 24px;
//   margin: 0;
//   text-align: center;
//   z-index: 10; /* Ensure the heading is above other elements */
// `;
// const GifContainer = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background-color: rgba(255, 255, 255, 0.9);
//   border-radius: 20px;
// `;

// const GifImage = styled.img`
//   width: 50%;
//   height: auto;
// `;


// const WebcamContainer = styled.div`
//   width: 400px;
//   height: 300px;
//   border-radius: 20px;
//   overflow: hidden;
//   background-color: #292929;
//   position: relative;
// `;

// const InstructionContainer = styled.div`
//   text-align: center;
// `;
// const ProgressBarContainer = styled.div`
//   width: 70%;
//   margin: 0 auto;
// `;


// const FacialAuthComponent = ({ link, onClose, onComplete }) => {
//     const [error, setError] = useState('');
//     const [isAnalyzing, setIsAnalyzing] = useState(false);
//     const [instruction, setInstruction] = useState('');
//     const [progress, setProgress] = useState(0);
//     const [showGif, setShowGif] = useState(false);
//     const webcamRef = useRef(null);
//     const analyzeIntervalRef = useRef(null);
//     const blinkCountRef = useRef(0);
//     const actionSequenceRef = useRef([]);
//     useEffect(() => {
//         startLivenessCheck();
//         return () => stopAnalysis();
//     }, []);

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

//     const handleAuthSuccess = () => {
//         if (onComplete && typeof onComplete === 'function') {
//             onComplete();
//         }
//         handleClose();  // Automatically close after successful verification
//     };

//     const handleClose = () => {
//         if (onClose && typeof onClose === 'function') {
//             onClose();
//         }
//     };

//     const getNextInstruction = () => {
//         const action = actionSequenceRef.current[0];
//         switch (action) {
//           case 'right': return 'Please turn your head to the left';
//           case 'left': return 'Please turn your head to the right';
//           case 'blink': 
//             return (
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <img 
//                   src={Eye}
//                   alt="Eye Blink"
//                   style={{ width: '24px', height: '24px', marginRight: '10px' }} 
//                 />
//                 Please blink twice
//               </div>
//             );
//           default: return null;
//         }
//       };

//       const actionCompleted = () => {
//         actionSequenceRef.current.shift();
//         setProgress((prevProgress) => prevProgress + 100 / 3);
//         if (actionSequenceRef.current.length > 0) {
//           setInstruction(getNextInstruction());
//         } else {
//           setInstruction('Verifying...');
//           setShowGif(true);  // Show GIF when starting verification
//         }
//       };
    

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

//                         if (actionSequenceRef.current.length === 0) {
//                             await handlePhotoLogin(binaryImage);
//                         }
//                     } else {
//                         setTimeout(() => {
//                             setError('No face detected. Please ensure your face is visible.');
//                         }, 5000);
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

  

//     const handlePhotoLogin = async (binaryImage) => {
//         try {
//             const allUsersParams = {
//                 Bucket: 'face-authen',
//                 Prefix: 'facialdata/profile_images/',
//             };
//             const allUsers = await s3.listObjectsV2(allUsersParams).promise();
//             let faceMatchFound = false;

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
//                         break;
//                     }
//                 }
//             }

//             if (faceMatchFound) {
//                 stopAnalysis();
//                 setShowGif(true);
//                 setTimeout(() => {
//                     handleAuthSuccess();
//                 }, 6000);
//             } else {
//                 stopAnalysis();
//                 setError('Face not recognized. Please try again.');
//             }
//         } catch (err) {
//             console.error('Photo login error:', err);
//             setError('Photo login failed. Please try again.');
//         }
//     };

//     return (
//         <WebcamContainer>
//         {!showGif && (
//           <CircularWebcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//           />
//         )}
//         {showGif && (
//           <GifContainer>
//             <GifImage src={Face} alt="Verifying" />
//           </GifContainer>
//         )}
//         <OverlayContent>
//           {isAnalyzing && !showGif && (
//             <InstructionContainer>
//               <Instruction>{instruction}</Instruction>
//               <ProgressBarContainer>
//                 <ProgressBar>
//                   <Progress style={{ width: `${progress}%` }} />
//                 </ProgressBar>
//               </ProgressBarContainer>
//             </InstructionContainer>
//           )}
//           {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
//         </OverlayContent>
//       </WebcamContainer>
//     );
// };

// export default FacialAuthComponent;
