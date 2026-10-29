/**
 * Central API Client for TruthLens AI Frontend
 */

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const API_BASE = rawApiUrl ? `${rawApiUrl.replace(/\/+$/, '')}/api` : '/api';

export const getAuthToken = () => {
  return localStorage.getItem('truthlens_token') || null;
};

export const getGuestId = () => {
  let guestId = localStorage.getItem('truthlens_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('truthlens_guest_id', guestId);
  }
  return guestId;
};

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Analyses
  async analyzeContent(payload) {
    const res = await fetch(`${API_BASE}/analyses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        ...payload,
        guestId: getGuestId(),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Analysis failed');
    return data.data;
  },

  async getAnalyses(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.riskLevel && params.riskLevel !== 'All') query.append('riskLevel', params.riskLevel);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);
    query.append('guestId', getGuestId());

    const res = await fetch(`${API_BASE}/analyses?${query.toString()}`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch analyses');
    return data;
  },

  async getAnalysisById(id) {
    const res = await fetch(`${API_BASE}/analyses/${id}`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Analysis not found');
    return data.data;
  },

  async deleteAnalysis(id) {
    const res = await fetch(`${API_BASE}/analyses/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete analysis');
    return data;
  },

  // Dashboard
  async getDashboardMetrics() {
    const res = await fetch(`${API_BASE}/dashboard/metrics`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch metrics');
    return data.data;
  },

  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data.data;
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data.data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data.data;
  },
};
