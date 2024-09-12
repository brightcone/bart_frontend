import React, { createContext, useState, useEffect } from 'react';
import AWS from 'aws-sdk';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [fullName, setFullName] = useState('');
    const s3 = new AWS.S3(); // Ensure this matches your existing s3 initialization

    useEffect(() => {
        const fetchUserProfile = async () => {
            const usernameFromStorage = localStorage.getItem('username');
            if (!usernameFromStorage) {
                return;
            }

            const decodedUsername = decodeURIComponent(usernameFromStorage);
            setUserName(decodedUsername);

            // Check if user data is already stored in localStorage
            const storedProfilePhoto = localStorage.getItem('profilePhoto');
            const storedFullName = localStorage.getItem('fullName');

            if (storedProfilePhoto && storedFullName) {
                setProfilePhoto(storedProfilePhoto);
                setFullName(storedFullName);
                return;
            }

            try {
                // Fetch user data from JSON file
                const userParams = {
                    Bucket: process.env.REACT_APP_S3_BUCKET,
                    Key: `facialdata/data/${usernameFromStorage}.json`,
                };
                const userData = await s3.getObject(userParams).promise();
                const userJson = JSON.parse(userData.Body.toString('utf-8'));
                const fullNameFromData = userJson.fullName || usernameFromStorage;
                setFullName(fullNameFromData);

                // Construct profile photo URL
                const profilePhotoUrl = `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/facialdata/profile_images/${usernameFromStorage}.jpg`;

                // Check if the profile photo exists
                try {
                    await s3.headObject({
                        Bucket: process.env.REACT_APP_S3_BUCKET,
                        Key: `facialdata/profile_images/${usernameFromStorage}.jpg`
                    }).promise();
                    setProfilePhoto(profilePhotoUrl);
                    // Store in localStorage
                    localStorage.setItem('profilePhoto', profilePhotoUrl);
                    localStorage.setItem('fullName', fullNameFromData);
                } catch (error) {
                    if (error.code === 'NotFound') {
                        console.log('Profile photo not found. Using default image.');
                        const defaultPhotoUrl = 'path/to/default/image.jpg';
                        setProfilePhoto(defaultPhotoUrl);
                        localStorage.setItem('profilePhoto', defaultPhotoUrl);
                    } else {
                        console.error('Error checking profile photo:', error);
                        const defaultPhotoUrl = 'path/to/default/image.jpg';
                        setProfilePhoto(defaultPhotoUrl);
                        localStorage.setItem('profilePhoto', defaultPhotoUrl);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                const defaultPhotoUrl = 'path/to/default/image.jpg';
                setFullName('Default Name');
                setProfilePhoto(defaultPhotoUrl);
                localStorage.setItem('profilePhoto', defaultPhotoUrl);
                localStorage.setItem('fullName', 'Default Name');
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <UserContext.Provider value={{ userName, profilePhoto, fullName }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
