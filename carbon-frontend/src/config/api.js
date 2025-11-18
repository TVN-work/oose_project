// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // EV Owner
  EV_OWNER: {
    TRIPS: '/ev-owner/trips',
    CARBON_WALLET: '/ev-owner/carbon-wallet',
    LISTINGS: '/ev-owner/listings',
    TRANSACTIONS: '/ev-owner/transactions',
    REPORTS: '/ev-owner/reports',
    AI_PRICE_SUGGESTION: '/ev-owner/ai-price-suggestion',
    WITHDRAW: '/ev-owner/withdraw',
  },
  
  // Buyer
  BUYER: {
    MARKETPLACE: '/buyer/marketplace',
    PURCHASE: '/buyer/purchase',
    CERTIFICATES: '/buyer/certificates',
    PURCHASE_HISTORY: '/buyer/purchase-history',
    PAYMENT: '/buyer/payment',
  },
  
  // Verifier
  VERIFIER: {
    VERIFICATION_REQUESTS: '/verifier/verification-requests',
    APPROVE: '/verifier/approve',
    REJECT: '/verifier/reject',
    ISSUE_CREDITS: '/verifier/issue-credits',
    REPORTS: '/verifier/reports',
  },
  
  // Admin
  ADMIN: {
    USERS: '/admin/users',
    TRANSACTIONS: '/admin/transactions',
    WALLETS: '/admin/wallets',
    LISTINGS: '/admin/listings',
    REPORTS: '/admin/reports',
    DISPUTES: '/admin/disputes',
  },
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};

