import { Link } from 'react-router-dom';
import { Users, Tag, DollarSign, AlertTriangle, TrendingUp, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      icon: Users,
      value: '1,247',
      label: 'Tổng người dùng',
      color: 'blue',
      change: '+47 tuần này',
      detail: 'EV: 856 | Buyer: 391',
    },
    {
      icon: Tag,
      value: '12.47',
      label: 'Tổng tín chỉ giao dịch',
      color: 'green',
      change: '+2.1 tháng này',
      detail: 'Tương đương 12.47 tấn CO₂',
    },
    {
      icon: DollarSign,
      value: '₫62.3M',
      label: 'Tổng giá trị giao dịch',
      color: 'orange',
      change: '+₫8.5M tháng này',
      detail: 'Phí hệ thống: ₫1.87M',
    },
    {
      icon: AlertTriangle,
      value: '3',
      label: 'Yêu cầu tranh chấp',
      color: 'red',
      change: '⚠️ Cần xử lý',
      detail: '2 mới, 1 đang xử lý',
    },
  ];

  const recentTransactions = [
    {
      id: 'TX001',
      seller: 'Nguyễn Văn An',
      buyer: 'Green Corp',
      credits: '0.025',
      value: '₫125,000',
      status: 'completed',
    },
    {
      id: 'TX002',
      seller: 'Trần Thị Bình',
      buyer: 'Eco Solutions',
      credits: '0.018',
      value: '₫90,000',
      status: 'completed',
    },
    {
      id: 'TX003',
      seller: 'Lê Minh Cường',
      buyer: 'Clean Energy',
      credits: '0.032',
      value: '₫160,000',
      status: 'processing',
    },
    {
      id: 'TX004',
      seller: 'Phạm Thị Dung',
      buyer: 'Future Tech',
      credits: '0.045',
      value: '₫225,000',
      status: 'completed',
    },
    {
      id: 'TX005',
      seller: 'Hoàng Văn Minh',
      buyer: 'Green Corp',
      credits: '0.028',
      value: '₫140,000',
      status: 'completed',
    },
  ];

  const getColorClasses = (color) => {
    const classes = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
      green: { bg: 'bg-green-500', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
      red: { bg: 'bg-red-500', text: 'text-red-600', gradient: 'from-red-500 to-red-600' },
    };
    return classes[color] || classes.blue;
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Hoàn thành</span>;
    }
    return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">Đang xử lý</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Chào mừng, Admin Nguyễn Văn!</h2>
            <p className="opacity-90 mb-4">Hệ thống đang hoạt động ổn định với 1,247 người dùng và 847 giao dịch</p>
            <div className="flex space-x-4">
              <Link
                to="/admin/users"
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                👥 Quản lý người dùng
              </Link>
              <Link
                to="/admin/transactions"
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                💳 Xem giao dịch
              </Link>
            </div>
          </div>
          <div className="text-6xl opacity-20">⚡</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const { gradient, text } = getColorClasses(stat.color);
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-lg transition-all">
              <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <p className={`text-3xl font-bold ${text} mb-2`}>{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-xs ${text} mt-2`}>{stat.change}</p>
              <div className={`mt-3 bg-${stat.color}-50 rounded-lg p-2`}>
                <p className={`text-xs text-${stat.color}-700`}>{stat.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Transaction Timeline Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="mr-3 w-5 h-5" />
            Tổng giao dịch theo thời gian
          </h3>
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <polyline
                fill="none"
                stroke="#2980B9"
                strokeWidth="3"
                points="20,160 60,140 100,120 140,100 180,80 220,90 260,70 300,60 340,50 380,40"
              />
              {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map((x, i) => (
                <circle key={i} cx={x} cy={200 - (i * 12 + 40)} r="4" fill="#2980B9" />
              ))}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
              {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10'].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-2">
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Tổng giao dịch 10 tháng: <span className="font-bold text-blue-600">847 giao dịch</span>
            </p>
          </div>
        </div>

        {/* User Role Distribution Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="mr-3 w-5 h-5" />
            Tỷ lệ người dùng theo vai trò
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2980B9" strokeWidth="20" strokeDasharray="171.5 250" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F39C12" strokeWidth="20" strokeDasharray="78.5 250" strokeDashoffset="-171.5" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">1,247</p>
                  <p className="text-xs text-gray-600">Tổng người dùng</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">EV Owner</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">856 (68.6%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Buyer</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">391 (31.4%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <CreditCard className="mr-3 w-5 h-5" />
            Giao dịch gần đây
          </h3>
          <Link to="/admin/transactions" className="text-blue-600 hover:text-blue-800 font-semibold">
            Xem tất cả →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Mã giao dịch</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Người bán</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Người mua</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Số lượng</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Giá trị</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Trạng thái</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">#{tx.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 text-sm">🚗</span>
                      </div>
                      <span className="font-semibold text-gray-800">{tx.seller}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-sm">🏢</span>
                      </div>
                      <span className="font-semibold text-gray-800">{tx.buyer}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-green-600">{tx.credits}</td>
                  <td className="py-4 px-4 font-bold text-blue-600">{tx.value}</td>
                  <td className="py-4 px-4">{getStatusBadge(tx.status)}</td>
                  <td className="py-4 px-4">
                    <Link
                      to={`/admin/transactions/${tx.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      👁️ Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/admin/transactions"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg inline-block"
          >
            💳 Xem chi tiết giao dịch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

