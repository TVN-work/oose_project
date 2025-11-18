import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { USER_ROLES } from '../constants/roles';

// Layout components (to be created)
// import MainLayout from '../components/layout/MainLayout';
// import AuthLayout from '../components/layout/AuthLayout';

// Pages
import HomePage from '../pages/HomePage';
// import LoginPage from '../pages/LoginPage';
// import RegisterPage from '../pages/RegisterPage';
// import DashboardPage from '../pages/DashboardPage';

// EV Owner pages
// import EVOwnerDashboard from '../features/ev-owner/pages/Dashboard';
// import CarbonWallet from '../features/ev-owner/pages/CarbonWallet';
// import ListingsManagement from '../features/ev-owner/pages/ListingsManagement';
// import TransactionHistory from '../features/ev-owner/pages/TransactionHistory';
// import Reports from '../features/ev-owner/pages/Reports';
// import UploadTrips from '../features/ev-owner/pages/UploadTrips';

// Buyer pages
// import BuyerDashboard from '../features/buyer/pages/Dashboard';
// import Marketplace from '../features/buyer/pages/Marketplace';
// import PurchaseHistory from '../features/buyer/pages/PurchaseHistory';
// import Certificates from '../features/buyer/pages/Certificates';

// Verifier pages
// import VerifierDashboard from '../features/verifier/pages/Dashboard';
// import VerificationRequests from '../features/verifier/pages/VerificationRequests';

// Admin pages
// import AdminDashboard from '../features/admin/pages/Dashboard';
// import UserManagement from '../features/admin/pages/UserManagement';
// import TransactionManagement from '../features/admin/pages/TransactionManagement';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <div>Login Page - To be implemented</div>,
  },
  {
    path: '/register',
    element: <div>Register Page - To be implemented</div>,
  },
  // EV Owner routes
  {
    path: '/ev-owner',
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.EV_OWNER]}>
        <div>EV Owner Dashboard - To be implemented</div>
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <div>EV Owner Dashboard</div>,
      },
      {
        path: 'carbon-wallet',
        element: <div>Carbon Wallet</div>,
      },
      {
        path: 'listings',
        element: <div>Listings Management</div>,
      },
      {
        path: 'transactions',
        element: <div>Transaction History</div>,
      },
      {
        path: 'reports',
        element: <div>Reports</div>,
      },
      {
        path: 'upload-trips',
        element: <div>Upload Trips</div>,
      },
    ],
  },
  // Buyer routes
  {
    path: '/buyer',
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.BUYER]}>
        <div>Buyer Dashboard - To be implemented</div>
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <div>Buyer Dashboard</div>,
      },
      {
        path: 'marketplace',
        element: <div>Marketplace</div>,
      },
      {
        path: 'purchase-history',
        element: <div>Purchase History</div>,
      },
      {
        path: 'certificates',
        element: <div>Certificates</div>,
      },
    ],
  },
  // Verifier routes
  {
    path: '/verifier',
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.VERIFIER]}>
        <div>Verifier Dashboard - To be implemented</div>
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <div>Verifier Dashboard</div>,
      },
      {
        path: 'verification-requests',
        element: <div>Verification Requests</div>,
      },
      {
        path: 'reports',
        element: <div>Verifier Reports</div>,
      },
    ],
  },
  // Admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <div>Admin Dashboard - To be implemented</div>
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <div>Admin Dashboard</div>,
      },
      {
        path: 'users',
        element: <div>User Management</div>,
      },
      {
        path: 'transactions',
        element: <div>Transaction Management</div>,
      },
      {
        path: 'wallets',
        element: <div>Wallet Management</div>,
      },
      {
        path: 'reports',
        element: <div>Admin Reports</div>,
      },
    ],
  },
]);

export default router;

