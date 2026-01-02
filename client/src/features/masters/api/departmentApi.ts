import apiClient from '@/api/client';
import { Department } from '../types';

const API_PREFIX = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const departmentApi = {
  getAll: async (): Promise<ApiResponse<Department[]>> => {
    try {
      const { data } = await apiClient.get(`${API_PREFIX}/masters/departments`);
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to load departments',
      };
    }
  },

  create: async (
    department: Omit<Department, 'DepartmentID'>
  ): Promise<ApiResponse<Department>> => {
    try {
      const { data } = await apiClient.post(`${API_PREFIX}/masters/departments`, department);
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to create department',
      };
    }
  },

  update: async (id: number, department: Department): Promise<ApiResponse<Department>> => {
    try {
      const { data } = await apiClient.put(`${API_PREFIX}/masters/departments/${id}`, department);
      return { success: true, data: data.data ?? data };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to update department',
      };
    }
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      await apiClient.delete(`${API_PREFIX}/masters/departments/${id}`);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.response?.data?.error || err?.message || 'Failed to delete department',
      };
    }
  },
};
