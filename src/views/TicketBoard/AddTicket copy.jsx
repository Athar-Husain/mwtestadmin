// src/Tickets/AddTicket.jsx
import React, { useEffect, useRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Autocomplete, CircularProgress, Box
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createInternalTicket } from '../../redux/features/Tickets/TicketSlice';
import { getAllConnections } from '../../redux/features/Connection/ConnectionSlice';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

const AddTicket = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const { connections, isConnectionLoading } = useSelector((state) => state.connection);


    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            subject: '',
            description: '',
            priority: 'Medium',
            status: 'Open',
            connectionId: ''
        }
    });

    // Autofocus input
    const subjectRef = useRef();

    useEffect(() => {
        if (open) {
            dispatch(getAllConnections());
            // Focus the first field
            setTimeout(() => subjectRef.current?.focus(), 100);
        }
    }, [open, dispatch]);

    const onSubmit = async (data) => {
        try {
            await dispatch(createInternalTicket(data));
            toast.success("Ticket created successfully");
            reset();
            handleClose();
        } catch (error) {
            toast.error(`Error creating ticket: ${error?.message || 'Unknown error'}`);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                reset(); // Clear form on close
                handleClose();
            }}
            fullWidth
            maxWidth="sm"
            disableEnforceFocus={false}
            disableAutoFocus={false}
            disableRestoreFocus={false}
        >
            <DialogTitle>Add New Ticket</DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>

                    {/* Connection */}
                    {/* <Controller
                        name="connectionId"
                        control={control}
                        rules={{ required: 'Connection is required' }}
                        render={({ field }) => (
                            // <Autocomplete
                            //     {...field}
                            //     options={connections}
                            //     getOptionLabel={(opt) =>
                            //         opt?.userId && opt?.userName
                            //             ? `${opt.userId} – ${opt.userName}`
                            //             : ''
                            //     }
                            //     onChange={(_, value) => field.onChange(value?._id)}
                            //     value={connections.find((c) => c._id === field.value) || null}
                            //     loading={isConnectionLoading}
                            //     disableClearable
                            //     renderInput={(params) => (
                            //         <TextField
                            //             {...params}
                            //             label="Select Connection"
                            //             variant="outlined"
                            //             error={!!errors.connectionId}
                            //             helperText={errors.connectionId?.message}
                            //         />
                            //     )}
                            // />
                            <Autocomplete
                                {...field}
                                options={connections}
                                getOptionLabel={(opt) =>
                                    opt?.userId && opt?.userName
                                        ? `${opt.userId} – ${opt.userName}`
                                        : ''
                                }
                                onChange={(_, value) => field.onChange(value?._id)}
                                value={connections.find((c) => c._id === field.value) || null}
                                loading={isConnectionLoading}
                                disableClearable
                                noOptionsText={
                                    isConnectionLoading ? 'Loading...' : 'No connections available'
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Connection"
                                        variant="outlined"
                                        error={!!errors.connectionId}
                                        helperText={
                                            errors.connectionId?.message ||
                                            (connections.length === 0 ? 'Please add connections first' : '')
                                        }
                                    />
                                )}
                                disabled={connections.length === 0}
                            />

                        )}
                    /> */}
                    <Controller
                        name="connectionId"
                        control={control}
                        rules={{ required: 'Connection is required' }}
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                options={connections.length > 0 ? connections : []}
                                getOptionLabel={(opt) =>
                                    opt?.userId && opt?.userName
                                        ? `${opt.userId} – ${opt.userName}`
                                        : ''
                                }
                                onChange={(_, value) => field.onChange(value?._id)}
                                value={
                                    connections.find((c) => c._id === field.value) || null
                                }
                                loading={isConnectionLoading}
                                disableClearable
                                noOptionsText={
                                    isConnectionLoading
                                        ? 'Loading...'
                                        : 'No connections to show'
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Connection"
                                        variant="outlined"
                                        error={!!errors.connectionId}
                                        helperText={
                                            errors.connectionId?.message ||
                                            (connections.length === 0
                                                ? 'Please add connections first'
                                                : '')
                                        }
                                    />
                                )}
                                disabled={connections.length === 0}
                            />
                        )}
                    />


                    {/* Subject */}
                    {/* <Controller
                        name="subject"
                        control={control}
                        rules={{ required: 'Subject is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                inputRef={subjectRef}
                                label="Subject"
                                fullWidth
                                variant="outlined"
                                error={!!errors.subject}
                                helperText={errors.subject?.message}
                            />
                        )}
                    /> */}

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
                                variant="outlined"
                                multiline
                                rows={4}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        )}
                    />

                    {/* Priority */}
                    <Controller
                        name="priority"
                        control={control}
                        rules={{ required: 'Priority is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Priority"
                                select
                                fullWidth
                                variant="outlined"
                                error={!!errors.priority}
                                helperText={errors.priority?.message}
                            >
                                {['Low', 'Medium', 'High'].map((priority) => (
                                    <MenuItem key={priority} value={priority}>
                                        {priority}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    {/* Status */}
                    {/* <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'Status is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Status"
                                select
                                fullWidth
                                variant="outlined"
                                error={!!errors.status}
                                helperText={errors.status?.message}
                            >
                                {['Open', 'In Progress', 'Closed'].map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    /> */}


                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    color="primary"
                    variant="contained"
                    disabled={isConnectionLoading}
                >
                    {isConnectionLoading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        'Add Ticket'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTicket;
