import { Link } from 'react-router-dom';
import { Clock, CheckCircle, TrendingUp, FileCheck } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      icon: Clock,
      value: '8',
      label: 'Số yêu cầu đang chờ duyệt',
      color: 'yellow',
    },
    {
      icon: CheckCircle,
      value: '247',
      label: 'Tổng tín chỉ đã xác minh',
      color: 'green',
    },
    {
      icon: TrendingUp,
      value: '92.5%',
      label: 'Tỷ lệ chấp thuận (%)',
      color: 'blue',
    },
  ];

  const recentRequests = [
    {
      id: 'VR001',
      owner: 'Nguyễn Văn An',
      vehicle: 'Tesla Model 3',
      date: '15/12/2024',
      status: 'pending',
      credits: '0.025',
    },
    {
      id: 'VR002',
      owner: 'Trần Thị Bình',
      vehicle: 'VinFast VF8',
      date: '14/12/2024',
      status: 'approved',
      credits: '0.022',
    },
    {
      id: 'VR003',
      owner: 'Lê Minh Cường',
      vehicle: 'BMW iX3',
      date: '13/12/2024',
      status: 'processing',
      credits: '0.018',
    },
    {
      id: 'VR004',
      owner: 'Phạm Thị Dung',
      vehicle: 'Hyundai Kona EV',
      date: '12/12/2024',
      status: 'rejected',
      credits: '0.015',
    },
    {
      id: 'VR005',
      owner: 'Hoàng Văn Em',
      vehicle: 'Audi e-tron',
      date: '10/12/2024',
      status: 'pending',
      credits: '0.020',
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      processing: 'Đang xử lý',
      rejected: 'Từ chối',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status] || badges.pending}`}>
        {labels[status] || labels.pending}
      </span>
    );
  };

  const getColorClasses = (color) => {
    const classes = {
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    };
    return classes[color] || {};
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🏛️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chào mừng đến với CVA Dashboard</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Hệ thống quản lý xác minh và phát hành tín chỉ carbon. Xem xét yêu cầu, xác minh dữ liệu và cấp phát tín chỉ
            carbon cho các chủ xe điện!
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/verifier/verification-requests"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              📋 Xem yêu cầu xác minh
            </Link>
            <Link
              to="/verifier/issue-credits"
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
            >
              🏷️ Phát hành tín chỉ
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const { bg } = getColorClasses(stat.color);
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
              <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">🥧</span>
            Phân bố yêu cầu theo trạng thái
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="20" strokeDasharray="175 250" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="20" strokeDasharray="50 250" strokeDashoffset="-175" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="20" strokeDasharray="25 250" strokeDashoffset="-225" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">267</p>
                  <p className="text-xs text-gray-600">Tổng yêu cầu</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Đã duyệt</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">187 (70%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Chờ duyệt</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">53 (20%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Từ chối</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">27 (10%)</span>
            </div>
          </div>
        </div>

        {/* Monthly Credits Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">📊</span>
            Tín chỉ phát hành mỗi tháng
          </h3>
          <div className="h-64 relative">
            <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
              <div className="flex items-end space-x-3 h-full w-full">
                {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((month, index) => (
                  <div key={month} className="flex flex-col items-center flex-1">
                    <div
                      className={`rounded-t-lg w-full transition-all duration-500 hover:opacity-80 ${
                        index === 6 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ height: `${45 + index * 7.5}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{month}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-2">
              <span>50</span>
              <span>40</span>
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-gray-600">Tín chỉ đã cấp</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-gray-600">Tháng hiện tại</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FileCheck className="mr-3 w-5 h-5" />
            Yêu cầu gần đây
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Mã hồ sơ</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">EV Owner</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Ngày gửi</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Trạng thái</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">#{request.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 text-sm">🚗</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{request.owner}</p>
                        <p className="text-xs text-gray-500">{request.vehicle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{request.date}</td>
                  <td className="py-4 px-4">{getStatusBadge(request.status)}</td>
                  <td className="py-4 px-4">
                    <Link
                      to={`/verifier/verification-requests/${request.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      👁️ Xem chi tiết
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
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            📄 Xem tất cả yêu cầu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

