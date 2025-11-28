import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText } from "@mui/material";

// Dummy complaint issue types
const issueTypes = ["Speed", "Connection", "Setup Box Issue", "Billing", "Other"];

const RegisterComplaintScreen = () => {
  const [imageFile, setImageFile] = useState(null);

  // Setting up react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = (data) => {
    // This is where the data would be sent to the backend or Redux store
    console.log("Complaint Submitted:", data, imageFile);

    // For now, simulating a successful submission with dummy data
    alert("Your complaint has been registered successfully.");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", px: 4, maxWidth: "md", mx: "auto" }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Register Complaint
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Issue Type */}
        <FormControl fullWidth error={!!errors.issueType} sx={{ mb: 3 }}>
          <InputLabel>Issue Type</InputLabel>
          <Select
            label="Issue Type"
            {...register("issueType", { required: "Please select an issue type" })}
          >
            {issueTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.issueType?.message}</FormHelperText>
        </FormControl>

        {/* Description */}
        <TextField
          label="Description"
          multiline
          rows={4}
          fullWidth
          {...register("description", { required: "Please enter a description" })}
          error={!!errors.description}
          helperText={errors.description?.message}
          sx={{ mb: 3 }}
        />

        {/* Image Upload */}
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          accept="image/*"
          style={{ marginBottom: "16px" }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Upload a photo if you have physical damage or other visual issues.
        </Typography>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit Complaint
        </Button>
      </form>
    </Box>
  );
};

export default RegisterComplaintScreen;
