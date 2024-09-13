import CopyIcon from '@mui/icons-material/ContentCopy';
import {
    Avatar,
    Chip,
    IconButton,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography,
} from '@mui/material';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftPanel from "../components/LeftPanel";
import "../styles/common.css";

import password from "../assets/password.svg";
import ticket from "../assets/ticket.svg";
import glass from "../assets/magnifying-glass.svg";

const Ticket = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    const navigate = useNavigate();
    const handleTemplateClick = (path) => {
        navigate(path);
    };

    const rows = [
        {
            subject: 'Password Recovery',
            ticketNo: '#654345',
            dateTime: 'Jul 19, 06:30PM',
            priority: 'Urgent',
            assignee: { name: 'Darlene Robertson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
            status: 'Active',
        },
        {
            subject: 'Password Recovery',
            ticketNo: '#654345',
            dateTime: 'Jul 19, 06:30PM',
            priority: 'Urgent',
            assignee: { name: 'Darlene Robertson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
            status: 'Active',
        },
        {
            subject: 'Password Recovery',
            ticketNo: '#654345',
            dateTime: 'Jul 19, 06:30PM',
            priority: 'Urgent',
            assignee: { name: 'Darlene Robertson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
            status: 'Active',
        },
        {
            subject: 'Password Recovery',
            ticketNo: '#654345',
            dateTime: 'Jul 19, 06:30PM',
            priority: 'Urgent',
            assignee: { name: 'Darlene Robertson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
            status: 'Active',
        },
        {
            subject: 'Password Recovery',
            ticketNo: '#654345',
            dateTime: 'Jul 19, 06:30PM',
            priority: 'Urgent',
            assignee: { name: 'Darlene Robertson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
            status: 'Active',
        },
        {
            subject: 'Password Recovery',
            ticketNo: '#654345',
            dateTime: 'Jul 19, 06:30PM',
            priority: 'Urgent',
            assignee: { name: 'Darlene Robertson', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
            status: 'Active',
        },
    ];


    return (
        <div className="dashboard">
            <LeftPanel />
            <main className="content">
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
                            <img src={ticket} alt="Settings" height={42} />
                            Your Tickets
                        </h2>

                        <div className="chat" style={{ width: '400' }}>
                            <img src={glass} alt="magnifying-glass" />
                            <input type="text" placeholder="Search History" style={{ padding: '0 10px', fontSize: 14 }} />
                        </div>

                    </div>

                    <TableContainer component={Paper} style={{ backgroundColor: '#121212', color: '#ffffff', borderRadius: '12px' }}>
                        <Table aria-label="ticket table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ color: '#ffffff' }}>Subject</TableCell>
                                    <TableCell style={{ color: '#ffffff' }}>Ticket no.</TableCell>
                                    <TableCell style={{ color: '#ffffff' }}>Date and Time</TableCell>
                                    <TableCell style={{ color: '#ffffff' }}>Priority</TableCell>
                                    <TableCell style={{ color: '#ffffff' }}>Assign to</TableCell>
                                    <TableCell style={{ color: '#ffffff' }}>Status</TableCell>
                                    <TableCell style={{ color: '#ffffff' }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{ borderBottom: '1px solid #6f6f6f' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <img src={password} alt="Password" />
                                                <Typography variant="body2" component="span" style={{ verticalAlign: 'middle', color: '#ffffff' }}>
                                                    {row.subject}
                                                </Typography>
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ color: '#c7c7c7', borderBottom: '1px solid #6f6f6f' }}>{row.ticketNo}</TableCell>
                                        <TableCell style={{ color: '#c7c7c7', borderBottom: '1px solid #6f6f6f' }}>{row.dateTime}</TableCell>
                                        <TableCell style={{ color: 'red', borderBottom: '1px solid #6f6f6f' }}>{row.priority}</TableCell>
                                        <TableCell style={{ color: '#c7c7c7', borderBottom: '1px solid #6f6f6f' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Avatar src={row.assignee.avatar} sx={{ width: 24, height: 24 }} />
                                                {row.assignee.name}
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ borderBottom: '1px solid #6f6f6f' }}>
                                            <Chip label={row.status} style={{ backgroundColor: '#00e676', color: '#fff' }} />
                                        </TableCell>
                                        <TableCell style={{ borderBottom: '1px solid #6f6f6f' }}>
                                            <IconButton aria-label="copy">
                                                <CopyIcon style={{ color: '#c7c7c7' }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </main>
        </div>
    );
};

export default Ticket;