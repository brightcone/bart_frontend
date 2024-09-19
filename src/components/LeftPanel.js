import { useState, useEffect, useContext } from 'react';
import AWS from 'aws-sdk';
import { ChevronLeft, ChevronRight, GridViewOutlined, HomeOutlined, StickyNote2Outlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import TicketIcon from '@mui/icons-material/ConfirmationNumber';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
// import Home from "../assets/house.svg";
import BART from "../assets/BART.svg";
import arrow from "../assets/arrow-up-right.svg";

const menuItems = [
    { id: 1, name: 'Home', icon: <HomeOutlined />, path: '/' },
    //{ id: 2, name: 'New Chat', icon: <AddIcon />, path: '/new-chat' },
    { id: 3, name: 'Search', icon: <SearchIcon />, path: '/search' },
    { id: 4, name: 'Templates', icon: <GridViewOutlined />, path: '/templates' },
    { id: 5, name: 'History', icon: <HistoryIcon />, path: '/history' },
    { id: 6, name: 'Tickets', icon: <StickyNote2Outlined />, path: '/tickets' },
    { id: 7, name: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];


// Initialize AWS S3
const s3 = new AWS.S3({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: new AWS.Credentials({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    })
});

const LeftPanel = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [userName, setUserName] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [fullName, setFullName] = useState('');

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            const usernameFromStorage = localStorage.getItem('username');
        
            const decodedUsername = decodeURIComponent(usernameFromStorage);
            setUserName(()=> decodedUsername);

            try {
                // Fetch user data from JSON file
                const userParams = {
                    Bucket: process.env.REACT_APP_S3_BUCKET,
                    Key: `facialdata/data/${usernameFromStorage}.json`,
                };
                const userData = await s3.getObject(userParams).promise();
                const userJson = JSON.parse(userData.Body.toString('utf-8'));
                const fullNameFromData = userJson.fullName || 'Default Name';
                setFullName(() => fullNameFromData);
                localStorage.setItem('fullName', fullNameFromData);
                // Construct profile photo URL
               const profilePhotoUrl = `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/facialdata/profile_images/${usernameFromStorage}.jpg`;

                // Check if the profile photo exists
                try {
                    await s3.headObject({
                        Bucket: process.env.REACT_APP_S3_BUCKET,
                        Key: `facialdata/profile_images/${usernameFromStorage}.jpg`
                    }).promise();
                    setProfilePhoto(() => profilePhotoUrl);
                    localStorage.setItem('profilePhoto', profilePhotoUrl);
                    
                } catch (error) {
                    if (error.code === 'NotFound') {
                        console.log('Profile photo not found. Using default image.');
                        setProfilePhoto('path/to/default/image.jpg'); // Set a default image URL
                    } else {
                        console.error('Error checking profile photo:', error);
                        setProfilePhoto('path/to/default/image.jpg'); // Set a default image URL
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setFullName('Default Name');
                setProfilePhoto('path/to/default/image.jpg'); // Set a default image URL
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <>
            <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </button>
                <div>
                    <div className="profile">
                        {/* Display the profile photo */}
                        <img src={profilePhoto} alt="Profile" />
                        <Box sx={{ visibility: { xs: isCollapsed ? "hidden" : "visible" } }}>
                            {/* Display the username and full name */}
                            <span className="profile-name">{fullName || userName || 'Default Name'}</span>
                            <small className="profile-role">Product Manager</small>
                        </Box>
                    </div>
                    <nav className='nav'>
                        <List>
                            {menuItems.map((item) => (
                                <ListItem className='menu-item' button component={Link} to={item.path} key={item.id} style={{ color: '#fff', margin: 10, padding: 10 }}>
                                    <ListItemIcon style={{ color: '#fff' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} sx={{ visibility: { xs: isCollapsed ? "hidden" : "visible" } }} />
                                </ListItem>
                            ))}
                        </List>
                    </nav>
                </div>

                <footer className="footer">
                    <div className="footerdiv">
                        <img src={BART} alt="BART Logo" />
                        <Box sx={{ visibility: { xs: isCollapsed ? "hidden" : "visible" } }} >
                            <p>
                                <strong>BART <img className="arrow" src={arrow} alt="arrow" /></strong>
                            </p>
                            <p className='bart'>Bay Area Rapid Transit</p>
                        </Box>
                    </div>
                </footer>
            </aside>
        </>
    );
};

export default LeftPanel;




// import { ChevronLeft, ChevronRight, GridViewOutlined, HomeOutlined, StickyNote2Outlined } from '@mui/icons-material';
// import AddIcon from '@mui/icons-material/Add';
// import TicketIcon from '@mui/icons-material/ConfirmationNumber';
// import HistoryIcon from '@mui/icons-material/History';
// import SearchIcon from '@mui/icons-material/Search';
// import SettingsIcon from '@mui/icons-material/Settings';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// import { Box } from '@mui/material';
// // import Home from "../assets/house.svg";
// import BART from "../assets/image 45.svg";
// import Profile from "../assets/profile.svg";
// import arrow from "../assets/arrow-up-right.svg";
// const menuItems = [
//     { id: 1, name: 'Home', icon: <HomeOutlined />, path: '/' },
//     { id: 2, name: 'New Chat', icon: <AddIcon />, path: '/new-chat' },
//     { id: 3, name: 'Search', icon: <SearchIcon />, path: '/search' },
//     { id: 4, name: 'Templates', icon: <GridViewOutlined />, path: '/templates' },
//     { id: 5, name: 'History', icon: <HistoryIcon />, path: '/history' },
//     { id: 6, name: 'Tickets', icon: <StickyNote2Outlined />, path: '/tickets' },
//     { id: 7, name: 'Settings', icon: <SettingsIcon />, path: '/settings' },
// ];

// const LeftPanel = () => {

//     const [isCollapsed, setIsCollapsed] = useState(false);

//     const toggleSidebar = () => {
//         setIsCollapsed(!isCollapsed);
//     };

//     return (
//         <>
//             <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
//                 <button className="toggle-btn" onClick={toggleSidebar}>
//                     {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
//                 </button>
//                 <div>
//                     <div className="profile">
//                         <img src={Profile} alt="Profile" />
//                         <Box sx={{ visibility: { xs: isCollapsed ? "hidden" : "visible" } }}>
//                             <span className="profile-name">Floyd Miles</span>
//                             <small className="profile-role">Product Manager</small>
//                         </Box>
//                     </div>
//                     <nav className='nav'>
//                         <List>
//                             {menuItems.map((item) => (
//                                 <ListItem className='menu-item' button component={Link} to={item.path} key={item.id} style={{ color: '#fff', margin: 10, padding: 10 }}>
//                                     <ListItemIcon style={{ color: '#fff' }}>
//                                         {item.icon}
//                                     </ListItemIcon>
//                                     <ListItemText primary={item.name} sx={{ visibility: { xs: isCollapsed ? "hidden" : "visible" } }} />
//                                 </ListItem>
//                             ))}
//                         </List>
//                     </nav>
//                 </div>

//                 <footer className="footer">
//                     <div className="footerdiv">
//                         <img src={BART} alt="BART Logo" />
//                         <Box sx={{ visibility: { xs: isCollapsed ? "hidden" : "visible" } }} >
//                             <p>
//                                 <strong>BART <img className="arrow" src={arrow} alt="arrow" /></strong>
//                             </p>
//                             <p className='bart'>Bay Area Rapid Transit</p>
//                         </Box>
//                     </div>
//                 </footer>
//             </aside>

//         </>

//     );
// };

// export default LeftPanel;


{/* <nav className="nav">
                    <ul>
                        <li>
                            <Link to='/dashboard' style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center' }}>
                                <img src={Icon10} alt="Icon 10" className="template-icon" />
                                <span className="nav-text">Home</span>
                            </Link>
                        </li>
                        <li>
                            <img src={Icon11} alt="Icon 11" className="template-icon" />
                            <span className="nav-text">New chat</span>
                        </li>
                        <li>
                            <img src={Icon12} alt="Icon 12" className="template-icon" />
                            <span className="nav-text">Search</span>
                        </li>
                        <li>
                            <img src={Icon13} alt="Icon 13" className="template-icon" />
                            <span className="nav-text">Templates</span>
                        </li>
                        <li>
                            <Link to='/history' style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center' }}>
                                <img src={Icon14} alt="Icon 14" className="template-icon1" />
                                <span className="nav-text">History</span>
                            </Link>
                        </li>
                        <li>
                            <img src={Icon15} alt="Icon 15" className="template-icon" />
                            <span className="nav-text">Tickets</span>
                        </li>
                        <li>
                            <Link to='/settings' style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center' }}>
                                <img src={Icon16} alt="Icon 16" className="template-icon" />
                                <span className="nav-text">Settings</span>
                            </Link>
                        </li>
                    </ul>
                </nav> */}