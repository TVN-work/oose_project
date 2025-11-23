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

      // If no token, user needs to login
      if (!token) {
        setLoading(false);
        return;
      }

      // Try to fetch user profile with token
      try {
        const profile = await authService.getProfile();
        // Map backend fields to frontend format
        const mappedUser = {
          ...profile,
          name: profile.fullName || profile.name || 'User',
          phone: profile.phoneNumber || profile.phone,
          roles: profile.role || profile.roles,
        };
        setUser(mappedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Clear invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);

    // Response format: { id, token, refreshToken, username, role }
    const data = response.data || response;

    // Store tokens
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    // Store user info
    if (data.id) {
      localStorage.setItem('userId', data.id);
    }
    if (data.username) {
      localStorage.setItem('username', data.username);
    }
    if (data.role) {
      localStorage.setItem('userRole', data.role);
    }

    // Create user object for state
    const mappedUser = {
      id: data.id,
      email: data.username,
      name: data.username,
      roles: data.role,
      role: data.role,
    };

    setUser(mappedUser);
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
      localStorage.removeItem('tokenExpiresAt');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
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

