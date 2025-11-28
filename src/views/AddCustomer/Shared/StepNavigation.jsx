import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const StepNavigation = ({ currentStep, totalSteps }) => {
    return (
        <Stepper activeStep={currentStep - 1} alternativeLabel sx={{ width: '100%', mb: 4 }}>
            {[...Array(totalSteps).keys()].map((index) => (
                <Step key={index}>
                    <StepLabel>{`Step ${index + 1}`}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
};

export default StepNavigation;
