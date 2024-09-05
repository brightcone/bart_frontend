import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon1 from "../assets/password.svg";
import Icon2 from "../assets/laptop-1.svg";
import Icon3 from "../assets/laptop.svg";
import Icon4 from "../assets/computer-settings.svg";
import Icon5 from "../assets/wifi.svg";
import Icon6 from "../assets/cleaning-brush.svg";
import Icon7 from "../assets/plus-circle.svg";
import Icon8 from "../assets/arrow-circle-up.svg";
import Icon9 from "../assets/lightning.svg";
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
import LogoutIcon from "../assets/Genie.svg";
import "../styles/common.css";
import { Box } from "@mui/material";

const History = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    const navigate = useNavigate();
    const handleTemplateClick = (path) => {
        navigate(path);
    };

    const history1 = ["My password reset", "How to connect wifi?", "Request new Laptop", "My password reset", "HP Printer Setup Help"]
    const history2 = ["How to install ZOHO CRM", "What is the update on my ..."]

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

            <div style={{ width: '20%', padding: '2rem', color: '#fff' }}>
                <h1>History</h1>

                <div className="chat">
                    <img src={Icon12} alt="Icon 7" />
                    <input type="text" placeholder="Search History" style={{ padding: '0 10px', fontSize: 14 }} />
                </div>

                <br />
                <p style={{ opacity: 0.5, fontWeight: 'bold' }}>TODAY</p>
                {history1.map(item => <p style={{ padding: '0.5rem 0' }}>{item}</p>)}
                <br />
                <p style={{ opacity: 0.5, fontWeight: 'bold' }}>YESTERDAY</p>
                {history2.map(item => <p style={{ padding: '0.5rem 0' }}>{item}</p>)}

            </div>
            <main className="content">
                <div className="content-box">
                    <button className="logout">
                        <img src={LogoutIcon} alt="Logout" />
                    </button>
                    <p className="templates-header">
                        <img src={Icon9} alt="Icon 9" className="template-icon" />
                        Suggested Templates
                    </p>
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
                    </div>

                    <div className="chat" style={{ position: 'fixed' }}>
                        <img src={Icon7} alt="Icon 7" />
                        <input type="text" placeholder="Ask BART Genie" />
                        <button className="icon">
                            <img src={Icon8} alt="Icon 8" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default History;