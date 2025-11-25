// User Roles
export const USER_ROLES = {
  EV_OWNER: 'EV_OWNER',
  BUYER: 'BUYER',
  CC_BUYER: 'CC_BUYER', // Add this for API compatibility
  VERIFIER: 'VERIFIER',
  CVA: 'CVA', // Add this for API compatibility  
  ADMIN: 'ADMIN',
};

export const ROLE_LABELS = {
  [USER_ROLES.EV_OWNER]: 'Chủ sở hữu xe điện',
  [USER_ROLES.BUYER]: 'Người mua tín chỉ',
  [USER_ROLES.CC_BUYER]: 'Người mua tín chỉ', // Same label as BUYER
  [USER_ROLES.VERIFIER]: 'Tổ chức kiểm toán',
  [USER_ROLES.CVA]: 'Tổ chức kiểm toán', // Same label as VERIFIER
  [USER_ROLES.ADMIN]: 'Quản trị viên',
};

export default USER_ROLES;

