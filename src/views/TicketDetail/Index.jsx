// src/views/TicketDetail/Index.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Box, Grid, CircularProgress, Paper, Typography, Button, Chip, Divider, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Assignment, Close as CloseIcon, Autorenew } from '@mui/icons-material';

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

  const { ticket, isTicketLoading, publicComments } = useSelector((s) => s.ticket);
  const currentUser = useSelector((s) => s.admin.Admin);

  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false); // future modal/drawer

  const isClosedOrResolved = ['closed', 'resolved'].includes(ticket?.status?.toLowerCase());

  useEffect(() => {
    if (ticketId) {
      dispatch(getTicketById(ticketId));
      dispatch(getPublicComments(ticketId));
    }
  }, [dispatch, ticketId]);

  const handleSendPublic = useCallback(
    (content) => {
      if (!content?.trim() || isClosedOrResolved) return;
      dispatch(addPublicComment({ ticketId, content }));
    },
    [dispatch, ticketId, isClosedOrResolved]
  );

  const handleSendPrivate = useCallback(
    (content) => {
      if (!content?.trim() || isClosedOrResolved) return;
      dispatch(addPrivateComment({ ticketId, content }));
    },
    [dispatch, ticketId, isClosedOrResolved]
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
      {/* HEADER */}
      <Paper
        elevation={4}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          p: 2,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Ticket ID: #{ticket?._id}
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {ticket?.subject || 'Untitled Ticket'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={ticket?.status?.toUpperCase() || 'UNKNOWN'}
            color={ticket?.status === 'open' ? 'success' : ticket?.status === 'in-progress' ? 'warning' : 'default'}
            variant="filled"
          />
          <Divider orientation="vertical" flexItem />
          <Button variant="outlined" startIcon={<Assignment />} onClick={() => setReassignOpen(true)} disabled={isClosedOrResolved}>
            Reassign
          </Button>
          <Button variant="contained" color="error" startIcon={<CloseIcon />} onClick={handleOpenCloseModal} disabled={isClosedOrResolved}>
            Close Ticket
          </Button>
        </Box>
      </Paper>

      {/* BODY */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
        <Grid container spacing={2}>
          {/* LEFT: Ticket info + assignment history */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box display="flex" flexDirection="column" gap={2} height="100%">
              <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <TicketInfoPanel ticket={ticket} onCloseClick={handleOpenCloseModal} currentUser={currentUser} />
              </Paper>

              <Paper
                elevation={1}
                sx={{
                  borderRadius: 2,
                  p: 2,
                  flex: 1,
                  overflowY: 'auto',
                  minHeight: 300
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: theme.palette.text.primary }}>
                  Assignment History
                </Typography>
                <AssignmentHistory ticket={ticket} />
              </Paper>
            </Box>
          </Grid>

          {/* MIDDLE: Public chat */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <CommentSection
                title="Customer Chat"
                isPrivate={false}
                messages={publicComments || []}
                onSend={handleSendPublic}
                ticket={ticket}
                currentUser={currentUser}
                disabled={isClosedOrResolved}
              />
            </Paper>
          </Grid>

          {/* RIGHT: Private notes */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <CommentSection
                title="Internal Notes"
                isPrivate
                messages={ticket?.privateComments || []}
                onSend={handleSendPrivate}
                ticket={ticket}
                currentUser={currentUser}
                disabled={isClosedOrResolved}
                privateAccent
              />
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      {/* MODALS */}
      <CloseTicketModal open={closeModalOpen} onClose={handleCloseCloseModal} onConfirm={handleConfirmCloseTicket} />
      {/* Future Reassign Drawer/Modal placeholder */}
      {/* <ReassignDrawer open={reassignOpen} onClose={() => setReassignOpen(false)} /> */}
    </PageContainer>
  );
};

export default Index;
