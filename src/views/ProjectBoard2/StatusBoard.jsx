// ProjectBoard/StatusBoard.jsx
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Import dummy data and helper functions as needed
import { initialTasks } from './Index'; // Assuming initialTasks data is imported here
import TaskCard from './TaskCard'; 
import { users, projects } from './Index';

// Helper to get project name by ID
const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
};

const StatusBoard = ({ selectedStatus, onSelectStatus }) => {
    const theme = useTheme();

    // Get unique status values from initialTasks
    const statusList = Array.from(new Set(initialTasks.map(task => task.status)));

    return (
        <Paper
            elevation={4}
            sx={{
                p: 4,
                height: '100%',
                backgroundColor: theme.palette.background.paper,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
            }}
            role="list"
            aria-label="Status Board"
        >
            <Typography
                variant="h6"
                component="h2"
                sx={{
                    mb: 4,
                    fontWeight: 'bold',
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    pb: 1,
                    color: theme.palette.text.primary,
                }}
            >
                Task Status
            </Typography>

            <Grid container spacing={3} flexGrow={1} sx={{ overflowY: 'auto' }}>
                {statusList.map((status) => {
                    // Count initialTasks for this status
                    const count = initialTasks.filter(task => task.status === status).length;

                    const isSelected = selectedStatus === status;

                    return (
                        <Grid item xs={12} sm={6} md={4} key={status}>
                            <Paper
                                onClick={() => onSelectStatus(status)}
                                role="listitem"
                                aria-selected={isSelected}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        onSelectStatus(status);
                                    }
                                }}
                                sx={{
                                    cursor: 'pointer',
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: isSelected
                                        ? `0 0 10px ${theme.palette.primary.main}`
                                        : theme.shadows[1],
                                    border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
                                    backgroundColor: isSelected
                                        ? theme.palette.action.selected
                                        : theme.palette.background.default,
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        boxShadow: `0 0 10px ${theme.palette.primary.light}`,
                                    },
                                    outline: 'none',
                                    '&:focus-visible': {
                                        outline: `2px solid ${theme.palette.primary.main}`,
                                        outlineOffset: 2,
                                    },
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: isSelected
                                            ? theme.palette.primary.main
                                            : theme.palette.text.primary,
                                    }}
                                >
                                    {status}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    {count} {count === 1 ? 'task' : 'initialTasks'}
                                </Typography>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Paper>
    );
};

export default StatusBoard;
