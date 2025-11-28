import React from "react";
// import { useSelector } from "react-redux";  // Commented out for now
import { Box, Typography, List, ListItem, Chip, Divider } from "@mui/material";
// import Breadcrumbs from "component/Breadcrumb";
import Breadcrumbs from "../../component/Breadcrumb"

// Dummy data for complaints
const dummyComplaints = [
    {
        id: "c1",
        date: "2025-05-10",
        issueType: "Speed",
        status: "Pending",
        technician: null,
    },
    {
        id: "c2",
        date: "2025-05-09",
        issueType: "Connection",
        status: "In Progress",
        technician: { name: "John Doe", contact: "9876543210" },
    },
    {
        id: "c3",
        date: "2025-05-08",
        issueType: "Billing",
        status: "Resolved",
        technician: { name: "Jane Doe", contact: "9123456789" },
    },
];

const TrackComplaintScreen = () => {
    // Use dummy data instead of Redux state for now
    // const complaints = useSelector((state) => state.complaint.complaints); // Commented out

    const complaints = dummyComplaints; // Dummy data

    // Function to determine status color using Material UI's Chip
    const statusColor = (status) => {
        switch (status) {
            case "Pending":
                return "warning"; // Yellow
            case "In Progress":
                return "info"; // Blue
            case "Resolved":
                return "success"; // Green
            default:
                return "default"; // Gray
        }
    };

    return (
        <>
            <Breadcrumbs title="Track Complaints">
            </Breadcrumbs>

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
                aria-label="Track Complaint Screen"
            >
                <Typography variant="h4" color="primary" gutterBottom>
                    Track Complaints
                </Typography>
                <List sx={{ width: "100%", maxWidth: 360 }}>
                    {complaints.map((c) => (
                        <ListItem key={c.id} sx={{ border: 1, borderColor: "grey.300", borderRadius: 2, mb: 2, p: 2 }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                    {c.date}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Issue: {c.issueType}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Technician: {c.technician ? `${c.technician.name}, ${c.technician.contact}` : "Not assigned"}
                                </Typography>
                            </Box>
                            <Chip
                                label={c.status}
                                color={statusColor(c.status)}
                                size="small"
                                sx={{
                                    marginLeft: 2,
                                    alignSelf: "center",
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 4 }} />
            </Box>
        </>
    );
};

export default TrackComplaintScreen;
