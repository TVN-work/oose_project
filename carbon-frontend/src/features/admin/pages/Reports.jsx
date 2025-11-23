import { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp,
  Filter,
  Calendar,
  FileText,
  Users,
  CreditCard,
  DollarSign,
  Tag,
  FileSpreadsheet,
  File,
  Activity,
  Globe,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAdminReports } from '../../../hooks/useAdmin';
import Loading from '../../../components/common/Loading';
import { formatNumber, formatCurrency } from '../../../utils';

const ReportsPage = () => {
  const [filters, setFilters] = useState({
    timeRange: '30',
    startDate: '',
    endDate: '',
    reportType: 'all',
  });
  const [exportLoading, setExportLoading] = useState(false);

  const { data: reportsData, isLoading } = useAdminReports(filters);
  
  // Mock data - should come from API
  const transactionTrend = [
    { month: 'T7', transactions: 120, revenue: 6000000 },
    { month: 'T8', transactions: 135, revenue: 6750000 },
    { month: 'T9', transactions: 142, revenue: 7100000 },
    { month: 'T10', transactions: 158, revenue: 7900000 },
    { month: 'T11', transactions: 165, revenue: 8250000 },
    { month: 'T12', transactions: 180, revenue: 9000000 },
  ];

  const userGrowth = [
    { month: 'T7', users: 850, evOwners: 420, buyers: 350, verifiers: 80 },
    { month: 'T8', users: 920, evOwners: 450, buyers: 380, verifiers: 90 },
    { month: 'T9', users: 1000, evOwners: 480, buyers: 410, verifiers: 110 },
    { month: 'T10', users: 1080, evOwners: 510, buyers: 440, verifiers: 130 },
    { month: 'T11', users: 1150, evOwners: 540, buyers: 470, verifiers: 140 },
    { month: 'T12', users: 1247, evOwners: 580, buyers: 510, verifiers: 157 },
  ];

  const creditDistribution = [
    { name: 'EV Owner', value: 580, color: '#10b981' },
    { name: 'Buyer', value: 510, color: '#3b82f6' },
    { name: 'Verifier', value: 157, color: '#8b5cf6' },
  ];

  const monthlySummary = [
    { month: 'Tháng 12/2024', transactions: 180, revenue: 9000000, credits: 12.5, users: 1247 },
    { month: 'Tháng 11/2024', transactions: 165, revenue: 8250000, credits: 11.2, users: 1150 },
    { month: 'Tháng 10/2024', transactions: 158, revenue: 7900000, credits: 10.8, users: 1080 },
  ];

  // Calculate stats
  const totalTransactions = monthlySummary.reduce((sum, d) => sum + d.transactions, 0);
  const totalRevenue = monthlySummary.reduce((sum, d) => sum + d.revenue, 0);
  const totalCredits = monthlySummary.reduce((sum, d) => sum + d.credits, 0);
  const totalUsers = monthlySummary[0]?.users || 0;

  const stats = [
    {
      icon: CreditCard,
      value: formatNumber(totalTransactions),
      label: 'Tổng giao dịch',
      color: 'blue',
      change: '+12.3%',
    },
    {
      icon: DollarSign,
      value: formatCurrency(totalRevenue),
      label: 'Tổng doanh thu',
      color: 'green',
      change: '+15.7%',
    },
    {
      icon: Tag,
      value: formatNumber(totalCredits),
      label: 'Tổng tín chỉ',
      color: 'orange',
      change: '+8.9%',
    },
    {
      icon: Users,
      value: formatNumber(totalUsers),
      label: 'Tổng người dùng',
      color: 'purple',
      change: '+8.4%',
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Export to CSV/Excel
  const exportToCSV = () => {
    setExportLoading(true);
    try {
      const csvHeaders = ['Tháng', 'Giao dịch', 'Doanh thu (VND)', 'Tín chỉ', 'Người dùng'];
      const csvRows = monthlySummary.map(row => [
        row.month,
        row.transactions,
        row.revenue,
        row.credits,
        row.users
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bao-cao-he-thong-${new Date().toISOString().split('T')[0]}.csv`;
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

  // Export to PDF
  const exportToPDF = () => {
    setExportLoading(true);
    try {
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
            <title>Báo cáo tổng hợp hệ thống</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #3b82f6; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Báo cáo tổng hợp hệ thống Carbon Credit Marketplace</h1>
            <p>Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
            <table>
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Giao dịch</th>
                  <th>Doanh thu (VND)</th>
                  <th>Tín chỉ</th>
                  <th>Người dùng</th>
                </tr>
              </thead>
              <tbody>
                ${monthlySummary.map(row => `
                  <tr>
                    <td>${row.month}</td>
                    <td>${row.transactions}</td>
                    <td>${formatCurrency(row.revenue)}</td>
                    <td>${row.credits}</td>
                    <td>${row.users}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      toast.success('Đã mở cửa sổ in PDF');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Có lỗi xảy ra khi xuất PDF');
    } finally {
      setExportLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const pieChartColors = ['#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Báo cáo hệ thống</h2>
            <p className="opacity-90 mb-4">Phân tích dữ liệu và tạo báo cáo tổng hợp</p>
            <div className="flex space-x-4">
              <button
                onClick={exportToCSV}
                disabled={exportLoading}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {exportLoading ? 'Đang xuất...' : 'Xuất Excel'}
              </button>
              <button
                onClick={exportToPDF}
                disabled={exportLoading}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center disabled:opacity-50"
              >
                <File className="w-4 h-4 mr-2" />
                {exportLoading ? 'Đang xuất...' : 'Xuất PDF'}
              </button>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <BarChart3 className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: { bg: 'bg-blue-500', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
            green: { bg: 'bg-green-500', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
            orange: { bg: 'bg-orange-500', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
            purple: { bg: 'bg-purple-500', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
          };
          const colors = colorClasses[stat.color] || colorClasses.blue;

          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all">
              <div className={`w-12 h-12 bg-gradient-to-r ${colors.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className={`text-2xl font-bold ${colors.text} mb-1`}>{stat.value}</p>
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <div className="flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600 font-semibold">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            name="timeRange"
            value={filters.timeRange}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="7">7 ngày qua</option>
            <option value="30">30 ngày qua</option>
            <option value="90">90 ngày qua</option>
            <option value="365">1 năm qua</option>
            <option value="custom">Tùy chọn</option>
          </select>
          {filters.timeRange === 'custom' && (
            <>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
              <span className="text-gray-500">đến</span>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </>
          )}
          <select
            name="reportType"
            value={filters.reportType}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="all">Tất cả</option>
            <option value="transactions">Giao dịch</option>
            <option value="users">Người dùng</option>
            <option value="credits">Tín chỉ</option>
            <option value="financial">Tài chính</option>
          </select>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Transaction Trend */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Xu hướng giao dịch
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                  formatter={(value) => formatNumber(value)}
                />
                <Area
                  type="monotone"
                  dataKey="transactions"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            Tăng trưởng người dùng
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                  formatter={(value) => formatNumber(value)}
                />
                <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="evOwners" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="buyers" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Doanh thu theo tháng
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-orange-600" />
            Phân bố người dùng
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={creditDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {creditDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                  formatter={(value) => formatNumber(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {creditDistribution.map((role, index) => (
              <div key={role.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: pieChartColors[index % pieChartColors.length] }}></div>
                  <span className="text-sm text-gray-600">{role.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{formatNumber(role.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Bảng tổng hợp theo tháng
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Tháng</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Giao dịch</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Doanh thu</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Tín chỉ</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Người dùng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {monthlySummary.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-semibold text-gray-800">{row.month}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{formatNumber(row.transactions)}</td>
                  <td className="py-3 px-4 text-right font-bold text-green-600">{formatCurrency(row.revenue)}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{formatNumber(row.credits)}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{formatNumber(row.users)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
