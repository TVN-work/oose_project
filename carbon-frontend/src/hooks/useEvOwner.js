import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { evOwnerService } from '../services/evOwner/evOwnerService';
import toast from 'react-hot-toast';

// Query Keys
export const evOwnerKeys = {
  all: ['evOwner'],
  trips: () => [...evOwnerKeys.all, 'trips'],
  trip: (id) => [...evOwnerKeys.trips(), id],
  wallet: () => [...evOwnerKeys.all, 'wallet'],
  walletTransactions: () => [...evOwnerKeys.all, 'wallet', 'transactions'],
  listings: () => [...evOwnerKeys.all, 'listings'],
  listing: (id) => [...evOwnerKeys.listings(), id],
  transactions: () => [...evOwnerKeys.all, 'transactions'],
  transaction: (id) => [...evOwnerKeys.transactions(), id],
  reports: () => [...evOwnerKeys.all, 'reports'],
  dashboardStats: () => [...evOwnerKeys.all, 'dashboard'],
};

// Dashboard Stats Hook
export const useDashboardStats = () => {
  return useQuery({
    queryKey: evOwnerKeys.dashboardStats(),
    queryFn: () => evOwnerService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Trips Hooks
export const useTrips = (params = {}) => {
  return useQuery({
    queryKey: [...evOwnerKeys.trips(), params],
    queryFn: () => evOwnerService.getTrips(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTrip = (tripId) => {
  return useQuery({
    queryKey: evOwnerKeys.trip(tripId),
    queryFn: () => evOwnerService.getTripById(tripId),
    enabled: !!tripId,
  });
};

export const useUploadTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tripData) => evOwnerService.uploadTrip(tripData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.trips() });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.dashboardStats() });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.wallet() });
      toast.success('Tải dữ liệu hành trình thành công!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
    },
  });
};

// Carbon Wallet Hooks
export const useCarbonWallet = () => {
  return useQuery({
    queryKey: evOwnerKeys.wallet(),
    queryFn: () => evOwnerService.getCarbonWallet(),
    staleTime: 0, // Always consider stale to allow immediate refetch
    gcTime: 0, // Don't cache, always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

export const useWalletTransactions = (params = {}) => {
  return useQuery({
    queryKey: [...evOwnerKeys.walletTransactions(), params],
    queryFn: () => evOwnerService.getWalletTransactions(params),
    staleTime: 0, // Always consider stale to allow immediate refetch
    gcTime: 0, // Don't cache, always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

// Listings Hooks
export const useListings = (params = {}) => {
  return useQuery({
    queryKey: [...evOwnerKeys.listings(), params],
    queryFn: () => evOwnerService.getListings(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useListing = (listingId) => {
  return useQuery({
    queryKey: evOwnerKeys.listing(listingId),
    queryFn: async () => {
      const listings = await evOwnerService.getListings();
      return listings.find(l => l.id === listingId);
    },
    enabled: !!listingId,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (listingData) => evOwnerService.createListing(listingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.listings() });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.wallet() });
      toast.success('Tạo niêm yết thành công!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo niêm yết');
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ listingId, listingData }) => 
      evOwnerService.updateListing(listingId, listingData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.listings() });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.listing(variables.listingId) });
      toast.success('Cập nhật niêm yết thành công!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (listingId) => evOwnerService.deleteListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.listings() });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.wallet() });
      toast.success('Xóa niêm yết thành công!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
    },
  });
};

export const usePriceSuggestion = () => {
  return useMutation({
    mutationFn: ({ vehicleType, creditAmount, marketType }) =>
      evOwnerService.getPriceSuggestion(vehicleType, creditAmount, marketType),
  });
};

// Transactions Hooks
export const useTransactions = (params = {}) => {
  return useQuery({
    queryKey: [...evOwnerKeys.transactions(), params],
    queryFn: () => evOwnerService.getTransactions(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useTransaction = (transactionId) => {
  return useQuery({
    queryKey: evOwnerKeys.transaction(transactionId),
    queryFn: () => evOwnerService.getTransactionById(transactionId),
    enabled: !!transactionId,
  });
};

export const useCancelTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (transactionId) => evOwnerService.cancelTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.wallet() });
      toast.success('Hủy giao dịch thành công!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy giao dịch');
    },
  });
};

// Reports Hooks
export const useReports = (params = {}) => {
  return useQuery({
    queryKey: [...evOwnerKeys.reports(), params],
    queryFn: () => evOwnerService.getReports(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useExportReport = () => {
  return useMutation({
    mutationFn: ({ format, params }) => evOwnerService.exportReport(format, params),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Xuất báo cáo thành công!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xuất báo cáo');
    },
  });
};

// Withdraw Hook
export const useWithdraw = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ amount, paymentMethod }) => 
      evOwnerService.withdraw(amount, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.wallet() });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.transactions() });
      toast.success('Rút tiền thành công!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi rút tiền');
    },
  });
};

