import apiClient from '@/api/client';
import { Visit, CreateVisitDTO } from '../types';

const API_PREFIX = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const crmApi = {
  getVisits: async (filters?: any) => {
    const response = await apiClient.get<{ success: boolean; data: Visit[] }>(
      `${API_PREFIX}/crm/visits`,
      { params: filters }
    );
    return response.data;
  },

  createVisit: async (data: CreateVisitDTO) => {
    const response = await apiClient.post<{ success: boolean; data: Visit }>(
      `${API_PREFIX}/crm/visits`,
      data
    );
    return response.data;
  },

  updateVisit: async (id: number, data: Partial<Visit>) => {
    const response = await apiClient.patch<{ success: boolean; data: Visit }>(
      `${API_PREFIX}/crm/visits/${id}`,
      data
    );
    return response.data;
  },
};
