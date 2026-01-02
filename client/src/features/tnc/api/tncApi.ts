import { apiClient } from '@/api/client';
import { Tnc, CreateTncInput, UpdateTncInput } from '../types';

export const tncApi = {
  getAllTnc: async () => {
    const response = await apiClient.get<{ success: boolean; data: Tnc[] }>('/tnc');
    return response.data;
  },

  createTnc: async (data: CreateTncInput) => {
    const response = await apiClient.post<{ success: boolean; data: Tnc }>('/tnc', data);
    return response.data;
  },

  updateTnc: async (id: number, data: UpdateTncInput) => {
    const response = await apiClient.put<{ success: boolean; data: Tnc }>(`/tnc/${id}`, data);
    return response.data;
  },

  deleteTnc: async (id: number) => {
    const response = await apiClient.delete<{ success: boolean; data: Tnc }>(`/tnc/${id}`);
    return response.data;
  },
};
