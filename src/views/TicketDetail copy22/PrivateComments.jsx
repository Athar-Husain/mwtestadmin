import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const PrivateComments = ({ ticketId, disabled }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    const comment = {
      content: text,
      createdAt: new Date(),
      user: 'Admin'
    };
    setComments([comment, ...comments]);
    setText('');
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box sx={{ maxHeight: '45vh', overflowY: 'auto' }}>
        {comments.length ? (
          comments.map((c, i) => (
            <Paper key={i} variant="outlined" sx={{ p: 1.5, mb: 1, bgcolor: 'action.hover' }}>
              <Typography variant="body2">{c.content}</Typography>
              <Typography variant="caption" color="text.secondary">
                {c.user} • {new Date(c.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No private comments yet.
          </Typography>
        )}
      </Box>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          size="small"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a private note..."
          disabled={disabled}
        />
        <Button variant="contained" onClick={handleAdd} disabled={disabled}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default PrivateComments;
