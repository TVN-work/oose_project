import { Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils'

export default function Header({ title, subtitle }) {
  const { user } = useAuth()
  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="content-header shadow-sm border-b px-6 py-6">
      <div className="flex justify-between items-center">
        <div className="slide-in">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="mr-3">👋</span>
            {title || 'Chào mừng trở lại!'}
          </h1>
          <p className="text-gray-600 mt-2">
            {subtitle || 'Quản lý tín chỉ carbon từ xe điện của bạn'}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-3 text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200">
              <Bell className="w-6 h-6" />
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
              <span className="text-white font-bold">{getInitials(user?.name || 'EV Owner')}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

