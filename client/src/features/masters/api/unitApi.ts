import apiClient from '@/api/client';
import { Unit } from '../types';

const API_PREFIX = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const unitApi = {
  getAll: async (): Promise<ApiResponse<Unit[]>> => {
    try {
      const { data } = await apiClient.get(`${API_PREFIX}/masters/units`);
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to load units',
      };
    }
  },

  create: async (unit: Omit<Unit, 'UnitID'>): Promise<ApiResponse<Unit>> => {
    try {
      const { data } = await apiClient.post(`${API_PREFIX}/masters/units`, unit);
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to create unit',
      };
    }
  },

  update: async (id: number, unit: Partial<Unit>): Promise<ApiResponse<Unit>> => {
    try {
      const { data } = await apiClient.put(`${API_PREFIX}/masters/units/${id}`, unit);
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to update unit',
      };
    }
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      await apiClient.delete(`${API_PREFIX}/masters/units/${id}`);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to delete unit',
      };
    }
  },
};
