import React, { useState } from 'react';
import Icon7 from '../assets/plus-circle.svg';
import Icon8 from '../assets/arrow-circle-up.svg';
import Icon10 from '../assets/house.svg';
import Icon11 from '../assets/plus.svg';
import Icon12 from '../assets/magnifying-glass.svg';
import Icon13 from '../assets/circles-four.svg';
import Icon14 from '../assets/clock-counter-clockwise.svg';
import Icon15 from '../assets/sticker.svg';
import Icon16 from '../assets/gear-six.svg';
import Icon17 from '../assets/profile.svg';
import Icon18 from '../assets/image 45.svg';
import LessThanIcon from '../assets/less-than.svg'; // Import your less than icon
import GreaterThanIcon from '../assets/greater-than.svg'; // Import your greater than icon
import { SuggestedTemplate } from './SuggestedTemplates';
import { Route, Router, Routes } from 'react-router-dom';
import Agent from './Agent';

const Dashboard = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="dashboard">
            <style>
                {`
                    .dashboard {
                        display: flex;
                        height: 100vh;
                        background-color: #000000;

                    }
                    .sidebar {
                    width: 240px;
                    background-color: #111;
                    padding: 20px;
                    color: white;
                    border-right: 2px solid #ebebeb;
                    transition: width 0.3s; /* Smooth transition */
                    position: relative; /* Ensure this is relative to position children absolutely */
                    }
                    .sidebar.collapsed {
                        width: 60px; /* Width when collapsed */
                    }
                    .toggle-btn {
                        position: absolute;
                        top: 20px; /* Adjust as needed */
                        right: 20px; /* Adjust as needed */
                        background: none;
                        border: none;
                        color: white;
                        font-size: 24px;
                        cursor: pointer;
                        margin-bottom: 10px; /* Space between button and content */
                        display: flex;
                        align-items: center;
                    }
                    .profile {
                        text-align: center;
                    }
                    .profile img {
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        display: block;
                        margin: 0 auto;
                    }
                    .profile-name, .profile-role {
                        display: block; /* Make profile name and role block-level for proper spacing */
                    }
                    .profile-role {
                        margin-top: 5px; /* Space between name and role */
                        color: #888; /* Optional: Adjust color for the role */
                    }
                    .nav ul {
                        list-style-type: none;
                        padding: 0;
                        margin: 0;
                    }
                    .nav li {
                        margin: 10px 0; /* Space between items */
                        font-size: 16px;
                        cursor: pointer;
                        padding: 20px 20px; /* Add padding inside the box */
                        border-radius: 20px; /* Rounded corners */
                        background-color: #222; /* Background color of the box */
                        color: white; /* Text color */
                        display: flex; /* Align items horizontally */
                        align-items: center; /* Center items vertically */
                    }
                    .nav li:hover {
                        background-color: #b5b3b3; /* Darker background on hover */
                    }
                    .nav li img {
                        margin-right: 10px; /* Space between icon and text */
                        width: 24px; /* Adjust size as needed */
                        height: 24px; /* Adjust size as needed */
                    }
                    .nav-text {
                        display: inline; /* Show text when sidebar is expanded */
                    }
                    .sidebar.collapsed .nav-text {
                        display: none; /* Hide text when sidebar is collapsed */
                    }
                    .sidebar.collapsed .footerdiv div {
                        display: none; /* Hide text when sidebar is collapsed */
                    }
                    .footer {
                        position: absolute;
                        bottom: 0;
                        width: 100%; /* Ensure the footer takes the full width of the sidebar */
                        max-width: 240px; /* Max width when the sidebar is expanded */
                        padding: 5px;
                        background-color: grey; /* Match sidebar background color */
                        display: flex;
                        justify-content: center;
                        border-radius: 20px;
                        box-sizing: border-box; /* Ensure padding is included in the width calculation */
                        overflow: hidden; /* Prevent any content overflow */
                    }
                    .sidebar.collapsed .footer {
                        max-width: 60px; /* Adjust width to match the collapsed sidebar */
                    }


                    .footerdiv {
                        display: flex;
                        align-items: center; /* Center the image and text vertically */
                        width: 100%;
                    }

                    .footerdiv img {
                        width: 50px; /* Maintain aspect ratio */
                        height: 50px; /* Adjust the height to align with the text */
                        margin-right: 10px; /* Space between image and text */
                    }

                    .footerdiv div {
                        display: flex;
                        flex-direction: column;
                        justify-content: center; /* Center the text vertically relative to the image */
                    }
                    .footerdiv p {
                        margin: 0; /* Remove default paragraph margins */
                        color: white;
                        text-align: left; /* Align text to the left */
                        white-space: nowrap; /* Prevent text from wrapping to a new line */
                        overflow: hidden; /* Hide any overflow if the text is too long */
                        text-overflow: ellipsis; /* Add ellipsis if the text overflows */
                    }
                    .content {
                        flex: 1;
                        background: linear-gradient(to right, #000000 0%, #171852 100%);
                        padding: 40px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        border-radius: 30px; 
                    }
                    .suggested-templates {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr); /* Adjust the number 3 to how many columns you want */
                        gap: 15px;
                        justify-content: center; /* Center the grid horizontally */
                        align-items: center; /* Center the grid vertically */
                        margin: 0 auto; /* Center the grid horizontally with auto margins */
                        padding: 50px 350px; /* Add padding to space it vertically from other elements */
                        color:white;
                    }
                    .templates-header {
                        text-align: center; /* Center the text horizontally */
                        font-size: 24px; /* Adjust font size as needed */
                        color: white; /* Adjust color as needed */
                        margin-bottom: 0px; /* Add spacing between header and grid */
                        margin-top:200px;                 
                    }
                    .template {
                        background-color: #262626;
                        padding: 20px;
                        border-radius: 20px;
                        color: white;
                        text-align: center;
                    }
                    .suggested-templates > .template {
                        background-color: #1F1F1F;
                        border-radius: 16px;
                        padding: 20px;
                        text-align: center;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        color: white;
                    }
                    .chat {
                        display: flex;
                        justify-content: space-between;
                        background-color: #262626;
                        padding: 15px;
                        border-radius: 50px;
                    }
                    .chat input {
                        flex: 1;
                        border: none;
                        background: none;
                        color: white;
                        font-size: 16px;
                        padding: 10px;
                    }
                    .chat button {
                        background-color: #444;
                        color: white;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 8px;
                        cursor: pointer;
                    }
                    .icon{
                        border-radius: 50%;
                        background-color: #444; /* Background color */
                        border: none; /* Remove default border */
                        padding: 10px; /* Adjust padding */
                        cursor: pointer;
                        width: 50px; /* Set the width and height to create a perfect circle */
                        height: 50px;
                        display: flex; /* Align icon in the center */
                        align-items: center;
                        justify-content: center;
                        width: 30px; /* Adjust size as needed */
                        height: 30px; /* Adjust size as needed */
                    }
                `}
            </style>
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    <img src={isCollapsed ? GreaterThanIcon : LessThanIcon} alt="Toggle Icon" />
                </button>
                <div className="profile">
                    <img src={Icon17} alt="Profile" />
                    <span className="profile-name">Floyd Miles</span>
                    <small className="profile-role">Product Manager</small>
                </div>
                <nav className="nav">
                    <ul>
                        <li><img src={Icon10} alt="Icon 10" className="template-icon" /><span className="nav-text">Home</span></li>
                        <li><img src={Icon11} alt="Icon 11" className="template-icon" /><span className="nav-text">New chat</span></li>
                        <li><img src={Icon12} alt="Icon 12" className="template-icon" /><span className="nav-text">Search</span></li>
                        <li><img src={Icon13} alt="Icon 13" className="template-icon" /><span className="nav-text">Templates</span></li>
                        <li><img src={Icon14} alt="Icon 14" className="template-icon" /><span className="nav-text">History</span></li>
                        <li><img src={Icon15} alt="Icon 15" className="template-icon" /><span className="nav-text">Tickets</span></li>
                        <li><img src={Icon16} alt="Icon 16" className="template-icon" /><span className="nav-text">Settings</span></li>
                    </ul>
                </nav>
                <footer className='footer'>
                    <div className='footerdiv'>
                        <img src={Icon18} alt="BART Logo" />
                        <div>
                            <p><strong>BART</strong></p>
                            <p>Bay Area Rapid Transit</p>
                        </div>
                    </div>
                </footer>

            </aside>
            <main className="content">

                <Agent></Agent>
                <div className="chat">
                    <img src={Icon7} alt="Icon 7" className="template-icon" />
                    <input type="text" placeholder="Ask BART Genie" />
                    <button className='icon'><img src={Icon8} alt="Icon 8" className="template-icon" /></button>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;



// import React, { useState } from 'react';
// import Icon1 from '../assets/password.svg';
// import Icon2 from '../assets/laptop-1.svg';
// import Icon3 from '../assets/laptop.svg';
// import Icon4 from '../assets/computer-settings.svg';
// import Icon5 from '../assets/wifi.svg';
// import Icon6 from '../assets/cleaning-brush.svg';
// import Icon7 from '../assets/plus-circle.svg';
// import Icon8 from '../assets/arrow-up-right.svg';
// import Icon9 from '../assets/lightning.svg';
// import Icon10 from '../assets/house.svg';
// import Icon11 from '../assets/plus.svg';
// import Icon12 from '../assets/magnifying-glass.svg';
// import Icon13 from '../assets/circles-four.svg';
// import Icon14 from '../assets/clock-counter-clockwise.svg';
// import Icon15 from '../assets/sticker.svg';
// import Icon16 from '../assets/gear-six.svg';

// const Dashboard = () => {
//     const [isCollapsed, setIsCollapsed] = useState(false);

//     const toggleSidebar = () => {
//         setIsCollapsed(!isCollapsed);
//     };

//     return (
//         <div className="dashboard">
//             <style>
//                 {`
//                     .dashboard {
//                         display: flex;
//                         height: 100vh;
//                     }
//                     .sidebar {
//                         width: 240px;
//                         background-color: #111;
//                         padding: 20px;
//                         color: white;
//                         border-right: 2px solid #ebebeb;
//                         transition: width 0.3s; /* Smooth transition */
//                     }
//                     .sidebar.collapsed {
//                         width: 60px; /* Width when collapsed */
//                     }
//                     .toggle-btn {
//                         background: none;
//                         border: none;
//                         color: white;
//                         font-size: 24px;
//                         cursor: pointer;
//                         margin-bottom: 10px; 
//                     }
//                     .profile {
//                         text-align: center;
//                     }
//                     .profile img {
//                         border-radius: 50%;
//                         width: 80px;
//                         height: 80px;
//                         display: block;
//                         margin: 0 auto;
//                     }
//                     .profile-name, .profile-role {
//                         display: block;
//                     }
//                     .profile-role {
//                         margin-top: 5px; /* Space between name and role */
//                         color: #888; /* Optional: Adjust color for the role */
//                     }
//                     .nav ul {
//                         list-style-type: none;
//                         padding: 0;
//                         margin: 0;
//                     }
//                     .nav li {
//                         margin: 10px 0; /* Space between items */
//                         font-size: 16px;
//                         cursor: pointer;
//                         padding: 20px 20px; /* Add padding inside the box */
//                         border-radius: 20px; /* Rounded corners */
//                         background-color: #222; /* Background color of the box */
//                         color: white; /* Text color */
//                         display: flex; /* Align items horizontally */
//                         align-items: center; /* Center items vertically */
                        
//                     }
//                      .nav li:hover {
//                     background-color: #b5b3b3; /* Darker background on hover */
//                     }
//                     .nav li img {
//                         margin-right: 10px; /* Space between icon and text */
//                         width: 24px; /* Adjust size as needed */
//                         height: 24px; /* Adjust size as needed */
//                     }
//                     .nav-text {
//                         display: inline; /* Show text when sidebar is expanded */
//                     }
//                     .sidebar.collapsed .nav-text {
//                         display: none; /* Hide text when sidebar is collapsed */
//                     }
//                     .content {
//                         flex: 1;
//                         background: linear-gradient(to right, #000000 0%, #1f2270 100%);
//                         padding: 40px;
//                         display: flex;
//                         flex-direction: column;
//                         justify-content: space-between;
//                     }
//                     .suggested-templates {
//                         display: grid;
//                         grid-template-columns: repeat(3, 1fr); /* Adjust the number 3 to how many columns you want */
//                         gap: 15px;
//                         justify-content: center; /* Center the grid horizontally */
//                         align-items: center; /* Center the grid vertically */
//                         margin: 0 auto; /* Center the grid horizontally with auto margins */
//                         padding: 50px 350px; /* Add padding to space it vertically from other elements */
//                         color:white;
//                     }
//                     .templates-header {
//                         text-align: center; /* Center the text horizontally */
//                         font-size: 24px; /* Adjust font size as needed */
//                         color: white; /* Adjust color as needed */
//                         margin-bottom: 0px; /* Add spacing between header and grid */
//                         margin-top:200px;                 
//                     }
//                     .template {
//                         background-color: #262626;
//                         padding: 20px;
//                         border-radius: 20px;
//                         color: white;
//                         text-align: center;
//                     }
//                     .suggested-templates > .template {
//                         background-color: #1F1F1F;
//                         border-radius: 16px;
//                         padding: 20px;
//                         text-align: center;
//                         box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//                         color: white;
//                     }
//                     .chat {
//                         display: flex;
//                         justify-content: space-between;
//                         background-color: #262626;
//                         padding: 15px;
//                         border-radius: 50px;
//                     }
//                     .chat input {
//                         flex: 1;
//                         border: none;
//                         background: none;
//                         color: white;
//                         font-size: 16px;
//                         padding: 10px;
//                     }
//                     .chat button {
//                         background-color: #444;
//                         color: white;
//                         border: none;
//                         padding: 10px 15px;
//                         border-radius: 8px;
//                         cursor: pointer;
//                     }
//                 `}
//             </style>
//             <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
//                 <button className="toggle-btn" onClick={toggleSidebar}>&#60;</button>
//                 <div className="profile">
//                     <img src="profile-pic-url" alt="Profile" />
//                     <span className="profile-name">Floyd Miles</span>
//                     <small className="profile-role">Product Manager</small>
//                 </div>
//                 <nav className="nav">
//                     <ul>
//                         <li><img src={Icon10} alt="Icon 10" className="template-icon" /><span className="nav-text">Home</span></li>
//                         <li><img src={Icon11} alt="Icon 11" className="template-icon" /><span className="nav-text">New chat</span></li>
//                         <li><img src={Icon12} alt="Icon 12" className="template-icon" /><span className="nav-text">Search</span></li>
//                         <li><img src={Icon13} alt="Icon 13" className="template-icon" /><span className="nav-text">Templates</span></li>
//                         <li><img src={Icon14} alt="Icon 14" className="template-icon" /><span className="nav-text">History</span></li>
//                         <li><img src={Icon15} alt="Icon 15" className="template-icon" /><span className="nav-text">Tickets</span></li>
//                         <li><img src={Icon16} alt="Icon 16" className="template-icon" /><span className="nav-text">Settings</span></li>
//                     </ul>
//                 </nav>
//             </aside>
//             <main className="content">
//                 <div>
//                     <p className="templates-header"><img src={Icon9} alt="Icon 9" className="template-icon" />Suggested Templates</p> {/* Position this paragraph outside the grid container */}
//                     <div className="suggested-templates">
//                         <div className="template">
//                             <img src={Icon1} alt="Icon 1" className="template-icon" />
//                             <p>Reset your application passwords with ease.</p>
//                         </div>
//                         <div className="template">
//                             <img src={Icon2} alt="Icon 2" className="template-icon" />
//                             <p>Seamlessly request and track new equipment approvals.</p>
//                         </div>
//                         <div className="template">
//                             <img src={Icon3} alt="Icon 3" className="template-icon" />
//                             <p>Setup, maintain, and troubleshoot all your devices.</p>
//                         </div>
//                         <div className="template">
//                             <img src={Icon4} alt="Icon 4" className="template-icon" />
//                             <p>Install software with guided instructions and ticket updates.</p>
//                         </div>
//                         <div className="template">
//                             <img src={Icon5} alt="Icon 5" className="template-icon" />
//                             <p>Detect and fix WiFi issues with real-time support.</p>
//                         </div>
//                         <div className="template">
//                             <img src={Icon6} alt="Icon 6" className="template-icon" />
//                             <p>Schedule equipment maintenance effortlessly.</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="chat">
//                     <img src={Icon7} alt="Icon 7" className="template-icon" />
//                     <input type="text" placeholder="Ask BART Genie" />
//                     <button><img src={Icon8} alt="Icon 8" className="template-icon" /></button>
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default Dashboard;
