// CleanCity 360 API Client
const API_BASE = '/api';

/**
 * Helper to make authenticated requests with JSON or FormData
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('cleancity_token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not FormData, default to JSON
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: `Server returned ${response.status} ${response.statusText}`
  }));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  demoLogin: (role) =>
    request('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role })
    }),

  getMe: () => request('/auth/me'),

  // AI
  analyzeImage: (formData) =>
    request('/ai/analyze-image', {
      method: 'POST',
      body: formData
    }),

  analyzePreset: (presetType) =>
    request('/ai/analyze-preset', {
      method: 'POST',
      body: JSON.stringify({ presetType })
    }),

  getCategories: () => request('/ai/categories'),

  // Complaints
  createComplaint: (complaintData) =>
    request('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData)
    }),

  getMyComplaints: () => request('/complaints/my-reports'),

  getAllComplaints: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.set('status', params.status);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.priority && params.priority !== 'all') query.set('priority', params.priority);
    if (params.search) query.set('search', params.search);
    const qs = query.toString();
    return request(`/complaints${qs ? `?${qs}` : ''}`);
  },

  getComplaintById: (id) => request(`/complaints/${id}`),

  assignWorker: (complaintId, workerId, notes) =>
    request(`/complaints/${complaintId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ workerId, notes })
    }),

  updateStatus: (complaintId, status, notes, resolutionImageUrl, priority) =>
    request(`/complaints/${complaintId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes, resolutionImageUrl, priority })
    }),

  trackPublic: (id) => request(`/complaints/track/${id}`),

  // Workers
  getWorkers: () => request('/workers'),
  getWorkerById: (id) => request(`/workers/${id}`),

  // Analytics
  getAnalyticsOverview: () => request('/analytics/overview'),

  // Reset / Demo
  reseedDatabase: () => request('/admin/reseed', { method: 'POST' })
};
