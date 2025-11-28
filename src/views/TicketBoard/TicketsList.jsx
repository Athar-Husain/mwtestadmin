// src/views/TicketBoard/TicketList.jsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  DataGrid,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';

import Breadcrumbs from '../../component/Breadcrumb';
import AddTicket from './AddTicket';
// import EditTicket from './EditTicket';
import { getAllTickets, deleteTicket, resetTicketState } from '../../redux/features/Tickets/TicketSlice';

// ===================================================
// 🔹 CHIP COMPONENT — Unified for Status & Priority
// ===================================================
const ChipStyled = ({ label = 'N/A', variant }) => {
  const theme = useTheme();

  const colorMap = {
    status: {
      Open: 'info',
      'In Progress': 'warning',
      Escalated: 'error',
      Closed: 'success',
      Resolved: 'success',
      Default: 'default'
    },
    priority: {
      Low: 'success',
      Medium: 'warning',
      High: 'error',
      Critical: 'error',
      Default: 'default'
    }
  };

  const color = colorMap[variant]?.[label] || colorMap[variant]?.Default || 'default';

  return (
    <Chip
      label={label}
      color={color !== 'default' ? color : undefined}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 600,
        textTransform: 'capitalize',
        fontSize: '0.75rem',
        minWidth: 90,
        ...(color === 'default' && {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.secondary,
          borderColor: theme.palette.grey[300]
        })
      }}
    />
  );
};

// ===================================================
// 🔹 CUSTOM TOOLBAR WITH SEARCH, REFRESH, EXPORT
// ===================================================
const CustomToolbar = ({ searchTerm, setSearchTerm, handleRefresh, handleAddClick }) => {
  return (
    <Box
      sx={{
        p: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        flexGrow={1}
        spacing={2}
        sx={{ width: '100%' }}
      >
        <TextField
          label="Search tickets..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />
          }}
          sx={{ width: { xs: '100%', sm: 300 } }}
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            size="small"
            disableElevation
          >
            Add Ticket
          </Button>

          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} size="small" color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarExport />
        </Stack>
      </Stack>
    </Box>
  );
};

// ===================================================
// 🔹 MAIN COMPONENT — TICKETS LIST
// ===================================================
const TicketsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { allTickets, isLoading, isError, isSuccess, message } = useSelector((state) => state.ticket);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [openAddTicketDialog, setOpenAddTicketDialog] = useState(false);
  const [openEditTicketDialog, setOpenEditTicketDialog] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // Fetch tickets
  useEffect(() => {
    dispatch(getAllTickets());
  }, [dispatch]);

  // Toast feedback
  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess) toast.success(message);
    dispatch(resetTicketState());
  }, [isError, isSuccess, message, dispatch]);

  // Debounced Search (for smoother performance)
  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        const filtered = allTickets.filter((t) => {
          const search = term.toLowerCase();
          return (
            t?.description?.toLowerCase().includes(search) ||
            t?.status?.toLowerCase().includes(search) ||
            t?.priority?.toLowerCase().includes(search) ||
            t?.assignedTo?.firstName?.toLowerCase().includes(search) ||
            t?.assignedTo?.lastName?.toLowerCase().includes(search)
          );
        });
        setFilteredTickets(filtered);
      }, 400),
    [allTickets]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Refresh
  const handleRefresh = () => dispatch(getAllTickets());

  // Add & Edit
  const handleAddClick = () => setOpenAddTicketDialog(true);
  const handleEditClose = () => {
    setOpenEditTicketDialog(false);
    setEditingTicket(null);
  };
  const openEditDialog = (ticketData) => {
    setEditingTicket(ticketData);
    setOpenEditTicketDialog(true);
  };

  // Delete Handler
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      dispatch(deleteTicket(id));
    }
  };

  // DataGrid Columns (memoized)
  const columns = useMemo(
    () => [
      {
        field: 'description',
        headerName: 'Description',
        flex: 2.5,
        minWidth: 200,
        sortable: false,
        renderCell: (params) => (
          <Tooltip title={params.value || ''} placement="top">
            <Typography variant="body2" noWrap>
              {params.value}
            </Typography>
          </Tooltip>
        )
      },
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
        minWidth: 150,
        valueGetter: (params) => {
          const assigned = params.row?.assignedTo;
          return assigned ? `${assigned.firstName || ''} ${assigned.lastName || ''}` : 'Unassigned';
        }
      },
      {
        field: 'createdAt',
        headerName: 'Created On',
        width: 150,
        valueFormatter: (params) => dayjs(params.value).format('DD MMM YYYY')
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Tooltip title="View Details">
              <IconButton color="primary" size="small" onClick={() => navigate(`/ticket/${params.row._id}`)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Ticket">
              <IconButton size="small" color="primary" onClick={() => openEditDialog(params.row)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Ticket">
              <IconButton size="small" color="error" onClick={() => handleDelete(params.row._id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    ],
    [navigate]
  );

  return (
    <Box p={4}>
      <Breadcrumbs
        title="Ticket Management"
        subtitle="View and manage all support requests."
        isCard
        links={[
          { label: 'Dashboard', to: '/' },
          { label: 'Tickets', to: '/tickets' }
        ]}
      />

      <Paper sx={{ mt: 4, height: 700 }}>
        <DataGrid
          rows={searchTerm ? filteredTickets : allTickets}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          disableRowSelectionOnClick
          density="comfortable"
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
          slots={{
            toolbar: () => (
              <CustomToolbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleRefresh={handleRefresh}
                handleAddClick={handleAddClick}
              />
            ),
            loadingOverlay: () => (
              <Stack alignItems="center" justifyContent="center" height="100%">
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Loading Tickets...
                </Typography>
              </Stack>
            ),
            noRowsOverlay: () => (
              <Stack alignItems="center" justifyContent="center" height="100%">
                <Typography variant="body2" color="text.secondary">
                  No tickets found.
                </Typography>
              </Stack>
            )
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        />
      </Paper>

      {/* Dialogs */}
      <AddTicket open={openAddTicketDialog} handleClose={() => setOpenAddTicketDialog(false)} />

      {/* {openEditTicketDialog && (
        <EditTicket open={openEditTicketDialog} handleClose={handleEditClose} ticketData={editingTicket} />
      )} */}
    </Box>
  );
};

export default TicketsList;
