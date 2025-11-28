import React, { useState } from 'react';
import { Box, Card, CardHeader, CardContent, Typography, Tabs, Tab, Button, Chip, Grid } from '@mui/material';
import CloseTicketModal from './CloseTicketModal';
import ReassignDrawer from './ReassignDrawer';
import TicketDetails from './TicketDetails';
import AssignmentHistory from './AssignmentHistory';
import PublicComments from './PublicComments';
import PrivateComments from './PrivateComments';

const Index = ({ ticket }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isReassignDrawerOpen, setIsReassignDrawerOpen] = useState(false);

  const isClosedOrResolved = ['closed', 'resolved'].includes(ticket?.status?.toLowerCase());

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Sticky Header */}
      <Card
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          boxShadow: 1
        }}
      >
        <CardHeader
          title={
            <Typography variant="h6" fontWeight="600">
              Ticket #{ticket?._id} — {ticket?.subject}
            </Typography>
          }
          subheader={
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <Chip label={ticket?.status?.toUpperCase()} color={getStatusColor(ticket?.status)} size="small" />
              <Typography variant="body2" color="text.secondary">
                {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleString() : ''}
              </Typography>
            </Box>
          }
          action={
            !isClosedOrResolved && (
              <Box display="flex" gap={1}>
                <Button variant="outlined" size="small" onClick={() => setIsReassignDrawerOpen(true)}>
                  Reassign
                </Button>
                <Button variant="contained" color="error" size="small" onClick={() => setIsCloseModalOpen(true)}>
                  Close Ticket
                </Button>
              </Box>
            )
          }
          sx={{ py: 1.5, px: 2 }}
        />
      </Card>

      {/* Tabs for Details + Assignment History */}
      <Card>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Ticket Details" value="details" />
          <Tab label="Assignment History" value="assignments" />
        </Tabs>

        <CardContent>
          {activeTab === 'details' && <TicketDetails ticket={ticket} />}
          {activeTab === 'assignments' && <AssignmentHistory assignments={ticket?.assignmentHistory || []} />}
        </CardContent>
      </Card>

      {/* Public + Private Comments */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Public Comments" />
            <CardContent sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <PublicComments ticketId={ticket?._id} disabled={isClosedOrResolved} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Private Comments" />
            <CardContent sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <PrivateComments ticketId={ticket?._id} disabled={isClosedOrResolved} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modals / Drawers */}
      <CloseTicketModal open={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)} ticket={ticket} />
      {/* <ReassignDrawer open={isReassignDrawerOpen} onClose={() => setIsReassignDrawerOpen(false)} ticket={ticket} /> */}
    </Box>
  );
};

export default Index;
