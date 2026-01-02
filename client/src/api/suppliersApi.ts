import apiClient from './client';

export interface Supplier {
  supplierId: number;
  supplierName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const suppliersApi = {
  getAll: async (filters?: { isActive?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

    const response = await apiClient.get<{ success: boolean; data: Supplier[] }>(
      `/suppliers?${params.toString()}`
    );
    return response.data.data;
  },

  getById: async (supplierId: number) => {
    const response = await apiClient.get<{ success: boolean; data: Supplier }>(
      `/suppliers/${supplierId}`
    );
    return response.data.data;
  },

  create: async (supplierData: { supplierName: string }) => {
    const response = await apiClient.post<{ success: boolean; data: Supplier }>(
      '/suppliers',
      supplierData
    );
    return response.data.data;
  },
};
