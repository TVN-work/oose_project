import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { USER_ROLES } from '../constants/roles';

// Layout components (to be created)
// import MainLayout from '../components/layout/MainLayout';
// import AuthLayout from '../components/layout/AuthLayout';

// Pages
import HomePage from '../pages/HomePage';
import NotFound from '../pages/NotFound';
// import LoginPage from '../pages/LoginPage';
// import RegisterPage from '../pages/RegisterPage';

// Layout
import EVOwnerLayout from '../components/layout/EVOwnerLayout';
import BuyerLayout from '../components/layout/BuyerLayout';

// EV Owner pages
import EVOwnerDashboard from '../features/ev-owner/pages/Dashboard';
import CarbonWallet from '../features/ev-owner/pages/CarbonWallet';
import ListingsManagement from '../features/ev-owner/pages/ListingsManagement';
import TransactionHistory from '../features/ev-owner/pages/TransactionHistory';
import Reports from '../features/ev-owner/pages/Reports';
import UploadTrips from '../features/ev-owner/pages/UploadTrips';
import Settings from '../features/ev-owner/pages/Settings';

// Buyer pages
import BuyerDashboard from '../features/buyer/pages/Dashboard';
import Marketplace from '../features/buyer/pages/Marketplace';
import ListingDetail from '../features/buyer/pages/ListingDetail';
import PurchaseHistory from '../features/buyer/pages/PurchaseHistory';
import Certificates from '../features/buyer/pages/Certificates';
import BuyerSettings from '../features/buyer/pages/Settings';
import Checkout from '../features/buyer/pages/Checkout';
import AuctionPage from '../features/buyer/pages/AuctionPage';

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
        <EVOwnerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <EVOwnerDashboard />,
      },
      {
        path: 'dashboard',
        element: <EVOwnerDashboard />,
      },
      {
        path: 'carbon-wallet',
        element: <CarbonWallet />,
      },
      {
        path: 'listings',
        element: <ListingsManagement />,
      },
      {
        path: 'transactions',
        element: <TransactionHistory />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'upload-trips',
        element: <UploadTrips />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  // Buyer routes
  {
    path: '/buyer',
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.BUYER]}>
        <BuyerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <BuyerDashboard />,
      },
      {
        path: 'dashboard',
        element: <BuyerDashboard />,
      },
      {
        path: 'marketplace',
        element: <Marketplace />,
      },
      {
        path: 'marketplace/:id',
        element: <ListingDetail />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'auction/:id',
        element: <AuctionPage />,
      },
      {
        path: 'purchase-history',
        element: <PurchaseHistory />,
      },
      {
        path: 'certificates',
        element: <Certificates />,
      },
      {
        path: 'settings',
        element: <BuyerSettings />,
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
  // 404 Route - must be last
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;

