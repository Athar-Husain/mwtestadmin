// src/components/ProjectBoard/KanbanHeader.jsx
import React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Divider,
    Badge,
    Avatar,
    Tooltip,
    Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    CheckCircle as CheckCircleIcon,
    People as UsersIcon,
    ViewModule as BoardIcon,
    Help as QuestionMarkIcon,
    ArrowDropDown as ArrowDropDownIcon,
    TimerOutlined as TimerIcon,
} from '@mui/icons-material';

const KanbanHeader = () => {
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
        setNotificationsOpen((prev) => !prev);
    };

    const commonIconSx = {
        color: theme.palette.text.secondary,
        transition: 'background-color 0.2s ease',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focusVisible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
        },
    };

    return (
        <AppBar position="sticky" color="default" elevation={3}>
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    px: { xs: 2, sm: 4 },
                    py: 1.5,
                    backgroundColor: theme.palette.background.paper,
                    userSelect: 'none',
                }}
            >
                {/* Left Section */}
                <Box display="flex" alignItems="center" gap={2}>
                    <Tooltip title="Main Menu">
                        <IconButton
                            onClick={handleMenuClick}
                            aria-label="Main menu"
                            sx={commonIconSx}
                            size="large"
                        >
                            <MenuIcon fontSize="medium" />
                        </IconButton>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: theme.palette.divider }} />

                    <Box
                        onClick={() => console.log('Switch board')}
                        role="button"
                        tabIndex={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                            userSelect: 'none',
                            '&:hover, &:focus-visible': {
                                backgroundColor: theme.palette.action.hover,
                                outline: 'none',
                            },
                        }}
                    >
                        <Avatar
                            alt="User Avatar"
                            src="https://storage.googleapis.com/a1aa/image/c43fc21f-8597-4ac3-d00f-c32f32716775.jpg"
                            sx={{ width: 28, height: 28, flexShrink: 0 }}
                        />
                        <Typography
                            variant="body2"
                            sx={{ ml: 1, fontWeight: 600, color: theme.palette.text.primary }}
                        >
                            Complaints
                        </Typography>
                        <ArrowDropDownIcon fontSize="small" sx={{ ml: 0.5, color: theme.palette.text.secondary }} />
                    </Box>
                </Box>

                {/* Right Section */}
                <Box display="flex" alignItems="center" gap={1.5}>
                    {[
                        { icon: <BoardIcon />, label: 'Board View' },
                        { icon: <UsersIcon />, label: 'Users' },
                        { icon: <TimerIcon />, label: 'Timer' },
                        { icon: <CheckCircleIcon />, label: 'Check' },
                    ].map(({ icon, label }) => (
                        <Tooltip key={label} title={label}>
                            <IconButton aria-label={label} sx={commonIconSx} size="large">
                                {icon}
                            </IconButton>
                        </Tooltip>
                    ))}

                    <Tooltip title="Notifications">
                        <IconButton
                            aria-label="Notifications"
                            onClick={handleNotificationsClick}
                            sx={commonIconSx}
                            size="large"
                        >
                            <Badge badgeContent={9} color="error" overlap="circular">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Help">
                        <IconButton aria-label="Help" sx={commonIconSx} size="large">
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
                                    backgroundColor: theme.palette.primary.dark,
                                },
                                transition: 'background-color 0.3s ease, opacity 0.3s ease',
                                fontWeight: 600,
                            }}
                            size="large"
                        >
                            <Typography variant="body2" sx={{ fontWeight: 600, userSelect: 'none' }}>
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
                        borderRadius: 3,
                        boxShadow: theme.shadows[4],
                        minWidth: 180,
                        p: 0,
                    },
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                {['Profile', 'Settings', 'Logout'].map((option) => (
                    <MenuItem key={option} onClick={handleMenuClose} sx={{ fontWeight: 500 }}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </AppBar>
    );
};

export default KanbanHeader;
