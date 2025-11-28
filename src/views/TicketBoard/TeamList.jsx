import React, { useMemo } from 'react';
import {
    List,
    ListItemButton,
    ListItemText,
    Typography,
    Divider,
    Box,
    Avatar,
    Chip,
    Stack,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { deepPurple, deepOrange, teal } from '@mui/material/colors';

const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % 3;
    const colors = [deepPurple[500], deepOrange[500], teal[500]];
    return colors[index];
};

const TeamList = ({ users, allTickets, selectedUserId, onSelectUser }) => {
    const totalTickets = useMemo(() => allTickets.length, [allTickets]);

    const getTicketCount = (userId) =>
        allTickets.filter((t) => t.assignedTo?._id === userId).length;

    return (
        <Box
            sx={{
                maxWidth: 240,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 2,
                overflowY: 'auto',
                height: '100%',
            }}
        >
            <Typography
                variant="subtitle1"
                sx={{ p: 2, fontWeight: 'bold', color: 'primary.main', fontSize: '1rem' }}
            >
                Team Members
            </Typography>

            <List disablePadding>
                <ListItemButton
                    selected={selectedUserId === null}
                    onClick={() => onSelectUser(null)}
                    sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        mb: 0.5,
                        bgcolor: selectedUserId === null ? 'primary.light' : 'transparent',
                        '&:hover': {
                            bgcolor: selectedUserId === null ? 'primary.light' : 'action.hover',
                        },
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 32,
                                height: 32,
                                fontSize: 16,
                            }}
                        >
                            <GroupIcon fontSize="small" />
                        </Avatar>

                        <ListItemText
                            primary={
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        color: selectedUserId === null ? 'primary.dark' : 'text.primary',
                                    }}
                                >
                                    All
                                </Typography>
                            }
                        />

                        <Chip
                            label={totalTickets}
                            color="primary"
                            size="small"
                            sx={{ minWidth: 24, fontSize: '0.75rem' }}
                        />
                    </Stack>
                </ListItemButton>

                <Divider sx={{ my: 1 }} />

                {users.map((user) => {
                    const isSelected = selectedUserId === user._id;
                    const ticketCount = getTicketCount(user._id);
                    const avatarColor = stringToColor(user.firstName + user.lastName);

                    return (
                        <ListItemButton
                            key={user._id}
                            selected={isSelected}
                            onClick={() => onSelectUser(user._id)}
                            sx={{
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                mb: 0.5,
                                bgcolor: isSelected ? 'secondary.light' : 'transparent',
                                '&:hover': {
                                    bgcolor: isSelected ? 'secondary.light' : 'action.hover',
                                },
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                                <Avatar
                                    sx={{
                                        bgcolor: avatarColor,
                                        width: 32,
                                        height: 32,
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                    }}
                                >
                                    {user.firstName?.[0]?.toUpperCase() || ''}
                                    {user.lastName?.[0]?.toUpperCase() || ''}
                                </Avatar>

                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: isSelected ? '600' : '500' }}
                                        >
                                            {user.firstName} {user.lastName}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {ticketCount} ticket{ticketCount !== 1 ? 's' : ''}
                                        </Typography>
                                    }
                                />

                                <Chip
                                    label={ticketCount}
                                    color={ticketCount === 0 ? 'default' : 'secondary'}
                                    size="small"
                                    sx={{ minWidth: 24, fontSize: '0.75rem' }}
                                />
                            </Stack>
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
    );
};

export default TeamList;
