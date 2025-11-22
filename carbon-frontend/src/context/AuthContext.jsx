import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true' || (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE !== 'false');
      
      // If no token, user needs to login
      if (!token) {
        setLoading(false);
        return;
      }
      
      // In dev mode with mock token, try to get user from database first
      if (DEV_MODE && token === 'dev-mock-token') {
        try {
          // Try to get user profile from auth service (which will check database)
          const profile = await authService.getProfile();
          if (profile) {
            // Map database fields to frontend format
            const mappedUser = {
              ...profile,
              name: profile.full_name || profile.name || 'User',
              phone: profile.phone_number || profile.phone,
              roles: profile.roles || profile.role,
            };
            setUser(mappedUser);
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn('Failed to get user profile, using fallback:', error);
        }
        
        // Fallback: create mock user based on route if profile fetch fails
        const path = window.location.pathname;
        let mockRole = 'EV_OWNER';
        let mockName = 'EV Owner';
        
        if (path.includes('/buyer')) {
          mockRole = 'BUYER';
          mockName = 'Carbon Buyer';
        } else if (path.includes('/verifier')) {
          mockRole = 'VERIFIER';
          mockName = 'Verifier';
        } else if (path.includes('/admin')) {
          mockRole = 'ADMIN';
          mockName = 'Admin';
        }
        
        const mockUser = {
          id: '1',
          name: mockName,
          email: `${mockRole.toLowerCase().replace('_', '')}@example.com`,
          roles: mockRole, // Use 'roles' (plural) to match roleHelpers expectations
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }
      
      // Try to fetch user profile with real token
      if (token && token !== 'dev-mock-token') {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          // Clear invalid token
            localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    // Store JWT token and refresh token
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    // Store token expiration if provided
    if (response.expiresIn) {
      const expiresAt = Date.now() + response.expiresIn * 1000;
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());
    }
    setUser(response.user || response.data?.user);
    setIsAuthenticated(true);
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('mockUserEmail'); // Clear stored email
      localStorage.removeItem('mockCurrentPassword'); // Clear stored password
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;

