// ProjectBoard/TaskDetailDialog.jsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel,
    Typography, Button, IconButton, Chip, Divider, Box, DialogContentText,
    Avatar, Tooltip,
    List, ListItem // List and ListItem are used in the Checklist section
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Material-UI Icons (mapping from Font Awesome in your HTML)
import CloseIcon from '@mui/icons-material/Close'; // fas fa-times
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // fas fa-check (for complete task)
import PushPinIcon from '@mui/icons-material/PushPin'; // fas fa-thumbtack
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'; // fas fa-ellipsis-h
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // fas fa-caret-down
import AddIcon from '@mui/icons-material/Add'; // fas fa-plus
import SendIcon from '@mui/icons-material/Send'; // fas fa-arrow-right (for send comment)
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'; // far fa-smile
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'; // fas fa-play-circle (timer)
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // far fa-calendar-alt (due date)
import TuneIcon from '@mui/icons-material/Tune'; // fas fa-sliders-h (scheduling)
import LocalOfferIcon from '@mui/icons-material/LocalOffer'; // fas fa-tags
import VisibilityIcon from '@mui/icons-material/Visibility'; // fas fa-eye (watching)
import LinkIcon from '@mui/icons-material/Link'; // fas fa-link (relations)
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // fas fa-plus-circle (created)
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'; // fas fa-pencil-alt (updated)

// Import color palette
import { blue, grey, green, red } from '@mui/material/colors';


// Import data from the main index file
import { users, projects } from './Index';

// Helper function to get user name by ID
const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
};

// Helper function to get project name by ID
const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
};

// Helper function to get user avatar background color
const getUserAvatarColor = (userId) => {
    // Simple hashing for consistent colors
    let hash = 0;
    if (userId) {
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
};

const TaskDetailDialog = ({ task, onUpdateTask, onDeleteTask, onClose }) => {
    const theme = useTheme();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingAssignee, setIsEditingAssignee] = useState(false); // For in-place assignee edit
    const [comment, setComment] = useState('');
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo,
            projectId: task.projectId,
            status: task.status,
            dueDate: task.dueDate,
        }
    });

    const watchedAssignedTo = watch('assignedTo');
    const watchedTitle = watch('title');
    const watchedDescription = watch('description');


    useEffect(() => {
        // Reset form when task prop changes (e.g., if a different task is selected)
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                assignedTo: task.assignedTo,
                projectId: task.projectId,
                status: task.status,
                dueDate: task.dueDate,
            });
        }
        setIsEditingTitle(false);
        setIsEditingDescription(false);
        setIsEditingAssignee(false);
        setComment('');
    }, [task, reset]);

    // Dynamic colors for dark mode
    const textColor = theme.palette.mode === 'dark' ? grey[100] : grey[800];
    const secondaryTextColor = theme.palette.mode === 'dark' ? grey[400] : theme.palette.text.secondary;
    const inputLabelColor = theme.palette.mode === 'dark' ? grey[400] : theme.palette.text.secondary;
    const inputBorderColor = theme.palette.mode === 'dark' ? grey[600] : grey[400];
    const inputTextColor = theme.palette.mode === 'dark' ? grey[100] : theme.palette.text.primary;
    const sidebarBg = theme.palette.mode === 'dark' ? grey[900] : '#f7f8fa'; // Original HTML color
    const sidebarBorder = theme.palette.mode === 'dark' ? grey[700] : grey[200];

    const chipStatusColors = {
        'todo': theme.palette.mode === 'dark' ? grey[700] : grey[200],
        'in-progress': theme.palette.mode === 'dark' ? blue[700] : blue[200],
        'completed': theme.palette.mode === 'dark' ? green[700] : green[200],
    };
    const chipStatusTextColors = {
        'todo': theme.palette.mode === 'dark' ? grey[200] : grey[800],
        'in-progress': theme.palette.mode === 'dark' ? blue[100] : blue[800],
        'completed': theme.palette.mode === 'dark' ? green[100] : green[800],
    };


    const handleSaveTitle = () => {
        handleSubmit((data) => {
            onUpdateTask({ ...task, title: data.title });
            setIsEditingTitle(false);
        })(); // Call handleSubmit immediately
    };

    const handleSaveDescription = () => {
        handleSubmit((data) => {
            onUpdateTask({ ...task, description: data.description });
            setIsEditingDescription(false);
        })();
    };

    const handleSaveAssignee = (event) => {
        const newAssigneeId = event.target.value;
        onUpdateTask({ ...task, assignedTo: newAssigneeId });
        setValue('assignedTo', newAssigneeId); // Update react-hook-form state
        setIsEditingAssignee(false);
    };

    const handleCompleteTask = () => {
        onUpdateTask({ ...task, status: 'completed' });
    };

    const handleSendComment = () => {
        if (comment.trim()) {
            console.log('Sending comment:', comment);
            // In a real app, you'd send this to a backend
            setComment('');
        }
    };

    const handleDeleteConfirm = () => {
        onDeleteTask(task.id);
        setConfirmDeleteOpen(false);
        onClose(); // Close the dialog after deletion
    };

    // Mock activity log for demonstration
    const mockActivityLog = [
        { type: 'assigned', time: 'AN HOUR AGO', detail: `${getUserName('user-1')} → ${getUserName(task.assignedTo)}` },
        { type: 'assigned', time: 'AN HOUR AGO', detail: `${getUserName('user-1')} → Mostwanted` },
        { type: 'created', time: 'AN HOUR AGO', detail: `${getUserName('user-1')} created the task` },
    ];

    // Placeholder for checklist items (future feature)
    const checklistItems = [
        // { id: 'item1', text: 'Subtask 1', completed: false },
    ];

    return (
        <>
            <Dialog
                open={true}
                onClose={onClose}
                maxWidth="lg" // Larger dialog to fit content
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: 24, // Equivalent to shadow-2xl
                        backgroundColor: theme.palette.mode === 'dark' ? grey[800] : theme.palette.background.paper,
                        color: textColor,
                        overflow: 'hidden', // Ensures inner content respects rounded corners
                        height: '80vh',
                        maxHeight: '800px',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' } // Responsive flex: column on small, row on medium+
                    }
                }}
            >
                {/* Left main content */}
                <Box
                    sx={{
                        flex: 1,
                        padding: theme.spacing(3), // p-6
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: theme.palette.background.paper,
                        color: textColor
                    }}
                >
                    {/* Top bar */}
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
                            onClick={handleCompleteTask}
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
                            disabled={task.status === 'completed'} // Disable if already completed
                        >
                            {task.status === 'completed' ? 'Task Completed' : 'Complete Task'}
                        </Button>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: theme.spacing(1.5), // gap-3
                                color: secondaryTextColor, // text-gray-600 (dynamic)
                                fontSize: '0.875rem', // text-sm
                                fontWeight: 500, // font-medium
                                userSelect: 'none' // select-none
                            }}
                        >
                            <Avatar sx={{ bgcolor: getUserAvatarColor(watchedAssignedTo), width: 28, height: 28, fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>
                                {getUserName(watchedAssignedTo).charAt(0).toUpperCase()}
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
                                        backgroundColor: theme.palette.action.hover, // hover:bg-gray-100 (dynamic)
                                    },
                                    transition: 'background-color 0.2s' // transition
                                }}
                            >
                                <Typography variant="caption" sx={{ color: theme.palette.grey[400], fontSize: '0.75rem' }}>
                                    Assigned to
                                </Typography>
                                {isEditingAssignee ? (
                                    <FormControl variant="standard" size="small" sx={{ minWidth: 150 }}>
                                        <Controller
                                            name="assignedTo"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    onChange={handleSaveAssignee}
                                                    value={watchedAssignedTo || ""}
                                                    sx={{
                                                        color: inputTextColor,
                                                        '& .MuiSelect-select': { paddingRight: '24px !important' },
                                                        '& .MuiSelect-icon': { color: inputLabelColor },
                                                        '&:before': { borderBottomColor: inputBorderColor }, // Standard variant uses borderBottom
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
                                            )}
                                        />
                                    </FormControl>
                                ) : (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            lineHeight: 'normal', // leading-none
                                            color: textColor
                                        }}
                                    >
                                        {getUserName(watchedAssignedTo)}
                                    </Typography>
                                )}
                                {!isEditingAssignee && <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400], fontSize: '0.75rem' }} />} {/* text-xs */}
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: theme.spacing(2), // gap-4
                                color: theme.palette.grey[400],
                                fontSize: '1.125rem', // text-lg
                                cursor: 'pointer'
                            }}
                        >
                            <Tooltip title="Pin Task">
                                <IconButton sx={{ color: theme.palette.grey[400], '&:hover': { color: theme.palette.grey[600] }, transition: 'color 0.2s' }}>
                                    <PushPinIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="More Options">
                                <IconButton sx={{ color: theme.palette.grey[400], '&:hover': { color: theme.palette.grey[600] }, transition: 'color 0.2s' }}>
                                    <MoreHorizIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Close">
                                <IconButton aria-label="Close" onClick={onClose}
                                    sx={{ color: theme.palette.grey[400], '&:hover': { color: theme.palette.grey[600] }, transition: 'color 0.2s' }}>
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Task title and description */}
                    <Box sx={{ marginBottom: theme.spacing(3) }}> {/* mb-6 */}
                        {isEditingTitle ? (
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: 'Title cannot be empty' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleSaveTitle}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTitle(); }}
                                        autoFocus
                                        error={!!errors.title}
                                        helperText={errors.title ? errors.title.message : ''}
                                        sx={{
                                            '& .MuiInputBase-input': { fontSize: '1.25rem', fontWeight: 600, color: inputTextColor }, // text-lg font-semibold
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: inputBorderColor },
                                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
                                            }
                                        }}
                                    />
                                )}
                            />
                        ) : (
                            <Typography
                                variant="h5" // Matches text-lg
                                onClick={() => setIsEditingTitle(true)}
                                sx={{
                                    fontWeight: 600, // font-semibold
                                    color: textColor, // text-gray-800
                                    marginBottom: theme.spacing(0.5), // mb-1
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                {watchedTitle || 'Click to add a title'}
                            </Typography>
                        )}
                        {isEditingDescription ? (
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        rows={2}
                                        variant="outlined"
                                        onBlur={handleSaveDescription}
                                        autoFocus
                                        sx={{
                                            marginTop: theme.spacing(1), // mt-1
                                            '& .MuiInputBase-input': { fontSize: '0.875rem', color: inputTextColor }, // text-xs, though 0.875rem is text-sm
                                            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: inputBorderColor } }
                                        }}
                                    />
                                )}
                            />
                        ) : (
                            <Typography
                                variant="body2" // Matches text-xs
                                onClick={() => setIsEditingDescription(true)}
                                sx={{
                                    color: secondaryTextColor, // text-gray-400
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                {watchedDescription || 'Click to add a description'}
                            </Typography>
                        )}
                    </Box>

                    {/* Checklist */}
                    <Box sx={{ marginBottom: theme.spacing(3) }}> {/* mb-6 */}
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
                            onClick={() => console.log('Toggle Checklist')} // Placeholder for toggle
                        >
                            Checklist
                            <Chip
                                label={`${checklistItems.filter(item => item.completed).length}/${checklistItems.length}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                    marginLeft: 'auto', // ml-auto
                                    fontSize: '0.625rem', // text-xs
                                    fontWeight: 600, // font-semibold
                                    borderRadius: '9999px', // rounded-full
                                    paddingX: '8px', // px-2
                                    paddingY: '2px', // py-0.5
                                    borderColor: theme.palette.mode === 'dark' ? grey[600] : grey[300], // border-gray-300
                                    color: secondaryTextColor, // text-gray-400
                                }}
                            />
                        </Button>
                        <List dense sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(1.5), paddingLeft: theme.spacing(2) }}> {/* flex flex-col gap-3 pl-4 */}
                            {checklistItems.map((item, idx) => (
                                <ListItem key={idx} disablePadding>
                                    <Typography sx={{ color: textColor }}>{item.text}</Typography>
                                </ListItem>
                            ))}
                            <ListItem disablePadding>
                                <Button
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: theme.spacing(1), // gap-2
                                        color: blue[600], // text-[#2a8dd4]
                                        fontSize: '0.875rem', // text-sm
                                        fontWeight: 600, // font-semibold
                                        textTransform: 'none',
                                        padding: 0,
                                        '&:hover': { backgroundColor: 'transparent' }
                                    }}
                                    startIcon={<AddIcon />}
                                    onClick={() => console.log('Add checklist item clicked')}
                                >
                                    Add checklist item
                                </Button>
                            </ListItem>
                            <ListItem sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }} disablePadding>
                                <Button
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: theme.spacing(1), // gap-2
                                        color: blue[600], // text-[#2a8dd4]
                                        fontSize: '0.875rem', // text-sm
                                        fontWeight: 600, // font-semibold
                                        textTransform: 'none',
                                        padding: 0,
                                        '&:hover': { backgroundColor: 'transparent' }
                                    }}
                                    startIcon={<AddIcon />}
                                    onClick={() => console.log('Add subtask clicked')}
                                >
                                    Add subtask
                                </Button>
                                <Chip
                                    label="BUSINESS"
                                    size="small"
                                    sx={{
                                        marginLeft: theme.spacing(1), // ml-2
                                        backgroundColor: theme.palette.mode === 'dark' ? grey[700] : grey[800], // bg-gray-800
                                        color: 'white',
                                        fontSize: '0.5625rem', // text-[9px]
                                        fontWeight: 600, // font-semibold
                                        borderRadius: '4px', // rounded
                                        paddingX: '8px', // px-2
                                        paddingY: '2px', // py-[2px]
                                    }}
                                />
                            </ListItem>
                            <ListItem disablePadding>
                                <Button
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: theme.spacing(1), // gap-2
                                        color: blue[600], // text-[#2a8dd4]
                                        fontSize: '0.875rem', // text-sm
                                        fontWeight: 600, // font-semibold
                                        textTransform: 'none',
                                        padding: 0,
                                        '&:hover': { backgroundColor: 'transparent' }
                                    }}
                                    startIcon={<AddIcon />}
                                    onClick={() => console.log('Add attachment clicked')}
                                >
                                    Add attachment
                                </Button>
                            </ListItem>
                        </List>
                    </Box>

                    {/* Activity */}
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
                                padding: 0,
                                '&:hover': { backgroundColor: 'transparent' }
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
                </Box>

                {/* Right sidebar */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '288px' }, // w-72 (288px) on md+, full width on xs
                        backgroundColor: sidebarBg, // bg-[#f7f8fa]
                        borderLeft: { xs: 'none', md: `1px solid ${sidebarBorder}` }, // border-l border-gray-200
                        borderTop: { xs: `1px solid ${sidebarBorder}`, md: 'none' }, // Added borderTop for mobile
                        display: 'flex',
                        flexDirection: 'column',
                        borderBottom: { xs: `1px solid ${sidebarBorder}`, md: 'none' }, // Added borderBottom for mobile
                        '& > .MuiButtonBase-root': { // Targeting direct Button children for general sidebar item styling
                            justifyContent: 'space-between',
                            textTransform: 'none',
                            paddingX: theme.spacing(2), // px-4
                            paddingY: theme.spacing(1.5), // py-3
                            borderBottom: `1px solid ${sidebarBorder}`, // Ensure separator
                            borderRadius: 0,
                            color: secondaryTextColor,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover, // hover:bg-gray-100
                            },
                        },
                        // Specific style for the last button to remove its bottom border if needed, or rely on Box divide-y
                        '& > .MuiButtonBase-root:last-of-type': {
                            borderBottom: 'none',
                        }
                    }}
                >
                    {/* Timer */}
                    <Button
                        onClick={() => console.log('Timer clicked')}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}> {/* gap-2 */}
                            <PlayCircleOutlineIcon sx={{ color: theme.palette.grey[400], fontSize: '1.25rem' }} /> {/* text-lg */}
                            <Typography variant="body2">00:00:00</Typography>
                        </Box>
                        <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400] }} />
                    </Button>
                    {/* Due date */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="dueDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    label="Due date"
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(date) => {
                                        field.onChange(date ? date.format('YYYY-MM-DD') : '');
                                        onUpdateTask({ ...task, dueDate: date ? date.format('YYYY-MM-DD') : '' });
                                    }}
                                    enableAccessibleFieldDOMStructure={false}
                                    slots={{
                                        textField: (params) => (
                                            <Button
                                                onClick={params.inputProps.onClick}
                                                sx={{
                                                    width: '100%',
                                                    justifyContent: 'space-between',
                                                    paddingX: theme.spacing(2),
                                                    paddingY: theme.spacing(1.5),
                                                    borderBottom: `1px solid ${sidebarBorder}`, // Match other buttons
                                                    borderRadius: 0,
                                                    textTransform: 'none',
                                                    color: secondaryTextColor,
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.action.hover,
                                                    }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                                                    <CalendarTodayIcon sx={{ color: theme.palette.grey[400], fontSize: '1.25rem' }} />
                                                    <Typography variant="body2" sx={{ color: inputTextColor }}>
                                                        {field.value ? dayjs(field.value).format('MMM DD, YYYY') : 'Due date'}
                                                    </Typography>
                                                </Box>
                                                <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400] }} />
                                            </Button>
                                        )
                                    }}
                                    slotProps={{
                                        textField: {
                                            variant: 'outlined', // Standard variant, though hidden
                                            size: 'small',
                                            fullWidth: true,
                                            sx: { display: 'none' } // Hide the actual TextField as we use a custom button for input
                                        }
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>

                    {/* Scheduling */}
                    <Button
                        onClick={() => console.log('Scheduling clicked')}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            paddingX: theme.spacing(2),
                            paddingY: theme.spacing(1.5),
                            borderBottom: `1px solid ${sidebarBorder}`, // Match other buttons
                            borderRadius: 0,
                            textTransform: 'none',
                            color: secondaryTextColor,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1), marginBottom: theme.spacing(0.5), width: '100%', justifyContent: 'space-between' }}> {/* mb-1 */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                                <TuneIcon sx={{ color: theme.palette.grey[400], fontSize: '1.25rem' }} />
                                <Typography variant="body2">Not scheduled</Typography>
                            </Box>
                            <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400] }} />
                        </Box>
                        <Box sx={{ marginLeft: theme.spacing(4) }}> {/* ml-8 */}
                            <Chip
                                label="BUSINESS"
                                size="small"
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' ? grey[700] : grey[800],
                                    color: 'white',
                                    fontSize: '0.5625rem', // text-[9px]
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    paddingX: '8px',
                                    paddingY: '2px'
                                }}
                            />
                        </Box>
                    </Button>
                    {/* Tags */}
                    <Button
                        onClick={() => console.log('Tags clicked')}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingX: theme.spacing(2),
                            paddingY: theme.spacing(1.5),
                            borderBottom: `1px solid ${sidebarBorder}`, // Match other buttons
                            borderRadius: 0,
                            textTransform: 'none',
                            color: secondaryTextColor,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                            <LocalOfferIcon sx={{ color: theme.palette.grey[400], fontSize: '1.25rem' }} />
                            <Typography variant="body2">Tags</Typography>
                        </Box>
                        <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400] }} />
                    </Button>
                    {/* Watching */}
                    <Button
                        onClick={() => console.log('Watching clicked')}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            paddingX: theme.spacing(2),
                            paddingY: theme.spacing(1.5),
                            borderBottom: `1px solid ${sidebarBorder}`, // Match other buttons
                            borderRadius: 0,
                            textTransform: 'none',
                            color: secondaryTextColor,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1), marginBottom: theme.spacing(0.5), width: '100%', justifyContent: 'space-between' }}> {/* mb-1 */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                                <VisibilityIcon sx={{ color: theme.palette.grey[400], fontSize: '1.25rem' }} />
                                <Typography variant="body2">Watching</Typography>
                            </Box>
                            <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400] }} />
                        </Box>
                        <Box sx={{ marginLeft: theme.spacing(4), display: 'flex' }}> {/* ml-8 flex */}
                            <Avatar src="https://storage.googleapis.com/a1aa/image/d3071251-afac-4396-941b-37d840095dc7.jpg" sx={{ width: 24, height: 24, borderRadius: '50%' }} />
                        </Box>
                    </Button>
                    {/* Relations */}
                    <Button
                        onClick={() => console.log('Relations clicked')}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingX: theme.spacing(2),
                            paddingY: theme.spacing(1.5),
                            borderBottom: `1px solid ${sidebarBorder}`, // Match other buttons
                            borderRadius: 0,
                            textTransform: 'none',
                            color: secondaryTextColor,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                            <LinkIcon sx={{ color: theme.palette.grey[400], fontSize: '1.25rem' }} />
                            <Typography variant="body2">Relations</Typography>
                        </Box>
                        <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400] }} />
                    </Button>
                    {/* Complaints New Tasks info */}
                    <Box
                        sx={{
                            padding: theme.spacing(2), // px-4 py-3
                            fontSize: '0.5625rem', // text-[9px] - Base for this section
                            lineHeight: '1.2', // leading-tight
                            flexShrink: 0, // Prevents shrinking
                            backgroundColor: sidebarBg,
                            color: secondaryTextColor,
                            borderColor: sidebarBorder,
                        }}
                    >
                        <Typography variant="caption" sx={{
                            display: 'block', // To make it behave like a block-level element for mb-1
                            marginBottom: theme.spacing(0.5), // mb-1
                            fontWeight: 600, // font-semibold
                            color: theme.palette.mode === 'dark' ? grey[300] : grey[600],
                            fontSize: '0.75rem' // text-xs, slightly larger for better readability
                        }}>
                            Complaints
                        </Typography>
                        <Typography variant="caption" sx={{
                            display: 'block', // To make it behave like a block-level element for mb-3
                            marginBottom: theme.spacing(1.5), // mb-3
                            fontWeight: 600, // font-semibold
                            color: theme.palette.mode === 'dark' ? grey[300] : grey[600],
                            fontSize: '0.75rem' // text-xs
                        }}>
                            New Tasks
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing(1), marginBottom: theme.spacing(1) }}> {/* flex items-start gap-2 mb-2 */}
                            <AddCircleOutlineIcon sx={{ color: theme.palette.grey[400], fontSize: '1rem', marginTop: '2px' }} />
                            <Box>
                                <Typography variant="caption" sx={{
                                    display: 'block',
                                    fontWeight: 600, // font-semibold
                                    color: theme.palette.mode === 'dark' ? grey[200] : grey[700],
                                    fontSize: '0.75rem' // text-xs
                                }}>
                                    Created
                                </Typography>
                                <Typography variant="caption" sx={{ color: secondaryTextColor, fontSize: '0.625rem' }}>
                                    {dayjs(task.createdAt || Date.now()).format('MMM DD, YYYY')}<br />
                                    {dayjs(task.createdAt || Date.now()).format('hh:mm A')}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing(1), marginBottom: theme.spacing(1) }}> {/* flex items-start gap-2 mb-2 */}
                            <EditOutlinedIcon sx={{ color: theme.palette.grey[400], fontSize: '1rem', marginTop: '2px' }} />
                            <Box>
                                <Typography variant="caption" sx={{
                                    display: 'block',
                                    fontWeight: 600, // font-semibold
                                    color: theme.palette.mode === 'dark' ? grey[200] : grey[700],
                                    fontSize: '0.75rem' // text-xs
                                }}>
                                    Updated
                                </Typography>
                                <Typography variant="caption" sx={{ color: secondaryTextColor, fontSize: '0.625rem' }}>
                                    {dayjs(task.updatedAt || Date.now()).format('MMM DD, YYYY')}<br />
                                    {dayjs(task.updatedAt || Date.now()).format('hh:mm A')}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing(1) }}> {/* flex items-start gap-2 */}
                            <EditOutlinedIcon sx={{ color: theme.palette.grey[400], fontSize: '1rem', marginTop: '2px' }} />
                            <Box>
                                <Typography variant="caption" sx={{
                                    display: 'block',
                                    fontWeight: 600, // font-semibold
                                    color: theme.palette.mode === 'dark' ? grey[200] : grey[700],
                                    fontSize: '0.75rem' // text-xs
                                }}>
                                    Task ID
                                </Typography>
                                <Typography variant="caption" sx={{ color: secondaryTextColor, fontSize: '0.625rem' }}>
                                    {task.id}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        backgroundColor: theme.palette.mode === 'dark' ? grey[800] : theme.palette.background.paper,
                        color: textColor
                    }
                }}
            >
                <DialogTitle sx={{ color: textColor }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: secondaryTextColor }}>
                        Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: theme.spacing(2) }}>
                    <Button onClick={() => setConfirmDeleteOpen(false)} color="inherit" sx={{ color: inputTextColor }}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TaskDetailDialog;
