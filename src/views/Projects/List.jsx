// Project List Component
import { useTheme } from '@mui/material/styles';
import { List, ListItem, ListItemIcon, ListItemText, Avatar, Paper, Typography } from '@mui/material';
import { green, blue, grey } from '@mui/material/colors';

const ProjectList = ({ projects, selectedProjectId, onSelectProject }) => {
    const theme = useTheme(); // Access the global theme for consistent styling
    return (
        <Paper elevation={3} className="p-4 h-full flex flex-col bg-white rounded-xl shadow-lg dark:bg-gray-700">
            <Typography variant="h6" className="font-bold mb-4 text-gray-800 border-b-2 pb-2 border-gray-300 dark:text-white dark:border-gray-600">
                Projects
            </Typography>
            <List className="flex-grow overflow-y-auto">
                <ListItem
                    button
                    onClick={() => onSelectProject(null)} // Option to clear filter
                    selected={selectedProjectId === null}
                    className="rounded-lg mb-2"
                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: blue[50], // Light blue for selected "All"
                            '&:hover': {
                                backgroundColor: blue[100],
                            },
                        },
                        '& .MuiListItemText-primary': { color: theme.palette.text.primary },
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover, // Ensure hover effect
                        },
                    }}
                >
                    <ListItemIcon>
                        <Avatar sx={{ bgcolor: grey[500] }}>All</Avatar>
                    </ListItemIcon>
                    <ListItemText primary="All Projects" />
                </ListItem>
                {projects.map((project) => (
                    <ListItem
                        button
                        key={project.id}
                        onClick={() => onSelectProject(project.id)}
                        selected={selectedProjectId === project.id}
                        className="rounded-lg mb-2"
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: green[50], // Light green for selected project
                                '&:hover': {
                                    backgroundColor: green[100],
                                },
                            },
                            '& .MuiListItemText-primary': { color: theme.palette.text.primary },
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover, // Ensure hover effect
                            },
                        }}
                    >
                        <ListItemIcon>
                            <Avatar sx={{ bgcolor: green[500] }}>{project.name.charAt(0)}</Avatar>
                        </ListItemIcon>
                        <ListItemText primary={project.name} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default ProjectList;