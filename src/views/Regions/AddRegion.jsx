import React from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import {
  getAllServiceAreas,
  createServiceArea,
} from '../../redux/features/Area/AreaSlice';

const AddRegion = ({ onClose }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      region: '',
      description: '',
      isActive: true,
      networkStatus: 'Good',
    },
  });

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    await dispatch(createServiceArea(data)).unwrap();
    reset();
    await dispatch(getAllServiceAreas());
    onClose();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      p={2}
      sx={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <Grid container spacing={2}>
        {/* Region Name */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="region"
            control={control}
            rules={{
              required: 'Region name is required',
              pattern: {
                value: /^[a-zA-Z0-9-]+$/,
                message:
                  'Only letters, numbers, and hyphens allowed (no spaces or special characters)',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Region Name"
                fullWidth
                error={!!errors.region}
                helperText={errors.region?.message}
                inputProps={{ maxLength: 30 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            )}
          />
        </Grid>

        {/* Description */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            )}
          />
        </Grid>

        {/* Network Status Dropdown */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="networkStatus"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Network Status</InputLabel>
                <Select {...field} label="Network Status" sx={{ borderRadius: 2 }}>
                  <MenuItem value="Good">Good (Normal)</MenuItem>
                  <MenuItem value="Low">Low (Users may notice slowness)</MenuItem>
                  <MenuItem value="Moderate">Moderate (Minor issues)</MenuItem>
                  <MenuItem value="Down">Down (Outage in progress)</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* isActive Switch */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="isActive"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    color="primary"
                  />
                }
                label={value ? 'Active' : 'Inactive'}
              />
            )}
          />
        </Grid>

        {/* Buttons */}
        <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose} color="secondary" sx={{ borderRadius: 3 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontWeight: 600,
              fontSize: 16,
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
              bgcolor: '#6366F1',
              '&:hover': {
                bgcolor: '#4F46E5',
              },
            }}
          >
            Add Region
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddRegion;
