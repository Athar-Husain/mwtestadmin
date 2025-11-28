import React, { useEffect } from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Grid,
    Button,
    Autocomplete,
    CircularProgress,
    Typography,
    Container,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { getAllServiceAreas } from '../../redux/features/Area/AreaSlice';
import { registerTeamMember } from '../../redux/features/Team/TeamSlice';

const AddTeam = () => {
    const dispatch = useDispatch();
    const { areas, isAreaLoading, areaError } = useSelector((state) => state.area);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            role: 'technician',
            status: 'active',
            region: [],
        },
    });

    // Fetch areas on component mount
    useEffect(() => {
        dispatch(getAllServiceAreas());
    }, [dispatch]);

    // Remove duplicates from the areas list based on _id (or any unique identifier)
    const uniqueAreas = areas.filter(
        (value, index, self) =>
            index === self.findIndex((t) => t._id === value._id)
    );

    const onSubmit = (data) => {
        // console.log('Form data:', data);
        dispatch(registerTeamMember(data));
    };

    return (
        <Container>
            <Box
                sx={{
                    maxWidth: 800,
                    margin: 'auto',
                    padding: 4,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 4,
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    Add New Team Member
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        {/* First Name */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="firstName"
                                control={control}
                                rules={{ required: 'First name is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="First Name"
                                        fullWidth
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Last Name */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="lastName"
                                control={control}
                                rules={{ required: 'Last name is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Last Name"
                                        fullWidth
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Email */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email address',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Password */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Minimum 6 characters',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Password"
                                        type="password"
                                        fullWidth
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Phone Number (Indian format) */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^[6-9]\d{9}$/,
                                        message: 'Invalid phone number. Must be 10 digits starting with 6, 7, 8, or 9.',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Phone Number"
                                        type="tel"
                                        fullWidth
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                        inputProps={{
                                            maxLength: 10,
                                        }}
                                        placeholder="Enter 10-digit number"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Role */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id="role-label">Role</InputLabel>
                                        <Select {...field} labelId="role-label" label="Role">
                                            <MenuItem value="technician">Technician</MenuItem>
                                            <MenuItem value="agent">Agent</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        {/* Regions */}
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="region"
                                control={control}
                                rules={{ required: 'Select at least one region' }}
                                render={({ field: { onChange, value }, fieldState }) => (
                                    <Autocomplete
                                        multiple
                                        options={uniqueAreas || []}  // Use the filtered unique list
                                        loading={isAreaLoading}
                                        value={value}
                                        onChange={(_, newValue) => {
                                            // Remove duplicate regions from selected values
                                            const uniqueSelectedRegions = Array.from(
                                                new Set(newValue.map((item) => item._id))
                                            ).map((id) => newValue.find((item) => item._id === id));

                                            onChange(uniqueSelectedRegions);
                                        }}
                                        getOptionLabel={(option) => option.region}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Regions"
                                                placeholder="Select regions"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {isAreaLoading && (
                                                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                                            )}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Submit */}
                        <Grid size={{ xs: 12 }}>
                            <Button variant="contained" color="primary" fullWidth type="submit">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default AddTeam;
