import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { USER_ROLES } from '../constants/roles';

// Layout components (to be created)
// import MainLayout from '../components/layout/MainLayout';
// import AuthLayout from '../components/layout/AuthLayout';

// Pages
import HomePage from '../pages/HomePage';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
import AboutUs from '../pages/AboutUs';
import Auth from '../pages/Auth';
import AdminAuth from '../pages/Auth/AdminAuth';
import Blog from '../pages/Blog';
import Contact from '../pages/Contact';
import FAQs from '../pages/FAQs';
import HowItWorks from '../pages/HowItWorks';
import PublicMarketplace from '../pages/Marketplace';
// import LoginPage from '../pages/LoginPage';
// import RegisterPage from '../pages/RegisterPage';

// Layout
import PublicLayout from '../components/layout/PublicLayout';
import EVOwnerLayout from '../components/layout/EVOwnerLayout';
import BuyerLayout from '../components/layout/BuyerLayout';
import VerifierLayout from '../components/layout/VerifierLayout';
import AdminLayout from '../components/layout/AdminLayout';

// EV Owner pages
import EVOwnerDashboard from '../features/ev-owner/pages/Dashboard';
import CarbonWallet from '../features/ev-owner/pages/CarbonWallet';
import ListingsManagement from '../features/ev-owner/pages/ListingsManagement';
import TransactionHistory from '../features/ev-owner/pages/TransactionHistory';
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
import PaymentCallback from '../features/buyer/pages/PaymentCallback';

// Verifier pages
import VerifierDashboard from '../features/verifier/pages/Dashboard';
import VerificationRequests from '../features/verifier/pages/VerificationRequests';
import IssueCredits from '../features/verifier/pages/IssueCredits';
import VerifierTransactions from '../features/verifier/pages/Transactions';
import VerifierListings from '../features/verifier/pages/Listings';
import VerifierReports from '../features/verifier/pages/Reports';
import VerifierSettings from '../features/verifier/pages/Settings';

// Admin pages
import AdminDashboard from '../features/admin/pages/Dashboard';
import AdminUsers from '../features/admin/pages/Users';
import AdminTransactions from '../features/admin/pages/Transactions';
import AdminListings from '../features/admin/pages/Listings';
import AdminWallets from '../features/admin/pages/Wallets';
import AdminCarbonCredits from '../features/admin/pages/CarbonCredits';
import AdminVehicleTypes from '../features/admin/pages/VehicleTypes';
import AdminReports from '../features/admin/pages/Reports';
import AdminSettings from '../features/admin/pages/Settings';
// import TransactionManagement from '../features/admin/pages/TransactionManagement';

// Create router configuration
const createRouter = () => createBrowserRouter(
  [
    // Public routes with shared layout
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'about',
          element: <AboutUs />,
        },
        {
          path: 'auth',
          element: <Auth />,
        },
        {
          path: 'blog',
          element: <Blog />,
        },
        {
          path: 'contact',
          element: <Contact />,
        },
        {
          path: 'faqs',
          element: <FAQs />,
        },
        {
          path: 'how-it-works',
          element: <HowItWorks />,
        },
        {
          path: 'marketplace',
          element: <PublicMarketplace />,
        },
        {
          path: 'login',
          element: <Auth />,
        },
        {
          path: 'register',
          element: <Auth />,
        },
      ],
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
          element: <EVOwnerDashboard />, // Reports merged into Dashboard
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
        <ProtectedRoute allowedRoles={[USER_ROLES.BUYER, USER_ROLES.CC_BUYER]}>
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
          path: 'payment/callback',
          element: <PaymentCallback />,
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
        <ProtectedRoute allowedRoles={[USER_ROLES.VERIFIER, USER_ROLES.CVA]}>
          <VerifierLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <VerifierDashboard />,
        },
        {
          path: 'dashboard',
          element: <VerifierDashboard />,
        },
        {
          path: 'verification-requests',
          element: <VerificationRequests />,
        },
        {
          path: 'issue-credits',
          element: <IssueCredits />,
        },
        {
          path: 'transactions',
          element: <VerifierTransactions />,
        },
        {
          path: 'listings',
          element: <VerifierListings />,
        },
        {
          path: 'reports',
          element: <VerifierReports />,
        },
        {
          path: 'settings',
          element: <VerifierSettings />,
        },
      ],
    },
    // Admin routes
    {
      path: '/admin',
      element: (
        <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <AdminDashboard />,
        },
        {
          path: 'dashboard',
          element: <AdminDashboard />,
        },
        {
          path: 'users',
          element: <AdminUsers />,
        },
        {
          path: 'transactions',
          element: <AdminTransactions />,
        },
        {
          path: 'listings',
          element: <AdminListings />,
        },
        {
          path: 'wallets',
          element: <AdminWallets />,
        },
        {
          path: 'carbon-credits',
          element: <AdminCarbonCredits />,
        },
        {
          path: 'vehicle-types',
          element: <AdminVehicleTypes />,
        },
        {
          path: 'reports',
          element: <AdminReports />,
        },
        {
          path: 'settings',
          element: <AdminSettings />,
        },
      ],
    },
    // Admin/CVA Login (Hidden - not linked from public pages)
    {
      path: '/admin/login',
      element: <AdminAuth />,
    },
    {
      path: '/verifier/login',
      element: <AdminAuth />,
    },
    // Unauthorized Route
    {
      path: '/unauthorized',
      element: <Unauthorized />,
    },
    // 404 Route - must be last
    {
      path: '*',
      element: <NotFound />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default createRouter;

