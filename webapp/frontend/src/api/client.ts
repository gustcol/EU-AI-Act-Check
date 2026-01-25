import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add language header
    const language = localStorage.getItem('i18nextLng') || 'en';
    if (config.headers) {
      config.headers['Accept-Language'] = language;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('Access denied');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (data: { email: string; password: string; name: string; organization?: string }) =>
    apiClient.post('/auth/register', data),

  logout: () => apiClient.post('/auth/logout'),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),

  me: () => apiClient.get('/auth/me'),
};

// Systems API
export const systemsApi = {
  getAll: () => apiClient.get('/systems'),

  getById: (id: string) => apiClient.get(`/systems/${id}`),

  create: (data: {
    name: string;
    description: string;
    version: string;
    intended_purpose: string;
    deployment_context?: string;
    ai_techniques?: string[];
  }) => apiClient.post('/systems', data),

  update: (id: string, data: Partial<{
    name: string;
    description: string;
    version: string;
    intended_purpose: string;
    deployment_context?: string;
    ai_techniques?: string[];
    status: string;
  }>) => apiClient.put(`/systems/${id}`, data),

  delete: (id: string) => apiClient.delete(`/systems/${id}`),

  classify: (id: string) => apiClient.post(`/systems/${id}/classify`),
};

// Assessments API
export const assessmentsApi = {
  getBySystem: (systemId: string) =>
    apiClient.get(`/assessments/system/${systemId}`),

  getById: (id: string) => apiClient.get(`/assessments/${id}`),

  create: (systemId: string, preliminaryClassification: string) =>
    apiClient.post('/assessments', { system_id: systemId, preliminary_classification: preliminaryClassification }),

  update: (id: string, data: {
    responses?: Array<{ question_id: string; answer: boolean | string | string[] }>;
    final_classification?: string;
    justification?: string;
    status?: string;
  }) => apiClient.put(`/assessments/${id}`, data),

  complete: (id: string, data: { final_classification: string; justification?: string }) =>
    apiClient.post(`/assessments/${id}/complete`, data),

  getQuestions: () => apiClient.get('/assessments/questions'),
};

// Checklist API
export const checklistApi = {
  getBySystem: (systemId: string) =>
    apiClient.get(`/checklists/system/${systemId}`),

  getProgress: (systemId: string) =>
    apiClient.get(`/checklists/system/${systemId}/progress`),

  updateItem: (id: string, data: {
    is_completed?: boolean;
    notes?: string;
    evidence_url?: string;
  }) => apiClient.patch(`/checklists/items/${id}`, data),

  generate: (systemId: string, riskLevel: string) =>
    apiClient.post(`/checklists/system/${systemId}/generate`, { risk_level: riskLevel }),
};

// Reports API
export const reportsApi = {
  getCompliance: (systemId: string) =>
    apiClient.get(`/reports/system/${systemId}/compliance`),

  getRisk: (systemId: string) =>
    apiClient.get(`/reports/system/${systemId}/risk-assessment`),

  downloadPdf: (systemId: string, type: 'compliance' | 'risk-assessment' | 'documentation') =>
    apiClient.get(`/reports/system/${systemId}/${type}?format=pdf`, { responseType: 'blob' }),

  getDashboard: () => apiClient.get('/reports/dashboard'),
};

// User API
export const userApi = {
  getProfile: () => apiClient.get('/users/profile'),

  updateProfile: (data: {
    name?: string;
    organization?: string;
    language?: string;
    preferences?: Record<string, unknown>;
  }) => apiClient.put('/users/profile', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.put('/users/password', { current_password: currentPassword, new_password: newPassword }),
};

export default apiClient;
