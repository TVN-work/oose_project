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
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          setIsAuthenticated(true);
        } catch (error) {
          // For development: create mock user if API fails
          console.warn('Auth API not available, using mock user for development');
          const mockUser = {
            id: '1',
            name: 'EV Owner',
            email: 'evowner@example.com',
            role: 'EV_OWNER',
          };
          setUser(mockUser);
          setIsAuthenticated(true);
        }
      } else {
        // For development: auto-login with mock user (disable in production)
        // Set VITE_DEV_MODE=false in .env to disable mock user
        const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true' || (import.meta.env.DEV && import.meta.env.VITE_DEV_MODE !== 'false');
        if (DEV_MODE) {
          const mockUser = {
            id: '1',
            name: 'EV Owner',
            email: 'evowner@example.com',
            role: 'EV_OWNER',
          };
          setUser(mockUser);
          setIsAuthenticated(true);
          // Set a mock token for consistency
          localStorage.setItem('authToken', 'dev-mock-token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('authToken', response.token);
    setUser(response.user);
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

