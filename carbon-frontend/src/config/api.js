// API Configuration
// All requests go through API Gateway (Spring Cloud Gateway)
// Gateway routes requests to appropriate microservices via Eureka Service Discovery
// API Gateway Port: 8222 (confirmed from backend docker-compose.yml)
// Use Vite proxy in development to avoid CORS issues
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  // User Service - Authentication & User Management
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // Vehicle Service - EV Trip Data Management
  VEHICLE: {
    // Vehicle Types
    VEHICLE_TYPES: '/vehicles/types',
    VEHICLE_TYPE_DETAIL: '/vehicles/types/:id',

    // Vehicles
    VEHICLES: '/vehicles',
    VEHICLE_DETAIL: '/vehicles/:id',
    CREATE_VEHICLE: '/vehicles',
    UPDATE_VEHICLE: '/vehicles/:id',
    DELETE_VEHICLE: '/vehicles/:id',

    // Journeys
    JOURNEYS: '/vehicles/journeys',
    JOURNEY_DETAIL: '/vehicles/journeys/:id',
    UPLOAD_TRIP: '/vehicles/journeys/upload',

    // Journey Histories
    JOURNEY_HISTORIES: '/vehicles/journeys/:id/histories',
    JOURNEY_HISTORY_DETAIL: '/vehicles/journeys/histories/:id',
  },

  // Carbon Calculation Service - CO2 & Credit Calculation
  CARBON_CALCULATION: {
    CALCULATE: '/carbon/calculate',
    CALCULATION_STATUS: '/carbon/calculate/:id/status',
    CALCULATION_RESULT: '/carbon/calculate/:id/result',
  },

  // Wallet Service - Carbon Wallet & Payment
  WALLET: {
    // Payment Wallets
    WALLETS: '/wallets',
    WALLET_DETAIL: '/wallets/:id',
    PAYMENT_WALLET: '/wallets/payment',
    PAYMENT_WALLET_TRANSACTIONS: '/wallets/payment/transactions',
    WITHDRAW: '/wallets/withdraw',
    DEPOSIT: '/wallets/deposit',

    // Carbon Credits (from carbon_credit table)
    CARBON_WALLET: '/wallets/carbon',
    CARBON_WALLET_TRANSACTIONS: '/wallets/carbon/transactions',

    // Audit Logs
    AUDITS: '/wallets/audits',
    AUDIT_DETAIL: '/wallets/audits/:id',
  },

  // Market Service - Listings & Marketplace
  MARKET: {
    // Market Listings (from market_listing table)
    LISTINGS: '/market/listings',
    LISTING_DETAIL: '/market/listings/:id',
    CREATE_LISTING: '/market/listings',
    UPDATE_LISTING: '/market/listings/:id',
    DELETE_LISTING: '/market/listings/:id',
    AI_PRICE_SUGGESTION: '/market/listings/ai-price-suggestion',

    // Buyer - Marketplace
    MARKETPLACE: '/market/marketplace',
    SEARCH: '/market/marketplace/search',

    // Bids (from bid table)
    BIDS: '/market/bids',
    BID_DETAIL: '/market/bids/:id',
    PLACE_BID: '/market/listings/:id/bid',

    // Auction
    AUCTION: '/market/auctions/:id',
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
    // Verify Requests (from verify_request table)
    VERIFICATION_REQUESTS: '/verification/requests',
    REQUEST_DETAIL: '/verification/requests/:id',
    CREATE_VERIFY_REQUEST: '/verification/requests',
    APPROVE_REQUEST: '/verification/requests/:id/approve',
    REJECT_REQUEST: '/verification/requests/:id/reject',

    // Verification Actions
    VERIFY_EV_DATA: '/verification/ev-data/:id',
    VALIDATE_EMISSION: '/verification/emission/:id',
    ISSUE_CREDITS: '/verification/issue-credits',

    // Reports
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

  // Media Service - File Storage (from images table)
  MEDIA: {
    IMAGES: '/media/images',
    IMAGE_DETAIL: '/media/images/:id',
    UPLOAD: '/media/upload',
    DOWNLOAD: '/media/:id',
    DELETE: '/media/:id',
  },
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};

