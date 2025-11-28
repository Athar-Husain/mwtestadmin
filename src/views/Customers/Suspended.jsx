import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Container,
    Paper
} from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import * as XLSX from 'xlsx';
import Breadcrumbs from '../../component/Breadcrumb';

import { gridSpacing } from '../../config.js';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'plan', headerName: 'Plan', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 0.8 },
    {
        field: 'boxes',
        headerName: 'Boxes',
        type: 'number',
        width: 90,
    },
    {
        field: 'complaints',
        headerName: 'Complaints',
        type: 'number',
        width: 120,
    },
    {
        field: 'lastPayment',
        headerName: 'Last Payment',
        flex: 1,
        valueGetter: (params) =>
            params?.row?.lastPayment ? new Date(params.row.lastPayment).toLocaleDateString() : '',
    },
    {
        field: 'created',
        headerName: 'Created',
        flex: 1,
        valueGetter: (params) =>
            params?.row?.created ? new Date(params.row.created).toLocaleDateString() : '',
    },
];

const rows = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        plan: 'Gold Plan',
        status: 'Active',
        boxes: 2,
        complaints: 1,
        lastPayment: '2025-06-25',
        created: '2025-01-10',
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        plan: 'Silver Plan',
        status: 'Inactive',
        boxes: 1,
        complaints: 0,
        lastPayment: '2025-05-15',
        created: '2025-02-20',
    },
    {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '5551234567',
        plan: 'Bronze Plan',
        status: 'Active',
        boxes: 3,
        complaints: 2,
        lastPayment: '2025-06-10',
        created: '2025-03-01',
    },
    {
        id: 4,
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '4442221111',
        plan: 'Gold Plan',
        status: 'Active',
        boxes: 2,
        complaints: 0,
        lastPayment: '2025-06-28',
        created: '2025-01-18',
    },
    {
        id: 5,
        name: 'Chris Lee',
        email: 'chris@example.com',
        phone: '9998887777',
        plan: 'Silver Plan',
        status: 'Inactive',
        boxes: 1,
        complaints: 1,
        lastPayment: '2025-05-30',
        created: '2025-02-05',
    },
];

const All = () => {
    const exportPDF = () => {
        const doc = new jsPDF();
        const tableColumn = columns.map(col => col.headerName);
        const tableRows = rows.map(row =>
            columns.map(col => {
                if (col.valueGetter) {
                    return col.valueGetter({ row }) || '';
                } else {
                    return row[col.field] ?? '';
                }
            })
        );

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
        });

        doc.save('customers.pdf');
    };
    const exportExcel = () => {
        const data = rows.map(row => {
            const rowData = {};
            columns.forEach(col => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

        XLSX.writeFile(workbook, "customers.xlsx");
    };

    return (
        <>
            <Breadcrumbs
                // title="Customers"
                links={[
                    { label: 'Dashboard', to: '/' },
                    { label: 'Customers', },
                    { label: 'Suspended' }, // no `to` means current page
                ]}
                divider
            />
            <Box sx={{ height: 600, width: '100%', p: 3, bgcolor: '#f9fbff' }}>
                <Grid container spacing={gridSpacing} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h5" fontWeight={600}>
                        Customers
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


                {/* <Paper sx={{ height: 'auto', }} >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                    page: 0,
                                },
                            },
                        }}
                        checkboxSelection
                        disableRowSelectionOnClick
                    // autoHeight:true
                    />
                </Paper> */}

                <Paper sx={{ height: 'auto' }}>
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
                        showToolbar  // ✅ The new, preferred way
                    />
                </Paper>

            </Box>
        </>
    );
};

export default All;
