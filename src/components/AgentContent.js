import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon8 from "../assets/arrow-circle-up.svg";
import LogoutIcon from "../assets/Genie.svg";
import Icon7 from "../assets/plus-circle.svg";
import "../styles/common.css";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const AgentContent = () => {

      const navigate = useNavigate();
 
    const handleConfirmLogout = () => {
        navigate('/login');
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
                        
                        <MenuItem onClick={handleConfirmLogout}>Logout</MenuItem>
                    </Menu>
                </div>

                           </div>
       

            <div className="chat" style={{ position: 'absolute' }}>
                <img src={Icon7} alt="Icon 7" />
                
                <input type="text" placeholder="Ask BART Genie" />
                <img src={Icon8} alt="Icon 8" className="template-icon1" />
                
            </div>
        </div>
    )
}

export default AgentContent;