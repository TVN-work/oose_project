import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Award, 
  CreditCard, 
  Settings,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BuyerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/buyer/dashboard', icon: LayoutDashboard, label: 'Tổng quan', badge: 'New' },
    { path: '/buyer/marketplace', icon: ShoppingCart, label: 'Marketplace', badge: '125 listings' },
    { path: '/buyer/certificates', icon: Award, label: 'Chứng nhận', badge: 3 },
    { path: '/buyer/purchase-history', icon: CreditCard, label: 'Lịch sử giao dịch' },
    { path: '/buyer/settings', icon: Settings, label: 'Cài đặt' },
  ];

  const isActive = (path) => location.pathname === path;

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
          className="bg-blue-600 text-white p-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
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
          background: 'linear-gradient(180deg, #3498DB 0%, #2980B9 100%)',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-blue-400 border-opacity-30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4 backdrop-filter backdrop-blur-sm">
              <span className="text-2xl">🌱</span>
            </div>
            <div>
              <h2 className="font-bold text-xl">Carbon Credit</h2>
              <p className="text-sm opacity-80">Marketplace Platform</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-blue-400 border-opacity-30">
          <div className="user-profile rounded-xl p-4" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <div className="flex items-center">
              <div className="user-avatar w-14 h-14 rounded-full flex items-center justify-center mr-4" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              }}>
                <span className="text-2xl">🛒</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Carbon Buyer</h3>
                <div className="flex items-center mt-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm opacity-90">Đã xác minh</span>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">Gold Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`sidebar-item flex items-center px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-blue-400 border-r-4 border-white shadow-inner'
                      : 'hover:bg-white hover:bg-opacity-15 hover:translate-x-1'
                  }`}
                >
                  <Icon className="mr-4 text-xl" />
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      typeof item.badge === 'number'
                        ? 'bg-red-500 text-white w-5 h-5 flex items-center justify-center'
                        : 'bg-white bg-opacity-20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Stats Summary */}
        <div className="px-4 mt-8 mb-6">
          <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-filter backdrop-blur-sm">
            <h4 className="font-semibold mb-3 text-center">Thống kê nhanh</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Tín chỉ đã mua:</span>
                <span className="font-bold">587</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Tổng chi tiêu:</span>
                <span className="font-bold">$12,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Chứng nhận:</span>
                <span className="font-bold">8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto mb-6 px-4">
          <div className="border-t border-blue-400 border-opacity-30 pt-4">
            <div className="text-center">
              <p className="text-sm opacity-75">Carbon Credit Platform</p>
              <p className="text-xs opacity-60 mt-1">Buyer Dashboard v2.0</p>
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
      <div className="md:ml-72 min-h-full">
        {/* Header */}
        <header
          className="shadow-sm border-b px-6 py-6"
          style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">👋</span>
                <span>Chào mừng trở lại!</span>
              </h1>
              <p className="text-gray-600 mt-2">Theo dõi hoạt động mua bán tín chỉ carbon của bạn</p>
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
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">CB</span>
                </div>
              </div>
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

export default BuyerLayout;

