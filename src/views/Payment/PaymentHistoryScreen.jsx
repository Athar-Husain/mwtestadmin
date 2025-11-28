import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
// import { uiSlice } from "./store/uiSlice"; // Uncomment when your slice is set up
// import { paymentSlice } from "./store/paymentSlice"; // Uncomment when your slice is set up

const PaymentHistoryScreen = () => {
  const dispatch = useDispatch();
  // const paymentHistory = useSelector(state => state.payment.paymentHistory); // Uncomment when your slice is set up

  // Dummy payment history data
  const paymentHistory = [
    { id: 1, amount: 500, date: "2023-05-01", method: "Razorpay", status: "Success" },
    { id: 2, amount: 300, date: "2023-05-03", method: "Stripe", status: "Failed" },
    { id: 3, amount: 1200, date: "2023-05-07", method: "Razorpay", status: "Success" },
    { id: 4, amount: 250, date: "2023-05-10", method: "PayPal", status: "Failed" },
    { id: 5, amount: 800, date: "2023-05-15", method: "Stripe", status: "Success" },
  ];

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date-desc");

  function filteredSortedPayments() {
    let filtered = paymentHistory;
    if (filter !== "all") {
      filtered = filtered.filter((p) => p.status.toLowerCase() === filter);
    }
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      switch (sort) {
        case "date-desc":
          return dateB - dateA;
        case "date-asc":
          return dateA - dateB;
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
    return sorted;
  }

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
      aria-label="Payment History Screen"
    >
      <Typography variant="h4" color="primary" mb={4}>
        Payment History
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 4 }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter"
            fullWidth
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="sort-label">Sort</InputLabel>
          <Select
            labelId="sort-label"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            label="Sort"
            fullWidth
          >
            <MenuItem value="date-desc">Newest First</MenuItem>
            <MenuItem value="date-asc">Oldest First</MenuItem>
            <MenuItem value="amount-desc">Amount High to Low</MenuItem>
            <MenuItem value="amount-asc">Amount Low to High</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: "100%" }}>
        <ul>
          {filteredSortedPayments().map((item) => (
            <li
              key={item.id}
              style={{
                border: "1px solid #E0E0E0",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Typography variant="body1" color="textPrimary" fontWeight="bold">
                  ₹{item.amount}
                </Typography>
                <Typography variant="body2" color="textSecondary">Date: {item.date}</Typography>
                <Typography variant="body2" color="textSecondary">Method: {item.method}</Typography>
              </div>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  backgroundColor: item.status === "Success" ? "#D4EDDA" : "#F8D7DA",
                  color: item.status === "Success" ? "#28A745" : "#DC3545",
                }}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

export default PaymentHistoryScreen;
