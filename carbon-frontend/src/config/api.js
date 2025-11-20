// API Configuration
// All requests go through API Gateway (Spring Cloud Gateway)
// Gateway routes requests to appropriate microservices via Eureka Service Discovery
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const API_ENDPOINTS = {
  // User Service - Authentication & User Management
  AUTH: {
    LOGIN: '/users/auth/login',
    REGISTER: '/users/auth/register',
    LOGOUT: '/users/auth/logout',
    REFRESH: '/users/auth/refresh',
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/profile/password',
  },
  
  // Vehicle Service - EV Trip Data Management
  VEHICLE: {
    TRIPS: '/vehicles/trips',
    UPLOAD_TRIP: '/vehicles/trips/upload',
    TRIP_DETAIL: '/vehicles/trips/:id',
    VEHICLE_INFO: '/vehicles/info',
    UPDATE_VEHICLE: '/vehicles/info',
  },
  
  // Carbon Calculation Service - CO2 & Credit Calculation
  CARBON_CALCULATION: {
    CALCULATE: '/carbon/calculate',
    CALCULATION_STATUS: '/carbon/calculate/:id/status',
    CALCULATION_RESULT: '/carbon/calculate/:id/result',
  },
  
  // Wallet Service - Carbon Wallet & Payment
  WALLET: {
    CARBON_WALLET: '/wallets/carbon',
    CARBON_WALLET_TRANSACTIONS: '/wallets/carbon/transactions',
    PAYMENT_WALLET: '/wallets/payment',
    PAYMENT_WALLET_TRANSACTIONS: '/wallets/payment/transactions',
    WITHDRAW: '/wallets/withdraw',
    DEPOSIT: '/wallets/deposit',
  },
  
  // Market Service - Listings & Marketplace
  MARKET: {
    // EV Owner - Listings
    LISTINGS: '/market/listings',
    CREATE_LISTING: '/market/listings',
    UPDATE_LISTING: '/market/listings/:id',
    DELETE_LISTING: '/market/listings/:id',
    AI_PRICE_SUGGESTION: '/market/listings/ai-price-suggestion',
    
    // Buyer - Marketplace
    MARKETPLACE: '/market/marketplace',
    LISTING_DETAIL: '/market/marketplace/:id',
    SEARCH: '/market/marketplace/search',
    
    // Auction
    AUCTION: '/market/auctions/:id',
    PLACE_BID: '/market/auctions/:id/bid',
    AUCTION_STATUS: '/market/auctions/:id/status',
  },
  
  // Transaction Service - Transaction Management
  TRANSACTION: {
    // EV Owner
    EV_OWNER_TRANSACTIONS: '/transactions/ev-owner',
    TRANSACTION_DETAIL: '/transactions/:id',
    CANCEL_TRANSACTION: '/transactions/:id/cancel',
    COMPLETE_TRANSACTION: '/transactions/:id/complete',
    
    // Buyer
    BUYER_TRANSACTIONS: '/transactions/buyer',
    PURCHASE: '/transactions/purchase',
    
    // Payment
    PAYMENT: '/transactions/:id/payment',
    PAYMENT_METHODS: '/transactions/payment-methods',
  },
  
  // Verification Service (CVA) - Carbon Verification & Audit
  VERIFICATION: {
    VERIFICATION_REQUESTS: '/verification/requests',
    REQUEST_DETAIL: '/verification/requests/:id',
    VERIFY_EV_DATA: '/verification/ev-data/:id',
    VALIDATE_EMISSION: '/verification/emission/:id',
    APPROVE_REQUEST: '/verification/requests/:id/approve',
    REJECT_REQUEST: '/verification/requests/:id/reject',
    ISSUE_CREDITS: '/verification/issue-credits',
    REPORTS: '/verification/reports',
  },
  
  // Certificate Service - Carbon Certificates
  CERTIFICATE: {
    CERTIFICATES: '/certificates',
    CERTIFICATE_DETAIL: '/certificates/:id',
    DOWNLOAD_CERTIFICATE: '/certificates/:id/download',
    GENERATE_CERTIFICATE: '/certificates/generate',
  },
  
  // Admin Service - System Administration
  ADMIN: {
    USERS: '/admin/users',
    USER_DETAIL: '/admin/users/:id',
    UPDATE_USER: '/admin/users/:id',
    LOCK_USER: '/admin/users/:id/lock',
    UNLOCK_USER: '/admin/users/:id/unlock',
    
    TRANSACTIONS: '/admin/transactions',
    RESOLVE_DISPUTE: '/admin/transactions/:id/resolve',
    
    WALLETS: '/admin/wallets',
    WALLET_DETAIL: '/admin/wallets/:id',
    FREEZE_WALLET: '/admin/wallets/:id/freeze',
    
    LISTINGS: '/admin/listings',
    APPROVE_LISTING: '/admin/listings/:id/approve',
    REJECT_LISTING: '/admin/listings/:id/reject',
    
    REPORTS: '/admin/reports',
    GENERATE_REPORT: '/admin/reports/generate',
    
    SYSTEM_STATS: '/admin/stats',
  },
  
  // Media Service - File Storage
  MEDIA: {
    UPLOAD: '/media/upload',
    DOWNLOAD: '/media/:id',
    DELETE: '/media/:id',
  },
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};

