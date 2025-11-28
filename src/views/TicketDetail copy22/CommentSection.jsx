// src/views/TicketDetail/CommentSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Divider, List, ListItem, Avatar, TextField, IconButton, Tooltip, Stack, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const ChatBubble = ({ msg, isOwn }) => {
  const name = msg?.commentBy?.firstName
    ? `${msg.commentBy.firstName} ${msg.commentBy.lastName || ''}`
    : msg.commentBy?.name || msg.commentBy?._id || 'Unknown';
  const time = msg?.createdAt ? dayjs(msg.createdAt).format('DD MMM, hh:mm A') : '';
  const content = msg?.content || '';

  return (
    <Stack spacing={0.5} sx={{ alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>{name?.charAt(0)?.toUpperCase() || 'U'}</Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {time}
          </Typography>
        </Box>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: 1.25,
          bgcolor: isOwn ? '#DCF8C6' : 'background.paper',
          maxWidth: '90%',
          borderRadius: 2,
          whiteSpace: 'pre-wrap'
        }}
      >
        <Typography variant="body2">{content}</Typography>
        {msg.attachments?.length > 0 && (
          <Stack direction="row" spacing={1} mt={1}>
            {msg.attachments.map((a) => (
              <Box
                key={a._id || a.filename || a.src}
                component="a"
                href={a.url || a.src}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  p: 0.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <InsertDriveFileIcon fontSize="small" />
                <Typography variant="caption">{a.filename || 'file'}</Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
};

const CommentSection = ({ title, messages = [], onSend, ticket, isPrivate = false, currentUser }) => {
  const [text, setText] = useState('');
  const listRef = useRef(null);
  const loggedIn = useSelector((s) => s.admin.Admin);
  const isClosedOrResolved =
    ticket?.status === 'Closed' || ticket?.status === 'closed' || ticket?.status === 'Resolved' || ticket?.status === 'resolved';

  useEffect(() => {
    // scroll to bottom on messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e?.preventDefault();
    const payload = text.trim();
    if (!payload) return;
    onSend(payload);
    setText('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box p={2} borderBottom="1px solid" borderColor="divider" display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}{' '}
          {isPrivate && (
            <Typography component="span" color="error">
              {' '}
              (Private)
            </Typography>
          )}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {messages.length} messages
        </Typography>
      </Box>

      <Box ref={listRef} sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {messages && messages.length > 0 ? (
            messages.map((m) => {
              const isOwn = m?.commentBy?._id === (loggedIn?._id || currentUser?._id);
              return (
                <ListItem key={m._id} sx={{ display: 'block' }}>
                  <ChatBubble msg={m} isOwn={isOwn} />
                </ListItem>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              No messages.
            </Typography>
          )}
        </List>
      </Box>

      <Divider />

      <Box component="form" onSubmit={handleSend} sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          placeholder={isPrivate ? 'Write internal note...' : 'Write a message...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          maxRows={4}
          fullWidth
          disabled={isClosedOrResolved}
        />
        <Tooltip title={isClosedOrResolved ? 'Ticket closed/resolved — cannot send' : 'Send message'}>
          <span>
            <IconButton color="primary" onClick={handleSend} disabled={isClosedOrResolved || !text.trim()}>
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default CommentSection;
