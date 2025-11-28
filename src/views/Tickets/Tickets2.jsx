import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    CircularProgress,
    IconButton,
    Stack,
    Autocomplete
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { useForm, Controller } from 'react-hook-form';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Breadcrumbs from '../../component/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import {
    createTicket,
    updateTicket,
    deleteTicket,
    getAllTickets,
    resetTicketState
} from '../../redux/features/Tickets/TicketSlice';
import { toast } from 'react-toastify';

const Tickets = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { allTickets, isLoading, isError, isSuccess, message } = useSelector(state => state.ticket);
    const { connections, } = useSelector(state => state.connection);

    // Search & Dialog states
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [dialogType, setDialogType] = useState('add');

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            subject: '',
            customer: '',
            status: 'Open',
            priority: 'Medium',
            assignedTo: '',
            description: '',
        },
    });

    useEffect(() => {
        dispatch(getAllTickets());
    }, [dispatch]);

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess) toast.success(message);
        dispatch(resetTicketState());
    }, [isError, isSuccess, message, dispatch]);

    const filteredTickets = allTickets.filter(ticket =>
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = e => setSearchTerm(e.target.value);

    const handleOpenAddDialog = () => {
        setDialogType('add');
        setCurrentTicket(null);
        reset({
            subject: '',
            customer: '',
            status: 'Open',
            priority: 'Medium',
            assignedTo: '',
            description: '',
        });
        setOpenDialog(true);
    };

    const handleOpenEditDialog = ticket => {
        setDialogType('edit');
        setCurrentTicket(ticket);
        reset({
            subject: ticket.subject || '',
            customer: ticket.customer?.firstName + ' ' + ticket.customer?.lastName || '',
            status: ticket.status,
            priority: ticket.priority,
            assignedTo: ticket.assignedTo?.name || '',
            description: ticket.description,
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        reset();
    };

    const onSubmit = data => {
        if (dialogType === 'add') {
            dispatch(createTicket(data));
        } else {
            dispatch(updateTicket({ id: currentTicket._id, data }));
        }
        handleCloseDialog();
    };

    const handleDelete = ticketId => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            dispatch(deleteTicket(ticketId));
        }
    };

    const refreshTickets = () => dispatch(getAllTickets());

    const exportPDF = () => {
        const doc = new jsPDF();
        const header = ['Subject', 'Status', 'Priority', 'Assigned To', 'Description'];
        const rows = filteredTickets.map(t => [
            t.subject,
            t.status,
            t.priority,
            t.assignedTo?.name || '',
            t.description
        ]);

        autoTable(doc, {
            head: [header],
            body: rows,
            startY: 20,
            theme: 'striped',
            headStyles: { fillColor: theme.palette.primary.main },
        });
        doc.save('tickets.pdf');
    };

    const exportExcel = () => {
        const data = filteredTickets.map(t => ({
            Subject: t.subject,
            Status: t.status,
            Priority: t.priority,
            'Assigned To': t.assignedTo?.name || '',
            Description: t.description
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');
        XLSX.writeFile(workbook, 'tickets.xlsx');
    };

    const columns = [
        { field: 'subject', headerName: 'Subject', flex: 2 },
        { field: 'status', headerName: 'Status', width: 120, renderCell: ChipCell('status') },
        { field: 'priority', headerName: 'Priority', width: 120, renderCell: ChipCell('priority') },
        {
            field: 'assignedTo',
            headerName: 'Assigned To',
            flex: 1.5,
            valueGetter: params => params.row.assignedTo?.name || '',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: params => (
                <Stack direction="row" spacing={1}>
                    <IconButton color="primary" size="small" onClick={() => alert(`View ${params.row._id}`)}>
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="secondary" size="small" onClick={() => handleOpenEditDialog(params.row)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            ),
        }
    ];

    return (
        <Box p={4}>
            <Breadcrumbs links={[{ label: 'Dashboard', to: '/' }, { label: 'Tickets', to: '/tickets' }]} divider />

            <Typography variant="h4" gutterBottom>
                Tickets Management
            </Typography>

            <Paper sx={{ p: 2, mb: 4 }}>
                <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={2}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearch}
                        sx={{ mb: 1, flex: '1', minWidth: 200 }}
                        InputProps={{ startAdornment: <SearchIcon /> }}
                    />
                    <Box>
                        <Button onClick={exportPDF} variant="outlined" sx={{ mr: 1 }}>Export PDF</Button>
                        <Button onClick={exportExcel} variant="outlined" sx={{ mr: 1 }}>Export Excel</Button>
                        <Button onClick={handleOpenAddDialog} variant="contained" startIcon={<AddIcon />} sx={{ mr: 1 }}>Add Ticket</Button>
                        <Button onClick={refreshTickets} variant="outlined" startIcon={<RefreshIcon />}>Refresh</Button>
                    </Box>
                </Box>

                {isLoading ? (
                    <Box textAlign="center" py={10}>
                        <CircularProgress />
                        <Typography variant="body1" mt={2}>Loading tickets...</Typography>
                    </Box>
                ) : (
                    <Box height={500}>
                        <DataGrid rows={filteredTickets} columns={columns} getRowId={r => r._id} pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
                    </Box>
                )}
            </Paper>

            {/* Add / Edit Ticket Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{dialogType === 'add' ? 'Add New Ticket' : `Edit Ticket`}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {[
                            { name: 'subject', label: 'Subject' },
                            { name: 'customer', label: 'Customer' },
                            { name: 'status', label: 'Status', selectOptions: ['Open', 'Pending', 'In Progress', 'Resolved', 'Completed'] },
                            { name: 'priority', label: 'Priority', selectOptions: ['Low', 'Medium', 'High', 'Critical'] },
                            { name: 'assignedTo', label: 'Assigned To' },
                            { name: 'description', label: 'Description', multiline: true, rows: 4 }
                        ].map(field => (
                            // <Controller
                            //     key={field.name}
                            //     name={field.name}
                            //     control={control}
                            //     rules={{ required: `${field.label} is required` }}
                            //     render={({ field: ctrl }) => (
                            //         <TextField
                            //             {...ctrl}
                            //             label={field.label}
                            //             variant="outlined"
                            //             margin="dense"
                            //             fullWidth
                            //             select={!!field.selectOptions}
                            //             multiline={field.multiline}
                            //             rows={field.rows}
                            //             error={!!errors[field.name]}
                            //             helperText={errors[field.name]?.message}
                            //         >
                            //             {field.selectOptions && field.selectOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                            //         </TextField>
                            //     )}
                            // />

                            <Controller
                                name="connectionId"
                                control={control}
                                rules={{ required: 'Connection is required' }}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        options={connections} // from Redux
                                        getOptionLabel={(opt) => `${opt.boxId} – ${opt.customerName}`}
                                        onChange={(_, value) => field.onChange(value?._id)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Connection"
                                                variant="outlined"
                                                error={!!errors.connectionId}
                                                helperText={errors.connectionId?.message}
                                            />
                                        )}
                                        sx={{ mb: 2 }}
                                        disableClearable
                                    />
                                )}
                            />

                        ))}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained">{dialogType === 'add' ? 'Add' : 'Save'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Tickets;


// Helper to render colored chips for status/priority
const ChipCell = (field) => (params) => {
    const value = params.value;
    const colorMap = {
        status: { Open: 'blue', 'In Progress': 'orange', Resolved: 'green', Default: 'grey' },
        priority: { High: 'red', Medium: 'orange', Low: 'green', Default: 'grey' }
    };
    const color = colorMap[field][value] || colorMap[field].Default;
    return (
        <Box component="span" sx={{ px: 1, py: 0.5, borderRadius: '4px', backgroundColor: theme => theme.palette[color]?.light, color: theme => theme.palette[color]?.dark || '#000', fontSize: '0.75rem' }}>
            {value}
        </Box>
    );
};
