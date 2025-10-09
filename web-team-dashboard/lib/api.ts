import axios from 'axios';
import {
  Client,
  TeamMember,
  ProjectHistory,
  MonthlySnapshot,
  DashboardStats,
  TeamWorkload,
  ApiResponse
} from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per gestire errori globali
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Dashboard APIs
export const dashboardApi = {
  getStats: (): Promise<DashboardStats> =>
    api.get('/stats').then(res => res.data),

  getTeamWorkload: (): Promise<TeamWorkload[]> =>
    api.get('/team-members/workload').then(res => res.data),
};

// Clients APIs
export const clientsApi = {
  getAll: (params?: any): Promise<ApiResponse<Client>> =>
    api.get('/clients', { params }).then(res => res.data),

  getById: (id: number): Promise<Client> =>
    api.get(`/clients/${id}`).then(res => res.data),

  create: (data: Partial<Client>): Promise<Client> =>
    api.post('/clients', data).then(res => res.data),

  update: (id: number, data: Partial<Client>): Promise<Client> =>
    api.patch(`/clients/${id}`, data).then(res => res.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/clients/${id}`).then(res => res.data),

  getStats: (): Promise<DashboardStats> =>
    api.get('/stats').then(res => res.data),

  bulkUpdate: (updates: Array<{ id: number; [key: string]: any }>): Promise<{ updated: Client[] }> =>
    api.post('/clients/bulk-update', { updates }).then(res => res.data),
};

// Team Members APIs
export const teamApi = {
  getAll: (): Promise<TeamMember[]> =>
    api.get('/team-members').then(res => res.data),

  getById: (id: number): Promise<TeamMember> =>
    api.get(`/team-members/${id}`).then(res => res.data),

  create: (data: Partial<TeamMember>): Promise<TeamMember> =>
    api.post('/team-members', data).then(res => res.data),

  update: (id: number, data: Partial<TeamMember>): Promise<TeamMember> =>
    api.patch(`/team-members/${id}`, data).then(res => res.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/team-members/${id}`).then(res => res.data),

  getWorkload: (): Promise<TeamWorkload[]> =>
    api.get('/team-members/workload').then(res => res.data),
};

// Project History APIs
export const historyApi = {
  getAll: (params?: any): Promise<ApiResponse<ProjectHistory>> =>
    api.get('/project-history', { params }).then(res => res.data),

  getById: (id: number): Promise<ProjectHistory> =>
    api.get(`/project-history/${id}`).then(res => res.data),

  create: (data: Partial<ProjectHistory>): Promise<ProjectHistory> =>
    api.post('/project-history', data).then(res => res.data),

  update: (id: number, data: Partial<ProjectHistory>): Promise<ProjectHistory> =>
    api.patch(`/project-history/${id}`, data).then(res => res.data),

  delete: (id: number): Promise<void> =>
    api.delete(`/project-history/${id}`).then(res => res.data),

  getTrends: (): Promise<any> =>
    api.get('/project-history/trends').then(res => res.data),

  getPerformance: (): Promise<any> =>
    api.get('/project-history/performance').then(res => res.data),
};

// Monthly Snapshots APIs
export const snapshotsApi = {
  getAll: (): Promise<MonthlySnapshot[]> =>
    api.get('/snapshots').then(res => res.data.results || res.data),

  getById: (id: number): Promise<MonthlySnapshot> =>
    api.get(`/snapshots/${id}`).then(res => res.data),

  create: (data: Partial<MonthlySnapshot>): Promise<MonthlySnapshot> =>
    api.post('/snapshots', data).then(res => res.data),

  createCurrent: (): Promise<MonthlySnapshot> =>
    api.post('/snapshots/create-current').then(res => res.data),
};

export default api;