import { useState } from 'react';
import { BarChart3, Download, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [filters, setFilters] = useState({
    timeRange: '30',
    startDate: '',
    endDate: '',
  });

  const monthlyData = [
    { month: 'T1', processed: 30, credits: 0.85 },
    { month: 'T2', processed: 35, credits: 0.95 },
    { month: 'T3', processed: 40, credits: 1.05 },
    { month: 'T4', processed: 32, credits: 0.90 },
    { month: 'T5', processed: 42, credits: 1.15 },
    { month: 'T6', processed: 45, credits: 1.20 },
    { month: 'T7', processed: 50, credits: 1.25 },
  ];

  const summaryData = [
    { month: 'Tháng 12/2024', approved: 42, rejected: 3, credits: 1.247, rate: 93.3 },
    { month: 'Tháng 11/2024', approved: 38, rejected: 4, credits: 1.156, rate: 90.5 },
    { month: 'Tháng 10/2024', approved: 35, rejected: 2, credits: 1.089, rate: 94.6 },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const exportReport = () => {
    toast.success('📊 Đã xuất báo cáo PDF thành công!');
  };

  const maxProcessed = Math.max(...monthlyData.map((d) => d.processed));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Report Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <BarChart3 className="mr-3 w-6 h-6" />
            Bộ lọc báo cáo
          </h3>
          <button
            onClick={exportReport}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo PDF
          </button>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <select
            name="timeRange"
            value={filters.timeRange}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="30">30 ngày qua</option>
            <option value="90">3 tháng qua</option>
            <option value="180">6 tháng qua</option>
            <option value="365">1 năm qua</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <span className="text-gray-600">đến</span>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Monthly Processing Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="mr-3 w-5 h-5" />
            Số hồ sơ xử lý theo tháng
          </h3>
          <div className="h-64 relative">
            <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
              <div className="flex items-end space-x-3 h-full w-full">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="flex flex-col items-center flex-1">
                    <div
                      className={`rounded-t-lg w-full transition-all duration-500 hover:opacity-80 ${
                        index === 6 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ height: `${(data.processed / maxProcessed) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{data.month}</span>
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
        </div>

        {/* Credits Issued Over Time */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Tổng tín chỉ phát hành theo thời gian</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl mb-4 block">📈</span>
              <p className="text-gray-600 font-semibold">Biểu đồ đường tín chỉ</p>
              <p className="text-sm text-gray-500 mt-2">Xu hướng tăng trưởng tích cực</p>
            </div>
          </div>
        </div>

        {/* Approval Rate Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Tỷ lệ chấp thuận</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="20"
                  strokeDasharray="231 250"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="20"
                  strokeDasharray="19 250"
                  strokeDashoffset="-231"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">92.5%</p>
                  <p className="text-xs text-gray-600">Tỷ lệ duyệt</p>
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
              <span className="text-sm font-semibold text-gray-800">92.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Từ chối</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">7.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Bảng tổng hợp theo tháng</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Tháng</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Hồ sơ đã duyệt</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Hồ sơ từ chối</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Tín chỉ phát hành</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Tỷ lệ duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {summaryData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold">{data.month}</td>
                  <td className="py-4 px-4 text-green-600 font-semibold">{data.approved}</td>
                  <td className="py-4 px-4 text-red-600 font-semibold">{data.rejected}</td>
                  <td className="py-4 px-4 text-blue-600 font-semibold">{data.credits}</td>
                  <td className="py-4 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                      {data.rate}%
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

export default Reports;

