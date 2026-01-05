import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import leadService from '../../services/leadService'; // Updated import

// Fetch Leads
export const fetchLeads = createAsyncThunk('leads/fetchLeads', async (filters, { getState, rejectWithValue }) => {
  const { auth } = getState();
  try {
    const data = await leadService.getLeads({ ...filters, token: auth.user.token });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Add FollowUp
export const addFollowUp = createAsyncThunk('leads/addFollowUp', async ({ leadId, data }, { getState, rejectWithValue }) => {
  const { auth } = getState();
  try {
    const response = await leadService.addFollowUp(leadId, data, auth.user.token);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Convert Lead
export const convertLead = createAsyncThunk('leads/convertLead', async ({ leadId, customerId }, { getState, rejectWithValue }) => {
  const { auth } = getState();
  try {
    const response = await leadService.convertLead(leadId, customerId, auth.user.token);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    leads: [],
    selectedLead: null,
    loading: false,
    error: null,
    pagination: { total: 0, page: 1, pages: 1 }
  },
  reducers: {
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFollowUp.fulfilled, (state, action) => {
        const index = state.leads.findIndex((lead) => lead._id === action.payload._id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
        if (state.selectedLead?._id === action.payload._id) {
          state.selectedLead = action.payload;
        }
      })
      .addCase(convertLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex((lead) => lead._id === action.payload._id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      });
  }
});

export const { setSelectedLead, clearSelectedLead } = leadsSlice.actions;

export default leadsSlice.reducer;
