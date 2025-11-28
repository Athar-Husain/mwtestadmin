// ProjectBoard/TaskDetailSidebar.jsx
import React from 'react';
import {
    Box, Button, Typography, Chip, Avatar, Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { grey } from '@mui/material/colors';

// Material-UI Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TuneIcon from '@mui/icons-material/Tune';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const TaskDetailSidebar = ({ task, onUpdateTask, control, errors }) => {
    const theme = useTheme();

    const secondaryTextColor = theme.palette.mode === 'dark' ? grey[400] : theme.palette.text.secondary;
    const inputTextColor = theme.palette.mode === 'dark' ? grey[100] : theme.palette.text.primary;
    const sidebarBg = theme.palette.mode === 'dark' ? grey[900] : '#f7f8fa'; // Original HTML color
    const sidebarBorder = theme.palette.mode === 'dark' ? grey[700] : grey[200];

    return (
        <Box
            sx={{
                width: { xs: '100%', md: '288px' }, // w-72 (288px) on md+, full width on xs
                backgroundColor: sidebarBg, // bg-[#f7f8fa]
                borderLeft: { xs: 'none', md: `1px solid ${sidebarBorder}` }, // border-l border-gray-200
                borderTop: { xs: `1px solid ${sidebarBorder}`, md: 'none' }, // Added borderTop for mobile
                display: 'flex',
                flexDirection: 'column',
                borderBottom: { xs: `1px solid ${sidebarBorder}`, md: 'none' }, // Added borderBottom for mobile
                '& > .MuiButtonBase-root': { // Targeting direct Button children for general sidebar item styling
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    paddingX: theme.spacing(2), // px-4
                    paddingY: theme.spacing(1.5), // py-3
                    borderBottom: `1px solid ${sidebarBorder}`, // Ensure separator
                    borderRadius: 0,
                    color: secondaryTextColor,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover, // hover:bg-gray-100
                    },
                },
            }}
        >
            {/* Timer */}
            <Button onClick={() => console.log('Timer clicked')}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}> {/* gap-2 */}
                    <PlayCircleOutlineIcon sx={{ color: grey[400], fontSize: '1.25rem' }} /> {/* text-lg */}
                    <Typography variant="body2">00:00:00</Typography>
                </Box>
                <KeyboardArrowDownIcon sx={{ color: grey[400] }} />
            </Button>
            {/* Due date */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label="Due date"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => {
                                field.onChange(date ? date.format('YYYY-MM-DD') : '');
                                onUpdateTask({ ...task, dueDate: date ? date.format('YYYY-MM-DD') : '' });
                            }}
                            enableAccessibleFieldDOMStructure={false}
                            slots={{
                                textField: (params) => (
                                    <Button
                                        onClick={params.inputProps.onClick}
                                        sx={{
                                            width: '100%',
                                            justifyContent: 'space-between',
                                            paddingX: theme.spacing(2),
                                            paddingY: theme.spacing(1.5),
                                            borderBottom: `1px solid ${sidebarBorder}`, // Match other buttons
                                            borderRadius: 0,
                                            textTransform: 'none',
                                            color: secondaryTextColor,
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                                            <CalendarTodayIcon sx={{ color: grey[400], fontSize: '1.25rem' }} />
                                            <Typography variant="body2" sx={{ color: inputTextColor }}>
                                                {field.value ? dayjs(field.value).format('MMM DD, YYYY') : 'Due date'}
                                            </Typography>
                                        </Box>
                                        <KeyboardArrowDownIcon sx={{ color: grey[400] }} />
                                    </Button>
                                )
                            }}
                            slotProps={{
                                textField: {
                                    variant: 'outlined', // Standard variant, though hidden
                                    size: 'small',
                                    fullWidth: true,
                                    sx: { display: 'none' } // Hide the actual TextField as we use a custom button for input
                                }
                            }}
                        />
                    )}
                />
            </LocalizationProvider>

            {/* Scheduling */}
            <Button
                onClick={() => console.log('Scheduling clicked')}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    paddingX: theme.spacing(2),
                    paddingY: theme.spacing(1.5),
                    borderBottom: `1px solid ${sidebarBorder}`, // Match other buttons
                    borderRadius: 0,
                    textTransform: 'none',
                    color: secondaryTextColor,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1), marginBottom: theme.spacing(0.5), width: '100%', justifyContent: 'space-between' }}> {/* mb-1 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                        <TuneIcon sx={{ color: grey[400], fontSize: '1.25rem' }} />
                        <Typography variant="body2">Not scheduled</Typography>
                    </Box>
                    <KeyboardArrowDownIcon sx={{ color: grey[400] }} />
                </Box>
                <Box sx={{ marginLeft: theme.spacing(4) }}> {/* ml-8 */}
                    <Chip
                        label="BUSINESS"
                        size="small"
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? grey[700] : grey[800],
                            color: 'white',
                            fontSize: '0.5625rem', // text-[9px]
                            fontWeight: 600,
                            borderRadius: '4px',
                            paddingX: '8px',
                            paddingY: '2px'
                        }}
                    />
                </Box>
            </Button>
            {/* Tags */}
            <Button
                onClick={() => console.log('Tags clicked')}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                    <LocalOfferIcon sx={{ color: grey[400], fontSize: '1.25rem' }} />
                    <Typography variant="body2">Tags</Typography>
                </Box>
                <KeyboardArrowDownIcon sx={{ color: grey[400] }} />
            </Button>
            {/* Watching */}
            <Button
                onClick={() => console.log('Watching clicked')}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    paddingX: theme.spacing(2),
                    paddingY: theme.spacing(1.5),
                    borderBottom: `1px solid ${sidebarBorder}`, // Match other buttons
                    borderRadius: 0,
                    textTransform: 'none',
                    color: secondaryTextColor,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1), marginBottom: theme.spacing(0.5), width: '100%', justifyContent: 'space-between' }}> {/* mb-1 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                        <VisibilityIcon sx={{ color: grey[400], fontSize: '1.25rem' }} />
                        <Typography variant="body2">Watching</Typography>
                    </Box>
                    <KeyboardArrowDownIcon sx={{ color: grey[400] }} />
                </Box>
                <Box sx={{ marginLeft: theme.spacing(4), display: 'flex' }}> {/* ml-8 flex */}
                    <Avatar src="https://storage.googleapis.com/a1aa/image/d3071251-afac-4396-941b-37d840095dc7.jpg" sx={{ width: 24, height: 24, borderRadius: '50%' }} />
                </Box>
            </Button>
            {/* Relations */}
            <Button
                onClick={() => console.log('Relations clicked')}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                    <LinkIcon sx={{ color: grey[400], fontSize: '1.25rem' }} />
                    <Typography variant="body2">Relations</Typography>
                </Box>
                <KeyboardArrowDownIcon sx={{ color: grey[400] }} />
            </Button>
            {/* Complaints New Tasks info */}
            <Box
                sx={{
                    padding: theme.spacing(2), // px-4 py-3
                    fontSize: '0.5625rem', // text-[9px] - Base for this section
                    lineHeight: '1.2', // leading-tight
                    flexShrink: 0, // Prevents shrinking
                    backgroundColor: sidebarBg,
                    color: secondaryTextColor,
                    borderColor: sidebarBorder,
                    borderBottom: { xs: 'none', md: `1px solid ${sidebarBorder}` } // Remove bottom border on desktop, add on mobile
                }}
            >
                <Typography variant="caption" sx={{
                    display: 'block', // To make it behave like a block-level element for mb-1
                    marginBottom: theme.spacing(0.5), // mb-1
                    fontWeight: 600, // font-semibold
                    color: theme.palette.mode === 'dark' ? grey[300] : grey[600],
                    fontSize: '0.75rem' // text-xs, slightly larger for better readability
                }}>
                    Complaints
                </Typography>
                <Typography variant="caption" sx={{
                    display: 'block', // To make it behave like a block-level element for mb-3
                    marginBottom: theme.spacing(1.5), // mb-3
                    fontWeight: 600, // font-semibold
                    color: theme.palette.mode === 'dark' ? grey[300] : grey[600],
                    fontSize: '0.75rem' // text-xs
                }}>
                    New Tasks
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing(1), marginBottom: theme.spacing(1) }}> {/* flex items-start gap-2 mb-2 */}
                    <AddCircleOutlineIcon sx={{ color: grey[400], fontSize: '1rem', marginTop: '2px' }} />
                    <Box>
                        <Typography variant="caption" sx={{
                            display: 'block',
                            fontWeight: 600, // font-semibold
                            color: theme.palette.mode === 'dark' ? grey[200] : grey[700],
                            fontSize: '0.75rem' // text-xs
                        }}>
                            Created
                        </Typography>
                        <Typography variant="caption" sx={{ color: secondaryTextColor, fontSize: '0.625rem' }}>
                            {dayjs(task.createdAt || Date.now()).format('MMM DD, YYYY')}<br />
                            {dayjs(task.createdAt || Date.now()).format('hh:mm A')}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing(1), marginBottom: theme.spacing(1) }}> {/* flex items-start gap-2 mb-2 */}
                    <EditOutlinedIcon sx={{ color: grey[400], fontSize: '1rem', marginTop: '2px' }} />
                    <Box>
                        <Typography variant="caption" sx={{
                            display: 'block',
                            fontWeight: 600, // font-semibold
                            color: theme.palette.mode === 'dark' ? grey[200] : grey[700],
                            fontSize: '0.75rem' // text-xs
                        }}>
                            Updated
                        </Typography>
                        <Typography variant="caption" sx={{ color: secondaryTextColor, fontSize: '0.625rem' }}>
                            {dayjs(task.updatedAt || Date.now()).format('MMM DD, YYYY')}<br />
                            {dayjs(task.updatedAt || Date.now()).format('hh:mm A')}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing(1) }}> {/* flex items-start gap-2 */}
                    <EditOutlinedIcon sx={{ color: grey[400], fontSize: '1rem', marginTop: '2px' }} />
                    <Box>
                        <Typography variant="caption" sx={{
                            display: 'block',
                            fontWeight: 600, // font-semibold
                            color: theme.palette.mode === 'dark' ? grey[200] : grey[700],
                            fontSize: '0.75rem' // text-xs
                        }}>
                            Task ID
                        </Typography>
                        <Typography variant="caption" sx={{ color: secondaryTextColor, fontSize: '0.625rem' }}>
                            {task.id}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TaskDetailSidebar;
