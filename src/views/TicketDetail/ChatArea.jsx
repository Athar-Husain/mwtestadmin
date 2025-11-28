// src/views/TicketDetail/ChatArea.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Divider, List, ListItem, CircularProgress, TextField, IconButton, Tooltip, Fade } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatMessageBubble from './ChatMessageBubble';
import { useSelector } from 'react-redux';

const ChatArea = ({
    title,
    messages,
    // currentUser,
    onSendMessage,
    loadMoreMessages,
    page,
    pageSize,
    isPrivate,
    isDisabled = false,  // New prop to disable input field
}) => {
    const [newMessage, setNewMessage] = useState('');
    const [loadingMore, setLoadingMore] = useState(false);
    const listRef = useRef(null);

    // console.log("messages  44 in chat Area", messages)


    const { Admin } = useSelector(state => state.admin);
    const currentUser = useSelector(state => state.admin.Admin);
    // console.log(" currentUser id from chat area", currentUser?._id)

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

            {/* Chat Message Area */}
            <Box
                ref={listRef}
                onScroll={handleScroll}
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    px: 2,
                    py: 1,
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
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
                    {displayedMessages.map((msg) => {
                        // Determine if this is the current user's message
                        const isOwnMessage = msg?.commentBy?._id === currentUser?._id;
                        // const isOwnMessage = msg.commentBy._id === Admin?._id;
                        // const isOwnMessage = true;



                        // console.log(" msf ", msg)
                        // console.log(" msf commentBy ", msg?.commentBy?._id)
                        // console.log(" currentUser", currentUser?._id)

                        return (
                            // <ListItem key={msg._id} sx={{ p: 0, mb: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <ListItem key={msg._id} sx={{ p: 0, mb: 1, flexDirection: 'column', alignItems: isOwnMessage ? 'flex-end' : 'flex-start' }}>
                                {/* Sender Info */}
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                                    {msg?.commentBy?.firstName}  {msg?.commentBy?.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                                    {new Date(msg?.createdAt).toLocaleString()}
                                </Typography>

                                {/* Message Bubble */}
                                <ChatMessageBubble message={msg} isPrivate={isPrivate} />
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Divider />

            {/* Input Section */}
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
                    InputProps={{
                        sx: {
                            transition: 'all 0.3s ease',
                            '&:hover': { borderColor: 'primary.main' },
                            borderRadius: 2,
                        }
                    }}
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
