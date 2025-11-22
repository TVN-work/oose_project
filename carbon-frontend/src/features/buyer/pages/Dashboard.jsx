import { Link } from 'react-router-dom';
import { ShoppingCart, Award, DollarSign, Globe } from 'lucide-react';
import { formatCurrencyFromUsd } from '../../../utils';

const Dashboard = () => {
  const stats = [
    {
      icon: ShoppingCart,
      value: '587',
      label: 'Tín chỉ đã mua',
      color: 'blue',
    },
    {
      icon: DollarSign,
      value: formatCurrencyFromUsd(12450),
      label: 'Tổng chi tiêu',
      color: 'green',
    },
    {
      icon: Award,
      value: '8',
      label: 'Chứng nhận',
      color: 'purple',
    },
    {
      icon: Globe,
      value: '43.2',
      label: 'Tấn CO2 giảm',
      color: 'orange',
    },
  ];

  const recentActivities = [
    {
      icon: '✅',
      title: 'Mua thành công 85 tín chỉ',
      description: 'Từ Trần Thị B • 2 giờ trước',
      value: `+${formatCurrencyFromUsd(1885)}`,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-600',
    },
    {
      icon: '🏆',
      title: 'Nhận chứng nhận mới',
      description: 'Chứng nhận CC-001234 • 1 ngày trước',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-600',
    },
    {
      icon: '📊',
      title: 'Cập nhật hạng thành viên',
      description: 'Nâng cấp lên Gold Member • 3 ngày trước',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      valueColor: 'text-purple-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🌱</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Chào mừng đến với Carbon Credit Dashboard
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Đây là trung tâm điều khiển của bạn để quản lý việc mua bán tín chỉ carbon.
            Khám phá các tính năng và bắt đầu hành trình bảo vệ môi trường ngay hôm nay!
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/buyer/marketplace"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              🛒 Khám phá Marketplace
            </Link>
            <Link
              to="/buyer/certificates"
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
            >
              🏆 Xem chứng nhận
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100',
            green: 'bg-green-100',
            purple: 'bg-purple-100',
            orange: 'bg-orange-100',
          };
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center"
            >
              <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📈</span>
          Hoạt động gần đây
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center mr-4`}>
                <span className={activity.iconColor}>{activity.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              {activity.value && (
                <span className={`${activity.valueColor} font-semibold`}>
                  {activity.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

