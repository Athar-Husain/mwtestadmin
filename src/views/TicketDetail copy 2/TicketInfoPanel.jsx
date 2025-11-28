// src/views/TicketDetail/TicketInfoPanel.jsx
import React from 'react';
import { Box, Typography, Divider, Chip, Stack, Avatar, Button } from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/system';
import dayjs from 'dayjs';

const TopStrip = styled(Box)(({ theme }) => ({
  background: `linear-gradient(90deg, rgba(76,139,245,0.07), rgba(76,139,245,0.02))`,
  padding: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center'
}));

const TicketInfoPanel = ({ ticket, onCloseClick, currentUser }) => {
  if (!ticket) return null;

  const { issueType, priority, status, assignedTo, assignedToModel, description, createdAt, updatedAt, customer, attachments, connection } =
    ticket;

  const priorityColor = priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'default';

  return (
    <Box>
      <TopStrip>
        <Stack spacing={0.5}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Ticket #{ticket._id?.slice(-6)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {ticket.issueType ? ticket.issueType.toUpperCase() : 'GENERAL'}
          </Typography>
        </Stack>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Chip
            icon={<PriorityHighIcon />}
            label={priority?.charAt(0)?.toUpperCase() + priority?.slice(1)}
            color={priorityColor}
            size="small"
          />
          <Chip label={status} size="small" />
        </Box>
      </TopStrip>

      <Box p={2}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" color="text.secondary">
            Created
          </Typography>
          <Typography variant="body2">{dayjs(createdAt).format('DD MMM YYYY, HH:mm')}</Typography>

          <Divider />

          <Typography variant="subtitle2" color="text.secondary">
            Assigned To
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 36, height: 36 }}>{assignedTo?.firstName?.[0] || assignedTo?._id?.[0] || assignedToModel?.[0]}</Avatar>
            <Box>
              <Typography variant="body1">{assignedTo ? `${assignedTo.firstName} ${assignedTo.lastName || ''}` : 'Unassigned'}</Typography>
              <Typography variant="caption" color="text.secondary">
                {assignedToModel || '—'}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Typography variant="subtitle2" color="text.secondary">
            Customer
          </Typography>
          <Typography variant="body2">{customer?.firstName ? `${customer.firstName} ${customer.lastName || ''}` : 'N/A'}</Typography>

          <Typography variant="subtitle2" color="text.secondary">
            Connection
          </Typography>
          {/* <Typography variant="body2">{connection || 'N/A'}</Typography> */}
          {/* <Typography variant="body2">{connection || 'N/A'}</Typography> */}
          <Typography>{ticket.customer?.firstName || 'N/A'}</Typography>

          <Divider />

          <Typography variant="subtitle2" color="text.secondary">
            Description
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {description}
          </Typography>

          {attachments?.length > 0 && (
            <>
              <Divider />
              <Typography variant="subtitle2" color="text.secondary">
                Attachments
              </Typography>
              <Stack direction="row" spacing={1}>
                {attachments.map((a) => (
                  <Box key={a._id} component="a" href={a.url || '#'} target="_blank" sx={{ fontSize: 12 }}>
                    {a.filename || 'File'}
                  </Box>
                ))}
              </Stack>
            </>
          )}

          <Divider />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
              Last updated {dayjs(updatedAt).fromNow ? dayjs(updatedAt).fromNow() : dayjs(updatedAt).format('DD MMM')}
            </Typography>
            <Button variant="contained" color="error" size="small" onClick={onCloseClick}>
              Close
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default TicketInfoPanel;
