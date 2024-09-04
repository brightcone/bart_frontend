import React, { useState } from 'react';
import Icon1 from '../assets/password.svg';
import Icon2 from '../assets/laptop-1.svg';
import Icon3 from '../assets/laptop.svg';
import Icon4 from '../assets/computer-settings.svg';
import Icon5 from '../assets/wifi.svg';
import Icon6 from '../assets/cleaning-brush.svg';
import Icon9 from '../assets/lightning.svg';
import { Link } from 'react-router-dom';

export const SuggestedTemplate = () => {

    return (
        <div>
            <style> 
                {`
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
                    }
                `}

            </style>
            <p className="templates-header"><img src={Icon9} alt="Icon 9" className="template-icon" />Suggested Templates</p> 
            <div className="suggested-templates">
                <Link to = "/agent" className="template">
                    <img src={Icon1} alt="Icon 1" className="template-icon" />
                    <p>Reset your application passwords with ease.</p>
                </Link>
                <div className="template">
                    <img src={Icon2} alt="Icon 2" className="template-icon" />
                    <p>Drafting and Sending an emails.</p>
                </div>
                <div className="template">
                    <img src={Icon3} alt="Icon 3" className="template-icon" />
                    <p>Here you can summarize any context.</p>
                </div>
                <div className="template">
                    <img src={Icon4} alt="Icon 4" className="template-icon" />
                    <p>Install software with guided instructions and ticket updates.</p>
                </div>
                <div className="template">
                    <img src={Icon5} alt="Icon 5" className="template-icon" />
                    <p>Report connectivity issues and manage network configurations.</p>
                </div>
                <div className="template">
                    <img src={Icon6} alt="Icon 6" className="template-icon" />
                    <p>Schedule equipment maintenance effortlessly.</p>
                </div>
            </div>
        </div>
    );
}