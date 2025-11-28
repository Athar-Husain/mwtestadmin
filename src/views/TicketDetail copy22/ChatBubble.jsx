// src/views/TicketDetail/ChatBubble.jsx
import React from 'react';
import { Box, Typography, Avatar, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

const roleColors = {
  Admin: '#1976d2',
  Team: '#388e3c',
  Customer: '#9c27b0'
};

const ChatBubble = ({ message, isPrivate, currentUser }) => {
  const isOwn = message?.commentBy?._id === currentUser?._id;

  const senderName = message?.commentBy?.firstName
    ? `${message.commentBy.firstName} ${message.commentBy.lastName || ''}`
    : message.commentBy?.name || message.commentBy?._id || message.commentByModel;
  const senderRole = message?.commentByModel || 'Unknown';
  const created = new Date(message?.createdAt).toLocaleString();

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 1, alignItems: 'flex-start', flexDirection: isOwn ? 'row-reverse' : 'row' }}>
        <Tooltip title={`${senderName} • ${senderRole}`}>
          <Avatar sx={{ bgcolor: roleColors[senderRole] || undefined, width: 36, height: 36 }}>
            {senderName?.charAt(0) || senderRole?.charAt(0)}
          </Avatar>
        </Tooltip>

        <Box
          sx={{
            maxWidth: '78%',
            bgcolor: isOwn ? 'rgba(76,139,245,0.12)' : 'background.paper',
            p: 1.25,
            borderRadius: 2,
            boxShadow: isOwn ? '0 6px 18px rgba(76,139,245,0.06)' : '0 1px 0 rgba(0,0,0,0.02)',
            wordBreak: 'break-word'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {senderName}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
            {message.content}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.75, color: 'text.secondary' }}>
            {created} {isPrivate && <span style={{ color: '#d32f2f', marginLeft: 8, fontWeight: 600 }}>(Private)</span>}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ChatBubble;
