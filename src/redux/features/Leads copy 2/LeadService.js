import axios from 'axios';
import { TokenManager } from '../Admin/adminService';

const API_URL = '/api/leads';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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

const leadService = {
  getLeads: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const res = await axiosInstance.get(`?${params}`);
    return res.data; // Simplified response handling
  },

  addFollowUp: async (leadId, data) => {
    const res = await axiosInstance.post(`/${leadId}/followup`, data);
    return res.data;
  },

  convertLead: async (leadId, customerId) => {
    const res = await axiosInstance.post(`/${leadId}/convert`, { customerId });
    return res.data;
  }
};

export default leadService;
