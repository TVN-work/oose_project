/**
 * Application Constants
 * Status enums and constants based on database schema
 */

// ==========================================
// Transaction Status
// ==========================================
export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  PAYMENT_PROCESSING: 'PAYMENT_PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED',
};

export const TRANSACTION_STATUS_LABELS = {
  [TRANSACTION_STATUS.PENDING]: 'Chờ thanh toán',
  [TRANSACTION_STATUS.PAYMENT_PROCESSING]: 'Đang xử lý',
  [TRANSACTION_STATUS.COMPLETED]: 'Hoàn tất',
  [TRANSACTION_STATUS.CANCELLED]: 'Đã hủy',
  [TRANSACTION_STATUS.FAILED]: 'Thất bại',
};

export const TRANSACTION_STATUS_COLORS = {
  [TRANSACTION_STATUS.PENDING]: 'warning',
  [TRANSACTION_STATUS.PAYMENT_PROCESSING]: 'info',
  [TRANSACTION_STATUS.COMPLETED]: 'success',
  [TRANSACTION_STATUS.CANCELLED]: 'default',
  [TRANSACTION_STATUS.FAILED]: 'error',
};

// ==========================================
// Market Listing Status
// ==========================================
export const LISTING_STATUS = {
  ACTIVE: 'ACTIVE',
  SOLD: 'SOLD',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  PENDING: 'PENDING',
};

export const LISTING_STATUS_LABELS = {
  [LISTING_STATUS.ACTIVE]: 'Đang bán',
  [LISTING_STATUS.SOLD]: 'Đã bán',
  [LISTING_STATUS.CANCELLED]: 'Đã hủy',
  [LISTING_STATUS.EXPIRED]: 'Hết hạn',
  [LISTING_STATUS.PENDING]: 'Chờ duyệt',
};

export const LISTING_STATUS_COLORS = {
  [LISTING_STATUS.ACTIVE]: 'success',
  [LISTING_STATUS.SOLD]: 'default',
  [LISTING_STATUS.CANCELLED]: 'error',
  [LISTING_STATUS.EXPIRED]: 'warning',
  [LISTING_STATUS.PENDING]: 'info',
};

// ==========================================
// Listing Type
// ==========================================
export const LISTING_TYPE = {
  FIXED_PRICE: 'FIXED_PRICE',
  AUCTION: 'AUCTION',
};

export const LISTING_TYPE_LABELS = {
  [LISTING_TYPE.FIXED_PRICE]: 'Giá cố định',
  [LISTING_TYPE.AUCTION]: 'Đấu giá',
};

// ==========================================
// Verification Request Status
// ==========================================
export const VERIFY_REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  IN_REVIEW: 'IN_REVIEW',
};

export const VERIFY_REQUEST_STATUS_LABELS = {
  [VERIFY_REQUEST_STATUS.PENDING]: 'Chờ xác minh',
  [VERIFY_REQUEST_STATUS.APPROVED]: 'Đã duyệt',
  [VERIFY_REQUEST_STATUS.REJECTED]: 'Đã từ chối',
  [VERIFY_REQUEST_STATUS.IN_REVIEW]: 'Đang xem xét',
};

export const VERIFY_REQUEST_STATUS_COLORS = {
  [VERIFY_REQUEST_STATUS.PENDING]: 'warning',
  [VERIFY_REQUEST_STATUS.APPROVED]: 'success',
  [VERIFY_REQUEST_STATUS.REJECTED]: 'error',
  [VERIFY_REQUEST_STATUS.IN_REVIEW]: 'info',
};

// ==========================================
// Verification Request Type
// ==========================================
export const VERIFY_REQUEST_TYPE = {
  VEHICLE: 'VEHICLE',
  JOURNEY: 'JOURNEY',
  CREDIT: 'CREDIT',
  DOCUMENT: 'DOCUMENT',
};

export const VERIFY_REQUEST_TYPE_LABELS = {
  [VERIFY_REQUEST_TYPE.VEHICLE]: 'Xác minh xe',
  [VERIFY_REQUEST_TYPE.JOURNEY]: 'Xác minh hành trình',
  [VERIFY_REQUEST_TYPE.CREDIT]: 'Xác minh tín chỉ',
  [VERIFY_REQUEST_TYPE.DOCUMENT]: 'Xác minh tài liệu',
};

// ==========================================
// Journey History Status
// ==========================================
export const JOURNEY_HISTORY_STATUS = {
  PENDING_VERIFICATION: 0,
  VERIFIED: 1,
  REJECTED: -1,
};

export const JOURNEY_HISTORY_STATUS_LABELS = {
  [JOURNEY_HISTORY_STATUS.PENDING_VERIFICATION]: 'Chờ xác minh',
  [JOURNEY_HISTORY_STATUS.VERIFIED]: 'Đã xác minh',
  [JOURNEY_HISTORY_STATUS.REJECTED]: 'Đã từ chối',
};

export const JOURNEY_HISTORY_STATUS_COLORS = {
  [JOURNEY_HISTORY_STATUS.PENDING_VERIFICATION]: 'warning',
  [JOURNEY_HISTORY_STATUS.VERIFIED]: 'success',
  [JOURNEY_HISTORY_STATUS.REJECTED]: 'error',
};

// ==========================================
// Journey Status
// ==========================================
export const JOURNEY_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
};

export const JOURNEY_STATUS_LABELS = {
  [JOURNEY_STATUS.ACTIVE]: 'Đang hoạt động',
  [JOURNEY_STATUS.COMPLETED]: 'Hoàn thành',
  [JOURNEY_STATUS.ARCHIVED]: 'Đã lưu trữ',
};

// ==========================================
// Audit Type
// ==========================================
export const AUDIT_TYPE = {
  CREDIT_PURCHASE: 'CREDIT_PURCHASE',
  CREDIT_SALE: 'CREDIT_SALE',
  CREDIT_ISSUED: 'CREDIT_ISSUED',
  WALLET_DEPOSIT: 'WALLET_DEPOSIT',
  WALLET_WITHDRAWAL: 'WALLET_WITHDRAWAL',
  REFUND: 'REFUND',
  FEE: 'FEE',
};

export const AUDIT_TYPE_LABELS = {
  [AUDIT_TYPE.CREDIT_PURCHASE]: 'Mua tín chỉ',
  [AUDIT_TYPE.CREDIT_SALE]: 'Bán tín chỉ',
  [AUDIT_TYPE.CREDIT_ISSUED]: 'Phát hành tín chỉ',
  [AUDIT_TYPE.WALLET_DEPOSIT]: 'Nạp tiền',
  [AUDIT_TYPE.WALLET_WITHDRAWAL]: 'Rút tiền',
  [AUDIT_TYPE.REFUND]: 'Hoàn tiền',
  [AUDIT_TYPE.FEE]: 'Phí giao dịch',
};

// ==========================================
// Audit Action
// ==========================================
export const AUDIT_ACTION = {
  CREDIT: 'CREDIT',  // Thêm vào
  DEBIT: 'DEBIT',   // Trừ đi
};

export const AUDIT_ACTION_LABELS = {
  [AUDIT_ACTION.CREDIT]: 'Cộng',
  [AUDIT_ACTION.DEBIT]: 'Trừ',
};

// ==========================================
// Payment Method
// ==========================================
export const PAYMENT_METHOD = {
  WALLET: 'WALLET',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CREDIT_CARD: 'CREDIT_CARD',
  MOMO: 'MOMO',
  VNPAY: 'VNPAY',
  ZALOPAY: 'ZALOPAY',
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHOD.WALLET]: 'Ví điện tử',
  [PAYMENT_METHOD.BANK_TRANSFER]: 'Chuyển khoản ngân hàng',
  [PAYMENT_METHOD.CREDIT_CARD]: 'Thẻ tín dụng',
  [PAYMENT_METHOD.MOMO]: 'MoMo',
  [PAYMENT_METHOD.VNPAY]: 'VNPay',
  [PAYMENT_METHOD.ZALOPAY]: 'ZaloPay',
};

// ==========================================
// File Types
// ==========================================
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword'];
export const ALLOWED_DATA_TYPES = ['text/csv', 'application/json', 'application/vnd.ms-excel'];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ==========================================
// Bid Sort Fields
// ==========================================
export const BID_SORT = {
  AMOUNT: 'amount',
  CREATED_AT: 'createdAt',
  BIDDER_NAME: 'bidderName',
};

// Sort Direction (Spring Boot format)
export const SORT_DIRECTION = {
  ASC: 'ASC',
  DESC: 'DESC',
};

// Legacy support
export const BID_ORDER = SORT_DIRECTION;

// ==========================================
// Pagination
// ==========================================
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ==========================================
// Date Formats
// ==========================================
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// ==========================================
// API
// ==========================================
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000; // 1 second

// ==========================================
// Export all
// ==========================================
export default {
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_COLORS,
  LISTING_STATUS,
  LISTING_STATUS_LABELS,
  LISTING_STATUS_COLORS,
  LISTING_TYPE,
  LISTING_TYPE_LABELS,
  VERIFY_REQUEST_STATUS,
  VERIFY_REQUEST_STATUS_LABELS,
  VERIFY_REQUEST_STATUS_COLORS,
  VERIFY_REQUEST_TYPE,
  VERIFY_REQUEST_TYPE_LABELS,
  JOURNEY_HISTORY_STATUS,
  JOURNEY_HISTORY_STATUS_LABELS,
  JOURNEY_HISTORY_STATUS_COLORS,
  JOURNEY_STATUS,
  JOURNEY_STATUS_LABELS,
  AUDIT_TYPE,
  AUDIT_TYPE_LABELS,
  AUDIT_ACTION,
  AUDIT_ACTION_LABELS,
  PAYMENT_METHOD,
  PAYMENT_METHOD_LABELS,
  BID_SORT,
  BID_ORDER,
  SORT_DIRECTION,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  ALLOWED_DATA_TYPES,
  MAX_FILE_SIZE,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  API_TIMEOUT,
  API_RETRY_ATTEMPTS,
  API_RETRY_DELAY,
};

