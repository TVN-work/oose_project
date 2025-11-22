import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Tag,
  Wallet,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  User,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLayout = () => {
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
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    {
      path: '/admin/users',
      icon: Users,
      label: 'Người dùng',
      badge: '1.2K',
      badgeColor: 'blue',
    },
    {
      path: '/admin/transactions',
      icon: CreditCard,
      label: 'Giao dịch',
      badge: '847',
      badgeColor: 'green',
    },
    {
      path: '/admin/listings',
      icon: Tag,
      label: 'Niêm yết tín chỉ',
      badge: '156',
      badgeColor: 'orange',
    },
    {
      path: '/admin/wallets',
      icon: Wallet,
      label: 'Ví & dòng tiền',
      badge: '₫',
      badgeColor: 'purple',
    },
    {
      path: '/admin/reports',
      icon: BarChart3,
      label: 'Báo cáo',
      badge: '!',
      badgeColor: 'red',
    },
    { path: '/admin/settings', icon: Settings, label: 'Cài đặt' },
  ];

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('vi-VN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const quickActions = [
    { action: 'backup', label: '💾 Sao lưu hệ thống', gradient: 'from-blue-500 to-blue-600' },
    { action: 'maintenance', label: '🔧 Bảo trì hệ thống', gradient: 'from-orange-500 to-orange-600' },
  ];

  const handleQuickAction = (action) => {
    if (action === 'backup') {
      toast.info('💾 Đang thực hiện sao lưu hệ thống...');
    } else if (action === 'maintenance') {
      toast.warning('🔧 Đang chuyển sang chế độ bảo trì...');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gray-800 text-white p-3 rounded-xl shadow-lg hover:bg-gray-700 transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 text-white z-40 transition-transform duration-300 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          background: '#1F2A44',
          boxShadow: '4px 0 20px rgba(31, 42, 68, 0.3)',
        }}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-white bg-opacity-15 rounded-xl flex items-center justify-center mr-4 backdrop-filter backdrop-blur-sm">
              <span className="text-3xl">⚡</span>
            </div>
            <div>
              <h2 className="font-bold text-xl">Admin Dashboard</h2>
              <p className="text-sm opacity-80">Carbon Marketplace</p>
            </div>
          </div>
        </div>

        {/* Admin Profile Section */}
        <div className="p-6 border-b border-gray-600">
          <div
            className="rounded-xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="flex items-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mr-4"
                style={{
                  background: 'linear-gradient(135deg, #2980B9 0%, #3498DB 100%)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                }}
              >
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-white">{user?.name || 'Nguyễn Văn Admin'}</h3>
                <div className="flex items-center mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm text-gray-300">Quản trị viên hệ thống</span>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-xs bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded-full">Super Admin</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div
              className="rounded-lg p-3 mt-4"
              style={{
                background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.1) 100%)',
                border: '1px solid rgba(46, 204, 113, 0.2)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-300">Hệ thống hoạt động</span>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-xs text-green-300">99.9%</span>
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
                  className={`flex items-center px-4 py-4 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-blue-600 bg-opacity-30 border-r-4 border-blue-500 shadow-inner'
                      : 'hover:bg-white hover:bg-opacity-10 hover:translate-x-1'
                  }`}
                >
                  <Icon className="mr-4 w-5 h-5" />
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.badgeColor === 'blue'
                          ? 'bg-blue-500'
                          : item.badgeColor === 'green'
                          ? 'bg-green-500'
                          : item.badgeColor === 'orange'
                          ? 'bg-orange-500'
                          : item.badgeColor === 'purple'
                          ? 'bg-purple-500'
                          : 'bg-red-500'
                      } text-white`}
                    >
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
            className="bg-white bg-opacity-10 rounded-xl p-5 backdrop-filter backdrop-blur-sm"
            style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <h4 className="font-semibold mb-4 text-center">Thống kê nhanh</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Người dùng online:</span>
                <span className="text-green-300 font-bold">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Giao dịch hôm nay:</span>
                <span className="text-blue-300 font-bold">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Doanh thu:</span>
                <span className="text-yellow-300 font-bold">₫45.2M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Tranh chấp:</span>
                <span className="text-red-300 font-bold">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-6">
          <h4 className="font-semibold mb-3 text-center opacity-80">Hành động nhanh</h4>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.action}
                onClick={() => handleQuickAction(action.action)}
                className={`w-full bg-gradient-to-r ${action.gradient} text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all text-sm font-medium shadow-lg`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 mb-6 px-4">
          <div className="border-t border-gray-600 pt-4">
            <div className="text-center">
              <p className="text-sm opacity-75">Carbon Credit Marketplace</p>
              <p className="text-xs opacity-60 mt-1">Admin Panel v3.0</p>
              <p className="text-xs opacity-60 mt-1">© 2024 All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:ml-80 min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="animate-slide-in">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">⚡</span>
                <span>Bảng điều khiển Quản trị hệ thống</span>
              </h1>
              <p className="text-gray-600 mt-2">Giám sát và quản lý toàn bộ hệ thống Carbon Credit Marketplace</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* System Health */}
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Hệ thống ổn định</span>
              </div>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                  <Bell className="w-6 h-6" />
                </button>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-bounce">
                  3
                </span>
              </div>

              {/* Admin Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toast.error('🚨 Đã kích hoạt chế độ khẩn cấp!')}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg text-sm"
                >
                  🚨 Khẩn cấp
                </button>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Hôm nay</p>
                  <p className="text-lg font-semibold text-gray-800">{getCurrentDate()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
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

export default AdminLayout;

