// ProjectBoard/TaskDetailActivity.jsx
import React, { useState } from 'react';
import {
    Box, Button, Typography, TextField, IconButton, Avatar, Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';

// Material-UI Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AddIcon from '@mui/icons-material/Add'; // For 'created' activity icon

// Dummy data for users (should ideally come from props or global context)
import { users } from '../Index';

const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
};

const TaskDetailActivity = ({ task }) => { // task prop is used for assignee name in mock activity
    const theme = useTheme();
    const [comment, setComment] = useState('');

    const textColor = theme.palette.mode === 'dark' ? grey[100] : grey[800];
    const secondaryTextColor = theme.palette.mode === 'dark' ? grey[400] : theme.palette.text.secondary;
    const inputLabelColor = theme.palette.mode === 'dark' ? grey[400] : theme.palette.text.secondary;
    const inputBorderColor = theme.palette.mode === 'dark' ? grey[600] : grey[400];
    const inputTextColor = theme.palette.mode === 'dark' ? grey[100] : theme.palette.text.primary;

    const handleSendComment = () => {
        if (comment.trim()) {
            console.log('Sending comment:', comment);
            // In a real app, you'd send this to a backend
            setComment('');
        }
    };

    // Mock activity log for demonstration
    const mockActivityLog = [
        { type: 'assigned', time: 'AN HOUR AGO', detail: `${getUserName('user-1')} → ${getUserName(task.assignedTo)}` },
        { type: 'assigned', time: 'AN HOUR AGO', detail: `${getUserName('user-1')} → Mostwanted` },
        { type: 'created', time: 'AN HOUR AGO', detail: `${getUserName('user-1')} created the task` },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(1.5), // gap-3
                flex: 1, // flex-1
                marginTop: 'auto' // mt-auto
            }}
        >
            <Button
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(1), // gap-2
                    color: textColor, // text-gray-700
                    fontWeight: 600, // font-semibold
                    fontSize: '0.875rem', // text-sm
                    marginBottom: theme.spacing(1), // mb-2
                    textTransform: 'none',
                    padding: 0, // Remove default button padding
                    '&:hover': { backgroundColor: 'transparent' } // Keep transparent on hover
                }}
                startIcon={<KeyboardArrowDownIcon sx={{ fontSize: '0.75rem' }} />} // text-xs
                onClick={() => console.log('Toggle Activity')} // Placeholder for toggle
            >
                Activity
            </Button>
            <TextField
                multiline
                rows={3}
                placeholder="Click to add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{
                    resize: 'vertical', // resize-none (changed to vertical for more control)
                    borderColor: grey[300], // border border-gray-300
                    borderRadius: '8px', // rounded-md
                    padding: theme.spacing(1), // p-2
                    fontSize: '0.75rem', // text-xs
                    color: inputTextColor, // text-gray-400
                    '& .MuiInputBase-input::placeholder': {
                        color: theme.palette.mode === 'dark' ? grey[500] : grey[400], // placeholder-gray-400
                        opacity: 1, // Fix for placeholder opacity in MUI
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: inputBorderColor },
                        '&:hover fieldset': { borderColor: theme.palette.primary.main },
                        '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main, // focus:ring-1 focus:ring-[#2a8dd4]
                            outline: 'none', // focus:outline-none
                        },
                    },
                    '& .MuiInputLabel-root': { color: inputLabelColor },
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(1) // gap-2
                }}
            >
                <Tooltip title="Add emoji">
                    <IconButton aria-label="Add emoji"
                        sx={{
                            color: theme.palette.grey[400], // text-gray-400
                            fontSize: '1.5rem', // text-2xl
                            '&:hover': { color: theme.palette.grey[600] }, // hover:text-gray-600
                            transition: 'color 0.2s' // transition
                        }}>
                        <EmojiEmotionsIcon />
                    </IconButton>
                </Tooltip>
                <Button
                    aria-label="Send comment"
                    variant="contained"
                    color="primary"
                    onClick={handleSendComment}
                    disabled={!comment.trim()}
                    sx={{
                        marginLeft: 'auto', // ml-auto
                        backgroundColor: blue[600], // bg-[#2a8dd4]
                        color: 'white',
                        borderRadius: '9999px', // rounded-full
                        padding: '8px', // p-2
                        minWidth: 'unset', // Override default min-width
                        width: '40px',
                        height: '40px',
                        '&.Mui-disabled': { opacity: 0.5 }, // disabled:opacity-50
                        transition: 'opacity 0.2s, background-color 0.2s'
                    }}
                >
                    <SendIcon />
                </Button>
            </Box>
            {/* Activity log entries */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing(2), // gap-4
                    marginTop: theme.spacing(1), // mt-2
                    overflowY: 'auto', // overflow-y-auto
                    paddingRight: theme.spacing(0.5), // pr-2
                    flex: 1 // Takes remaining space
                }}
            >
                {mockActivityLog.map((activity, index) => (
                    <Box key={index}
                        sx={{
                            display: 'flex',
                            gap: theme.spacing(1.5), // gap-3
                            alignItems: 'flex-start' // items-start
                        }}
                    >
                        <Avatar
                            sx={{
                                flexShrink: 0, // flex-shrink-0
                                width: 28, // w-7
                                height: 28, // h-7
                                borderRadius: '9999px', // rounded-full
                                backgroundColor: blue[600], // bg-[#2a8dd4]
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.875rem'
                            }}
                        >
                            {activity.type === 'assigned' ? <SendIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                        </Avatar>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                fontSize: '0.75rem', // text-xs
                                color: secondaryTextColor, // text-gray-600
                            }}
                        >
                            <Typography variant="caption"
                                sx={{
                                    textTransform: 'uppercase', // uppercase
                                    fontWeight: 600, // font-semibold
                                    color: theme.palette.grey[400], // text-gray-400
                                    marginBottom: theme.spacing(0.5) // mb-0.5
                                }}
                            >
                                {activity.time}
                            </Typography>
                            <Typography variant="body2"
                                sx={{
                                    fontWeight: 600, // font-semibold
                                    lineHeight: 'tight', // leading-tight
                                    color: secondaryTextColor
                                }}
                            >
                                {activity.detail}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default TaskDetailActivity;
