// ProjectBoard/TaskCard.jsx
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    useTheme,
    Tooltip
} from '@mui/material';

const TaskCard = ({
    task,
    index,
    isBlurred = false,
    onClick,
    getUserName,
    getProjectName
}) => {
    const theme = useTheme();

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(task)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onClick(task);
                        }
                    }}
                    sx={{
                        mb: 2,
                        cursor: 'pointer',
                        opacity: isBlurred ? 0.5 : 1,
                        userSelect: 'none',
                        backgroundColor: snapshot.isDragging
                            ? theme.palette.action.selected
                            : theme.palette.background.paper,
                        boxShadow: snapshot.isDragging
                            ? theme.shadows[6]
                            : theme.shadows[1],
                        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                        borderRadius: 2,
                        outline: 'none',
                        '&:focus-visible': {
                            outline: `2px solid ${theme.palette.primary.main}`,
                            outlineOffset: 2,
                        }
                    }}
                    role="button"
                    aria-pressed="false"
                    aria-label={`Task: ${task.title}, assigned to ${getUserName(task.assignedTo)}, project: ${getProjectName(task.projectId)}`}
                >
                    <CardContent sx={{ p: 2 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="600"
                            noWrap
                            sx={{ mb: 1 }}
                            title={task.title}
                        >
                            {task.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                            <Tooltip title={`Assigned to ${getUserName(task.assignedTo)}`}>
                                <Chip
                                    label={getUserName(task.assignedTo)}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            </Tooltip>
                            <Tooltip title={`Project: ${getProjectName(task.projectId)}`}>
                                <Chip
                                    label={getProjectName(task.projectId)}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                />
                            </Tooltip>
                            <Chip
                                label={task.status}
                                size="small"
                                sx={{
                                    bgcolor: (theme) => {
                                        switch (task.status.toLowerCase()) {
                                            case 'completed':
                                                return theme.palette.success.light;
                                            case 'in progress':
                                                return theme.palette.info.light;
                                            case 'pending':
                                                return theme.palette.warning.light;
                                            default:
                                                return theme.palette.grey[300];
                                        }
                                    },
                                    color: (theme) => theme.palette.getContrastText(theme.palette.background.paper)
                                }}
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                            {task.description || 'No description provided.'}
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Draggable>
    );
};

export default TaskCard;
