import apiClient from '../api/client';

const API_BASE = '/audit';

// Type enum constants
export const AUDIT_TYPES = {
  WALLET: 'WALLET',
  CARBON_CREDIT: 'CARBON_CREDIT',
};

// Action enum constants
export const AUDIT_ACTIONS = {
  // 💰 Ví tiền
  DEPOSIT: 'DEPOSIT',        // Nạp tiền vào ví
  WITHDRAW: 'WITHDRAW',      // Rút tiền ra khỏi ví

  // 🌱 Tín chỉ carbon
  CREDIT_TOP_UP: 'CREDIT_TOP_UP',  // Nạp thêm tín chỉ carbon
  CREDIT_TRADE: 'CREDIT_TRADE',    // Bán tín chỉ carbon
  CREDIT_BUY: 'CREDIT_BUY',        // Mua tín chỉ carbon

  // ⚙️ Khác
  ADJUST_MANUAL: 'ADJUST_MANUAL',  // Điều chỉnh thủ công (admin hoặc hệ thống)
};

export const auditService = {
  /**
   * Get all audit records with filtering options
   * @param {Object} params - Query parameters
   * @param {string} params.ownerId - Owner ID to filter by
   * @param {string} params.type - Type enum: WALLET, CARBON_CREDIT
   * @param {string} params.action - Action enum: DEPOSIT, WITHDRAW, CREDIT_TOP_UP, etc.
   * @param {string} params.referenceId - Reference ID to filter by
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.entry - Number of entries per page (default: 10)
   * @param {string} params.field - Field to sort by (default: 'id')
   * @param {string} params.sort - Sort direction: ASC, DESC (default: 'DESC')
   */
  async getAll({
    ownerId,
    type,
    action,
    referenceId,
    page = 0,
    entry = 10,
    field = 'id',
    sort = 'DESC'
  }) {
    const params = new URLSearchParams();

    // Add parameters to query string
    if (ownerId) params.append('ownerId', ownerId);
    if (type) params.append('type', type);
    if (action) params.append('action', action);
    if (referenceId) params.append('referenceId', referenceId);

    // Required parameters
    params.append('page', page.toString());
    params.append('entry', entry.toString());
    params.append('field', field);
    params.append('sort', sort);

    const response = await apiClient.get(`${API_BASE}?${params.toString()}`, {
      headers: {
        'accept': '*/*',
      },
    });

    return response;
  },

  /**
   * Get audit record by ID
   * @param {string} auditId - Audit record ID
   */
  async getById(auditId) {
    const response = await apiClient.get(`${API_BASE}/${auditId}`, {
      headers: {
        'accept': '*/*',
      },
    });

    return response;
  },
};