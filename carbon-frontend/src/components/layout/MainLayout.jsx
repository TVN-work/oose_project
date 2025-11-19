import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import Header from './Header'

const pageTitles = {
  '/ev-owner/dashboard': { title: '📊 Tổng quan Dashboard', subtitle: 'Quản lý tín chỉ carbon từ xe điện của bạn' },
  '/ev-owner/upload-trips': { title: '📤 Tải dữ liệu hành trình', subtitle: 'Tải lên dữ liệu lái xe để tạo tín chỉ carbon' },
  '/ev-owner/carbon-wallet': { title: '💰 Ví Carbon', subtitle: 'Quản lý tín chỉ carbon và thu nhập của bạn' },
  '/ev-owner/listings': { title: '🏷️ Niêm yết tín chỉ', subtitle: 'Đăng bán tín chỉ carbon trên marketplace' },
  '/ev-owner/transactions': { title: '💳 Giao dịch', subtitle: 'Theo dõi lịch sử mua bán tín chỉ carbon' },
  '/ev-owner/reports': { title: '📈 Báo cáo', subtitle: 'Xem báo cáo chi tiết về hoạt động và thu nhập' },
  '/ev-owner/settings': { title: '⚙️ Cài đặt', subtitle: 'Quản lý thông tin tài khoản và xe điện' },
}

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const pageInfo = pageTitles[location.pathname] || { title: '', subtitle: '' }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-green-600 text-white p-3 rounded-xl shadow-lg hover:bg-green-700 transition-colors"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="md:ml-72 min-h-screen">
        <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

