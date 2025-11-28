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
    Paper
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, blue, grey } from '@mui/material/colors';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// --- Dummy Data Embedded Directly ---
export const users = [
    { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 'user-2', name: 'Bob Williams', email: 'bob@example.com' },
    { id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 'user-4', name: 'Diana Prince', email: 'diana@example.com' },
    { id: 'user-5', name: 'Test Prince', email: 'diantetsa@example.com' },
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
const TaskCard = ({ task, index }) => {
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
                    className="mt-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300"
                    style={{
                        ...provided.draggableProps.style,
                        backgroundColor: snapshot.isDragging ? '#e0f2f7' : '', // Light blue when dragging
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
const StatusBoard = ({ tasks, projects, users, onDragEnd }) => {
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
                                                backgroundColor: snapshot.isDraggingOver ? '#e8f5e9' : 'transparent', // Light green when dragging over
                                                minHeight: '100px', // Ensure droppable area is visible
                                            }}
                                        >
                                            {tasks
                                                .filter((task) => task.status === status)
                                                .map((task, index) => (
                                                    <TaskCard key={task.id} task={task} index={index} />
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
const UserBoard = ({ tasks, users, projects, onDragEnd }) => {
    return (
        <Box className="p-6 bg-gray-50 min-h-screen">
            <Typography variant="h4" className="font-bold mb-6 text-center text-gray-800">
                Task Board by Assigned User
            </Typography>
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={4} justifyContent="center">
                    {users.map((user) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3, }} key={user.id}>
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
                                                backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : 'transparent', // Light blue when dragging over
                                                minHeight: '100px', // Ensure droppable area is visible
                                            }}
                                        >
                                            {tasks
                                                .filter((task) => task.assignedTo === user.id)
                                                .map((task, index) => (
                                                    <Paper sx={{ p: 1, my: 2 }} >

                                                        <TaskCard key={task.id} task={task} index={index} />
                                                    </Paper>
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

// Add Task Form Component
const AddTaskForm = ({ users, projects, onAddTask, onClose }) => {
    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            projectId: '',
            status: 'todo',
            assignedTo: '',
            dueDate: ''
        }
    });

    const onSubmit = (data) => {
        onAddTask(data);
        reset();
        onClose();
    };

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
                    <TextField
                        {...field}
                        label="Due Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                )}
            />
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    Add Task
                </Button>
            </DialogActions>
        </Box>
    );
};


// Main App Component
const Gem = () => {
    const [currentView, setCurrentView] = useState('status');
    const [tasks, setTasks] = useState(initialTasks);
    const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);

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

    // Function to handle drag and drop
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        // Dropped outside a list
        if (!destination) {
            return;
        }

        // If the item was dropped in the same place
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Find the task that was dragged
        const draggedTask = tasks.find(task => task.id === draggableId);
        if (!draggedTask) {
            return;
        }

        // Create a new array of tasks to avoid direct state mutation
        const newTasks = Array.from(tasks);
        const taskIndex = newTasks.findIndex(task => task.id === draggableId);
        newTasks.splice(taskIndex, 1); // Remove the dragged task from its original position

        // Determine if it's a status change or user reassignment
        const isStatusBoard = ['todo', 'in-progress', 'completed'].includes(source.droppableId);

        if (isStatusBoard) {
            // Logic for Status Board (changing status)
            const newStatus = destination.droppableId;
            const updatedTask = { ...draggedTask, status: newStatus };
            newTasks.push(updatedTask); // Add the task back with its new status
            setTasks(newTasks);

        } else {
            // Logic for User Board (changing assigned user)
            const newAssignedTo = destination.droppableId;
            const updatedTask = { ...draggedTask, assignedTo: newAssignedTo };
            newTasks.push(updatedTask); // Add the task back with its new assignee
            setTasks(newTasks);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="min-h-screen bg-gray-100 pb-10">
                <Box className="p-4 bg-white shadow-sm flex justify-between items-center">
                    <Typography variant="h5" className="font-bold text-gray-800">
                        Project Management Dashboard
                    </Typography>
                    <div className="flex space-x-4">
                        <Button
                            variant={currentView === 'status' ? 'contained' : 'outlined'}
                            onClick={() => setCurrentView('status')}
                            color="primary"
                        >
                            Status Board
                        </Button>
                        <Button
                            variant={currentView === 'user' ? 'contained' : 'outlined'}
                            onClick={() => setCurrentView('user')}
                            color="primary"
                        >
                            User Board
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleOpenAddTaskDialog}
                        >
                            Add New Task
                        </Button>
                    </div>
                </Box>

                <Container maxWidth="xl" className="mt-8">
                    {currentView === 'status' ? (
                        <StatusBoard tasks={tasks} projects={projects} users={users} onDragEnd={onDragEnd} />
                    ) : (
                        //  <Paper sx={{ p: 1, my: 2 }} >
                        <UserBoard tasks={tasks} users={users} projects={projects} onDragEnd={onDragEnd} />
                        //</Paper>
                    )}
                </Container>

                <Dialog open={openAddTaskDialog} onClose={handleCloseAddTaskDialog}>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogContent>
                        <AddTaskForm
                            users={users}
                            projects={projects}
                            onAddTask={handleAddTask}
                            onClose={handleCloseAddTaskDialog}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            {/* Tailwind CSS CDN for utility classes */}
            <script src="https://cdn.tailwindcss.com"></script>
        </ThemeProvider>
    );
};

export default Gem;
