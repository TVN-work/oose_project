import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buyerService } from '../services/buyer/buyerService';
import toast from 'react-hot-toast';

// Query Keys
export const buyerKeys = {
  all: ['buyer'],
  marketplace: () => [...buyerKeys.all, 'marketplace'],
  listing: (id) => [...buyerKeys.marketplace(), id],
  auction: (id) => [...buyerKeys.all, 'auction', id],
  purchaseHistory: () => [...buyerKeys.all, 'purchase-history'],
  certificates: () => [...buyerKeys.all, 'certificates'],
  certificate: (id) => [...buyerKeys.certificates(), id],
  dashboardStats: () => [...buyerKeys.all, 'dashboard'],
};

// Dashboard Stats Hook
export const useBuyerDashboardStats = () => {
  return useQuery({
    queryKey: buyerKeys.dashboardStats(),
    queryFn: () => buyerService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
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

export const useSearchMarketplace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (searchParams) => buyerService.searchMarketplace(searchParams),
    onSuccess: (data, variables) => {
      queryClient.setQueryData([...buyerKeys.marketplace(), variables], data);
    },
  });
};

export const useListingDetail = (listingId) => {
  return useQuery({
    queryKey: buyerKeys.listing(listingId),
    queryFn: () => buyerService.getListingDetail(listingId),
    enabled: !!listingId,
  });
};

// Auction Hooks
export const useAuction = (auctionId) => {
  return useQuery({
    queryKey: buyerKeys.auction(auctionId),
    queryFn: () => buyerService.getAuction(auctionId),
    enabled: !!auctionId,
    refetchInterval: 2000, // Poll every 2 seconds for real-time updates
  });
};

export const usePlaceBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ auctionId, bidAmount }) => buyerService.placeBid(auctionId, bidAmount),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: buyerKeys.auction(variables.auctionId) });
      toast.success(`✅ Đã đặt giá ${variables.bidAmount.toLocaleString('vi-VN')} VND`);
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi đặt giá');
    },
  });
};

// Purchase Hooks
export const usePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ creditId, amount, quantity }) =>
      buyerService.purchase(creditId, amount, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: buyerKeys.marketplace() });
      queryClient.invalidateQueries({ queryKey: buyerKeys.purchaseHistory() });
      toast.success('✅ Đã tạo đơn hàng thành công');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi tạo đơn hàng');
    },
  });
};

// Payment Hooks
export const useProcessPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionId, paymentData }) =>
      buyerService.processPayment(transactionId, paymentData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: buyerKeys.purchaseHistory() });
      queryClient.invalidateQueries({ queryKey: buyerKeys.certificates() });
      toast.success('✅ Thanh toán thành công!');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi thanh toán');
    },
  });
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: [...buyerKeys.all, 'payment-methods'],
    queryFn: () => buyerService.getPaymentMethods(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Purchase History Hook
export const usePurchaseHistory = (params = {}) => {
  return useQuery({
    queryKey: [...buyerKeys.purchaseHistory(), params],
    queryFn: () => buyerService.getPurchaseHistory(params),
    staleTime: 2 * 60 * 1000,
  });
};

// Certificates Hooks
export const useCertificates = (params = {}) => {
  return useQuery({
    queryKey: [...buyerKeys.certificates(), params],
    queryFn: () => buyerService.getCertificates(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCertificateDetail = (certificateId) => {
  return useQuery({
    queryKey: buyerKeys.certificate(certificateId),
    queryFn: () => buyerService.getCertificateDetail(certificateId),
    enabled: !!certificateId,
  });
};

export const useDownloadCertificate = () => {
  return useMutation({
    mutationFn: (certificateId) => buyerService.downloadCertificate(certificateId),
    onSuccess: (blob, certificateId) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('📄 Đã tải chứng nhận thành công');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi tải chứng nhận');
    },
  });
};

