import React, { useState } from "react";
import { Link } from "react-router-dom";

import { ChevronRight } from "@mui/icons-material";
import Gear from "../assets/gear.svg";
import tr from "../assets/toggle-right.svg";
import LeftPanel from "../components/LeftPanel";
import "../styles/common.css";

const Settings = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="dashboard">
            <LeftPanel />
            <main className="content">
                <div className="settings-container">
                    <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={Gear} alt="Settings" height={42} />
                        Settings
                    </h2>
                    <h3 className="header">ACCOUNT</h3>
                    <section className="settings-section">
                        <Link to="/settings/email" className="settings-option">
                            <div className="option-label">Email</div>
                            <div className="option-value">floyd.miles@bart.org</div>
                        </Link>
                        <Link to="/settings/data-control" className="settings-option">
                            <div className="option-label">Data Control</div>
                            <div className="option-arrow"><ChevronRight /></div>
                        </Link>
                        <Link to="/settings/saved-chat" className="settings-option">
                            <div className="option-label">Saved Chat</div>
                            <div className="option-arrow"><ChevronRight /></div>
                        </Link>
                        <Link to="/settings/manage-password" className="settings-option">
                            <div className="option-label">Manage Password</div>
                            <div className="option-arrow"><ChevronRight /></div>
                        </Link>
                    </section>
                    <h3 className="header">ABOUT</h3>
                    <section className="settings-section">

                        <Link to="/settings/help-center" className="settings-option">
                            <div className="option-label">Help Center</div>
                            <div className="option-arrow"><ChevronRight /></div>
                        </Link>
                        <Link to="/settings/terms-of-use" className="settings-option">
                            <div className="option-label">Terms of Use</div>
                            <div className="option-arrow"><ChevronRight /></div>
                        </Link>
                        <Link to="/settings/privacy-policy" className="settings-option">
                            <div className="option-label">Privacy Policy</div>
                            <div className="option-arrow"><ChevronRight /></div>
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
                            <div className="option-arrow">English <ChevronRight /></div>
                        </Link>
                        <Link to="/settings/terms-of-use" className="settings-option">
                            <div className="option-label">Auto Correct</div>
                            <div className="option-arrow"><img src={tr} alt="ToggleRight" /></div>
                        </Link>
                        <Link to="/settings/privacy-policy" className="settings-option">
                            <div className="option-label">Application Update</div>
                            <div className="option-arrow">No updates available <ChevronRight /></div>
                        </Link>

                    </section>
                </div>
            </main>

        </div>
    );
};

export default Settings;