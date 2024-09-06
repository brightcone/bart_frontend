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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
// import Home from "../assets/house.svg";
import BART from "../assets/image 45.svg";
import Profile from "../assets/profile.svg";
import arrow from "../assets/arrow-up-right.svg";
const menuItems = [
    { id: 1, name: 'Home', icon: <HomeOutlined />, path: '/' },
    { id: 2, name: 'New Chat', icon: <AddIcon />, path: '/new-chat' },
    { id: 3, name: 'Search', icon: <SearchIcon />, path: '/search' },
    { id: 4, name: 'Templates', icon: <GridViewOutlined />, path: '/templates' },
    { id: 5, name: 'History', icon: <HistoryIcon />, path: '/history' },
    { id: 6, name: 'Tickets', icon: <StickyNote2Outlined />, path: '/tickets' },
    { id: 7, name: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const LeftPanel = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </button>
                <div>
                    <div className="profile">
                        <img src={Profile} alt="Profile" />
                        <Box sx={{ visibility: { xs: isCollapsed ? "hidden" : "visible" } }}>
                            <span className="profile-name">Floyd Miles</span>
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