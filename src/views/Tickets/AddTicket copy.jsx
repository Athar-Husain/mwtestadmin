import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Autocomplete,
    CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createInternalTicket } from '../../redux/features/Tickets/TicketSlice';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getAllConnections } from '../../redux/features/Connection/ConnectionSlice';

const AddTicket = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const { connections, isLoading: isLoadingConnections } = useSelector((state) => state.connection);

    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    useEffect(() => {
        if (open) {
            dispatch(getAllConnections());
        }
    }, [open, dispatch]);

    const onSubmit = async (data) => {
        try {

            await dispatch(createInternalTicket(data));
            toast.success("Ticket created successfully");
            handleClose(); // Close the dialog after submitting
            reset(); // Reset form fields
        } catch (error) {
            toast.error(`Error creating ticket ` + error.message || 'Unknown error');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Ticket</DialogTitle>
            <DialogContent>
                {/* Connection Field */}
                <Controller
                    name="connectionId"
                    control={control}
                    rules={{ required: 'Connection is required' }}
                    render={({ field }) => (
                        <Autocomplete
                            {...field}
                            options={connections}
                            getOptionLabel={(opt) => `${opt.userId} – ${opt.userName}`}
                            onChange={(_, value) => field.onChange(value?._id)} // Set the connectionId (value is _id)
                            value={connections.find(conn => conn._id === field.value) || null} // Ensure value is controlled
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Connection"
                                    variant="outlined"
                                    error={!!errors.connectionId}
                                    helperText={errors.connectionId?.message}
                                />
                            )}
                            sx={{ mb: 2 }}
                            disableClearable
                            loading={isLoadingConnections}
                        />
                    )}
                />

                {/* Subject Field */}
                {/* <Controller
                    name="subject"
                    control={control}
                    rules={{ required: 'Subject is required' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Subject"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            error={!!errors.subject}
                            helperText={errors.subject?.message}
                        />
                    )}
                /> */}

                {/* Description Field */}
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
                            margin="normal"
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                    )}
                />

                {/* Status Field */}
                {/* <Controller
                    name="status"
                    control={control}
                    defaultValue="Open"
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Status"
                            variant="outlined"
                            fullWidth
                            select
                            margin="normal"
                        >
                            {['Open', 'In Progress', 'Closed'].map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                /> */}

                {/* Priority Field */}
                <Controller
                    name="priority"
                    control={control}
                    defaultValue="Medium"
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Priority"
                            variant="outlined"
                            fullWidth
                            select
                            margin="normal"
                        >
                            {['Low', 'Medium', 'High'].map((priority) => (
                                <MenuItem key={priority} value={priority}>
                                    {priority}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />
            </DialogContent>

            {/* Dialog Actions */}
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    color="primary"
                    variant="contained"
                    disabled={isLoadingConnections} // Disable if connections are loading
                >
                    {isLoadingConnections ? <CircularProgress size={24} color="inherit" /> : 'Add Ticket'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTicket;
