import React from 'react';
import { Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const PlanSelection = ({ onSubmit, prevStep }) => {
    const { allPlans } = useSelector((state) => state.plan);
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormControl fullWidth margin="normal" error={!!errors.plan}>
                <InputLabel>Select Plan</InputLabel>
                <Select {...register('plan', { required: 'Plan selection is required' })} label="Select Plan">
                    {allPlans.map((plan) => (
                        <MenuItem key={plan.id} value={plan.id}>
                            {plan.name}
                        </MenuItem>
                    ))}
                </Select>
                {errors.plan && <p style={{ color: '#d32f2f', fontSize: '0.75rem' }}>{errors.plan.message}</p>}
            </FormControl>

            <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
                Submit
            </Button>
            <Button variant="outlined" onClick={prevStep}>
                Previous
            </Button>
        </form>
    );
};

export default PlanSelection;
