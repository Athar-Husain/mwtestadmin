import React from "react";
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
    Paper,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Breadcrumbs from "../../component/Breadcrumb";
import { gridSpacing } from "../../config.js";
import { SaveAlt as SaveIcon } from "@mui/icons-material";

const RewardManagement = () => {
    const { control, handleSubmit, formState: { errors } } = useForm({
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
        <>
            <Breadcrumbs
                links={[
                    { label: 'Dashboard', to: '/' },
                    { label: 'Refferals' },
                    { label: 'Create Reward' },
                ]}
                
            />
            <Box sx={{ p: 3, }}>
                {/* Breadcrumb */}


                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                        backgroundColor: "#fff",
                    }}
                >
                    <Grid container spacing={gridSpacing} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        // alignItems: 'center',
                        gap: 5,
                    }} >
                        {/* Title */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
                                Create Rewards System
                            </Typography>
                        </Grid>
                        <Grid container spacing={gridSpacing} style={{ display: 'flex', flexWrap: 'wrap' }}>


                            {/* Reward Type */}
                            <Grid container size={{ xs: 12, sm: 6, md: 4 }}>
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
                                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                        {errors.rewardType.message}
                                    </Typography>
                                )}
                            </Grid>

                            {/* Reward Description */}
                            <Grid container size={{ xs: 12, sm: 6, md: 4 }}>
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
                                            error={!!errors.rewardDescription}
                                            helperText={errors.rewardDescription?.message}
                                        />
                                    )}
                                />
                            </Grid>

                        </Grid>

                        <Grid container spacing={3} style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {/* Reward Value */}
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                                            error={!!errors.rewardValue}
                                            helperText={errors.rewardValue?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Applicability */}
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                                            >
                                                <MenuItem value="specificSetupBox">Specific Setup Box</MenuItem>
                                                <MenuItem value="accountWide">Account-wide (Subscription Discount)</MenuItem>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                                {errors.applicability && (
                                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                        {errors.applicability.message}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>

                        {/* Submit Button */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSubmit(onSubmit)}
                                sx={{
                                    py: 1,
                                    fontSize: "1rem",
                                    boxShadow: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <SaveIcon sx={{ mr: 1 }} />
                                Apply Reward
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </>
    );
};

export default RewardManagement;
