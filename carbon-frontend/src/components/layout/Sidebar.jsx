import { NavLink, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'

const menuItems = [
  { path: '/ev-owner/dashboard', label: 'Tổng quan', icon: '📊', badge: 'New' },
  { path: '/ev-owner/upload-trips', label: 'Tải dữ liệu hành trình', icon: '📤' },
  { path: '/ev-owner/carbon-wallet', label: 'Ví Carbon', icon: '💰', badge: 3 },
  { path: '/ev-owner/listings', label: 'Niêm yết tín chỉ', icon: '🏷️' },
  { path: '/ev-owner/transactions', label: 'Giao dịch', icon: '💳' },
  { path: '/ev-owner/reports', label: 'Báo cáo', icon: '📈' },
  { path: '/ev-owner/settings', label: 'Cài đặt', icon: '⚙️' },
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'sidebar fixed left-0 top-0 h-screen w-72 text-white z-40 transition-transform duration-300 custom-scrollbar overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
        style={{
          background: 'linear-gradient(180deg, #2ECC71 0%, #27AE60 100%)',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        }}
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
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    Tesla Model 3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'sidebar-item flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative',
                    isActive && 'active'
                  )
                }
              >
                <span className="mr-4 text-xl">{item.icon}</span>
                <span className="font-medium flex-1">{item.label}</span>
                {item.badge && (
                  typeof item.badge === 'number' ? (
                    <span className="ml-auto w-5 h-5 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : (
                    <span className="ml-auto text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Quick Actions Section */}
        <div className="px-4 mt-8">
          <h4 className="text-sm font-semibold opacity-80 mb-4 px-4">HÀNH ĐỘNG NHANH</h4>
          <div className="space-y-2">
            <button
              onClick={() => {
                onClose()
                navigate('/ev-owner/upload-trips')
              }}
              className="quick-action w-full text-left px-4 py-3 rounded-xl flex items-center"
            >
              <span className="mr-3 text-lg">📱</span>
              <span className="text-sm">Tải dữ liệu ngay</span>
            </button>
            <button
              onClick={() => {
                onClose()
                navigate('/ev-owner/listings')
              }}
              className="quick-action w-full text-left px-4 py-3 rounded-xl flex items-center"
            >
              <span className="mr-3 text-lg">💸</span>
              <span className="text-sm">Bán tín chỉ</span>
            </button>
            <button
              onClick={() => {
                onClose()
                navigate('/ev-owner/reports')
              }}
              className="quick-action w-full text-left px-4 py-3 rounded-xl flex items-center"
            >
              <span className="mr-3 text-lg">📊</span>
              <span className="text-sm">Xem báo cáo</span>
            </button>
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
                <button className="text-xs opacity-60 hover:opacity-100 transition-opacity">
                  Hỗ trợ
                </button>
                <button className="text-xs opacity-60 hover:opacity-100 transition-opacity">
                  Điều khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

