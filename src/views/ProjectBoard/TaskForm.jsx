// ProjectBoard/TaskForm.jsx
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box, TextField, Select, MenuItem, FormControl, InputLabel,
    Typography, Button, DialogActions, Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Dummy data
import { users, projects } from './Index';

const TaskForm = ({ task, onSubmit, onClose, isEditMode = false }) => {
    const theme = useTheme();

    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            projectId: '',
            status: 'todo',
            assignedTo: '',
            dueDate: '',
            ...task
        }
    });

    useEffect(() => {
        reset({
            title: '',
            description: '',
            projectId: '',
            status: 'todo',
            assignedTo: '',
            dueDate: '',
            ...task
        });
    }, [task, reset]);

    const getInputStyles = () => ({
        '& .MuiInputLabel-root': {
            color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400]
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main
            },
            '& .MuiInputBase-input': {
                color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary
            },
            '& .MuiSelect-icon, & .MuiSvgIcon-root': {
                color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary
            }
        },
        marginBottom: '16px', // Consistent spacing between fields
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 p-6 dark:bg-gray-800 rounded-xl"
                sx={{
                    maxWidth: 600, // Limit max width for better alignment
                    margin: 'auto',
                }}
            >
                <Grid container spacing={2}>
                    {/* Title */}
                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: 'Task title is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Task Title"
                                    fullWidth
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                    sx={getInputStyles()}
                                />
                            )}
                        />
                    </Grid>

                    {/* Description */}
                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: 'Description is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                    sx={getInputStyles()}
                                />
                            )}
                        />
                    </Grid>

                    {/* Project Selector */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={!!errors.projectId} sx={getInputStyles()}>
                            <InputLabel>Project</InputLabel>
                            <Controller
                                name="projectId"
                                control={control}
                                rules={{ required: 'Project is required' }}
                                render={({ field }) => (
                                    <Select {...field} label="Project">
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        {projects.map((project) => (
                                            <MenuItem key={project.id} value={project.id}>
                                                {project.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.projectId && (
                                <Typography variant="caption" color="error">
                                    {errors.projectId.message}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Assignee Selector */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={!!errors.assignedTo} sx={getInputStyles()}>
                            <InputLabel>Assigned To</InputLabel>
                            <Controller
                                name="assignedTo"
                                control={control}
                                rules={{ required: 'Assignee is required' }}
                                render={({ field }) => (
                                    <Select {...field} label="Assigned To">
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        {users.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.assignedTo && (
                                <Typography variant="caption" color="error">
                                    {errors.assignedTo.message}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Status Selector */}
                    <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth error={!!errors.status} sx={getInputStyles()}>
                            <InputLabel>Status</InputLabel>
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: 'Status is required' }}
                                render={({ field }) => (
                                    <Select {...field} label="Status">
                                        <MenuItem value="todo">To Do</MenuItem>
                                        <MenuItem value="in-progress">In Progress</MenuItem>
                                        <MenuItem value="completed">Completed</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.status && (
                                <Typography variant="caption" color="error">
                                    {errors.status.message}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Due Date Picker */}
                    <Grid size={{ xs: 12 }}>
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
                                            variant: 'outlined',
                                            fullWidth: true,
                                            error: !!errors.dueDate,
                                            helperText: errors.dueDate?.message,
                                            sx: getInputStyles(),
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    {/* Action Buttons */}
                    <Grid size={{ xs: 12 }} >
                        <DialogActions sx={{ paddingTop: 2 }}>
                            <Button onClick={onClose} color="inherit">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                {isEditMode ? 'Update Task' : 'Add Task'}
                            </Button>
                        </DialogActions>
                    </Grid>
                </Grid>
            </Box>
        </LocalizationProvider>
    );
};

export default TaskForm;
