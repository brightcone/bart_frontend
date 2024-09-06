import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon12 from "../assets/magnifying-glass.svg";
import DashboardContent from "../components/DashboardContent";
import LeftPanel from "../components/LeftPanel";
import "../styles/common.css";

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
            <LeftPanel />
            <div style={{ padding: '2rem', color: '#fff' }}>
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
                <DashboardContent />
            </main>
        </div>
    );
};

export default History;