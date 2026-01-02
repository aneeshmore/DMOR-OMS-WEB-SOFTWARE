import apiClient from '../../../api/client';

export interface Unit {
  unitId: number;
  unitName: string;
}

export const unitsApi = {
  getAllUnits: async () => {
    const response = await apiClient.get<{ success: boolean; data: Unit[] }>('/masters/units');
    return response.data.data;
  },
};
