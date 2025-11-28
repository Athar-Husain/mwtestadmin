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
    // MenuItem,
    Divider,
    Badge,
    Tooltip
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
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
    // Stopwatch as StopwatchIcon,
    People as UsersIcon,
    ViewModule as BoardIcon,
    Help as QuestionMarkIcon,
    ArrowDropDown as ArrowDropDownIcon
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

// Custom Material-UI theme for consistent styling
const theme = createTheme({
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
    palette: {
        primary: {
            main: blue[600],
        },
        secondary: {
            main: green[500],
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    borderRadius: 8,
                },
            },
        },
    },
});

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
    const statusColors = {
        'todo': 'bg-gray-200 text-gray-800',
        'in-progress': 'bg-blue-200 text-blue-800',
        'completed': 'bg-green-200 text-green-800',
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(task)} // Make card clickable
                    className={`mt-4 mb-4 shadow-md transition-all duration-300 cursor-pointer ${snapshot.isDragging ? 'bg-blue-50' : ''} ${isBlurred ? 'filter blur-sm opacity-50' : 'hover:shadow-lg'}`}
                    style={{
                        ...provided.draggableProps.style,
                        filter: isBlurred ? 'blur(2px)' : 'none',
                        opacity: isBlurred ? 0.6 : 1,
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" component="div" className="font-semibold mb-1">
                            {task.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="mb-2">
                            {task.description}
                        </Typography>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
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
                            />
                            <Chip
                                label={`Project: ${getProjectName(task.projectId)}`}
                                size="small"
                                variant="outlined"
                                color="secondary"
                            />
                            {task.dueDate && (
                                <Chip
                                    label={`Due: ${task.dueDate}`}
                                    size="small"
                                    variant="outlined"
                                    className="bg-red-50 text-red-600"
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
    const statuses = ['todo', 'in-progress', 'completed'];

    return (
        <Box className="p-6 bg-gray-50 min-h-screen">
            <Typography variant="h4" className="font-bold mb-6 text-center text-gray-800">
                Task Board by Status
            </Typography>
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={4} justifyContent="center">
                    {statuses.map((status) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={status}>
                            <Box className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
                                <Typography
                                    variant="h5"
                                    className={`font-semibold mb-4 pb-2 border-b-2 ${status === 'todo' ? 'border-gray-400 text-gray-700' :
                                        status === 'in-progress' ? 'border-blue-400 text-blue-700' :
                                            'border-green-400 text-green-700'
                                        }`}
                                >
                                    {status.replace('-', ' ').toUpperCase()}
                                </Typography>
                                <Droppable droppableId={status}>
                                    {(provided, snapshot) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="flex-grow overflow-y-auto pr-2"
                                            style={{
                                                backgroundColor: snapshot.isDraggingOver ? '#e8f5e9' : 'transparent',
                                                minHeight: '100px',
                                            }}
                                        >
                                            {tasks
                                                .filter((task) => task.status === status)
                                                .map((task, index) => (
                                                    <TaskCard key={task.id} task={task} index={index} onClick={onTaskClick} />
                                                ))}
                                            {provided.placeholder}
                                            {tasks.filter((task) => task.status === status).length === 0 && !snapshot.isDraggingOver && (
                                                <Typography variant="body2" color="text.secondary" className="text-center py-4">
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
    return (
        <Box className="p-6 bg-gray-50 min-h-screen">
            <Typography variant="h4" className="font-bold mb-6 text-center text-gray-800">
                Task Board by Assigned User
            </Typography>
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={4} justifyContent="center">
                    {users.map((user) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={user.id}>
                            <Box className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
                                <Typography variant="h5" className="font-semibold mb-4 pb-2 border-b-2 border-purple-400 text-purple-700">
                                    {user.name}
                                </Typography>
                                <Droppable droppableId={user.id}>
                                    {(provided, snapshot) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="flex-grow overflow-y-auto pr-2"
                                            style={{
                                                backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : 'transparent',
                                                minHeight: '100px',
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
                                                <Typography variant="body2" color="text.secondary" className="text-center py-4">
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

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
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
                    />
                )}
            />
            <FormControl fullWidth variant="outlined" error={!!errors.projectId}>
                <InputLabel>Project</InputLabel>
                <Controller
                    name="projectId"
                    control={control}
                    rules={{ required: 'Project is required' }}
                    render={({ field }) => (
                        <Select {...field} label="Project">
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {projects.map((project) => (
                                <MenuItem key={project.id} value={project.id}>
                                    {project.name}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                {errors.projectId && <Typography color="error" variant="caption">{errors.projectId.message}</Typography>}
            </FormControl>
            <FormControl fullWidth variant="outlined" error={!!errors.assignedTo}>
                <InputLabel>Assigned To</InputLabel>
                <Controller
                    name="assignedTo"
                    control={control}
                    rules={{ required: 'Assignee is required' }}
                    render={({ field }) => (
                        <Select {...field} label="Assigned To">
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                {errors.assignedTo && <Typography color="error" variant="caption">{errors.assignedTo.message}</Typography>}
            </FormControl>
            <FormControl fullWidth variant="outlined" error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Controller
                    name="status"
                    control={control}
                    rules={{ required: 'Status is required' }}
                    render={({ field }) => (
                        <Select {...field} label="Status">
                            <MenuItem value="todo">To Do</MenuItem>
                            <MenuItem value="in-progress">In Progress</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
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
                            />
                        )}
                    />
                )}
            />
            <DialogActions>
                <Button onClick={onClose} color="primary">
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
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });

    useEffect(() => {
        setIsEditing(false); // Reset to view mode when a new task is opened
        setEditedTask({ ...task });
    }, [task]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onUpdateTask(editedTask);
        setIsEditing(false);
    };

    const handleDeleteConfirm = () => {
        onDeleteTask(task.id);
        setConfirmDeleteOpen(false);
    };

    return (
        <>
            <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? "Edit Task" : "Task Details"}</DialogTitle>
                <DialogContent dividers>
                    {isEditing ? (
                        <>
                            <TextField
                                label="Title"
                                name="title"
                                fullWidth
                                margin="normal"
                                value={editedTask.title}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                                value={editedTask.description}
                                onChange={handleInputChange}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Assignee</InputLabel>
                                <Select
                                    name="assigneeId"
                                    value={editedTask.assigneeId || ""}
                                    onChange={handleInputChange}
                                >
                                    {users.map(user => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Project</InputLabel>
                                <Select
                                    name="projectId"
                                    value={editedTask.projectId || ""}
                                    onChange={handleInputChange}
                                >
                                    {projects.map(project => (
                                        <MenuItem key={project.id} value={project.id}>
                                            {project.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6">{task.title}</Typography>
                            <Typography variant="body1" gutterBottom>
                                {task.description}
                            </Typography>
                            <Typography variant="body2">
                                Assigned to: {users.find(u => u.id === task.assigneeId)?.name || 'Unassigned'}
                            </Typography>
                            <Typography variant="body2">
                                Project: {projects.find(p => p.id === task.projectId)?.name || 'None'}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {isEditing ? (
                        <>
                            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setIsEditing(true)}>Edit</Button>
                            <Button onClick={() => setConfirmDeleteOpen(true)} color="error">Delete</Button>
                            <Button onClick={onClose}>Close</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the task "{task.title}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// export default TaskDetailEditDialog;


// User List Component
const UserList = ({ users, selectedUserId, onSelectUser }) => {
    return (
        <Paper elevation={3} className="p-4 h-full flex flex-col bg-white rounded-xl shadow-lg">
            <Typography variant="h6" className="font-bold mb-4 text-gray-800 border-b-2 pb-2 border-gray-300">
                Users
            </Typography>
            <List className="flex-grow overflow-y-auto">
                <ListItem
                    button
                    onClick={() => onSelectUser(null)} // Option to clear filter
                    selected={selectedUserId === null}
                    className="rounded-lg mb-2"
                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: blue[50],
                            '&:hover': {
                                backgroundColor: blue[100],
                            },
                        },
                    }}
                >
                    <ListItemIcon>
                        <Avatar sx={{ bgcolor: grey[500] }}>All</Avatar>
                    </ListItemIcon>
                    <ListItemText primary="All Users" />
                </ListItem>
                {users.map((user) => (
                    <ListItem
                        button
                        key={user.id}
                        onClick={() => onSelectUser(user.id)}
                        selected={selectedUserId === user.id}
                        className="rounded-lg mb-2"
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: purple[50],
                                '&:hover': {
                                    backgroundColor: purple[100],
                                },
                            },
                        }}
                    >
                        <ListItemIcon>
                            <Avatar sx={{ bgcolor: purple[500] }}>{user.name.charAt(0)}</Avatar>
                        </ListItemIcon>
                        <ListItemText primary={user.name} secondary={user.email} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

// Project List Component (New)
const ProjectList = ({ projects, selectedProjectId, onSelectProject }) => {
    return (
        <Paper elevation={3} className="p-4 h-full flex flex-col bg-white rounded-xl shadow-lg">
            <Typography variant="h6" className="font-bold mb-4 text-gray-800 border-b-2 pb-2 border-gray-300">
                Projects
            </Typography>
            <List className="flex-grow overflow-y-auto">
                <ListItem
                    button
                    onClick={() => onSelectProject(null)} // Option to clear filter
                    selected={selectedProjectId === null}
                    className="rounded-lg mb-2"
                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: blue[50],
                            '&:hover': {
                                backgroundColor: blue[100],
                            },
                        },
                    }}
                >
                    <ListItemIcon>
                        <Avatar sx={{ bgcolor: grey[500] }}>All</Avatar>
                    </ListItemIcon>
                    <ListItemText primary="All Projects" />
                </ListItem>
                {projects.map((project) => (
                    <ListItem
                        button
                        key={project.id}
                        onClick={() => onSelectProject(project.id)}
                        selected={selectedProjectId === project.id}
                        className="rounded-lg mb-2"
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: green[50],
                                '&:hover': {
                                    backgroundColor: green[100],
                                },
                            },
                        }}
                    >
                        <ListItemIcon>
                            <Avatar sx={{ bgcolor: green[500] }}>{project.name.charAt(0)}</Avatar>
                        </ListItemIcon>
                        <ListItemText primary={project.name} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};


// import React from 'react';
// import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Divider, Badge, Avatar, Tooltip } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import StopwatchIcon from '@mui/icons-material/Stopwatch';
// import UsersIcon from '@mui/icons-material/People';
// import BoardIcon from '@mui/icons-material/ViewModule';
// import QuestionMarkIcon from '@mui/icons-material/Help';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationsOpen, setNotificationsOpen] = React.useState(false);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationsClick = () => {
        setNotificationsOpen(!notificationsOpen);
    };

    return (
        <AppBar position="sticky" color="default">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', paddingX: 2, paddingY: 1 }}>
                {/* Left Side */}
                <div sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" aria-label="Menu" onClick={handleMenuClick}>
                        <MenuIcon />
                    </IconButton>

                    <Divider orientation="vertical" flexItem sx={{ marginX: 2 }} />

                    <div sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar alt="User Avatar" src="https://storage.googleapis.com/a1aa/image/c43fc21f-8597-4ac3-d00f-c32f32716775.jpg" sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2" sx={{ marginLeft: 1, fontWeight: 600, color: 'text.secondary' }}>
                            Complaints
                        </Typography>
                        <ArrowDropDownIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </div>
                </div>

                {/* Right Side */}
                <div sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Tooltip title="Board">
                        <IconButton color="inherit" aria-label="Board view">
                            <BoardIcon />
                        </IconButton>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem />

                    <Tooltip title="Users">
                        <IconButton color="inherit" aria-label="Users">
                            <UsersIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Timer">
                        <IconButton color="inherit" aria-label="Timer">
                            {/* <StopwatchIcon /> */}
                            <UsersIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Check">
                        <IconButton color="inherit" aria-label="Check">
                            <CheckCircleIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Notifications">
                        <IconButton color="inherit" aria-label="Notifications" onClick={handleNotificationsClick}>
                            <Badge badgeContent={99} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Help">
                        <IconButton color="inherit" aria-label="Help">
                            <QuestionMarkIcon />
                        </IconButton>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem />

                    <Tooltip title="User Profile">
                        <IconButton color="primary" sx={{ width: 32, height: 32, borderRadius: '50%' }}>
                            <Typography variant="body2" color="white" sx={{ fontWeight: 600 }}>
                                M
                            </Typography>
                        </IconButton>
                    </Tooltip>
                </div>
            </Toolbar>

            {/* Menu for Avatar click */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
        </AppBar>
    );
};

// export default Header;



// Main App Component
const Gem = () => {
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
        <ThemeProvider theme={theme}>

            <div className="min-h-screen bg-gray-100 pb-10">
                <Header />
                <Box className="p-4 bg-white shadow-sm flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Typography variant="h5" className="font-bold text-gray-800">
                        Project Management Dashboard
                    </Typography>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                        <Button
                            variant={currentView === 'status' ? 'contained' : 'outlined'}
                            onClick={() => setCurrentView('status')}
                            color="primary"
                            className="w-full sm:w-auto"
                        >
                            Status Board
                        </Button>
                        <Button
                            variant={currentView === 'user' ? 'contained' : 'outlined'}
                            onClick={() => setCurrentView('user')}
                            color="primary"
                            className="w-full sm:w-auto"
                        >
                            User Board
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleOpenAddTaskDialog}
                            className="w-full sm:w-auto"
                        >
                            Add New Task
                        </Button>
                    </div>
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
                            <Paper elevation={3} className="p-4 mb-6 bg-white rounded-xl shadow-lg flex flex-col md:flex-row gap-4 items-center justify-center">
                                <Typography variant="h6" className="font-semibold text-gray-700">Filters:</Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Start Date"
                                        value={selectedStartDate}
                                        onChange={handleStartDateChange}
                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                                    />
                                    <DatePicker
                                        label="End Date"
                                        value={selectedEndDate}
                                        onChange={handleEndDateChange}
                                        minDate={selectedStartDate || dayjs('1900-01-01')}
                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                                    />
                                </LocalizationProvider>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => { setSelectedStartDate(null); setSelectedEndDate(null); }}
                                    disabled={!selectedStartDate && !selectedEndDate}
                                    startIcon={<ClearIcon />}
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
                <Dialog open={openAddTaskDialog} onClose={handleCloseAddTaskDialog}>
                    <DialogTitle>Add New Task</DialogTitle>
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
            {/* Tailwind CSS CDN for utility classes */}
            <script src="https://cdn.tailwindcss.com"></script>
        </ThemeProvider>
    );
};

export default Gem;
