// ProjectBoard/UserList.jsx
import React from 'react';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { blue, grey, purple } from '@mui/material/colors';

import { users } from './Index'; // Dummy data import

const UserList = ({ selectedUserId, onSelectUser }) => {
    const theme = useTheme();

    const textColor = theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[900];
    const secondaryTextColor =
        theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary;

    return (
        <Paper
            elevation={4}
            sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'common.white',
                borderRadius: 3,
                boxShadow: theme.shadows[6],
                transition: 'box-shadow 0.3s ease',
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    borderBottom: `2px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300]
                        }`,
                    pb: 1,
                    color: textColor,
                    userSelect: 'none',
                }}
            >
                Users
            </Typography>

            <List
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${theme.palette.grey[500]} transparent`,
                    '&::-webkit-scrollbar': {
                        width: 6,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.grey[500],
                        borderRadius: 3,
                    },
                }}
            >
                {/* All Users option */}
                <ListItem
                    button
                    onClick={() => onSelectUser(null)}
                    selected={selectedUserId === null}
                    sx={{
                        borderRadius: 2,
                        mb: 1.5,
                        transition: 'all 0.25s ease',
                        boxShadow: selectedUserId === null ? `0 0 8px ${blue[300]}` : 'none',
                        bgcolor: selectedUserId === null ? blue[50] : 'transparent',
                        borderLeft: selectedUserId === null ? `5px solid ${blue[600]}` : 'none',
                        '&:hover': {
                            bgcolor: selectedUserId === null ? blue[100] : theme.palette.action.hover,
                            transform: 'translateX(4px)',
                        },
                        '&.Mui-focusVisible': {
                            outline: `2px solid ${blue[400]}`,
                            outlineOffset: 2,
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 48 }}>
                        <Avatar sx={{ bgcolor: grey[600], fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                            ALL
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText
                        primary="All Users"
                        primaryTypographyProps={{
                            color: selectedUserId === null ? blue[800] : textColor,
                            fontWeight: selectedUserId === null ? 600 : 400,
                        }}
                    />
                </ListItem>

                {/* Individual users */}
                {users.map((user) => (
                    <Tooltip key={user.id} title={user.name} arrow>
                        <ListItem
                            button
                            onClick={() => onSelectUser(user.id)}
                            selected={selectedUserId === user.id}
                            sx={{
                                borderRadius: 2,
                                mb: 1.5,
                                transition: 'all 0.25s ease',
                                boxShadow:
                                    selectedUserId === user.id ? `0 0 8px ${purple[300]}` : 'none',
                                bgcolor: selectedUserId === user.id ? purple[50] : 'transparent',
                                borderLeft:
                                    selectedUserId === user.id ? `5px solid ${purple[600]}` : 'none',
                                '&:hover': {
                                    bgcolor: selectedUserId === user.id
                                        ? purple[100]
                                        : theme.palette.action.hover,
                                    transform: 'translateX(4px)',
                                },
                                '&.Mui-focusVisible': {
                                    outline: `2px solid ${purple[400]}`,
                                    outlineOffset: 2,
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 48 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: purple[500],
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: 'white',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {user.name.charAt(0)}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText
                                primary={user.name}
                                secondary={user.email}
                                primaryTypographyProps={{
                                    color: selectedUserId === user.id ? purple[800] : textColor,
                                    fontWeight: selectedUserId === user.id ? 600 : 400,
                                }}
                                secondaryTypographyProps={{
                                    color: selectedUserId === user.id ? purple[600] : secondaryTextColor,
                                }}
                            />
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Paper>
    );
};

export default UserList;
