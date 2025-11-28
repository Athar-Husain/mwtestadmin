import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Paper,
    IconButton,
    Stack
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Breadcrumbs from '../../component/Breadcrumb';
import { gridSpacing } from '../../config.js';

// Updated Dummy Data with Featured Field
const rows = [
    {
        id: 1,
        packageName: 'Ultimate Package',
        price: 149.99,
        duration: '3 Months',
        internetSpeed: '1000 Mbps',
        features: ['Up to 1 Gbps download speed', 'Best for heavy usage', 'Premium support line', 'Smart home device compatibility'],
        status: 'Active',
        createdAt: '2025-05-10',
        updatedAt: '2025-06-01',
        featured: true,  // Featured Package
    },
    {
        id: 2,
        packageName: 'Standard Package',
        price: 99.99,
        duration: '6 Months',
        internetSpeed: '500 Mbps',
        features: ['Good for moderate usage', 'Basic support'],
        status: 'Active',
        createdAt: '2025-04-15',
        updatedAt: '2025-06-25',
        featured: true, // Not Featured
    },
    {
        id: 3,
        packageName: 'Basic Package',
        price: 49.99,
        duration: '1 Month',
        internetSpeed: '100 Mbps',
        features: ['For light usage', 'No support included'],
        status: 'Active',
        createdAt: '2025-03-20',
        updatedAt: '2025-05-01',
        featured: true, // Not Featured
    },
    {
        id: 4,
        packageName: 'Premium Package',
        price: 199.99,
        duration: '12 Months',
        internetSpeed: '2000 Mbps',
        features: ['Best for ultra-fast browsing', '24/7 premium support'],
        status: 'Active',
        createdAt: '2025-06-01',
        updatedAt: '2025-06-10',
        featured: true,  // Featured Package
    },
];

// Columns config
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'packageName', headerName: 'Package Name', flex: 1 },
    { field: 'price', headerName: 'Price (INR)', flex: 1 },
    { field: 'duration', headerName: 'Duration', flex: 1 },
    { field: 'internetSpeed', headerName: 'Internet Speed', flex: 1 },

    { field: 'status', headerName: 'Status', flex: 1 },
    {
        field: 'createdAt',
        headerName: 'Created At',
        flex: 1,
        valueGetter: (params) =>
            params?.row?.createdAt ? new Date(params.row.createdAt).toLocaleDateString() : '',
    },
    {
        field: 'updatedAt',
        headerName: 'Last Updated',
        flex: 1,
        valueGetter: (params) =>
            params?.row?.updatedAt ? new Date(params.row.updatedAt).toLocaleDateString() : '',
    },
    // Featured Column
    {
        field: 'featured',
        headerName: 'Featured',
        flex: 1,
        renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: () => (
            <Stack direction="row" spacing={1}>
                <IconButton color="primary"><VisibilityIcon /></IconButton>
                <IconButton color="secondary"><EditIcon /></IconButton>
                {/* <IconButton color="error"><DeleteIcon /></IconButton> */}
            </Stack>
        ),
    },
];

const ActivePackages = () => {
    const exportPDF = () => {
        const doc = new jsPDF();
        const tableColumn = columns.filter(col => col.field !== 'actions').map(col => col.headerName);
        const tableRows = rows.map(row =>
            columns
                .filter(col => col.field !== 'actions')
                .map(col => {
                    if (col.valueGetter) {
                        return col.valueGetter({ row }) || '';
                    }
                    return row[col.field] ?? '';
                })
        );

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
        });

        doc.save('setup-packages.pdf');
    };

    const exportExcel = () => {
        const data = rows.map(row => {
            const rowData = {};
            columns.forEach(col => {
                if (col.field === 'actions') return;
                if (col.valueGetter) {
                    rowData[col.headerName] = col.valueGetter({ row }) || '';
                } else {
                    rowData[col.headerName] = row[col.field] ?? '';
                }
            });
            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "SetupPackages");

        XLSX.writeFile(workbook, "setup-packages.xlsx");
    };

    return (
        <>
            <Breadcrumbs
                links={[
                    { label: 'Dashboard', to: '/' },
                    { label: 'Packages' },
                    { label: 'All' },
                ]}
                divider
            />
            <Box sx={{ height: '100%', width: '100%', p: 3, bgcolor: '#f9fbff' }}>
                <Grid container spacing={gridSpacing} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h5" fontWeight={600}>
                        Packages List
                    </Typography>
                    <Box>
                        <Button onClick={exportPDF} variant="outlined" color="primary" sx={{ mr: 1 }}>
                            Export PDF
                        </Button>
                        <Button onClick={exportExcel} variant="outlined" color="secondary">
                            Export Excel
                        </Button>
                    </Box>
                </Grid>

                <Paper sx={{ height: 'auto', display: 'flex', flexDirection: 'column', paddingBottom: '50px' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                    page: 0,
                                },
                            },
                        }}
                        checkboxSelection
                        disableRowSelectionOnClick
                        showToolbar
                        sx={{
                            '& .MuiDataGrid-footerContainer': {
                                marginTop: 5,

                            },

                        }}
                    />


                </Paper>

            </Box>
        </>
    );
};

export default ActivePackages;
