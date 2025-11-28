import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormHelperText,
    Grid,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServiceAreas } from '../../../redux/features/Area/AreaSlice';

const ConnectionDetails = ({ onSubmit, prevStep }) => {
    const dispatch = useDispatch();

    // Get service areas from Redux
    const { areas } = useSelector((state) => state.area);

    // Get customerId from Redux (e.g., auth slice)
    // const { customerId } = useSelector((state) => state.auth.user); // Adjust this path as needed

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        dispatch(getAllServiceAreas());
    }, [dispatch]);

    let customerId = '72t87t18g8d8b'

    return (
        <form onSubmit={handleSubmit((data) => onSubmit({ ...data, customerId }))} noValidate>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Box ID"
                        {...register('boxId', { required: 'Box ID is required' })}
                        fullWidth
                        margin="normal"
                        error={!!errors.boxId}
                        helperText={errors.boxId?.message}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="STB Number"
                        {...register('stbNumber', { required: 'STB Number is required' })}
                        fullWidth
                        margin="normal"
                        error={!!errors.stbNumber}
                        helperText={errors.stbNumber?.message}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="User Name"
                        {...register('userName', { required: 'User Name is required' })}
                        fullWidth
                        margin="normal"
                        error={!!errors.userName}
                        helperText={errors.userName?.message}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="User ID"
                        {...register('userId', { required: 'User ID is required' })}
                        fullWidth
                        margin="normal"
                        error={!!errors.userId}
                        helperText={errors.userId?.message}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Alias Name"
                        {...register('aliasName')}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Contact Number"
                        {...register('contactNo')}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Region"
                        {...register('region')}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Connection Type"
                        {...register('connectionType', { required: 'Connection Type is required' })}
                        fullWidth
                        margin="normal"
                        error={!!errors.connectionType}
                        helperText={errors.connectionType?.message}
                    />
                </Grid>

                {/* Address Fields */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Street"
                        {...register('address.street')}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="City"
                        {...register('address.city')}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="State"
                        {...register('address.state')}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Country"
                        {...register('address.country')}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Pin Code"
                        {...register('address.pinCode')}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                {/* Service Area */}
                <Grid item xs={12} sm={6}>
                    <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.serviceArea}
                    >
                        <InputLabel id="area-label">Service Area</InputLabel>
                        <Controller
                            name="serviceArea"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Service Area is required' }}
                            render={({ field }) => (
                                <Select
                                    labelId="area-label"
                                    label="Service Area"
                                    {...field}
                                >
                                    {areas.map((area) => (
                                        <MenuItem key={area._id} value={area._id}>
                                            {area.region}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        <FormHelperText>{errors.serviceArea?.message}</FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
                style={{ marginTop: '16px' }}
            >
                Next
            </Button>
            <Button
                variant="outlined"
                onClick={prevStep}
                style={{ marginTop: '16px' }}
            >
                Previous
            </Button>
        </form>
    );
};

export default ConnectionDetails;
