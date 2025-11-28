// src/views/TicketDetail/Index.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Box, Grid, CircularProgress, Paper, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import TicketInfoPanel from './TicketInfoPanel';
import AssignmentHistory from './AssignmentHistory';
import CommentSection from './CommentSection';
import CloseTicketModal from './CloseTicketModal';

import {
  getTicketById,
  getPublicComments,
  addPublicComment,
  addPrivateComment,
  resolveTicket
} from '../../redux/features/Tickets/TicketSlice';

const PageContainer = ({ children }) => <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>{children}</Box>;

const Index = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { ticketId } = useParams();

  const { ticket, isTicketLoading, isError, message, publicComments } = useSelector((s) => s.ticket);
  const currentUser = useSelector((s) => s.admin.Admin);

  const [closeModalOpen, setCloseModalOpen] = useState(false);

  useEffect(() => {
    if (ticketId) {
      dispatch(getTicketById(ticketId));
      dispatch(getPublicComments(ticketId));
    }
  }, [dispatch, ticketId]);

  const handleSendPublic = useCallback(
    (content) => {
      if (!content?.trim()) return;
      dispatch(addPublicComment({ ticketId, content }));
      // optimistic UI handled by backend + slice notifications
    },
    [dispatch, ticketId]
  );

  const handleSendPrivate = useCallback(
    (content) => {
      if (!content?.trim()) return;
      dispatch(addPrivateComment({ ticketId, content }));
    },
    [dispatch, ticketId]
  );

  const handleOpenCloseModal = () => setCloseModalOpen(true);
  const handleCloseCloseModal = () => setCloseModalOpen(false);
  const handleConfirmCloseTicket = (resolutionNote) => {
    dispatch(resolveTicket({ id: ticketId, data: { resolutionMessage: resolutionNote } }));
    setCloseModalOpen(false);
  };

  if (isTicketLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
        <Grid container spacing={2} alignItems="stretch">
          {/* LEFT: Ticket info + assignment history */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box display="flex" flexDirection="column" gap={2} height="100%">
              <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TicketInfoPanel ticket={ticket} onCloseClick={handleOpenCloseModal} currentUser={currentUser} />
              </Paper>

              <Paper elevation={1} sx={{ borderRadius: 2, p: 2, height: 360, overflowY: 'auto' }}>
                <AssignmentHistory ticket={ticket} />
              </Paper>
            </Box>
          </Grid>

          {/* CENTER: Public chat */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <CommentSection
                title="Customer Chat"
                isPrivate={false}
                messages={publicComments || []}
                onSend={handleSendPublic}
                ticket={ticket}
                currentUser={currentUser}
              />
            </Paper>
          </Grid>

          {/* RIGHT: Private notes */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <CommentSection
                title="Internal Notes"
                isPrivate={true}
                messages={ticket?.privateComments || []}
                onSend={handleSendPrivate}
                ticket={ticket}
                currentUser={currentUser}
                privateAccent
              />
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      <CloseTicketModal open={closeModalOpen} onClose={handleCloseCloseModal} onConfirm={handleConfirmCloseTicket} />
    </PageContainer>
  );
};

export default Index;
