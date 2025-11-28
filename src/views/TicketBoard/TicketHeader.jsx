// src/views/TicketBoard/TicketHeader.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Button, Stack, Tooltip, IconButton } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add'; // Import Add Icon

const STATUSES = [
  { label: 'All', value: '' },
  { label: 'Open', value: 'Open' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Escalated', value: 'Escalated' },
  { label: 'Closed', value: 'Closed' }
];

const TicketHeader = ({
  currentView,
  onViewChange,
  title,
  onFilterChange,
  onMobileTeamListToggle,
  onAddTicketClick // New prop for handling the Add Ticket button
}) => {
  const [filters, setFilters] = useState({
    status: '',
    startDate: null,
    endDate: null
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const defaultFilters = { status: '', startDate: null, endDate: null };
    setIsDirty(
      filters.status !== defaultFilters.status ||
        filters.startDate?.toString() !== defaultFilters.startDate?.toString() ||
        filters.endDate?.toString() !== defaultFilters.endDate?.toString()
    );
  }, [filters]);

  const handleApplyFilters = () => {
    if (onFilterChange) onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const defaultFilters = { status: '', startDate: null, endDate: null };
    setFilters(defaultFilters);
    if (onFilterChange) onFilterChange(defaultFilters);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: { xs: 'center', sm: 'space-between' },
        gap: 2,
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 2,
        boxShadow: '0 3px 10px rgb(0 0 0 / 0.1)'
      }}
    >
      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: '700', flexShrink: 0 }}>
        {title}
      </Typography>

      {/* View Toggle and Filters (Consolidated) */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center" flexGrow={1} justifyContent="flex-end">
        {/* Add Ticket Button */}
        <Tooltip title="Add Ticket">
          <IconButton
            onClick={onAddTicketClick} // Trigger the Add Ticket click handler
            color="primary"
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        {/* View Toggle Buttons */}
        <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
          <Tooltip title="Switch to Status View">
            <Button
              variant={currentView === 'status' ? 'contained' : 'outlined'}
              onClick={() => onViewChange('status')}
              startIcon={<FilterAltIcon />}
              size="small"
            >
              Status
            </Button>
          </Tooltip>
          <Tooltip title="Switch to User View">
            <Button
              variant={currentView === 'user' ? 'contained' : 'outlined'}
              onClick={() => onViewChange('user')}
              startIcon={<PeopleIcon />}
              size="small"
            >
              User
            </Button>
          </Tooltip>
        </Stack>

        {/* Filters */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="filter-status-label">Status</InputLabel>
          <Select
            labelId="filter-status-label"
            value={filters.status}
            label="Status"
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            {STATUSES.map(({ label, value }) => (
              <MenuItem key={value || 'all'} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From Date"
            value={filters.startDate}
            onChange={(newValue) => setFilters((prev) => ({ ...prev, startDate: newValue }))}
            slotProps={{ textField: { size: 'small', sx: { maxWidth: 150 } } }}
            maxDate={filters.endDate || undefined}
          />
          <DatePicker
            label="To Date"
            value={filters.endDate}
            onChange={(newValue) => setFilters((prev) => ({ ...prev, endDate: newValue }))}
            slotProps={{ textField: { size: 'small', sx: { maxWidth: 150 } } }}
            minDate={filters.startDate || undefined}
          />
        </LocalizationProvider>

        {/* <Tooltip title="Apply Filters">
                    <IconButton
                        onClick={handleApplyFilters}
                        disabled={!isDirty}
                        aria-label="Apply filters"
                    >
                        <FilterAltIcon color={isDirty ? 'primary' : 'inherit'} />
                    </IconButton>
                </Tooltip> */}

        <Tooltip title="Apply Filters">
          <span>
            <IconButton onClick={handleApplyFilters} disabled={!isDirty} aria-label="Apply filters">
              <FilterAltIcon color={isDirty ? 'primary' : 'inherit'} />
            </IconButton>
          </span>
        </Tooltip>

        {/* <Tooltip title="Reset Filters">
                    <IconButton
                        onClick={handleResetFilters}
                        disabled={!isDirty}
                        aria-label="Reset filters"
                    >
                        <RefreshIcon color={isDirty ? 'inherit' : 'disabled'} />
                    </IconButton>
                </Tooltip> */}
        <Tooltip title="Reset Filters">
          <span>
            <IconButton onClick={handleResetFilters} disabled={!isDirty} aria-label="Reset filters">
              <RefreshIcon color={isDirty ? 'inherit' : 'disabled'} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default TicketHeader;
