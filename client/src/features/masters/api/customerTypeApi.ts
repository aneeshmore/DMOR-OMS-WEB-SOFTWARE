import apiClient from '@/api/client';
import { CustomerType } from '../types';

const API_PREFIX = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const customerTypeApi = {
  getAll: async (): Promise<ApiResponse<CustomerType[]>> => {
    try {
      const { data } = await apiClient.get(`${API_PREFIX}/masters/customer-types`);
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to load customer types',
      };
    }
  },

  create: async (
    customerType: Omit<CustomerType, 'CustomerTypeID'>
  ): Promise<ApiResponse<CustomerType>> => {
    try {
      const { data } = await apiClient.post(`${API_PREFIX}/masters/customer-types`, customerType);
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to create customer type',
      };
    }
  },

  update: async (
    id: number,
    customerType: Partial<CustomerType>
  ): Promise<ApiResponse<CustomerType>> => {
    try {
      const { data } = await apiClient.put(
        `${API_PREFIX}/masters/customer-types/${id}`,
        customerType
      );
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to update customer type',
      };
    }
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      await apiClient.delete(`${API_PREFIX}/masters/customer-types/${id}`);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to delete customer type',
      };
    }
  },
};
