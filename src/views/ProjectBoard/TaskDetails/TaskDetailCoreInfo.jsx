// ProjectBoard/TaskDetailCoreInfo.jsx
import React from 'react';
import {
    Box, Typography, TextField
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Controller } from 'react-hook-form';
import { grey } from '@mui/material/colors';

const TaskDetailCoreInfo = ({ control, errors, task, onUpdateTask, isEditingTitle, setIsEditingTitle, isEditingDescription, setIsEditingDescription, watchedTitle, watchedDescription }) => {
    const theme = useTheme();

    const textColor = theme.palette.mode === 'dark' ? grey[100] : grey[800];
    const secondaryTextColor = theme.palette.mode === 'dark' ? grey[400] : theme.palette.text.secondary;
    const inputBorderColor = theme.palette.mode === 'dark' ? grey[600] : grey[400];
    const inputTextColor = theme.palette.mode === 'dark' ? grey[100] : theme.palette.text.primary;

    const handleSaveTitle = (data) => {
        onUpdateTask({ ...task, title: data.title });
        setIsEditingTitle(false);
    };

    const handleSaveDescription = (data) => {
        onUpdateTask({ ...task, description: data.description });
        setIsEditingDescription(false);
    };

    return (
        <Box sx={{ marginBottom: theme.spacing(3) }}> {/* mb-6 */}
            {isEditingTitle ? (
                <Controller
                    name="title"
                    control={control}
                    rules={{ required: 'Title cannot be empty' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            variant="outlined"
                            onBlur={() => control.handleSubmit(handleSaveTitle)()}
                            onKeyDown={(e) => { if (e.key === 'Enter') control.handleSubmit(handleSaveTitle)(); }}
                            autoFocus
                            error={!!errors.title}
                            helperText={errors.title ? errors.title.message : ''}
                            sx={{
                                '& .MuiInputBase-input': { fontSize: '1.25rem', fontWeight: 600, color: inputTextColor },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: inputBorderColor },
                                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
                                }
                            }}
                        />
                    )}
                />
            ) : (
                <Typography
                    variant="h5" // Matches text-lg
                    onClick={() => setIsEditingTitle(true)}
                    sx={{
                        fontWeight: 600, // font-semibold
                        color: textColor, // text-gray-800
                        marginBottom: theme.spacing(0.5), // mb-1
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    {watchedTitle || 'Click to add a title'}
                </Typography>
            )}
            {isEditingDescription ? (
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={2}
                            variant="outlined"
                            onBlur={() => control.handleSubmit(handleSaveDescription)()}
                            autoFocus
                            sx={{
                                marginTop: theme.spacing(1), // mt-1
                                '& .MuiInputBase-input': { fontSize: '0.875rem', color: inputTextColor }, // text-xs, though 0.875rem is text-sm
                                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: inputBorderColor } }
                            }}
                        />
                    )}
                />
            ) : (
                <Typography
                    variant="body2" // Matches text-xs
                    onClick={() => setIsEditingDescription(true)}
                    sx={{
                        color: secondaryTextColor, // text-gray-400
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    {watchedDescription || 'Click to add a description'}
                </Typography>
            )}
        </Box>
    );
};

export default TaskDetailCoreInfo;
