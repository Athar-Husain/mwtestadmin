import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Button, RadioGroup, FormControlLabel, Radio, Typography, Box, FormControl, FormLabel } from "@mui/material";
// import { uiSlice } from "./store/uiSlice"; // Uncomment when your slice is set up
// import { paymentSlice } from "./store/paymentSlice"; // Uncomment when your slice is set up

const MakePaymentScreen = () => {
  const dispatch = useDispatch();
  // const currentPackage = useSelector((state) => state.payment.currentPackage); // Uncomment when your slice is set up
  // const plans = useSelector((state) => state.payment.plans); // Uncomment when your slice is set up

  // Dummy data for current package and plans
  const currentPackage = {
    name: "Premium Plan",
    speed: "100 Mbps",
    validity: "30 days",
    price: 499,
  }; // Dummy current package

  const plans = [
    { id: 1, label: "Basic Plan", price: 199, note: "Suitable for 1 device" },
    { id: 2, label: "Standard Plan", price: 299, note: "Suitable for 2 devices" },
    { id: 3, label: "Premium Plan", price: 499, note: "Suitable for up to 5 devices" },
  ]; // Dummy plans

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0].id);
  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  const onSubmit = (data) => {
    // Dummy function to simulate payment process
    if (!selectedPlan) {
      // Dummy dispatch actions (replace with real dispatch once store is set up)
      console.log("Error: Please select a payment plan.");
      return;
    }
    console.log("Show loader...");
    setTimeout(() => {
      console.log("Hide loader...");
      console.log(`Payment Successful! Amount: ₹${selectedPlan.price}`);
      // Simulate dispatching actions
      console.log("Dispatching successful payment modal...");
      console.log(`Dispatching payment history: ₹${selectedPlan.price}`);
    }, 1500);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 4,
        maxWidth: "md",
        mx: "auto",
      }}
      aria-label="Make Payment Screen"
    >
      <Typography variant="h4" color="primary" mb={4}>
        Make Payment
      </Typography>
      <Box sx={{ mb: 6, p: 4, borderRadius: "8px", border: "1px solid #E0E0E0", backgroundColor: "#E3F2FD" }}>
        <Typography variant="h6" color="primary" mb={2}>
          Current Package
        </Typography>
        <Typography variant="body1" color="textPrimary" fontWeight="bold">
          {currentPackage.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">Speed: {currentPackage.speed}</Typography>
        <Typography variant="body2" color="textSecondary">Validity: {currentPackage.validity}</Typography>
        <Typography variant="body2" color="textSecondary">Price: ₹{currentPackage.price}</Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }} aria-label="Select Payment Plan">
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend" sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>Choose Renewal Plan</FormLabel>
          <RadioGroup
            value={selectedPlanId.toString()}
            onChange={(e) => setSelectedPlanId(parseInt(e.target.value))}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {plans.map((plan) => (
              <FormControlLabel
                key={plan.id}
                value={plan.id.toString()}
                control={<Radio {...register("payment-plan", { required: "Please select a payment plan." })} />}
                label={
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <Typography variant="body1" color="textPrimary" fontWeight="bold">{plan.label}</Typography>
                      {plan.note && <Typography variant="body2" color="textSecondary">{plan.note}</Typography>}
                    </div>
                    <Typography variant="body1" color="primary" fontWeight="bold">₹{plan.price}</Typography>
                  </Box>
                }
              />
            ))}
          </RadioGroup>
          {errors["payment-plan"] && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {errors["payment-plan"].message}
            </Typography>
          )}
        </FormControl>

        <Typography variant="h6" align="right" sx={{ fontWeight: "bold", mb: 2 }}>
          Total: ₹{selectedPlan.price}
        </Typography>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ width: "100%", py: 2 }}
        >
          Pay Now
        </Button>
      </form>
    </Box>
  );
};

export default MakePaymentScreen;
