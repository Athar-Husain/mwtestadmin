// src/views/TicketDetail/TicketDetails.jsx
import React from 'react';
import { Box, Typography, Divider, Chip, Avatar, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);

const TicketDetails = ({ ticket }) => {
    if (!ticket) return null;

    const {
        issueType,
        priority,
        status,
        assignedTo,
        assignedToModel,
        description,
        createdAt,
        updatedAt,
        customer,
        attachments,
        connection,
    } = ticket;

    return (
        <Box p={2}>
            <Typography variant="h5" fontWeight="bold" mb={1}>
                Ticket Details
            </Typography>
            <Divider sx={{ mb: 2 }} />


            {/* Created & Updated */}
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                Created At: {new Date(createdAt).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Last Updated: {new Date(updatedAt).toLocaleString()}
            </Typography>

            {/* Issue Type */}
            <Typography variant="subtitle1" gutterBottom>
                Issue Type
            </Typography>
            <Typography variant="body1" mb={2}>
                {capitalize(issueType)}
            </Typography>

            {/* Priority */}
            <Typography variant="subtitle1" gutterBottom>
                Priority
            </Typography>
            <Chip
                label={capitalize(priority)}
                color={
                    priority === 'high'
                        ? 'error'
                        : priority === 'medium'
                            ? 'warning'
                            : 'default'
                }
                icon={<PriorityHighIcon />}
                sx={{ mb: 2 }}
            />

            {/* Status */}
            <Typography variant="subtitle1" gutterBottom>
                Status
            </Typography>
            <Chip
                label={capitalize(status)}
                color={
                    status === 'Open'
                        ? 'success'
                        : status === 'In Progress'
                            ? 'info'
                            : status === 'Closed'
                                ? 'default'
                                : 'warning'
                }
                sx={{ mb: 2 }}
            />

            {/* Assigned To */}
            <Typography variant="subtitle1" gutterBottom>
                Assigned To
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 30, height: 30 }}>
                    {assignedToModel?.charAt(0)}
                </Avatar>
                <Typography variant="body1">
                    {assignedToModel} - {assignedTo ? assignedTo.firstName || assignedTo._id : 'Unassigned'}
                </Typography>
            </Stack>

            {/* Customer */}
            <Typography variant="subtitle1" gutterBottom>
                Customer
            </Typography>
            <Typography variant="body1" mb={2}>
                {customer?.firstName || customer?._id || 'N/A'}
            </Typography>
            {/* Customer */}
            <Typography variant="subtitle1" gutterBottom>
                Connection
            </Typography>
            <Typography variant="body1" mb={2}>
                {connection?.userId || connection?._id || 'N/A'}
            </Typography>

            {/* Description */}
            <Typography variant="subtitle1" gutterBottom>
                Description
            </Typography>
            <Typography variant="body2" mb={2} sx={{ whiteSpace: 'pre-wrap' }}>
                {description}
            </Typography>



            {/* Attachments */}
            {attachments?.length > 0 && (
                <>
                    <Typography variant="subtitle1" gutterBottom>
                        Attachments
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {attachments.map((att) => (
                            <Box
                                key={att._id}
                                component="a"
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    p: 1,
                                    mb: 1,
                                    cursor: 'pointer',
                                    width: 100,
                                    textAlign: 'center',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    fontSize: '0.8rem',
                                }}
                                title={att.filename || 'Attachment'}
                            >
                                {att.filename || 'File'}
                            </Box>
                        ))}
                    </Stack>
                </>
            )}
        </Box>
    );
};

export default TicketDetails;
