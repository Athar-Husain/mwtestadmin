import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Grid, IconButton, MenuItem, TextField, Typography,
    InputAdornment, Paper, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { createPlan, getAllPlanCategories } from '../../redux/features/Plan/PlanSlice';

const durations = [
    { label: "1 Month", value: "1-month" },
    { label: "3 Months", value: "3-months" },
    { label: "6 Months", value: "6-months" },
    { label: "12 Months", value: "12-months" },
];

const dataLimitOptions = [
    { label: "Limited", value: "limited" },
    { label: "Unlimited", value: "unlimited" },
];

const speedUnits = [
    { label: "mbps", value: "mbps" },
    { label: "Mbps", value: "Mbps" },
    { label: "Gbps", value: "gbps" },
];

const CreatePlan = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories } = useSelector(state => state.plan);

    const {
        control,
        handleSubmit,
        formState: { errors },
        register,
        watch,
        setValue
    } = useForm({
        defaultValues: {
            name: "",
            duration: "",
            price: "",
            internetSpeed: "",
            internetSpeedUnit: "mbps",
            dataLimitType: "limited",
            dataLimit: "",
            description: "",
            category: "",
            features: [{ value: "" }],
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "features" });
    const dataLimitType = watch("dataLimitType");

    useEffect(() => {
        dispatch(getAllPlanCategories());
    }, [dispatch]);

    const onSubmit = async (data) => {
        const transformed = {
            ...data,
            features: data.features.map(f => f.value),
        };
        try {
            await dispatch(createPlan(transformed)).unwrap();
            navigate("/plans");
        } catch (err) {
            console.error("Error creating plan", err);
        }
    };

    return (
        <Box maxWidth="900px" mx="auto" p={3}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Create New Plan
            </Typography>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Typography variant="h6" gutterBottom>Plan Information</Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Plan Name"
                                fullWidth
                                {...register("name", { required: "Name is required" })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                label="Duration"
                                fullWidth
                                {...register("duration", { required: "Duration is required" })}
                                error={!!errors.duration}
                                helperText={errors.duration?.message}
                                value={watch("duration") || ""}
                                onChange={e => setValue("duration", e.target.value)}
                            >
                                {durations.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                label="Category"
                                fullWidth
                                {...register("category", { required: "Category is required" })}
                                error={!!errors.category}
                                helperText={errors.category?.message}
                                value={watch("category") || ""}
                                onChange={e => setValue("category", e.target.value)}
                            >
                                {categories.length > 0 ? categories.map(c => (
                                    <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                                )) : <MenuItem value="">No categories</MenuItem>}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Price"
                                fullWidth
                                {...register("price", {
                                    required: "Price is required",
                                    pattern: {
                                        value: /^\d+(\.\d{1,2})?$/,
                                        message: "Invalid price format"
                                    }
                                })}
                                error={!!errors.price}
                                helperText={errors.price?.message}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">INR</InputAdornment>
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 8, sm: 6 }}>
                            <TextField
                                label="Internet Speed"
                                fullWidth
                                {...register("internetSpeed", { required: "Required" })}
                                error={!!errors.internetSpeed}
                                helperText={errors.internetSpeed?.message}
                            />
                        </Grid>

                        <Grid size={{ xs: 4, sm: 6 }}>
                            <TextField
                                select
                                label="Speed Unit"
                                fullWidth
                                {...register("internetSpeedUnit")}
                                value={watch("internetSpeedUnit") || "mbps"}
                                onChange={e => setValue("internetSpeedUnit", e.target.value)}
                            >
                                {speedUnits.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                label="Data Limit Type"
                                fullWidth
                                {...register("dataLimitType")}
                                value={dataLimitType}
                                onChange={e => setValue("dataLimitType", e.target.value)}
                            >
                                {dataLimitOptions.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {dataLimitType === "limited" && (
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Data Limit (GB)"
                                    fullWidth
                                    {...register("dataLimit", { required: "Required" })}
                                    error={!!errors.dataLimit}
                                    helperText={errors.dataLimit?.message}
                                />
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={4}
                                {...register("description", { required: "Required" })}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        </Grid>
                    </Grid>

                    {/* Features */}
                    <Box mt={5}>
                        <Typography variant="h6" gutterBottom>Plan Features</Typography>
                        <Divider sx={{ mb: 2 }} />

                        {fields.map((field, index) => (
                            <Box key={field.id} display="flex" alignItems="center" mb={2}>
                                <Controller
                                    name={`features.${index}.value`}
                                    control={control}
                                    rules={{ required: "Feature is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label={`Feature #${index + 1}`}
                                            error={!!errors.features?.[index]?.value}
                                            helperText={errors.features?.[index]?.value?.message}
                                        />
                                    )}
                                />
                                <Box ml={1}>
                                    <IconButton onClick={() => remove(index)} disabled={fields.length === 1}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton onClick={() => append({ value: "" })}>
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {/* Submit Button */}
                    <Box mt={4}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                        >
                            Create Plan
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreatePlan;
