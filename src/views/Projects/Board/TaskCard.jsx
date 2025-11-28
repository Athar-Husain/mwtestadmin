// src/views/Projects/Board/TaskCard.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const TaskCard = ({ task }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{task.name}</Typography>
                <Typography variant="body2">{task.status}</Typography>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
