// src/pages/Tickets.jsx
import React, { useState, useEffect } from 'react';
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
    IconButton, // Added for Stack actions
    Stack // Added for actions in DataGrid cells
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';

// Imports for PDF and Excel Export
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Ensure this is installed: npm install jspdf jspdf-autotable
import * as XLSX from 'xlsx'; // Ensure this is installed: npm install xlsx
import { saveAs } from 'file-saver'; // Ensure this is installed: npm install file-saver

import { useForm, Controller } from 'react-hook-form';

// Assuming Breadcrumbs component exists at this path
// You might need to adjust the path based on your project structure, e.g., '../../components/Breadcrumb'
import Breadcrumbs from '../../component/Breadcrumb';

// Mock Data for Tickets
const mockTickets = [
    { id: 'T001', subject: 'Internet Down - John Doe', customer: 'John Doe', status: 'Open', priority: 'High', lastUpdate: '2024-08-22', assignedTo: 'Agent Alex', description: 'Customer reporting no internet connection.' },
    { id: 'T002', subject: 'Billing Inquiry - Jane Smith', customer: 'Jane Smith', status: 'Pending', priority: 'Medium', lastUpdate: '2024-08-21', assignedTo: 'Agent Bob', description: 'Query about monthly charges.' },
    { id: 'T003', subject: 'Slow Speed - Alice Brown', customer: 'Alice Brown', status: 'In Progress', priority: 'High', lastUpdate: '2024-08-20', assignedTo: 'Agent Alex', description: 'Intermittent slow internet speeds.' },
    { id: 'T004', subject: 'New Connection Request', customer: 'Bob White', status: 'Open', priority: 'Low', lastUpdate: '2024-08-19', assignedTo: 'Agent Charlie', description: 'Request for new fiber connection.' },
    { id: 'T005', subject: 'Connection Fixed - Mike Green', customer: 'Mike Green', status: 'Resolved', priority: 'High', lastUpdate: '2024-08-18', assignedTo: 'Agent Alex', description: 'Technician visit resolved line fault.' },
    { id: 'T006', subject: 'Plan Upgrade - Sarah Blue', customer: 'Sarah Blue', status: 'Completed', priority: 'Medium', lastUpdate: '2024-08-17', assignedTo: 'Agent Bob', description: 'Customer upgraded to 500Mbps plan.' },
    { id: 'T007', subject: 'Service Interruption', customer: 'David Lee', status: 'Open', priority: 'Critical', lastUpdate: '2024-08-23', assignedTo: 'Agent Charlie', description: 'No service since morning.' },
];

const Tickets = () => {
    const theme = useTheme();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null); // For editing
    const [dialogType, setDialogType] = useState('add'); // 'add' or 'edit'

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


    
    // const { teamMembers, isTeamLoading, isTeamError } = useSelector((state) => state.tickets);

    useEffect(() => {
        // Simulate fetching data
        const fetchTickets = () => {
            setLoading(true);
            setTimeout(() => {
                setTickets(mockTickets);
                setLoading(false);
            }, 500); // Simulate network delay
        };
        fetchTickets();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const handleOpenEditDialog = (ticket) => {
        setDialogType('edit');
        setCurrentTicket(ticket);
        reset({
            subject: ticket.subject,
            customer: ticket.customer,
            status: ticket.status,
            priority: ticket.priority,
            assignedTo: ticket.assignedTo,
            description: ticket.description,
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        reset();
    };

    const onSubmit = (data) => {
        if (dialogType === 'add') {
            const newTicket = {
                ...data,
                id: `T${String(tickets.length + 1).padStart(3, '0')}`,
                lastUpdate: new Date().toISOString().slice(0, 10), // Current date
            };
            setTickets(prev => [...prev, newTicket]);
            // In a real app, you'd send this to an API
        } else {
            setTickets(prev => prev.map(t => (t.id === currentTicket.id ? { ...data, id: t.id, lastUpdate: new Date().toISOString().slice(0, 10) } : t)));
            // In a real app, you'd send this update to an API
        }
        handleCloseDialog();
    };

    const handleDeleteTicket = (id) => {
        if (window.confirm(`Are you sure you want to delete ticket ${id}?`)) { // Using window.confirm for simplicity, replace with MUI Dialog for better UX
            setTickets(prev => prev.filter(ticket => ticket.id !== id));
            // In a real app, delete via API
        }
    };

    // --- Export Functions ---
    const exportPDF = () => {
        const doc = new jsPDF();
        const tableColumn = columns
            .filter(col => col.field !== 'actions')
            .map(col => col.headerName);

        const tableRows = filteredTickets.map(ticket =>
            columns
                .filter(col => col.field !== 'actions')
                .map(col => {
                    // Special handling for formatted fields or nested data if any
                    if (col.valueGetter) {
                        return col.valueGetter({ row: ticket }) || '';
                    }
                    // Handle Chip components by just getting the label
                    if (['status', 'priority'].includes(col.field)) {
                        return ticket[col.field];
                    }
                    return ticket[col.field] ?? '';
                })
        );

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20, // Start below breadcrumbs if they were on the PDF
            headStyles: { fillColor: theme.palette.primary.main },
            styles: {
                fontSize: 8,
                cellPadding: 3,
                overflow: 'linebreak'
            },
            columnStyles: {
                0: { cellWidth: 15 }, // ID
                1: { cellWidth: 50 }, // Subject
                2: { cellWidth: 30 }, // Customer
                3: { cellWidth: 25 }, // Status
                4: { cellWidth: 20 }, // Priority
                5: { cellWidth: 30 }, // Assigned To
                6: { cellWidth: 25 }, // Last Update
            }
        });

        doc.save('tickets.pdf');
    };

    const exportExcel = () => {
        const data = filteredTickets.map(ticket => {
            const rowData = {};
            columns.forEach(col => {
                if (col.field === 'actions') return;

                let value = ticket[col.field] ?? '';
                if (col.valueGetter) {
                    value = col.valueGetter({ row: ticket }) || '';
                }
                // For Chip fields, just get the raw value
                if (['status', 'priority'].includes(col.field)) {
                    value = ticket[col.field];
                }

                rowData[col.headerName] = value;
            });
            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

        // Use file-saver to download the file
        XLSX.writeFile(workbook, "tickets.xlsx");
    };
    // --- End Export Functions ---

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'subject', headerName: 'Subject', flex: 2 },
        { field: 'customer', headerName: 'Customer', flex: 1.5 },
        {
            field: 'status', headerName: 'Status', width: 120, renderCell: (params) => (
                <Chip label={params.value} color={
                    params.value === 'Open' ? 'primary' :
                        params.value === 'Pending' ? 'warning' :
                            params.value === 'In Progress' ? 'info' :
                                params.value === 'Resolved' || params.value === 'Completed' ? 'success' : 'default'
                } />
            )
        },
        {
            field: 'priority', headerName: 'Priority', width: 120, renderCell: (params) => (
                <Chip label={params.value} color={
                    params.value === 'High' || params.value === 'Critical' ? 'error' :
                        params.value === 'Medium' ? 'warning' :
                            params.value === 'Low' ? 'success' : 'default'
                } />
            )
        },
        { field: 'assignedTo', headerName: 'Assigned To', flex: 1.5 },
        {
            field: 'lastUpdate',
            headerName: 'Last Update',
            width: 130,
            valueGetter: (params) =>
                params?.row?.lastUpdate ? new Date(params.row.lastUpdate).toLocaleDateString() : '',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}> {/* Using Stack for consistent spacing */}
                    <IconButton color="primary" aria-label="view" size="small"
                        onClick={(event) => {
                            event.stopPropagation(); // Prevent row selection
                            alert(`Viewing ticket: ${params.row.id}`); // Replace with actual detail view navigation
                        }}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="secondary" aria-label="edit" size="small"
                        onClick={(event) => {
                            event.stopPropagation(); // Prevent row selection
                            handleOpenEditDialog(params.row);
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" aria-label="delete" size="small"
                        onClick={(event) => {
                            event.stopPropagation(); // Prevent row selection
                            handleDeleteTicket(params.row.id);
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    // Helper component for status/priority chips
    const Chip = ({ label, color }) => (
        <Box
            component="span"
            className="px-2 py-1 rounded-full text-xs font-semibold"
            sx={{
                backgroundColor: theme.palette[color]?.light || theme.palette.grey[300],
                color: theme.palette[color]?.dark || theme.palette.grey[900],
            }}
        >
            {label}
        </Box>
    );


    return (
        <Box className="p-4 sm:p-6 lg:p-8">
            {/* Breadcrumbs Component */}
            <Breadcrumbs
                links={[
                    { label: 'Dashboard', to: '/' },
                    { label: 'Tickets', to: '/tickets' },
                    { label: 'All' },
                ]}
                divider={true} // Assuming the divider prop is boolean
            />

            <Typography variant="h4" component="h1" className="mb-6 font-bold text-gray-800 dark:text-white">
                Tickets Management
            </Typography>

            <Paper className="rounded-xl shadow-lg p-4 mb-8 dark:bg-gray-700">
                <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
                    <TextField
                        label="Search Tickets"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: <SearchIcon className="mr-2 text-gray-500" />,
                        }}
                        className="w-full sm:w-auto flex-grow dark:text-white"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: theme.palette.grey[400] },
                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                            },
                            '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                            '& .MuiInputBase-input': { color: theme.palette.text.primary },
                        }}
                    />
                    <Box className="flex space-x-2">
                        <Button
                            onClick={exportPDF} // PDF Export Button
                            variant="outlined"
                            color="primary"
                            className="px-4 py-2 rounded-lg"
                            sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
                        >
                            Export PDF
                        </Button>
                        <Button
                            onClick={exportExcel} // Excel Export Button
                            variant="outlined"
                            color="secondary"
                            className="px-4 py-2 rounded-lg"
                            sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
                        >
                            Export Excel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAddDialog}
                            className="px-4 py-2 rounded-lg"
                        >
                            Add New Ticket
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<RefreshIcon />}
                            onClick={() => {
                                setLoading(true);
                                setTimeout(() => {
                                    setTickets(mockTickets); // Reset to initial mock data
                                    setLoading(false);
                                }, 500);
                            }}
                            className="px-4 py-2 rounded-lg"
                        >
                            Refresh
                        </Button>
                    </Box>
                </Box>

                {loading ? (
                    <Box className="flex justify-center items-center h-64">
                        <CircularProgress />
                        <Typography variant="h6" className="ml-4 dark:text-white">Loading Tickets...</Typography>
                    </Box>
                ) : (
                    <Box className="h-[70vh] w-full"> {/* Responsive height for DataGrid */}
                        <DataGrid
                            rows={filteredTickets}
                            columns={columns}
                            pageSizeOptions={[5, 10, 25, 50]}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10, page: 0 },
                                },
                            }}
                            // Removed `showToolbar` as it's not a direct prop for custom toolbars in DataGrid v5+
                            className="dark:text-white dark:bg-gray-800"
                            sx={{
                                '& .MuiDataGrid-root': {
                                    border: 'none',
                                },
                                '& .MuiDataGrid-cell': {
                                    borderColor: theme.palette.divider,
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiToolbar-root': {
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiButtonBase-root': { // For pagination buttons
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiDataGrid-iconButtonContainer': { // For sort icons
                                    color: theme.palette.text.primary,
                                },
                                '& .MuiDataGrid-sortIcon': {
                                    color: theme.palette.text.primary,
                                },
                            }}
                        />
                    </Box>
                )}
            </Paper>

            {/* Add/Edit Ticket Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ className: "rounded-xl dark:bg-gray-800 dark:text-white" }}>
                <DialogTitle className="dark:text-white">
                    {dialogType === 'add' ? 'Add New Ticket' : `Edit Ticket ${currentTicket?.id}`}
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Controller
                            name="subject"
                            control={control}
                            rules={{ required: 'Subject is required' }} // React Hook Form validation rule
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Subject"
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                    error={!!errors.subject}
                                    helperText={errors.subject?.message}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                        '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: theme.palette.grey[400] }, '&:hover fieldset': { borderColor: theme.palette.primary.main }, '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }, '& .MuiInputBase-input': { color: theme.palette.text.primary } },
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="customer"
                            control={control}
                            rules={{ required: 'Customer name is required' }} // React Hook Form validation rule
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Customer"
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                    error={!!errors.customer}
                                    helperText={errors.customer?.message}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                        '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: theme.palette.grey[400] }, '&:hover fieldset': { borderColor: theme.palette.primary.main }, '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }, '& .MuiInputBase-input': { color: theme.palette.text.primary } },
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="status"
                            control={control}
                            rules={{
                                required: 'Status is required',
                                validate: value => ['Open', 'Pending', 'In Progress', 'Resolved', 'Completed'].includes(value) || 'Invalid status selected'
                            }} // React Hook Form validation rule
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Status"
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                    error={!!errors.status}
                                    helperText={errors.status?.message}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                        '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: theme.palette.grey[400] }, '&:hover fieldset': { borderColor: theme.palette.primary.main }, '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }, '& .MuiInputBase-input': { color: theme.palette.text.primary } },
                                    }}
                                >
                                    {['Open', 'Pending', 'In Progress', 'Resolved', 'Completed'].map((statusOption) => (
                                        <MenuItem key={statusOption} value={statusOption} className="dark:bg-gray-900 dark:text-white">
                                            {statusOption}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            name="priority"
                            control={control}
                            rules={{
                                required: 'Priority is required',
                                validate: value => ['Low', 'Medium', 'High', 'Critical'].includes(value) || 'Invalid priority selected'
                            }} // React Hook Form validation rule
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Priority"
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                    error={!!errors.priority}
                                    helperText={errors.priority?.message}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                        '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: theme.palette.grey[400] }, '&:hover fieldset': { borderColor: theme.palette.primary.main }, '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }, '& .MuiInputBase-input': { color: theme.palette.text.primary } },
                                    }}
                                >
                                    {['Low', 'Medium', 'High', 'Critical'].map((priorityOption) => (
                                        <MenuItem key={priorityOption} value={priorityOption} className="dark:bg-gray-900 dark:text-white">
                                            {priorityOption}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            name="assignedTo"
                            control={control}
                            rules={{ required: 'Assigned agent is required' }} // React Hook Form validation rule
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Assigned To"
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                    error={!!errors.assignedTo}
                                    helperText={errors.assignedTo?.message}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                        '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: theme.palette.grey[400] }, '&:hover fieldset': { borderColor: theme.palette.primary.main }, '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }, '& .MuiInputBase-input': { color: theme.palette.text.primary } },
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: 'Description is required' }} // React Hook Form validation rule
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    margin="dense"
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                        '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: theme.palette.grey[400] }, '&:hover fieldset': { borderColor: theme.palette.primary.main }, '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }, '& .MuiInputBase-input': { color: theme.palette.text.primary } },
                                    }}
                                />
                            )}
                        />
                    </form>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={handleCloseDialog} color="inherit" className="dark:text-white">Cancel</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
                        {dialogType === 'add' ? 'Add Ticket' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Tickets;
