// ProjectBoard/UserBoard.jsx
import React from 'react';
import {
    Box, Typography, Paper, Avatar, Tooltip // Added Paper, Avatar, Tooltip for better styling within columns
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Import helper functions and TaskCard
import { users, projects } from './Index'; // Import dummy data from main index
import TaskCard from './TaskCard'; // Make sure to import TaskCard


// Helper function to get user name by ID (re-exported or imported as needed)
const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
};

// Helper function to get project name by ID (re-exported or imported as needed)
const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
};


const UserBoard = ({ tasks, selectedUserId, onDragEnd, onTaskClick }) => {
    const theme = useTheme();

    return (
        <Box className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-full dark:bg-gray-900 rounded-xl flex flex-col">
            <Typography variant="h4" className="font-bold mb-6 text-center text-gray-800 dark:text-white">
                Task Board by Assigned User
            </Typography>
            <DragDropContext onDragEnd={onDragEnd}>
                {/* Main container for the user columns, enabling horizontal scroll */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2, // Space between columns
                        overflowX: 'auto', // Enable horizontal scrolling
                        flexGrow: 1, // Allow this box to grow and fill available height
                        pb: 1, // Padding at the bottom for scrollbar visual separation

                        // Custom scrollbar styling
                        scrollbarWidth: 'thin',
                        scrollbarColor: `${theme.palette.primary.light} ${theme.palette.background.paper}`,
                        '&::-webkit-scrollbar': {
                            height: 8,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 4,
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 4,
                        },
                    }}
                >
                    {users.map((user) => (
                        <Droppable droppableId={user.id} key={user.id}>
                            {(provided, snapshot) => (
                                <Box
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{
                                        // Fixed width for each user column
                                        width: 300,
                                        minWidth: 300, // Important to prevent shrinking
                                        flexShrink: 0, // Prevent column from shrinking
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1.5,
                                        p: 2,
                                        borderRadius: 2,
                                        boxShadow: theme.shadows[3],
                                        backgroundColor: snapshot.isDraggingOver ? (theme.palette.mode === 'dark' ? '#a78bfa33' : '#ede7f6') : theme.palette.background.paper,
                                        transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        border: `1px solid ${theme.palette.divider}`,
                                    }}
                                >
                                    {/* User header with Avatar */}
                                    <Paper elevation={1} sx={{
                                        p: 1.5,
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        backgroundColor: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.100',
                                        borderRadius: 1,
                                    }}>
                                        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 30, height: 30, fontSize: '0.9rem' }}>
                                            {user.name.charAt(0)}
                                        </Avatar>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                                            {user.name}
                                            <span className="ml-2 text-sm font-normal opacity-75">
                                                ({tasks.filter(t => t.assignedTo === user.id).length})
                                            </span>
                                        </Typography>
                                    </Paper>


                                    <Box
                                        className="flex-grow overflow-y-auto pr-2"
                                        sx={{
                                            // Individual column scrollbar styling
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: `${theme.palette.grey[400]} transparent`,
                                            '&::-webkit-scrollbar': {
                                                width: 6,
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: theme.palette.grey[400],
                                                borderRadius: 3,
                                            },
                                        }}
                                    >
                                        {tasks
                                            .filter((task) => task.assignedTo === user.id)
                                            .map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                opacity: snapshot.isDragging ? 0.8 : 1,
                                                                transition: 'opacity 0.2s ease',
                                                                // marginBottom: theme.spacing(1.5), // Space between task cards
                                                            }}
                                                        >
                                                            <TaskCard
                                                                task={task}
                                                                index={index}
                                                                isBlurred={selectedUserId && task.assignedTo !== selectedUserId}
                                                                onClick={onTaskClick}
                                                                // Pass full users and projects arrays for TaskCard to resolve names
                                                                users={users}
                                                                projects={projects}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                        {tasks.filter((task) => task.assignedTo === user.id).length === 0 && !snapshot.isDraggingOver && (
                                            <Typography variant="body2" color="text.secondary" className="text-center py-4 dark:text-gray-400">
                                                No tasks assigned to {user.name}.
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Droppable>
                    ))}
                </Box>
            </DragDropContext>
        </Box>
    );
};

export default UserBoard;