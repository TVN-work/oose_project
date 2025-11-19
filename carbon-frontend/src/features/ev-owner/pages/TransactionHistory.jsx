import { useState } from 'react';
import { CreditCard, Download, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionHistory = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const transactions = [
    {
      id: 'TX001',
      date: '15/12/2024',
      time: '09:30 AM',
      type: 'Bán tín chỉ',
      icon: '💰',
      amount: '50',
      value: '+$1,250.00',
      price: '$25.00/tín chỉ',
      status: 'Thành công',
      statusColor: 'green',
    },
    {
      id: 'TX002',
      date: '14/12/2024',
      time: '02:15 PM',
      type: 'Tạo tín chỉ',
      icon: '🌱',
      amount: '+15',
      value: '125 km',
      price: 'Hành trình EV',
      status: 'Thành công',
      statusColor: 'green',
    },
    {
      id: 'TX003',
      date: '13/12/2024',
      time: '11:45 AM',
      type: 'Rút tiền',
      icon: '💸',
      amount: '-',
      value: '-$800.00',
      price: 'Chuyển khoản',
      status: 'Đang xử lý',
      statusColor: 'yellow',
    },
  ];

  const summary = [
    { label: 'Giao dịch thành công', value: '18', color: 'green' },
    { label: 'Đang xử lý', value: '3', color: 'yellow' },
    { label: 'Đã hủy', value: '2', color: 'red' },
  ];

  const handleExport = () => {
    toast.loading('📊 Đang xuất file Excel...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('📊 Đã xuất file Excel thành công!');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <CreditCard className="mr-3" />
            Lịch sử giao dịch
          </h3>

          <div className="flex flex-wrap items-center gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="processing">Đang xử lý</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            >
              <option value="">Tất cả loại</option>
              <option value="sell">Bán tín chỉ</option>
              <option value="create">Tạo tín chỉ</option>
              <option value="withdraw">Rút tiền</option>
            </select>

            <button
              onClick={handleExport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Mã giao dịch</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Ngày</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Loại</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Số tín chỉ</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Giá trị</th>
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
                  <td className="py-4 px-4 text-gray-600">
                    <div>
                      <p className="font-semibold">{tx.date}</p>
                      <p className="text-xs text-gray-500">{tx.time}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 text-sm">{tx.icon}</span>
                      </span>
                      <span className="font-semibold text-gray-800">{tx.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold">{tx.amount}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className={`font-bold ${tx.value.startsWith('+') ? 'text-green-600' : tx.value.startsWith('-') ? 'text-purple-600' : 'text-blue-600'}`}>
                        {tx.value}
                      </p>
                      <p className="text-xs text-gray-500">{tx.price}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.statusColor === 'green'
                          ? 'bg-green-100 text-green-800'
                          : tx.statusColor === 'yellow'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      👁️ Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        {summary.map((item, index) => {
          const colorClasses = {
            green: 'bg-green-100 text-green-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            red: 'bg-red-100 text-red-600',
          };
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 text-center"
            >
              <div className={`w-12 h-12 ${colorClasses[item.color]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">
                  {item.color === 'green' ? '✅' : item.color === 'yellow' ? '⏳' : '❌'}
                </span>
              </div>
              <p className={`text-2xl font-bold ${colorClasses[item.color].split(' ')[1]}`}>
                {item.value}
              </p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionHistory;

