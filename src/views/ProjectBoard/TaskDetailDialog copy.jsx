// TaskDetailDialog.jsx (Refactored UI/UX)
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl,
    Typography, Button, IconButton, Chip, Box, DialogContentText,
    Avatar, Tooltip, List, ListItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PushPinIcon from '@mui/icons-material/PushPin';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TuneIcon from '@mui/icons-material/Tune';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { blue } from '@mui/material/colors';
import { users, projects } from './Index';

const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
};

const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
};

const getUserAvatarColor = (userId) => {
    let hash = 0;
    if (userId) {
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }
    }
    return `hsl(${hash % 360}, 70%, 50%)`;
};

const TaskDetailDialog = ({ task, onUpdateTask, onDeleteTask, onClose }) => {
    const theme = useTheme();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingAssignee, setIsEditingAssignee] = useState(false);
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

    const textColor = theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[900];
    const secondaryTextColor = theme.palette.text.secondary;
    const inputBorderColor = theme.palette.divider;
    const inputTextColor = theme.palette.text.primary;
    const sidebarBg = theme.palette.background.default;
    const sidebarBorder = theme.palette.divider;

    const handleSaveTitle = () => {
        handleSubmit((data) => {
            onUpdateTask({ ...task, title: data.title });
            setIsEditingTitle(false);
        })();
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
        setValue('assignedTo', newAssigneeId);
        setIsEditingAssignee(false);
    };

    const handleCompleteTask = () => {
        onUpdateTask({ ...task, status: 'completed' });
    };

    const handleSendComment = () => {
        if (comment.trim()) {
            console.log('Sending comment:', comment);
            setComment('');
        }
    };

    const handleDeleteConfirm = () => {
        onDeleteTask(task.id);
        setConfirmDeleteOpen(false);
        onClose();
    };

    const mockActivityLog = [
        { type: 'assigned', time: 'AN HOUR AGO', detail: `${getUserName('user-1')} → ${getUserName(task.assignedTo)}` },
        { type: 'created', time: '2 HOURS AGO', detail: `${getUserName('user-1')} created the task` },
    ];

    const checklistItems = [];

    return (
        <>
            <Dialog
                open={true}
                onClose={onClose}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        height: '80vh',
                        maxHeight: '800px',
                        display: 'flex',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 10,
                        bgcolor: theme.palette.background.paper
                    }
                }}
            >
                <Box className="flex flex-1 h-full">
                    {/* Main Content Area */}
                    <Box className="flex flex-col flex-1 px-6 py-5 overflow-y-auto">
                        {/* Header: Title & Actions */}
                        <Box className="flex items-start justify-between mb-5">
                            <Box className="flex items-start gap-3">
                                <IconButton onClick={handleCompleteTask} size="small" sx={{ color: theme.palette.success.main }}>
                                    <CheckCircleOutlineIcon />
                                </IconButton>

                                <Box>
                                    {isEditingTitle ? (
                                        <Controller
                                            name="title"
                                            control={control}
                                            rules={{ required: 'Title is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    variant="outlined"
                                                    size="small"
                                                    autoFocus
                                                    onBlur={handleSaveTitle}
                                                    error={!!errors.title}
                                                    helperText={errors.title?.message}
                                                    sx={{ fontWeight: 600, fontSize: '1.1rem', minWidth: '250px' }}
                                                />
                                            )}
                                        />
                                    ) : (
                                        <Typography
                                            variant="h6"
                                            onClick={() => setIsEditingTitle(true)}
                                            sx={{
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                '&:hover': { textDecoration: 'underline' }
                                            }}
                                        >
                                            {watchedTitle || 'Untitled Task'}
                                        </Typography>
                                    )}

                                    {/* Assignee */}
                                    <Box className="flex items-center gap-2 mt-1">
                                        {isEditingAssignee ? (
                                            <FormControl variant="standard" size="small">
                                                <Select
                                                    value={watchedAssignedTo}
                                                    onChange={handleSaveAssignee}
                                                    onBlur={() => setIsEditingAssignee(false)}
                                                    autoFocus
                                                >
                                                    {users.map(user => (
                                                        <MenuItem key={user.id} value={user.id}>
                                                            {user.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <Button
                                                size="small"
                                                startIcon={
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: getUserAvatarColor(watchedAssignedTo),
                                                            width: 24,
                                                            height: 24,
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {getUserName(watchedAssignedTo)[0]}
                                                    </Avatar>
                                                }
                                                sx={{ textTransform: 'none', color: textColor, pl: 0 }}
                                                onClick={() => setIsEditingAssignee(true)}
                                            >
                                                {getUserName(watchedAssignedTo)}
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            {/* Right-side buttons */}
                            <Box className="flex gap-1">
                                <Tooltip title="Pin Task">
                                    <IconButton>
                                        <PushPinIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="More Options">
                                    <IconButton>
                                        <MoreHorizIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Close">
                                    <IconButton onClick={onClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        {/* Description Section */}
                        <Box className="mb-5">
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Description</Typography>
                            {isEditingDescription ? (
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            variant="outlined"
                                            autoFocus
                                            onBlur={handleSaveDescription}
                                        />
                                    )}
                                />
                            ) : (
                                <Typography
                                    variant="body2"
                                    onClick={() => setIsEditingDescription(true)}
                                    sx={{
                                        cursor: 'pointer',
                                        whiteSpace: 'pre-wrap',
                                        '&:hover': { textDecoration: 'underline' },
                                        color: secondaryTextColor
                                    }}
                                >
                                    {watchedDescription || 'Add a description...'}
                                </Typography>
                            )}
                        </Box>

                        {/* Checklist Placeholder */}
                        <Box className="mb-5">
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Checklist</Typography>
                            <List disablePadding>
                                <ListItem disablePadding>
                                    <Button
                                        className="flex items-center gap-2 text-sm font-semibold"
                                        sx={{ color: blue[600], textTransform: 'none' }}
                                        startIcon={<AddIcon />}
                                        onClick={() => console.log('Add checklist item')}
                                    >
                                        Add item
                                    </Button>
                                </ListItem>
                            </List>
                        </Box>

                        {/* Comment & Activity Section */}
                        <Box className="flex flex-col mt-auto">
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Activity</Typography>
                            <TextField
                                placeholder="Click to add a comment"
                                multiline
                                minRows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                fullWidth
                                variant="outlined"
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px'
                                    }
                                }}
                            />
                            <Box className="flex items-center gap-2 mb-4">
                                <Tooltip title="Add emoji">
                                    <IconButton>
                                        <EmojiEmotionsIcon />
                                    </IconButton>
                                </Tooltip>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSendComment}
                                    disabled={!comment.trim()}
                                    sx={{
                                        ml: 'auto',
                                        minWidth: '40px',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '9999px',
                                        p: 1
                                    }}
                                >
                                    <SendIcon fontSize="small" />
                                </Button>
                            </Box>

                            {/* Activity Log */}
                            <Box className="flex flex-col gap-3 overflow-y-auto">
                                {mockActivityLog.map((activity, index) => (
                                    <Box key={index} className="flex gap-3 items-start">
                                        <Avatar
                                            sx={{
                                                bgcolor: blue[600],
                                                width: 28,
                                                height: 28,
                                                fontSize: '0.875rem',
                                                flexShrink: 0
                                            }}
                                        >
                                            {activity.type === 'assigned'
                                                ? <SendIcon fontSize="small" />
                                                : <AddIcon fontSize="small" />}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: secondaryTextColor }}>
                                                {activity.time}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: textColor }}>
                                                {activity.detail}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                    {/* Right Sidebar */}
                    <Box className="w-72 border-l flex flex-col divide-y"
                        sx={{
                            backgroundColor: sidebarBg,
                            borderColor: sidebarBorder,
                            color: secondaryTextColor,
                            '& .MuiButtonBase-root': {
                                justifyContent: 'space-between',
                                textTransform: 'none',
                                py: 1.5,
                                px: 2,
                                borderRadius: 0,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                },
                            }
                        }}
                    >
                        {/* Timer */}
                        <Button onClick={() => console.log('Timer clicked')}>
                            <Box className="flex items-center gap-2">
                                <PlayCircleOutlineIcon sx={{ color: theme.palette.grey[400], fontSize: '1.25rem' }} />
                                <Typography variant="body2">00:00:00</Typography>
                            </Box>
                            <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400] }} />
                        </Button>

                        {/* Due Date Picker */}
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
                                                <Button onClick={params.inputProps.onClick} sx={{ width: '100%', justifyContent: 'space-between' }}>
                                                    <Box className="flex items-center gap-2">
                                                        <CalendarTodayIcon sx={{ color: theme.palette.grey[400], fontSize: '1.25rem' }} />
                                                        <Typography variant="body2">
                                                            {field.value ? dayjs(field.value).format('MMM DD, YYYY') : 'Due date'}
                                                        </Typography>
                                                    </Box>
                                                    <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400] }} />
                                                </Button>
                                            )
                                        }}
                                        slotProps={{
                                            textField: {
                                                sx: { display: 'none' } // hide actual TextField
                                            }
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>

                        {/* Scheduling */}
                        <Button onClick={() => console.log('Scheduling clicked')} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Box className="flex items-center gap-2 mb-1 self-stretch justify-between">
                                <Box className="flex items-center gap-2">
                                    <TuneIcon sx={{ color: theme.palette.grey[400], fontSize: '1.25rem' }} />
                                    <Typography variant="body2">Not scheduled</Typography>
                                </Box>
                                <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400] }} />
                            </Box>
                            <Box className="ml-8 self-start">
                                <Chip
                                    label="BUSINESS"
                                    size="small"
                                    sx={{
                                        bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[800],
                                        color: 'white',
                                        fontSize: '0.5625rem',
                                        fontWeight: 600,
                                        borderRadius: '4px',
                                        px: '8px',
                                        py: '2px'
                                    }}
                                />
                            </Box>
                        </Button>

                        {/* Tags */}
                        <Button onClick={() => console.log('Tags clicked')}>
                            <Box className="flex items-center gap-2">
                                <LocalOfferIcon sx={{ color: theme.palette.grey[400], fontSize: '1.25rem' }} />
                                <Typography variant="body2">Tags</Typography>
                            </Box>
                            <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400] }} />
                        </Button>

                        {/* Watching */}
                        <Button onClick={() => console.log('Watching clicked')} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Box className="flex items-center gap-2 mb-1 self-stretch justify-between">
                                <Box className="flex items-center gap-2">
                                    <VisibilityIcon sx={{ color: theme.palette.grey[400], fontSize: '1.25rem' }} />
                                    <Typography variant="body2">Watching</Typography>
                                </Box>
                                <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400] }} />
                            </Box>
                            <Box className="ml-8 self-start flex">
                                <Avatar
                                    src="https://storage.googleapis.com/a1aa/image/d3071251-afac-4396-941b-37d840095dc7.jpg"
                                    sx={{ width: 24, height: 24 }}
                                />
                            </Box>
                        </Button>

                        {/* Relations */}
                        <Button onClick={() => console.log('Relations clicked')}>
                            <Box className="flex items-center gap-2">
                                <LinkIcon sx={{ color: theme.palette.grey[400], fontSize: '1.25rem' }} />
                                <Typography variant="body2">Relations</Typography>
                            </Box>
                            <KeyboardArrowDownIcon sx={{ color: theme.palette.grey[400] }} />
                        </Button>

                        {/* Footer Info */}
                        <Box className="p-4 text-[9px] leading-tight flex-shrink-0"
                            sx={{ backgroundColor: sidebarBg, color: secondaryTextColor }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, color: theme.palette.grey[600] }}>
                                Complaints
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, mb: 3, color: theme.palette.grey[600] }}>
                                New Tasks
                            </Typography>

                            <Box className="flex items-start gap-2 mb-2">
                                <AddCircleOutlineIcon sx={{ fontSize: '1rem', color: theme.palette.grey[400], mt: '2px' }} />
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>Created</Typography>
                                    <Typography variant="caption">
                                        {dayjs(task.createdAt || Date.now()).format('MMM DD, YYYY')}<br />
                                        {dayjs(task.createdAt || Date.now()).format('hh:mm A')}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box className="flex items-start gap-2 mb-2">
                                <EditOutlinedIcon sx={{ fontSize: '1rem', color: theme.palette.grey[400], mt: '2px' }} />
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>Updated</Typography>
                                    <Typography variant="caption">
                                        {dayjs(task.updatedAt || Date.now()).format('MMM DD, YYYY')}<br />
                                        {dayjs(task.updatedAt || Date.now()).format('hh:mm A')}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box className="flex items-start gap-2">
                                <EditOutlinedIcon sx={{ fontSize: '1rem', color: theme.palette.grey[400], mt: '2px' }} />
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>Task ID</Typography>
                                    <Typography variant="caption">{task.id}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                PaperProps={{ className: "rounded-xl dark:bg-gray-800 dark:text-white" }}
            >
                <DialogTitle sx={{ color: textColor }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: secondaryTextColor }}>
                        Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={() => setConfirmDeleteOpen(false)} color="inherit" sx={{ color: inputTextColor }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TaskDetailDialog;
