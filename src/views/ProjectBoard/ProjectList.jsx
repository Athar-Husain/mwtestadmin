import React from 'react';
import {
    Paper,
    Tooltip,
    IconButton,
    Avatar,
    Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { blue, green, grey } from '@mui/material/colors';

// Import dummy data from the main index file or a shared data file
import { projects } from './Index';

const ProjectList = ({ selectedProjectId, onSelectProject }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={4}
            sx={{
                p: 2,
                height: '100%',
                maxHeight: 'calc(100vh - 150px)', // limit height, adjust as needed
                overflowY: 'auto',
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    mb: 2,
                    fontWeight: 'normal',
                    fontSize: '1rem',
                    color: theme.palette.text.primary,
                }}
            >
                Projects
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    width: '100%',
                    alignItems: 'center',
                }}
            >
                {/* All Projects */}
                <Tooltip title="All Projects" arrow>
                    <IconButton
                        onClick={() => onSelectProject(null)}
                        aria-label="All Projects"
                        size="large"
                        sx={{
                            borderRadius: '12px',
                            border:
                                selectedProjectId === null
                                    ? `3px solid ${blue[600]}`
                                    : '3px solid transparent',
                            bgcolor:
                                selectedProjectId === null
                                    ? blue[100]
                                    : 'transparent',
                            '&:hover': {
                                bgcolor: blue[50],
                                borderColor: blue[400],
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: grey[500],
                                color: 'white',
                                fontSize: '1rem',
                                width: 48,
                                height: 48,
                            }}
                        >
                            ALL
                        </Avatar>
                    </IconButton>
                </Tooltip>

                {/* Projects */}
                {projects.map((project) => (
                    <Tooltip key={project.id} title={project.name} arrow>
                        <IconButton
                            onClick={() => onSelectProject(project.id)}
                            aria-label={project.name}
                            size="large"
                            sx={{
                                borderRadius: '12px',
                                border:
                                    selectedProjectId === project.id
                                        ? `3px solid ${green[600]}`
                                        : '3px solid transparent',
                                bgcolor:
                                    selectedProjectId === project.id
                                        ? green[100]
                                        : 'transparent',
                                '&:hover': {
                                    bgcolor: green[50],
                                    borderColor: green[400],
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: green[500],
                                    color: 'white',
                                    fontSize: '1.25rem',
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                {project.name.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                ))}
            </Box>
        </Paper>
    );
};

export default ProjectList;
