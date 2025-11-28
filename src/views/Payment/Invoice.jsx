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
// import { GridPrintExportOptions } from '@mui/x-data-grid'

const Invoices = () => {
    // Define Columns for Invoice DataGrid
    const columns = [
        { field: 'invoiceId', headerName: 'Invoice ID', width: 150 },
        { field: 'paymentId', headerName: 'Payment ID', width: 150 },
        { field: 'userName', headerName: 'User Name', width: 180 },
        { field: 'amount', headerName: 'Amount', width: 150, type: 'number' },
        {
            field: 'dateOfIssue',
            headerName: 'Date of Issue',
            width: 180,
            type: 'date',
            valueGetter: (params) => {
                return new Date(params.value);  // Convert string to Date object
            }
        },
        {
            field: 'dueDate',
            headerName: 'Due Date',
            width: 180,
            type: 'date',
            valueGetter: (params) => {
                return new Date(params.value);  // Convert string to Date object
            }
        },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'currency', headerName: 'Currency', width: 100 },
        { field: 'fees', headerName: 'Fees', width: 120, type: 'number' },
        { field: 'tax', headerName: 'Tax', width: 120, type: 'number' },
        { field: 'lineItems', headerName: 'Line Items', width: 250, renderCell: (params) => params.value.map((item, index) => <div key={index}>{item}</div>) },
        {
            field: 'actions', headerName: 'Actions', width: 180, renderCell: () => <Stack direction="row" spacing={1}>
                <IconButton color="primary"><VisibilityIcon /></IconButton>
                <IconButton color="secondary"><EditIcon /></IconButton>
                {/* <IconButton color="error"><DeleteIcon /></IconButton> */}
            </Stack>
        },
    ];

    // Sample Rows (Invoice Data)
    const rows = [
        { id: 1, invoiceId: 'INV123', paymentId: '1', userName: 'John Doe', amount: 100, dateOfIssue: '2023-06-10', dueDate: '2023-07-10', status: 'Paid', currency: 'USD', fees: 2.5, tax: 5, lineItems: ['Item 1: $50', 'Item 2: $50'] },
        { id: 2, invoiceId: 'INV124', paymentId: '2', userName: 'Jane Smith', amount: 200, dateOfIssue: '2023-06-12', dueDate: '2023-07-12', status: 'Pending', currency: 'USD', fees: 5, tax: 10, lineItems: ['Item 1: $100', 'Item 2: $100'] },
        { id: 3, invoiceId: 'INV125', paymentId: '3', userName: 'David Johnson', amount: 150, dateOfIssue: '2023-06-13', dueDate: '2023-07-13', status: 'Overdue', currency: 'EUR', fees: 4, tax: 8, lineItems: ['Item 1: $75', 'Item 2: $75'] },
    ];

    // const handlePrint = () => {
    //     const printWindow = window.open('', '_blank');
    //     printWindow.document.write('<html><head><title>Invoices</title><style>@media print { body { font-size: 12px; } .MuiDataGrid-root { width: 100% !important; } .MuiDataGrid-footerContainer { display: none; } }</style></head><body>');
    //     printWindow.document.write('<div><h1>Invoices Overview</h1></div>');
    //     printWindow.document.write('<div>' + document.querySelector('.MuiDataGrid-root').outerHTML + '</div>');
    //     printWindow.document.write('</body></html>');
    //     printWindow.document.close();
    //     printWindow.print();
    // };

    return (
        <Paper sx={{ height: 'auto', display: 'flex', flexDirection: 'column', paddingBottom: '50px' }}>
            <Typography variant="h5" sx={{ padding: 2 }}>
                Invoices Overview
            </Typography>

            {/* Print Button */}


            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                checkboxSelection
                disableRowSelectionOnClick
                showToolbar
                slotProps={{
                    toolbar: {
                        printOptions: {
                            allColumns: true,
                            hideFooter: true,
                            hideToolbar: true,
                        },
                    },
                }}
                sx={{
                    '& .MuiDataGrid-footerContainer': {
                        marginTop: 5,
                    },
                    '& .MuiDataGrid-scrollbar--horizontal': {
                        // marginTop: 5,
                        height: "2px",
                        color: "blue"
                    },
                }}
            />
        </Paper>
    );
};

export default Invoices;
