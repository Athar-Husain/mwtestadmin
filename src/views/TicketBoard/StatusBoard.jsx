// src/views/TicketBoard/StatusBoard.jsx
import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Paper, Box, Typography, useTheme } from '@mui/material';
import TicketCard from './TicketCard';

const getBackgroundColor = (status, theme) => {
    switch (status) {
        case 'Open':
            return theme.palette.mode === 'dark' ? '#4a148c' : '#f3e5f5';
        case 'In Progress':
            return theme.palette.mode === 'dark' ? '#01579b' : '#e3f2fd';
        case 'Escalated':
            return theme.palette.mode === 'dark' ? '#bf360c' : '#fbe9e7';
        case 'Closed':
            return theme.palette.mode === 'dark' ? '#1b5e20' : '#e8f5e9';
        default:
            return theme.palette.mode === 'dark' ? '#424242' : '#fafafa';
    }
};

const StatusBoard = ({ tickets, statuses }) => {
    const theme = useTheme();

    // Group tickets by status, memoized for performance (optional)
    const ticketsByStatus = React.useMemo(() => {
        return statuses.reduce((acc, status) => {
            acc[status] = tickets.filter(ticket => ticket.status === status);
            return acc;
        }, {});
    }, [tickets, statuses]);

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                height: 'calc(100% - 60px)',
                overflowX: 'auto', // horizontal scroll for smaller viewports
                p: 1,
            }}
            aria-label="Status board with tickets grouped by status"
        >
            {statuses.map((status, index) => (
                <Droppable key={status} droppableId={status}>
                    {(provided, snapshot) => {
                        const isDraggingOver = snapshot.isDraggingOver;
                        return (
                            <Paper
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                elevation={isDraggingOver ? 8 : 3} // Elevate when dragging over
                                sx={{
                                    width: 280,
                                    p: 2,
                                    bgcolor: getBackgroundColor(status, theme),
                                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                                    flexShrink: 0,
                                    minHeight: '80vh',
                                    maxHeight: '100%',
                                    overflowY: 'auto',
                                    borderRadius: 2,
                                    boxShadow: isDraggingOver
                                        ? `0 4px 12px ${theme.palette.primary.main}88`
                                        : undefined,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                                aria-label={`${status} tickets column`}
                            >
                                <Typography
                                    variant="h6"
                                    align="center"
                                    gutterBottom
                                    sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 2 }}
                                >
                                    {status}
                                </Typography>

                                {/* Tickets list */}
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        overflowY: 'auto',
                                        minHeight: 50,
                                    }}
                                >
                                    {ticketsByStatus[status].length === 0 && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            align="center"
                                            sx={{ fontStyle: 'italic', mt: 1 }}
                                        >
                                            No tickets
                                        </Typography>
                                    )}

                                    {ticketsByStatus[status].map((ticket, idx) => (
                                        <Draggable
                                            key={ticket._id}
                                            draggableId={ticket._id}
                                            index={idx}
                                        >
                                            {(provided, snapshot) => (
                                                <Box
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    sx={{
                                                        mb: 2,
                                                        opacity: snapshot.isDragging ? 0.8 : 1,
                                                        transition: 'opacity 0.2s ease',
                                                    }}
                                                    aria-roledescription="Draggable ticket"
                                                >
                                                    <TicketCard ticket={ticket} />
                                                </Box>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Box>
                            </Paper>
                        );
                    }}
                </Droppable>
            ))}
        </Box>
    );
};

export default StatusBoard;
