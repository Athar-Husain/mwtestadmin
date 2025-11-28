// src/views/plan/AllPlans.jsx

import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, CircularProgress, Stack, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  getAllPlans,
  deletePlan
} from '../../redux/features/Plan/PlanSlice';
import ConfirmDialog from '../../component/ConfirmDialog/ConfirmDialog';
import { ToastContainer, toast } from 'react-toastify';

const AllPlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const { allPlans, categories, isPlanLoading } = useSelector((state) => state.plan);

  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  const handleView = (plan) => {
    setSelectedPlan(plan);
    setViewModalOpen(true);
  };

  const handleEdit = (planId) => {
    navigate(`/plan/edit/${planId}`);
  };

  const handleDelete = async (plan) => {
    setPlanToDelete(plan);
    setConfirmDeleteOpen(true);
    // await dispatch(getAllPlans());
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deletePlan(planToDelete._id)).unwrap();
      toast.success("Plan deleted successfully!");
      await dispatch(getAllPlans());
    } catch (err) {
      toast.error("Failed to delete plan.");
    } finally {
      setConfirmDeleteOpen(false);
      setPlanToDelete(null);
    }
  };

  const columns = [
    { field: 'sl', headerName: 'SL', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'duration', headerName: 'Duration', flex: 1 },
    {
      field: 'price',
      headerName: 'Price (INR)',
      flex: 1,
      // valueFormatter: ({ value }) => `₹${value}`,
      valueFormatter: ({ value }) => value !== undefined && value !== null ? `₹${value}` : '-',

    },
    {
      field: 'categoryName',
      headerName: 'Category',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const plan = params.row;
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="View Plan">
              <IconButton onClick={() => handleView(plan)}>
                <VisibilityIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Plan">
              <IconButton onClick={() => handleEdit(plan._id)}>
                <EditIcon sx={{ color: '#FFA500' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Plan">
              <IconButton onClick={() => handleDelete(plan)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      }
    }
  ];

  const rows = allPlans?.map((plan, index) => ({
    ...plan,
    id: plan._id,
    sl: index + 1,
    categoryName: categories?.find(cat => cat._id === plan.category)?.name || 'N/A'
  })) || [];

  return (
    <Box sx={{ px: 4, py: 5 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>All Plans</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/plan/create')}
        >
          + Add Plan
        </Button>
      </Stack>

      {isPlanLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          autoHeight
          disableRowSelectionOnClick
        />
      )}

      {/* View Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Plan Details</DialogTitle>
        <DialogContent dividers>
          {selectedPlan && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}><strong>Name:</strong> {selectedPlan.name}</Grid>
              <Grid size={{ xs: 6 }}><strong>Duration:</strong> {selectedPlan.duration}</Grid>
              <Grid size={{ xs: 6 }}><strong>Price:</strong> ₹{selectedPlan.price}</Grid>
              <Grid size={{ xs: 6 }}><strong>Speed:</strong> {selectedPlan.internetSpeed} {selectedPlan.internetSpeedUnit}</Grid>
              <Grid size={{ xs: 6 }}><strong>Data Limit:</strong> {selectedPlan.dataLimitType === 'limited' ? `${selectedPlan.dataLimit} GB` : 'Unlimited'}</Grid>
              <Grid size={{ xs: 6 }}><strong>Category:</strong> {categories.find(cat => cat._id === selectedPlan.category)?.name || 'N/A'}</Grid>
              <Grid size={{ xs: 12 }}><strong>Description:</strong> {selectedPlan.description}</Grid>
              <Grid size={{ xs: 12 }}><strong>Features:</strong>
                <ul style={{ paddingLeft: 20 }}>
                  {selectedPlan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this plan?"
      />

      <ToastContainer position="bottom-right" />
    </Box>
  );
};

export default AllPlans;
