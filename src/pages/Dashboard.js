

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon1 from '../assets/password.svg';
import Icon2 from '../assets/laptop-1.svg';
import Icon3 from '../assets/laptop.svg';
import Icon4 from '../assets/computer-settings.svg';
import Icon5 from '../assets/wifi.svg';
import Icon6 from '../assets/cleaning-brush.svg';
import Icon7 from '../assets/plus-circle.svg';
import Icon8 from '../assets/arrow-circle-up.svg';
import Icon9 from '../assets/lightning.svg';
import Icon10 from '../assets/house.svg';
import Icon11 from '../assets/plus.svg';
import Icon12 from '../assets/magnifying-glass.svg';
import Icon13 from '../assets/circles-four.svg';
import Icon14 from '../assets/clock-counter-clockwise.svg';
import Icon15 from '../assets/sticker.svg';
import Icon16 from '../assets/gear-six.svg';
import Icon17 from '../assets/profile.svg';
import Icon18 from '../assets/image 45.svg';
import LessThanIcon from '../assets/less-than.svg';
import GreaterThanIcon from '../assets/greater-than.svg';
import LogoutIcon from '../assets/Genie.svg'; 
import '../styles/common.css';


const Dashboard = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
  
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    const navigate = useNavigate();
    const handleTemplateClick = (path) => {
        navigate(path);
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
                        background-color: #000000;
                        padding: 20px;
                        color: white;
                        border-right: 2px solid #202020;
                        transition: width 0.7s ease; /* Adjust duration and easing function */
                        position: relative;
                    }
                    .sidebar.collapsed {
                        width: 60px;
                        padding: 10px 10px; 

                    }
                    .toggle-btn {
                        position: absolute;
                        top: 20px;
                        right: -12px;
                        background: none;
                        border: 2px solid #484848; /* Border color and thickness */
                        border-radius: 70%; /* Makes the button circular */
                        color: white;
                        font-size: 3px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center; /* Center the icon within the button */
                        width: 20px; /* Adjust width */
                        height: 20px; /* Adjust height */
                        padding: 10px; /* Add padding if needed */
                        background-color: #000000
                        
                    }

                    .logout-btn {
                        position: absolute;
                        top: 20px;
                        right: 80px; /* Adjust position as needed */
                        background: none;
                        border: none;
                        color: white;
                        font-size: 24px;
                        cursor: pointer;
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
                        display: block;
                    }
                    .profile-role {
                        margin-top: 5px;
                        color: #888;
                    }
                    .nav ul {
                        list-style-type: none;
                        padding: 0;
                        margin: 0;
                    }
                    .nav li {
                        margin: 10px 0;
                        font-size: 16px;
                        cursor: pointer;
                        padding: 20px 20px;
                        border-radius: 20px;
                        background-color: #000000;
                        color: white;
                        display: flex;
                        align-items: center;
                    }
                    .nav li:hover {
                        transform: scale(1.05); /* Slightly enlarge the template on hover */
                        background-color: #333333;
                    }
                    .nav li img {
                        margin-right: 10px;
                        width: 24px;
                        height: 24px;
                    }
                    .nav-text {
                        transition: opacity 10s ease, visibility -5s ease;
                        opacity: 1;
                        visibility: visible;
                    }
                    .sidebar.collapsed .nav-text {
                        opacity: 0;
                        visibility: hidden;
                    }
                    .sidebar.collapsed .footerdiv div {
                        display: none;
                    }
                    .footer {
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        max-width: 240px;
                        padding: 5px;
                        background-color: grey;
                        display: flex;
                        justify-content: center;
                        border-radius: 20px;
                        box-sizing: border-box;
                        overflow: hidden;
                    }
                    .sidebar.collapsed .footer {
                        max-width: 60px;
                    }
                    .footerdiv {
                        display: flex;
                        align-items: center;
                        width: 100%;
                    }
                    .footerdiv img {
                        width: 50px;
                        height: 50px;
                        margin-right: 10px;
                    }
                    .footerdiv div {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    .footerdiv p {
                        margin: 0;
                        color: white;
                        text-align: left;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .content {
                        flex: 1;
                        padding: 10px;
                        display: flex;
                        flex-direction: column;
                        
                        border-radius: 30px;
                        
                    }
                    .content-box {
                        background-color: #282828;
                        background: linear-gradient(to right, #202020 0%, #171852 100%);
                        border: 2px solid #282828;
                        padding: 20px;
                        margin-top: 10px;
                        margin-right: 20px;
                        margin-bottom: 10px;
                        margin-left: 20px;
                        border-radius: 30px;
                        
                        height: 100vh;
                    }
                    .suggested-templates {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 15px;
                        justify-content: center;
                        align-items: center;
                        margin: 0 auto;
                        padding: 50px 300px;
                        color:white;
                        position: fixed;
                    }
                    .templates-header {
                        text-align: center;
                        font-size: 24px;
                        color: white;
                        margin-bottom: 0px;
                        margin-top:200px;
                    }
                    .template {
                        background-color: #262626;
                        padding: 20px;
                        border-radius: 20px;
                        color: white;
                        text-align: left;
                        cursor:pointer;
                    }
                    .suggested-templates > .template {
                        background-color: #1F1F1F;
                        border-radius: 50px;
                        padding: 20px;
                        text-align: left;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        color: white;
                        border: 2px solid #282828;
                        width: 250px;
                        height: 100px;
                        display: flex;
                        align-items: flex-start; 
                        flex-direction: column;
                        text-decoration: none; /* Removes underline from links */
                        transition: transform 0.3s ease, background-color 0.3s ease;
                    }

                    .suggested-templates > .template:hover {
                    transform: scale(1.05); /* Slightly enlarge the template on hover */
                    background-color: #333333; /* Darken background on hover */
                    }

                    .template-icon {
                    margin-right: 10px;
                    width: 24px;
                    height: 24px;
                    margin-bottom: 5px;
                    }

                    .suggested-templates > .template p {
                    text-align:left;
                    font-size: 16px;
                    
                    color: #ffffff; /* Ensure text color is white */
                    }

                    .chat {
                            display: flex;
                            justify-content: space-between;
                            background-color: #262626;
                            padding: 10px;
                            border-radius: 50px;
                            border: 1px solid #404040;
                            position: fixed;
                            bottom: 50px;
                            left: 350px; /* Default left position when sidebar is expanded */
                            right: 80px; /* Right side remains fixed */
                            margin: 0;
                            transition: left 0.7s ease; /* Smooth transition for left property */
                        }

                        /* When the sidebar is collapsed */
                        .sidebar.collapsed ~ .content .chat {
                            left: 150px; /* Adjust this value based on collapsed sidebar width */
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
                        padding: 0px 0px;
                        border-radius: 50%;
                        cursor: pointer;
                    }
                    .icon {
                        border-radius: 50%;
                        background-color: #444;
                        border: none;
                        padding: 20px;
                        cursor: pointer;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .logout {
                        position: absolute;
                        top: 50px; /* Adjust the top position as needed */
                        right: 50px; /* Adjust the right position as needed */
                        background-color: #444; /* Background color for the button */
                        border: none; /* Remove default border */
                        border-radius: 50%; /* Make the button circular */
                        width: 30px; /* Set the width and height for the circular button */
                        height: 30px;
                        display: flex; /* Center the icon inside the button */
                        align-items: center;
                        justify-content: center;
                        cursor: pointer; /* Change cursor to pointer on hover */
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Optional: Add shadow */
                        transition: background-color 0.3s ease; /* Smooth background color transition */
                }

                .logout img {
                    width: 40px; /* Adjust icon size */
                    height: 40px;
                }

                .logout:hover {
                    background-color: #555; /* Change background color on hover */
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
             
                 <div className="content-box">
                        <button className="logout">
                            <img src={LogoutIcon} alt="Logout" />
                        </button>
                     <p className="templates-header"><img src={Icon9} alt="Icon 9" className="template-icon" />Suggested Templates</p> 
                     <div className="suggested-templates">
                        <div className="template" onClick={() => handleTemplateClick('/agent')}>
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
                            <p>Install software with guided instructions and ticket updates.</p>
                        </a>
                        <a href="connectivity-issues-url" className="template">
                            <img src={Icon5} alt="Icon 5" className="template-icon" />
                            <p>Report connectivity issues and manage network configurations.</p>
                        </a>
                        <a href="equipment-maintenance-url" className="template">
                            <img src={Icon6} alt="Icon 6" className="template-icon" />
                            <p>Schedule equipment maintenance effortlessly.</p>
                        </a>
                    </div>

                     <div className="chat">
                            <img src={Icon7} alt="Icon 7" className="template-icon" />
                            <input type="text" placeholder="Ask BART Genie" />
                            <button className='icon'><img src={Icon8} alt="Icon 8" className="template-icon" /></button>
                        </div>
             
                     
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
// import Icon8 from '../assets/arrow-circle-up.svg';
// import Icon9 from '../assets/lightning.svg';
// import Icon10 from '../assets/house.svg';
// import Icon11 from '../assets/plus.svg';
// import Icon12 from '../assets/magnifying-glass.svg';
// import Icon13 from '../assets/circles-four.svg';
// import Icon14 from '../assets/clock-counter-clockwise.svg';
// import Icon15 from '../assets/sticker.svg';
// import Icon16 from '../assets/gear-six.svg';
// import Icon17 from '../assets/profile.svg';
// import Icon18 from '../assets/image 45.svg';
// import LessThanIcon from '../assets/less-than.svg'; // Import your less than icon
// import GreaterThanIcon from '../assets/greater-than.svg'; // Import your greater than icon

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
//                         background-color: #000000;

//                     }
//                     .sidebar {
//                     width: 240px;
//                     background-color: #111;
//                     padding: 20px;
//                     color: white;
//                     border-right: 2px solid #202020;
//                     transition: width 0.7s; /* Smooth transition */
//                     position: relative; /* Ensure this is relative to position children absolutely */
//                     }
//                     .sidebar.collapsed {
//                         width: 60px; /* Width when collapsed */
//                     }
//                     .toggle-btn {
//                         position: absolute;
//                         top: 20px; /* Adjust as needed */
//                         right: 20px; /* Adjust as needed */
//                         background: none;
//                         border: none;
//                         color: white;
//                         font-size: 24px;
//                         cursor: pointer;
//                         margin-bottom: 10px; /* Space between button and content */
//                         display: flex;
//                         align-items: center;
//                     }
//                     .profile {
//                         text-align: center;
//                     }
//                     .profile img {
//                         border-radius: 50%;
//                         width: 50px;
//                         height: 50px;
//                         display: block;
//                         margin: 0 auto;
//                     }
//                     .profile-name, .profile-role {
//                         display: block; /* Make profile name and role block-level for proper spacing */
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
//                     .nav li:hover {
//                         background-color: #b5b3b3; /* Darker background on hover */
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
//                     .sidebar.collapsed .footerdiv div {
//                         display: none; /* Hide text when sidebar is collapsed */
//                     }
//                     .footer {
//                         position: absolute;
//                         bottom: 0;
//                         width: 100%; /* Ensure the footer takes the full width of the sidebar */
//                         max-width: 240px; /* Max width when the sidebar is expanded */
//                         padding: 5px;
//                         background-color: grey; /* Match sidebar background color */
//                         display: flex;
//                         justify-content: center;
//                         border-radius: 20px;
//                         box-sizing: border-box; /* Ensure padding is included in the width calculation */
//                         overflow: hidden; /* Prevent any content overflow */
//                     }
//                     .sidebar.collapsed .footer {
//                         max-width: 60px; /* Adjust width to match the collapsed sidebar */
//                     }


//                     .footerdiv {
//                         display: flex;
//                         align-items: center; /* Center the image and text vertically */
//                         width: 100%;
//                     }

//                     .footerdiv img {
//                         width: 50px; /* Maintain aspect ratio */
//                         height: 50px; /* Adjust the height to align with the text */
//                         margin-right: 10px; /* Space between image and text */
//                     }

//                     .footerdiv div {
//                         display: flex;
//                         flex-direction: column;
//                         justify-content: center; /* Center the text vertically relative to the image */
//                     }
//                     .footerdiv p {
//                         margin: 0; /* Remove default paragraph margins */
//                         color: white;
//                         text-align: left; /* Align text to the left */
//                         white-space: nowrap; /* Prevent text from wrapping to a new line */
//                         overflow: hidden; /* Hide any overflow if the text is too long */
//                         text-overflow: ellipsis; /* Add ellipsis if the text overflows */
//                     }
//                     .content {
//                         flex: 1;
//                         padding: 10px;
//                         display: flex;
//                         flex-direction: column;
//                         justify-content: space-between;
//                         border-radius: 30px; 
//                     }
//                     .content-box {
//                         background-color: #282828;
//                         background: linear-gradient(to right, #202020 0%, #171852 100%);
//                         border: 2px solid #282828; /* Optional, in case you want a border */
//                         padding: 20px; /* Adjust the padding as needed */
//                         margin-top: 10px; /* Increase the top margin */
//                         margin-right: 20px;
//                         margin-bottom: 10px;
//                         margin-left: 20px;
//                         border-radius: 30px; /* Optional, for rounded corners */
//                         // height: 1200px;
//                         position: relative;
//                         height: 100vh; 

//                     }
                       
//                     .suggested-templates {
//                         display: grid;
//                         grid-template-columns: repeat(3, 1fr); /* Adjust the number 3 to how many columns you want */
//                         gap: 15px;
//                         justify-content: center; /* Center the grid horizontally */
//                         align-items: center; /* Center the grid vertically */
//                         margin: 0 auto; /* Center the grid horizontally with auto margins */
//                         padding: 50px 300px; /* Add padding to space it vertically from other elements */
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
                        
//                         text-align: left;
//                     }
//                     .suggested-templates > .template {
//                         background-color: #1F1F1F;
//                         border-radius: 50px;
//                         padding: 20px;
//                         text-align: left;
//                         box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//                         color: white;
//                         border: 2px solid #282828;
//                         width: 250px; /* Set the fixed width */
//                         height: 100px; /* Set the fixed height */
                        
//                     }
//                     .chat {
//                         display: flex;
//                         justify-content: space-between;
//                         background-color: #262626;
//                         padding: 10px;
//                         border-radius: 50px;
//                         border: 1px solid #404040;
//                         position: absolute;  /* Positioning the .chat at the bottom */
//                         bottom: 0;
//                         left: 0;
//                         right: 0;
//                         margin: 20px; /* Optional: Adjust the margin to control spacing */
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
//                     .icon{
//                         border-radius: 50%;
//                         background-color: #444; /* Background color */
//                         border: none; /* Remove default border */
//                         padding: 10px; /* Adjust padding */
//                         cursor: pointer;
//                         width: 50px; /* Set the width and height to create a perfect circle */
//                         height: 50px;
//                         display: flex; /* Align icon in the center */
//                         align-items: center;
//                         justify-content: center;
//                         width: 30px; /* Adjust size as needed */
//                         height: 30px; /* Adjust size as needed */
//                     }
               
//                 `}
//             </style>
//             <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
//                 <button className="toggle-btn" onClick={toggleSidebar}>
//                     <img src={isCollapsed ? GreaterThanIcon : LessThanIcon} alt="Toggle Icon" />
//                 </button>
//                 <div className="profile">
//                     <img src={Icon17} alt="Profile" />
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
//                 <footer className='footer'>
//                     <div className='footerdiv'>
//                         <img src={Icon18} alt="BART Logo" />
//                         <div>
//                             <p><strong>BART</strong></p>
//                             <p>Bay Area Rapid Transit</p>
//                         </div>
//                     </div>
//                 </footer>

//             </aside>
//             <main className="content">
//                 <div className="content-box">
//                     <p className="templates-header"><img src={Icon9} alt="Icon 9" className="template-icon" />Suggested Templates</p> 
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
//                             <p>Report connectivity issues and manage network configurations.</p>
//                         </div>
//                         <div className="template">
//                             <img src={Icon6} alt="Icon 6" className="template-icon" />
//                             <p>Schedule equipment maintenance effortlessly.</p>
//                         </div>
              
//                     </div>
//                     <div className="chat">
//                     <img src={Icon7} alt="Icon 7" className="template-icon" />
//                     <input type="text" placeholder="Ask BART Genie" />
//                     <button className='icon'><img src={Icon8} alt="Icon 8" className="template-icon" /></button>
//                 </div>
//                     </div>
                
//             </main>
//         </div>
       
//     );
// }

// export default Dashboard;

