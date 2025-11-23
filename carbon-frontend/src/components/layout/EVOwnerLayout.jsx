import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  Wallet, 
  Tag, 
  CreditCard, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Bell,
  Zap,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrencyFromUsd } from '../../utils';

const EVOwnerLayout = () => {
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
    { path: '/ev-owner/dashboard', icon: LayoutDashboard, label: 'Tổng quan', badge: 'New' },
    { path: '/ev-owner/upload-trips', icon: Upload, label: 'Tải dữ liệu hành trình' },
    { path: '/ev-owner/carbon-wallet', icon: Wallet, label: 'Ví Carbon', badge: 3 },
    { path: '/ev-owner/listings', icon: Tag, label: 'Niêm yết tín chỉ' },
    { path: '/ev-owner/transactions', icon: CreditCard, label: 'Giao dịch' },
    { path: '/ev-owner/reports', icon: BarChart3, label: 'Báo cáo' },
    { path: '/ev-owner/settings', icon: Settings, label: 'Cài đặt' },
  ];


  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    updateCurrentDate();
  }, []);

  const updateCurrentDate = () => {
    // Date is displayed in header
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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-green-600 text-white p-3 rounded-xl shadow-lg hover:bg-green-700 transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar fixed left-0 top-0 h-full w-72 text-white z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, #2ECC71 0%, #27AE60 100%)',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-green-400 border-opacity-30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4 backdrop-filter backdrop-blur-sm p-2">
              <img src="/logo.png" alt="Carbon Credit Marketplace" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-bold text-xl">Carbon Credit</h2>
              <p className="text-sm opacity-80">EV Owner Dashboard</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-green-400 border-opacity-30">
          <div className="user-profile rounded-xl p-4" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <div className="flex items-center">
              <div className="user-avatar w-14 h-14 rounded-full flex items-center justify-center mr-4" style={{
                background: 'linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              }}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{user?.name || 'EV Owner'}</h3>
                <div className="flex items-center mt-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm opacity-90">Đã xác minh</span>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">Tesla Model 3</span>
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
                      ? 'bg-green-400 border-r-4 border-white shadow-inner'
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

        {/* Stats Summary */}
        <div className="px-4 mt-8">
          <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-filter backdrop-blur-sm">
            <h4 className="font-semibold mb-3 text-center">Thống kê nhanh</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Tín chỉ có sẵn:</span>
                <span className="font-bold">245</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Đã bán:</span>
                <span className="font-bold">{formatCurrencyFromUsd(8750)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Km đã đi:</span>
                <span className="font-bold">12,450</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 mb-6 px-4">
          <div className="border-t border-green-400 border-opacity-30 pt-4">
            <div className="text-center">
              <p className="text-sm opacity-75">Carbon Credit Platform</p>
              <p className="text-xs opacity-60 mt-1">EV Owner Dashboard v2.0</p>
            </div>
          </div>
        </div>
      </div>

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
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">{getCurrentDate()}</p>
              </div>
              <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">EV</span>
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

export default EVOwnerLayout;

