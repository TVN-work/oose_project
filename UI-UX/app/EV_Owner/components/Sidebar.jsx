import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, currentPath, onNavigate }) => {
  const navigate = onNavigate || useNavigate();

  const menuItems = [
    { path: '/', icon: '📊', label: 'Tổng quan', badge: 'New' },
    { path: '/upload-data', icon: '📤', label: 'Tải dữ liệu hành trình' },
    { path: '/carbon-wallet', icon: '💰', label: 'Ví Carbon', badge: '3' },
    { path: '/list-credits', icon: '🏷️', label: 'Niêm yết tín chỉ' },
    { path: '/transactions', icon: '💳', label: 'Giao dịch' },
    { path: '/reports', icon: '📈', label: 'Báo cáo' },
    { path: '/settings', icon: '⚙️', label: 'Cài đặt' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const quickActions = [
    { action: 'upload', icon: '📱', label: 'Tải dữ liệu ngay', path: '/upload-data' },
    { action: 'sell', icon: '💸', label: 'Bán tín chỉ', path: '/list-credits' },
    { action: 'report', icon: '📊', label: 'Xem báo cáo', path: '/reports' },
  ];

  return (
    <>
      <div
        className={`sidebar fixed left-0 top-0 h-full w-72 text-white z-40 custom-scrollbar overflow-y-auto ${
          isOpen ? 'open' : 'mobile-sidebar'
        } md:translate-x-0`}
        id="sidebar"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-green-400 border-opacity-30">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4 backdrop-filter backdrop-blur-sm">
              <span className="text-2xl">🚗</span>
            </div>
            <div>
              <h2 className="font-bold text-xl">Carbon Credit</h2>
              <p className="text-sm opacity-80">EV Owner Dashboard</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-green-400 border-opacity-30">
          <div className="user-profile rounded-xl p-4">
            <div className="flex items-center">
              <div className="user-avatar w-14 h-14 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">EV Owner</h3>
                <div className="flex items-center mt-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full mr-2 notification-badge"></span>
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
            {menuItems.map((item) => (
              <a
                key={item.path}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.path);
                }}
                className={`sidebar-item flex items-center px-4 py-3 rounded-xl ${
                  currentPath === item.path ? 'active' : ''
                }`}
              >
                <span className="mr-4 text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </nav>

        {/* Quick Actions Section */}
        <div className="px-4 mt-8">
          <h4 className="text-sm font-semibold opacity-80 mb-4 px-4">HÀNH ĐỘNG NHANH</h4>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.action}
                onClick={() => handleNavigation(action.path)}
                className="quick-action w-full text-left px-4 py-3 rounded-xl flex items-center"
              >
                <span className="mr-3 text-lg">{action.icon}</span>
                <span className="text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

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
                <span className="font-bold">$8,750</span>
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
              <div className="flex justify-center mt-3 space-x-4">
                <button className="text-xs opacity-60 hover:opacity-100 transition-opacity">Hỗ trợ</button>
                <button className="text-xs opacity-60 hover:opacity-100 transition-opacity">Điều khoản</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

