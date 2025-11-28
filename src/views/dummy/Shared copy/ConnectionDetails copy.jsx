import React from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useForm } from 'react-hook-form';

const ConnectionDetails = ({ nextStep, prevStep }) => {
    const { register, handleSubmit } = useForm();
    const { areas } = useSelector(state => state.area); // Assuming area data is in Redux

    const onSubmit = (data) => {
        console.log(data);
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField label="STB Number" {...register('stbNumber')} fullWidth />
            <TextField label="User ID" {...register('userId')} fullWidth />
            <TextField label="User Name" {...register('userName')} fullWidth />

            <FormControl fullWidth>
                <InputLabel>Area</InputLabel>
                <Select {...register('area')} label="Area">
                    {areas.map(area => (
                        <MenuItem key={area.id} value={area.id}>{area.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary">Next</Button>
            <Button onClick={prevStep} variant="outlined">Previous</Button>
        </form>
    );
};

export default ConnectionDetails;
