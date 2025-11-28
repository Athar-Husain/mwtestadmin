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

import Breadcrumbs from '../../component/Breadcrumb';
import { gridSpacing } from '../../config.js';


const All = () => {
    // Define Columns
    const columns = [
        {
            field: 'paymentId',
            headerName: 'Payment ID',
            width: 70
        },
        {
            field: 'userName',
            headerName: 'User Name',
            flex: 1
        },
        {
            field: 'amount',
            headerName: 'Amount',
            flex: 1,
            type: 'number'
        },
        {
            field: 'paymentDate',
            headerName: 'Payment Date',
            flex: 1,
            // type: 'date',
            valueGetter: ({ value }) => value && new Date(value), // format date if needed
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
        },
        {
            field: 'paymentMethod',
            headerName: 'Payment Method',
            flex: 1,
        },
        {
            field: 'transactionId',
            headerName: 'Transaction ID',
            flex: 1,
        },
        {
            field: 'invoiceId',
            headerName: 'Invoice ID',
            flex: 1,
        },
        // {
        //     field: 'currency',
        //     headerName: 'Currency',
        //     flex: 1,
        // },
        // {
        //     field: 'promoCode',
        //     headerName: 'Promo Code',
        //     flex: 1,
        // },
        {
            field: 'fees',
            headerName: 'Fees',
            flex: 1,
            type: 'number'
        },
        {
            field: 'refundStatus',
            headerName: 'Refund Status',
            flex: 1,
        },
        {
            field: 'gatewayStatus',
            headerName: 'Gateway Status',
            flex: 1,
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            flex: 1,
            type: 'date',
            valueGetter: ({ value }) => value && new Date(value), // format date if needed
        },
        {
            field: 'updatedAt',
            headerName: 'Updated At',
            flex: 1,
            type: 'date',
            valueGetter: ({ value }) => value && new Date(value), // format date if needed
        },
    ];

    // Define Rows (Your provided data)
    const rows = [
        {
            id: 1,
            paymentId: '1',
            userName: 'John Doe',
            amount: 100,
            paymentDate: '2023-06-15',
            status: 'Completed',
            paymentMethod: 'Credit Card',
            transactionId: 'TXN123456789',
            invoiceId: 'INV123',
            currency: 'INR',
            promoCode: 'SPRING2023',
            fees: 2.5,
            refundStatus: 'Refunded',
            gatewayStatus: 'Success',
            createdAt: '2023-06-10 12:00:00',
            updatedAt: '2023-06-15 14:00:00',
        },
        {
            id: 2,
            paymentId: '2',
            userName: 'Jane Smith',
            amount: 200,
            paymentDate: '2023-06-17',
            status: 'Pending',
            paymentMethod: 'PayPal',
            transactionId: 'TXN987654321',
            invoiceId: 'INV124',
            currency: 'INR',
            promoCode: '',
            fees: 5,
            refundStatus: 'Pending',
            gatewayStatus: 'Pending',
            createdAt: '2023-06-12 09:30:00',
            updatedAt: '2023-06-17 16:00:00',
        },
        {
            id: 3,
            paymentId: '3',
            userName: 'David Johnson',
            amount: 150,
            paymentDate: '2023-06-18',
            status: 'Failed',
            paymentMethod: 'Bank Transfer',
            transactionId: 'TXN112233445',
            invoiceId: 'INV125',
            currency: 'INR',
            promoCode: '',
            fees: 4,
            refundStatus: 'Not Refunded',
            gatewayStatus: 'Failed',
            createdAt: '2023-06-13 11:45:00',
            updatedAt: '2023-06-18 17:30:00',
        },
    ];



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

        doc.save('setup-Payments.pdf');
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "SetupPayments");

        XLSX.writeFile(workbook, "setup-Payments.xlsx");
    };

    return (
        <>
            <Breadcrumbs
                links={[
                    { label: 'Dashboard', to: '/' },
                    { label: 'Payments' },
                    { label: 'All' },
                ]}
                divider
            />
            <Box sx={{ height: '100%', width: '100%', p: 3, bgcolor: '#f9fbff' }}>
                <Grid container spacing={gridSpacing} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h5" fontWeight={600}>
                        Payments List
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

            </Box>

            <Paper sx={{ height: 'auto', display: 'flex', flexDirection: 'column', paddingBottom: '50px' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
        </>
    );
};

export default All;
