// src/views/TicketBoard/UserBoard.jsx
import React, { useState } from 'react';
import {
    Typography,
    Paper,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TicketCard from './TicketCard';

const STATUS_OPTIONS = ['All', 'Open', 'Escalated', 'In Progress', 'Closed'];

const UserBoard = ({ users, tickets, selectedUserId }) => {
    const [statusFilter, setStatusFilter] = useState({});

    const getUserTickets = (userId) =>
        tickets.filter((t) => t.assignedTo?._id === userId);

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 3,
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                justifyContent: { xs: 'center', md: 'flex-start' },
                px: 2,
                py: 1,
                overflowX: { xs: 'auto', md: 'visible' },
            }}
            role="list"
            aria-label="User tickets board"
        >
            {users.map((user) => {
                const userTicketsRaw = getUserTickets(user._id);
                const userTickets = userTicketsRaw.filter((t) =>
                    !statusFilter[user._id] || statusFilter[user._id] === 'All'
                        ? true
                        : t.status === statusFilter[user._id]
                );

                const isDimmed = selectedUserId && selectedUserId !== user._id;

                return (
                    <Droppable droppableId={user._id} key={user._id}>
                        {(provided) => (
                            <Box
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                sx={{
                                    width: { xs: '90vw', sm: 320, md: 320 },
                                    flexShrink: 0,
                                    opacity: isDimmed ? 0.35 : 1,
                                    filter: isDimmed ? 'grayscale(0.8)' : 'none',
                                    transition: 'opacity 0.3s, filter 0.3s',
                                    maxHeight: '85vh',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                                role="listitem"
                                aria-label={`Tickets assigned to ${user.firstName} ${user.lastName}`}
                            >
                                <Paper
                                    elevation={4}
                                    sx={{
                                        p: 2,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)',
                                    }}
                                >
                                    {/* Header with user info & ticket count */}
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mb={1}
                                    >
                                        <Typography
                                            variant="h6"
                                            component="h2"
                                            sx={{ fontWeight: '700', userSelect: 'none' }}
                                            title={`${user.firstName} ${user.lastName}`}
                                        >
                                            {user.firstName} {user.lastName}
                                        </Typography>

                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                bgcolor: 'primary.light',
                                                color: 'primary.white',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 2,
                                                fontWeight: '600',
                                                userSelect: 'none',
                                                minWidth: 32,
                                                textAlign: 'center',
                                                boxShadow: '0 1px 4px rgb(0 0 0 / 0.15)',
                                            }}
                                            aria-label={`${userTickets.length} tickets`}
                                        >
                                            {userTickets.length}
                                        </Typography>
                                    </Stack>

                                    {/* Status filter */}
                                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                        <InputLabel id={`status-filter-label-${user._id}`}>
                                            Filter by Status
                                        </InputLabel>
                                        <Select
                                            labelId={`status-filter-label-${user._id}`}
                                            id={`status-filter-${user._id}`}
                                            label="Filter by Status"
                                            value={statusFilter[user._id] || 'All'}
                                            onChange={(e) =>
                                                setStatusFilter((prev) => ({
                                                    ...prev,
                                                    [user._id]: e.target.value,
                                                }))
                                            }
                                            aria-haspopup="listbox"
                                            aria-expanded="false"
                                        >
                                            {STATUS_OPTIONS.map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {/* Tickets container */}
                                    <Box
                                        sx={{
                                            flexGrow: 1,
                                            overflowY: 'auto',
                                            pr: 1,
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: 'rgba(0,0,0,0.2) transparent',
                                            '&::-webkit-scrollbar': {
                                                width: 6,
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: 'rgba(0,0,0,0.15)',
                                                borderRadius: 3,
                                            },
                                        }}
                                        aria-label={`Ticket list for ${user.firstName} ${user.lastName}`}
                                    >
                                        {userTickets.length === 0 ? (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                align="center"
                                                sx={{ mt: 3, fontStyle: 'italic' }}
                                            >
                                                No tickets to display.
                                            </Typography>
                                        ) : (
                                            userTickets.map((ticket, index) => (
                                                <Draggable
                                                    key={ticket._id}
                                                    draggableId={ticket._id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <Box
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            sx={{
                                                                mb: 2,
                                                                boxShadow: snapshot.isDragging
                                                                    ? '0 0 12px rgba(0, 123, 255, 0.5)'
                                                                    : 'none',
                                                                borderRadius: 2,
                                                                transition: 'box-shadow 0.2s',
                                                                cursor: 'grab',
                                                                userSelect: 'none',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                backgroundColor: snapshot.isDragging
                                                                    ? 'background.paper'
                                                                    : 'transparent',
                                                            }}
                                                            aria-roledescription="Draggable ticket"
                                                        >
                                                            {/* Drag handle icon for affordance */}
                                                            {/* <Tooltip title="Drag to reorder">
                                                                <IconButton
                                                                    size="small"
                                                                    {...provided.dragHandleProps}
                                                                    sx={{
                                                                        mr: 1,
                                                                        cursor: 'grab',
                                                                        color: 'text.secondary',
                                                                        '&:hover': { color: 'primary.main' },
                                                                        userSelect: 'none',
                                                                    }}
                                                                    aria-label="Drag ticket"
                                                                >
                                                                    <DragIndicatorIcon />
                                                                </IconButton>
                                                            </Tooltip> */}

                                                            <TicketCard ticket={ticket} />
                                                        </Box>
                                                    )}
                                                </Draggable>
                                            ))
                                        )}

                                        {provided.placeholder}
                                    </Box>
                                </Paper>
                            </Box>
                        )}
                    </Droppable>
                );
            })}
        </Box>
    );
};

export default UserBoard;
