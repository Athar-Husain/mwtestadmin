import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const TicketDetails = ({ ticket }) => {
  if (!ticket) return null;

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      <Typography variant="body2">
        <strong>Subject:</strong> {ticket.subject}
      </Typography>
      <Typography variant="body2">
        <strong>Category:</strong> {ticket.category || '—'}
      </Typography>
      <Typography variant="body2">
        <strong>Priority:</strong> {ticket.priority || 'Normal'}
      </Typography>
      <Typography variant="body2">
        <strong>Status:</strong> {ticket.status}
      </Typography>
      <Typography variant="body2">
        <strong>Created By:</strong> {ticket.customer?.name || 'Unknown'}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Typography variant="body2">
        <strong>Description:</strong> {ticket.description || 'No description provided.'}
      </Typography>
    </Box>
  );
};

export default TicketDetails;
