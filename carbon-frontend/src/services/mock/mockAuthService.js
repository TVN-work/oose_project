import { mockUsers, delay } from './mockData';

export const mockAuthService = {
  login: async (credentials) => {
    await delay(800);
    
    // Simulate login
    const { email, password } = credentials;
    
    // Find user by email or default to EV_OWNER
    let user = mockUsers.EV_OWNER;
    if (email.includes('buyer')) user = mockUsers.BUYER;
    if (email.includes('verifier')) user = mockUsers.VERIFIER;
    if (email.includes('admin')) user = mockUsers.ADMIN;
    
    return {
      token: `mock-token-${user.id}-${Date.now()}`,
      user,
    };
  },

  register: async (userData) => {
    await delay(1000);
    
    return {
      token: `mock-token-new-${Date.now()}`,
      user: {
        id: String(Date.now()),
        ...userData,
        role: userData.role || 'EV_OWNER',
      },
    };
  },

  logout: async () => {
    await delay(300);
    return { success: true };
  },

  getProfile: async () => {
    await delay(500);
    
    // Get role from token or default
    const token = localStorage.getItem('authToken');
    let role = 'EV_OWNER';
    
    if (token) {
      if (token.includes('buyer') || window.location.pathname.includes('/buyer')) {
        role = 'BUYER';
      } else if (token.includes('verifier') || window.location.pathname.includes('/verifier')) {
        role = 'VERIFIER';
      } else if (token.includes('admin') || window.location.pathname.includes('/admin')) {
        role = 'ADMIN';
      }
    }
    
    return mockUsers[role] || mockUsers.EV_OWNER;
  },

  refreshToken: async () => {
    await delay(300);
    return {
      token: `mock-refresh-token-${Date.now()}`,
    };
  },
};

export default mockAuthService;

