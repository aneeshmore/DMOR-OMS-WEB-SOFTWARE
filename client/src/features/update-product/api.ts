import { apiClient } from '@/api/client';

export const updateProductApi = {
  getFinalGoods: async () => {
    const response = await apiClient.get('/update-product/final-goods');
    return response.data;
  },

  updateFinalGood: async (id: number, data: any) => {
    const response = await apiClient.put(`/update-product/final-goods/${id}`, data);
    return response.data;
  },

  getRawMaterials: async () => {
    const response = await apiClient.get('/update-product/raw-materials');
    return response.data;
  },

  updateRawMaterial: async (id: number, data: any) => {
    const response = await apiClient.put(`/update-product/raw-materials/${id}`, data);
    return response.data;
  },

  getPackagingMaterials: async () => {
    const response = await apiClient.get('/update-product/packaging-materials');
    return response.data;
  },

  updatePackagingMaterial: async (id: number, data: any) => {
    const response = await apiClient.put(`/update-product/packaging-materials/${id}`, data);
    return response.data;
  },
};
