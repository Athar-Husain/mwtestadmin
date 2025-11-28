// ProjectBoard/TaskDetailEditDialog.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel,
    Typography, Button, IconButton, Chip, Divider, Box, Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Icons 
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

// Assuming you moved these to a separate utils file for better architecture
// import { getUserName, getProjectName } from './utils';
// import { users, projects } from './data'; // Centralize data
import { users, projects } from './Index'; // Using for demo, but recommend moving

// Helper functions (move to a separate file, e.g., 'utils/helpers.js')
const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
};
const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
};


const TaskDetailEditDialog = ({ task, onUpdateTask, onDeleteTask, open, onClose }) => {
    const theme = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false); // Refined state management

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            assignedTo: '',
            projectId: '',
            status: '',
            dueDate: '',
        }
    });

    // Centralize styles using useMemo to prevent re-creation on every render
    const inputStyles = useMemo(() => ({
        '& .MuiInputLabel-root': {
            color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400] },
            '&:hover fieldset': { borderColor: theme.palette.primary.main },
            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
            '& .MuiInputBase-input': { color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary },
            '& .MuiSelect-icon': { color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary },
        },
    }), [theme.palette]);

    useEffect(() => {
        // Reset form to task data whenever the dialog is opened with a new task
        if (task && open) {
            reset({
                title: task.title,
                description: task.description,
                assignedTo: task.assignedTo,
                projectId: task.projectId,
                status: task.status,
                dueDate: task.dueDate,
            });
            setIsEditing(false); // Ensure it always starts in view mode
            setIsConfirmingDelete(false); // Reset delete confirmation state
        }
    }, [task, open, reset]);

    const onSubmitEditForm = (data) => {
        onUpdateTask({ ...task, ...data });
        setIsEditing(false);
    };

    const handleDeleteConfirm = () => {
        onDeleteTask(task.id);
        onClose(); // Close dialog after successful deletion
    };

    // Mapping for Chip colors
    const statusChipColors = {
        'todo': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        'in-progress': 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100',
        'completed': 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100',
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{ paper: { className: "rounded-xl dark:bg-gray-800 dark:text-white" } }}
        >
            <DialogTitle sx={{ color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary }}>
                {isEditing ? "Edit Task" : "Task Details"}
                <Tooltip title="Close">
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8, color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.divider }}>
                {isEditing ? (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box component="form" onSubmit={handleSubmit(onSubmitEditForm)} className="space-y-4 p-4 -mx-4 -my-2">
                            {/* Title */}
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: 'Task title is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Title"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                        sx={inputStyles}
                                    />
                                )}
                            />
                            {/* Description */}
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: 'Description is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Description"
                                        fullWidth
                                        margin="normal"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                        sx={inputStyles}
                                    />
                                )}
                            />
                            {/* Assigned To */}
                            <FormControl fullWidth margin="normal" error={!!errors.assignedTo} sx={inputStyles}>
                                <InputLabel id="assigned-to-label">Assigned To</InputLabel>
                                <Controller
                                    name="assignedTo"
                                    control={control}
                                    rules={{ required: 'Assignee is required' }}
                                    render={({ field }) => (
                                        <Select {...field} labelId="assigned-to-label" id="assigned-to-select" label="Assigned To">
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
                                        </Select>
                                    )}
                                />
                                {errors.assignedTo && <Typography color="error" variant="caption">{errors.assignedTo.message}</Typography>}
                            </FormControl>
                            {/* Project */}
                            <FormControl fullWidth margin="normal" error={!!errors.projectId} sx={inputStyles}>
                                <InputLabel id="project-label">Project</InputLabel>
                                <Controller
                                    name="projectId"
                                    control={control}
                                    rules={{ required: 'Project is required' }}
                                    render={({ field }) => (
                                        <Select {...field} labelId="project-label" id="project-select" label="Project">
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {projects.map(project => <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>)}
                                        </Select>
                                    )}
                                />
                                {errors.projectId && <Typography color="error" variant="caption">{errors.projectId.message}</Typography>}
                            </FormControl>
                            {/* Status */}
                            <FormControl fullWidth margin="normal" error={!!errors.status} sx={inputStyles}>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{ required: 'Status is required' }}
                                    render={({ field }) => (
                                        <Select {...field} labelId="status-label" id="status-select" label="Status">
                                            <MenuItem value="todo">To Do</MenuItem>
                                            <MenuItem value="in-progress">In Progress</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                        </Select>
                                    )}
                                />
                                {errors.status && <Typography color="error" variant="caption">{errors.status.message}</Typography>}
                            </FormControl>
                            {/* Due Date */}
                            <Controller
                                name="dueDate"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Due Date"
                                        value={field.value ? dayjs(field.value) : null}
                                        onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                margin: "normal",
                                                variant: "outlined",
                                                error: !!errors.dueDate,
                                                helperText: errors.dueDate?.message,
                                                sx: inputStyles
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    </LocalizationProvider>
                ) : (
                    isConfirmingDelete ? (
                        <Box sx={{ p: 4 }}>
                            <Typography variant="h6" color="error" sx={{ mb: 2 }}>Confirm Deletion</Typography>
                            <Typography>
                                Are you sure you want to delete the task **"{task.title}"**? This action cannot be undone.
                            </Typography>
                        </Box>
                    ) : (
                        <Box className="space-y-4 p-4 -mx-4 -my-2" sx={{
                            '& .MuiTypography-root': { color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary },
                            '& .MuiTypography-body1': { color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.text.secondary },
                            '& .MuiDivider-root': { borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.divider },
                            '& strong': { color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary }
                        }}>
                            <Typography variant="h5" className="font-bold">{task.title}</Typography>
                            <Typography variant="body1">{task.description}</Typography>
                            <Divider />
                            <Typography variant="body2">
                                <strong>Status:</strong> <Chip label={task.status.replace('-', ' ').toUpperCase()} size="small" className={`capitalize ${statusChipColors[task.status]}`} />
                            </Typography>
                            <Typography variant="body2"><strong>Assigned to:</strong> {getUserName(task.assignedTo)}</Typography>
                            <Typography variant="body2"><strong>Project:</strong> {getProjectName(task.projectId)}</Typography>
                            {task.dueDate && <Typography variant="body2"><strong>Due Date:</strong> {task.dueDate}</Typography>}
                        </Box>
                    )
                )}
            </DialogContent>
            <DialogActions className="p-4">
                {isEditing ? (
                    <>
                        <Tooltip title="Cancel">
                            <Button onClick={() => setIsEditing(false)} color="inherit" sx={{ color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary }}>
                                <CancelIcon sx={{ mr: 1 }} />
                                Cancel
                            </Button>
                        </Tooltip>
                        <Tooltip title="Save Changes">
                            <Button onClick={handleSubmit(onSubmitEditForm)} variant="contained" color="primary">
                                <CheckIcon sx={{ mr: 1 }} />
                                Save Changes
                            </Button>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        {isConfirmingDelete ? (
                            <>
                                <Button onClick={() => setIsConfirmingDelete(false)} color="inherit">Cancel</Button>
                                <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                                    Delete
                                </Button>
                            </>
                        ) : (
                            <>
                                <Tooltip title="Edit Task">
                                    <Button onClick={() => setIsEditing(true)} color="primary">
                                        <EditIcon sx={{ mr: 1 }} />
                                        Edit
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Delete Task">
                                    <Button onClick={() => setIsConfirmingDelete(true)} color="error">
                                        <DeleteIcon sx={{ mr: 1 }} />
                                        Delete
                                    </Button>
                                </Tooltip>
                            </>
                        )}
                        
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default TaskDetailEditDialog;