import apiClient from '../../../api/client';

export interface BOMRequirement {
  RawMaterialName: string;
  RequiredQty: number;
  AvailableQty: number;
  Unit: string;
  Status: string;
}

export const bomApi = {
  calculateRequirements: async (finishedGoodId: number, productionQuantity: number) => {
    const response = await apiClient.post<{ success: boolean; data: any[] }>('/bom/calculate', {
      finishedGoodId,
      productionQuantity,
    });
    return response.data.data;
  },

  getBOMByFinishedGood: async (finishedGoodId: number) => {
    const response = await apiClient.get<{ success: boolean; data: any[] }>(
      `/bom/finished-good/${finishedGoodId}`
    );
    return response.data.data;
  },
};
