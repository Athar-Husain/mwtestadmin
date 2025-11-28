// src/views/TicketDetail/Index.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Grid,
    CircularProgress,
    Typography,
    useTheme,
    Button,
    Paper
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import TicketDetails from './TicketDetails';
import ChatArea from './ChatArea';
import CloseTicketModal from './CloseTicketModal';

import { getTicketById, addPrivateComment, addPublicComment, resolveTicket, getPublicComments } from '../../redux/features/Tickets/TicketSlice';

const Index = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { ticketId } = useParams();

    const { ticket, isLoading, isError, message, publicComments, privateComments } = useSelector(state => state.ticket);
    const currentUser = useSelector(state => state.admin.Admin);
    // console.log("publicComment messages", publicComments)

    const [publicPage, setPublicPage] = useState(1);
    const [privatePage, setPrivatePage] = useState(1);
    const PAGE_SIZE = 20;

    const [closeModalOpen, setCloseModalOpen] = useState(false);

    useEffect(() => {
        if (ticketId) {
            dispatch(getTicketById(ticketId));
        }
    }, [dispatch, ticketId]);

    useEffect(() => {
        if (ticketId) {
            dispatch(getPublicComments(ticketId));
        }
    }, [dispatch, ticketId]);



    const loadMorePublicMessages = useCallback(() => {
        if (!publicComments) return;
        if (publicComments.length >= publicPage * PAGE_SIZE) {
            setPublicPage(prev => prev + 1);
        }
    }, [publicComments, publicPage]);

    const loadMorePrivateMessages = useCallback(() => {
        if (!ticket?.privateComments) return;
        if (ticket.privateComments.length >= privatePage * PAGE_SIZE) {
            setPrivatePage(prev => prev + 1);
        }
    }, [ticket?.privateComments, privatePage]);

    // const handleSendPublicMessage = (content, files) => {
    //     if (!content.trim() && (!files || files.length === 0)) return;
    //     const formData = new FormData();
    //     formData.append('content', content);
    //     files.forEach(file => formData.append('attachments', file));
    //     dispatch(addPublicComment({ ticketId, formData }));
    // };

    // const handleSendPrivateMessage = (content, files) => {
    //     if (!content.trim() && (!files || files.length === 0)) return;
    //     const formData = new FormData();
    //     formData.append('content', content);
    //     files.forEach(file => formData.append('attachments', file));
    //     dispatch(addPrivateComment({ ticketId, formData }));
    // };


    // const handleSendPublicMessage = (content, files) => {
    //     if (!content.trim() && (!files || files.length === 0)) return;

    //     const formData = new FormData();
    //     formData.append('content', content);

    //     if (files && files.length > 0) {
    //         files.forEach(file => formData.append('attachments', file));
    //     }

    //     dispatch(addPublicComment({ ticketId, content: formData }));
    // };



    // const handleSendPrivateMessage = (content, files) => {
    //     if (!content.trim() && (!files || files.length === 0)) return;

    //     const formData = new FormData();
    //     formData.append('content', content);

    //     if (files && files.length > 0) {
    //         files.forEach(file => formData.append('attachments', file));
    //     }

    //     dispatch(addPrivateComment({ ticketId, content: formData }));
    // };


    const handleSendPublicMessage = (content) => {
        if (!content.trim()) return;
        dispatch(addPublicComment({ ticketId, content }));
    };

    const handleSendPrivateMessage = (content) => {
        if (!content.trim()) return;
        dispatch(addPrivateComment({ ticketId, content }));
    };






    const handleOpenCloseModal = () => setCloseModalOpen(true);
    const handleCloseCloseModal = () => setCloseModalOpen(false);

    const handleConfirmCloseTicket = (resolutionNote) => {
        dispatch(resolveTicket({ id: ticketId, data: { resolutionNote } }));
        setCloseModalOpen(false);
    };

    const isTicketClosedOrResolved = ticket?.status === 'Closed' || ticket?.status === 'Resolved';

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh" p={2}>
                <Typography variant="h6" color="error">{message}</Typography>
            </Box>
        );
    }

    return (
        <Box maxWidth="1400px" mx="auto" height="80vh">
            <Grid container spacing={3} height="80%">
                {/* Left: Ticket Details and Close Ticket Button */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2,
                        borderRadius: 2
                    }}>
                        <TicketDetails ticket={ticket} />
                        {!isTicketClosedOrResolved && (
                            <Box sx={{ mt: 'auto', p: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                                <Button variant="contained" color="error" fullWidth onClick={handleOpenCloseModal}>
                                    Close Ticket
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Middle: Customer Chat */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderLeft: `1px solid ${theme.palette.divider}`,
                        borderRight: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2
                    }}>
                        <ChatArea
                            key="public"
                            title="Customer Chat"
                            messages={publicComments}
                            currentUser={currentUser}
                            onSendMessage={handleSendPublicMessage}
                            loadMoreMessages={loadMorePublicMessages}
                            page={publicPage}
                            pageSize={PAGE_SIZE}
                            isPrivate={false}
                            isDisabled={isTicketClosedOrResolved}
                        />
                    </Paper>
                </Grid>

                {/* Right: Internal Notes */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2
                    }}>
                        <ChatArea
                            key="private"
                            title="Internal Notes"
                            messages={ticket?.privateComments || []}
                            currentUser={currentUser}
                            onSendMessage={handleSendPrivateMessage}
                            loadMoreMessages={loadMorePrivateMessages}
                            page={privatePage}
                            pageSize={PAGE_SIZE}
                            isPrivate={true}
                            isDisabled={isTicketClosedOrResolved}
                        />
                    </Paper>
                </Grid>
            </Grid>

            <CloseTicketModal
                open={closeModalOpen}
                onClose={handleCloseCloseModal}
                onConfirm={handleConfirmCloseTicket}
            />
        </Box>
    );
};

export default Index;