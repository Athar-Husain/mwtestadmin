// ProjectBoard/UserBoard.jsx
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import { users, projects } from './Index'; // Dummy data import
import TaskCard from './TaskCard';

// Helper functions to get user and project names by ID
const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Unassigned';
};

const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : 'Unknown Project';
};

const UserBoard = ({ tasks, selectedUserId, onDragEnd, onTaskClick }) => {
    const theme = useTheme();

    return (
        <Box
            className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 rounded-xl min-h-screen"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    mb: 4,
                    textAlign: 'center',
                    color: theme.palette.mode === 'dark' ? 'common.white' : 'text.primary',
                }}
            >
                Task Board by Assigned User
            </Typography>

            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={4} justifyContent="center">
                    {users.map((user) => (
                        <Grid item xs={12} sm={6} md={3} key={user.id}>
                            <Box
                                sx={{
                                    bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'common.white',
                                    borderRadius: 2,
                                    boxShadow: theme.shadows[4],
                                    p: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 2,
                                        pb: 1,
                                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                                        color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark',
                                    }}
                                >
                                    {user.name}
                                    <Typography
                                        component="span"
                                        sx={{
                                            ml: 1,
                                            fontSize: '0.875rem',
                                            fontWeight: 400,
                                            color: theme.palette.text.secondary,
                                        }}
                                    >
                                        ({tasks.filter((t) => t.assignedTo === user.id).length})
                                    </Typography>
                                </Typography>

                                <Droppable droppableId={user.id}>
                                    {(provided, snapshot) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            sx={{
                                                flexGrow: 1,
                                                overflowY: 'auto',
                                                pr: 1,
                                                minHeight: 120,
                                                bgcolor: snapshot.isDraggingOver
                                                    ? theme.palette.mode === 'dark'
                                                        ? 'primary.dark'
                                                        : 'primary.lighter'
                                                    : 'transparent',
                                                borderRadius: 1,
                                                transition: 'background-color 0.2s ease-in-out',
                                                '&:focus-visible': {
                                                    outline: `2px solid ${theme.palette.primary.main}`,
                                                    outlineOffset: 2,
                                                },
                                            }}
                                            tabIndex={0} // for keyboard focus
                                            aria-label={`Tasks assigned to ${user.name}`}
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
                                                        getUserName={getUserName}
                                                        getProjectName={getProjectName}
                                                    />
                                                ))}

                                            {provided.placeholder}

                                            {tasks.filter((task) => task.assignedTo === user.id).length === 0 &&
                                                !snapshot.isDraggingOver && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ textAlign: 'center', py: 3, userSelect: 'none' }}
                                                    >
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

export default UserBoard;
