// src/components/ProjectBoard/KanbanHeader.jsx
import React from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Divider, Badge, Avatar, Tooltip, Box,
    Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    Menu as MenuIcon, Notifications as NotificationsIcon, CheckCircle as CheckCircleIcon,
    People as UsersIcon, ViewModule as BoardIcon, Help as QuestionMarkIcon,
    ArrowDropDown as ArrowDropDownIcon, TimerOutlined as TimerIcon, Add as AddIcon
} from '@mui/icons-material';

const KanbanHeader = ({ currentView, setCurrentView, handleOpenAddTaskDialog }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationsOpen, setNotificationsOpen] = React.useState(false);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationsClick = () => {
        console.log('Notifications clicked!');
        setNotificationsOpen((prev) => !prev);
    };

    const commonIconSx = {
        color: theme.palette.text.secondary,
        '&:hover': { backgroundColor: theme.palette.action.hover },
    };

    return (
        <AppBar position="sticky" color="default" elevation={3}>
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    px: { xs: 2, sm: 4 },
                    py: 1.5,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                {/* Left Section */}
                <Box display="flex" alignItems="center" gap={2}>
                    <Tooltip title="Main Menu">
                        <IconButton
                            onClick={handleMenuClick}
                            aria-label="Main menu"
                            sx={commonIconSx}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: theme.palette.divider }} />

                    <Box
                        onClick={() => console.log("Switch board")}
                        role="button"
                        tabIndex={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            },
                        }}
                    >
                        <Avatar
                            alt="User Avatar"
                            src="https://storage.googleapis.com/a1aa/image/c43fc21f-8597-4ac3-d00f-c32f32716775.jpg"
                            sx={{ width: 28, height: 28 }}
                        />
                        <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
                            Complaints
                        </Typography>
                        <ArrowDropDownIcon fontSize="small" />
                    </Box>
                </Box>

                {/* Right Section */}
                <Box display="flex" alignItems="center" gap={2}>
                    {/* View selector buttons */}
                    <Box className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto items-center">
                        <Tooltip title="Status Board">
                            <IconButton
                                aria-label="Status Board"
                                onClick={() => setCurrentView('status')}
                                color={currentView === 'status' ? 'primary' : 'inherit'}
                                sx={{
                                    ...commonIconSx,
                                    backgroundColor: currentView === 'status' ? theme.palette.action.selected : 'transparent',
                                }}
                            >
                                <BoardIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="User Board">
                            <IconButton
                                aria-label="User Board"
                                onClick={() => setCurrentView('user')}
                                color={currentView === 'user' ? 'primary' : 'inherit'}
                                sx={{
                                    ...commonIconSx,
                                    backgroundColor: currentView === 'user' ? theme.palette.action.selected : 'transparent',
                                }}
                            >
                                <UsersIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Add New Task" arrow>
                            <IconButton
                                aria-label="add new task"
                                onClick={handleOpenAddTaskDialog}
                                color="secondary"
                                size="large"
                                sx={{
                                    backgroundColor: (theme) => theme.palette.secondary.main,
                                    color: (theme) => theme.palette.secondary.contrastText,
                                    '&:hover': {
                                        backgroundColor: (theme) => theme.palette.secondary.dark,
                                    },
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                        {/* </Button> */}
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: theme.palette.divider }} />

                    <Tooltip title="Notifications">
                        <IconButton
                            aria-label="Notifications"
                            onClick={handleNotificationsClick}
                            sx={commonIconSx}
                        >
                            <Badge badgeContent={9} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Help">
                        <IconButton aria-label="Help" sx={commonIconSx}>
                            <QuestionMarkIcon />
                        </IconButton>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: theme.palette.divider }} />

                    <Tooltip title="User Profile">
                        <IconButton
                            aria-label="User Profile"
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                '&:hover': {
                                    opacity: 0.85,
                                },
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                M
                            </Typography>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>

            {/* Left Menu Dropdown */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        mt: 1,
                        borderRadius: 2,
                        boxShadow: theme.shadows[4],
                        minWidth: 160,
                    },
                }}
            >
                {['Profile', 'Settings', 'Logout'].map((option) => (
                    <MenuItem key={option} onClick={handleMenuClose}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </AppBar>
    );
};

export default KanbanHeader;