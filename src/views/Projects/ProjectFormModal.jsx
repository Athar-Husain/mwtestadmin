import React from 'react';
import { Modal, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { dummyUsers } from './dummyData';

const ProjectFormModal = ({ open, onClose, onSubmit }) => {
    const { control, handleSubmit, setValue } = useForm();

    const handleCreate = (data) => {
        onSubmit(data);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ padding: '20px', background: 'white', margin: 'auto', marginTop: '10%' }}>
                <h2>Create New Project</h2>
                <form onSubmit={handleSubmit(handleCreate)}>
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField {...field} label="Project Name" variant="outlined" fullWidth margin="normal" required />
                        )}
                    />
                    <Controller
                        name="logo"
                        control={control}
                        render={({ field }) => (
                            <input type="file" accept="image/*" {...field} onChange={(e) => setValue('logo', e.target.files)} required />
                        )}
                    />
                    <Controller
                        name="members"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} multiple fullWidth label="Select Members" required variant="outlined" margin="normal">
                                {dummyUsers.map(user => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>Create Project</Button>
                </form>
            </div>
        </Modal>
    );
};

export default ProjectFormModal;
