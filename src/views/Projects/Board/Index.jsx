// src/views/Projects/Board/index.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Button, Modal, TextField, Typography } from '@mui/material';
import TaskCard from './TaskCard'; // A component to display each task
// import { getTasksForProject, createTask } from '../../redux/taskSlice'; // Redux actions
import { dummyTasks } from '../dummyData.js'; // Temporary dummy tasks

const index = () => {
    const { projectId } = useParams(); // Getting project ID from the URL
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State
    const [openModal, setOpenModal] = useState(false);
    const [taskName, setTaskName] = useState('');

    // Replace this with actual Redux state when API is integrated
    // const tasks = useSelector((state) => state.tasks.tasks); 
    const tasks = dummyTasks; // Temporary dummy tasks

    // Load tasks for the project (you can replace this with an actual API call when ready)
    useEffect(() => {
        // Example API call (uncomment when integrating)
        // dispatch(getTasksForProject(projectId));

        // For now, we're just using dummy data
    }, [dispatch, projectId]);

    // Create a task (you'll dispatch an action here once the Redux slice is created)
    const handleCreateTask = () => {
        if (taskName.trim()) {
            // Dispatch the task creation action (uncomment when the slice is done)
            // dispatch(createTask({ projectId, name: taskName }));
            setTaskName('');
            setOpenModal(false);
        }
    };

    return (
        <div>
            <Typography variant="h4">Project Board</Typography>
            <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                Add Task
            </Button>

            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {/* Render tasks */}
                {tasks.map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                        <TaskCard task={task} />
                    </Grid>
                ))}
            </Grid>

            {/* Modal for creating a new task */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div style={{ padding: '20px', background: 'white', margin: 'auto', marginTop: '20%' }}>
                    <Typography variant="h6">Create New Task</Typography>
                    <TextField
                        label="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleCreateTask}>
                        Create Task
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default index;
