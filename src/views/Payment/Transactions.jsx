import React from 'react';
import { Box, Typography, Paper, Stack, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import Breadcrumbs from '../../component/Breadcrumb';

const Transactions = () => {
    const columns = [
        { field: 'transactionId', headerName: 'Transaction ID', width: 180 },
        { field: 'userName', headerName: 'User Name', width: 180 },
        { field: 'amount', headerName: 'Amount', width: 150, type: 'number' },
        { field: 'status', headerName: 'Status', width: 150 },
        {
            field: 'date', headerName: 'Date', width: 180, type: 'date', valueGetter: (params) => {
                return new Date(params.value);  // Convert string to Date object
            }
        },
        {
            field: 'actions', headerName: 'Actions', width: 180, renderCell: () => <Stack direction="row" spacing={1}>
                <IconButton color="primary"><VisibilityIcon /></IconButton>
                <IconButton color="secondary"><EditIcon /></IconButton>
            </Stack>
        },
    ];

    const rows = [
        { id: 1, transactionId: 'TRX123', userName: 'John Doe', amount: 100, status: 'Completed', date: '2023-06-10' },
        { id: 2, transactionId: 'TRX124', userName: 'Jane Smith', amount: 200, status: 'Pending', date: '2023-06-12' },
        { id: 3, transactionId: 'TRX125', userName: 'David Johnson', amount: 150, status: 'Failed', date: '2023-06-13' },
    ];

    return (
        <Paper sx={{ height: 'auto', display: 'flex', flexDirection: 'column', paddingBottom: '50px' }}>
            <Typography variant="h5" sx={{ padding: 2 }}>Transactions Overview</Typography>
            <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 25, 50, 100]} checkboxSelection disableRowSelectionOnClick sx={{ '& .MuiDataGrid-footerContainer': { marginTop: 5 } }} />
        </Paper>
    );
};

export default Transactions;
