// src / views / TicketDetail / TicketInfoPanel.jsx;
import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  TextField,
  FormHelperText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { assignTicket } from '../../redux/features/Tickets/TicketSlice';
import { getAllTeamMembers } from '../../redux/features/Team/TeamSlice';
import { toast } from 'react-toastify';

const statusColor = {
  Open: 'success',
  'In Progress': 'info',
  Resolved: 'default',
  Closed: 'default',
  escalated: 'warning',
  Escalated: 'warning'
};

const priorityLabel = {
  high: { color: 'error', label: 'High' },
  medium: { color: 'warning', label: 'Medium' },
  low: { color: 'default', label: 'Low' }
};

const TicketInfoPanel = ({ ticket, onCloseClick, currentUser }) => {
  const dispatch = useDispatch();
  const { teamMembers } = useSelector((s) => s.team);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamMembers || teamMembers.length === 0) {
      dispatch(getAllTeamMembers());
    }
  }, [dispatch, teamMembers]);

  const normalizedStatus = ticket?.status?.toLowerCase?.();
  const isClosedOrResolved = ['closed', 'resolved'].includes(normalizedStatus);

  const assignedName = ticket?.assignedTo
    ? ticket.assignedTo.firstName
      ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName || ''}`
      : ticket.assignedTo._id
    : 'Unassigned';

  const createdAt = ticket?.createdAt ? dayjs(ticket.createdAt).format('DD MMM YYYY, hh:mm A') : '-';
  const updatedAt = ticket?.updatedAt ? dayjs(ticket.updatedAt).format('DD MMM YYYY, hh:mm A') : '-';

  const handleOpenReassign = () => {
    if (isClosedOrResolved) {
      toast.info('Cannot reassign a closed/resolved ticket.');
      return;
    }
    setSelectedMember(ticket?.assignedTo?._id || '');
    setNote('');
    setReassignOpen(true);
  };

  const handleCloseReassign = () => setReassignOpen(false);

  const handleConfirmReassign = async () => {
    if (!selectedMember) {
      toast.error('Select a team member to assign.');
      return;
    }

    const member = teamMembers.find((m) => m._id === selectedMember);
    const newAssignedToModel = member?.userType || 'Team';

    try {
      setLoading(true);
      await dispatch(
        assignTicket({
          id: ticket._id,
          data: { newAssignedTo: selectedMember, newAssignedToModel, note }
        })
      ).unwrap();
      toast.success('Ticket reassigned');
      setReassignOpen(false);
    } catch (err) {
      toast.error(err || 'Failed to reassign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      {/* ===== HEADER ===== */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={1}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main' }}>{(ticket?._id || '').toString().slice(-4)}</Avatar>
          <Box>
            <Tooltip title={ticket?._id || ''}>
              <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
                Ticket #{ticket?._id || '—'}
              </Typography>
            </Tooltip>
            <Typography variant="caption" color="text.secondary">
              {ticket?.issueType ? ticket.issueType : 'General'}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="column" spacing={1.5} alignItems="center">
          <Chip
            label={ticket?.status || 'Unknown'}
            color={statusColor[ticket?.status] || 'default'}
            size="small"
            sx={{ fontWeight: 700, textTransform: 'capitalize' }}
          />
          <Chip
            icon={<PriorityHighIcon />}
            label={priorityLabel[ticket?.priority]?.label || ticket?.priority || 'Low'}
            color={priorityLabel[ticket?.priority]?.color || 'default'}
            size="small"
          />
          <Tooltip title="Close Ticket">
            <span>
              <Button variant="outlined" size="small" onClick={onCloseClick} disabled={isClosedOrResolved}>
                Close
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      <Divider sx={{ my: 1 }} />

      {/* ===== INFO GRID ===== */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
          mb: 2
        }}
      >
        {/* LEFT: CUSTOMER */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }} gutterBottom>
            Customer
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {ticket?.customer?.firstName
                  ? `${ticket.customer.firstName} ${ticket.customer.lastName || ''}`
                  : ticket?.customer?._id || 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {ticket?.customer?.phone || ticket?.customer?.email || ''}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* RIGHT: DATES */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }} gutterBottom>
            Timeline
          </Typography>
          <Stack spacing={0.8}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="caption" color="text.secondary">
                Created: {createdAt}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="caption" color="text.secondary">
                Updated: {updatedAt}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* ===== CONNECTION & DESCRIPTION ===== */}
      <Box mb={2}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} gutterBottom>
          Connection
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {ticket?.connection ? (typeof ticket.connection === 'object' ? ticket.connection._id || '—' : ticket.connection) : 'N/A'}
        </Typography>

        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} gutterBottom>
          Description
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }} mb={2}>
          {ticket?.description || '—'}
        </Typography>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* ===== ASSIGNED TO ===== */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} gutterBottom>
          Assigned To
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
              {ticket?.assignedTo?.firstName ? ticket.assignedTo.firstName.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {assignedName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {ticket?.assignedTo?.role || ticket?.assignedToModel || ''}
              </Typography>
            </Box>
          </Stack>

          <Tooltip title={isClosedOrResolved ? 'Cannot reassign closed/resolved ticket' : 'Reassign ticket'}>
            <span>
              <IconButton size="small" onClick={handleOpenReassign} disabled={isClosedOrResolved}>
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>

      {/* ===== REASSIGN DIALOG ===== */}
      <Dialog open={reassignOpen} onClose={handleCloseReassign} fullWidth maxWidth="sm">
        <DialogTitle>Reassign Ticket</DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="select-team-label">Select Team Member</InputLabel>
            <Select
              labelId="select-team-label"
              value={selectedMember}
              label="Select Team Member"
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {(teamMembers || []).map((m) => (
                <MenuItem key={m._id} value={m._id}>
                  {m.firstName} {m.lastName ? ` ${m.lastName}` : ''}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Only active team members are shown</FormHelperText>
          </FormControl>

          <TextField
            label="Note (optional)"
            multiline
            minRows={3}
            maxRows={6}
            fullWidth
            size="small"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReassign}>Cancel</Button>
          <Button onClick={handleConfirmReassign} variant="contained" disabled={loading}>
            {loading ? 'Assigning...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketInfoPanel;
