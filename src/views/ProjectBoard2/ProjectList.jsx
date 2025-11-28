// ProjectBoard/ProjectList.jsx
import React from 'react';
import {
    Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Avatar, Tooltip, Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { blue, grey, green } from '@mui/material/colors';

// Import dummy data from the main index file or a shared data file
import { projects } from './Index'; // Assuming dummy data is in Index.jsx for now

const ProjectList = ({ selectedProjectId, onSelectProject }) => {
    const theme = useTheme();

    const textColor = theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[800];
    const secondaryTextColor = theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.text.secondary;

    return (
        <Paper
            elevation={4}
            className="p-4 h-full flex flex-col bg-white rounded-xl shadow-lg dark:bg-gray-800 transition-shadow duration-300"
            role="list"
            aria-label="Project List"
        >
            <Typography
                variant="h6"
                component="h2"
                className="font-bold mb-4 border-b-2 pb-2"
                sx={{
                    color: textColor,
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[300],
                }}
            >
                Projects
            </Typography>
            <List
                className="flex-grow overflow-y-auto"
                aria-activedescendant={selectedProjectId ? `project-${selectedProjectId}` : undefined}
                role="listbox"
            >
                <ListItem
                    button
                    onClick={() => onSelectProject(null)}
                    selected={selectedProjectId === null}
                    className="rounded-lg mb-2 transform transition-all duration-200"
                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: blue[100],
                            borderLeft: `4px solid ${blue[600]}`,
                            '&:hover': {
                                backgroundColor: blue[200],
                            },
                        },
                        '&:not(.Mui-selected):hover': {
                            backgroundColor: theme.palette.action.hover,
                            transform: 'translateX(4px)',
                        },
                        '& .MuiListItemText-primary': {
                            color: selectedProjectId === null ? blue[800] : textColor,
                            fontWeight: selectedProjectId === null ? 600 : 400,
                        },
                        '& .MuiListItemIcon-root': {
                            minWidth: 40,
                        },
                    }}
                    id="project-all"
                    role="option"
                    aria-selected={selectedProjectId === null}
                >
                    <ListItemIcon>
                        <Avatar
                            sx={{ bgcolor: grey[500], color: 'white', fontSize: '0.875rem', userSelect: 'none' }}
                            aria-hidden="true"
                        >
                            ALL
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText primary="All Projects" />
                </ListItem>

                {projects.map((project) => (
                    <Tooltip title={project.name} key={project.id} arrow placement="right">
                        <ListItem
                            button
                            onClick={() => onSelectProject(project.id)}
                            selected={selectedProjectId === project.id}
                            className="rounded-lg mb-2 transform transition-all duration-200"
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: green[100],
                                    borderLeft: `4px solid ${green[600]}`,
                                    '&:hover': {
                                        backgroundColor: green[200],
                                    },
                                },
                                '&:not(.Mui-selected):hover': {
                                    backgroundColor: theme.palette.action.hover,
                                    transform: 'translateX(4px)',
                                },
                                '& .MuiListItemText-primary': {
                                    color: selectedProjectId === project.id ? green[800] : textColor,
                                    fontWeight: selectedProjectId === project.id ? 600 : 400,
                                },
                                '& .MuiListItemIcon-root': {
                                    minWidth: 40,
                                },
                            }}
                            id={`project-${project.id}`}
                            role="option"
                            aria-selected={selectedProjectId === project.id}
                        >
                            <ListItemIcon>
                                <Avatar
                                    sx={{
                                        bgcolor: green[500],
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        userSelect: 'none',
                                    }}
                                    aria-hidden="true"
                                >
                                    {project.name.charAt(0).toUpperCase()}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText
                                primary={project.name}
                                primaryTypographyProps={{ noWrap: true, title: project.name }}
                            />
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Paper>
    );
};

export default ProjectList;
