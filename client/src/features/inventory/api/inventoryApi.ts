import apiClient from '../../../api/client';
import { Product, StockLedger, CreateProductInput, UpdateProductInput } from '../types';

export const inventoryApi = {
  getAllProducts: async (filters?: { productType?: string; isActive?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.productType) params.append('productType', filters.productType);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

    const response = await apiClient.get<{ success: boolean; data: Product[] }>(
      `/inventory/products?${params.toString()}`
    );
    return response.data.data;
  },

  getProductById: async (productId: number) => {
    const response = await apiClient.get<{ success: boolean; data: Product }>(
      `/inventory/products/${productId}`
    );
    return response.data.data;
  },

  createProduct: async (productData: CreateProductInput) => {
    const response = await apiClient.post<{ success: boolean; data: Product }>(
      '/inventory/products',
      productData
    );
    return response.data.data;
  },

  updateProduct: async (productId: number, updateData: UpdateProductInput) => {
    const response = await apiClient.put<{ success: boolean; data: Product }>(
      `/inventory/products/${productId}`,
      updateData
    );
    return response.data.data;
  },

  deleteProduct: async (productId: number) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/inventory/products/${productId}`
    );
    return response.data;
  },

  getStockLedger: async (productId: number, limit = 100) => {
    const response = await apiClient.get<{ success: boolean; data: StockLedger[] }>(
      `/inventory/products/${productId}/ledger?limit=${limit}`
    );
    return response.data.data;
  },

  getLowStockProducts: async () => {
    const response = await apiClient.get<{ success: boolean; data: Product[] }>(
      '/inventory/products/low-stock'
    );
    return response.data.data;
  },

  getProductsByType: async (type: 'FG' | 'RM' | 'PM') => {
    const response = await apiClient.get<{ success: boolean; data: Product[] }>(
      `/catalog/products/type/${type}`
    );
    return response.data.data;
  },

  getMasterProductsByType: async (type: 'FG' | 'RM' | 'PM') => {
    const response = await apiClient.get<{ success: boolean; data: Product[] }>(
      `/catalog/master-products?type=${type}`
    );
    return response.data.data;
  },
};
