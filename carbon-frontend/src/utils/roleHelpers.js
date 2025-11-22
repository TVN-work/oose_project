/**
 * Role Helper Utilities
 * 
 * Handles user role parsing and checking.
 * Supports both single role and multiple roles formats from backend.
 */

import { USER_ROLES } from '../constants/roles';

/**
 * Parse roles from backend
 * Backend may return roles as:
 * - String (single): "EV_OWNER"
 * - String (multiple): "EV_OWNER,BUYER"
 * - Array: ["EV_OWNER", "BUYER"]
 * 
 * @param {string|array} roles - Roles from API response
 * @returns {array} - Array of role strings
 */
export const parseRoles = (roles) => {
  // Handle null/undefined
  if (!roles) return [];
  
  // Already an array
  if (Array.isArray(roles)) return roles;
  
  // String - may be comma-separated
  if (typeof roles === 'string') {
    return roles.split(',').map(r => r.trim()).filter(Boolean);
  }
  
  // Unknown format
  console.warn('Unknown roles format:', roles);
  return [];
};

/**
 * Check if user has a specific role
 * 
 * @param {Object} user - User object with roles property
 * @param {string} role - Role to check (from USER_ROLES constant)
 * @returns {boolean}
 * 
 * @example
 * hasRole(user, USER_ROLES.EV_OWNER) // true/false
 */
export const hasRole = (user, role) => {
  if (!user || !user.roles) return false;
  
  const userRoles = parseRoles(user.roles);
  return userRoles.includes(role);
};

/**
 * Check if user has ANY of the specified roles
 * Useful for components that can be accessed by multiple roles
 * 
 * @param {Object} user - User object with roles property
 * @param {array} roles - Array of roles to check
 * @returns {boolean}
 * 
 * @example
 * hasAnyRole(user, [USER_ROLES.EV_OWNER, USER_ROLES.BUYER]) // true if user has either
 */
export const hasAnyRole = (user, roles) => {
  if (!user || !user.roles) return false;
  if (!Array.isArray(roles)) return false;
  
  const userRoles = parseRoles(user.roles);
  return roles.some(role => userRoles.includes(role));
};

/**
 * Check if user has ALL of the specified roles
 * Useful for features that require multiple roles
 * 
 * @param {Object} user - User object with roles property
 * @param {array} roles - Array of roles to check
 * @returns {boolean}
 * 
 * @example
 * hasAllRoles(user, [USER_ROLES.EV_OWNER, USER_ROLES.BUYER]) // true only if user has both
 */
export const hasAllRoles = (user, roles) => {
  if (!user || !user.roles) return false;
  if (!Array.isArray(roles)) return false;
  
  const userRoles = parseRoles(user.roles);
  return roles.every(role => userRoles.includes(role));
};

/**
 * Get user's primary role (first role in the list)
 * Useful for routing and default dashboard
 * 
 * @param {Object} user - User object with roles property
 * @returns {string|null} - Primary role or null
 */
export const getPrimaryRole = (user) => {
  if (!user || !user.roles) return null;
  
  const userRoles = parseRoles(user.roles);
  return userRoles[0] || null;
};

/**
 * Get all user roles as array
 * 
 * @param {Object} user - User object with roles property
 * @returns {array} - Array of roles
 */
export const getUserRoles = (user) => {
  if (!user || !user.roles) return [];
  return parseRoles(user.roles);
};

/**
 * Check if role is valid (exists in USER_ROLES constant)
 * 
 * @param {string} role - Role to validate
 * @returns {boolean}
 */
export const isValidRole = (role) => {
  return Object.values(USER_ROLES).includes(role);
};

/**
 * Get default route for user based on their primary role
 * 
 * @param {Object} user - User object with roles property
 * @returns {string} - Default route path
 */
export const getDefaultRoute = (user) => {
  const primaryRole = getPrimaryRole(user);
  
  switch (primaryRole) {
    case USER_ROLES.EV_OWNER:
      return '/ev-owner/dashboard';
    case USER_ROLES.BUYER:
      return '/buyer/dashboard';
    case USER_ROLES.VERIFIER:
      return '/verifier/dashboard';
    case USER_ROLES.ADMIN:
      return '/admin/dashboard';
    default:
      return '/';
  }
};

/**
 * Format roles for display
 * 
 * @param {string|array} roles - Roles to format
 * @param {Object} roleLabels - Optional custom labels (defaults to ROLE_LABELS from constants)
 * @returns {string} - Formatted role string
 * 
 * @example
 * formatRoles("EV_OWNER,BUYER") // "Chủ sở hữu xe điện, Người mua tín chỉ"
 */
export const formatRoles = (roles, roleLabels) => {
  const userRoles = parseRoles(roles);
  
  // Import ROLE_LABELS dynamically to avoid circular dependency
  const labels = roleLabels || {
    [USER_ROLES.EV_OWNER]: 'Chủ sở hữu xe điện',
    [USER_ROLES.BUYER]: 'Người mua tín chỉ',
    [USER_ROLES.VERIFIER]: 'Tổ chức kiểm toán',
    [USER_ROLES.ADMIN]: 'Quản trị viên',
  };
  
  return userRoles
    .map(role => labels[role] || role)
    .join(', ');
};

export default {
  parseRoles,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  getPrimaryRole,
  getUserRoles,
  isValidRole,
  getDefaultRoute,
  formatRoles,
};

