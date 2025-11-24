// Custom hooks exports
// export { default as useDebounce } from './useDebounce';
// export { default as useLocalStorage } from './useLocalStorage';

// Wallet hooks
export {
  useWallets,
  useWallet,
  useWalletByUserId,
  useMyWallet,
  useUpdateWalletBalance,
  useDepositToMyWallet,
  useWalletUtils,
} from './useWallet';

// Carbon Credit hooks
export {
  useCarbonCredits,
  useCarbonCredit,
  useCarbonCreditByUserId,
  useMyCarbonCredit,
  useUpdateCarbonCredit,
  useUpdateMyCarbonCredit,
  useAddCarbonCredits,
  useTradeCarbonCredits,
  useCarbonCreditUtils,
} from './useCarbonCredit';

// Vehicle hooks
export {
  useVehicles,
  useMyVehicles,
  useActiveVehicles,
  useVerifiedVehicles,
  useVehicle,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  useVehicleUtils,
} from './useVehicle';

// Vehicle Type hooks
export {
  useVehicleTypes,
  useVehicleType,
  useVehicleTypesByManufacturer,
  useVehicleTypesByModel,
  useVehicleManufacturers,
  useVehicleModels,
  useCreateVehicleType,
  useCreateMultipleVehicleTypes,
  useUpdateVehicleType,
  useDeleteVehicleType,
  useVehicleTypeUtils,
} from './useVehicleType';

// Media hooks
export {
  useUploadImage,
  useUploadMultipleImages,
  useImageUpload,
  useMultipleImagesUpload,
  useMediaUtils,
} from './useMedia';

// Journey hooks
export {
  useJourney,
  useCreateJourney,
  useJourneyUtils,
} from './useJourney';

// Verification hooks
export {
  useVerificationRequests,
  useVerificationRequest,
  useUpdateVerificationRequest,
  useVerificationUtils,
} from './useVerification';

// Market hooks
export {
  useListings,
  useListing,
  useCreateListing,
  useUpdateListingStatus,
  useMarketUtils,
} from './useMarket';

// Bid hooks
export {
  useBid,
  useCreateBid,
  useDeleteBid,
  useBidUtils,
} from './useBid';

// Transaction hooks
export {
  useTransactions,
  useTransaction,
  useCreateTransaction,
  useUpdateTransactionStatus,
  usePayTransaction,
  useTransactionUtils,
} from './useTransaction';

export default {};