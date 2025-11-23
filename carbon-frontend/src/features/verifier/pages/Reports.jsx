import { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Filter,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Award,
  Activity,
  FileSpreadsheet,
  File,
  Target,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useVerifierReports } from '../../../hooks/useVerifier';
import Loading from '../../../components/common/Loading';
import { formatNumber } from '../../../utils';

const Reports = () => {
  const [filters, setFilters] = useState({
    timeRange: '30',
    startDate: '',
    endDate: '',
  });
  const [exportLoading, setExportLoading] = useState(false);

  const { data: reportsData, isLoading } = useVerifierReports(filters);
  
  // Mock data - should come from API
  const monthlyData = [
    { month: 'T7', processed: 50, credits: 1.25, approved: 47, rejected: 3 },
    { month: 'T8', processed: 45, credits: 1.20, approved: 42, rejected: 3 },
    { month: 'T9', processed: 42, credits: 1.15, approved: 39, rejected: 3 },
    { month: 'T10', processed: 40, credits: 1.05, approved: 38, rejected: 2 },
    { month: 'T11', processed: 38, credits: 0.95, approved: 35, rejected: 3 },
    { month: 'T12', processed: 35, credits: 0.85, approved: 32, rejected: 3 },
  ];

  const summaryData = [
    { month: 'Tháng 12/2024', approved: 42, rejected: 3, credits: 1.247, rate: 93.3 },
    { month: 'Tháng 11/2024', approved: 38, rejected: 4, credits: 1.156, rate: 90.5 },
    { month: 'Tháng 10/2024', approved: 35, rejected: 2, credits: 1.089, rate: 94.6 },
  ];

  // Calculate stats
  const totalApproved = summaryData.reduce((sum, d) => sum + d.approved, 0);
  const totalRejected = summaryData.reduce((sum, d) => sum + d.rejected, 0);
  const totalCredits = summaryData.reduce((sum, d) => sum + d.credits, 0);
  const avgApprovalRate = summaryData.reduce((sum, d) => sum + d.rate, 0) / summaryData.length;

  // Approval rate distribution
  const approvalDistribution = [
    { name: 'Đã duyệt', value: totalApproved, color: '#10b981' },
    { name: 'Từ chối', value: totalRejected, color: '#ef4444' },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Export to CSV/Excel
  const exportToCSV = () => {
    setExportLoading(true);
    try {
      // Prepare CSV data
      const csvHeaders = ['Tháng', 'Hồ sơ đã duyệt', 'Hồ sơ từ chối', 'Tín chỉ phát hành', 'Tỷ lệ duyệt (%)'];
      const csvRows = summaryData.map(row => [
        row.month,
        row.approved,
        row.rejected,
        row.credits,
        row.rate
      ]);

      // Convert to CSV string
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      // Add BOM for Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bao-cao-tin-chi-carbon-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Đã xuất báo cáo CSV thành công!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Có lỗi xảy ra khi xuất báo cáo');
    } finally {
      setExportLoading(false);
    }
  };

  // Export to PDF (simplified - using print)
  const exportToPDF = () => {
    setExportLoading(true);
    try {
      // Create a printable version
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Vui lòng cho phép popup để xuất PDF');
        setExportLoading(false);
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Báo cáo phát hành tín chỉ carbon</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #3b82f6; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Báo cáo phát hành tín chỉ carbon</h1>
            <p>Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
            <table>
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Hồ sơ đã duyệt</th>
                  <th>Hồ sơ từ chối</th>
                  <th>Tín chỉ phát hành</th>
                  <th>Tỷ lệ duyệt (%)</th>
                </tr>
              </thead>
              <tbody>
                ${summaryData.map(row => `
                  <tr>
                    <td>${row.month}</td>
                    <td>${row.approved}</td>
                    <td>${row.rejected}</td>
                    <td>${formatNumber(row.credits)}</td>
                    <td>${row.rate}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        toast.success('Đã mở cửa sổ in. Vui lòng chọn "Lưu dưới dạng PDF"');
        setExportLoading(false);
      }, 500);
    } catch (error) {
      console.error('Export PDF error:', error);
      toast.error('Có lỗi xảy ra khi xuất PDF');
      setExportLoading(false);
    }
  };

  const maxProcessed = Math.max(...monthlyData.map((d) => d.processed));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3" />
              Báo cáo phát hành tín chỉ carbon
            </h1>
            <p className="text-purple-50 text-lg">
              Xuất báo cáo và thống kê phát hành tín chỉ carbon
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border-2 border-green-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{formatNumber(totalApproved)}</p>
          <p className="text-sm text-gray-600">Hồ sơ đã duyệt</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-red-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{formatNumber(totalRejected)}</p>
          <p className="text-sm text-gray-600">Hồ sơ từ chối</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{formatNumber(totalCredits)}</p>
          <p className="text-sm text-gray-600">Tổng tín chỉ phát hành</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-purple-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{avgApprovalRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Tỷ lệ duyệt trung bình</p>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Filter className="mr-3 w-5 h-5" />
            Bộ lọc báo cáo
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              disabled={exportLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              {exportLoading ? 'Đang xuất...' : 'Xuất Excel'}
            </button>
            <button
              onClick={exportToPDF}
              disabled={exportLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <File className="w-4 h-4 mr-2" />
              {exportLoading ? 'Đang xuất...' : 'Xuất PDF'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              name="timeRange"
              value={filters.timeRange}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="30">30 ngày qua</option>
              <option value="90">3 tháng qua</option>
              <option value="180">6 tháng qua</option>
              <option value="365">1 năm qua</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <span className="text-gray-600">đến</span>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Processing Chart */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <TrendingUp className="mr-2 w-5 h-5 text-blue-600" />
                Số hồ sơ xử lý theo tháng
              </h3>
              <p className="text-sm text-gray-600 mt-1">6 tháng gần đây</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="processed" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credits Issued Over Time */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Award className="mr-2 w-5 h-5 text-green-600" />
                Tổng tín chỉ phát hành theo thời gian
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
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
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
                  formatter={(value) => [`${formatNumber(value)} tín chỉ`, 'Tín chỉ']}
                />
                <Area
                  type="monotone"
                  dataKey="credits"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorCredits)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approval Rate Pie Chart */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Activity className="mr-2 w-5 h-5 text-purple-600" />
                Tỷ lệ chấp thuận
              </h3>
              <p className="text-sm text-gray-600 mt-1">Tổng số hồ sơ đã xử lý</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={approvalDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {approvalDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {approvalDistribution.map((item, index) => {
              const total = approvalDistribution.reduce((sum, d) => sum + d.value, 0);
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded mr-2`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatNumber(item.value)} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <BarChart3 className="mr-2 w-5 h-5 text-orange-600" />
                So sánh theo tháng
              </h3>
              <p className="text-sm text-gray-600 mt-1">Hồ sơ đã duyệt vs từ chối</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="approved" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="rejected" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-gray-600">Đã duyệt</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-gray-600">Từ chối</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-8 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FileText className="mr-3 w-5 h-5" />
            Bảng tổng hợp theo tháng
          </h3>
          <div className="text-sm text-gray-600">
            Tổng: <span className="font-semibold text-gray-800">{summaryData.length}</span> tháng
          </div>
        </div>

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
                  <td className="py-4 px-4 text-green-600 font-semibold flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {formatNumber(data.approved)}
                  </td>
                  <td className="py-4 px-4 text-red-600 font-semibold flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    {formatNumber(data.rejected)}
                  </td>
                  <td className="py-4 px-4 text-blue-600 font-semibold flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {formatNumber(data.credits)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold border border-green-300">
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
