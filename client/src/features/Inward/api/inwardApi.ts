import apiClient from '../../../api/client';
import { InwardEntry, CreateInwardInput, UpdateInwardInput } from '../types';

export const inwardApi = {
  getAllInwards: async (filters?: { productId?: number }) => {
    const params = new URLSearchParams();
    if (filters?.productId) params.append('productId', String(filters.productId));

    const response = await apiClient.get<{ success: boolean; data: InwardEntry[] }>(
      `/inward?${params.toString()}`
    );
    return response.data.data;
  },

  getInwardById: async (inwardId: number) => {
    const response = await apiClient.get<{ success: boolean; data: InwardEntry }>(
      `/inward/${inwardId}`
    );
    return response.data.data;
  },

  createInward: async (data: CreateInwardInput) => {
    const response = await apiClient.post<{ success: boolean; data: InwardEntry[] }>(
      '/inward',
      data
    );
    return response.data.data;
  },

  updateInward: async (inwardId: number, data: UpdateInwardInput) => {
    const response = await apiClient.put<{ success: boolean; data: InwardEntry }>(
      `/inward/${inwardId}`,
      data
    );
    return response.data.data;
  },

  // Removed getUniqueSuppliers - use suppliersApi.getAll() instead

  getBillInfo: async (
    billNo: string,
    supplierId: number,
    productType: 'FG' | 'RM' | 'PM',
    inwardDate: string
  ) => {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        billNo: string;
        supplierId: number;
        inwardDate: string;
        productType: 'FG' | 'RM' | 'PM';
        products: { masterProductId: number; productName: string }[];
      } | null;
    }>(
      `/inward/bill/${encodeURIComponent(billNo)}?supplierId=${supplierId}&productType=${productType}&inwardDate=${encodeURIComponent(inwardDate)}`
    );
    return response.data.data;
  },

  deleteInward: async (inwardId: number) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/inward/${inwardId}`
    );
    return response.data;
  },

  deleteBill: async (
    billNo: string,
    supplierId: number,
    productType: 'FG' | 'RM' | 'PM',
    inwardDate: string
  ) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/inward/bill?billNo=${encodeURIComponent(billNo)}&supplierId=${supplierId}&productType=${productType}&inwardDate=${encodeURIComponent(inwardDate)}`
    );
    return response.data;
  },
};
