import { Link } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  Shield,
  Wallet,
  Tag,
  BarChart3,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useSystemStats } from '../../../hooks/useAdmin';
import Loading from '../../../components/common/Loading';
import { formatCurrency, formatNumber } from '../../../utils';

const Dashboard = () => {
  // Fetch system stats from API
  const { data: systemStats, isLoading, error } = useSystemStats();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Không thể tải dữ liệu hệ thống. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const stats = systemStats || {
    users: 1247,
    transactions: 847,
    credits: 12.47,
    revenue: 62300000,
    disputes: 3,
    activeListings: 156,
  };

  // Mock chart data (will be replaced with real API data)
  const transactionTrendData = [
    { month: 'T1', value: 45 },
    { month: 'T2', value: 52 },
    { month: 'T3', value: 48 },
    { month: 'T4', value: 61 },
    { month: 'T5', value: 55 },
    { month: 'T6', value: 67 },
    { month: 'T7', value: 73 },
    { month: 'T8', value: 69 },
    { month: 'T9', value: 78 },
    { month: 'T10', value: 85 },
  ];

  const userRoleData = [
    { name: 'EV Owner', value: 856, color: '#3B82F6' },
    { name: 'Buyer', value: 391, color: '#F59E0B' },
  ];

  const transactionStatusData = [
    { name: 'Hoàn thành', value: 720, color: '#10B981' },
    { name: 'Đang xử lý', value: 95, color: '#F59E0B' },
    { name: 'Tranh chấp', value: 3, color: '#EF4444' },
    { name: 'Đã hủy', value: 29, color: '#6B7280' },
  ];

  // Stats cards
  const statsCards = [
    {
      icon: Users,
      value: formatNumber(stats.users || 0),
      label: 'Tổng người dùng',
      change: '+47 tuần này',
      changeType: 'up',
      color: 'blue',
      detail: 'EV: 856 | Buyer: 391',
      chartData: transactionTrendData,
    },
    {
      icon: Tag,
      value: formatNumber(stats.credits || 0),
      label: 'Tổng tín chỉ giao dịch',
      change: '+2.1 tháng này',
      changeType: 'up',
      color: 'green',
      detail: `Tương đương ${formatNumber(stats.credits || 0)} tấn CO₂`,
      chartData: transactionTrendData,
    },
    {
      icon: DollarSign,
      value: formatCurrency(stats.revenue || 0),
      label: 'Tổng giá trị giao dịch',
      change: '+₫8.5M tháng này',
      changeType: 'up',
      color: 'orange',
      detail: 'Phí hệ thống: ₫1.87M',
      chartData: transactionTrendData,
    },
    {
      icon: AlertTriangle,
      value: stats.disputes || 0,
      label: 'Yêu cầu tranh chấp',
      change: '⚠️ Cần xử lý',
      changeType: 'warning',
      color: 'red',
      detail: '2 mới, 1 đang xử lý',
      chartData: transactionTrendData,
    },
  ];

  const quickActions = [
    {
      icon: Users,
      label: 'Quản lý người dùng',
      link: '/admin/users',
      color: 'blue',
      description: 'Xem và quản lý',
    },
    {
      icon: CreditCard,
      label: 'Giao dịch',
      link: '/admin/transactions',
      color: 'green',
      description: 'Theo dõi & xử lý',
    },
    {
      icon: Wallet,
      label: 'Ví & dòng tiền',
      link: '/admin/wallets',
      color: 'purple',
      description: 'Quản lý ví',
    },
    {
      icon: BarChart3,
      label: 'Báo cáo',
      link: '/admin/reports',
      color: 'orange',
      description: 'Xuất báo cáo',
    },
  ];

  const recentTransactions = [
    {
      id: 'TX001',
      seller: 'Nguyễn Văn An',
      buyer: 'Green Corp',
      credits: 0.025,
      value: 125000,
      status: 'completed',
      date: '2024-11-23',
    },
    {
      id: 'TX002',
      seller: 'Trần Thị Bình',
      buyer: 'Eco Solutions',
      credits: 0.018,
      value: 90000,
      status: 'completed',
      date: '2024-11-23',
    },
    {
      id: 'TX003',
      seller: 'Lê Minh Cường',
      buyer: 'Clean Energy',
      credits: 0.032,
      value: 160000,
      status: 'processing',
      date: '2024-11-22',
    },
    {
      id: 'TX004',
      seller: 'Phạm Thị Dung',
      buyer: 'Future Tech',
      credits: 0.045,
      value: 225000,
      status: 'completed',
      date: '2024-11-22',
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      completed: {
        icon: CheckCircle,
        text: 'Hoàn thành',
        className: 'bg-green-100 text-green-800 border-green-200',
      },
      processing: {
        icon: Clock,
        text: 'Đang xử lý',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      dispute: {
        icon: AlertTriangle,
        text: 'Tranh chấp',
        className: 'bg-red-100 text-red-800 border-red-200',
      },
      cancelled: {
        icon: XCircle,
        text: 'Đã hủy',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
      },
    };

    const badge = badges[status] || badges.processing;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badge.className}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Chào mừng, Admin!</h2>
            <p className="opacity-90 mb-4">
              Hệ thống đang hoạt động ổn định với {formatNumber(stats.users || 0)} người dùng và {formatNumber(stats.transactions || 0)} giao dịch
            </p>
            <div className="flex space-x-4">
              <Link
                to="/admin/users"
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Quản lý người dùng
              </Link>
              <Link
                to="/admin/transactions"
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Xem giao dịch
              </Link>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <Shield className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: { bg: 'bg-blue-500', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
            green: { bg: 'bg-green-500', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
            orange: { bg: 'bg-orange-500', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
            red: { bg: 'bg-red-500', text: 'text-red-600', gradient: 'from-red-500 to-red-600' },
          };
          const colors = colorClasses[stat.color] || colorClasses.blue;

          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${colors.gradient} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.changeType === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                {stat.changeType === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
              </div>
              <p className={`text-3xl font-bold ${colors.text} mb-1`}>{stat.value}</p>
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className={`text-xs ${colors.text} mb-2`}>{stat.change}</p>
              <div className={`mt-3 bg-${stat.color}-50 rounded-lg p-2`}>
                <p className={`text-xs text-${stat.color}-700`}>{stat.detail}</p>
              </div>
              {/* Mini Chart */}
              <div className="mt-4 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.chartData.slice(-7)}>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={colors.bg.replace('bg-', '#')}
                      fill={colors.bg.replace('bg-', '#')}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Transaction Trend Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="mr-2 w-5 h-5" />
            Tổng giao dịch theo thời gian
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transactionTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Tổng giao dịch 10 tháng: <span className="font-bold text-blue-600">{formatNumber(stats.transactions || 0)} giao dịch</span>
            </p>
          </div>
        </div>

        {/* User Role Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Users className="mr-2 w-5 h-5" />
            Tỷ lệ người dùng theo vai trò
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {userRoleData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {formatNumber(item.value)} ({(item.value / (userRoleData[0].value + userRoleData[1].value) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Activity className="mr-2 w-5 h-5" />
          Hành động nhanh
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600',
              green: 'from-green-500 to-green-600',
              purple: 'from-purple-500 to-purple-600',
              orange: 'from-orange-500 to-orange-600',
            };
            return (
              <Link
                key={index}
                to={action.link}
                className={`bg-gradient-to-r ${colorClasses[action.color]} text-white rounded-xl p-6 hover:opacity-90 transition-all shadow-lg`}
              >
                <Icon className="w-8 h-8 mb-3" />
                <h4 className="font-bold text-lg mb-1">{action.label}</h4>
                <p className="text-sm opacity-90 mb-3">{action.description}</p>
                <div className="flex items-center text-sm">
                  <span>Xem chi tiết</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <CreditCard className="mr-2 w-5 h-5" />
            Giao dịch gần đây
          </h3>
          <Link to="/admin/transactions" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Mã giao dịch</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Người bán</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Người mua</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Số lượng</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Giá trị</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Trạng thái</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">#{tx.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">{tx.seller}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">{tx.buyer}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-green-600 text-sm">{formatNumber(tx.credits)}</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-600 text-sm">{formatCurrency(tx.value)}</td>
                  <td className="py-3 px-4 text-center">{getStatusBadge(tx.status)}</td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      to={`/admin/transactions/${tx.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm inline-flex items-center gap-1"
                    >
                      <Activity className="w-3 h-3" />
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
