import React from 'react';

const Transactions = ({ showNotification, showLoading, hideLoading }) => {
  const transactions = [
    {
      id: 'TX001',
      date: '15/12/2024',
      time: '09:30 AM',
      type: 'Bán tín chỉ',
      icon: '💰',
      amount: 50,
      value: '+$1,250.00',
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
      status: 'Thành công',
      statusColor: 'green',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 slide-in">
      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-3">💳</span>
            Lịch sử giao dịch
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
              <option>Tất cả trạng thái</option>
              <option>Thành công</option>
              <option>Đang xử lý</option>
              <option>Đã hủy</option>
            </select>
            <button
              onClick={() => showNotification('📊 Đã xuất file Excel thành công!', 'success')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📊 Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-8">
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
                    <p className="font-bold text-green-600">{tx.value}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`bg-${tx.statusColor}-100 text-${tx.statusColor}-800 px-3 py-1 rounded-full text-xs font-semibold`}>
                      {tx.status}
                    </span>
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

export default Transactions;

