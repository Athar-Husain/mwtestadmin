
import React, { useState } from "react";
import {
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Breadcrumbs from '../../component/Breadcrumb';
import { gridSpacing } from '../../config.js';

const RewardManagement = () => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            rewardType: "",
            rewardDescription: "",
            rewardValue: "",
            applicability: "",
        },
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };



    return (
        <Box sx={{
            p: 3,
            my: 3,
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#f5f5f5', // Light grey background
            display: 'flex',
            gap: 5,
            flexDirection: 'column',
        }}>
            <Grid container spacing={gridSpacing} style={{ display: 'flex', flexWrap: 'wrap' }}>

                <Grid size={{ xs: 12, sm: 6, md: 4 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <FormControl fullWidth>
                        <InputLabel id="reward-type-label">Reward Type</InputLabel>
                        <Controller
                            name="rewardType"
                            control={control}
                            rules={{ required: "Reward Type is required" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="reward-type-label"
                                    label="Reward Type"
                                    style={{ width: 250 }} // Fixed width for alignment
                                >
                                    <MenuItem value="maintenance">Free Maintenance</MenuItem>
                                    <MenuItem value="repair">Free Repair</MenuItem>
                                    <MenuItem value="installation">Free Installation</MenuItem>
                                    <MenuItem value="discount">Subscription Discount</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                    {errors.rewardType && (
                        <Typography variant="body2" color="error">
                            {errors.rewardType.message}
                        </Typography>
                    )}
                </Grid>

                {/* Reward Description */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Controller
                        name="rewardDescription"
                        control={control}
                        rules={{ required: "Reward Description is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Reward Description"
                                fullWidth
                                variant="outlined"
                                style={{ width: 250 }} // Fixed width for alignment
                                error={!!errors.rewardDescription}
                                helperText={errors.rewardDescription?.message}
                            />
                        )}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} style={{ display: 'flex', flexWrap: 'wrap' }}>
                {/* Reward Value */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Controller
                        name="rewardValue"
                        control={control}
                        rules={{
                            required: "Reward Value is required",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Please enter a valid number",
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Reward Value (INR)"
                                fullWidth
                                type="number"
                                variant="outlined"
                                style={{ width: 250 }} // Fixed width for alignment
                                error={!!errors.rewardValue}
                                helperText={errors.rewardValue?.message}
                            />
                        )}
                    />
                </Grid>

                {/* Applicability Select */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <FormControl fullWidth>
                        <InputLabel id="applicability-label">Applicability</InputLabel>
                        <Controller
                            name="applicability"
                            control={control}
                            rules={{ required: "Applicability is required" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="applicability-label"
                                    label="Applicability"
                                    style={{ width: 250 }} // Fixed width for alignment
                                >
                                    <MenuItem value="specificSetupBox">Specific Setup Box</MenuItem>
                                    <MenuItem value="accountWide">Account-wide (Subscription Discount)</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                    {errors.applicability && (
                        <Typography variant="body2" color="error">
                            {errors.applicability.message}
                        </Typography>
                    )}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>Apply Reward</Button>
            </Grid>

        </Box>
    );
};

export default RewardManagement1;
