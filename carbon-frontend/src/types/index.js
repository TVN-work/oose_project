// TypeScript types (if using TypeScript)
// Hoặc JSDoc types cho JavaScript

// Re-export all entity types from entities.js
export * from './entities';

// Legacy types for backward compatibility
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} role
 */

/**
 * @typedef {Object} CarbonCredit
 * @property {string} id
 * @property {number} amount
 * @property {number} price
 * @property {string} status
 */

export default {};

