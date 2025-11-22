import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { evOwnerService } from '../services/evOwner/evOwnerService';

// Query Keys
export const evOwnerKeys = {
  all: ['evOwner'],
  vehicles: () => [...evOwnerKeys.all, 'vehicles'],
  vehicle: (id) => [...evOwnerKeys.vehicles(), id],
  vehicleTypes: () => [...evOwnerKeys.all, 'vehicleTypes'],
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

// ============= VEHICLES HOOKS =============
// Get all vehicles for current user
export const useVehicles = () => {
  return useQuery({
    queryKey: evOwnerKeys.vehicles(),
    queryFn: () => evOwnerService.getVehicles(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single vehicle by ID
export const useVehicle = (vehicleId) => {
  return useQuery({
    queryKey: evOwnerKeys.vehicle(vehicleId),
    queryFn: () => evOwnerService.getVehicleById(vehicleId),
    enabled: !!vehicleId,
  });
};

// Get all vehicle types (for dropdown)
export const useVehicleTypes = () => {
  return useQuery({
    queryKey: evOwnerKeys.vehicleTypes(),
    queryFn: () => evOwnerService.getVehicleTypes(),
    staleTime: 10 * 60 * 1000, // 10 minutes (vehicle types rarely change)
  });
};

// Create new vehicle
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (vehicleData) => evOwnerService.createVehicle(vehicleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.vehicles() });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.dashboardStats() });
      // Don't show toast here - let the component handle it
    },
    onError: (error) => {
      // Don't show toast here - let the component handle it
      throw error;
    },
  });
};

// Update existing vehicle
export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...vehicleData }) => evOwnerService.updateVehicle(id, vehicleData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.vehicles() });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.vehicle(variables.id) });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.dashboardStats() });
      // Don't show toast here - let the component handle it
    },
    onError: (error) => {
      // Don't show toast here - let the component handle it
      throw error;
    },
  });
};

// Delete vehicle
export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (vehicleId) => evOwnerService.deleteVehicle(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.vehicles() });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.dashboardStats() });
      // Don't show toast here - let the component handle it
    },
    onError: (error) => {
      // Don't show toast here - let the component handle it
      throw error;
    },
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
    onSuccess: (data) => {
      console.log('✅ Upload trip success:', data);
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.trips() });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.dashboardStats() });
      queryClient.invalidateQueries({ queryKey: evOwnerKeys.wallet() });
      // Toast notifications removed - handled by Alert component in pages
      return data;
    },
    onError: (error) => {
      // Error handling moved to component level with Alert component
      console.error('❌ Upload trip error:', error);
      // Re-throw error so component can catch it
      throw error;
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
      // Toast notifications removed - handled by Alert component in pages
    },
    onError: (error) => {
      // Error handling moved to component level with Alert component
      console.error('Create listing error:', error);
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
      // Toast notifications removed - handled by Alert component in pages
    },
    onError: (error) => {
      // Error handling moved to component level with Alert component
      console.error('Update listing error:', error);
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
      // Toast notifications removed - handled by Alert component in pages
    },
    onError: (error) => {
      // Error handling moved to component level with Alert component
      console.error('Delete listing error:', error);
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
      // Toast notifications removed - handled by Alert component in pages
    },
    onError: (error) => {
      // Error handling moved to component level with Alert component
      console.error('Cancel transaction error:', error);
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
      // Toast notifications removed - handled by Alert component in pages
    },
    onError: (error) => {
      // Error handling moved to component level with Alert component
      console.error('Export report error:', error);
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
      // Toast notifications removed - handled by Alert component in pages
    },
    onError: (error) => {
      // Error handling moved to component level with Alert component
      console.error('Withdraw error:', error);
    },
  });
};

