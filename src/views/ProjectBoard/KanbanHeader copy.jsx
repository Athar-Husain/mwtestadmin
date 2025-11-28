import React from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Divider, Badge, Avatar, Tooltip, Box,
    FormControl, InputLabel, Select, Button
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

    // New viewOptions array for the dropdown menu
    const viewOptions = [
        { value: 'status', label: 'Status Board', icon: <BoardIcon /> },
        { value: 'user', label: 'User Board', icon: <UsersIcon /> },
    ];

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
                    {/* View selector and Add new task button */}
                    <Box className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto items-center">
                        <FormControl
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 120, bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100', borderRadius: 1 }}
                        >
                            <InputLabel id="view-select-label" sx={{ color: theme.palette.text.secondary }}>
                                View
                            </InputLabel>
                            <Select
                                labelId="view-select-label"
                                id="view-select"
                                value={currentView}
                                label="View"
                                onChange={(e) => setCurrentView(e.target.value)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    '& .MuiSelect-select': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        paddingLeft: 1,
                                    },
                                }}
                                renderValue={(selected) => {
                                    const option = viewOptions.find((opt) => opt.value === selected);
                                    return (
                                        <Tooltip title={option?.label || ''} arrow>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {option?.icon}
                                            </Box>
                                        </Tooltip>
                                    );
                                }}
                            >
                                {viewOptions.map(({ value, label, icon }) => (
                                    <MenuItem key={value} value={value} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Tooltip title={label} arrow>
                                            <Box>{icon}</Box>
                                        </Tooltip>
                                        {label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleOpenAddTaskDialog}
                            className="w-full sm:w-auto transform transition-transform duration-200 hover:scale-105"
                            startIcon={<AddIcon />}
                        >
                            Add New Task
                        </Button>
                    </Box>
                    {/* End of new buttons */}

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