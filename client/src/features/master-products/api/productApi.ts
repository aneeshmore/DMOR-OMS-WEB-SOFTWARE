import apiClient from '@/api/client';
import { Product } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const productApi = {
  getAll: async (params?: any): Promise<ApiResponse<Product[]>> => {
    try {
      const { data } = await apiClient.get('/catalog/products', { params });
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to load products',
      };
    }
  },

  getById: async (id: number): Promise<ApiResponse<Product>> => {
    try {
      const { data } = await apiClient.get(`/catalog/products/${id}`);
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to load product',
      };
    }
  },

  getByMasterProductId: async (masterProductId: number): Promise<ApiResponse<Product[]>> => {
    try {
      const { data } = await apiClient.get('/catalog/products', {
        params: { MasterProductID: masterProductId },
      });
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to load products',
      };
    }
  },

  create: async (product: any): Promise<ApiResponse<Product>> => {
    try {
      const { data } = await apiClient.post('/catalog/products', product);
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to create product',
      };
    }
  },

  update: async (id: number, product: any): Promise<ApiResponse<Product>> => {
    try {
      const { data } = await apiClient.put(`/catalog/products/${id}`, product);
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to update product',
      };
    }
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      await apiClient.delete(`/catalog/products/${id}`);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to delete product',
      };
    }
  },
};
