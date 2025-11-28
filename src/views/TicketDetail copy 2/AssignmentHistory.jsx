// src/views/TicketDetail/AssignmentHistory.jsx
import React from 'react';
import { Box, Typography, Stack, Avatar, Divider } from '@mui/material';
import dayjs from 'dayjs';

const AssignmentHistory = ({ ticket }) => {
  const history = ticket?.assignmentHistory || [];

  if (!history.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No assignment history.
      </Typography>
    );
  }

  // Ensure most-recent-first
  const sorted = [...history].sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt));

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
        Assignment History
      </Typography>
      <Stack spacing={2}>
        {sorted.map((h, idx) => (
          <Box key={`${h.assignedAt}-${idx}`} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar sx={{ width: 36, height: 36 }}>{h.assignedTo?.toString?.()[0] || (h.assignedToModel || 'T')[0]}</Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Assigned to {h.assignedToDisplay || h.assignedTo} ({h.assignedToModel})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                By {h.assignedByDisplay || h.assignedByModel || 'System'} • {dayjs(h.assignedAt).format('DD MMM YYYY, HH:mm')}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default AssignmentHistory;
