import React from 'react';
import { Card, CardContent, Button, Typography, CardMedia, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" component="div">
                    {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Created on: {new Date(project.createdAt).toLocaleDateString()}
                </Typography>
            </CardContent>

            <CardMedia
                component="img"
                height="140"
                image={project.image}
                alt={project.name}
            />

            <div style={{ padding: '10px' }}>
                <Link to={`/project/${project.id}/board`}>
                    <Button variant="outlined">Go to Board</Button>
                </Link>
                <IconButton onClick={handleMenuClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose}>Archive</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                </Menu>
            </div>
        </Card>
    );
};

export default ProjectCard;
