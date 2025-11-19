// Ví dụ: Dashboard component sử dụng API thật
// Đổi tên file này thành Dashboard.jsx và thay thế file hiện tại

import { Link } from 'react-router-dom';
import { Leaf, DollarSign, Route, Globe, TrendingUp, TrendingDown, Upload, Wallet, ArrowRight, Activity, Zap, Target } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDashboardStats } from '../../../hooks/useEvOwner';
import Loading from '../../../components/common/Loading';

const Dashboard = () => {
  // Fetch data từ API
  const { data, isLoading, error } = useDashboardStats();

  // Hiển thị loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không thể tải dữ liệu dashboard</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Fallback data nếu API trả về null/undefined (cho development)
  const dashboardData = data || {
    stats: {
      availableCredits: 245,
      totalRevenue: 8750,
      totalDistance: 12450,
      totalCo2Saved: 18.1,
    },
    trends: {
      creditsChange: 12.3,
      revenueChange: 15.2,
      distanceChange: 8.9,
      co2Change: 12.3,
    },
    charts: {
      weeklyRevenue: [
        { day: 'T2', value: 120 },
        { day: 'T3', value: 190 },
        { day: 'T4', value: 150 },
        { day: 'T5', value: 220 },
        { day: 'T6', value: 180 },
        { day: 'T7', value: 250 },
        { day: 'CN', value: 200 },
      ],
      co2Trend: [
        { month: 'T7', value: 2.2 },
        { month: 'T8', value: 2.7 },
        { month: 'T9', value: 2.4 },
        { month: 'T10', value: 2.6 },
        { month: 'T11', value: 2.3 },
        { month: 'T12', value: 2.8 },
      ],
      revenueTrend: [
        { month: 'T7', value: 520 },
        { month: 'T8', value: 630 },
        { month: 'T9', value: 560 },
        { month: 'T10', value: 610 },
        { month: 'T11', value: 540 },
        { month: 'T12', value: 587 },
      ],
      creditDistribution: [
        { name: 'Đã bán', value: 189, color: '#10b981' },
        { name: 'Đang niêm yết', value: 45, color: '#3b82f6' },
        { name: 'Có sẵn', value: 11, color: '#8b5cf6' },
      ],
    },
    recentActivities: [],
  };

  const { stats: statsData, trends, charts, recentActivities } = dashboardData;

  // Format stats từ API response
  const stats = [
    {
      icon: Leaf,
      value: statsData?.availableCredits?.toLocaleString() || '0',
      label: 'Tín chỉ có sẵn',
      change: `${trends?.creditsChange >= 0 ? '+' : ''}${trends?.creditsChange || 0}%`,
      changeType: trends?.creditsChange >= 0 ? 'up' : 'down',
      color: 'green',
      chartData: charts?.weeklyRevenue || [],
    },
    {
      icon: DollarSign,
      value: `$${statsData?.totalRevenue?.toLocaleString() || '0'}`,
      label: 'Tổng thu nhập',
      change: `${trends?.revenueChange >= 0 ? '+' : ''}${trends?.revenueChange || 0}%`,
      changeType: trends?.revenueChange >= 0 ? 'up' : 'down',
      color: 'blue',
      chartData: charts?.weeklyRevenue || [],
    },
    {
      icon: Route,
      value: statsData?.totalDistance?.toLocaleString() || '0',
      label: 'Km đã đi',
      change: `${trends?.distanceChange >= 0 ? '+' : ''}${trends?.distanceChange || 0}%`,
      changeType: trends?.distanceChange >= 0 ? 'up' : 'down',
      color: 'purple',
      chartData: charts?.weeklyRevenue || [],
    },
    {
      icon: Globe,
      value: statsData?.totalCo2Saved?.toFixed(1) || '0',
      label: 'Tấn CO₂ tiết kiệm',
      change: `${trends?.co2Change >= 0 ? '+' : ''}${trends?.co2Change || 0}%`,
      changeType: trends?.co2Change >= 0 ? 'up' : 'down',
      color: 'orange',
      chartData: charts?.weeklyRevenue || [],
    },
  ];

  // Sử dụng data từ API cho charts
  const weeklyRevenueData = charts?.weeklyRevenue || [];
  const co2TrendData = charts?.co2Trend || [];
  const revenueTrendData = charts?.revenueTrend || [];
  const creditDistributionData = charts?.creditDistribution || [];

  // Rest of your Dashboard component code...
  // (giữ nguyên phần render UI, chỉ thay đổi data source)

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            {/* Stat card content */}
          </div>
        ))}
      </div>

      {/* Charts and other content */}
      {/* ... */}
    </div>
  );
};

export default Dashboard;

