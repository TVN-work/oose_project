import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck,
  Award,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Shield,
  LogOut,
  Receipt,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useVerificationRequests } from '../../hooks/useVerifier';

const VerifierLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch all requests for badges and stats
  const { data: allRequestsData } = useVerificationRequests({});
  const allRequests = allRequestsData || [];

  // Calculate counts for badges
  const pendingCount = allRequests.filter(r => r.status === 'pending').length;
  const readyForIssuanceCount = allRequests.filter(r => r.status === 'approved').length;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/verifier/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Có lỗi xảy ra khi đăng xuất');
    }
  };

  const menuItems = [
    { path: '/verifier/dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    {
      path: '/verifier/verification-requests',
      icon: FileCheck,
      label: 'Yêu cầu xác minh',
      badge: pendingCount > 0 ? pendingCount : null,
    },
    // {
    //   path: '/verifier/issue-credits',
    //   icon: Award,
    //   label: 'Phát hành tín chỉ',
    //   badge: readyForIssuanceCount > 0 ? readyForIssuanceCount : null,
    // },
    {
      path: '/verifier/transactions',
      icon: Receipt,
      label: 'Quản lý giao dịch',
    },
    {
      path: '/verifier/listings',
      icon: ShoppingBag,
      label: 'Quản lý niêm yết',
    },
    { path: '/verifier/reports', icon: BarChart3, label: 'Báo cáo' },
    { path: '/verifier/settings', icon: Settings, label: 'Cài đặt' },
  ];

  const isActive = (path) => {
    if (path === '/verifier/dashboard') {
      return location.pathname === '/verifier' || location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Calculate quick stats
  const totalRequests = allRequests.length;
  const approvedRequests = allRequests.filter(r => r.status === 'approved').length;
  const approvalRate = totalRequests > 0 ? ((approvedRequests / totalRequests) * 100).toFixed(1) : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-blue-600 text-white p-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar fixed left-0 top-0 h-full w-72 text-white z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        style={{
          background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-blue-400 border-opacity-30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4 backdrop-filter backdrop-blur-sm p-2">
              <img src="/logo.png" alt="Carbon Credit Marketplace" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-bold text-xl">Carbon Credit</h2>
              <p className="text-sm opacity-80">CVA Dashboard</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-blue-400 border-opacity-30">
          <div
            className="user-profile rounded-xl p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="flex items-center">
              <div
                className="user-avatar w-14 h-14 rounded-full flex items-center justify-center mr-4"
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{user?.name || user?.fullName || user?.full_name || user?.username || 'CVA Admin'}</h3>
                <div className="flex items-center mt-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm opacity-90">Đã xác minh</span>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">Cấp độ A+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`sidebar-item flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${active
                      ? 'bg-blue-400 border-r-4 border-white shadow-inner'
                      : 'hover:bg-white hover:bg-opacity-15 hover:translate-x-1'
                    }`}
                >
                  <Icon className="mr-4 w-5 h-5" />
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      {typeof item.badge === 'number' ? item.badge : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="mt-8 mb-6 px-4">
          <div className="border-t border-blue-400 border-opacity-30 pt-4">
            <div className="text-center">
              <p className="text-sm opacity-75">Carbon Credit Platform</p>
              <p className="text-xs opacity-60 mt-1">CVA Dashboard v2.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="md:ml-72 min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-end items-center">
            {/* Notifications */}
            <div className="relative mr-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5" />
              </button>
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">{getCurrentDate()}</p>
              </div>
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="ml-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VerifierLayout;
