import React from 'react';

const Reports = ({ showNotification, showLoading, hideLoading }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3">📈</span>
          Báo cáo chi tiết
        </h3>
        <button
          onClick={() => showNotification('📄 Đã xuất báo cáo PDF thành công!', 'success')}
          className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center"
        >
          <span className="mr-2">📄</span>
          Xuất báo cáo PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-800">Thu nhập tháng này</h4>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-green-600">$2,450</p>
          <p className="text-sm text-gray-600">+15% so với tháng trước</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-800">Tín chỉ đã bán</h4>
            <span className="text-2xl">🌱</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">98</p>
          <p className="text-sm text-gray-600">Trong 30 ngày qua</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-800">CO₂ tiết kiệm</h4>
            <span className="text-2xl">🌍</span>
          </div>
          <p className="text-3xl font-bold text-green-600">2.4</p>
          <p className="text-sm text-gray-600">tấn CO₂ tháng này</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-800">Km đã đi</h4>
            <span className="text-2xl">🛣️</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">1,250</p>
          <p className="text-sm text-gray-600">Tháng này</p>
        </div>
      </div>

      {/* Monthly Revenue Table */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📋</span>
          Tổng hợp doanh thu theo tháng
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Tháng</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Tín chỉ tạo</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Tín chỉ bán</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Doanh thu</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">CO₂ tiết kiệm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 font-semibold text-gray-800">Tháng 7/2024</td>
                <td className="py-4 px-4 text-blue-600 font-semibold">32</td>
                <td className="py-4 px-4 text-green-600 font-semibold">28</td>
                <td className="py-4 px-4 text-green-600 font-bold">$2,450</td>
                <td className="py-4 px-4 text-gray-600">2.4 tấn</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 font-semibold text-gray-800">Tháng 6/2024</td>
                <td className="py-4 px-4 text-blue-600 font-semibold">38</td>
                <td className="py-4 px-4 text-green-600 font-semibold">35</td>
                <td className="py-4 px-4 text-green-600 font-bold">$2,125</td>
                <td className="py-4 px-4 text-gray-600">2.8 tấn</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

