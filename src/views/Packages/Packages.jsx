import React, { useState } from "react";
import { Button, TextField, Card, Typography, Grid, Box } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { packagesSlice } from "../redux/slices/packagesSlice"; // Commented out for now

// Dummy data for packages
const dummyPackages = [
  { id: 1, name: "Basic Plan", speed: "10 Mbps", validity: "30 days", status: "Active" },
  { id: 2, name: "Standard Plan", speed: "50 Mbps", validity: "60 days", status: "Active" },
  { id: 3, name: "Premium Plan", speed: "100 Mbps", validity: "90 days", status: "Inactive" },
  // { id: 4, name: "Premium Plan", speed: "100 Mbps", validity: "90 days", status: "Active" },
  // { id: 5, name: "Premium Plan", speed: "100 Mbps", validity: "90 days", status: "Active" },
  // { id: 6, name: "Premium Plan", speed: "100 Mbps", validity: "90 days", status: "Active" },
  // { id: 7, name: "Premium Plan", speed: "100 Mbps", validity: "90 days", status: "Active" },
  // { id: 8, name: "Premium Plan", speed: "100 Mbps", validity: "90 days", status: "Active" },
];

const Packages = () => {
  const [packages, setPackages] = useState(dummyPackages); // Dummy state for now
  const [newPackage, setNewPackage] = useState({
    name: "",
    speed: "",
    validity: "",
    status: "Active",
  });
  const [isCreating, setIsCreating] = useState(false);

  // const dispatch = useDispatch(); // Uncomment when Redux is connected

  // Handle package creation (simulated)
  const handleCreatePackage = () => {
    // Normally, you would dispatch an action to add a package
    // dispatch(packagesSlice.actions.addPackage(newPackage));

    // Simulate adding a new package
    const newId = packages.length + 1;
    const addedPackage = { ...newPackage, id: newId };
    setPackages([...packages, addedPackage]);
    setNewPackage({ name: "", speed: "", validity: "", status: "Active" });
    setIsCreating(false);
  };

  return (
    <section style={{ margin: "auto", padding: "16px" }}>
      <Typography variant="h4" gutterBottom>
        Manage Packages
      </Typography>

      {/* Create Package Card */}
      {!isCreating ? (
        <Button variant="outlined" color="primary" onClick={() => setIsCreating(true)} style={{ marginBottom: "16px" }}>
          Create New Package
        </Button>
      ) : (
        <Card variant="outlined" style={{ marginBottom: "24px", padding: "16px" }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Create Package
          </Typography>
          <TextField
            label="Package Name"
            fullWidth
            value={newPackage.name}
            onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
            style={{ marginBottom: "8px" }}
          />
          <TextField
            label="Speed"
            fullWidth
            value={newPackage.speed}
            onChange={(e) => setNewPackage({ ...newPackage, speed: e.target.value })}
            style={{ marginBottom: "8px" }}
          />
          <TextField
            label="Validity"
            fullWidth
            value={newPackage.validity}
            onChange={(e) => setNewPackage({ ...newPackage, validity: e.target.value })}
            style={{ marginBottom: "8px" }}
          />
          <Box style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
            <Button variant="contained" color="primary" onClick={handleCreatePackage}>
              Create Package
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsCreating(false)}
              style={{ marginLeft: "8px" }}
            >
              Cancel
            </Button>
          </Box>
        </Card>
      )}

      {/* Display Packages */}
      <Grid container spacing={2}>
        {packages.map((pkg) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            // lg={12}
            key={pkg.id}
            className="dropshadow"
          >
            <Card variant="outlined" style={{ padding: "16px" }}>
              <Typography variant="h6">{pkg.name}</Typography>
              <Typography variant="body1">Speed: {pkg.speed}</Typography>
              <Typography variant="body1">Validity: {pkg.validity}</Typography>
              <Typography
                variant="body1"
                style={{
                  marginTop: "8px",
                  color: pkg.status === "Active" ? "green" : "red",
                }}
              >
                Status: {pkg.status}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

    </section>
  );
}

export default Packages;
