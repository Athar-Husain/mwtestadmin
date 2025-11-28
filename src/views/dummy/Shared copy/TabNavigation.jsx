import React from 'react';
import { Button } from '@mui/material';

const TabNavigation = ({ setIsNewCustomerFlow }) => {
    return (
        <div>
            <Button variant="contained" onClick={() => setIsNewCustomerFlow(true)}>
                New Customer
            </Button>
            <Button variant="contained" onClick={() => setIsNewCustomerFlow(false)}>
                Existing Customer
            </Button>
        </div>
    );
};

export default TabNavigation;
