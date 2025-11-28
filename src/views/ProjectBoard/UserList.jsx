import React from 'react';
import {
    Paper,
    Tooltip,
    IconButton,
    Avatar,
    Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { blue, grey, purple } from '@mui/material/colors';

import { users } from './Index';

const UserList = ({ selectedUserId, onSelectUser }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={4}
            sx={{
                p: 2,
                height: '100%',
                maxHeight: 'calc(100vh - 150px)', // adjust as needed
                overflowY: 'auto',
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    mb: 2,
                    fontWeight: 'normal',
                    fontSize: '1rem',
                    color: theme.palette.text.primary,
                }}
            >
                Users
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    width: '100%',
                    alignItems: 'center',
                }}
            >
                {/* All Users */}
                <Tooltip title="All Users" arrow>
                    <IconButton
                        onClick={() => onSelectUser(null)}
                        aria-label="All Users"
                        size="large"
                        sx={{
                            borderRadius: '12px',
                            border:
                                selectedUserId === null
                                    ? `3px solid ${blue[600]}`
                                    : '3px solid transparent',
                            bgcolor:
                                selectedUserId === null
                                    ? blue[100]
                                    : 'transparent',
                            '&:hover': {
                                bgcolor: blue[50],
                                borderColor: blue[400],
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: grey[500],
                                color: 'white',
                                fontSize: '1rem',
                                width: 48,
                                height: 48,
                            }}
                        >
                            ALL
                        </Avatar>
                    </IconButton>
                </Tooltip>

                {/* Users */}
                {users.map((user) => (
                    <Tooltip key={user.id} title={`${user.name} — ${user.email}`} arrow>
                        <IconButton
                            onClick={() => onSelectUser(user.id)}
                            aria-label={user.name}
                            size="large"
                            sx={{
                                borderRadius: '12px',
                                border:
                                    selectedUserId === user.id
                                        ? `3px solid ${purple[600]}`
                                        : '3px solid transparent',
                                bgcolor:
                                    selectedUserId === user.id
                                        ? purple[100]
                                        : 'transparent',
                                '&:hover': {
                                    bgcolor: purple[50],
                                    borderColor: purple[400],
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: purple[500],
                                    color: 'white',
                                    fontSize: '1.25rem',
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                ))}
            </Box>
        </Paper>
    );
};

export default UserList;
