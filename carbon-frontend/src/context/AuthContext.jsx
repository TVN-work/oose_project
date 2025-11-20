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
      
      // In dev mode, skip API call if backend is not available
      if (DEV_MODE && (!token || token === 'dev-mock-token')) {
        // Use mock user based on current route
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
          role: mockRole,
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', 'dev-mock-token');
        setLoading(false);
        return;
      }
      
      if (token && token !== 'dev-mock-token') {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          setIsAuthenticated(true);
        } catch (error) {
          // For development: create mock user if API fails
          if (DEV_MODE) {
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
              role: mockRole,
            };
            setUser(mockUser);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', 'dev-mock-token');
          } else {
            // In production, clear invalid token
            localStorage.removeItem('authToken');
          }
        }
      } else {
        // No token - user needs to login
        setLoading(false);
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

