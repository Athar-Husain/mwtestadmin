import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material';

const CloseTicketModal = ({ open, onOpenChange, ticket }) => {
  const [closingNote, setClosingNote] = useState('');

  const handleConfirm = () => {
    console.log('Closing ticket:', ticket?._id, closingNote);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} fullWidth maxWidth="sm">
      <DialogTitle>Close Ticket #{ticket?._id}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Please add a closing note or summary before closing this ticket.
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          value={closingNote}
          onChange={(e) => setClosingNote(e.target.value)}
          placeholder="Add closing note..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleConfirm}>
          Confirm Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseTicketModal;
