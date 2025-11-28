// src/views/team/All.jsx

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
    Modal,
    Fade,
    Grid,
    Backdrop,
    Tooltip,
    useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTeamMembers, deleteTeamMember } from '../../redux/features/Team/TeamSlice';
import TeamEditModal from './TeamEditModal';
// import ConfirmDialog from 'component/ConfirmDialog/ConfirmDialog';
import ConfirmDialog from '../../component/ConfirmDialog/ConfirmDialog';
// import ConfirmDialog from './ConfirmDialog';

const All = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();

    // Redux state
    const { teamMembers, isTeamLoading, isTeamError } = useSelector((state) => state.team);


    console.log('Team Members:', teamMembers);

    // Local state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [memberToDelete, setMemberToDelete] = useState(null);

    useEffect(() => {
        dispatch(getAllTeamMembers());
    }, [dispatch]);

    const handleViewOpen = (member) => {
        navigate(`/team/${member._id}`);
    };

    const handleEditOpen = (member) => {
        setSelectedMember(member);
        setEditModalOpen(true);
    };

    const handleDelete = (id) => {
        setMemberToDelete(id);
        setConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (memberToDelete) {
            try {
                await dispatch(deleteTeamMember(memberToDelete));
                toast.success('Team member deleted successfully!');
            } catch (err) {
                toast.error('Failed to delete team member.');
            } finally {
                setConfirmModalOpen(false);
                setMemberToDelete(null);
            }
        }
    };

    const columns = [
        {
            field: 'sl',
            headerName: 'SL',
            width: 80,
            headerAlign: 'center',
            align: 'center',
            // No need for renderCell, just directly use 'params.row.sl'
        },
        {
            field: 'firstName',
            headerName: 'First Name',
            flex: 1,
            headerAlign: 'left',
            align: 'left',
            sortable: true,
            filterable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            flex: 1,
            headerAlign: 'left',
            align: 'left',
            sortable: true,
            filterable: true,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'left',
            align: 'left',
            sortable: true,
            filterable: true,
        },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            sortable: true,
            filterable: true,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box
                    sx={{
                        backgroundColor:
                            params.value === 'Active' ? '#D4EDDA' : '#F8D7DA',
                        color: params.value === 'Active' ? '#28A745' : '#DC3545',
                        padding: '4px 8px',
                        borderRadius: 1.5,
                        textTransform: 'capitalize',
                        fontWeight: '600',
                    }}
                >
                    {params.value}
                </Box>
            ),
        },
        {
            field: 'serviceAreas',
            headerName: 'Service Areas',
            flex: 1,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => {
                const areaNames = params.row.area?.map((area) => area.region);
                return <div>{areaNames?.join(', ') || '—'}</div>;
            },
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) =>
                params?.row?.createdAt
                    ? new Date(params.row.createdAt).toLocaleString()
                    : '—',
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
                        <Tooltip title="View Team Member" arrow>
                            <IconButton
                                aria-label="view team member"
                                color="primary"
                                onClick={() => handleViewOpen(row)}
                                size="small"
                                sx={{
                                    bgcolor: '#E8F0FE',
                                    color: '#3366FF',
                                    '&:hover': { bgcolor: '#C1D7FF' },
                                }}
                            >
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Team Member" arrow>
                            <IconButton
                                aria-label="edit team member"
                                color="secondary"
                                onClick={() => handleEditOpen(row)}
                                size="small"
                                sx={{
                                    bgcolor: '#FFF4E5',
                                    color: '#FFB74D',
                                    '&:hover': { bgcolor: '#FFE0B2' },
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Team Member" arrow>
                            <IconButton
                                aria-label="delete team member"
                                color="error"
                                onClick={() => handleDelete(row._id)}
                                size="small"
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
        <Box
            sx={{
                // maxWidth: 1100,
                mx: 'auto',
                px: { xs: 2, sm: 3 },
                py: 4,
                bgcolor: '#F9FAFF',
                borderRadius: 3,
                boxShadow:
                    '0 8px 16px rgba(51, 102, 255, 0.05), 0 4px 8px rgba(51, 102, 255, 0.1)',
            }}
        >


            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: '#4F46E5',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Team Members
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
                    onClick={() => navigate('/team/create')}
                >
                    + Add Team Member
                </Button>
            </Grid>

            {isTeamLoading ? (
                <CircularProgress />
            ) : isTeamError ? (
                <Alert severity="error">Failed to load team members</Alert>
            ) : (
                <Paper sx={{ overflowX: 'auto' }}>
                    <DataGrid
                        rows={teamMembers.map((member, index) => ({
                            ...member,
                            id: member._id,  // Ensure the correct id is being passed
                            sl: index + 1,    // Serial number starting from 1
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

            <TeamEditModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                member={selectedMember}
            />

            <ConfirmDialog
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this team member? This action cannot be undone."
            />

            <ToastContainer position="bottom-right" />
        </Box>
    );
};

export default All;
