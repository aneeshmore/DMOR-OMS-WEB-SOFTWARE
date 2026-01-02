import apiClient from '@/api/client';
import { MasterProduct } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const masterProductApi = {
  getAll: async (params?: any): Promise<ApiResponse<MasterProduct[]>> => {
    try {
      const { data } = await apiClient.get('/catalog/master-products', { params });
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to load master products',
      };
    }
  },

  getById: async (id: number): Promise<ApiResponse<MasterProduct>> => {
    try {
      const { data } = await apiClient.get(`/catalog/master-products/${id}`);
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to load master product',
      };
    }
  },

  create: async (data: any): Promise<ApiResponse<MasterProduct>> => {
    try {
      const response = await apiClient.post('/catalog/master-products', data);
      return { success: true, data: response.data.data ?? response.data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to create master product',
      };
    }
  },

  update: async (id: number, data: any): Promise<ApiResponse<MasterProduct>> => {
    try {
      const response = await apiClient.put(`/catalog/master-products/${id}`, data);
      return { success: true, data: response.data.data ?? response.data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to update master product',
      };
    }
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      await apiClient.delete(`/catalog/master-products/${id}`);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to delete master product',
      };
    }
  },
};
