import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { registerCustomer } from '../../redux/features/Customers/CustomerSlice';

const Add = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const { customerError, customerloading } = useSelector((state) => state.customer);

    const onSubmit = async (data) => {
        const resultAction = await dispatch(registerCustomer(data));

        // If action fulfilled, reset the form
        if (registerCustomer.fulfilled.match(resultAction)) {
            reset(); // clear form
            // navigate('/customers'); // optional: navigate to customer list
        }
        // Else: toast is shown by slice; do nothing
    };

    return (
        <Box
            sx={{
                maxWidth: 500,
                mx: 'auto',
                mt: 5,
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: 'white',
            }}
        >
            <Typography variant="h5" mb={3} align="center">
                Add New Customer
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            {...register('firstName', { required: 'First name is required' })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            {...register('lastName', { required: 'Last name is required' })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email address',
                                },
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Phone"
                            {...register('phone', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'Phone number must be exactly 10 digits',
                                },
                            })}
                            type="number"
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                            inputProps={{
                                maxLength: 10,
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={customerloading}
                        >
                            {customerloading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default Add;
