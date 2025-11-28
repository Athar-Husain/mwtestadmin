import React, { useState, useEffect } from 'react';
import { Grid, Card, Button, Modal, TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import ProjectCard from './ProjectCard';

const Projects = () => {
    // Dummy data for projects and users
    const dummyProjects = [
        { id: 1, name: 'Project A', createdAt: '2023-01-10', members: ['User1', 'User2'], image: 'image_url_1', archived: false },
        { id: 2, name: 'Project B', createdAt: '2023-02-12', members: ['User2', 'User3'], image: 'image_url_2', archived: true },
        { id: 3, name: 'Project C', createdAt: '2023-03-15', members: ['User1', 'User4'], image: 'image_url_3', archived: false },
    ];
    const dummyUsers = [
        { id: 'User1', firstName: 'John', lastName: 'Doe' },
        { id: 'User2', firstName: 'Jane', lastName: 'Smith' },
        { id: 'User3', firstName: 'Jim', lastName: 'Brown' },
        { id: 'User4', firstName: 'Jill', lastName: 'Davis' }
    ];

    const [projects, setProjects] = useState(dummyProjects);
    const [filterType, setFilterType] = useState(1); // 1: Active, 2: Archived
    const [modalOpen, setModalOpen] = useState(false);

    const { control, handleSubmit, setValue } = useForm();

    useEffect(() => {
        // Simulate fetching data (replace with actual API calls later)
        setProjects(dummyProjects);
    }, []);

    const createProject = (data) => {
        const newProject = {
            id: projects.length + 1,
            name: data.name,
            createdAt: new Date().toISOString(),
            members: data.members,
            image: URL.createObjectURL(data.logo[0]),
            archived: false
        };
        setProjects([...projects, newProject]);
        setModalOpen(false);
    };

    const filteredProjects = projects.filter(p => filterType === 2 ? p.archived : !p.archived);

    return (
        <div>
            <h1>TaskPro</h1>
            <h4>Projects</h4>

            <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel>Filter</InputLabel>
                <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="Filter"
                >
                    <MenuItem value={1}>Active Projects</MenuItem>
                    <MenuItem value={2}>Archived Projects</MenuItem>
                </Select>
            </FormControl>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Button variant="contained" color="primary" onClick={() => setModalOpen(true)} fullWidth startIcon={<AddIcon />}>
                        New Project
                    </Button>
                </Grid>
                {projects.length === 0 ? (
                    <Grid item xs={12}>
                        <CircularProgress />
                    </Grid>
                ) : (
                    filteredProjects.map(project => (
                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                            <ProjectCard project={project} />
                        </Grid>
                    ))
                )}
            </Grid>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div style={{ padding: '20px', background: 'white', margin: 'auto', marginTop: '10%' }}>
                    <h2>Create New Project</h2>
                    <form onSubmit={handleSubmit(createProject)}>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Project Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="logo"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...field}
                                    onChange={e => setValue('logo', e.target.files)}
                                    required
                                />
                            )}
                        />
                        <Controller
                            name="members"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    multiple
                                    fullWidth
                                    label="Select Members"
                                    required
                                    variant="outlined"
                                    margin="normal"
                                >
                                    {dummyUsers.map(user => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.firstName} {user.lastName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Create Project
                        </Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Projects;
