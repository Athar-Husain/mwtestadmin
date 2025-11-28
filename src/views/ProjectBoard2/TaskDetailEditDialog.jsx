// ProjectBoard/TaskDetailEditDialog.jsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel,
    Typography, Button, IconButton, Chip, Divider, Box, DialogContentText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Icons
import CloseIcon from '@mui/icons-material/Close';

// Import helper functions and data
import { users, projects } from './Index'; // Assuming dummy data is in Index.jsx for now

// Helper function to get user name by ID
const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
};

// Helper function to get project name by ID
const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
};

const TaskDetailEditDialog = ({ task, onUpdateTask, onDeleteTask, onClose }) => {
    const theme = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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

    useEffect(() => {
        setIsEditing(false);
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                assignedTo: task.assignedTo,
                projectId: task.projectId,
                status: task.status,
                dueDate: task.dueDate,
            });
        }
    }, [task, reset]);

    const onSubmitEditForm = (data) => {
        onUpdateTask({ ...task, ...data });
        setIsEditing(false);
    };

    const handleDeleteConfirm = () => {
        onDeleteTask(task.id);
        setConfirmDeleteOpen(false);
    };

    const inputLabelColor = theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary;
    const inputBorderColor = theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400];
    const inputTextColor = theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary;

    return (
        <>
            <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ className: "rounded-xl dark:bg-gray-800 dark:text-white" }}>
                <DialogTitle sx={{ color: inputTextColor }}>
                    {isEditing ? "Edit Task" : "Task Details"}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.divider }}>
                    {isEditing ? (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box component="form" onSubmit={handleSubmit(onSubmitEditForm)} className="space-y-4 p-4 -mx-4 -my-2">
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
                                            helperText={errors.title ? errors.title.message : ''}
                                            sx={{
                                                '& .MuiInputLabel-root': { color: inputLabelColor },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { borderColor: inputBorderColor },
                                                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                                    '& .MuiInputBase-input': { color: inputTextColor },
                                                },
                                            }}
                                        />
                                    )}
                                />
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
                                            helperText={errors.description ? errors.description.message : ''}
                                            sx={{
                                                '& .MuiInputLabel-root': { color: inputLabelColor },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { borderColor: inputBorderColor },
                                                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                                    '& .MuiInputBase-input': { color: inputTextColor },
                                                },
                                            }}
                                        />
                                    )}
                                />
                                <FormControl fullWidth margin="normal" error={!!errors.assignedTo}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: inputLabelColor },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: inputBorderColor },
                                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            '& .MuiInputBase-input': { color: inputTextColor },
                                            '& .MuiSelect-icon': { color: inputLabelColor },
                                        },
                                    }}
                                >
                                    <InputLabel>Assigned To</InputLabel>
                                    <Controller
                                        name="assignedTo"
                                        control={control}
                                        rules={{ required: 'Assignee is required' }}
                                        render={({ field }) => (
                                            <Select {...field} label="Assigned To">
                                                <MenuItem value="" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}><em>None</em></MenuItem>
                                                {users.map(user => (
                                                    <MenuItem key={user.id} value={user.id} sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>{user.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.assignedTo && <Typography color="error" variant="caption">{errors.assignedTo.message}</Typography>}
                                </FormControl>
                                <FormControl fullWidth margin="normal" error={!!errors.projectId}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: inputLabelColor },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: inputBorderColor },
                                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            '& .MuiInputBase-input': { color: inputTextColor },
                                            '& .MuiSelect-icon': { color: inputLabelColor },
                                        },
                                    }}
                                >
                                    <InputLabel>Project</InputLabel>
                                    <Controller
                                        name="projectId"
                                        control={control}
                                        rules={{ required: 'Project is required' }}
                                        render={({ field }) => (
                                            <Select {...field} label="Project">
                                                <MenuItem value="" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}><em>None</em></MenuItem>
                                                {projects.map(project => (
                                                    <MenuItem key={project.id} value={project.id} sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>{project.name}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.projectId && <Typography color="error" variant="caption">{errors.projectId.message}</Typography>}
                                </FormControl>
                                <FormControl fullWidth margin="normal" error={!!errors.status}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: inputLabelColor },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: inputBorderColor },
                                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            '& .MuiInputBase-input': { color: inputTextColor },
                                            '& .MuiSelect-icon': { color: inputLabelColor },
                                        },
                                    }}
                                >
                                    <InputLabel>Status</InputLabel>
                                    <Controller
                                        name="status"
                                        control={control}
                                        rules={{ required: 'Status is required' }}
                                        render={({ field }) => (
                                            <Select {...field} label="Status">
                                                <MenuItem value="todo" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>To Do</MenuItem>
                                                <MenuItem value="in-progress" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>In Progress</MenuItem>
                                                <MenuItem value="completed" sx={{ color: inputTextColor, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.background.paper }}>Completed</MenuItem>
                                            </Select>
                                        )}
                                    />
                                    {errors.status && <Typography color="error" variant="caption">{errors.status.message}</Typography>}
                                </FormControl>
                                <Controller
                                    name="dueDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Due Date"
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    error={!!errors.dueDate}
                                                    helperText={errors.dueDate ? errors.dueDate.message : ''}
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{
                                                        '& .MuiInputLabel-root': { color: inputLabelColor },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': { borderColor: inputBorderColor },
                                                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                                            '& .MuiInputBase-input': { color: inputTextColor },
                                                            '& .MuiButtonBase-root': { color: inputLabelColor },
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Box>
                        </LocalizationProvider>
                    ) : (
                        <Box className="space-y-4 p-4 -mx-4 -my-2" sx={{
                            '& .MuiTypography-root': {
                                color: inputTextColor,
                            },
                            '& .MuiTypography-body1': {
                                color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.text.secondary,
                            },
                            '& .MuiDivider-root': {
                                borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.divider,
                            },
                            '& strong': {
                                color: inputTextColor,
                            }
                        }}>
                            <Typography variant="h5" className="font-bold">{task.title}</Typography>
                            <Typography variant="body1" color="text.secondary">{task.description}</Typography>
                            <Divider />
                            <Typography variant="body2">
                                <strong>Status:</strong> <Chip label={task.status.replace('-', ' ').toUpperCase()} size="small" className={`capitalize ${task.status === 'todo' ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : task.status === 'in-progress' ? 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100' : 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100'}`} />
                            </Typography>
                            <Typography variant="body2">
                                <strong>Assigned to:</strong> {getUserName(task.assignedTo)}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Project:</strong> {getProjectName(task.projectId)}
                            </Typography>
                            {task.dueDate && (
                                <Typography variant="body2">
                                    <strong>Due Date:</strong> {task.dueDate}
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className="p-4">
                    {isEditing ? (
                        <>
                            <Button onClick={() => setIsEditing(false)} color="inherit" sx={{ color: inputTextColor }}>Cancel</Button>
                            <Button onClick={handleSubmit(onSubmitEditForm)} variant="contained" color="primary">Save Changes</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setIsEditing(true)} color="primary">Edit</Button>
                            <Button onClick={() => setConfirmDeleteOpen(true)} color="error">Delete</Button>
                            <Button onClick={onClose} variant="outlined" sx={{ color: inputTextColor }}>Close</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} PaperProps={{ className: "rounded-xl dark:bg-gray-800 dark:text-white" }}>
                <DialogTitle sx={{ color: inputTextColor }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.text.secondary }}>
                        Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={() => setConfirmDeleteOpen(false)} color="inherit" sx={{ color: inputTextColor }}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TaskDetailEditDialog;
