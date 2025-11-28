import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabNavigation from './Shared/TabNavigation';
import NewCustomer from './NewCustomer/NewCustomer';
import ExistingCustomer from './ExistingCustomer/ExistingCustomer';

const AddCustomer = () => {
    const [currentTab, setCurrentTab] = useState('New Customer');

    const renderContent = () => {
        switch (currentTab) {
            case 'New Customer':
                return <NewCustomer />;
            case 'Existing Customer':
                return <ExistingCustomer />;
            default:
                return null;
        }
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
                Customer Management
            </Typography>
            <TabNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
            <Box sx={{ width: '100%', mt: 2 }}>
                {renderContent()}
            </Box>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        </Container>
    );
};

export default AddCustomer;
