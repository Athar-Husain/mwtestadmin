import React, { useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Container,
    Paper
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Breadcrumbs from '../../component/Breadcrumb';
import { gridSpacing } from '../../config.js';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCustomers } from '../../redux/features/Customers/CustomerSlice';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'Name', flex: 1 },
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
        field: 'created',
        headerName: 'Created',
        flex: 1,
        valueGetter: (params) =>
            params?.row?.created ? new Date(params.row.created).toLocaleDateString() : '',
    },
];

const All = () => {
    const dispatch = useDispatch();

    // Get customer data, loading, and error states from Redux store
    const { allCustomers, isCustomerLoading, isCustomerError, message } = useSelector((state) => state.customer);

    // console.log("allCustomers in Customers",allCustomers);

    useEffect(() => {
        dispatch(getAllCustomers());
    }, [dispatch]);

    // Export to PDF
    const exportPDF = () => {
        const doc = new jsPDF();
        const tableColumn = columns.map(col => col.headerName);
        const tableRows = allCustomers.map((customer) =>
            columns.map((col) => {
                if (col.valueGetter) {
                    return col.valueGetter({ row: customer }) || '';
                } else {
                    return customer[col.field] ?? '';
                }
            })
        );

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
        });

        doc.save('customers.pdf');
    };

    // Export to Excel
    const exportExcel = () => {
        const data = allCustomers.map(customer => {
            const rowData = {};
            columns.forEach(col => {
                if (col.valueGetter) {
                    rowData[col.headerName] = col.valueGetter({ row: customer }) || '';
                } else {
                    rowData[col.headerName] = customer[col.field] ?? '';
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
                links={[
                    { label: 'Dashboard', to: '/' },
                    { label: 'Customers' },
                    { label: 'All' },
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

                <Paper sx={{ height: 'auto' }}>
                    {isCustomerLoading ? (
                        <Typography>Loading customers...</Typography>
                    ) : isCustomerError ? (
                        <Typography>Error: {message}</Typography>
                    ) : allCustomers?.length === 0 ? (
                        <Typography>No customers found.</Typography>
                    ) : (
                        <DataGrid
                            rows={allCustomers?.map((customer, index) => ({ ...customer, id: index + 1 }))}  // Adjusting for DataGrid
                            columns={columns}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10, page: 0 },
                                },
                            }}
                            checkboxSelection
                            disableRowSelectionOnClick
                            showToolbar
                        />
                    )}
                </Paper>
            </Box>
        </>
    );
};

export default All;
