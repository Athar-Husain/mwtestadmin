// ProjectBoard/TaskCard.jsx
import React, { useMemo } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Draggable } from '@hello-pangea/dnd';
import { users, projects } from './Index'; // Assuming dummy data is in Index.jsx

const TaskCard = ({ task, index, isBlurred = false, onClick }) => {
    const theme = useTheme();

    const isDark = theme.palette.mode === 'dark';

    // UseMemo avoids recalculating on every render
    const assignedUser = useMemo(() => {
        return users.find((u) => u.id === task.assignedTo)?.name || 'Unassigned';
    }, [task.assignedTo]);

    const projectName = useMemo(() => {
        return projects.find((p) => p.id === task.projectId)?.name || 'Unknown Project';
    }, [task.projectId]);

    // Status-based color styling
    const getStatusChipStyle = (status) => {
        const base = {
            textTransform: 'capitalize',
            fontWeight: 500,
        };

        switch (status) {
            case 'todo':
                return {
                    ...base,
                    bgcolor: isDark ? 'grey.700' : 'grey.200',
                    color: isDark ? 'grey.200' : 'grey.800',
                };
            case 'in-progress':
                return {
                    ...base,
                    bgcolor: isDark ? 'info.dark' : 'info.light',
                    color: isDark ? 'info.light' : 'info.dark',
                };
            case 'completed':
                return {
                    ...base,
                    bgcolor: isDark ? 'success.dark' : 'success.light',
                    color: isDark ? 'success.light' : 'success.dark',
                };
            default:
                return base;
        }
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(task)}
                    role="button"
                    aria-label={`Task: ${task.title}`}
                    tabIndex={0}
                    sx={{
                        mt: 2,
                        mb: 2,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        boxShadow: snapshot.isDragging ? 6 : 2,
                        bgcolor: isBlurred
                            ? isDark
                                ? 'grey.800'
                                : 'grey.100'
                            : snapshot.isDragging
                                ? 'primary.light'
                                : isDark
                                    ? 'grey.900'
                                    : 'background.paper',
                        color: isDark ? 'grey.100' : 'text.primary',
                        filter: isBlurred ? 'blur(2px)' : 'none',
                        opacity: isBlurred ? 0.5 : 1,
                        '&:hover': {
                            transform: isBlurred ? 'none' : 'scale(1.01)',
                            boxShadow: isBlurred ? 2 : 4,
                        },
                        '&:focus': {
                            outline: '2px solid',
                            outlineColor: 'primary.main',
                        },
                        ...provided.draggableProps.style,
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
                            {task.title}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        >
                            {task.description}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                                label={task.status.replace('-', ' ')}
                                size="small"
                                sx={getStatusChipStyle(task.status)}
                            />

                            <Chip
                                label={`Assigned: ${assignedUser}`}
                                size="small"
                                variant="outlined"
                                color="primary"
                            />

                            <Chip
                                label={`Project: ${projectName}`}
                                size="small"
                                variant="outlined"
                                color="secondary"
                            />

                            {task.dueDate && (
                                <Chip
                                    label={`Due: ${task.dueDate}`}
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    sx={{
                                        bgcolor: isDark ? 'error.dark' : 'error.lighter',
                                        color: isDark ? 'error.light' : 'error.main',
                                    }}
                                />
                            )}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Draggable>
    );
};

export default TaskCard;
