// src/views/TicketDetail/ChatMessageBubble.jsx
import React from 'react';
import { Box, Typography, Avatar, Tooltip, useTheme } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useSelector } from 'react-redux';

const roleColors = {
    Admin: '#1976d2',
    Team: '#388e3c',
    Customer: '#9c27b0',
};

const ChatMessageBubble = ({ message, isPrivate }) => {
    const theme = useTheme();
    const currentUser = useSelector(state => state.admin.Admin);

    const isOwnMessage = message?.commentBy?._id === currentUser?._id;


    // clg

    const senderRole = message.createdByModel || 'Unknown';
    const senderName = message.createdByName || senderRole; // Fallback to role if name not available
    const createdAt = new Date(message.createdAt).toLocaleString();

    const messageContent = message.content || '';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                // alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                // width: '100%',
                // mb: 1.5,
                // justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
            }}
        >
            {/* Avatar */}
            <Tooltip title={`${senderName} (${senderRole})`}>
                <Avatar
                    sx={{
                        bgcolor: roleColors[senderRole] || theme.palette.grey[500],
                        width: 42,
                        height: 42,
                        fontSize: '1.2rem',
                        ml: isOwnMessage ? 1 : 0,
                        mr: isOwnMessage ? 0 : 1,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // Soft shadow for avatars
                    }}
                >
                    {senderName?.charAt(0).toUpperCase() || senderRole.charAt(0).toUpperCase()}
                </Avatar>
            </Tooltip>

            {/* Message Bubble */}
            <Box
                sx={{
                    maxWidth: '75%',
                    bgcolor: isOwnMessage ? '#DCF8C6' : '#FFFFFF',
                    color: isOwnMessage ? 'black' : theme.palette.text.primary,
                    p: 2,
                    borderRadius: 2,
                    borderTopLeftRadius: isOwnMessage ? 12 : 2,
                    borderTopRightRadius: isOwnMessage ? 2 : 12,
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    position: 'relative',
                    display: 'inline-block',
                    ml: isOwnMessage ? 'auto' : 0,
                    mr: isOwnMessage ? 0 : 'auto',
                    boxShadow: isOwnMessage ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.02)' }, // Small hover effect for bubbles
                }}
            >
                {/* Message Content */}
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {messageContent}
                </Typography>

                {/* Attachments */}
                {message.attachments?.length > 0 && (
                    <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                        {message.attachments.map((att) => (
                            <Box
                                key={att._id}
                                component="a"
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid',
                                    borderColor: theme.palette.divider,
                                    borderRadius: 1,
                                    px: 1,
                                    py: 0.5,
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    textDecoration: 'none',
                                    transition: 'background 0.3s ease',
                                    '&:hover': { background: theme.palette.grey[100] },
                                }}
                            >
                                <InsertDriveFileIcon fontSize="small" sx={{ mr: 0.5 }} />
                                {att.filename || 'File'}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Timestamp */}
                <Typography
                    variant="caption"
                    sx={{
                        position: 'absolute',
                        bottom: 2,
                        right: 6,
                        fontSize: '0.65rem',
                        opacity: 0.6,
                        color: isOwnMessage ? '#4a4a4a' : '#aaa',
                    }}
                >
                    {createdAt}
                </Typography>
            </Box>
        </Box>
    );
};

export default ChatMessageBubble;
