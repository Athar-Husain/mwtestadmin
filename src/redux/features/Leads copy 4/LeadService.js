import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
const LEAD_URL = `${BASE_API_URL}/api/leads`;

const axiosInstance = axios.create({
  baseURL: LEAD_URL,
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token && TokenManager.isValid()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const LeadService = {
  // --- Admin Routes ---
  getAll: async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    const res = await axiosInstance.get(`/?${queryParams}`);
    return res.data;
  },
  createAdminLead: async (data) => {
    const res = await axiosInstance.post('/createLeadadmin', data);
    return res.data;
  },
  assignLead: async (leadId, teamMemberId) => {
    const res = await axiosInstance.patch(`/${leadId}/assign`, { teamMemberId });
    return res.data;
  },
  convert: async (leadId, data) => {
    // data should contain { connectionId, customerId }
    const res = await axiosInstance.patch(`/${leadId}/convert`, data);
    return res.data;
  },
  markRewardPaid: async (leadId, rewardData) => {
    const res = await axiosInstance.patch(`/${leadId}/reward-paid`, rewardData);
    return res.data;
  },

  // --- Team Routes ---
  getMyAssigned: async () => {
    const res = await axiosInstance.get('/my-assigned');
    return res.data;
  },
  addFollowUp: async (leadId, data) => {
    const res = await axiosInstance.post(`/${leadId}/follow-up`, data); // matches route exactly
    return res.data;
  },
  updateStatus: async (leadId, status) => {
    const res = await axiosInstance.patch(`/${leadId}/status`, { status });
    return res.data;
  },

  // --- Customer/Common Routes ---
  getMyReferrals: async () => {
    const res = await axiosInstance.get('/getMyReferrals');
    return res.data;
  },
  createReferral: async (data) => {
    const res = await axiosInstance.get('/createLead', data); // Note: Your route says .get for createLead, double check if it should be .post
    return res.data;
  }
};

export default LeadService;
