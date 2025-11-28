// src/views/TicketDetail/TicketHeader.jsx
import React from 'react';
import { Box, Typography, Button, Chip, Stack, useTheme, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const statusColors = {
  Open: 'success',
  'In Progress': 'warning',
  Resolved: 'info',
  Closed: 'error'
};

const TicketHeader = ({ ticket, onCloseTicket, onReassign }) => {
  const theme = useTheme();

  const disabledActions = ticket?.status === 'Closed' || ticket?.status === 'Resolved';

  return (
    <Paper
      elevation={2}
      component={motion.div}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 9,
        p: 2.2,
        borderRadius: 2,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(6px)',
        background: theme.palette.background.paper
      }}
    >
      {/* LEFT: Ticket ID and Subject */}
      <Box>
        <Typography variant="h6" fontWeight="600" color="text.primary">
          Ticket #{ticket?._id?.slice(-6)?.toUpperCase() || '—'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {ticket?.subject || 'No subject'}
        </Typography>
      </Box>

      {/* CENTER: Status */}
      <Chip
        label={ticket?.status || 'Unknown'}
        color={statusColors[ticket?.status] || 'default'}
        variant="filled"
        sx={{
          fontWeight: 600,
          fontSize: '0.85rem',
          px: 1,
          height: 28
        }}
      />

      {/* RIGHT: Actions */}
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<SwapHorizIcon />}
          onClick={onReassign}
          disabled={disabledActions}
        >
          Reassign
        </Button>

        <Button variant="contained" color="error" size="small" startIcon={<CloseIcon />} onClick={onCloseTicket} disabled={disabledActions}>
          Close Ticket
        </Button>
      </Stack>
    </Paper>
  );
};

export default TicketHeader;
