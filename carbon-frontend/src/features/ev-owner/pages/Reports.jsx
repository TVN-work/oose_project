import { useState } from 'react';
import { 
  FileDown, 
  TrendingUp, 
  Bot, 
  Share2, 
  Leaf, 
  Zap, 
  Coins, 
  DollarSign, 
  BarChart3, 
  ClipboardList, 
  Lightbulb, 
  Sparkles, 
  Target, 
  FileText,
  CheckCircle,
  Link2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';
import { formatCurrencyFromUsd } from '../../../utils';

const Reports = () => {
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();
  
  const [selectedYear, setSelectedYear] = useState('2024');
  const [showDetailedPrediction, setShowDetailedPrediction] = useState(false);

  // CO2 Chart Data
  const co2Data = [
    { month: 'T1', value: 1.2 },
    { month: 'T2', value: 1.8 },
    { month: 'T3', value: 2.1 },
    { month: 'T4', value: 2.3 },
    { month: 'T5', value: 2.0 },
    { month: 'T6', value: 2.5 },
    { month: 'T7', value: 2.2 },
    { month: 'T8', value: 2.7 },
    { month: 'T9', value: 2.4 },
    { month: 'T10', value: 2.6 },
    { month: 'T11', value: 2.3 },
    { month: 'T12', value: 2.8 },
  ];

  // Revenue Chart Data
  const revenueData = [
    { month: 'T1', value: 280 },
    { month: 'T2', value: 420 },
    { month: 'T3', value: 490 },
    { month: 'T4', value: 540 },
    { month: 'T5', value: 470 },
    { month: 'T6', value: 590 },
    { month: 'T7', value: 520 },
    { month: 'T8', value: 630 },
    { month: 'T9', value: 560 },
    { month: 'T10', value: 610 },
    { month: 'T11', value: 540 },
    { month: 'T12', value: 587 },
  ];

  // Summary table data
  const summaryTableData = [
    {
      metric: 'CO₂ giảm (tấn)',
      icon: Leaf,
      iconColor: 'text-green-600',
      thisMonth: '2.8',
      lastMonth: '2.3',
      total: '24.7',
      change: '+21.7%',
      changeType: 'positive',
      totalColor: 'text-green-600',
    },
    {
      metric: 'Tín chỉ quy đổi',
      icon: Zap,
      iconColor: 'text-blue-600',
      thisMonth: '28',
      lastMonth: '23',
      total: '247',
      change: '+21.7%',
      changeType: 'positive',
      totalColor: 'text-blue-600',
    },
    {
      metric: 'Tín chỉ đã bán',
      icon: Coins,
      iconColor: 'text-purple-600',
      thisMonth: '25',
      lastMonth: '18',
      total: '189',
      change: '+38.9%',
      changeType: 'positive',
      totalColor: 'text-purple-600',
    },
    {
      metric: 'Doanh thu (VNĐ)',
      icon: DollarSign,
      iconColor: 'text-green-600',
      thisMonth: formatCurrencyFromUsd(587.50),
      lastMonth: formatCurrencyFromUsd(423.20),
      total: formatCurrencyFromUsd(4347.80),
      change: '+38.8%',
      changeType: 'positive',
      totalColor: 'text-green-600',
    },
    {
      metric: 'Giá trung bình/tín chỉ',
      icon: BarChart3,
      iconColor: 'text-blue-600',
      thisMonth: formatCurrencyFromUsd(23.50),
      lastMonth: formatCurrencyFromUsd(23.51),
      total: formatCurrencyFromUsd(23.01),
      change: '-0.04%',
      changeType: 'negative',
      totalColor: 'text-blue-600',
      isHighlighted: true,
    },
  ];

  const handleExportCSV = () => {
    showAlert('Đang tạo file CSV...', 'info', 2000);
    setTimeout(() => {
      showAlert('Đã xuất thành công "bao-cao-carbon-2024.csv"', 'success');
    }, 2000);
  };

  const handleExportPDF = () => {
    showAlert('Đang tạo file PDF...', 'info', 2500);
    setTimeout(() => {
      showAlert('Đã xuất thành công "bao-cao-carbon-2024.pdf"', 'success');
    }, 2500);
  };

  const handleShareReport = () => {
    const shareLink = 'https://carbon.evowner.com/report/share/abc123';
    navigator.clipboard.writeText(shareLink);
    showAlert(`Link chia sẻ đã được sao chép: ${shareLink}`, 'success');
  };

  const handleDetailedPrediction = () => {
      if (!showDetailedPrediction) {
        showAlert('Đang phân tích dữ liệu...', 'info', 1500);
    setTimeout(() => {
          setShowDetailedPrediction(true);
          showAlert('Đã tải dự đoán chi tiết!', 'success');
        }, 1500);
      } else {
        setShowDetailedPrediction(false);
      }
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header - Green theme */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Báo cáo cá nhân</h1>
        <p className="text-green-100">
          Theo dõi CO₂ giảm phát thải, tín chỉ đã tạo và doanh thu từ bán tín chỉ
        </p>
        </div>

      {/* Summary Cards - Clean Design */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-gray-300 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">+12.3%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">24.7 tấn</p>
          <p className="text-xs text-gray-600 font-medium">Tổng CO₂ giảm</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-gray-300 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-semibold">+8.9%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">247</p>
          <p className="text-xs text-gray-600 font-medium">Tín chỉ quy đổi</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-gray-300 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Coins className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-semibold">+15.2%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">189</p>
          <p className="text-xs text-gray-600 font-medium">Tín chỉ đã bán</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs opacity-75 font-semibold">Năm 2024</span>
          </div>
          <p className="text-2xl font-bold mb-1">{formatCurrencyFromUsd(4347.80)}</p>
          <p className="text-xs opacity-90 font-medium">Tổng doanh thu</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* CO2 Reduction Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-green-600" />
              CO₂ giảm theo tháng
            </h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={co2Data}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
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
                  formatter={(value) => [`${value} tấn`, 'CO₂ giảm']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorCo2)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Xu hướng tăng trưởng:{' '}
              <span className="text-green-600 font-semibold">+12.3% so với năm trước</span>
            </p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              Doanh thu theo tháng
            </h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [formatCurrencyFromUsd(value), 'Doanh thu']}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Doanh thu trung bình:{' '}
              <span className="text-blue-600 font-semibold">{formatCurrencyFromUsd(362.32)}/tháng</span>
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Summary Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <ClipboardList className="w-5 h-5 mr-2 text-gray-700" />
            Bảng tổng hợp chi tiết
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Chỉ số</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Tháng này</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Tháng trước</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Tổng cộng</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Thay đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {summaryTableData.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition-colors ${row.isHighlighted ? 'bg-blue-50' : ''}`}
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-800">{row.metric}</td>
                  <td className="py-4 px-6 text-sm text-gray-800">{row.thisMonth}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{row.lastMonth}</td>
                  <td className={`py-4 px-6 text-sm font-semibold ${row.totalColor}`}>{row.total}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        row.changeType === 'positive'
                          ? 'text-green-600 bg-green-100'
                          : 'text-red-600 bg-red-100'
                      }`}
                    >
                      {row.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Prediction & Export Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Prediction */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                Dự đoán AI - Tháng tới (Tháng 1/2025)
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                  <p className="text-sm opacity-90 mb-1">Dự kiến CO₂ giảm</p>
                  <p className="text-xl font-bold">3.2 tấn</p>
                  <p className="text-xs opacity-75">+14.3% so với tháng này</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                  <p className="text-sm opacity-90 mb-1">Dự kiến doanh thu</p>
                  <p className="text-xl font-bold">{formatCurrencyFromUsd(672.40)}</p>
                  <p className="text-xs opacity-75">+14.4% so với tháng này</p>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 p-4 rounded-lg mb-4 backdrop-blur-sm">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Gợi ý tối ưu
                </h4>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Tăng cường sử dụng xe điện vào cuối tuần (+15% tín chỉ)</li>
                  <li>• Giá tín chỉ dự kiến tăng lên {formatCurrencyFromUsd(24.20)} trong 2 tuần tới</li>
                  <li>• Nên bán 20-25 tín chỉ trong tuần đầu tháng sau</li>
                </ul>
              </div>

              {/* Detailed Prediction - Expandable Section */}
              {showDetailedPrediction && (
                <div className="bg-white bg-opacity-20 p-4 rounded-lg mb-4 backdrop-blur-sm border-2 border-white border-opacity-30 transition-all duration-300 ease-in-out">
                  <h4 className="font-bold mb-3 text-lg flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Phân tích chi tiết
                  </h4>
                  
                  {/* Trend Analysis */}
                  <div className="mb-4">
                    <h5 className="font-semibold mb-2 text-sm flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Phân tích xu hướng
                    </h5>
                    <div className="space-y-2 text-sm opacity-90 ml-6">
                      <div className="flex justify-between items-center">
                        <span>• CO₂ giảm:</span>
                        <span className="font-bold">3.2 tấn (+14.3%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>• Tín chỉ tạo ra:</span>
                        <span className="font-bold">32 (+14.3%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>• Doanh thu dự kiến:</span>
                        <span className="font-bold">{formatCurrencyFromUsd(672.40)} (+14.4%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Influencing Factors */}
                  <div className="mb-4">
                    <h5 className="font-semibold mb-2 text-sm flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Yếu tố ảnh hưởng
                    </h5>
                    <ul className="text-sm space-y-1 opacity-90 ml-6">
                      <li>• Thời tiết thuận lợi cho xe điện (nhiệt độ 18-25°C)</li>
                      <li>• Giá tín chỉ tăng nhẹ: {formatCurrencyFromUsd(23.50)} → {formatCurrencyFromUsd(24.20)} (+3.0%)</li>
                      <li>• Nhu cầu thị trường cao (end-of-quarter corporate buying)</li>
                      <li>• Độ tin cậy dự đoán: <span className="font-bold text-green-200">87%</span></li>
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="mb-2">
                    <h5 className="font-semibold mb-2 text-sm flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Khuyến nghị chiến lược
                    </h5>
                    <div className="space-y-2 text-sm opacity-90 ml-6">
                      <div className="bg-white bg-opacity-10 p-2 rounded">
                        <span className="font-semibold">Tuần 1:</span> Bán 25 tín chỉ ở giá {formatCurrencyFromUsd(24.00)}-{formatCurrencyFromUsd(24.20)}
                      </div>
                      <div className="bg-white bg-opacity-10 p-2 rounded">
                        <span className="font-semibold">Tuần 2-3:</span> Giữ lại 7 tín chỉ, chờ giá tăng
                      </div>
                      <div className="bg-white bg-opacity-10 p-2 rounded">
                        <span className="font-semibold">Tuần 4:</span> Tăng cường di chuyển cuối tuần (giá cao hơn)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleDetailedPrediction}
                className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 py-2 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center"
              >
                {showDetailedPrediction ? (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Thu gọn dự đoán chi tiết
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 mr-2" />
                    Xem dự đoán chi tiết
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FileDown className="w-5 h-5 mr-2" />
            Xuất báo cáo
          </h3>

          <div className="space-y-3">
            <button
              onClick={handleExportCSV}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Xuất file CSV
            </button>

            <button
              onClick={handleExportPDF}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Xuất file PDF
            </button>

            <button
              onClick={handleShareReport}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ báo cáo
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-gray-700" />
              Thống kê nhanh
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Hiệu suất tháng này:</span>
                <span className="font-semibold text-green-600">Xuất sắc</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Xếp hạng:</span>
                <span className="font-semibold text-blue-600">Top 15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mục tiêu tháng sau:</span>
                <span className="font-semibold text-purple-600">{formatCurrencyFromUsd(700)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
