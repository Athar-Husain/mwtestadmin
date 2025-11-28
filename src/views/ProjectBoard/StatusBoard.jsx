import React from 'react';
import {
    Box,
    Typography,
    Grid,
    useTheme,
    Paper, // Added Paper for a cleaner look
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const statusColors = {
    todo: {
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-400 dark:border-gray-600',
        dragOverBg: (theme) => theme.palette.mode === 'dark' ? 'rgba(156, 163, 175, 0.2)' : '#e5e7eb',
    },
    'in-progress': {
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-400 dark:border-blue-600',
        dragOverBg: (theme) => theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : '#e2f3ff',
    },
    completed: {
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-400 dark:border-green-600',
        dragOverBg: (theme) => theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.2)' : '#e8f5e9',
    },
};

const statusLabels = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    completed: 'Completed',
};

const StatusBoard = ({ tasks, onDragEnd, onTaskClick }) => {
    const theme = useTheme();

    const tasksByStatus = React.useMemo(() => {
        const map = { todo: [], 'in-progress': [], completed: [] };
        tasks.forEach(task => {
            if (map[task.status]) map[task.status].push(task);
        });
        return map;
    }, [tasks]);

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3, lg: 4 },
                bgcolor: 'background.default',
                minHeight: '100%',
                borderRadius: 2,
            }}
            component="main"
            aria-label="Project Task Board by Status"
        >
            <Typography variant="h4" component="h1" className="font-bold mb-6 text-center text-gray-800 dark:text-white">
                Task Board by Status
            </Typography>

            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={4} justifyContent="center" role="list">
                    {Object.keys(statusLabels).map((status) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={status}>
                            <Paper
                                component="section"
                                elevation={4}
                                aria-labelledby={`status-${status}-label`}
                                sx={{
                                    p: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    bgcolor: 'background.paper',
                                    borderRadius: 3,
                                    transition: 'box-shadow 0.3s ease-in-out',
                                    '&:hover': {
                                        boxShadow: theme.shadows[8],
                                    },
                                    outlineOffset: '4px',
                                    '&:focus-visible': {
                                        outline: `2px solid ${theme.palette.primary.main}`,
                                    },
                                }}
                            >
                                <Typography
                                    id={`status-${status}-label`}
                                    variant="h5"
                                    sx={{
                                        fontWeight: 'bold',
                                        mb: 2,
                                        pb: 1,
                                        borderBottom: `2px solid`,
                                        borderColor: status === 'todo'
                                            ? theme.palette.grey[400]
                                            : status === 'in-progress'
                                                ? theme.palette.info.main
                                                : theme.palette.success.main,
                                        color: status === 'todo'
                                            ? theme.palette.grey[700]
                                            : status === 'in-progress'
                                                ? theme.palette.info.main
                                                : theme.palette.success.main,
                                    }}
                                >
                                    {statusLabels[status]}
                                    <span className="ml-2 text-sm font-normal opacity-75">
                                        ({tasksByStatus[status].length})
                                    </span>
                                </Typography>

                                <Droppable droppableId={status}>
                                    {(provided, snapshot) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            role="list"
                                            aria-live="polite"
                                            sx={{
                                                flexGrow: 1,
                                                overflowY: 'auto',
                                                p: 1,
                                                minHeight: '200px',
                                                transition: 'background-color 0.2s ease-in-out',
                                                bgcolor: snapshot.isDraggingOver
                                                    ? statusColors[status].dragOverBg(theme)
                                                    : 'transparent',
                                                borderRadius: 2,
                                                scrollbarWidth: 'thin',
                                                scrollbarColor: `${theme.palette.primary.light} transparent`,
                                                '&::-webkit-scrollbar': {
                                                    width: 8,
                                                },
                                                '&::-webkit-scrollbar-thumb': {
                                                    backgroundColor: theme.palette.primary.main,
                                                    borderRadius: 4,
                                                },
                                            }}
                                        >
                                            {tasksByStatus[status].length === 0 && !snapshot.isDraggingOver ? (
                                                <Typography variant="body2" color="text.secondary" className="text-center py-4">
                                                    No tasks in this column.
                                                </Typography>
                                            ) : (
                                                tasksByStatus[status].map((task, index) => (
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
                                                                    // position: 'relative',  // Ensure that it is positioned relative to its container
                                                                    zIndex: snapshot.isDragging ? 999 : 'auto', // Increase z-index while dragging to bring to the front
                                                                }}
                                                            >
                                                                <TaskCard task={task} index={index} onClick={onTaskClick} />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            )}
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </DragDropContext>
        </Box>
    );
};

export default StatusBoard;