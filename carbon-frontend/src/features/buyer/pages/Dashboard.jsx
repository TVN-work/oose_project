import { Link } from 'react-router-dom';
import { ShoppingCart, Award, DollarSign, Globe, TrendingUp, TrendingDown, ArrowRight, Activity, Target, Search, FileText, CreditCard } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useBuyerDashboardStats } from '../../../hooks/useBuyer';
import Loading from '../../../components/common/Loading';
import { formatCurrency, formatNumber } from '../../../utils';

const Dashboard = () => {
  // Fetch dashboard stats from database
  const { data: dashboardData, isLoading, error } = useBuyerDashboardStats();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const statsData = dashboardData?.stats || {
    creditsPurchased: 0,
    totalSpent: 0,
    certificates: 0,
    co2Reduced: 0,
  };
  
  const trendsData = dashboardData?.trends || {
    creditsChange: 0,
    spentChange: 0,
    certificatesChange: 0,
    co2Change: 0,
  };
  
  const chartsData = dashboardData?.charts || {
    purchaseTrend: [],
    spendingTrend: [],
    certificateDistribution: [],
  };
  
  const recentActivities = dashboardData?.recentActivities || [];

  // Stats cards with real data
  const stats = [
    {
      icon: ShoppingCart,
      value: formatNumber(statsData.creditsPurchased),
      label: 'Tín chỉ đã mua',
      change: `${trendsData.creditsChange >= 0 ? '+' : ''}${trendsData.creditsChange.toFixed(1)}%`,
      changeType: trendsData.creditsChange >= 0 ? 'up' : 'down',
      color: 'blue',
      chartData: chartsData.purchaseTrend || [],
    },
    {
      icon: DollarSign,
      value: formatCurrency(statsData.totalSpent),
      label: 'Tổng chi tiêu',
      change: `${trendsData.spentChange >= 0 ? '+' : ''}${trendsData.spentChange.toFixed(1)}%`,
      changeType: trendsData.spentChange >= 0 ? 'up' : 'down',
      color: 'green',
      chartData: chartsData.spendingTrend || [],
    },
    {
      icon: Award,
      value: formatNumber(statsData.certificates),
      label: 'Chứng nhận',
      change: `${trendsData.certificatesChange >= 0 ? '+' : ''}${trendsData.certificatesChange.toFixed(1)}%`,
      changeType: trendsData.certificatesChange >= 0 ? 'up' : 'down',
      color: 'purple',
      chartData: chartsData.purchaseTrend || [],
    },
    {
      icon: Globe,
      value: formatNumber(statsData.co2Reduced),
      label: 'Tấn CO₂ giảm',
      change: `${trendsData.co2Change >= 0 ? '+' : ''}${trendsData.co2Change.toFixed(1)}%`,
      changeType: trendsData.co2Change >= 0 ? 'up' : 'down',
      color: 'orange',
      chartData: chartsData.purchaseTrend || [],
    },
  ];

  // Use real chart data
  const purchaseTrendData = chartsData.purchaseTrend || [];
  const spendingTrendData = chartsData.spendingTrend || [];
  const certificateDistributionData = chartsData.certificateDistribution || [];

  const quickActions = [
    {
      icon: Search,
      label: 'Tìm kiếm',
      link: '/buyer/marketplace',
      color: 'blue',
      description: 'Tìm tín chỉ',
    },
    {
      icon: CreditCard,
      label: 'Lịch sử',
      link: '/buyer/purchase-history',
      color: 'green',
      description: 'Xem giao dịch',
    },
    {
      icon: Award,
      label: 'Chứng nhận',
      link: '/buyer/certificates',
      color: 'purple',
      description: 'Xem chứng nhận',
    },
    {
      icon: FileText,
      label: 'Báo cáo',
      link: '/buyer/reports',
      color: 'orange',
      description: 'Xem thống kê',
    },
  ];

  // Calculate performance metrics from real data
  const totalCertificates = certificateDistributionData.reduce((sum, item) => sum + (item.value || 0), 0);
  const thisMonthSpending = spendingTrendData[spendingTrendData.length - 1]?.value || 0;
  const avgMonthlySpending = spendingTrendData.length > 0
    ? spendingTrendData.reduce((sum, item) => sum + (item.value || 0), 0) / spendingTrendData.length
    : 0;
  
  // Calculate performance (percentage of target)
  const certificateTarget = totalCertificates * 0.8; // 80% of total certificates as target
  const spendingTarget = avgMonthlySpending * 1.2; // 120% of average as target
  
  const performanceMetrics = [
    { 
      label: 'Chứng nhận đã có', 
      current: totalCertificates, 
      target: certificateTarget, 
      color: 'blue',
      percentage: certificateTarget > 0 ? Math.min(100, (totalCertificates / certificateTarget * 100)) : 0,
    },
    { 
      label: 'Chi tiêu tháng này', 
      current: thisMonthSpending, 
      target: spendingTarget, 
      color: 'purple',
      percentage: spendingTarget > 0 ? Math.min(100, (thisMonthSpending / spendingTarget * 100)) : 0,
    },
    { 
      label: 'CO₂ giảm tháng này', 
      current: statsData.co2Reduced, 
      target: statsData.co2Reduced * 1.2 || 1, 
      color: 'green',
      percentage: statsData.co2Reduced > 0 
        ? Math.min(100, (statsData.co2Reduced / (statsData.co2Reduced * 1.2) * 100))
        : 0,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại!</h1>
              <p className="text-blue-50 text-lg">
                Quản lý và theo dõi việc mua tín chỉ carbon của bạn
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm opacity-90">Hiệu suất tháng này</p>
                <p className="text-2xl font-bold">
                  {performanceMetrics.length > 0
                    ? Math.round(performanceMetrics.reduce((sum, m) => sum + m.percentage, 0) / performanceMetrics.length)
                    : 0}%
                </p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Activity className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Mini Charts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: {
              bg: 'bg-blue-50',
              icon: 'bg-blue-100 text-blue-600',
              text: 'text-blue-600',
              border: 'border-blue-200',
            },
            green: {
              bg: 'bg-green-50',
              icon: 'bg-green-100 text-green-600',
              text: 'text-green-600',
              border: 'border-green-200',
            },
            purple: {
              bg: 'bg-purple-50',
              icon: 'bg-purple-100 text-purple-600',
              text: 'text-purple-600',
              border: 'border-purple-200',
            },
            orange: {
              bg: 'bg-orange-50',
              icon: 'bg-orange-100 text-orange-600',
              text: 'text-orange-600',
              border: 'border-orange-200',
            },
          };
          const colors = colorClasses[stat.color];

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
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-semibold ${stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
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
                        stat.color === 'blue'
                          ? '#3b82f6'
                          : stat.color === 'green'
                          ? '#10b981'
                          : stat.color === 'purple'
                          ? '#8b5cf6'
                          : '#f97316'
                      }
                      fill={
                        stat.color === 'blue'
                          ? '#3b82f6'
                          : stat.color === 'green'
                          ? '#10b981'
                          : stat.color === 'purple'
                          ? '#8b5cf6'
                          : '#f97316'
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

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Purchase Trend */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                Xu hướng mua tín chỉ
              </h3>
              <p className="text-sm text-gray-600 mt-1">6 tháng gần đây</p>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">+{trendsData.creditsChange.toFixed(1)}%</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={purchaseTrendData}>
                <defs>
                  <linearGradient id="colorPurchase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value} tín chỉ`, 'Đã mua']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#colorPurchase)"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Trend */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Xu hướng chi tiêu
              </h3>
              <p className="text-sm text-gray-600 mt-1">6 tháng gần đây</p>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">+{trendsData.spentChange.toFixed(1)}%</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [formatCurrency(value), 'Chi tiêu']}
                />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Performance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Certificate Distribution */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Phân bổ chứng nhận
            </h3>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={certificateDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {certificateDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {certificateDistributionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                  if (type === 'spending') return formatCurrency(value);
                  if (type === 'co2') return `${formatNumber(value)} tấn`;
                  return formatNumber(value);
                };
                const valueType = metric.label.includes('Chi tiêu') ? 'spending' 
                  : metric.label.includes('CO₂') ? 'co2' 
                  : 'number';
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
        </div>

        {/* Right Column - Quick Actions & Recent Activities */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-yellow-500" />
              Hành động nhanh
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const colorClasses = {
                  blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600 hover:text-blue-800',
                  green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-600 hover:text-green-800',
                  purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-600 hover:text-purple-800',
                  orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-600 hover:text-orange-800',
                };
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className={`${colorClasses[action.color]} border-2 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-1`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-semibold mb-1">{action.label}</p>
                    <p className="text-xs opacity-75">{action.description}</p>
                  </Link>
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
                to="/buyer/purchase-history"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => {
                  const colorClasses = {
                    green: 'bg-green-50 border-green-200',
                    blue: 'bg-blue-50 border-blue-200',
                    purple: 'bg-purple-50 border-purple-200',
                    orange: 'bg-orange-50 border-orange-200',
                  };
                  const textColors = {
                    green: 'text-green-600',
                    blue: 'text-blue-600',
                    purple: 'text-purple-600',
                    orange: 'text-orange-600',
                  };
                  return (
                    <div
                      key={index}
                      className={`${colorClasses[activity.color]} border-2 rounded-xl p-4 hover:shadow-md hover:scale-[1.01] transition-all duration-300`}
                    >
                      <div className="flex items-start">
                        <div className={`w-10 h-10 ${colorClasses[activity.color].replace('50', '100')} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                          {typeof activity.icon === 'string' ? (
                            <span className="text-xl">{activity.icon}</span>
                          ) : (
                            <activity.icon className={`w-5 h-5 ${textColors[activity.color]}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm mb-1">{activity.title}</p>
                          <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
                          {activity.date && (
                            <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString('vi-VN')}</p>
                          )}
                        </div>
                        {activity.value && (
                          <span className={`font-bold text-sm ${textColors[activity.color]} ml-2 flex-shrink-0`}>
                            {activity.value}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Chưa có hoạt động nào</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
