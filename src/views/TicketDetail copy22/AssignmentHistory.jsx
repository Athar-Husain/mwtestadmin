// src/views/TicketDetail/AssignmentHistory.jsx
import React, { useMemo } from 'react';
import { Box, Typography, Stack, Avatar, Divider, Chip } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const AssignmentHistory = ({ ticket }) => {
  const teamMembers = useSelector((s) => s.team.teamMembers || []);
  const admins = useSelector((s) => s.admin?.allAdmins || []); // if you keep an admins list use it; otherwise will fallback

  // helper to resolve id -> name
  const resolvePerson = (id) => {
    if (!id) return { name: 'Unknown', type: '' };
    const t = teamMembers.find((m) => m._id === id);
    if (t) return { name: `${t.firstName} ${t.lastName || ''}`, type: t.userType || 'Team' };
    const a = admins.find((a) => a._id === id);
    if (a) return { name: `${a.firstName} ${a.lastName || ''}`, type: a.userType || 'Admin' };
    // try checking ticket.related populated fields
    if (ticket?.assignedTo?._id === id) return { name: ticket.assignedTo.firstName || id, type: ticket.assignedTo.userType || 'Team' };
    if (ticket?.createdBy?._id === id) return { name: ticket.createdBy.firstName || id, type: ticket.createdBy.userType || 'Admin' };
    return { name: id.toString().slice(0, 8), type: '' };
  };

  const entries = ticket?.assignmentHistory || [];

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt));
  }, [entries]);

  if (!entries || entries.length === 0) {
    return (
      <Box p={1}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Assignment History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No assignment history yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <TimelineIcon />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Assignment History
        </Typography>
        <Chip label={`${entries.length} changes`} size="small" sx={{ ml: 'auto' }} />
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {sorted.map((h) => {
          const assigned = resolvePerson(h.assignedTo);
          const by = resolvePerson(h.assignedBy);
          return (
            <Box key={h.assignedAt + assigned.name} sx={{ p: 1, borderRadius: 1, bgcolor: 'background.paper', boxShadow: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 36, height: 36 }}>{assigned.name?.charAt(0)?.toUpperCase() || 'U'}</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {assigned.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Assigned by {by.name} • {dayjs(h.assignedAt).format('DD MMM YYYY, hh:mm A')}
                  </Typography>
                  {h.note && (
                    <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                      <strong>Note: </strong>
                      {h.note}
                    </Typography>
                  )}
                </Box>
              </Stack>
              <Divider sx={{ my: 1 }} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default AssignmentHistory;
