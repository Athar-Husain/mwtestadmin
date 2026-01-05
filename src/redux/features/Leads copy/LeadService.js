// services/leadService.js
const API_URL = '/api/leads';

const leadService = {
  getLeads: async (filters, token) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  addFollowUp: async (leadId, data, token) => {
    const res = await fetch(`${API_URL}/${leadId}/followup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  convertLead: async (leadId, customerId, token) => {
    const res = await fetch(`${API_URL}/${leadId}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ customerId }),
    });
    return res.json();
  },
};

export default leadService;