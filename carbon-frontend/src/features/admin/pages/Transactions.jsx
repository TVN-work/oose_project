import { useState } from 'react';
import { CreditCard, Search, Download, Eye, Edit, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const transactions = [
    {
      id: 'TX001',
      time: '15/12/2024 14:30',
      seller: 'Nguyễn Văn An',
      buyer: 'Green Corp',
      credits: '0.025',
      value: '₫125,000',
      fee: '₫3,750',
      status: 'completed',
      statusColor: 'green',
    },
    {
      id: 'TX002',
      time: '15/12/2024 13:15',
      seller: 'Trần Thị Bình',
      buyer: 'Eco Solutions',
      credits: '0.018',
      value: '₫90,000',
      fee: '₫2,700',
      status: 'completed',
      statusColor: 'green',
    },
    {
      id: 'TX003',
      time: '15/12/2024 12:45',
      seller: 'Lê Minh Cường',
      buyer: 'Clean Energy',
      credits: '0.032',
      value: '₫160,000',
      fee: '₫4,800',
      status: 'dispute',
      statusColor: 'red',
    },
  ];

  const stats = [
    { label: 'Hoàn thành', value: '789', color: 'green', icon: CheckCircle },
    { label: 'Đang xử lý', value: '45', color: 'orange', icon: Clock },
    { label: 'Tranh chấp', value: '3', color: 'red', icon: AlertTriangle },
    { label: 'Thất bại', value: '10', color: 'purple', icon: XCircle },
  ];

  const exportTransactions = () => {
    toast.info('📊 Đang xuất dữ liệu giao dịch...');
  };

  const getStatusBadge = (status, statusColor) => {
    const labels = {
      completed: 'Hoàn thành',
      processing: 'Đang xử lý',
      dispute: 'Tranh chấp',
      failed: 'Thất bại',
    };
    return (
      <span className={`bg-${statusColor}-100 text-${statusColor}-800 px-2 py-1 rounded-full text-xs font-semibold`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quản lý giao dịch</h2>
            <p className="opacity-90 mb-4">Tổng cộng 847 giao dịch với giá trị ₫62.3M</p>
            <div className="flex space-x-4">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">23 giao dịch hôm nay</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">3 tranh chấp</span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <CreditCard className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-lg transition-all">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${
                  stat.color === 'green'
                    ? 'from-green-500 to-green-600'
                    : stat.color === 'orange'
                    ? 'from-orange-500 to-orange-600'
                    : stat.color === 'red'
                    ? 'from-red-500 to-red-600'
                    : 'from-purple-500 to-purple-600'
                } rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className={`text-2xl font-bold ${
                stat.color === 'green'
                  ? 'text-green-600'
                  : stat.color === 'orange'
                  ? 'text-orange-600'
                  : stat.color === 'red'
                  ? 'text-red-600'
                  : 'text-purple-600'
              }`}>
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Chi tiết giao dịch</h3>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm mã giao dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="completed">Hoàn thành</option>
              <option value="processing">Đang xử lý</option>
              <option value="dispute">Tranh chấp</option>
            </select>
            <button
              onClick={exportTransactions}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Mã GD</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Thời gian</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Người bán</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Người mua</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Tín chỉ</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Giá trị</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Phí</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Trạng thái</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">#{tx.id}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">{tx.time}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-green-600 text-xs">🚗</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{tx.seller}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-blue-600 text-xs">🏢</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{tx.buyer}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-green-600">{tx.credits}</td>
                  <td className="py-4 px-4 font-bold text-blue-600">{tx.value}</td>
                  <td className="py-4 px-4 font-bold text-orange-600">{tx.fee}</td>
                  <td className="py-4 px-4">{getStatusBadge(tx.status, tx.statusColor)}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => toast.info(`👁️ Đang xem chi tiết giao dịch #${tx.id}`)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => toast.info(`✏️ Đang chỉnh sửa giao dịch #${tx.id}`)}
                        className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 transition-colors"
                      >
                        ✏️
                      </button>
                    </div>
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

export default TransactionsPage;

