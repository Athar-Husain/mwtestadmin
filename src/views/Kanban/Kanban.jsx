// src/pages/KanbanBoard.jsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Container,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    IconButton,
    DialogContentText,
    AppBar,
    Toolbar,
    Menu,
    Divider,
    Badge,
    Tooltip
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // Use useTheme hook to access the global theme
import { green, blue, grey, purple, red } from '@mui/material/colors';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Date Picker Imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Icons for actions
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    CheckCircle as CheckCircleIcon,
    People as UsersIcon,
    ViewModule as BoardIcon,
    Help as QuestionMarkIcon,
    ArrowDropDown as ArrowDropDownIcon,
    TimerOutlined as TimerIcon // Replaced StopwatchIcon
} from '@mui/icons-material';


// --- Dummy Data Embedded Directly ---
export const users = [
    { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 'user-2', name: 'Bob Williams', email: 'bob@example.com' },
    { id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 'user-4', name: 'Diana Prince', email: 'diana@example.com' },
];

export const projects = [
    { id: 'project-1', name: 'Website Redesign', description: 'Revamp the company website with a modern look and feel.' },
    { id: 'project-2', name: 'Mobile App Development', description: 'Build a new mobile application for iOS and Android.' },
    { id: 'project-3', name: 'Marketing Campaign', description: 'Plan and execute a new digital marketing campaign.' },
];

export const initialTasks = [
    {
        id: 'task-101',
        projectId: 'project-1',
        title: 'Design Homepage Mockup',
        description: 'Create initial design mockups for the website homepage.',
        status: 'todo',
        assignedTo: 'user-1',
        dueDate: '2025-07-10',
    },
    {
        id: 'task-102',
        projectId: 'project-1',
        title: 'Develop Header Component',
        description: 'Implement the responsive header component using React.',
        status: 'in-progress',
        assignedTo: 'user-2',
        dueDate: '2025-07-15',
    },
    {
        id: 'task-103',
        projectId: 'project-1',
        title: 'Write About Us Content',
        description: 'Draft compelling content for the About Us page.',
        status: 'completed',
        assignedTo: 'user-3',
        dueDate: '2025-07-01',
    },
    {
        id: 'task-104',
        projectId: 'project-1',
        title: 'Setup Database Schema',
        description: 'Define and implement the database schema for user data.',
        status: 'in-progress',
        assignedTo: 'user-1',
        dueDate: '2025-07-20',
    },
    {
        id: 'task-105',
        projectId: 'project-1',
        title: 'Deploy Staging Environment',
        description: 'Set up the AWS EC2 instance for staging deployment.',
        status: 'todo',
        assignedTo: 'user-4',
        dueDate: '2025-07-25',
    },
    {
        id: 'task-201',
        projectId: 'project-2',
        title: 'Define User Stories',
        description: 'Gather requirements and define key user stories for the app.',
        status: 'completed',
        assignedTo: 'user-1',
        dueDate: '2025-06-28',
    },
    {
        id: 'task-202',
        projectId: 'project-2',
        title: 'Design Login Screen',
        description: 'Create UI/UX designs for the mobile app login and signup.',
        status: 'in-progress',
        assignedTo: 'user-3',
        dueDate: '2025-07-18',
    },
    {
        id: 'task-203',
        projectId: 'project-2',
        title: 'Implement Authentication',
        description: 'Develop backend authentication using Firebase Auth.',
        status: 'todo',
        assignedTo: 'user-2',
        dueDate: '2025-07-22',
    },
    {
        id: 'task-301',
        projectId: 'project-3',
        title: 'Market Research',
        description: 'Conduct research on target audience and competitor strategies.',
        status: 'in-progress',
        assignedTo: 'user-4',
        dueDate: '2025-07-12',
    },
    {
        id: 'task-302',
        projectId: 'project-3',
        title: 'Create Ad Copy',
        description: 'Write engaging ad copy for social media and search ads.',
        status: 'todo',
        assignedTo: 'user-3',
        dueDate: '2025-07-19',
    },
];
// --- End of Dummy Data ---

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

// Task Card Component
const TaskCard = ({ task, index, isBlurred = false, onClick }) => {
    const theme = useTheme(); // Access theme for consistent colors
    const statusColors = {
        'todo': theme.palette.mode === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800',
        'in-progress': theme.palette.mode === 'dark' ? 'bg-blue-700 text-blue-100' : 'bg-blue-200 text-blue-800',
        'completed': theme.palette.mode === 'dark' ? 'bg-green-700 text-green-100' : 'bg-green-200 text-green-800',
    };
    const chipOutlineColor = theme.palette.mode === 'dark' ? 'border-gray-500' : 'border-gray-300'; // For outlined chips

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(task)} // Make card clickable
                    className={`mt-4 mb-4 shadow-md transition-all duration-300 cursor-pointer rounded-xl 
                                ${snapshot.isDragging ? 'bg-blue-100 dark:bg-blue-900 shadow-lg' : 'bg-white dark:bg-gray-700'} 
                                ${isBlurred ? 'filter blur-sm opacity-50' : 'hover:shadow-lg hover:scale-[1.01]'}`}
                    style={{
                        ...provided.draggableProps.style,
                        filter: isBlurred ? 'blur(2px)' : 'none',
                        opacity: isBlurred ? 0.6 : 1,
                    }}
                    sx={{
                        // Dark mode specific styles for the card
                        backgroundColor: theme.palette.mode === 'dark' && !snapshot.isDragging ? theme.palette.grey[800] : null,
                        color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : null,
                        '& .MuiTypography-root': {
                            color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[800],
                        },
                        '& .MuiTypography-body2': {
                            color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.text.secondary,
                        }
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" component="div" className="font-semibold mb-1">
                            {task.title}
                        </Typography>
                        <Typography variant="body2" className="mb-2 line-clamp-2"> {/* line-clamp for description */}
                            {task.description}
                        </Typography>
                        <div className="flex flex-wrap items-center gap-2 mt-3"> {/* Added more top margin */}
                            <Chip
                                label={task.status.replace('-', ' ').toUpperCase()}
                                size="small"
                                className={`capitalize ${statusColors[task.status]}`}
                            />
                            <Chip
                                label={`Assigned to: ${getUserName(task.assignedTo)}`}
                                size="small"
                                variant="outlined"
                                color="primary"
                                className={chipOutlineColor} // Apply dark mode border
                            />
                            <Chip
                                label={`Project: ${getProjectName(task.projectId)}`}
                                size="small"
                                variant="outlined"
                                color="secondary"
                                className={chipOutlineColor} // Apply dark mode border
                            />
                            {task.dueDate && (
                                <Chip
                                    label={`Due: ${task.dueDate}`}
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    className={`bg-red-50 text-red-600 ${theme.palette.mode === 'dark' ? 'dark:bg-red-900 dark:text-red-200' : ''}`}
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </Draggable>
    );
};

// Status-based Board Component
const StatusBoard = ({ tasks, projects, users, onDragEnd, selectedUserId, onTaskClick }) => {
    const theme = useTheme();
    const statuses = ['todo', 'in-progress', 'completed'];

    return (
        <Box className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen dark:bg-gray-900"> {/* More responsive padding */}
            <Typography variant="h4" className="font-bold mb-6 text-center text-gray-800 dark:text-white">
                Task Board by Status
            </Typography>
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={4} justifyContent="center">
                    {statuses.map((status) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={status}>
                            <Box className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col dark:bg-gray-800">
                                <Typography
                                    variant="h5"
                                    className={`font-semibold mb-4 pb-2 border-b-2 
                                                ${status === 'todo' ? 'border-gray-400 text-gray-700 dark:text-gray-300 dark:border-gray-600' :
                                            status === 'in-progress' ? 'border-blue-400 text-blue-700 dark:text-blue-300 dark:border-blue-600' :
                                                'border-green-400 text-green-700 dark:text-green-300 dark:border-green-600'
                                        }`}
                                >
                                    {status.replace('-', ' ').toUpperCase()}
                                    <span className="ml-2 text-sm font-normal opacity-75">
                                        ({tasks.filter(t => t.status === status).length})
                                    </span>
                                </Typography>
                                <Droppable droppableId={status}>
                                    {(provided, snapshot) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="flex-grow overflow-y-auto pr-2"
                                            sx={{
                                                backgroundColor: snapshot.isDraggingOver ? (theme.palette.mode === 'dark' ? '#3b82f633' : '#e8f5e9') : 'transparent', // Light blue/green hover
                                                minHeight: '100px',
                                                transition: 'background-color 0.2s ease-in-out', // Smooth transition for drag over
                                                borderRadius: '8px', // Match card borders
                                                padding: '4px', // Add some padding inside droppable
                                            }}
                                        >
                                            {tasks
                                                .filter((task) => task.status === status)
                                                .map((task, index) => (
                                                    <TaskCard key={task.id} task={task} index={index} onClick={onTaskClick} />
                                                ))}
                                            {provided.placeholder}
                                            {tasks.filter((task) => task.status === status).length === 0 && !snapshot.isDraggingOver && (
                                                <Typography variant="body2" color="text.secondary" className="text-center py-4 dark:text-gray-400">
                                                    No tasks in this column.
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Droppable>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </DragDropContext>
        </Box>
    );
};

// User-based Board Component
const UserBoard = ({ tasks, users, projects, onDragEnd, selectedUserId, onTaskClick }) => {
    const theme = useTheme();
    return (
        <Box className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen dark:bg-gray-900">
            <Typography variant="h4" className="font-bold mb-6 text-center text-gray-800 dark:text-white">
                Task Board by Assigned User
            </Typography>
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={4} justifyContent="center">
                    {users.map((user) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={user.id}>
                            <Box className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col dark:bg-gray-800">
                                <Typography variant="h5" className="font-semibold mb-4 pb-2 border-b-2 border-purple-400 text-purple-700 dark:text-purple-300 dark:border-purple-600">
                                    {user.name}
                                    <span className="ml-2 text-sm font-normal opacity-75">
                                        ({tasks.filter(t => t.assignedTo === user.id).length})
                                    </span>
                                </Typography>
                                <Droppable droppableId={user.id}>
                                    {(provided, snapshot) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="flex-grow overflow-y-auto pr-2"
                                            sx={{
                                                backgroundColor: snapshot.isDraggingOver ? (theme.palette.mode === 'dark' ? '#a78bfa33' : '#ede7f6') : 'transparent', // Light purple hover
                                                minHeight: '100px',
                                                transition: 'background-color 0.2s ease-in-out',
                                                borderRadius: '8px',
                                                padding: '4px',
                                            }}
                                        >
                                            {tasks
                                                .filter((task) => task.assignedTo === user.id)
                                                .map((task, index) => (
                                                    <TaskCard
                                                        key={task.id}
                                                        task={task}
                                                        index={index}
                                                        isBlurred={selectedUserId && task.assignedTo !== selectedUserId}
                                                        onClick={onTaskClick}
                                                    />
                                                ))}
                                            {provided.placeholder}
                                            {tasks.filter((task) => task.assignedTo === user.id).length === 0 && !snapshot.isDraggingOver && (
                                                <Typography variant="body2" color="text.secondary" className="text-center py-4 dark:text-gray-400">
                                                    No tasks assigned to {user.name}.
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Droppable>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </DragDropContext>
        </Box>
    );
};

// Add Task Form Component (reused for editing)
const TaskForm = ({ task, users, projects, onSubmit, onClose, isEditMode = false }) => {
    const theme = useTheme();
    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: task || {
            title: '',
            description: '',
            projectId: '',
            status: 'todo',
            assignedTo: '',
            dueDate: ''
        }
    });

    useEffect(() => {
        // Reset form when task prop changes (for edit mode)
        reset(task || {
            title: '',
            description: '',
            projectId: '',
            status: 'todo',
            assignedTo: '',
            dueDate: ''
        });
    }, [task, reset]);

    const inputLabelColor = theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary;
    const inputBorderColor = theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400];
    const inputTextColor = theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary;


    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 dark:bg-gray-800 rounded-b-xl">
            <Controller
                name="title"
                control={control}
                rules={{ required: 'Task title is required' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Task Title"
                        variant="outlined"
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title ? errors.title.message : ''}
                        sx={{
                            '& .MuiInputLabel-root': { color: inputLabelColor },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: inputBorderColor },
                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                '& .MuiInputBase-input': { color: inputTextColor },
                            },
                        }}
                    />
                )}
            />
            <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description ? errors.description.message : ''}
                        sx={{
                            '& .MuiInputLabel-root': { color: inputLabelColor },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: inputBorderColor },
                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                '& .MuiInputBase-input': { color: inputTextColor },
                            },
                        }}
                    />
                )}
            />
            <FormControl fullWidth variant="outlined" error={!!errors.projectId}
                sx={{
                    '& .MuiInputLabel-root': { color: inputLabelColor },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: inputBorderColor },
                        '&:hover fieldset': { borderColor: theme.palette.primary.main },
                        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                        '& .MuiInputBase-input': { color: inputTextColor },
                        '& .MuiSelect-icon': { color: inputLabelColor }, // Adjust select icon color
                    },
                }}
            >
                <InputLabel>Project</InputLabel>
                <Controller
                    name="projectId"
                    control={control}
                    rules={{ required: 'Project is required' }}
                    render={({ field }) => (
                        <Select {...field} label="Project">
                            <MenuItem value="" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>
                                <em>None</em>
                            </MenuItem>
                            {projects.map((project) => (
                                <MenuItem key={project.id} value={project.id}
                                    sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}
                                >
                                    {project.name}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                {errors.projectId && <Typography color="error" variant="caption">{errors.projectId.message}</Typography>}
            </FormControl>
            <FormControl fullWidth variant="outlined" error={!!errors.assignedTo}
                sx={{
                    '& .MuiInputLabel-root': { color: inputLabelColor },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: inputBorderColor },
                        '&:hover fieldset': { borderColor: theme.palette.primary.main },
                        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                        '& .MuiInputBase-input': { color: inputTextColor },
                        '& .MuiSelect-icon': { color: inputLabelColor },
                    },
                }}
            >
                <InputLabel>Assigned To</InputLabel>
                <Controller
                    name="assignedTo"
                    control={control}
                    rules={{ required: 'Assignee is required' }}
                    render={({ field }) => (
                        <Select {...field} label="Assigned To">
                            <MenuItem value="" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>
                                <em>None</em>
                            </MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}
                                    sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}
                                >
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                {errors.assignedTo && <Typography color="error" variant="caption">{errors.assignedTo.message}</Typography>}
            </FormControl>
            <FormControl fullWidth variant="outlined" error={!!errors.status}
                sx={{
                    '& .MuiInputLabel-root': { color: inputLabelColor },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: inputBorderColor },
                        '&:hover fieldset': { borderColor: theme.palette.primary.main },
                        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                        '& .MuiInputBase-input': { color: inputTextColor },
                        '& .MuiSelect-icon': { color: inputLabelColor },
                    },
                }}
            >
                <InputLabel>Status</InputLabel>
                <Controller
                    name="status"
                    control={control}
                    rules={{ required: 'Status is required' }}
                    render={({ field }) => (
                        <Select {...field} label="Status">
                            <MenuItem value="todo" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>To Do</MenuItem>
                            <MenuItem value="in-progress" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>In Progress</MenuItem>
                            <MenuItem value="completed" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>Completed</MenuItem>
                        </Select>
                    )}
                />
                {errors.status && <Typography color="error" variant="caption">{errors.status.message}</Typography>}
            </FormControl>
            <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                    <DatePicker
                        label="Due Date"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                fullWidth
                                error={!!errors.dueDate}
                                helperText={errors.dueDate ? errors.dueDate.message : ''}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    '& .MuiInputLabel-root': { color: inputLabelColor },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: inputBorderColor },
                                        '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                        '& .MuiInputBase-input': { color: inputTextColor },
                                        '& .MuiButtonBase-root': { color: inputLabelColor }, // Calendar icon color
                                    },
                                }}
                            />
                        )}
                    />
                )}
            />
            <DialogActions className="p-4 pt-0"> {/* Adjusted padding */}
                <Button onClick={onClose} color="inherit" sx={{ color: inputTextColor }}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    {isEditMode ? 'Update Task' : 'Add Task'}
                </Button>
            </DialogActions>
        </Box>
    );
};

// Task Details/Edit Dialog Component
const TaskDetailEditDialog = ({ task, users, projects, onUpdateTask, onDeleteTask, onClose }) => {
    const theme = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            assignedTo: '',
            projectId: '',
            status: '',
            dueDate: '',
        }
    });

    useEffect(() => {
        setIsEditing(false);
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
    }, [task, reset]);

    const onSubmitEditForm = (data) => {
        onUpdateTask({ ...task, ...data });
        setIsEditing(false);
    };

    const handleDeleteConfirm = () => {
        onDeleteTask(task.id);
        setConfirmDeleteOpen(false);
    };

    const inputLabelColor = theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary;
    const inputBorderColor = theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400];
    const inputTextColor = theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary;

    return (
        <>
            <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ className: "rounded-xl dark:bg-gray-800 dark:text-white" }}>
                <DialogTitle sx={{ color: inputTextColor }}>
                    {isEditing ? "Edit Task" : "Task Details"}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.divider }}>
                    {isEditing ? (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box component="form" onSubmit={handleSubmit(onSubmitEditForm)} className="space-y-4 p-4 -mx-4 -my-2">
                                <Controller
                                    name="title"
                                    control={control}
                                    rules={{ required: 'Task title is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Title"
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            error={!!errors.title}
                                            helperText={errors.title ? errors.title.message : ''}
                                            sx={{
                                                '& .MuiInputLabel-root': { color: inputLabelColor },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { borderColor: inputBorderColor },
                                                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                                    '& .MuiInputBase-input': { color: inputTextColor },
                                                },
                                            }}
                                        />
                                    )}
                                />
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{ required: 'Description is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Description"
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            error={!!errors.description}
                                            helperText={errors.description ? errors.description.message : ''}
                                            sx={{
                                                '& .MuiInputLabel-root': { color: inputLabelColor },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { borderColor: inputBorderColor },
                                                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                                    '& .MuiInputBase-input': { color: inputTextColor },
                                                },
                                            }}
                                        />
                                    )}
                                />
                                <FormControl fullWidth margin="normal" error={!!errors.assignedTo}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: inputLabelColor },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: inputBorderColor },
                                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            '& .MuiInputBase-input': { color: inputTextColor },
                                            '& .MuiSelect-icon': { color: inputLabelColor },
                                        },
                                    }}
                                >
                                    <InputLabel>Assigned To</InputLabel>
                                    <Controller
                                        name="assignedTo"
                                        control={control}
                                        rules={{ required: 'Assignee is required' }}
                                        render={({ field }) => (
                                            <Select {...field} label="Assigned To">
                                                <MenuItem value="" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}><em>None</em></MenuItem>
                                                {users.map(user => (
                                                    <MenuItem key={user.id} value={user.id} sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>{user.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.assignedTo && <Typography color="error" variant="caption">{errors.assignedTo.message}</Typography>}
                                </FormControl>
                                <FormControl fullWidth margin="normal" error={!!errors.projectId}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: inputLabelColor },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: inputBorderColor },
                                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            '& .MuiInputBase-input': { color: inputTextColor },
                                            '& .MuiSelect-icon': { color: inputLabelColor },
                                        },
                                    }}
                                >
                                    <InputLabel>Project</InputLabel>
                                    <Controller
                                        name="projectId"
                                        control={control}
                                        rules={{ required: 'Project is required' }}
                                        render={({ field }) => (
                                            <Select {...field} label="Project">
                                                <MenuItem value="" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}><em>None</em></MenuItem>
                                                {projects.map(project => (
                                                    <MenuItem key={project.id} value={project.id} sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>{project.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.projectId && <Typography color="error" variant="caption">{errors.projectId.message}</Typography>}
                                </FormControl>
                                <FormControl fullWidth margin="normal" error={!!errors.status}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: inputLabelColor },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: inputBorderColor },
                                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            '& .MuiInputBase-input': { color: inputTextColor },
                                            '& .MuiSelect-icon': { color: inputLabelColor },
                                        },
                                    }}
                                >
                                    <InputLabel>Status</InputLabel>
                                    <Controller
                                        name="status"
                                        control={control}
                                        rules={{ required: 'Status is required' }}
                                        render={({ field }) => (
                                            <Select {...field} label="Status">
                                                <MenuItem value="todo" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>To Do</MenuItem>
                                                <MenuItem value="in-progress" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>In Progress</MenuItem>
                                                <MenuItem value="completed" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>Completed</MenuItem>
                                            </Select>
                                        )}
                                    />
                                    {errors.status && <Typography color="error" variant="caption">{errors.status.message}</Typography>}
                                </FormControl>
                                <Controller
                                    name="dueDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Due Date"
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    error={!!errors.dueDate}
                                                    helperText={errors.dueDate ? errors.dueDate.message : ''}
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{
                                                        '& .MuiInputLabel-root': { color: inputLabelColor },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': { borderColor: inputBorderColor },
                                                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                                            '& .MuiInputBase-input': { color: inputTextColor },
                                                            '& .MuiButtonBase-root': { color: inputLabelColor },
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Box>
                        </LocalizationProvider>
                    ) : (
                        <Box className="space-y-4 p-4 -mx-4 -my-2" sx={{
                            '& .MuiTypography-root': {
                                color: inputTextColor,
                            },
                            '& .MuiTypography-body1': {
                                color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.text.secondary,
                            },
                            '& .MuiDivider-root': {
                                borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.divider,
                            },
                            '& strong': {
                                color: inputTextColor,
                            }
                        }}>
                            <Typography variant="h5" className="font-bold">{task.title}</Typography>
                            <Typography variant="body1" color="text.secondary">{task.description}</Typography>
                            <Divider />
                            <Typography variant="body2">
                                <strong>Status:</strong> <Chip label={task.status.replace('-', ' ').toUpperCase()} size="small" className={`capitalize ${task.status === 'todo' ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : task.status === 'in-progress' ? 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100' : 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100'}`} />
                            </Typography>
                            <Typography variant="body2">
                                <strong>Assigned to:</strong> {getUserName(task.assignedTo)}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Project:</strong> {getProjectName(task.projectId)}
                            </Typography>
                            {task.dueDate && (
                                <Typography variant="body2">
                                    <strong>Due Date:</strong> {task.dueDate}
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className="p-4">
                    {isEditing ? (
                        <>
                            <Button onClick={() => setIsEditing(false)} color="inherit" sx={{ color: inputTextColor }}>Cancel</Button>
                            <Button onClick={handleSubmit(onSubmitEditForm)} variant="contained" color="primary">Save Changes</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setIsEditing(true)} color="primary">Edit</Button>
                            <Button onClick={() => setConfirmDeleteOpen(true)} color="error">Delete</Button>
                            <Button onClick={onClose} variant="outlined" sx={{ color: inputTextColor }}>Close</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} PaperProps={{ className: "rounded-xl dark:bg-gray-800 dark:text-white" }}>
                <DialogTitle sx={{ color: inputTextColor }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.text.secondary }}>
                        Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={() => setConfirmDeleteOpen(false)} color="inherit" sx={{ color: inputTextColor }}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};


// Header Component for the Kanban Board
const KanbanHeader = () => {
    const theme = useTheme(); // Access the global theme
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationsOpen, setNotificationsOpen] = React.useState(false);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationsClick = () => {
        console.log('Notifications clicked!');
        setNotificationsOpen(!notificationsOpen);
    };

    return (
        <AppBar position="sticky" color="default" elevation={2} className="dark:bg-gray-800 transition-shadow duration-300"> {/* Increased elevation, added transition */}
            <Toolbar className="flex justify-between px-4 py-2 sm:px-6"> {/* More responsive padding */}
                {/* Left Side */}
                <Box className="flex items-center gap-2"> {/* Added gap for spacing */}
                    <Tooltip title="Main Menu">
                        <IconButton color="inherit" aria-label="Main Menu" onClick={handleMenuClick}
                            sx={{ color: theme.palette.text.primary, '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem sx={{ marginX: 2, bgcolor: theme.palette.divider }} />

                    <Box className="flex items-center cursor-pointer p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Avatar alt="User Avatar" src="https://storage.googleapis.com/a1aa/image/c43fc21f-8597-4ac3-d00f-c32f32716775.jpg" sx={{ width: 28, height: 28 }} /> {/* Slightly larger avatar */}
                        <Typography variant="body2" sx={{ marginLeft: 1, fontWeight: 600, color: theme.palette.text.secondary }}>
                            Complaints
                        </Typography>
                        <ArrowDropDownIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                    </Box>
                </Box>

                {/* Right Side */}
                <Box className="flex items-center gap-3">
                    <Tooltip title="Board View">
                        <IconButton color="inherit" aria-label="Board view" sx={{ color: theme.palette.text.secondary, '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                            <BoardIcon />
                        </IconButton>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem sx={{ bgcolor: theme.palette.divider }} />

                    <Tooltip title="Users">
                        <IconButton color="inherit" aria-label="Users" sx={{ color: theme.palette.text.secondary, '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                            <UsersIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Timer">
                        <IconButton color="inherit" aria-label="Timer" sx={{ color: theme.palette.text.secondary, '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                            <TimerIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Check">
                        <IconButton color="inherit" aria-label="Check" sx={{ color: theme.palette.text.secondary, '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                            <CheckCircleIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Notifications">
                        <IconButton color="inherit" aria-label="Notifications" onClick={handleNotificationsClick} sx={{ color: theme.palette.text.secondary, '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                            <Badge badgeContent={99} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Help">
                        <IconButton color="inherit" aria-label="Help" sx={{ color: theme.palette.text.secondary, '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                            <QuestionMarkIcon />
                        </IconButton>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem sx={{ bgcolor: theme.palette.divider }} />

                    <Tooltip title="User Profile">
                        <IconButton color="primary" sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: theme.palette.primary.main, '&:hover': { opacity: 0.9 } }}> {/* Slightly larger, subtle hover */}
                            <Typography variant="body2" color="white" sx={{ fontWeight: 600 }}>
                                M
                            </Typography>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>

            {/* Menu for Left MenuIcon click */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ className: "rounded-lg shadow-lg dark:bg-gray-700" }}
            >
                <MenuItem onClick={handleMenuClose} className="dark:text-white">Profile</MenuItem>
                <MenuItem onClick={handleMenuClose} className="dark:text-white">Settings</MenuItem>
                <MenuItem onClick={handleMenuClose} className="dark:text-white">Logout</MenuItem>
            </Menu>
        </AppBar>
    );
};


// User List Component
const UserList = ({ users, selectedUserId, onSelectUser }) => {
    const theme = useTheme();

    const textColor = theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[800];
    const secondaryTextColor = theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary;

    return (
        <Paper
            elevation={4} // Increased elevation
            className="p-4 h-full flex flex-col bg-white rounded-xl shadow-lg dark:bg-gray-800 transition-shadow duration-300"
        >
            <Typography
                variant="h6"
                className="font-bold mb-4 border-b-2 pb-2"
                sx={{
                    color: textColor,
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[300]
                }}
            >
                Users
            </Typography>
            <List className="flex-grow overflow-y-auto">
                <ListItem
                    button
                    onClick={() => onSelectUser(null)} // Option to clear filter
                    selected={selectedUserId === null}
                    className="rounded-lg mb-2 transform transition-all duration-200"
                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: blue[100],
                            borderLeft: `4px solid ${blue[600]}`,
                            '&:hover': {
                                backgroundColor: blue[200],
                            },
                        },
                        '&:not(.Mui-selected):hover': {
                            backgroundColor: theme.palette.action.hover,
                            transform: 'translateX(4px)',
                        },
                        '& .MuiListItemText-primary': {
                            color: selectedUserId === null ? blue[800] : textColor,
                            fontWeight: selectedUserId === null ? 600 : 400
                        },
                        '& .MuiListItemText-secondary': {
                            color: selectedUserId === null ? blue[600] : secondaryTextColor
                        },
                        '& .MuiListItemIcon-root': {
                            minWidth: 40,
                        }
                    }}
                >
                    <ListItemIcon>
                        <Avatar sx={{ bgcolor: grey[500], color: 'white', fontSize: '0.875rem' }}>ALL</Avatar>
                    </ListItemIcon>
                    <ListItemText primary="All Users" />
                </ListItem>
                {users.map((user) => (
                    <Tooltip title={user.name} key={user.id} arrow>
                        <ListItem
                            button
                            onClick={() => onSelectUser(user.id)}
                            selected={selectedUserId === user.id}
                            className="rounded-lg mb-2 transform transition-all duration-200"
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: purple[100], // Using purple for users
                                    borderLeft: `4px solid ${purple[600]}`,
                                    '&:hover': {
                                        backgroundColor: purple[200],
                                    },
                                },
                                '&:not(.Mui-selected):hover': {
                                    backgroundColor: theme.palette.action.hover,
                                    transform: 'translateX(4px)',
                                },
                                '& .MuiListItemText-primary': {
                                    color: selectedUserId === user.id ? purple[800] : textColor,
                                    fontWeight: selectedUserId === user.id ? 600 : 400
                                },
                                '& .MuiListItemText-secondary': {
                                    color: selectedUserId === user.id ? purple[600] : secondaryTextColor
                                },
                                '& .MuiListItemIcon-root': {
                                    minWidth: 40,
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Avatar sx={{ bgcolor: purple[500], color: 'white', fontSize: '0.875rem' }}>{user.name.charAt(0).toUpperCase()}</Avatar>
                            </ListItemIcon>
                            <ListItemText primary={user.name} secondary={user.email} />
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Paper>
    );
};

// Project List Component (New)
const ProjectList = ({ projects, selectedProjectId, onSelectProject }) => {
    const theme = useTheme();

    // Determine text color based on current theme mode
    const textColor = theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[800];
    const secondaryTextColor = theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[600];

    return (
        <Paper
            elevation={4} // Slightly increased default elevation for a richer look
            className="p-4 h-full flex flex-col bg-white rounded-xl shadow-lg dark:bg-gray-800 transition-shadow duration-300"
        >
            <Typography
                variant="h6"
                className="font-bold mb-4 border-b-2 pb-2"
                sx={{
                    color: textColor, // Dynamic text color
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[300] // Dynamic border color
                }}
            >
                Projects
            </Typography>
            <List className="flex-grow overflow-y-auto">
                {/* "All Projects" ListItem */}
                <ListItem
                    button
                    onClick={() => onSelectProject(null)} // Option to clear filter
                    selected={selectedProjectId === null}
                    className="rounded-lg mb-2 transform transition-all duration-200"
                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: blue[100], // More prominent light blue for selected "All"
                            borderLeft: `4px solid ${blue[600]}`, // Accent border for selection
                            '&:hover': {
                                backgroundColor: blue[200], // Darker hover for selected state
                            },
                        },
                        '&:not(.Mui-selected):hover': {
                            backgroundColor: theme.palette.action.hover, // Standard hover for non-selected
                            transform: 'translateX(4px)', // Subtle slide effect on hover
                        },
                        '& .MuiListItemText-primary': {
                            color: selectedProjectId === null ? blue[800] : textColor, // Highlight text when selected
                            fontWeight: selectedProjectId === null ? 600 : 400 // Bold text when selected
                        },
                        '& .MuiListItemIcon-root': {
                            minWidth: 40, // Ensure consistent icon spacing
                        }
                    }}
                >
                    <ListItemIcon>
                        <Avatar sx={{ bgcolor: grey[500], color: 'white', fontSize: '0.875rem' }}>ALL</Avatar>
                    </ListItemIcon>
                    <ListItemText primary="All Projects" />
                </ListItem>

                {/* Individual Project ListItems */}
                {projects.map((project) => (
                    <Tooltip title={project.name} key={project.id} arrow> {/* Tooltip for long project names */}
                        <ListItem
                            button
                            onClick={() => onSelectProject(project.id)}
                            selected={selectedProjectId === project.id}
                            className="rounded-lg mb-2 transform transition-all duration-200"
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: green[100], // More prominent light green for selected project
                                    borderLeft: `4px solid ${green[600]}`, // Accent border for selection
                                    '&:hover': {
                                        backgroundColor: green[200], // Darker hover for selected state
                                    },
                                },
                                '&:not(.Mui-selected):hover': {
                                    backgroundColor: theme.palette.action.hover, // Standard hover for non-selected
                                    transform: 'translateX(4px)', // Subtle slide effect on hover
                                },
                                '& .MuiListItemText-primary': {
                                    color: selectedProjectId === project.id ? green[800] : textColor, // Highlight text when selected
                                    fontWeight: selectedProjectId === project.id ? 600 : 400 // Bold text when selected
                                },
                                '& .MuiListItemIcon-root': {
                                    minWidth: 40, // Ensure consistent icon spacing
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Avatar sx={{ bgcolor: green[500], color: 'white', fontSize: '0.875rem' }}>
                                    {project.name.charAt(0).toUpperCase()}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText
                                primary={project.name}
                            // You can add secondary text here, e.g., task count if passed as a prop
                            // secondary={project.taskCount ? `${project.taskCount} tasks` : ''} 
                            />
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Paper>
    );
};


// Main App Component (Renamed to KanbanBoard)
const KanbanBoard = () => {
    const theme = useTheme(); // Access the global theme
    const [currentView, setCurrentView] = useState('status');
    const [tasks, setTasks] = useState(initialTasks);
    const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null); // New state for project filter
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term
    const [taskToViewEdit, setTaskToViewEdit] = useState(null); // Task object for view/edit dialog
    const [openViewEditDialog, setOpenViewEditDialog] = useState(false); // State for view/edit dialog

    const handleAddTask = (newTaskData) => {
        const newTaskId = `task-${Date.now()}`;
        const newTask = { id: newTaskId, ...newTaskData };
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const handleOpenAddTaskDialog = () => {
        setOpenAddTaskDialog(true);
    };

    const handleCloseAddTaskDialog = () => {
        setOpenAddTaskDialog(false);
    };

    const handleSelectUser = (userId) => {
        setSelectedUserId(userId);
    };

    const handleSelectProject = (projectId) => {
        setSelectedProjectId(projectId);
    };

    const handleStartDateChange = (date) => {
        setSelectedStartDate(date);
        if (date && selectedEndDate && date.isAfter(selectedEndDate)) {
            setSelectedEndDate(null);
        }
    };

    const handleEndDateChange = (date) => {
        setSelectedEndDate(date);
        if (date && selectedStartDate && date.isBefore(selectedStartDate)) {
            setSelectedStartDate(null);
        }
    };

    const handleTaskClick = (task) => {
        setTaskToViewEdit(task);
        setOpenViewEditDialog(true);
    };

    const handleUpdateTask = (updatedTask) => {
        setTasks(prevTasks => prevTasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        ));
        setOpenViewEditDialog(false); // Close dialog after update
        setTaskToViewEdit(null);
    };

    const handleDeleteTask = (taskId) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        setOpenViewEditDialog(false); // Close dialog after delete
        setTaskToViewEdit(null);
    };

    // Function to handle drag and drop
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const draggedTask = tasks.find(task => task.id === draggableId);
        if (!draggedTask) {
            return;
        }

        const newTasks = Array.from(tasks);
        const taskIndex = newTasks.findIndex(task => task.id === draggableId);
        newTasks.splice(taskIndex, 1);

        const isStatusBoard = ['todo', 'in-progress', 'completed'].includes(source.droppableId);

        if (isStatusBoard) {
            const newStatus = destination.droppableId;
            const updatedTask = { ...draggedTask, status: newStatus };
            newTasks.push(updatedTask);
            setTasks(newTasks);
        } else {
            // This is for UserBoard
            const newAssignedTo = destination.droppableId;
            const updatedTask = { ...draggedTask, assignedTo: newAssignedTo };
            newTasks.push(updatedTask);
            setTasks(newTasks);
        }
    };

    // Combined filtering logic
    const getFilteredTasks = () => {
        let filtered = tasks;

        // 1. Date Filtering
        filtered = filtered.filter(task => {
            if (!task.dueDate) return true; // Tasks without a due date are always shown unless other filters exclude them
            const taskDueDate = dayjs(task.dueDate);

            if (selectedStartDate && selectedEndDate) {
                return taskDueDate.isAfter(selectedStartDate.subtract(1, 'day'), 'day') && taskDueDate.isBefore(selectedEndDate.add(1, 'day'), 'day');
            } else if (selectedStartDate && !selectedEndDate) {
                return taskDueDate.isSame(selectedStartDate, 'day');
            } else if (!selectedStartDate && selectedEndDate) {
                return taskDueDate.isSame(selectedEndDate, 'day');
            }
            return true; // No date filter applied
        });

        // 2. Project Filtering
        if (selectedProjectId) {
            filtered = filtered.filter(task => task.projectId === selectedProjectId);
        }

        // 3. Search Term Filtering
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                task.description.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        return filtered;
    };

    const displayedTasks = getFilteredTasks();

    // Tasks for StatusBoard (filtered by date, project, search, AND selected user)
    const statusBoardTasks = selectedUserId
        ? displayedTasks.filter(task => task.assignedTo === selectedUserId)
        : displayedTasks;

    // Tasks for UserBoard (filtered by date, project, search, but user blur is handled inside UserBoard)
    const userBoardTasks = displayedTasks;

    return (
        <div className="min-h-screen bg-gray-100 pb-10 dark:bg-gray-900 font-sans"> {/* Added font-sans for Inter font */}
            <KanbanHeader />
            <Box className="p-4 bg-white shadow-md flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 dark:bg-gray-800 transition-shadow duration-300">
                <Typography variant="h5" className="font-bold text-gray-800 dark:text-white">
                    Project Management Dashboard
                </Typography>
                <Box className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <Button
                        variant={currentView === 'status' ? 'contained' : 'outlined'}
                        onClick={() => setCurrentView('status')}
                        color="primary"
                        className="w-full sm:w-auto transform transition-transform duration-200 hover:scale-105"
                        startIcon={<BoardIcon />} // Added icon
                    >
                        Status Board
                    </Button>
                    <Button
                        variant={currentView === 'user' ? 'contained' : 'outlined'}
                        onClick={() => setCurrentView('user')}
                        color="primary"
                        className="w-full sm:w-auto transform transition-transform duration-200 hover:scale-105"
                        startIcon={<UsersIcon />} // Added icon
                    >
                        User Board
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleOpenAddTaskDialog}
                        className="w-full sm:w-auto transform transition-transform duration-200 hover:scale-105"
                        startIcon={<MenuIcon />} // Added icon
                    >
                        Add New Task
                    </Button>
                </Box>
            </Box>

            <Container maxWidth="xl" className="mt-8">
                <Grid container spacing={4}>
                    {/* Left Sidebar for Project List */}
                    <Grid size={{ xs: 12, md: 2 }}>
                        <ProjectList
                            projects={projects}
                            selectedProjectId={selectedProjectId}
                            onSelectProject={handleSelectProject}
                        />
                    </Grid>

                    {/* Main Content Area (Boards) */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        {/* Filter Section */}
                        <Paper elevation={3} className="p-4 mb-6 bg-white rounded-xl shadow-lg flex flex-col md:flex-row gap-4 items-center justify-center dark:bg-gray-700 transition-shadow duration-300">
                            <Typography variant="h6" className="font-semibold text-gray-700 dark:text-white">Filters:</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Start Date"
                                    value={selectedStartDate}
                                    onChange={handleStartDateChange}
                                    renderInput={(params) => <TextField {...params} variant="outlined" size="small"
                                        sx={{
                                            '& .MuiInputLabel-root': { color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400] },
                                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                                '& .MuiInputBase-input': { color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary },
                                                '& .MuiButtonBase-root': { color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary },
                                            },
                                        }}
                                    />}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={selectedEndDate}
                                    onChange={handleEndDateChange}
                                    minDate={selectedStartDate || dayjs('1900-01-01')}
                                    renderInput={(params) => <TextField {...params} variant="outlined" size="small"
                                        sx={{
                                            '& .MuiInputLabel-root': { color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400] },
                                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                                '& .MuiInputBase-input': { color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary },
                                                '& .MuiButtonBase-root': { color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary },
                                            },
                                        }}
                                    />}
                                />
                            </LocalizationProvider>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => { setSelectedStartDate(null); setSelectedEndDate(null); }}
                                disabled={!selectedStartDate && !selectedEndDate}
                                startIcon={<ClearIcon />}
                                className="transform transition-transform duration-200 hover:scale-105"
                            >
                                Clear Dates
                            </Button>
                            <TextField
                                label="Search Tasks"
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    endAdornment: searchTerm && (
                                        <IconButton onClick={() => setSearchTerm('')} size="small">
                                            <ClearIcon />
                                        </IconButton>
                                    ),
                                    startAdornment: <SearchIcon className="mr-2" />
                                }}
                                className="w-full md:w-auto"
                                sx={{
                                    '& .MuiInputLabel-root': { color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400] },
                                        '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                        '& .MuiInputBase-input': { color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary },
                                        '& .MuiButtonBase-root': { color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary },
                                    },
                                }}
                            />
                        </Paper>

                        {currentView === 'status' ? (
                            <StatusBoard
                                tasks={statusBoardTasks}
                                projects={projects}
                                users={users}
                                onDragEnd={onDragEnd}
                                selectedUserId={selectedUserId}
                                onTaskClick={handleTaskClick}
                            />
                        ) : (
                            <UserBoard
                                tasks={userBoardTasks}
                                users={users}
                                projects={projects}
                                onDragEnd={onDragEnd}
                                selectedUserId={selectedUserId}
                                onTaskClick={handleTaskClick}
                            />
                        )}
                    </Grid>
                    {/* Right Sidebar for User List */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <UserList
                            users={users}
                            selectedUserId={selectedUserId}
                            onSelectUser={handleSelectUser}
                        />
                    </Grid>
                </Grid>
            </Container>

            {/* Add New Task Dialog */}
            <Dialog open={openAddTaskDialog} onClose={handleCloseAddTaskDialog} PaperProps={{ className: "rounded-xl dark:bg-gray-800" }}>
                <DialogTitle sx={{ color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[800] }}>
                    Add New Task
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseAddTaskDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TaskForm
                            users={users}
                            projects={projects}
                            onSubmit={handleAddTask}
                            onClose={handleCloseAddTaskDialog}
                        />
                    </LocalizationProvider>
                </DialogContent>
            </Dialog>

            {/* View/Edit Task Dialog */}
            {taskToViewEdit && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TaskDetailEditDialog
                        task={taskToViewEdit}
                        users={users}
                        projects={projects}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        onClose={() => setOpenViewEditDialog(false)}
                    />
                </LocalizationProvider>
            )}
        </div>
    );
};

export default KanbanBoard;
