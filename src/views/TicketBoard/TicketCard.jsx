// src/views/TicketBoard/TicketCard.jsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'low':
      return 'success';
    case 'medium':
      return 'warning';
    case 'high':
      return 'error';
    default:
      return 'default';
  }
};

const TicketCard = ({ ticket }) => {
  const theme = useTheme();

  const priorityColor = getPriorityColor(ticket.priority);
  const assignedName =
    ticket.assignedTo?.firstName && ticket.assignedTo?.lastName
      ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
      : 'Unassigned';

  // Limit description length for display
  const shortDesc =
    ticket.description.length > 50
      ? `${ticket.description.substring(0, 50)}...`
      : ticket.description;

  return (
    <Paper
      elevation={3}
      role="article"
      aria-label={`Ticket ${ticket._id}`}
      sx={{
        p: 2,
        borderRadius: 2,
        borderLeft: `6px solid ${theme.palette[priorityColor].main}`,
        cursor: 'grab',
        transition: 'box-shadow 0.3s ease, transform 0.15s ease',
        '&:hover': {
          boxShadow: theme.shadows[6],
          transform: 'translateY(-2px)',
        },
        '&:active': {
          cursor: 'grabbing',
          transform: 'translateY(0)',
          boxShadow: theme.shadows[3],
        },
        userSelect: 'none',
      }}
    >
      <Tooltip title={ticket.description} placement="top" arrow>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mb: 1,
          }}
        >
          {shortDesc}
        </Typography>
      </Tooltip>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
        <Chip
          label={ticket.priority.toUpperCase()}
          color={priorityColor}
          size="small"
          aria-label={`Priority: ${ticket.priority}`}
          sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}
        />
        <Chip
          label={ticket.issueType}
          variant="outlined"
          size="small"
          aria-label={`Issue type: ${ticket.issueType}`}
        />
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 0.3 }}
      >
        <strong>ID:</strong> {ticket._id}
      </Typography>

      <Typography variant="caption" color="text.secondary" aria-label={`Assigned to ${assignedName}`}>
        <strong>Assigned to:</strong> {assignedName}
      </Typography>
    </Paper>
  );
};

export default TicketCard;
