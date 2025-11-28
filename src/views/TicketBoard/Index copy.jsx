// src/views/TicketBoard/Index.js
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import { Box, Grid, CircularProgress, Drawer } from '@mui/material';
import dayjs from 'dayjs';

import AddTicket from './AddTicket';
import {
    getAllTickets,
    assignTicket,
    updateTicket,
    optimisticUpdateTicket,
} from '../../redux/features/Tickets/TicketSlice';

import { getAllTeamMembers } from '../../redux/features/Team/TeamSlice';

import StatusBoard from './StatusBoard';
import UserBoard from './UserBoard';
import TicketHeader from './TicketHeader';
import TeamList from './TeamList';

const TicketBoard = () => {
    const dispatch = useDispatch();
    const { allTickets, isTicketLoading } = useSelector((state) => state.ticket);
    const { teamMembers, isTeamLoading } = useSelector((state) => state.team);

    const [currentView, setCurrentView] = useState('user');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [mobileTeamListOpen, setMobileTeamListOpen] = useState(false);

    const [openAddTicket, setOpenAddTicket] = useState(false); //for add ticket

    const [filters, setFilters] = useState({
        status: '',
        startDate: null,
        endDate: null
    });

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

            // ✅ Combine all filter conditions
            return matchesStatus && matchesUserId && matchesStartDate && matchesEndDate;
        });
    }, [allTickets, filters, selectedUserId]); // ✅ Add selectedUserId to the dependency array

    const handleOnDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const movedTicket = allTickets.find((t) => t._id === draggableId);
        if (!movedTicket) return;

        if (currentView === 'status') {
            const newStatus = destination.droppableId;
            if (movedTicket.status === newStatus) return;

            dispatch(optimisticUpdateTicket({ ticketId: draggableId, newStatus }));
            await dispatch(updateTicket({ id: draggableId, data: { status: newStatus } }));
            await dispatch(getAllTickets());
        } else if (currentView === 'user') {
            const newAssignedTo = destination.droppableId;
            if (movedTicket.assignedTo?._id === newAssignedTo) return;

            const user = teamMembers.find((user) => user._id === newAssignedTo);
            const newAssignedToModel = user?.userType || 'Team';

            dispatch(
                optimisticUpdateTicket({
                    ticketId: draggableId,
                    newAssignedTo,
                    newAssignedToModel,
                })
            );

            await dispatch(
                assignTicket({
                    id: draggableId,
                    data: { newAssignedTo, newAssignedToModel },
                })
            );

            await dispatch(getAllTickets());
        }
    };


    const handleAddTicketClick = () => {
        setOpenAddTicket(true);  // Open the Add Ticket modal
    };

    const handleCloseAddTicketModal = () => {
        setOpenAddTicket(false);  // Close the Add Ticket modal
    };

    if (isTeamLoading || isTicketLoading) return <CircularProgress />;
    // if (isTicketLoading) return <CircularProgress />;


    // console.log("isTicketLoading", isTicketLoading)
    // console.log("isTeamLoading", isTeamLoading)

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
                    <Grid size={{ xs: 12, md: 3, lg: 2 }} sx={{ borderRight: '1px solid #ccc', overflowY: 'auto', display: { xs: 'none', md: 'block' } }}>
                        <TeamList
                            users={teamMembers}
                            allTickets={allTickets}
                            selectedUserId={selectedUserId}
                            onSelectUser={(id) => setSelectedUserId((prev) => (prev === id ? null : id))}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 9, lg: 10 }} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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

                        <Box sx={{ flex: 1, overflowX: 'auto', display: 'flex', flexDirection: 'row', p: 1 }}>
                            {currentView === 'status' ? (
                                <StatusBoard tickets={filteredTickets} statuses={['Open', 'Escalated', 'In Progress', 'Closed']} />
                            ) : (
                                <UserBoard users={teamMembers} tickets={filteredTickets} selectedUserId={selectedUserId} />
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <AddTicket open={openAddTicket}
                    // onClosdwe={handleCloseAddTicketModal}
                    handleClose={() => setOpenAddTicket(false)} />
            </DragDropContext>
        </>

    );
};

export default TicketBoard;