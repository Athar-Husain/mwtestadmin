import React, { useEffect, useState, useMemo } from 'react';
import {
    Box, Typography, Paper, TextField, Button, Stack,
    IconButton, CircularProgress, Tooltip, Chip
} from '@mui/material';
import {
    DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton
} from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    DeleteOutline as DeleteIcon
} from '@mui/icons-material';
import Breadcrumbs from '../../component/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllTickets, deleteTicket, resetTicketState
} from '../../redux/features/Tickets/TicketSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const Tickets = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allTickets, isLoading, isError, isSuccess, message } = useSelector(state => state.ticket);
    console.log("all tickets in tickets list", allTickets);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getAllTickets());
    }, [dispatch]);

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess) toast.success(message);
        dispatch(resetTicketState());
    }, [isError, isSuccess, message, dispatch]);

    const filteredTickets = useMemo(() =>
        allTickets.filter(t =>
            t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.priority?.toLowerCase().includes(searchTerm.toLowerCase())
        ), [allTickets, searchTerm]);

    console.log("Filtered Tickets:", filteredTickets);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            dispatch(deleteTicket(id));
        }
    };

    const columns = [
        { field: 'subject', headerName: 'Subject', flex: 2, minWidth: 160 },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => <ChipStyled label={params.value} variant="status" />
        },
        {
            field: 'priority',
            headerName: 'Priority',
            width: 130,
            renderCell: (params) => <ChipStyled label={params.value} variant="priority" />
        },
        {
            field: 'assignedTo',
            headerName: 'Assigned To',
            flex: 1.5,
            valueGetter: (params) => {
                const assigned = params.row?.assignedTo;
                return assigned ? `${assigned.firstName || ''} ${assigned.lastName || ''}` : 'Unassigned';
            }
        },
        {
            field: 'createdAt',
            headerName: 'Created On',
            width: 150,
            valueGetter: (params) => {
                const createdAt = params.row?.createdAt;
                return createdAt ? dayjs(createdAt).format('DD MMM YYYY') : 'N/A';
            }
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 2.5,
            minWidth: 200,
            renderCell: (params) => (
                <Tooltip title={params.value || ''}>
                    <Typography variant="body2" noWrap>{params.value}</Typography>
                </Tooltip>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Tooltip title="View">
                        <IconButton size="small" onClick={() => viewTicket(params.row._id, navigate)}>
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => openEditDialog(params.row)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(params.row._id)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            )
        }
    ];


    return (
        <Box p={4}>
            <Breadcrumbs links={[{ label: 'Dashboard', to: '/' }, { label: 'Tickets', to: '/tickets' }]} />
            <Typography variant="h4" gutterBottom>Tickets Management</Typography>

            <Paper sx={{ p: 2, mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2} mb={2}>
                    <TextField
                        label="Search tickets..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1 }} />
                        }}
                        sx={{ flexGrow: 1, maxWidth: 300 }}
                    />
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => openEditDialog(null)}>
                            Add Ticket
                        </Button>
                        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => dispatch(getAllTickets())}>
                            Refresh
                        </Button>
                    </Stack>
                </Stack>

                {isLoading ? (
                    <Box textAlign="center" py={6}>
                        <CircularProgress />
                        <Typography mt={2}>Loading tickets...</Typography>
                    </Box>
                ) : (
                    <Box sx={{ height: 600 }}>
                        <DataGrid
                            rows={filteredTickets}
                            columns={columns}
                            getRowId={(row) => row._id}
                            disableRowSelectionOnClick
                            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                            pageSizeOptions={[10, 25, 50]}
                            slots={{
                                toolbar: CustomToolbar
                            }}
                        />
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default Tickets;

// --- Components ---

const CustomToolbar = () => (
    <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarExport />
    </GridToolbarContainer>
);

const ChipStyled = ({ label, variant }) => {
    const colorMap = {
        status: { Open: 'primary', 'In Progress': 'warning', Escalated: 'error', Closed: 'success', Default: 'default' },
        priority: { Low: 'success', Medium: 'warning', High: 'error', Critical: 'error', Default: 'default' }
    };
    const color = colorMap[variant]?.[label] || colorMap[variant].Default;

    return (
        <Chip
            label={label}
            color={color}
            size="small"
            sx={{
                fontWeight: 600,
                textTransform: 'capitalize',
                fontSize: '0.75rem'
            }}
        />
    );
};

// Placeholder for future implementations
function viewTicket(id, navigate) {
    navigate(`/ticket/${id}`);
}

function openEditDialog(ticket) {
    console.log('Open edit dialog for:', ticket);
    // Show modal logic here
}
