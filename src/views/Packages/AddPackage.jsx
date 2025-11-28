import React from "react";
import {
    Box,
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
    MenuItem,
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Breadcrumbs from '../../component/Breadcrumb';
import { gridSpacing } from '../../config.js';

const durations = [
    { label: "Select One", value: "" },
    { label: "1 Month", value: "1_month" },
    { label: "3 Months", value: "3_months" },
    { label: "6 Months", value: "6_months" },
    { label: "12 Months", value: "12_months" },
];

const AddPackage = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        register,
    } = useForm({
        defaultValues: {
            name: "",
            duration: "",
            price: "",
            internetSpeed: "",
            features: [{ value: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "features",
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <>
            <Breadcrumbs
                // title=""
                links={[
                    { label: 'Dashboard', to: '/' },
                    { label: 'Create Package' }, // no `to` means current page
                ]}
                divider
            />

            <Grid
                container
                spacing={gridSpacing}
                justifyContent="center"
                alignItems="center"

            >
                <Grid item xs={12} sm={8} md={6}>
                    <Paper sx={{ padding: 3 }}>
                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                            noValidate
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                            }}
                        >
                            {/* Name */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} sx={{ minWidth: "280px" }}>
                                    <Typography
                                        component="label"
                                        htmlFor="name"
                                        sx={{ fontWeight: 600, mb: 1, display: "block" }}
                                    >
                                        Name <Typography component="span" color="error">*</Typography>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        id="name"
                                        {...register("name", { required: "Name is required" })}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        placeholder="Enter package name"
                                        variant="outlined"
                                        size="medium"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} sx={{ minWidth: "280px" }}>
                                    <Typography
                                        component="label"
                                        htmlFor="duration"
                                        sx={{ fontWeight: 600, mb: 1, display: "block" }}
                                    >
                                        Duration <Typography component="span" color="error">*</Typography>
                                    </Typography>
                                    <TextField
                                        select
                                        fullWidth
                                        id="duration"
                                        {...register("duration", { required: "Duration is required" })}
                                        error={!!errors.duration}
                                        helperText={errors.duration?.message}
                                        variant="outlined"
                                        size="medium"
                                        defaultValue=""
                                    >
                                        {durations.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>

                            {/* Duration & Price */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} sx={{ minWidth: "280px" }}>
                                    <Typography
                                        component="label"
                                        htmlFor="price"
                                        sx={{ fontWeight: 600, mb: 1, display: "block" }}
                                    >
                                        Price <Typography component="span" color="error">*</Typography>
                                    </Typography>


                                    <TextField
                                        fullWidth
                                        id="price"
                                        {...register("price", {
                                            required: "Price is required",
                                            pattern: {
                                                value: /^\d+(\.\d{1,2})?$/,
                                                message: "Invalid price format",
                                            },
                                        })}
                                        error={!!errors.price}
                                        helperText={errors.price?.message}
                                        placeholder="Enter price"
                                        variant="outlined"
                                        size="medium"
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end" sx={{ bgcolor: 'grey.200', padding: '0 8px', }}>
                                                        INR
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />


                                </Grid>

                                <Grid item xs={12} sm={6} sx={{ minWidth: "280px" }}>
                                    <Typography
                                        component="label"
                                        htmlFor="internetSpeed"
                                        sx={{ fontWeight: 600, mb: 1, display: "block" }}
                                    >
                                        Internet Speed <Typography component="span" color="error">*</Typography>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        id="internetSpeed"
                                        {...register("internetSpeed", {
                                            required: "Internet Speed is required",
                                            pattern: {
                                                value: /^\d+$/,
                                                message: "Invalid speed format",
                                            },
                                        })}
                                        error={!!errors.internetSpeed}
                                        helperText={errors.internetSpeed?.message}
                                        placeholder="Enter internet speed"
                                        variant="outlined"
                                        size="medium"
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end" sx={{ bgcolor: 'grey.200', padding: '0 8px', }}>
                                                        Mbps
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {/* Features (dynamic) */}
                            <Box>
                                <Typography sx={{ fontWeight: 600, mb: 1 }}>Features</Typography>
                                {fields.map((field, index) => (
                                    <Box key={field.id} display="flex" mb={2}>
                                        <Controller
                                            name={`features.${index}.value`}
                                            control={control}
                                            rules={{ required: "Feature cannot be empty" }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    placeholder={`Feature #${index + 1}`}
                                                    error={!!(errors.features && errors.features[index])}
                                                    helperText={
                                                        errors.features && errors.features[index]
                                                            ? errors.features[index].value?.message
                                                            : ""
                                                    }
                                                    variant="outlined"
                                                    size="medium"
                                                />
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            color="success"
                                            sx={{
                                                borderTopLeftRadius: 0,
                                                borderBottomLeftRadius: 0,
                                                ml: 0,
                                                minWidth: 48,
                                            }}
                                            onClick={() => append({ value: "" })}
                                            aria-label="Add feature"
                                        >
                                            <AddIcon />
                                        </Button>
                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                color="error"
                                                sx={{
                                                    borderTopLeftRadius: 0,
                                                    borderBottomLeftRadius: 0,
                                                    ml: 1,
                                                    minWidth: 48,
                                                }}
                                                onClick={() => remove(index)}
                                                aria-label="Remove feature"
                                            >
                                                <RemoveIcon />
                                            </Button>
                                        )}
                                    </Box>
                                ))}
                            </Box>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    bgcolor: "#3f44f7",
                                    "&:hover": { bgcolor: "#353ce0" },
                                    py: 1,
                                    fontWeight: "normal",
                                    fontSize: "1rem",
                                    borderRadius: 2,
                                    boxShadow: "none",
                                }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default AddPackage;
