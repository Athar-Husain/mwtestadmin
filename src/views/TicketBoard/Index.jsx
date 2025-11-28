import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import { Box, Grid, CircularProgress, Drawer } from '@mui/material';
import dayjs from 'dayjs';

import AddTicket from './AddTicket';
import { getAllTickets, assignTicket, updateTicket, optimisticUpdateTicket } from '../../redux/features/Tickets/TicketSlice';
import { getAllTeamMembers } from '../../redux/features/Team/TeamSlice';
import StatusBoard from './StatusBoard';
import UserBoard from './UserBoard';
import TicketHeader from './TicketHeader';
import TeamList from './TeamList';
import ReassignDialog from './ReassignDialog';
// import ReassignDialog from '../../components/Tickets/ReassignDialog';

const TicketBoard = () => {
  const dispatch = useDispatch();
  const { allTickets, isTicketLoading } = useSelector((state) => state.ticket);
  const { teamMembers, isTeamLoading } = useSelector((state) => state.team);

  const [currentView, setCurrentView] = useState('user');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [mobileTeamListOpen, setMobileTeamListOpen] = useState(false);
  const [openAddTicket, setOpenAddTicket] = useState(false);

  const [filters, setFilters] = useState({
    status: '',
    startDate: null,
    endDate: null
  });

  // 🧠 New state for reassignment dialog
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [pendingReassign, setPendingReassign] = useState(null);

  useEffect(() => {
    dispatch(getAllTickets());
    dispatch(getAllTeamMembers());
  }, [dispatch]);

  const filteredTickets = useMemo(() => {
    return allTickets.filter((ticket) => {
      const matchesStatus = !filters.status || ticket.status === filters.status;
      const matchesUserId = selectedUserId === null || ticket.assignedTo?._id === selectedUserId;
      const createdDate = dayjs(ticket.createdAt);
      const matchesStartDate = !filters.startDate || createdDate.isAfter(dayjs(filters.startDate).startOf('day'));
      const matchesEndDate = !filters.endDate || createdDate.isBefore(dayjs(filters.endDate).endOf('day'));

      return matchesStatus && matchesUserId && matchesStartDate && matchesEndDate;
    });
  }, [allTickets, filters, selectedUserId]);

  // 🧩 Handle Drag Drop
  const handleOnDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const movedTicket = allTickets.find((t) => t._id === draggableId);
    if (!movedTicket) return;

    if (currentView === 'status') {
      const newStatus = destination.droppableId;
      if (movedTicket.status === newStatus) return;

      dispatch(optimisticUpdateTicket({ ticketId: draggableId, newStatus }));
      dispatch(updateTicket({ id: draggableId, data: { status: newStatus } }));
    } else if (currentView === 'user') {
      const newAssignedTo = destination.droppableId;
      if (movedTicket.assignedTo?._id === newAssignedTo) return;

      const fromUser = movedTicket.assignedTo?.name || 'Unassigned';
      const toUser = teamMembers.find((user) => user._id === newAssignedTo)?.name;
      const user = teamMembers.find((user) => user._id === newAssignedTo);
      const newAssignedToModel = user?.userType || 'Team';

      // 🟢 Open dialog before confirming reassignment
      setPendingReassign({
        id: draggableId,
        fromUser,
        toUser,
        newAssignedTo,
        newAssignedToModel
      });
      setReassignDialogOpen(true);
    }
  };

  // 🧠 Handle Confirm from Dialog
  const handleConfirmReassign = async (reason) => {
    if (!pendingReassign) return;
    const { id, newAssignedTo, newAssignedToModel } = pendingReassign;

    dispatch(
      optimisticUpdateTicket({
        ticketId: id,
        newAssignedTo,
        newAssignedToModel
      })
    );

    await dispatch(
      assignTicket({
        id,
        data: { newAssignedTo, newAssignedToModel, reason }
      })
    );

    setReassignDialogOpen(false);
    setPendingReassign(null);
    dispatch(getAllTickets());
  };

  const handleAddTicketClick = () => setOpenAddTicket(true);
  const handleCloseAddTicketModal = () => setOpenAddTicket(false);

  if (isTeamLoading || isTicketLoading) return <CircularProgress />;

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Drawer
          anchor="left"
          open={mobileTeamListOpen}
          onClose={() => setMobileTeamListOpen(false)}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <Box sx={{ width: 200, p: 2 }}>
            <TeamList
              users={teamMembers}
              allTickets={allTickets}
              selectedUserId={selectedUserId}
              onSelectUser={(id) => {
                setSelectedUserId((prev) => (prev === id ? null : id));
                setMobileTeamListOpen(false);
              }}
            />
          </Box>
        </Drawer>

        <Grid container sx={{ height: '100vh', overflow: 'hidden', flexWrap: 'nowrap' }}>
          <Grid
            size={{ xs: 12, md: 3, lg: 2 }}
            sx={{
              borderRight: '1px solid #ccc',
              overflowY: 'auto',
              display: { xs: 'none', md: 'block' }
            }}
          >
            <TeamList
              users={teamMembers}
              allTickets={allTickets}
              selectedUserId={selectedUserId}
              onSelectUser={(id) => setSelectedUserId((prev) => (prev === id ? null : id))}
            />
          </Grid>

          <Grid
            size={{ xs: 12, md: 9, lg: 10 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%'
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
              <TicketHeader
                title="Ticket Board"
                currentView={currentView}
                onViewChange={setCurrentView}
                onMobileTeamListToggle={() => setMobileTeamListOpen(true)}
                onFilterChange={setFilters}
                onAddTicketClick={handleAddTicketClick}
              />
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowX: 'auto',
                display: 'flex',
                flexDirection: 'row',
                p: 1
              }}
            >
              {currentView === 'status' ? (
                <StatusBoard tickets={filteredTickets} statuses={['Open', 'Escalated', 'In Progress', 'Closed']} />
              ) : (
                <UserBoard users={teamMembers} tickets={filteredTickets} selectedUserId={selectedUserId} />
              )}
            </Box>
          </Grid>
        </Grid>

        <AddTicket open={openAddTicket} handleClose={handleCloseAddTicketModal} />
      </DragDropContext>

      {/* 🟢 Reassign Reason Modal */}
      <ReassignDialog
        open={reassignDialogOpen}
        onClose={() => setReassignDialogOpen(false)}
        onConfirm={handleConfirmReassign}
        fromUser={pendingReassign?.fromUser}
        toUser={pendingReassign?.toUser}
      />
    </>
  );
};

export default TicketBoard;
