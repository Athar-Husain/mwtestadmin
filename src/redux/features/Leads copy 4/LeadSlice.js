import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import LeadService from './LeadService';

const initialState = {
  leads: [],
  lead: null,
  isLeadLoading: false,
  isLeadSuccess: false,
  isLeadError: false,
  message: '',
  pagination: { total: 0, page: 1, pages: 1 }
};

const getError = (err) => err?.response?.data?.message || err.message || 'Something went wrong';

/* ============================
   Async Thunks
============================ */

export const getAllLeads = createAsyncThunk('lead/getAll', async (filters, thunkAPI) => {
  try {
    return await LeadService.getAll(filters);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const createAdminLead = createAsyncThunk('lead/createAdmin', async (data, thunkAPI) => {
  try {
    return await LeadService.createAdminLead(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const assignLead = createAsyncThunk('lead/assign', async ({ leadId, teamMemberId }, thunkAPI) => {
  try {
    return await LeadService.assignLead(leadId, teamMemberId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const updateLeadStatus = createAsyncThunk('lead/updateStatus', async ({ leadId, status }, thunkAPI) => {
  try {
    return await LeadService.updateStatus(leadId, status);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const addLeadFollowUp = createAsyncThunk('lead/addFollowUp', async ({ leadId, data }, thunkAPI) => {
  try {
    return await LeadService.addFollowUp(leadId, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

export const convertLeadAction = createAsyncThunk('lead/convert', async ({ leadId, data }, thunkAPI) => {
  try {
    return await LeadService.convert(leadId, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getError(error));
  }
});

/* ============================
   Slice
============================ */

const leadsSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    resetLeadState: (state) => {
      state.isLeadLoading = false;
      state.isLeadError = false;
      state.isLeadSuccess = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllLeads.fulfilled, (state, action) => {
        state.isLeadLoading = false;
        state.isLeadSuccess = true;
        state.leads = action.payload.data.leads; // Based on your API structure { data: { leads: [] } }
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages
        };
      })
      .addCase(createAdminLead.fulfilled, (state, action) => {
        state.isLeadLoading = false;
        state.isLeadSuccess = true;
        state.leads.unshift(action.payload.data.lead);
        toast.success('Lead created successfully');
      })
      // Shared logic for updating a single lead in the list
      .addMatcher(
        (action) =>
          [
            assignLead.fulfilled.type,
            updateLeadStatus.fulfilled.type,
            addLeadFollowUp.fulfilled.type,
            convertLeadAction.fulfilled.type
          ].includes(action.type),
        (state, action) => {
          state.isLeadLoading = false;
          state.isLeadSuccess = true;
          const updatedLead = action.payload.data.lead;
          const index = state.leads.findIndex((l) => l._id === updatedLead._id);
          if (index !== -1) state.leads[index] = updatedLead;
          if (state.lead?._id === updatedLead._id) state.lead = updatedLead;
          toast.success(action.payload.message || 'Updated successfully');
        }
      )
      // Pending/Rejected matchers
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLeadLoading = true;
          state.isLeadError = false;
          state.isLeadSuccess = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLeadLoading = false;
          state.isLeadError = true;
          state.message = action.payload;
          toast.error(action.payload);
        }
      );
  }
});

export const { resetLeadState } = leadsSlice.actions;
export default leadsSlice.reducer;
