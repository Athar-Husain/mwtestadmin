import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Paper, TextField, Button, Stack, IconButton, Tooltip, Chip } from '@mui/material';
import { DataGrid, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton } from '@mui/x-data-grid';
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
import { getAllTickets, deleteTicket, resetTicketState } from '../../redux/features/Tickets/TicketSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import AddTicket from './AddTicket';

// 🎨 CHIP COMPONENT (Enhanced Color System)
const ChipStyled = ({ label, variant }) => {
  const colorMap = {
    status: {
      Open: 'info',
      'In Progress': 'warning',
      Escalated: 'error',
      Closed: 'success',
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

  const color = colorMap[variant]?.[label] || colorMap[variant].Default;
  const colorStyles =
    {
      info: { backgroundColor: '#e3f2fd', color: '#0288d1', borderColor: '#81d4fa' },
      warning: { backgroundColor: '#fff3e0', color: '#f57c00', borderColor: '#ffe0b2' },
      success: { backgroundColor: '#e8f5e9', color: '#2e7d32', borderColor: '#a5d6a7' },
      error: { backgroundColor: '#ffebee', color: '#d32f2f', borderColor: '#ef9a9a' },
      default: { backgroundColor: '#eceff1', color: '#455a64', borderColor: '#cfd8dc' }
    }[color] || {};

  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 600,
        textTransform: 'capitalize',
        fontSize: '0.75rem',
        minWidth: 90,
        borderWidth: 1.5,
        ...colorStyles
      }}
    />
  );
};

// 🎛️ TOOLBAR (Visually Polished with gradient and shadow)
const CustomToolbar = ({ searchTerm, setSearchTerm, handleRefresh, handleAddClick }) => {
  return (
    <Box
      sx={{
        p: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(90deg, #1976d2 0%, #6c63ff 100%)',
        color: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ width: '100%' }}>
        <TextField
          placeholder="Search by Subject, Status, or Assignee..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />
          }}
          sx={{
            width: { xs: '100%', sm: 320 },
            backgroundColor: 'white',
            borderRadius: 1
          }}
        />

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              background: 'linear-gradient(90deg, #43a047, #66bb6a)',
              color: 'white',
              textTransform: 'none',
              '&:hover': { background: 'linear-gradient(90deg, #388e3c, #43a047)' }
            }}
          >
            Add Ticket
          </Button>

          <Tooltip title="Refresh Data">
            <IconButton
              onClick={handleRefresh}
              size="small"
              sx={{
                backgroundColor: 'white',
                color: '#1976d2',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                '&:hover': { backgroundColor: '#e3f2fd' }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <GridToolbarColumnsButton sx={{ color: 'white' }} />
          <GridToolbarFilterButton sx={{ color: 'white' }} />
          <GridToolbarExport sx={{ color: 'white' }} />
        </Stack>
      </Stack>
    </Box>
  );
};

// 🧩 MAIN COMPONENT
const TicketsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allTickets, isLoading, isError, isSuccess, message } = useSelector((state) => state.ticket);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddTicketDialog, setOpenAddTicketDialog] = useState(false);

  useEffect(() => {
    dispatch(getAllTickets());
  }, [dispatch]);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess) toast.success(message);
    dispatch(resetTicketState());
  }, [isError, isSuccess, message, dispatch]);

  const filteredTickets = useMemo(
    () =>
      allTickets.filter(
        (t) =>
          t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.priority?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.assignedTo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.assignedTo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [allTickets, searchTerm]
  );

  const handleRefresh = () => dispatch(getAllTickets());
  const handleAddClick = () => setOpenAddTicketDialog(true);

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
      valueFormatter: (params) => (params.value ? dayjs(params.value).format('DD MMM YYYY') : 'N/A')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton color="primary" size="small" onClick={() => navigate(`/ticket/${params.row._id}`)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Ticket">
            <IconButton color="secondary" size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Ticket">
            <IconButton color="error" size="small" onClick={() => handleDelete(params.row._id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box p={4} sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Breadcrumbs
        links={[
          { label: 'Dashboard', to: '/' },
          { label: 'Tickets', to: '/tickets' }
        ]}
      />
      <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
        🎫 Ticket Management
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 0,
          mb: 4,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          height: 700
        }}
      >
        <DataGrid
          rows={filteredTickets}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          disableRowSelectionOnClick
          density="comfortable"
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
          pageSizeOptions={[10, 25, 50]}
          slots={{
            toolbar: () => (
              <CustomToolbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleRefresh={handleRefresh}
                handleAddClick={handleAddClick}
              />
            )
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#fafafa',
              fontWeight: 600
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f0f4ff'
            }
          }}
        />
      </Paper>

      <AddTicket open={openAddTicketDialog} handleClose={() => setOpenAddTicketDialog(false)} />
    </Box>
  );
};

export default TicketsList;
