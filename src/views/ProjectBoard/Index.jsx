// ProjectBoard/Index.jsx
import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    TextField,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    Tooltip,
    MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Icons
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import BoardIcon from '@mui/icons-material/ViewModule';
import UsersIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';

// Import individual components
import KanbanHeader from './KanbanHeader';
import ProjectList from './ProjectList';
import UserList from './UserList';
import StatusBoard from './StatusBoard';
import UserBoard from './UserBoard';
import TaskForm from './TaskForm';
import TaskDetailEditDialog from './TaskDetailEditDialog';
import TaskDetailDialog from './TaskDetails/TaskDetailDialog';

// --- Dummy Data (Centralized for easy access by all components) ---
export const users = [
    { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 'user-2', name: 'Bob Williams', email: 'bob@example.com' },
    { id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 'user-4', name: 'Diana Prince', email: 'diana@example.com' },
    { id: 'user-5', name: 'Prince', email: 'Prince@example.com' },
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
    {
        id: 'task-303',
        projectId: 'project-3',
        title: 'Create Ad Copy',
        description: 'Write engaging ad copy for social media and search ads.',
        status: 'todo',
        assignedTo: 'user-5',
        dueDate: '2025-07-19',
    },
];
// --- End of Dummy Data ---


const Index = () => {
    const theme = useTheme();
    const [currentView, setCurrentView] = useState('status');
    const [tasks, setTasks] = useState(initialTasks);
    const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [taskToViewEdit, setTaskToViewEdit] = useState(null);
    const [openViewEditDialog, setOpenViewEditDialog] = useState(false);
    //   const [openViewEditDialog, setOpenViewEditDialog] = useState(false);

    const handleAddTask = (newTaskData) => {
        const newTaskId = `task-${Date.now()}`;
        const newTask = { id: newTaskId, ...newTaskData };
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const handleCloseViewEditDialog = () => {
        setOpenViewEditDialog(false);
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
        setOpenViewEditDialog(false);
        setTaskToViewEdit(null);
    };

    const handleDeleteTask = (taskId) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        setOpenViewEditDialog(false);
        setTaskToViewEdit(null);
    };

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

    const getFilteredTasks = () => {
        let filtered = tasks;

        filtered = filtered.filter(task => {
            if (!task.dueDate) return true;
            const taskDueDate = dayjs(task.dueDate);

            if (selectedStartDate && selectedEndDate) {
                return taskDueDate.isAfter(selectedStartDate.subtract(1, 'day'), 'day') && taskDueDate.isBefore(selectedEndDate.add(1, 'day'), 'day');
            } else if (selectedStartDate && !selectedEndDate) {
                return taskDueDate.isSame(selectedStartDate, 'day');
            } else if (!selectedStartDate && selectedEndDate) {
                return taskDueDate.isSame(selectedEndDate, 'day');
            }
            return true;
        });

        if (selectedProjectId) {
            filtered = filtered.filter(task => task.projectId === selectedProjectId);
        }

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

    const statusBoardTasks = selectedUserId
        ? displayedTasks.filter(task => task.assignedTo === selectedUserId)
        : displayedTasks;

    const userBoardTasks = displayedTasks;

    return (
        <div className="min-h-screen bg-gray-100 pb-10 dark:bg-gray-900 font-sans">
            {/* Pass state and functions to KanbanHeader */}
            <KanbanHeader
                currentView={currentView}
                setCurrentView={setCurrentView}
                handleOpenAddTaskDialog={handleOpenAddTaskDialog}
            />
            {/* This Box contained the old dropdown and Add New Task button. It has now been moved to the KanbanHeader component. */}


            <Container maxWidth="xl" sx={{ mt: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        height: 'calc(100vh - 150px)', // Set the height for the entire section
                    }}
                >
                    {/* Project List - Fixed Left Sidebar */}
                    <Box
                        sx={{
                            width: 80, // Fixed width
                            flexShrink: 0, // Prevent shrinking
                            overflowY: 'auto', // Add vertical scroll for the list
                            pb: 1,
                        }}
                    >
                        <ProjectList
                            projects={projects}
                            selectedProjectId={selectedProjectId}
                            onSelectProject={handleSelectProject}
                        />
                    </Box>

                    {/* Board Section - Middle, growing to fill space */}
                    <Box
                        sx={{
                            flexGrow: 1, // Allow this box to grow and fill the available space
                            minWidth: 400, // Boards usually wider
                            overflowX: 'auto', // Maintain horizontal scrolling for the board
                            pb: 1,
                            // Hide scrollbar on most browsers
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(0,0,0,0.3) transparent',
                            '&::-webkit-scrollbar': {
                                height: 6,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                borderRadius: 3,
                            },
                        }}
                    >
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
                    </Box>

                    {/* User List - Fixed Right Sidebar */}
                    <Box
                        sx={{
                            width: 80, // Fixed width
                            flexShrink: 0, // Prevent shrinking
                            overflowY: 'auto', // Add vertical scroll for the list
                            pb: 1,
                        }}
                    >
                        <UserList
                            users={users}
                            selectedUserId={selectedUserId}
                            onSelectUser={handleSelectUser}
                        />
                    </Box>
                </Box>
            </Container>

            {/* Add New Task Dialog */}
            <Dialog open={openAddTaskDialog} onClose={handleCloseAddTaskDialog} disableBackdropClick={false}>
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
                // <LocalizationProvider dateAdapter={AdapterDayjs}>
                //     <TaskDetailEditDialog
                //         open={openViewEditDialog}
                //         task={taskToViewEdit}
                //         users={users}
                //         projects={projects}
                //         onUpdateTask={handleUpdateTask}
                //         onDeleteTask={handleDeleteTask}
                //         onClose={handleCloseViewEditDialog}
                //     // onClose={() => setOpenViewEditDialog(false)}
                //     />




                // </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TaskDetailDialog // Changed from TaskDetailEditDialog to TaskDetailDialog
                        task={taskToViewEdit}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        onClose={() => setOpenViewEditDialog(false)}
                    />
                </LocalizationProvider>
            )}
        </div>
    );
};

export default Index;