import React from 'react';
import { Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const PlanSelection = ({ prevStep }) => {
    const { register, handleSubmit } = useForm();
    const { allPlans } = useSelector(state => state.plan); // Plans from Redux

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>
                <InputLabel>Select Plan</InputLabel>
                <Select {...register('plan')} label="Select Plan">
                    {allPlans.map(plan => (
                        <MenuItem key={plan.id} value={plan.id}>{plan.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary">Submit</Button>
            <Button onClick={prevStep} variant="outlined">Previous</Button>
        </form>
    );
};

export default PlanSelection;
