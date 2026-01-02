import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useProductStock = () => {
  return useQuery({
    queryKey: ['productStock'],
    queryFn: dashboardApi.getProductStock,
    refetchInterval: 30000,
    staleTime: 10000,
  });
};

export const useOrderPaymentStatus = (status: 'Pending' | 'Overdue' | 'All' = 'All') => {
  return useQuery({
    queryKey: ['orderPaymentStatus', status],
    queryFn: () => dashboardApi.getOrderPaymentStatus(status),
    refetchInterval: 30000,
    staleTime: 10000,
  });
};

export const useProductionReport = () => {
  return useQuery({
    queryKey: ['productionReport'],
    queryFn: dashboardApi.getProductionReport,
    refetchInterval: 30000,
    staleTime: 10000,
  });
};

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: dashboardApi.getDashboardOverview,
    refetchInterval: 30000,
    staleTime: 10000,
  });
};
