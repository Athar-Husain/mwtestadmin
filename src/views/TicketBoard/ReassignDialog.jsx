// src/components/Tickets/ReassignDialog.jsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';

const ReassignDialog = ({ open, onClose, onConfirm, fromUser, toUser }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Reassign Ticket</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 2 }}>
          You’re reassigning this ticket from <strong>{fromUser || 'Unassigned'}</strong> to <strong>{toUser}</strong>.
        </Typography>

        <TextField
          fullWidth
          label="Reason for reassignment"
          multiline
          minRows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Shift handover, workload balance, escalation reason..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained" disabled={!reason.trim()}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReassignDialog;
