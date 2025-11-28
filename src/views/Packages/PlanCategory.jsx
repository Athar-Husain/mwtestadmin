// src/views/planCategory/PlanCategory.jsx

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    IconButton,
    Stack,
    CircularProgress,
    Alert,
    Grid,
    Tooltip,
    Modal,
    TextField,
    DialogActions,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { ToastContainer, toast } from 'react-toastify';

import {
    getAllPlanCategories,
    deletePlanCategory,
    updatePlanCategory,
    createPlanCategory,
} from '../../redux/features/Plan/PlanSlice';

import ConfirmDialog from '../../component/ConfirmDialog/ConfirmDialog';

const PlanCategory = () => {
    const dispatch = useDispatch();

    const {
        categories: allplanCategories,
        isPlanLoading: isPlanCatLoading,
        isPlanError: isPlanCatError,
    } = useSelector((state) => state.plan);

    console.log('allplanCategories', allplanCategories);

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewCategory, setViewCategory] = useState(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);

    useEffect(() => {
        dispatch(getAllPlanCategories());
    }, [dispatch]);

    const handleDelete = (id) => {
        setCategoryToDelete(id);
        setConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deletePlanCategory(categoryToDelete)).unwrap();
            toast.success('Category deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete category.');
        } finally {
            setConfirmModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    const handleEdit = (category) => {
        setEditCategory({ ...category }); // clone for local edit
        setEditModalOpen(true);
    };

    const handleView = (category) => {
        setViewCategory(category);
        setViewModalOpen(true);
    };

    const handleEditSubmit = async () => {
        try {
            if (editCategory?._id) {
                await dispatch(updatePlanCategory({ id: editCategory._id, data: editCategory })).unwrap();
                toast.success('Category updated successfully!');
            } else {
                await dispatch(createPlanCategory(editCategory)).unwrap();
                toast.success('Category created successfully!');
            }

            setEditModalOpen(false);
            dispatch(getAllPlanCategories()); // Refresh the list
        } catch (err) {
            toast.error('Failed to save category.');
        }
    };

    const columns = [
        {
            field: 'sl',
            headerName: 'SL',
            width: 70,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 2,
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            flex: 1,
            renderCell: (params) =>
                new Date(params.row.createdAt).toLocaleDateString(),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: 'center',
            flex: 1,
            align: 'center',
            sortable: false,
            renderCell: (params) => {
                const { row } = params;
                return (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="View Category" arrow>
                            <IconButton
                                onClick={() => handleView(row)}
                                sx={{
                                    bgcolor: '#E8F0FE',
                                    color: '#3366FF',
                                    '&:hover': { bgcolor: '#C1D7FF' },
                                }}
                            >
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Category" arrow>
                            <IconButton
                                onClick={() => handleEdit(row)}
                                sx={{
                                    bgcolor: '#FFF4E5',
                                    color: '#FFB74D',
                                    '&:hover': { bgcolor: '#FFE0B2' },
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Category" arrow>
                            <IconButton
                                onClick={() => handleDelete(row._id)}
                                sx={{
                                    bgcolor: '#FFE5E5',
                                    color: '#FF4D6D',
                                    '&:hover': { bgcolor: '#FFB2B2' },
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                );
            },
        },
    ];

    return (
        <Box sx={{ mx: 'auto', px: 3, py: 4, bgcolor: '#F9FAFF', borderRadius: 3 }}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: '#4F46E5', letterSpacing: '-0.02em' }}
                >
                    Plan Categories
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        bgcolor: '#6366F1',
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: 16,
                        borderRadius: 8,
                        boxShadow: '0 6px 12px rgba(99, 102, 241, 0.4)',
                        textTransform: 'none',
                        '&:hover': {
                            bgcolor: '#4F46E5',
                        },
                    }}
                    onClick={() => {
                        setEditCategory({ name: '', description: '' });
                        setEditModalOpen(true);
                    }}
                >
                    + Add Category
                </Button>
            </Grid>

            {isPlanCatLoading ? (
                <CircularProgress />
            ) : isPlanCatError ? (
                <Alert severity="error">Failed to load categories</Alert>
            ) : (
                <Paper sx={{ overflowX: 'auto' }}>
                    <DataGrid
                        rows={allplanCategories?.map((cat, index) => ({
                            ...cat,
                            id: cat._id,
                            sl: index + 1,
                        }))}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        disableRowSelectionOnClick
                        autoHeight
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#EEF2FF',
                                color: '#4338CA',
                                fontWeight: 700,
                            },
                            '& .MuiDataGrid-row:nth-of-type(odd)': {
                                backgroundColor: '#FAFAFF',
                            },
                        }}
                    />
                </Paper>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmDialog
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this plan category? This action cannot be undone."
            />

            {/* View Modal */}
            <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 2,
                        width: 400,
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        View Category
                    </Typography>
                    <Typography variant="body1"><strong>Name:</strong> {viewCategory?.name}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}><strong>Description:</strong> {viewCategory?.description}</Typography>
                </Box>
            </Modal>

            {/* Edit/Create Modal */}
            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 2,
                        width: 400,
                        boxShadow: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography variant="h6">
                        {editCategory?._id ? 'Edit Category' : 'Add Category'}
                    </Typography>

                    <TextField
                        label="Name"
                        value={editCategory?.name || ''}
                        onChange={(e) =>
                            setEditCategory((prev) => ({ ...prev, name: e.target.value }))
                        }
                        fullWidth
                    />

                    <TextField
                        label="Description"
                        multiline
                        rows={3}
                        value={editCategory?.description || ''}
                        onChange={(e) =>
                            setEditCategory((prev) => ({ ...prev, description: e.target.value }))
                        }
                        fullWidth
                    />

                    <DialogActions>
                        <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleEditSubmit}
                            disabled={!editCategory?.name}
                        >
                            {editCategory?._id ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Box>
            </Modal>

            <ToastContainer position="bottom-right" />
        </Box>
    );
};

export default PlanCategory;
