import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Icon10 from "../assets/house.svg";
import Icon11 from "../assets/plus.svg";
import Icon12 from "../assets/magnifying-glass.svg";
import Icon13 from "../assets/circles-four.svg";
import Icon14 from "../assets/clock-counter-clockwise.svg";
import Icon15 from "../assets/sticker.svg";
import Icon16 from "../assets/gear-six.svg";
import Icon17 from "../assets/profile.svg";
import Icon18 from "../assets/image 45.svg";
import LessThanIcon from "../assets/less-than.svg";
import GreaterThanIcon from "../assets/greater-than.svg";
import Gear from "../assets/gear.svg";
import tr from "../assets/toggle-right.svg";
import "../styles/common.css";
import { Box } from "@mui/material";

const Settings = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

   

    return (
        <div className="dashboard">
            <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    <img
                        src={isCollapsed ? GreaterThanIcon : LessThanIcon}
                        alt="Toggle Icon"
                    />
                </button>
                <div className="profile">
                    <img src={Icon17} alt="Profile" />
                    <Box sx={{ display: { xs: isCollapsed ? "none" : "block" } }}>
                        <span className="profile-name">Floyd Miles</span>
                        <small className="profile-role">Product Manager</small>
                    </Box>
                </div>
                <nav className="nav">
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
                            <img src={Icon14} alt="Icon 14" className="template-icon" />
                            <span className="nav-text">History</span>
                        </li>
                        <li>
                            <img src={Icon15} alt="Icon 15" className="template-icon" />
                            <span className="nav-text">Tickets</span>
                        </li>
                        <li>
                            <img src={Icon16} alt="Icon 16" className="template-icon" />
                            <span className="nav-text">Settings</span>
                        </li>
                    </ul>
                </nav>
                <footer className="footer">
                    <div className="footerdiv">
                        <img src={Icon18} alt="BART Logo" />
                        <Box sx={{ display: { xs: isCollapsed ? "none" : "block" } }}>
                            <p>
                                <strong>BART</strong>
                            </p>
                            <p>Bay Area Rapid Transit</p>
                        </Box>
                    </div>
                </footer>
            </aside>

   
            <div className="settings-container">
                    <h2 className="h2"><img src={Gear} alt="Settings" />Settings</h2>
                    <h3 className="header">ACCOUNT</h3>
                    <section className="settings-section">
                        <Link to="/settings/email" className="settings-option">
                            <div className="option-label">Email</div>
                            <div className="option-value">floyd.miles@bart.org</div>
                        </Link>
                        <Link to="/settings/data-control" className="settings-option">
                            <div className="option-label">Data Control</div>
                            <div className="option-arrow">&gt;</div>
                        </Link>
                        <Link to="/settings/saved-chat" className="settings-option">
                            <div className="option-label">Saved Chat</div>
                            <div className="option-arrow">&gt;</div>
                        </Link>
                        <Link to="/settings/manage-password" className="settings-option">
                            <div className="option-label">Manage Password</div>
                            <div className="option-arrow">&gt;</div>
                        </Link>
                    </section>
                    <h3 className="header">ABOUT</h3>
                    <section className="settings-section">
                        
                        <Link to="/settings/help-center" className="settings-option">
                            <div className="option-label">Help Center</div>
                            <div className="option-arrow">&gt;</div>
                        </Link>
                        <Link to="/settings/terms-of-use" className="settings-option">
                            <div className="option-label">Terms of Use</div>
                            <div className="option-arrow">&gt;</div>
                        </Link>
                        <Link to="/settings/privacy-policy" className="settings-option">
                            <div className="option-label">Privacy Policy</div>
                            <div className="option-arrow">&gt;</div>
                        </Link>
                        <Link to="/settings/app-version" className="settings-option">
                            <div className="option-label">App Version</div>
                            <div className="option-value">Version 12.0</div>
                        </Link>
                        <Link to="/settings/privacy-policy" className="settings-option">
                            <div className="logoutsettings">Log out</div>
                        </Link>
                    </section>
                    <h3 className="header">APP</h3>
                    <section className="settings-section">
                    <Link to="/settings/help-center" className="settings-option">
                            <div className="option-label">App Language</div>
                            <div className="option-arrow">English &gt;</div>
                        </Link>
                        <Link to="/settings/terms-of-use" className="settings-option">
                            <div className="option-label">Auto Correct</div>
                            <div className="option-arrow"><img src={tr} alt="ToggleRight" /></div>
                        </Link>
                        <Link to="/settings/privacy-policy" className="settings-option">
                            <div className="option-label">Application Update</div>
                            <div className="option-arrow">No updates available &gt;</div>
                        </Link>
                    
                    </section>
                </div>
        </div>
    );
};

export default Settings;