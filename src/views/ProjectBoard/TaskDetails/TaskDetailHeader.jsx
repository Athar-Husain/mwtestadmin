// ProjectBoard/TaskDetailHeader.jsx
import React from 'react';
import {
    Box, Button, IconButton, Typography, Avatar, Tooltip, FormControl, Select, MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';

// Material-UI Icons
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PushPinIcon from '@mui/icons-material/PushPin';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Dummy users data (should ideally come from props or a global context)
import { users } from '../Index';

const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
};

const getUserAvatarColor = (userId) => {
    let hash = 0;
    if (userId) {
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
};


const TaskDetailHeader = ({ task, onCompleteTask, onUpdateAssignee, onClose, isEditingAssignee, setIsEditingAssignee }) => {
    const theme = useTheme();

    const textColor = theme.palette.mode === 'dark' ? grey[100] : grey[800];
    const secondaryTextColor = theme.palette.mode === 'dark' ? grey[400] : theme.palette.text.secondary;
    const inputLabelColor = theme.palette.mode === 'dark' ? grey[400] : theme.palette.text.secondary;
    const inputBorderColor = theme.palette.mode === 'dark' ? grey[600] : grey[400];
    const inputTextColor = theme.palette.mode === 'dark' ? grey[100] : theme.palette.text.primary;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: theme.spacing(2) // mb-4
            }}
        >
            <Button
                variant="outlined"
                startIcon={<CheckCircleOutlineIcon />}
                onClick={onCompleteTask}
                sx={{
                    borderColor: blue[600],
                    color: blue[600],
                    '&:hover': {
                        backgroundColor: blue[50], // hover:bg-[#eaf6ff]
                        borderColor: blue[700],
                        color: blue[700]
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem', // text-sm
                    borderRadius: '6px', // rounded-md
                    padding: '6px 12px', // px-3 py-1.5
                    transition: 'all 0.2s' // transition
                }}
                disabled={task.status === 'completed'}
            >
                {task.status === 'completed' ? 'Task Completed' : 'Complete Task'}
            </Button>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(1.5), // gap-3
                    color: secondaryTextColor,
                    fontSize: '0.875rem', // text-sm
                    fontWeight: 500, // font-medium
                    userSelect: 'none'
                }}
            >
                <Avatar sx={{ bgcolor: getUserAvatarColor(task.assignedTo), width: 28, height: 28, fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>
                    {getUserName(task.assignedTo).charAt(0).toUpperCase()}
                </Avatar>
                <Box
                    onClick={() => setIsEditingAssignee(true)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing(0.5), // gap-1
                        cursor: 'pointer',
                        padding: theme.spacing(0.5), // p-1
                        borderRadius: '4px', // rounded-md
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                        },
                        transition: 'background-color 0.2s'
                    }}
                >
                    <Typography variant="caption" sx={{ color: grey[400], fontSize: '0.75rem' }}>
                        Assigned to
                    </Typography>
                    {isEditingAssignee ? (
                        <FormControl variant="standard" size="small" sx={{ minWidth: 150 }}>
                            <Select
                                value={task.assignedTo || ""}
                                onChange={(e) => {
                                    onUpdateAssignee(e.target.value);
                                    setIsEditingAssignee(false);
                                }}
                                sx={{
                                    color: inputTextColor,
                                    '& .MuiSelect-select': { paddingRight: '24px !important' },
                                    '& .MuiSelect-icon': { color: inputLabelColor },
                                    '&:before': { borderBottomColor: inputBorderColor },
                                    '&:after': { borderBottomColor: theme.palette.primary.main },
                                }}
                            >
                                <MenuItem value="" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? grey[700] : theme.palette.background.paper }}>
                                    <em>None</em>
                                </MenuItem>
                                {users.map(user => (
                                    <MenuItem key={user.id} value={user.id} sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? grey[700] : theme.palette.background.paper }}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <Typography
                            variant="body2"
                            sx={{
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                lineHeight: 'normal',
                                color: textColor
                            }}
                        >
                            {getUserName(task.assignedTo)}
                        </Typography>
                    )}
                    {!isEditingAssignee && <KeyboardArrowDownIcon sx={{ color: grey[400], fontSize: '0.75rem' }} />}
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(2), // gap-4
                    color: grey[400],
                    fontSize: '1.125rem', // text-lg
                    cursor: 'pointer'
                }}
            >
                <Tooltip title="Pin Task">
                    <IconButton sx={{ color: grey[400], '&:hover': { color: grey[600] }, transition: 'color 0.2s' }}>
                        <PushPinIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="More Options">
                    <IconButton sx={{ color: grey[400], '&:hover': { color: grey[600] }, transition: 'color 0.2s' }}>
                        <MoreHorizIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Close">
                    <IconButton aria-label="Close" onClick={onClose}
                        sx={{ color: grey[400], '&:hover': { color: grey[600] }, transition: 'color 0.2s' }}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default TaskDetailHeader;
