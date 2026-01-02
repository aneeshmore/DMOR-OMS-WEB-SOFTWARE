import apiClient from '@/api/client';

const API_PREFIX = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const authorityApi = {
  getUserPermissions: (userId: string) => apiClient.get(`${API_PREFIX}/auth/permissions/${userId}`),

  updateUserPermissions: (userId: string, permissions: any[]) =>
    apiClient.put(`${API_PREFIX}/auth/permissions/${userId}`, { permissions }),
};
