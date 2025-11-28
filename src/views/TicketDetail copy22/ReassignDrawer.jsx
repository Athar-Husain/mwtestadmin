import React, { useState } from 'react';
import { Drawer, Box, Typography, IconButton, Button, Divider, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ReassignDrawer = ({ open, onOpenChange, ticket }) => {
  const [agent, setAgent] = useState('');

  const handleReassign = () => {
    console.log('Reassigning ticket:', ticket?._id, 'to:', agent);
    onOpenChange(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => onOpenChange(false)}>
      <Box sx={{ width: 350, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Reassign Ticket</Typography>
          <IconButton onClick={() => onOpenChange(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Typography variant="body2" color="text.secondary">
          Ticket ID: {ticket?._id}
        </Typography>

        <FormControl fullWidth>
          <InputLabel>Select Agent</InputLabel>
          <Select value={agent} label="Select Agent" onChange={(e) => setAgent(e.target.value)}>
            {/* Replace with dynamic agent list */}
            <MenuItem value="agent1">Agent 1</MenuItem>
            <MenuItem value="agent2">Agent 2</MenuItem>
            <MenuItem value="agent3">Agent 3</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleReassign}>
            Confirm
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ReassignDrawer;
