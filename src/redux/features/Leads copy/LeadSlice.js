// store/slices/leadsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import leadService from './LeadService';
// import leadService from '../../services/leadService';

export const fetchLeads = createAsyncThunk('leads/fetchLeads', async ({ status, search, page = 1 }, { getState }) => {
  const { auth } = getState();
  return await leadService.getLeads({ status, search, page, token: auth.user.token });
});

export const addFollowUp = createAsyncThunk('leads/addFollowUp', async ({ leadId, data }, { getState }) => {
  const { auth } = getState();
  return await leadService.addFollowUp(leadId, data, auth.user.token);
});

export const convertLead = createAsyncThunk('leads/convertLead', async ({ leadId, customerId }, { getState }) => {
  const { auth } = getState();
  return await leadService.convertLead(leadId, customerId, auth.user.token);
});

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    leads: [],
    loading: false,
    error: null,
    pagination: { total: 0, page: 1, pages: 1 },
    selectedLead: null
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
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addFollowUp.fulfilled, (state, action) => {
        const index = state.leads.findIndex((l) => l._id === action.payload.lead._id);
        if (index !== -1) state.leads[index] = action.payload.lead;
        if (state.selectedLead?._id === action.payload.lead._id) {
          state.selectedLead = action.payload.lead;
        }
      })
      .addCase(convertLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex((l) => l._id === action.payload.lead._id);
        if (index !== -1) state.leads[index] = action.payload.lead;
      });
  }
});

export const { setSelectedLead, clearSelectedLead } = leadsSlice.actions;
export default leadsSlice.reducer;
