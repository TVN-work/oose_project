import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

// Create axios instance
// All requests go through API Gateway (Spring Cloud Gateway)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add JWT token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request ID for tracing (optional)
    config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Extract data from standard response format
    // Backend returns: { success: true, data: {...}, message: "...", timestamp: "..." }
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  async (error) => {
    // Handle network errors (backend not available)
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED' || error.message?.includes('Network Error')) {
      // In development, silently handle network errors
      if (import.meta.env.DEV) {
        // Only log warning for non-auth endpoints to avoid noise
        if (!error.config?.url?.includes('/auth/')) {
          console.warn('API endpoint not available:', error.config?.url);
        }
        // Return a rejected promise but don't show error in console
        return Promise.reject(error);
      }
      // In production, show user-friendly error
      return Promise.reject({
        message: 'Không thể kết nối đến server. Vui lòng thử lại sau.',
        code: 'NETWORK_ERROR',
      });
    }
    
    // Handle HTTP errors
    const status = error.response?.status;
    const errorData = error.response?.data;
    
    // Handle 401 Unauthorized - Token expired or invalid
    if (status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Try to refresh token if available
      if (refreshToken && error.config && !error.config._retry) {
        error.config._retry = true;
        try {
          const response = await axios.post(`${API_BASE_URL}/users/auth/refresh`, {
            refreshToken,
          });
          const { token } = response.data.data || response.data;
          localStorage.setItem('authToken', token);
          error.config.headers.Authorization = `Bearer ${token}`;
          return apiClient(error.config);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject({
            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            code: 'UNAUTHORIZED',
          });
        }
      } else {
        // No refresh token or refresh failed
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject({
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          code: 'UNAUTHORIZED',
        });
      }
    }
    
    // Handle 403 Forbidden
    if (status === 403) {
      return Promise.reject({
        message: errorData?.error?.message || 'Bạn không có quyền thực hiện thao tác này.',
        code: 'FORBIDDEN',
        details: errorData?.error?.details,
      });
    }
    
    // Handle 404 Not Found
    if (status === 404) {
      return Promise.reject({
        message: errorData?.error?.message || 'Không tìm thấy dữ liệu.',
        code: 'NOT_FOUND',
      });
    }
    
    // Handle 409 Conflict
    if (status === 409) {
      return Promise.reject({
        message: errorData?.error?.message || 'Dữ liệu đã bị thay đổi. Vui lòng làm mới trang.',
        code: 'CONFLICT',
        details: errorData?.error?.details,
      });
    }
    
    // Handle 422 Unprocessable Entity (Validation errors)
    if (status === 422) {
      return Promise.reject({
        message: errorData?.error?.message || 'Dữ liệu không hợp lệ.',
        code: 'VALIDATION_ERROR',
        details: errorData?.error?.details,
      });
    }
    
    // Handle 429 Too Many Requests (Rate limiting)
    if (status === 429) {
      const retryAfter = error.response?.headers['retry-after'] || 60;
      return Promise.reject({
        message: `Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ${retryAfter} giây.`,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: parseInt(retryAfter),
      });
    }
    
    // Handle 500+ Server errors
    if (status >= 500) {
      return Promise.reject({
        message: errorData?.error?.message || 'Lỗi server. Vui lòng thử lại sau.',
        code: 'SERVER_ERROR',
        status,
      });
    }
    
    // Handle other errors
    return Promise.reject({
      message: errorData?.error?.message || error.message || 'Đã xảy ra lỗi.',
      code: errorData?.error?.code || 'UNKNOWN_ERROR',
      status,
      details: errorData?.error?.details,
    });
  }
);

export default apiClient;

