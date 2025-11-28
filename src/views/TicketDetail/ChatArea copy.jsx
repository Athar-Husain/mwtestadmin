// src/Views/TicketDetail/ChatArea.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    CircularProgress,
    TextField,
    IconButton,
    Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatMessageBubble from './ChatMessageBubble';

const ChatArea = ({
    title,
    messages,
    currentUser,
    onSendMessage,
    loadMoreMessages,
    page,
    pageSize,
    isPrivate,
    isDisabled = false,  // <-- new prop for disabling input
}) => {
    const [newMessage, setNewMessage] = useState('');
    const [loadingMore, setLoadingMore] = useState(false);
    const listRef = useRef(null);

    useEffect(() => {
        if (page > 1) {
            setLoadingMore(true);
            const timer = setTimeout(() => {
                loadMoreMessages();
                setLoadingMore(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [page, loadMoreMessages]);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    const handleScroll = useCallback(() => {
        if (!listRef.current) return;
        if (listRef.current.scrollTop === 0 && !loadingMore) {
            setLoadingMore(true);
            loadMoreMessages();
            setLoadingMore(false);
        }
    }, [loadMoreMessages, loadingMore]);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        onSendMessage(newMessage.trim());
        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isDisabled) handleSend();
        }
    };

    const displayedMessages = messages.slice(-page * pageSize);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                {title} {isPrivate && <Typography component="span" color="error">(Private)</Typography>}
            </Typography>

            <Box
                ref={listRef}
                onScroll={handleScroll}
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    px: 2,
                    py: 1,
                    bgcolor: 'background.paper',
                }}
            >
                {loadingMore && (
                    <Box display="flex" justifyContent="center" mb={1}>
                        <CircularProgress size={20} />
                    </Box>
                )}
                <List>
                    {displayedMessages.length === 0 && (
                        <Typography variant="body2" color="text.secondary" align="center" mt={2}>
                            No messages yet.
                        </Typography>
                    )}
                    {displayedMessages.map((msg) => (
                        <ListItem key={msg._id} sx={{ p: 0, mb: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                            {/* Sender info */}
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                                {msg.commentBy.firstName} {msg.commentBy.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                                {new Date(msg.createdAt).toLocaleString()}
                            </Typography>

                            {/* Message bubble (you can keep your existing one) */}
                            <ChatMessageBubble message={msg} currentUser={currentUser} isPrivate={isPrivate} />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Divider />

            {/* Input */}
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!isDisabled) handleSend();
                }}
                sx={{ display: 'flex', alignItems: 'center', p: 2 }}
            >
                <TextField
                    variant="outlined"
                    placeholder={isPrivate ? 'Write internal note...' : 'Write message...'}
                    multiline
                    maxRows={4}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{ flexGrow: 1, mr: 1 }}
                    size="small"
                    disabled={isDisabled}
                />
                <Tooltip title={isDisabled ? "Ticket is closed/resolved, cannot send messages" : "Send"}>
                    <span>
                        <IconButton
                            color="primary"
                            onClick={handleSend}
                            disabled={!newMessage.trim() || isDisabled}
                            type="submit"
                            size="large"
                        >
                            <SendIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default ChatArea;
