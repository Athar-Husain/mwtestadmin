// ProjectBoard/TaskDetailDialog.jsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Button, Box, DialogContentText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { grey } from '@mui/material/colors';

// Import decomposed sub-components
import TaskDetailHeader from './TaskDetailHeader';
import TaskDetailCoreInfo from './TaskDetailCoreInfo';
import TaskDetailChecklist from './TaskDetailChecklist';
import TaskDetailActivity from './TaskDetailActivity';
import TaskDetailSidebar from './TaskDetailSidebar';

const TaskDetailDialog = ({ task, onUpdateTask, onDeleteTask, onClose }) => {
    const theme = useTheme();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingAssignee, setIsEditingAssignee] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo,
            projectId: task.projectId,
            status: task.status,
            dueDate: task.dueDate,
        }
    });

    const watchedAssignedTo = watch('assignedTo');
    const watchedTitle = watch('title');
    const watchedDescription = watch('description');


    useEffect(() => {
        // Reset form when task prop changes (e.g., if a different task is selected)
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
        setIsEditingTitle(false);
        setIsEditingDescription(false);
        setIsEditingAssignee(false);
    }, [task, reset]);

    const textColor = theme.palette.mode === 'dark' ? grey[100] : grey[800];
    const secondaryTextColor = theme.palette.mode === 'dark' ? grey[400] : theme.palette.text.secondary;
    const inputTextColor = theme.palette.mode === 'dark' ? grey[100] : theme.palette.text.primary;


    const handleCompleteTask = () => {
        onUpdateTask({ ...task, status: 'completed' });
    };

    const handleUpdateAssignee = (newAssigneeId) => {
        onUpdateTask({ ...task, assignedTo: newAssigneeId });
    };

    const handleDeleteConfirm = () => {
        onDeleteTask(task.id);
        setConfirmDeleteOpen(false);
        onClose();
    };

    // Placeholder for checklist items (future feature)
    const checklistItems = []; // Passed to TaskDetailChecklist

    return (
        <>
            <Dialog
                open={true}
                onClose={onClose}
                maxWidth="lg" // Larger dialog to fit content
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px', // rounded-xl
                        boxShadow: 24, // Equivalent to shadow-2xl
                        backgroundColor: theme.palette.mode === 'dark' ? grey[800] : theme.palette.background.paper,
                        color: textColor,
                        overflow: 'hidden', // Ensures inner content respects rounded corners
                        height: '80vh',
                        maxHeight: '800px',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' } // Responsive flex: column on small, row on medium+
                    }
                }}
            >
                {/* Left main content area */}
                <Box
                    sx={{
                        flex: 1, // flex-1
                        padding: theme.spacing(3), // p-6
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: theme.palette.background.paper,
                        color: textColor
                    }}
                >
                    <TaskDetailHeader
                        task={task}
                        onCompleteTask={handleCompleteTask}
                        onUpdateAssignee={handleUpdateAssignee}
                        onClose={onClose}
                        isEditingAssignee={isEditingAssignee}
                        setIsEditingAssignee={setIsEditingAssignee}
                    />

                    <TaskDetailCoreInfo
                        control={control}
                        errors={errors}
                        task={task}
                        onUpdateTask={onUpdateTask}
                        isEditingTitle={isEditingTitle}
                        setIsEditingTitle={setIsEditingTitle}
                        isEditingDescription={isEditingDescription}
                        setIsEditingDescription={setIsEditingDescription}
                        watchedTitle={watchedTitle}
                        watchedDescription={watchedDescription}
                    />

                    <TaskDetailChecklist checklistItems={checklistItems} />

                    <TaskDetailActivity task={task} />
                </Box>

                {/* Right sidebar */}
                <TaskDetailSidebar
                    task={task}
                    onUpdateTask={onUpdateTask}
                    control={control}
                    errors={errors}
                />
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        backgroundColor: theme.palette.mode === 'dark' ? grey[800] : theme.palette.background.paper,
                        color: textColor
                    }
                }}
            >
                <DialogTitle sx={{ color: textColor }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: secondaryTextColor }}>
                        Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: theme.spacing(2) }}>
                    <Button onClick={() => setConfirmDeleteOpen(false)} color="inherit" sx={{ color: inputTextColor }}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TaskDetailDialog;
