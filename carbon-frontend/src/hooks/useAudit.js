import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auditService } from '../services/audit/auditService';

/**
 * Hook for fetching all audit records with filtering
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
export const useAudit = (params = {}) => {
  const { ownerId, type, action, referenceId, page = 0, entry = 10, field = 'id', sort = 'DESC' } = params;

  return useQuery({
    queryKey: ['audit', 'all', { ownerId, type, action, referenceId, page, entry, field, sort }],
    queryFn: () => auditService.getAll({ ownerId, type, action, referenceId, page, entry, field, sort }),
    enabled: !!ownerId, // Only run if ownerId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for fetching all audit records (alias for useAudit for backward compatibility)
 */
export const useAllAudits = (params = {}) => {
  return useAudit(params);
};

/**
 * Hook for fetching audit by ID
 * @param {string} auditId - Audit record ID
 */
export const useAuditById = (auditId) => {
  return useQuery({
    queryKey: ['audit', auditId],
    queryFn: () => auditService.getById(auditId),
    enabled: !!auditId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export default {
  useAudit,
  useAllAudits,
  useAuditById,
};