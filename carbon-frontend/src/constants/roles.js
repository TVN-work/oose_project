// User Roles
export const USER_ROLES = {
  EV_OWNER: 'EV_OWNER',
  BUYER: 'BUYER',
  VERIFIER: 'VERIFIER',
  ADMIN: 'ADMIN',
};

export const ROLE_LABELS = {
  [USER_ROLES.EV_OWNER]: 'Chủ sở hữu xe điện',
  [USER_ROLES.BUYER]: 'Người mua tín chỉ',
  [USER_ROLES.VERIFIER]: 'Tổ chức kiểm toán',
  [USER_ROLES.ADMIN]: 'Quản trị viên',
};

export default USER_ROLES;

