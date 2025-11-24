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
    PROFILE: '/customer/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // Vehicle Service - EV Trip Data Management
  VEHICLE: {
    // Vehicle Types (vehicle_type table)
    VEHICLE_TYPES: '/vehicle-types', // GET with pagination: ?manufacturer=VinFast&model=VF e34&page=0&entry=10&field=id&sort=DESC
    VEHICLE_TYPE_BY_ID: '/vehicle-types/:id', // GET, PATCH, DELETE
    CREATE_VEHICLE_TYPE: '/vehicle-types', // POST
    CREATE_MULTIPLE_VEHICLE_TYPES: '/vehicle-types/add-all', // POST (array)
    UPDATE_VEHICLE_TYPE: '/vehicle-types/:id', // PATCH (multipart/form-data: manufacturer, model, co2PerKm)
    DELETE_VEHICLE_TYPE: '/vehicle-types/:id', // DELETE

    // Vehicles (vehicle table)
    VEHICLES: '/vehicles', // GET with pagination: ?ownerId=&vin=&vehicleTypeId=&enabled=&page=0&entry=10&field=id&sort=DESC
    VEHICLE_BY_ID: '/vehicles/:id', // GET, DELETE
    CREATE_VEHICLE: '/vehicles', // POST (JSON)
    UPDATE_VEHICLE: '/vehicles/:id', // PATCH (multipart/form-data: status, note)
    DELETE_VEHICLE: '/vehicles/:id', // DELETE

    // Journeys (journey table)
    JOURNEYS: '/journeys', // GET with pagination: ?status=PENDING&vehicleId=&page=0&entry=10&field=id&sort=DESC
    JOURNEY_BY_ID: '/journeys/:id', // GET, PUT, DELETE
    CREATE_JOURNEY: '/journeys', // POST (JSON)
    UPDATE_JOURNEY: '/journeys/:id', // PUT (JSON)
    DELETE_JOURNEY: '/journeys/:id', // DELETE

    // Legacy journey endpoints (keep for compatibility)
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
    // Payment Wallets (wallet table)
    WALLETS: '/wallet', // GET with pagination: ?page=0&entry=10&field=id&sort=DESC
    WALLET_BY_ID: '/wallet/:id', // GET, PATCH
    WALLET_BY_USER_ID: '/wallet/user/:userId', // GET
    UPDATE_WALLET_BALANCE: '/wallet/:id', // PATCH (multipart/form-data: amount, description)

    // Legacy endpoints (keep for compatibility)
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

  // Carbon Credit Service - Carbon Credits Management
  CARBON_CREDIT: {
    // Carbon Credits (carbon_credit table)
    CARBON_CREDITS: '/carbon-credit', // GET with pagination: ?page=0&entry=10&field=id&sort=DESC
    CARBON_CREDIT_BY_ID: '/carbon-credit/:id', // GET, PATCH
    CARBON_CREDIT_BY_USER_ID: '/carbon-credit/user/:userId', // GET
    UPDATE_CARBON_CREDIT: '/carbon-credit/:id', // PATCH (multipart/form-data: totalCredit, tradedCredit, description)
  },

  // Market Service - Listings & Marketplace
  MARKET: {
    // Market Listings (from listing table)
    LISTING: '/listing', // POST (multipart/form-data: sellerId, creditId, pricePerCredit, quantity, type, endTime)
    LISTING_BY_ID: '/listing/:id', // GET, PATCH
    UPDATE_LISTING_STATUS: '/listing/:id?status=ACTIVE', // PATCH

    // Legacy endpoints (keep for compatibility)
    LISTINGS: '/market/listings',
    LISTING_DETAIL: '/market/listings/:id',
    CREATE_LISTING: '/market/listings',
    UPDATE_LISTING: '/market/listings/:id',
    DELETE_LISTING: '/market/listings/:id',
    AI_PRICE_SUGGESTION: '/market/listings/ai-price-suggestion',
    MARKETPLACE: '/market/marketplace',
    SEARCH: '/market/marketplace/search',
    BIDS: '/market/bids',
    BID_DETAIL: '/market/bids/:id',
    PLACE_BID: '/market/listings/:id/bid',
    AUCTION: '/market/auctions/:id',
    AUCTION_STATUS: '/market/auctions/:id/status',
  },

  // Bid Service - Auction Bids
  BID: {
    CREATE_BID: '/bid', // POST (JSON: bidderId, bidderName, listingId, bidAmount)
    BID_BY_ID: '/bid/:id', // GET, DELETE
    DELETE_BID: '/bid/:id', // DELETE
  },

  // Transaction Service - Transaction Management
  TRANSACTION: {
    // Transactions (from transaction table)
    TRANSACTIONS: '/transactions', // GET with pagination
    CREATE_TRANSACTION: '/transactions', // POST (multipart/form-data: listingId, buyerId, sellerId, amount, credit, listingType)
    TRANSACTION_BY_ID: '/transactions/:id', // GET, PATCH
    UPDATE_TRANSACTION_STATUS: '/transactions/:id?status=PENDING_PAYMENT', // PATCH
    PAY_TRANSACTION: '/transactions/:id/pay?paymentMethod=WALLET', // POST

    // Legacy endpoints (keep for compatibility)
    EV_OWNER_TRANSACTIONS: '/transactions/ev-owner',
    TRANSACTION_DETAIL: '/transactions/:id',
    CANCEL_TRANSACTION: '/transactions/:id/cancel',
    COMPLETE_TRANSACTION: '/transactions/:id/complete',
    BUYER_TRANSACTIONS: '/transactions/buyer',
    PURCHASE: '/transactions/purchase',
    PAYMENT: '/transactions/:id/payment',
    PAYMENT_METHODS: '/transactions/payment-methods',
  },

  // Verification Service (CVA) - Carbon Verification & Audit
  VERIFICATION: {
    // Verify Requests (from verify_request table)
    VERIFICATION_REQUESTS: '/verify-requests', // GET with pagination: ?userId=&type=VEHICLE&status=PENDING&referenceId=&title=&description=&page=0&entry=10&field=id&sort=DESC
    REQUEST_DETAIL: '/verify-requests/:id', // GET, PATCH
    UPDATE_REQUEST: '/verify-requests/:id', // PATCH (multipart/form-data: status, note)

    // Legacy endpoints (keep for compatibility)
    CREATE_VERIFY_REQUEST: '/verification/requests',
    APPROVE_REQUEST: '/verification/requests/:id/approve',
    REJECT_REQUEST: '/verification/requests/:id/reject',
    VERIFY_EV_DATA: '/verification/ev-data/:id',
    VALIDATE_EMISSION: '/verification/emission/:id',
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

  // Media Service - File Storage (from images table)
  MEDIA: {
    UPLOAD_IMAGE: '/media', // POST (multipart/form-data: image)
    GET_IMAGE: '/media/get/:id', // GET

    // Legacy endpoints (keep for compatibility)
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

