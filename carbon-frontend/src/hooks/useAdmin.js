import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin/adminService';
import toast from 'react-hot-toast';

// Query Keys
export const adminKeys = {
  all: ['admin'],
  users: () => [...adminKeys.all, 'users'],
  user: (id) => [...adminKeys.users(), id],
  transactions: () => [...adminKeys.all, 'transactions'],
  transaction: (id) => [...adminKeys.transactions(), id],
  wallets: () => [...adminKeys.all, 'wallets'],
  wallet: (id) => [...adminKeys.wallets(), id],
  listings: () => [...adminKeys.all, 'listings'],
  listing: (id) => [...adminKeys.listings(), id],
  reports: () => [...adminKeys.all, 'reports'],
  systemStats: () => [...adminKeys.all, 'system-stats'],
};

// System Stats Hook
export const useSystemStats = () => {
  return useQuery({
    queryKey: adminKeys.systemStats(),
    queryFn: () => adminService.getSystemStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
};

// User Management Hooks
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: [...adminKeys.users(), params],
    queryFn: () => adminService.getUsers(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useUserDetail = (userId) => {
  return useQuery({
    queryKey: adminKeys.user(userId),
    queryFn: () => adminService.getUserDetail(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, userData }) => adminService.updateUser(userId, userData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(variables.userId) });
      toast.success('💾 Đã cập nhật thông tin người dùng');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi cập nhật người dùng');
    },
  });
};

export const useLockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => adminService.lockUser(userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(variables) });
      toast.warning('🔒 Đã khóa tài khoản người dùng');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi khóa tài khoản');
    },
  });
};

export const useUnlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => adminService.unlockUser(userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(variables) });
      toast.success('🔓 Đã mở khóa tài khoản người dùng');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi mở khóa tài khoản');
    },
  });
};

// Transaction Management Hooks
export const useAdminTransactions = (params = {}) => {
  return useQuery({
    queryKey: [...adminKeys.transactions(), params],
    queryFn: () => adminService.getTransactions(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useResolveDispute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionId, resolutionData }) =>
      adminService.resolveDispute(transactionId, resolutionData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: adminKeys.transaction(variables.transactionId) });
      toast.success('✅ Đã giải quyết tranh chấp');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi giải quyết tranh chấp');
    },
  });
};

// Wallet Management Hooks
export const useAdminWallets = (params = {}) => {
  return useQuery({
    queryKey: [...adminKeys.wallets(), params],
    queryFn: () => adminService.getWallets(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useAdminWalletDetail = (walletId) => {
  return useQuery({
    queryKey: adminKeys.wallet(walletId),
    queryFn: () => adminService.getWalletDetail(walletId),
    enabled: !!walletId,
  });
};

export const useFreezeWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (walletId) => adminService.freezeWallet(walletId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.wallets() });
      queryClient.invalidateQueries({ queryKey: adminKeys.wallet(variables) });
      toast.warning('🔒 Đã khóa ví');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi khóa ví');
    },
  });
};

// Listing Management Hooks
export const useAdminListings = (params = {}) => {
  return useQuery({
    queryKey: [...adminKeys.listings(), params],
    queryFn: () => adminService.getListings(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useApproveListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId) => adminService.approveListing(listingId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.listings() });
      queryClient.invalidateQueries({ queryKey: adminKeys.listing(variables) });
      toast.success(`✅ Đã duyệt niêm yết #${variables}`);
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi duyệt niêm yết');
    },
  });
};

export const useRejectListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, reason }) => adminService.rejectListing(listingId, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.listings() });
      queryClient.invalidateQueries({ queryKey: adminKeys.listing(variables.listingId) });
      toast.error(`❌ Đã từ chối niêm yết #${variables.listingId}`);
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi từ chối niêm yết');
    },
  });
};

// Reports Hook
export const useAdminReports = (params = {}) => {
  return useQuery({
    queryKey: [...adminKeys.reports(), params],
    queryFn: () => adminService.getReports(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportType, params }) => adminService.generateReport(reportType, params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.reports() });
      toast.success('📊 Đã tạo báo cáo thành công');
    },
    onError: (error) => {
      toast.error(error.message || '❌ Lỗi khi tạo báo cáo');
    },
  });
};

