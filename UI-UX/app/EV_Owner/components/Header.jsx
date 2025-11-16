import React, { useEffect, useState } from 'react';

const Header = ({ currentPath }) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      setCurrentDate(now.toLocaleDateString('vi-VN', options));
    };
    updateDate();
  }, []);

  const getPageInfo = (path) => {
    const pageInfoMap = {
      '/': { title: '👋 Chào mừng trở lại!', subtitle: 'Quản lý tín chỉ carbon từ xe điện của bạn' },
      '/upload-data': {
        title: '📤 Tải dữ liệu hành trình',
        subtitle: 'Tải lên dữ liệu lái xe để tạo tín chỉ carbon',
      },
      '/carbon-wallet': {
        title: '💰 Ví Carbon',
        subtitle: 'Quản lý tín chỉ carbon và thu nhập của bạn',
      },
      '/list-credits': {
        title: '🏷️ Niêm yết tín chỉ',
        subtitle: 'Đăng bán tín chỉ carbon trên marketplace',
      },
      '/transactions': {
        title: '💳 Giao dịch',
        subtitle: 'Theo dõi lịch sử mua bán tín chỉ carbon',
      },
      '/reports': {
        title: '📈 Báo cáo',
        subtitle: 'Xem báo cáo chi tiết về hoạt động và thu nhập',
      },
      '/settings': {
        title: '⚙️ Cài đặt',
        subtitle: 'Quản lý thông tin tài khoản và xe điện',
      },
    };
    return pageInfoMap[path] || pageInfoMap['/'];
  };

  const pageInfo = getPageInfo(currentPath);

  return (
    <header className="content-header shadow-sm border-b px-6 py-6">
      <div className="flex justify-between items-center">
        <div className="slide-in">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="mr-3">{pageInfo.title.split(' ')[0]}</span>
            <span>{pageInfo.title.substring(pageInfo.title.indexOf(' ') + 1)}</span>
          </h1>
          <p className="text-gray-600 mt-2">{pageInfo.subtitle}</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-3 text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2z"
                ></path>
              </svg>
            </button>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full notification-badge"></span>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Hôm nay</p>
              <p className="text-lg font-semibold text-gray-800">{currentDate}</p>
            </div>
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">EV</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

