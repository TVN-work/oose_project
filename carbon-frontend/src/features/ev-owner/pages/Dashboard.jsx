import { Link } from 'react-router-dom';
import { Leaf, DollarSign, Route, Globe, TrendingUp, TrendingDown, Upload, Wallet, ArrowRight, Activity, Zap, Target, Tag, CheckCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Weekly revenue data for mini chart
  const weeklyRevenueData = [
    { day: 'T2', value: 120 },
    { day: 'T3', value: 190 },
    { day: 'T4', value: 150 },
    { day: 'T5', value: 220 },
    { day: 'T6', value: 180 },
    { day: 'T7', value: 250 },
    { day: 'CN', value: 200 },
  ];

  // Monthly CO2 reduction trend
  const co2TrendData = [
    { month: 'T7', value: 2.2 },
    { month: 'T8', value: 2.7 },
    { month: 'T9', value: 2.4 },
    { month: 'T10', value: 2.6 },
    { month: 'T11', value: 2.3 },
    { month: 'T12', value: 2.8 },
  ];

  // Revenue trend data
  const revenueTrendData = [
    { month: 'T7', value: 520 },
    { month: 'T8', value: 630 },
    { month: 'T9', value: 560 },
    { month: 'T10', value: 610 },
    { month: 'T11', value: 540 },
    { month: 'T12', value: 587 },
  ];

  // Credit distribution for pie chart
  const creditDistributionData = [
    { name: 'Đã bán', value: 189, color: '#10b981' },
    { name: 'Đang niêm yết', value: 45, color: '#3b82f6' },
    { name: 'Có sẵn', value: 11, color: '#8b5cf6' },
  ];

  const stats = [
    {
      icon: Leaf,
      value: '245',
      label: 'Tín chỉ có sẵn',
      change: '+12.3%',
      changeType: 'up',
      color: 'green',
      chartData: weeklyRevenueData,
    },
    {
      icon: DollarSign,
      value: '$8,750',
      label: 'Tổng thu nhập',
      change: '+15.2%',
      changeType: 'up',
      color: 'blue',
      chartData: weeklyRevenueData,
    },
    {
      icon: Route,
      value: '12,450',
      label: 'Km đã đi',
      change: '+8.9%',
      changeType: 'up',
      color: 'purple',
      chartData: weeklyRevenueData,
    },
    {
      icon: Globe,
      value: '18.1',
      label: 'Tấn CO₂ tiết kiệm',
      change: '+12.3%',
      changeType: 'up',
      color: 'orange',
      chartData: weeklyRevenueData,
    },
  ];

  const recentActivities = [
    {
      icon: Upload,
      title: 'Tải dữ liệu hành trình thành công',
      description: '125 km • Tạo 15 tín chỉ carbon',
      time: '2 giờ trước',
      value: '+15 tín chỉ',
      color: 'green',
      type: 'upload',
    },
    {
      icon: DollarSign,
      title: 'Bán tín chỉ thành công',
      description: '50 tín chỉ cho Carbon Buyer',
      time: '1 ngày trước',
      value: '+$1,250',
      color: 'blue',
      type: 'sale',
    },
    {
      icon: Tag,
      title: 'Niêm yết tín chỉ mới',
      description: '80 tín chỉ với giá $25/tín chỉ',
      time: '3 ngày trước',
      value: null,
      color: 'purple',
      type: 'listing',
    },
    {
      icon: CheckCircle,
      title: 'Tín chỉ được xác minh',
      description: 'CVA đã duyệt 30 tín chỉ',
      time: '5 ngày trước',
      value: '+30 tín chỉ',
      color: 'green',
      type: 'verified',
    },
  ];

  const quickActions = [
    {
      icon: Upload,
      label: 'Tải dữ liệu',
      link: '/ev-owner/upload-trips',
      color: 'green',
      description: 'Tải hành trình mới',
    },
    {
      icon: Wallet,
      label: 'Ví Carbon',
      link: '/ev-owner/carbon-wallet',
      color: 'blue',
      description: 'Xem số dư',
    },
    {
      icon: Leaf,
      label: 'Niêm yết',
      link: '/ev-owner/listings',
      color: 'purple',
      description: 'Bán tín chỉ',
    },
    {
      icon: Activity,
      label: 'Báo cáo',
      link: '/ev-owner/reports',
      color: 'orange',
      description: 'Xem thống kê',
    },
  ];

  const performanceMetrics = [
    { label: 'Mục tiêu tháng này', current: 75, target: 100, color: 'green' },
    { label: 'Tín chỉ đã bán', current: 60, target: 80, color: 'blue' },
    { label: 'Doanh thu', current: 85, target: 100, color: 'purple' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại!</h1>
              <p className="text-green-50 text-lg">
                Quản lý và kiếm tiền từ việc lái xe điện của bạn
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm opacity-90">Hiệu suất tháng này</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Zap className="w-8 h-8" />
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
            green: {
              bg: 'bg-green-50',
              icon: 'bg-green-100 text-green-600',
              text: 'text-green-600',
              border: 'border-green-200',
            },
            blue: {
              bg: 'bg-blue-50',
              icon: 'bg-blue-100 text-blue-600',
              text: 'text-blue-600',
              border: 'border-blue-200',
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
                        stat.color === 'green'
                          ? '#10b981'
                          : stat.color === 'blue'
                          ? '#3b82f6'
                          : stat.color === 'purple'
                          ? '#8b5cf6'
                          : '#f97316'
                      }
                      fill={
                        stat.color === 'green'
                          ? '#10b981'
                          : stat.color === 'blue'
                          ? '#3b82f6'
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
        {/* CO2 Reduction Trend */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-green-600" />
                Xu hướng giảm CO₂
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
              <AreaChart data={co2TrendData}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                  formatter={(value) => [`${value} tấn`, 'CO₂ giảm']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorCo2)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                Xu hướng doanh thu
              </h3>
              <p className="text-sm text-gray-600 mt-1">6 tháng gần đây</p>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">+15.2%</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`$${value}`, 'Doanh thu']}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Performance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Credit Distribution */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-green-600" />
              Phân bổ tín chỉ
            </h3>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={creditDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {creditDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {creditDistributionData.map((item, index) => (
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
                const percentage = (metric.current / metric.target) * 100;
                const colorClasses = {
                  green: 'bg-green-500',
                  blue: 'bg-blue-500',
                  purple: 'bg-purple-500',
                };
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                      <span className="text-sm font-bold text-gray-800">
                        {metric.current} / {metric.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${colorClasses[metric.color]} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
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
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Hành động nhanh
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const colorClasses = {
                  green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-600 hover:text-green-800',
                  blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600 hover:text-blue-800',
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
                to="/ev-owner/transactions"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => {
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
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      {activity.value && (
                        <span className={`font-bold text-sm ${textColors[activity.color]} ml-2 flex-shrink-0`}>
                          {activity.value}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
