import React from 'react';
import { Box, Typography, Paper, Stack, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import Breadcrumbs from '../../component/Breadcrumb';

const Refunds = () => {
    const columns = [
        { field: 'refundId', headerName: 'Refund ID', width: 180 },
        { field: 'userName', headerName: 'User Name', width: 180 },
        { field: 'amount', headerName: 'Amount', width: 150, type: 'number' },
        {
            field: 'refundDate', headerName: 'Refund Date', width: 180, type: 'date', valueGetter: (params) => {
                return new Date(params.value);  // Convert string to Date object
            }
        },
        { field: 'status', headerName: 'Status', width: 150 },
        {
            field: 'actions', headerName: 'Actions', width: 180, renderCell: () => <Stack direction="row" spacing={1}>
                <IconButton color="primary"><VisibilityIcon /></IconButton>
                <IconButton color="secondary"><EditIcon /></IconButton>
            </Stack>
        },
    ];

    const rows = [
        { id: 1, refundId: 'REF123', userName: 'John Doe', amount: 100, refundDate: '2023-06-10', status: 'Completed' },
        { id: 2, refundId: 'REF124', userName: 'Jane Smith', amount: 200, refundDate: '2023-06-12', status: 'Pending' },
        { id: 3, refundId: 'REF125', userName: 'David Johnson', amount: 150, refundDate: '2023-06-13', status: 'Failed' },
    ];

    return (
        <Paper sx={{ height: 'auto', display: 'flex', flexDirection: 'column', paddingBottom: '50px' }}>
            <Typography variant="h5" sx={{ padding: 2 }}>Refunds Overview</Typography>
            <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 25, 50, 100]} checkboxSelection disableRowSelectionOnClick sx={{ '& .MuiDataGrid-footerContainer': { marginTop: 5 } }} />
        </Paper>
    );
};

export default Refunds;
