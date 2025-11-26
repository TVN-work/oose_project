import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  FileCheck,
  Shield,
  Award,
  BarChart3,
  Activity,
  AlertCircle,
  XCircle,
  ArrowRight,
  Zap,
  Target,
  FileText,
  Download,
  Globe,
  User,
  Car
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useVerificationRequests } from '../../../hooks/useVerifier';
import Loading from '../../../components/common/Loading';
import { formatNumber } from '../../../utils';

const Dashboard = () => {
  // Fetch all verification requests to calculate stats
  const { data: requestsData, isLoading } = useVerificationRequests({});
  const requests = requestsData || [];

  if (isLoading) {
    return <Loading />;
  }

  // Calculate stats from requests
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;
  const totalVerified = approvedCount;

  // Calculate total credits issued
  const totalCreditsIssued = requests
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + (parseFloat(r.credits || r.creditAmount || 0)), 0);

  // Calculate approval rate
  const totalProcessed = approvedCount + rejectedCount;
  const approvalRate = totalProcessed > 0
    ? parseFloat(((approvedCount / totalProcessed) * 100).toFixed(1))
    : 0;

  // Calculate trends (mock for now - should come from API)
  const lastMonthPending = Math.max(0, pendingCount - 2);
  const lastMonthApproved = Math.max(0, approvedCount - 5);
  const lastMonthCredits = Math.max(0, totalCreditsIssued - 0.5);

  const pendingChange = pendingCount > 0 ? ((pendingCount - lastMonthPending) / Math.max(1, lastMonthPending) * 100) : 0;
  const approvedChange = approvedCount > 0 ? ((approvedCount - lastMonthApproved) / Math.max(1, lastMonthApproved) * 100) : 0;
  const creditsChange = totalCreditsIssued > 0 ? ((totalCreditsIssued - lastMonthCredits) / Math.max(0.1, lastMonthCredits) * 100) : 0;

  // Stats cards with mini charts
  const stats = [
    {
      icon: Clock,
      value: pendingCount.toString(),
      label: 'Yêu cầu chờ duyệt',
      change: `${pendingChange >= 0 ? '+' : ''}${pendingChange.toFixed(1)}%`,
      changeType: pendingChange >= 0 ? 'up' : 'down',
      color: 'yellow',
      chartData: [
        { name: 'T1', value: lastMonthPending },
        { name: 'T2', value: pendingCount },
      ],
    },
    {
      icon: CheckCircle,
      value: formatNumber(totalCreditsIssued),
      label: 'Tổng tín chỉ đã xác minh',
      change: `${creditsChange >= 0 ? '+' : ''}${creditsChange.toFixed(1)}%`,
      changeType: creditsChange >= 0 ? 'up' : 'down',
      color: 'green',
      chartData: [
        { name: 'T1', value: lastMonthCredits },
        { name: 'T2', value: totalCreditsIssued },
      ],
    },
    {
      icon: TrendingUp,
      value: `${approvalRate}%`,
      label: 'Tỷ lệ chấp thuận',
      change: totalProcessed > 0 ? `${approvedCount}/${totalProcessed}` : '0/0',
      changeType: 'up',
      color: 'blue',
      chartData: [
        { name: 'T1', value: totalProcessed > 0 ? (lastMonthApproved / Math.max(1, lastMonthApproved + Math.max(0, lastMonthPending - 2)) * 100) : 0 },
        { name: 'T2', value: approvalRate },
      ],
    },
    {
      icon: Activity,
      value: requests.length.toString(),
      label: 'Tổng yêu cầu',
      change: `${approvedChange >= 0 ? '+' : ''}${approvedChange.toFixed(1)}%`,
      changeType: approvedChange >= 0 ? 'up' : 'down',
      color: 'purple',
      chartData: [
        { name: 'T1', value: lastMonthApproved + lastMonthPending },
        { name: 'T2', value: requests.length },
      ],
    },
  ];

  // Recent requests (last 5)
  const recentRequests = requests.slice(0, 5);

  // Monthly data for charts (should come from API)
  const monthlyData = [
    { month: 'T7', processed: 50, credits: 1.25, approved: 47, rejected: 3 },
    { month: 'T8', processed: 45, credits: 1.20, approved: 42, rejected: 3 },
    { month: 'T9', processed: 42, credits: 1.15, approved: 39, rejected: 3 },
    { month: 'T10', processed: 40, credits: 1.05, approved: 38, rejected: 2 },
    { month: 'T11', processed: 38, credits: 0.95, approved: 35, rejected: 3 },
    { month: 'T12', processed: 35, credits: 0.85, approved: 32, rejected: 3 },
  ];

  // Status distribution for pie chart
  const statusDistribution = [
    { name: 'Đã duyệt', value: approvedCount, color: '#10b981' },
    { name: 'Chờ duyệt', value: pendingCount, color: '#f59e0b' },
    { name: 'Từ chối', value: rejectedCount, color: '#ef4444' },
  ];

  const quickActions = [
    {
      icon: FileCheck,
      label: 'Yêu cầu xác minh',
      link: '/verifier/verification-requests',
      color: 'blue',
      description: 'Xem và duyệt yêu cầu',
    },
    {
      icon: Award,
      label: 'Phát hành tín chỉ',
      link: '/verifier/issue-credits',
      color: 'green',
      description: 'Cấp tín chỉ carbon',
    },
    {
      icon: BarChart3,
      label: 'Báo cáo',
      link: '/verifier/reports',
      color: 'purple',
      description: 'Xem thống kê',
    },
    {
      icon: Shield,
      label: 'Cài đặt',
      link: '/verifier/settings',
      color: 'orange',
      description: 'Quản lý tài khoản',
    },
  ];

  // Performance metrics
  const performanceMetrics = [
    {
      label: 'Yêu cầu đã xử lý',
      current: totalProcessed,
      target: requests.length,
      color: 'blue',
      percentage: requests.length > 0 ? Math.min(100, (totalProcessed / requests.length * 100)) : 0,
    },
    {
      label: 'Tỷ lệ duyệt',
      current: approvalRate,
      target: 95,
      color: 'green',
      percentage: Math.min(100, (approvalRate / 95 * 100)),
    },
    {
      label: 'Tín chỉ đã phát hành',
      current: totalCreditsIssued,
      target: totalCreditsIssued * 1.2 || 1,
      color: 'purple',
      percentage: totalCreditsIssued > 0 ? Math.min(100, (totalCreditsIssued / (totalCreditsIssued * 1.2) * 100)) : 0,
    },
  ];

  // Recent activities
  const recentActivities = recentRequests.map((request, index) => ({
    title: `Yêu cầu ${request.id}`,
    description: `${request.owner || request.evOwner || 'EV Owner'} - ${request.vehicle || 'N/A'}`,
    time: request.date || (request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN') : 'N/A'),
    value: `${formatNumber(request.credits || request.creditAmount || 0)} tín chỉ`,
    color: request.status === 'approved' ? 'green' : request.status === 'rejected' ? 'red' : 'yellow',
    icon: request.status === 'approved' ? CheckCircle : request.status === 'rejected' ? XCircle : Clock,
  }));

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[status] || badges.pending}`}>
        {labels[status] || labels.pending}
      </span>
    );
  };

  const getColorClasses = (color) => {
    const classes = {
      yellow: {
        bg: 'bg-yellow-50',
        icon: 'bg-yellow-100 text-yellow-600',
        border: 'border-yellow-200',
        text: 'text-yellow-600',
      },
      green: {
        bg: 'bg-green-50',
        icon: 'bg-green-100 text-green-600',
        border: 'border-green-200',
        text: 'text-green-600',
      },
      blue: {
        bg: 'bg-blue-50',
        icon: 'bg-blue-100 text-blue-600',
        border: 'border-blue-200',
        text: 'text-blue-600',
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'bg-purple-100 text-purple-600',
        border: 'border-purple-200',
        text: 'text-purple-600',
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'bg-orange-100 text-orange-600',
        border: 'border-orange-200',
        text: 'text-orange-600',
      },
      red: {
        bg: 'bg-red-50',
        icon: 'bg-red-100 text-red-600',
        border: 'border-red-200',
        text: 'text-red-600',
      },
    };
    return classes[color] || classes.blue;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Chào mừng đến với CVA Dashboard</h1>
              <p className="text-blue-50 text-lg">
                Hệ thống quản lý xác minh và phát hành tín chỉ carbon
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm opacity-90">Tỷ lệ duyệt</p>
                <p className="text-2xl font-bold">{approvalRate}%</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Mini Charts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);

          return (
            <div
              key={index}
              className={`bg-white rounded-xl border-2 ${colors.border} shadow-sm p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-1">
                  {stat.changeType === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : stat.changeType === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  ) : null}
                  {stat.change && (
                    <span className={`text-xs font-semibold ${stat.changeType === 'up' ? 'text-green-600' : stat.changeType === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                      {stat.change}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 mb-4">{stat.label}</p>
              {/* Mini Chart */}
              <div className="h-16 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.chartData}>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={
                        stat.color === 'yellow'
                          ? '#f59e0b'
                          : stat.color === 'green'
                            ? '#10b981'
                            : stat.color === 'blue'
                              ? '#3b82f6'
                              : '#8b5cf6'
                      }
                      fill={
                        stat.color === 'yellow'
                          ? '#f59e0b'
                          : stat.color === 'green'
                            ? '#10b981'
                            : stat.color === 'blue'
                              ? '#3b82f6'
                              : '#8b5cf6'
                      }
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

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          const colors = getColorClasses(action.color);
          return (
            <Link
              key={index}
              to={action.link}
              className={`bg-white rounded-xl border-2 ${colors.border} shadow-sm p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group`}
            >
              <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{action.label}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
              <div className="mt-4 flex items-center text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                <span>Xem chi tiết</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Phân bố yêu cầu theo trạng thái
              </h3>
              <p className="text-sm text-gray-600 mt-1">Tổng số: {requests.length} yêu cầu</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded mr-2`} style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {item.value} ({requests.length > 0 ? ((item.value / requests.length) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Credits Bar Chart */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Tín chỉ phát hành mỗi tháng
              </h3>
              <p className="text-sm text-gray-600 mt-1">6 tháng gần đây</p>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">+12.3%</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="credits" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Metrics & Recent Activities */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Chỉ số hiệu suất
          </h3>
          <div className="space-y-6">
            {performanceMetrics.map((metric, index) => {
              const colorClasses = {
                green: 'bg-green-500',
                blue: 'bg-blue-500',
                purple: 'bg-purple-500',
              };
              const formatValue = (value, type) => {
                if (type === 'percentage') return `${value.toFixed(1)}%`;
                return formatNumber(value);
              };
              const valueType = metric.label.includes('Tỷ lệ') ? 'percentage' : 'number';
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    <span className="text-sm font-bold text-gray-800">
                      {formatValue(metric.current, valueType)} / {formatValue(metric.target, valueType)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${colorClasses[metric.color]} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, metric.percentage)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {metric.percentage.toFixed(1)}% hoàn thành
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Hoạt động gần đây
            </h3>
            <Link
              to="/verifier/verification-requests"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const colors = getColorClasses(activity.color);
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className={`${colors.bg} border-2 ${colors.border} rounded-xl p-4 hover:shadow-md hover:scale-[1.01] transition-all duration-300`}
                  >
                    <div className="flex items-start">
                      <div className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm mb-1">{activity.title}</p>
                        <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      {activity.value && (
                        <span className={`font-bold text-sm ${colors.text} ml-2 flex-shrink-0`}>
                          {activity.value}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-sm">Chưa có hoạt động nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-8 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FileCheck className="mr-3 w-5 h-5" />
            Yêu cầu gần đây
          </h3>
          <Link
            to="/verifier/verification-requests"
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center text-sm"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="text-center py-12">
            <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có yêu cầu nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Mã hồ sơ</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">EV Owner</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Ngày gửi</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Số tín chỉ</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Trạng thái</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">#{request.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{request.owner || request.evOwner || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{request.vehicle || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {request.date || (request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN') : 'N/A')}
                      </td>
                      <td className="py-4 px-4 font-bold text-blue-600">
                        {formatNumber(request.credits || request.creditAmount || 0)}
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(request.status)}</td>
                      <td className="py-4 px-4">
                        <Link
                          to="/verifier/verification-requests"
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center w-fit"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/verifier/verification-requests"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold inline-flex items-center"
              >
                <FileCheck className="w-5 h-5 mr-2" />
                Xem tất cả yêu cầu
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
