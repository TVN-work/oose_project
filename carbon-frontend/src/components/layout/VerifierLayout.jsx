import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck,
  Award,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const VerifierLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { path: '/verifier/dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    {
      path: '/verifier/verification-requests',
      icon: FileCheck,
      label: 'Yêu cầu xác minh',
      badge: 8,
    },
    {
      path: '/verifier/issue-credits',
      icon: Award,
      label: 'Phát hành tín chỉ',
      badge: 3,
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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gray-700 text-white p-3 rounded-xl shadow-lg hover:bg-gray-800 transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar fixed left-0 top-0 h-full w-72 text-white z-40 transition-transform duration-300 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          background: '#2C3E50',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4 backdrop-filter backdrop-blur-sm p-2">
              <img src="/logo.png" alt="Carbon Credit Marketplace" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-bold text-xl">CVA Dashboard</h2>
              <p className="text-sm opacity-80">Verification Authority</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-600">
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
                  background: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                }}
              >
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{user?.name || 'CVA Admin'}</h3>
                <div className="flex items-center mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
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
                  className={`sidebar-item flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-gray-700 border-r-4 border-blue-500 shadow-inner'
                      : 'hover:bg-white hover:bg-opacity-10 hover:translate-x-1'
                  }`}
                >
                  <Icon className="mr-4 w-5 h-5" />
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Quick Stats */}
        <div className="px-4 mt-8">
          <div
            className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-filter backdrop-blur-sm"
            style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <h4 className="font-semibold mb-3 text-center">Thống kê nhanh</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Chờ duyệt:</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Đã xác minh:</span>
                <span className="font-bold">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Tỷ lệ duyệt:</span>
                <span className="font-bold">92.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 mb-6 px-4">
          <div className="border-t border-gray-600 pt-4">
            <div className="text-center">
              <p className="text-sm opacity-75">Carbon Verification Authority</p>
              <p className="text-xs opacity-60 mt-1">CVA Dashboard v2.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:ml-72 min-h-screen">
        {/* Header */}
        <header
          className="bg-white shadow-sm border-b px-6 py-6"
          style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <div className="flex justify-between items-center">
            <div className="animate-slide-in">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">🏛️</span>
                <span>Bảng điều khiển CVA</span>
              </h1>
              <p className="text-gray-600 mt-2">Quản lý xác minh và phát hành tín chỉ carbon</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-3 text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200">
                  <Bell className="w-6 h-6" />
                </button>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Hôm nay</p>
                  <p className="text-lg font-semibold text-gray-800">{getCurrentDate()}</p>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">CVA</span>
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
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default VerifierLayout;

