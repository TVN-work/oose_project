// Mock services exports
export * from './mockData';
export * from './mockAuthService';
export * from './mockEvOwnerService';
export * from './mockBuyerService';
export * from './mockVerifierService';
export * from './mockAdminService';
export * from './mockCarbonCalculationService';

// Check if we should use mock services
export const shouldUseMock = () => {
  return import.meta.env.DEV && (import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.VITE_USE_MOCK === 'true');
};

