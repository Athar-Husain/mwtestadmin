// src/views/TicketDetail/CommentSection.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Divider, CircularProgress } from '@mui/material';
import ChatBubble from './ChatBubble';
import CommentInput from './CommentInput';

const PAGE_SIZE = 20;

const CommentSection = ({ title, messages = [], onSend, ticket, currentUser, isPrivate = false, privateAccent = false }) => {
  const listRef = useRef(null);
  const [page, setPage] = useState(1);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // scroll to bottom on new messages
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight + 300;
    }
  }, [messages.length]);

  const displayed = messages.slice(-page * PAGE_SIZE);

  const handleSend = async (text) => {
    setSending(true);
    await onSend(text);
    setSending(false);
    // after sending ensure the newest page is visible
    setPage(1);
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  };

  const isDisabled = ticket?.status === 'Closed' || ticket?.status === 'Resolved';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}{' '}
          {isPrivate && (
            <Typography component="span" color="error" sx={{ ml: 1, fontSize: 12 }}>
              (Private)
            </Typography>
          )}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {ticket?._id ? `#${ticket._id.slice(-6)}` : ''}
        </Typography>
      </Box>

      <Box ref={listRef} sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: privateAccent ? 'rgba(250,250,250,0.6)' : 'background.paper' }}>
        {displayed.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            No messages yet.
          </Typography>
        ) : (
          displayed.map((m) => <ChatBubble key={m._id} message={m} isPrivate={isPrivate} currentUser={currentUser} />)
        )}

        {messages.length > displayed.length && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }} onClick={() => setPage((p) => p + 1)}>
              Load older messages
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <CommentInput
          onSend={handleSend}
          disabled={isDisabled}
          sending={sending}
          placeholder={isPrivate ? 'Write internal note...' : 'Write a message...'}
        />
      </Box>
    </Box>
  );
};

export default CommentSection;
