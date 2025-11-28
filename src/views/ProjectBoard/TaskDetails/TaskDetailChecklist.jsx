// ProjectBoard/TaskDetailChecklist.jsx
import React from 'react';
import {
    Box, Button, Typography, Chip, List, ListItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';

// Material-UI Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';

const TaskDetailChecklist = ({ checklistItems }) => {
    const theme = useTheme();

    const textColor = theme.palette.mode === 'dark' ? grey[100] : grey[800];
    const secondaryTextColor = theme.palette.mode === 'dark' ? grey[400] : theme.palette.text.secondary;

    return (
        <Box sx={{ marginBottom: theme.spacing(3) }}> {/* mb-6 */}
            <Button
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(1), // gap-2
                    color: textColor, // text-gray-700
                    fontWeight: 600, // font-semibold
                    fontSize: '0.875rem', // text-sm
                    marginBottom: theme.spacing(1), // mb-2
                    textTransform: 'none',
                    padding: 0, // Remove default button padding
                    '&:hover': { backgroundColor: 'transparent' } // Keep transparent on hover
                }}
                startIcon={<KeyboardArrowDownIcon sx={{ fontSize: '0.75rem' }} />} // text-xs
                onClick={() => console.log('Toggle Checklist')} // Placeholder for toggle
            >
                Checklist
                <Chip
                    label={`${checklistItems.filter(item => item.completed).length}/${checklistItems.length}`}
                    size="small"
                    variant="outlined"
                    sx={{
                        marginLeft: 'auto', // ml-auto
                        fontSize: '0.625rem', // text-xs
                        fontWeight: 600, // font-semibold
                        borderRadius: '9999px', // rounded-full
                        paddingX: '8px', // px-2
                        paddingY: '2px', // py-0.5
                        borderColor: theme.palette.mode === 'dark' ? grey[600] : grey[300], // border-gray-300
                        color: secondaryTextColor, // text-gray-400
                    }}
                />
            </Button>
            <List dense sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(1.5), paddingLeft: theme.spacing(2) }}> {/* flex flex-col gap-3 pl-4 */}
                {checklistItems.map((item, idx) => (
                    <ListItem key={idx} disablePadding>
                        <Typography sx={{ color: textColor }}>{item.text}</Typography>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <Button
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.spacing(1), // gap-2
                            color: blue[600], // text-[#2a8dd4]
                            fontSize: '0.875rem', // text-sm
                            fontWeight: 600, // font-semibold
                            textTransform: 'none',
                            padding: 0,
                            '&:hover': { backgroundColor: 'transparent' }
                        }}
                        startIcon={<AddIcon />}
                        onClick={() => console.log('Add checklist item clicked')}
                    >
                        Add checklist item
                    </Button>
                </ListItem>
                <ListItem sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }} disablePadding>
                    <Button
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.spacing(1), // gap-2
                            color: blue[600], // text-[#2a8dd4]
                            fontSize: '0.875rem', // text-sm
                            fontWeight: 600, // font-semibold
                            textTransform: 'none',
                            padding: 0,
                            '&:hover': { backgroundColor: 'transparent' }
                        }}
                        startIcon={<AddIcon />}
                        onClick={() => console.log('Add subtask clicked')}
                    >
                        Add subtask
                    </Button>
                    <Chip
                        label="BUSINESS"
                        size="small"
                        sx={{
                            marginLeft: theme.spacing(1), // ml-2
                            backgroundColor: theme.palette.mode === 'dark' ? grey[700] : grey[800], // bg-gray-800
                            color: 'white',
                            fontSize: '0.5625rem', // text-[9px]
                            fontWeight: 600, // font-semibold
                            borderRadius: '4px', // rounded
                            paddingX: '8px', // px-2
                            paddingY: '2px', // py-[2px]
                        }}
                    />
                </ListItem>
                <ListItem disablePadding>
                    <Button
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.spacing(1), // gap-2
                            color: blue[600], // text-[#2a8dd4]
                            fontSize: '0.875rem', // text-sm
                            fontWeight: 600, // font-semibold
                            textTransform: 'none',
                            padding: 0,
                            '&:hover': { backgroundColor: 'transparent' }
                        }}
                        startIcon={<AddIcon />}
                        onClick={() => console.log('Add attachment clicked')}
                    >
                        Add attachment
                    </Button>
                </ListItem>
            </List>
        </Box>
    );
};

export default TaskDetailChecklist;
