import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Button,
    DialogActions
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { users, projects } from './Index';

const TaskForm = ({ task, onSubmit, onClose, isEditMode = false }) => {
    const theme = useTheme();
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues:
            task || {
                title: '',
                description: '',
                projectId: '',
                status: 'todo',
                assignedTo: '',
                dueDate: ''
            }
    });

    useEffect(() => {
        reset(
            task || {
                title: '',
                description: '',
                projectId: '',
                status: 'todo',
                assignedTo: '',
                dueDate: ''
            }
        );
    }, [task, reset]);

    const inputLabelColor = theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary;
    const inputBorderColor = theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400];
    const inputTextColor = theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary;

    const commonFormControlSx = {
        mb: 3,
        '& .MuiInputLabel-root': { color: inputLabelColor },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: inputBorderColor },
            '&:hover fieldset': { borderColor: theme.palette.primary.main },
            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
            '& .MuiInputBase-input': { color: inputTextColor }
        },
        '& .MuiSelect-icon': { color: inputLabelColor }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 p-6 dark:bg-gray-800 rounded-b-xl"
                sx={{ minWidth: { xs: 'auto', sm: 400, md: 480 } }}
                noValidate
                autoComplete="off"
            >
                {/* Title */}
                <Controller
                    name="title"
                    control={control}
                    rules={{ required: 'Task title is required' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Task Title"
                            variant="outlined"
                            fullWidth
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            sx={{
                                mb: 3,
                                '& .MuiInputLabel-root': { color: inputLabelColor },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: inputBorderColor },
                                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                    '& .MuiInputBase-input': { color: inputTextColor }
                                }
                            }}
                            inputProps={{ maxLength: 100 }}
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
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            sx={{
                                mb: 3,
                                '& .MuiInputLabel-root': { color: inputLabelColor },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: inputBorderColor },
                                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                    '& .MuiInputBase-input': { color: inputTextColor }
                                }
                            }}
                            inputProps={{ maxLength: 500 }}
                        />
                    )}
                />

                {/* Project Select */}
                <FormControl fullWidth variant="outlined" error={!!errors.projectId} sx={commonFormControlSx}>
                    <InputLabel id="project-label">Project</InputLabel>
                    <Controller
                        name="projectId"
                        control={control}
                        rules={{ required: 'Project is required' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                labelId="project-label"
                                label="Project"
                                displayEmpty
                                inputProps={{ 'aria-label': 'Project select' }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {projects.map((project) => (
                                    <MenuItem key={project.id} value={project.id}>
                                        {project.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.projectId && (
                        <Typography color="error" variant="caption" mt={0.5}>
                            {errors.projectId.message}
                        </Typography>
                    )}
                </FormControl>

                {/* Assigned To Select */}
                <FormControl fullWidth variant="outlined" error={!!errors.assignedTo} sx={commonFormControlSx}>
                    <InputLabel id="assigned-label">Assigned To</InputLabel>
                    <Controller
                        name="assignedTo"
                        control={control}
                        rules={{ required: 'Assignee is required' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                labelId="assigned-label"
                                label="Assigned To"
                                displayEmpty
                                inputProps={{ 'aria-label': 'Assigned to select' }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.assignedTo && (
                        <Typography color="error" variant="caption" mt={0.5}>
                            {errors.assignedTo.message}
                        </Typography>
                    )}
                </FormControl>

                {/* Status Select */}
                <FormControl fullWidth variant="outlined" error={!!errors.status} sx={commonFormControlSx}>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'Status is required' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                labelId="status-label"
                                label="Status"
                                inputProps={{ 'aria-label': 'Status select' }}
                            >
                                <MenuItem value="todo">To Do</MenuItem>
                                <MenuItem value="in-progress">In Progress</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                        )}
                    />
                    {errors.status && (
                        <Typography color="error" variant="caption" mt={0.5}>
                            {errors.status.message}
                        </Typography>
                    )}
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
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.dueDate}
                                    helperText={errors.dueDate ? errors.dueDate.message : ''}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        mb: 3,
                                        '& .MuiInputLabel-root': { color: inputLabelColor },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: inputBorderColor },
                                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            '& .MuiInputBase-input': { color: inputTextColor }
                                        }
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        placeholder: 'YYYY-MM-DD'
                                    }}
                                />
                            )}
                        />
                    )}
                />

                <DialogActions sx={{ px: 0, pt: 2 }}>
                    <Button
                        onClick={onClose}
                        color="inherit"
                        sx={{
                            color: inputTextColor,
                            textTransform: 'none',
                            fontWeight: 600,
                            mr: 2
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none', fontWeight: 600 }}>
                        {isEditMode ? 'Update Task' : 'Add Task'}
                    </Button>
                </DialogActions>
            </Box>
        </LocalizationProvider>
    );
};

export default TaskForm;
