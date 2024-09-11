import React from "react";
import LeftPanel from "../components/LeftPanel";
import "../styles/common.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon8 from "../assets/arrow-circle-up.svg";
import Icon6 from "../assets/cleaning-brush.svg";
import Icon4 from "../assets/computer-settings.svg";
import LogoutIcon from "../assets/Genie.svg";
import Icon2 from "../assets/laptop-1.svg";
import Icon3 from "../assets/laptop.svg";
import Icon9 from "../assets/lightning.svg";
import Icon1 from "../assets/password.svg";
import Icon7 from "../assets/plus-circle.svg";
import Icon5 from "../assets/wifi.svg";
import dot from "../assets/dot.svg";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Jira from "../assets/jira.svg";
import DB from "../assets/db.svg";
import SE from "../assets/sendemail.svg";
import All from "../assets/sliders.svg";
const SuggestedTemplates = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogoutButton, setShowLogoutButton] = useState(false);

    const navigate = useNavigate();
    const handleTemplateClick = (path) => {
        navigate(path);
    };
    const handleConfirmLogout = () => {
        // Redirect to the LoginPage
        navigate('/login');
    };
    const handleLogoutClick = () => {
        // Toggle the visibility of the logout button
        setShowLogoutButton(true);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className="dashboard">
            <LeftPanel />
            <main className="content">
                    <div className="content-box" style={{ position: 'relative' }}>
                    <div className="logout-container">
                        <div>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                <img src={LogoutIcon} alt="Logout" />
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                                <MenuItem onClick={handleConfirmLogout}>Logout</MenuItem>
                            </Menu>
                        </div>

                        {/* {!showLogoutButton ? (
                                    <button className="logout" onClick={handleLogoutClick} >
                                        <img src={LogoutIcon} alt="Logout" />
                                    </button>
                                ) : (
                                    <button className="logout-confirm" onClick={handleConfirmLogout} >
                                        Logout
                                    </button>
                                )} */}
                    </div>
                    <p className="all-templates-header">
                        <img src={All} alt="All" className="template-icon" />
                        All Templates
                    </p>
                    <div>
                        <div className="suggested-templates">
                            <div
                                className="template"
                                onClick={() => handleTemplateClick("/agent")}
                            >
                                <img src={Icon1} alt="Icon 1" className="template-icon" />
                                <p>Reset your application passwords with ease.</p>
                            </div>
                            <a href="request-equipment-url" className="template">
                                <img src={Icon2} alt="Icon 2" className="template-icon" />
                                <p>Seamlessly request and track new equipment approvals.</p>
                            </a>
                            <a href="device-setup-url" className="template">
                                <img src={Icon3} alt="Icon 3" className="template-icon" />
                                <p>Setup, maintain, and troubleshoot all your devices.</p>
                            </a>
                            <a href="software-installation-url" className="template">
                                <img src={Icon4} alt="Icon 4" className="template-icon" />
                                <p>
                                    Install software with guided instructions and ticket updates.
                                </p>
                            </a>
                            <a href="connectivity-issues-url" className="template">
                                <img src={Icon5} alt="Icon 5" className="template-icon" />
                                <p>
                                    Report connectivity issues and manage network configurations.
                                </p>
                            </a>
                            <a href="equipment-maintenance-url" className="template">
                                <img src={Icon6} alt="Icon 6" className="template-icon" />
                                <p>Schedule equipment maintenance effortlessly.</p>
                            </a>
                            <div
                                className="template"
                                onClick={() => handleTemplateClick("/jira_agent")}
                            >
                                <img src={Jira} alt="Ticket" className="template-icon" />
                                <p>Raise a Jira Ticket for complicated issues</p>
                            </div>
                            <a href="equipment-maintenance-url" className="template">
                                <img src={DB} alt="Database" className="template-icon" />
                                <p>Connect to the Knowledge base for internal queries</p>
                            </a>
                            <a href="equipment-maintenance-url" className="template">
                                <img src={SE} alt="SendEmail" className="template-icon" />
                                <p>Draft and send E-mails quickly.</p>
                            </a>
                        </div>
                    </div>

                    <div className="chat" style={{ position: 'absolute' }}>
                        <img src={Icon7} alt="Icon 7" />
                        
                        <input type="text" placeholder="Ask BART Genie" />
                        <img src={Icon8} alt="Icon 8" className="template-icon1" />
                        {/* <button className="icon1"></button> */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SuggestedTemplates;