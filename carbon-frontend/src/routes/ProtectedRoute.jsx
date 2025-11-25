import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { hasAnyRole } from '../utils/roleHelpers';

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and role authorization
 * 
 * Supports multiple roles per user (e.g., user can be both EV_OWNER and BUYER)
 * Uses roleHelpers to parse roles from backend (string or array format)
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Use useContext directly instead of useAuth hook to avoid throwing error
  // if context is not available yet (during router initialization)
  const authContext = useContext(AuthContext);

  // If context is not available yet, show loading
  if (!authContext) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const { isAuthenticated, user, loading } = authContext;

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Check role authorization if roles specified
  if (allowedRoles.length > 0) {
    // Use roleHelpers to support multiple roles
    const hasAccess = hasAnyRole(user, allowedRoles);

    console.log('ProtectedRoute - Role Check:', {
      user,
      userRole: user?.role,
      userRoles: user?.roles,
      allowedRoles,
      hasAccess
    });

    if (!hasAccess) {
      console.log('Access denied - redirecting to /unauthorized');
      // Redirect to unauthorized page or home
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

