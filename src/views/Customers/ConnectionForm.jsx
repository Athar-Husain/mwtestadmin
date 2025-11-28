import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    RadioGroup,
    FormControlLabel,
    Radio,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';

const ConnectionForm = () => {
    // Dummy data for customers
    const [dummyCustomers, setDummyCustomers] = useState([
        { _id: 'cust1', firstName: 'Alice', lastName: 'Smith', email: 'alice.smith@example.com', phone: '1234567890' },
        { _id: 'cust2', firstName: 'Bob', lastName: 'Johnson', email: 'bob.j@example.com', phone: '0987654321' },
        { _id: 'cust3', firstName: 'Charlie', lastName: 'Brown', email: 'charlie.b@example.com', phone: '1122334455' },
    ]);
    const [dummyLoading, setDummyLoading] = useState(false);
    const [dummyError, setDummyError] = useState(null);

    const [mode, setMode] = useState('new'); // 'new' or 'existing'
    const [foundCustomer, setFoundCustomer] = useState(null); // Stores the customer found by phone search

    // State for custom alert messages
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            customer: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
            },
            searchPhone: '', // New field for phone search
            connections: [{ boxId: '', stbNumber: '', userId: '', userName: '', connectionType: '', connectionStatus: 'Active', serviceArea: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'connections',
    });

    const watchSearchPhone = watch('searchPhone');

    // Reset found customer and connections when mode changes
    useEffect(() => {
        setFoundCustomer(null);
        setValue('searchPhone', ''); // Clear search phone input
        reset(prev => ({
            ...prev,
            connections: [{ boxId: '', stbNumber: '', userId: '', userName: '', connectionType: '', connectionStatus: 'Active', serviceArea: '' }]
        }));
    }, [mode, reset, setValue]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleSearchCustomer = async () => {
        setDummyLoading(true);
        setDummyError(null);
        setFoundCustomer(null); // Clear previous search result

        const phoneToSearch = watchSearchPhone;

        if (!phoneToSearch || !/^[0-9]{10}$/.test(phoneToSearch)) {
            setSnackbarMessage('Please enter a valid 10-digit phone number to search.');
            setSnackbarSeverity('warning');
            setOpenSnackbar(true);
            setDummyLoading(false);
            return;
        }

        try {
            // Simulate API call delay for searching
            await new Promise(resolve => setTimeout(resolve, 1000));

            const customer = dummyCustomers.find(cust => cust.phone === phoneToSearch);

            if (customer) {
                setFoundCustomer(customer);
                setSnackbarMessage(`Customer found: ${customer.firstName} ${customer.lastName}`);
                setSnackbarSeverity('success');
            } else {
                setSnackbarMessage('No customer found with that phone number.');
                setSnackbarSeverity('info');
            }
            setOpenSnackbar(true);
        } catch (err) {
            console.error('Error searching customer:', err);
            setDummyError('An error occurred during customer search.');
            setSnackbarMessage('An error occurred during customer search.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setDummyLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setDummyLoading(true);
        setDummyError(null);

        try {
            // Simulate API call delay for submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (mode === 'new') {
                console.log('New Customer Data:', data.customer);
                console.log('Connections for New Customer:', data.connections);
                setSnackbarMessage('New customer and connections added successfully!');
                setSnackbarSeverity('success');
                reset(); // Reset entire form, including customer fields
            } else {
                if (!foundCustomer) {
                    setSnackbarMessage('Please search and select an existing customer before adding connections.');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                    return;
                }
                console.log('Existing Customer ID:', foundCustomer._id);
                console.log('Connections for Existing Customer:', data.connections);
                setSnackbarMessage(`Connections added to existing customer ${foundCustomer.firstName} ${foundCustomer.lastName}!`);
                setSnackbarSeverity('success');
                reset({
                    searchPhone: '',
                    connections: [{ boxId: '', stbNumber: '', userId: '', userName: '', connectionType: '', connectionStatus: 'Active', serviceArea: '' }],
                });
                setFoundCustomer(null); // Clear found customer after submission
            }
            setOpenSnackbar(true);
        } catch (err) {
            console.error(err);
            setDummyError('An error occurred during submission.');
            setSnackbarMessage('An error occurred during submission.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setDummyLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
            <Typography variant="h5" mb={3} align="center">
                {mode === 'new' ? 'Create New Customer with Connections' : 'Add Connections to Existing Customer'}
            </Typography>

            <RadioGroup
                row
                value={mode}
                onChange={e => setMode(e.target.value)}
                sx={{ mb: 3 }}
            >
                <FormControlLabel value="new" control={<Radio />} label="New Customer" />
                <FormControlLabel value="existing" control={<Radio />} label="Existing Customer" />
            </RadioGroup>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {mode === 'new' && (
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                {...register('customer.firstName', { required: 'First name is required' })}
                                error={!!errors.customer?.firstName}
                                helperText={errors.customer?.firstName?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                {...register('customer.lastName', { required: 'Last name is required' })}
                                error={!!errors.customer?.lastName}
                                helperText={errors.customer?.lastName?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                {...register('customer.email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                                error={!!errors.customer?.email}
                                helperText={errors.customer?.email?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Phone"
                                {...register('customer.phone', {
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Phone number must be exactly 10 digits',
                                    },
                                })}
                                error={!!errors.customer?.phone}
                                helperText={errors.customer?.phone?.message}
                                type="number"
                                inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                {...register('customer.password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                })}
                                error={!!errors.customer?.password}
                                helperText={errors.customer?.password?.message}
                            />
                        </Grid>
                    </Grid>
                )}

                {mode === 'existing' && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" mb={1}>
                            Search Existing Customer by Phone Number
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12 }} sm={8}>
                                <TextField
                                    fullWidth
                                    label="Customer Phone Number (10 digits)"
                                    type="number"
                                    {...register('searchPhone', {
                                        required: 'Phone number is required to search',
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: 'Phone number must be exactly 10 digits',
                                        },
                                    })}
                                    error={!!errors.searchPhone}
                                    helperText={errors.searchPhone?.message}
                                    inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }} sm={4}>
                                <Button
                                    variant="contained"
                                    onClick={handleSearchCustomer}
                                    disabled={dummyLoading}
                                    fullWidth
                                >
                                    {dummyLoading ? <CircularProgress size={24} color="inherit" /> : 'Search Customer'}
                                </Button>
                            </Grid>
                        </Grid>

                        {foundCustomer && (
                            <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f9f9f9' }}>
                                <Typography variant="body1">
                                    <strong>Found Customer:</strong> {foundCustomer.firstName} {foundCustomer.lastName}
                                </Typography>
                                <Typography variant="body2">
                                    Email: {foundCustomer.email}
                                </Typography>
                                <Typography variant="body2">
                                    Phone: {foundCustomer.phone}
                                </Typography>
                            </Box>
                        )}
                        {!foundCustomer && watchSearchPhone && !dummyLoading && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Enter a phone number and click "Search Customer".
                            </Alert>
                        )}
                        {!foundCustomer && !watchSearchPhone && !dummyLoading && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Please enter a phone number and click "Search Customer" to find an existing customer.
                            </Alert>
                        )}
                        {dummyError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {dummyError}
                            </Alert>
                        )}
                    </Box>
                )}

                {/* Connections Fields - Shown only if a customer is found or in new mode */}
                {(mode === 'new' || foundCustomer) && (
                    <Box mt={4}>
                        <Typography variant="h6" mb={2}>
                            Connections
                        </Typography>

                        {fields.map((field, index) => (
                            <Box key={field.id} mb={3} p={2} border={1} borderRadius={1} borderColor="grey.300">
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Box ID"
                                            fullWidth
                                            {...register(`connections.${index}.boxId`, { required: 'Box ID is required' })}
                                            error={!!errors.connections?.[index]?.boxId}
                                            helperText={errors.connections?.[index]?.boxId?.message}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="STB Number"
                                            fullWidth
                                            {...register(`connections.${index}.stbNumber`, { required: 'STB Number is required' })}
                                            error={!!errors.connections?.[index]?.stbNumber}
                                            helperText={errors.connections?.[index]?.stbNumber?.message}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="User ID"
                                            fullWidth
                                            {...register(`connections.${index}.userId`, { required: 'User ID is required' })}
                                            error={!!errors.connections?.[index]?.userId}
                                            helperText={errors.connections?.[index]?.userId?.message}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="User Name"
                                            fullWidth
                                            {...register(`connections.${index}.userName`, { required: 'User Name is required' })}
                                            error={!!errors.connections?.[index]?.userName}
                                            helperText={errors.connections?.[index]?.userName?.message}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Connection Type"
                                            fullWidth
                                            select
                                            {...register(`connections.${index}.connectionType`, { required: 'Connection Type is required' })}
                                            error={!!errors.connections?.[index]?.connectionType}
                                            helperText={errors.connections?.[index]?.connectionType?.message}
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">Select connection type</option>
                                            <option value="Fiber">Fiber</option>
                                            <option value="DSL">DSL</option>
                                            <option value="Cable">Cable</option>
                                        </TextField>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Connection Status"
                                            fullWidth
                                            select
                                            {...register(`connections.${index}.connectionStatus`, { required: 'Connection Status is required' })}
                                            error={!!errors.connections?.[index]?.connectionStatus}
                                            helperText={errors.connections?.[index]?.connectionStatus?.message}
                                            SelectProps={{ native: true }}
                                            defaultValue="Active"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Suspended">Suspended</option>
                                            <option value="Pending">Pending</option>
                                        </TextField>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            label="Service Area"
                                            fullWidth
                                            {...register(`connections.${index}.serviceArea`, { required: 'Service Area is required' })}
                                            error={!!errors.connections?.[index]?.serviceArea}
                                            helperText={errors.connections?.[index]?.serviceArea?.message}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {fields.length > 1 && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => remove(index)}
                                            >
                                                Remove Connection
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}

                        <Button
                            variant="contained"
                            onClick={() =>
                                append({
                                    boxId: '',
                                    stbNumber: '',
                                    userId: '',
                                    userName: '',
                                    connectionType: '',
                                    connectionStatus: 'Active',
                                    serviceArea: '',
                                })
                            }
                        >
                            Add Another Connection
                        </Button>
                    </Box>
                )}


                <Box mt={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        disabled={dummyLoading || (mode === 'existing' && !foundCustomer)}
                    >
                        {dummyLoading ? 'Submitting...' : mode === 'new' ? 'Create Customer & Add Connections' : 'Add Connections'}
                    </Button>
                </Box>
            </form>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ConnectionForm;
