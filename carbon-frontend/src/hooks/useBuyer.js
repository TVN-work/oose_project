import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buyerService } from '../services/buyer/buyerService';
import toast from 'react-hot-toast';

// Query Keys
export const buyerKeys = {
  all: ['buyer'],
  marketplace: () => [...buyerKeys.all, 'marketplace'],
  certificates: () => [...buyerKeys.all, 'certificates'],
  purchaseHistory: () => [...buyerKeys.all, 'purchase-history'],
  dashboardStats: () => [...buyerKeys.all, 'dashboard'],
  paymentMethods: () => [...buyerKeys.all, 'payment-methods'],
};

// Dashboard Stats Hook
export const useBuyerDashboardStats = () => {
  return useQuery({
    queryKey: buyerKeys.dashboardStats(),
    queryFn: () => buyerService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Marketplace Hooks
export const useMarketplace = (params = {}) => {
  return useQuery({
    queryKey: [...buyerKeys.marketplace(), params],
    queryFn: () => buyerService.getMarketplace(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useListingDetail = (listingId) => {
  return useQuery({
    queryKey: [...buyerKeys.marketplace(), listingId],
    queryFn: () => buyerService.getListingDetail(listingId),
    enabled: !!listingId,
    staleTime: 2 * 60 * 1000,
  });
};

export const usePurchase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (purchaseData) => buyerService.purchase(purchaseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buyerKeys.marketplace() });
      queryClient.invalidateQueries({ queryKey: buyerKeys.purchaseHistory() });
      queryClient.invalidateQueries({ queryKey: buyerKeys.certificates() });
      toast.success('Mua tín chỉ thành công!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi mua tín chỉ');
    },
  });
};

// Certificates Hooks
export const useCertificates = (params = {}) => {
  return useQuery({
    queryKey: [...buyerKeys.certificates(), params],
    queryFn: () => buyerService.getCertificates(params),
    staleTime: 2 * 60 * 1000,
  });
};

// Purchase History Hooks
export const usePurchaseHistory = (params = {}) => {
  return useQuery({
    queryKey: [...buyerKeys.purchaseHistory(), params],
    queryFn: () => buyerService.getPurchaseHistory(params),
    staleTime: 2 * 60 * 1000,
  });
};

// Payment Methods Hook
export const usePaymentMethods = () => {
  return useQuery({
    queryKey: buyerKeys.paymentMethods(),
    queryFn: () => buyerService.getPaymentMethods(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

