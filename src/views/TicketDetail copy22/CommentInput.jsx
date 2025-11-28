// src/views/TicketDetail/CommentInput.jsx
import React, { useState } from 'react';
import { Box, TextField, IconButton, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const CommentInput = ({ onSend, disabled = false, sending = false, placeholder = 'Message...' }) => {
  const [value, setValue] = useState('');

  const handleSend = async () => {
    const text = value.trim();
    if (!text) return;
    await onSend(text);
    setValue('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !sending) handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <TextField
        size="small"
        placeholder={placeholder}
        multiline
        maxRows={4}
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />
      <Tooltip title={disabled ? 'Action disabled' : 'Send'}>
        <span>
          <IconButton color="primary" onClick={handleSend} disabled={disabled || sending || !value.trim()}>
            <SendIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default CommentInput;
