import apiClient from '../../../api/client';
import { CreateOrderInput, OrderWithDetails } from '../../orders/types';

interface SplitOrderRequest {
  order1: CreateOrderInput;
  order2?: CreateOrderInput; // Optional - if not provided, no balance order is created
}

interface SplitOrderResponse {
  originalOrder: OrderWithDetails;
  newOrder1: OrderWithDetails;
  newOrder2: OrderWithDetails | null; // Can be null if no balance order was created
}

export const splitOrdersApi = {
  split: async (originalOrderId: number, data: SplitOrderRequest) => {
    const response = await apiClient.post<{ success: boolean; data: SplitOrderResponse }>(
      `/split-orders/${originalOrderId}/split`,
      data
    );
    return response.data.data;
  },

  search: async (query: string) => {
    const response = await apiClient.get<{ success: boolean; data: OrderWithDetails }>(
      `/split-orders/search?query=${encodeURIComponent(query)}`
    );
    return response.data.data;
  },
};
