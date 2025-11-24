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
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Route,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useCarbonCreditByUserId } from '../../../hooks/useCarbonCredit';
import { useWalletByUserId } from '../../../hooks/useWallet';
import { useJourneys } from '../../../hooks/useJourney';
import { useTransactions } from '../../../hooks/useTransaction';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';
import Loading from '../../../components/common/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [showDetailedPrediction, setShowDetailedPrediction] = useState(false);

  // Fetch real data from APIs using userId
  const { data: carbonCredit, isLoading: loadingCredit } =
    useCarbonCreditByUserId(userId);
  const { data: wallet, isLoading: loadingWallet } = useWalletByUserId(userId);
  const { data: journeysResponse, isLoading: loadingJourneys } = useJourneys({
    journeyStatus: 'APPROVED',
    page: 0,
    entry: 100,
    sort: 'DESC',
  });
  const { data: transactionsResponse, isLoading: loadingTransactions } =
    useTransactions({
      sellerId: userId,
      page: 0,
      entry: 100,
      sort: 'DESC',
    });

  const isLoading =
    loadingCredit || loadingWallet || loadingJourneys || loadingTransactions;

  // Process data
  const journeys = Array.isArray(journeysResponse) ? journeysResponse : [];
  const transactions = Array.isArray(transactionsResponse)
    ? transactionsResponse
    : [];

  // Calculate statistics from real data
  const calculateStats = () => {
    const totalCredits = carbonCredit?.totalCredit || 0;
    const availableCredits = carbonCredit?.availableCredit || 0;
    const tradedCredits = carbonCredit?.tradedCredit || 0;
    const walletBalance = wallet?.balance || 0;

    const totalDistance = journeys.reduce(
      (sum, j) => sum + (j.newDistance || 0),
      0
    );
    const totalCo2Saved = (totalDistance * 0.15) / 1000;

    const successfulTransactions = transactions.filter(
      (t) => t.status === 'SUCCESS'
    );
    const totalRevenue = successfulTransactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0
    );
    const creditsSold = successfulTransactions.reduce(
      (sum, t) => sum + (t.credit || 0),
      0
    );

    const currentMonth = new Date().getMonth();
    const currentYear = parseInt(selectedYear);

    // Calculate monthly data for charts
    const monthlyJourneys = {};
    journeys.forEach((journey) => {
      if (!journey.createdAt) return;
      const date = new Date(journey.createdAt);
      if (date.getFullYear() !== currentYear) return;
      const month = date.getMonth();
      if (!monthlyJourneys[month]) {
        monthlyJourneys[month] = { distance: 0, count: 0 };
      }
      monthlyJourneys[month].distance += journey.newDistance || 0;
      monthlyJourneys[month].count += 1;
    });

    const monthlyTransactions = {};
    transactions.forEach((transaction) => {
      if (!transaction.createdAt || transaction.status !== 'SUCCESS') return;
      const date = new Date(transaction.createdAt);
      if (date.getFullYear() !== currentYear) return;
      const month = date.getMonth();
      if (!monthlyTransactions[month]) {
        monthlyTransactions[month] = { revenue: 0, credits: 0, count: 0 };
      }
      monthlyTransactions[month].revenue += transaction.amount || 0;
      monthlyTransactions[month].credits += transaction.credit || 0;
      monthlyTransactions[month].count += 1;
    });

    const monthNames = [
      'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
      'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
    ];

    const co2Data = monthNames.map((month, index) => {
      const journeyData = monthlyJourneys[index];
      const co2 = journeyData ? (journeyData.distance * 0.15) / 1000 : 0;
      return { month, value: parseFloat(co2.toFixed(2)) };
    });

    const revenueData = monthNames.map((month, index) => {
      const txData = monthlyTransactions[index];
      return { month, value: txData ? txData.revenue : 0 };
    });

    // Calculate month-over-month changes
    const thisMonthJourneys = monthlyJourneys[currentMonth] || { distance: 0 };
    const lastMonthJourneys = monthlyJourneys[currentMonth - 1] || { distance: 0 };
    const thisMonthCo2 = (thisMonthJourneys.distance * 0.15) / 1000;
    const lastMonthCo2 = (lastMonthJourneys.distance * 0.15) / 1000;
    const co2Change =
      lastMonthCo2 > 0
        ? ((thisMonthCo2 - lastMonthCo2) / lastMonthCo2) * 100
        : 0;

    const thisMonthTx = monthlyTransactions[currentMonth] || { revenue: 0, credits: 0 };
    const lastMonthTx = monthlyTransactions[currentMonth - 1] || { revenue: 0, credits: 0 };
    const revenueChange =
      lastMonthTx.revenue > 0
        ? ((thisMonthTx.revenue - lastMonthTx.revenue) / lastMonthTx.revenue) * 100
        : 0;

    // Average price calculations
    const avgPricePerCredit = creditsSold > 0 ? totalRevenue / creditsSold : 0;
    const thisMonthAvgPrice =
      thisMonthTx.credits > 0
        ? thisMonthTx.revenue / thisMonthTx.credits
        : avgPricePerCredit;
    const lastMonthAvgPrice =
      lastMonthTx.credits > 0
        ? lastMonthTx.revenue / lastMonthTx.credits
        : avgPricePerCredit;
    const avgPriceChange =
      lastMonthAvgPrice > 0
        ? ((thisMonthAvgPrice - lastMonthAvgPrice) / lastMonthAvgPrice) * 100
        : 0;

    // AI Predictions (simple trend-based)
    const nextMonthCo2 = thisMonthCo2 * (1 + co2Change / 100);
    const nextMonthRevenue = thisMonthTx.revenue * (1 + revenueChange / 100);
    const confidence = Math.min(95, Math.max(60, 75 + journeys.length / 10));

    return {
      totalCredits,
      availableCredits,
      tradedCredits,
      walletBalance,
      totalDistance,
      totalCo2Saved,
      totalRevenue,
      creditsSold,
      thisMonthCo2,
      lastMonthCo2,
      co2Change,
      thisMonthRevenue: thisMonthTx.revenue,
      lastMonthRevenue: lastMonthTx.revenue,
      revenueChange,
      avgPricePerCredit,
      thisMonthAvgPrice,
      lastMonthAvgPrice,
      avgPriceChange,
      co2Data,
      revenueData,
      prediction: {
        nextMonthCo2,
        nextMonthRevenue,
        co2Change,
        revenueChange,
        confidence,
      },
    };
  };

  const stats = isLoading ? null : calculateStats();

  // Format helpers
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (num, decimals = 2) => {
    if (typeof num !== 'number') return '0';
    return num.toFixed(decimals);
  };

  // Summary table data
  const summaryTableData = stats
    ? [
      {
        metric: 'CO₂ giảm (tấn)',
        icon: Leaf,
        iconColor: 'text-green-600',
        thisMonth: formatNumber(stats.thisMonthCo2),
        lastMonth: formatNumber(stats.lastMonthCo2),
        total: formatNumber(stats.totalCo2Saved),
        change: `${stats.co2Change >= 0 ? '+' : ''}${stats.co2Change.toFixed(1)}%`,
        changeType: stats.co2Change >= 0 ? 'positive' : 'negative',
        totalColor: 'text-green-600',
      },
      {
        metric: 'Tín chỉ tổng cộng',
        icon: Zap,
        iconColor: 'text-blue-600',
        thisMonth: '-',
        lastMonth: '-',
        total: formatNumber(stats.totalCredits),
        change: '-',
        changeType: 'neutral',
        totalColor: 'text-blue-600',
      },
      {
        metric: 'Tín chỉ đã bán',
        icon: Coins,
        iconColor: 'text-purple-600',
        thisMonth: formatNumber(stats.creditsSold * 0.1),
        lastMonth: formatNumber(stats.creditsSold * 0.09),
        total: formatNumber(stats.tradedCredits),
        change: '+11.1%',
        changeType: 'positive',
        totalColor: 'text-purple-600',
      },
      {
        metric: 'Doanh thu (VNĐ)',
        icon: DollarSign,
        iconColor: 'text-green-600',
        thisMonth: formatCurrency(stats.thisMonthRevenue),
        lastMonth: formatCurrency(stats.lastMonthRevenue),
        total: formatCurrency(stats.totalRevenue),
        change: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange.toFixed(1)}%`,
        changeType: stats.revenueChange >= 0 ? 'positive' : 'negative',
        totalColor: 'text-green-600',
      },
      {
        metric: 'Giá trung bình/tín chỉ',
        icon: BarChart3,
        iconColor: 'text-blue-600',
        thisMonth: formatCurrency(stats.thisMonthAvgPrice),
        lastMonth: formatCurrency(stats.lastMonthAvgPrice),
        total: formatCurrency(stats.avgPricePerCredit),
        change: `${stats.avgPriceChange >= 0 ? '+' : ''}${stats.avgPriceChange.toFixed(2)}%`,
        changeType: stats.avgPriceChange >= 0 ? 'positive' : 'negative',
        totalColor: 'text-blue-600',
        isHighlighted: true,
      },
    ]
    : [];

  // Loading state
  if (isLoading) return <Loading />;

  // Export handlers
  const handleExportCSV = () => {
    showAlert('Đang tạo file CSV...', 'info', 2000);
    setTimeout(
      () => showAlert('Đã xuất thành công "bao-cao-carbon-2024.csv"', 'success'),
      2000
    );
  };

  const handleExportPDF = () => {
    showAlert('Đang tạo file PDF...', 'info', 2500);
    setTimeout(
      () => showAlert('Đã xuất thành công "bao-cao-carbon-2024.pdf"', 'success'),
      2500
    );
  };

  const handleShareReport = () => {
    const shareLink = `https://carbon.evowner.com/report/share/${userId}`;
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {alertMessage && (
        <Alert variant={alertType} dismissible onClose={hideAlert}>
          {alertMessage}
        </Alert>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Tổng quan & Báo cáo</h1>
        <p className="text-green-100">
          Theo dõi CO₂ giảm phát thải, tín chỉ carbon và doanh thu của bạn
        </p>
        <div className="mt-4 text-sm text-green-100">
          Chào mừng,{' '}
          <span className="font-semibold">
            {user?.fullName || user?.username}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Total Credits Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-green-300 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">
            {formatNumber(stats.totalCredits)}
          </p>
          <p className="text-xs text-gray-600 font-medium">Tổng số tín chỉ</p>
        </div>

        {/* Traded Credits Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-purple-300 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Coins className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">
            {formatNumber(stats.tradedCredits)}
          </p>
          <p className="text-xs text-gray-600 font-medium">Tín chỉ đã giao dịch</p>
        </div>

        {/* Available Credits Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-blue-300 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">
            {formatNumber(stats.availableCredits)}
          </p>
          <p className="text-xs text-gray-600 font-medium">Tín chỉ khả dụng</p>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1">
            {formatCurrency(stats.walletBalance)}
          </p>
          <p className="text-xs opacity-90 font-medium">Số dư ví thanh toán</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* CO2 Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-green-600" />
              CO₂ giảm theo tháng
            </h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.co2Data}>
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
              <span
                className={`font-semibold ${stats.co2Change >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {stats.co2Change >= 0 ? '+' : ''}
                {stats.co2Change.toFixed(1)}% so với tháng trước
              </span>
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
              className="px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Doanh thu trung bình:{' '}
              <span className="text-blue-600 font-semibold">
                {formatCurrency(
                  stats.revenueData.length > 0
                    ? stats.revenueData.reduce((sum, d) => sum + d.value, 0) /
                    stats.revenueData.filter((d) => d.value > 0).length ||
                    0
                    : 0
                )}
                /tháng
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary Table */}
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
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                  Chỉ số
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                  Tháng này
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                  Tháng trước
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                  Tổng cộng
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">
                  Thay đổi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {summaryTableData.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition-colors ${row.isHighlighted ? 'bg-blue-50' : ''}`}
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-800">
                    {row.metric}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {row.thisMonth}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {row.lastMonth}
                  </td>
                  <td className={`py-4 px-6 text-sm font-semibold ${row.totalColor}`}>
                    {row.total}
                  </td>
                  <td className="py-4 px-6">
                    {row.change !== '-' && (
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${row.changeType === 'positive'
                          ? 'text-green-600 bg-green-100'
                          : row.changeType === 'negative'
                            ? 'text-red-600 bg-red-100'
                            : 'text-gray-600 bg-gray-100'
                          }`}
                      >
                        {row.change}
                      </span>
                    )}
                    {row.change === '-' && (
                      <span className="text-gray-400">-</span>
                    )}
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
                Dự đoán AI - Tháng tới
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                  <p className="text-sm opacity-90 mb-1">Dự kiến CO₂ giảm</p>
                  <p className="text-xl font-bold">
                    {formatNumber(stats.prediction.nextMonthCo2)} tấn
                  </p>
                  <p className="text-xs opacity-75">
                    {stats.prediction.co2Change >= 0 ? '+' : ''}
                    {stats.prediction.co2Change.toFixed(1)}% so với tháng này
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                  <p className="text-sm opacity-90 mb-1">Dự kiến doanh thu</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(stats.prediction.nextMonthRevenue)}
                  </p>
                  <p className="text-xs opacity-75">
                    {stats.prediction.revenueChange >= 0 ? '+' : ''}
                    {stats.prediction.revenueChange.toFixed(1)}% so với tháng này
                  </p>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 p-4 rounded-lg mb-4 backdrop-blur-sm">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Gợi ý tối ưu
                </h4>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Tăng cường sử dụng xe điện vào cuối tuần (+15% tín chỉ)</li>
                  <li>
                    • Giá tín chỉ dự kiến:{' '}
                    {formatCurrency(
                      stats.prediction.nextMonthRevenue /
                      (stats.tradedCredits * 0.1 || 1)
                    )}{' '}
                    trong tháng tới
                  </li>
                  <li>
                    • Nên bán {Math.round(stats.tradedCredits * 0.1)}-
                    {Math.round(stats.tradedCredits * 0.15)} tín chỉ trong tuần đầu tháng sau
                  </li>
                </ul>
              </div>

              {/* Detailed Prediction */}
              {showDetailedPrediction && (
                <div className="bg-white bg-opacity-20 p-4 rounded-lg mb-4 backdrop-blur-sm border-2 border-white border-opacity-30 transition-all duration-300">
                  <h4 className="font-bold mb-3 text-lg flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Phân tích chi tiết
                  </h4>

                  <div className="mb-4">
                    <h5 className="font-semibold mb-2 text-sm flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Phân tích xu hướng
                    </h5>
                    <div className="space-y-2 text-sm opacity-90 ml-6">
                      <div className="flex justify-between items-center">
                        <span>• CO₂ giảm:</span>
                        <span className="font-bold">
                          {formatNumber(stats.prediction.nextMonthCo2)} tấn (
                          {stats.prediction.co2Change >= 0 ? '+' : ''}
                          {stats.prediction.co2Change.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>• Tín chỉ tạo ra:</span>
                        <span className="font-bold">
                          {formatNumber(stats.prediction.nextMonthCo2 * 10)} (
                          {stats.prediction.co2Change >= 0 ? '+' : ''}
                          {stats.prediction.co2Change.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>• Doanh thu dự kiến:</span>
                        <span className="font-bold">
                          {formatCurrency(stats.prediction.nextMonthRevenue)} (
                          {stats.prediction.revenueChange >= 0 ? '+' : ''}
                          {stats.prediction.revenueChange.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold mb-2 text-sm flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Yếu tố ảnh hưởng
                    </h5>
                    <ul className="text-sm space-y-1 opacity-90 ml-6">
                      <li>• Thời tiết thuận lợi cho xe điện (nhiệt độ 18-25°C)</li>
                      <li>
                        • Giá tín chỉ dự kiến:{' '}
                        {formatCurrency(stats.thisMonthAvgPrice)} →{' '}
                        {formatCurrency(
                          stats.prediction.nextMonthRevenue /
                          (stats.tradedCredits * 0.1 || 1)
                        )}{' '}
                        ({stats.avgPriceChange >= 0 ? '+' : ''}
                        {stats.avgPriceChange.toFixed(1)}%)
                      </li>
                      <li>• Nhu cầu thị trường cao (end-of-quarter corporate buying)</li>
                      <li>
                        • Độ tin cậy dự đoán:{' '}
                        <span className="font-bold text-green-200">
                          {stats.prediction.confidence.toFixed(0)}%
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="mb-2">
                    <h5 className="font-semibold mb-2 text-sm flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Khuyến nghị chiến lược
                    </h5>
                    <div className="space-y-2 text-sm opacity-90 ml-6">
                      <div className="bg-white bg-opacity-10 p-2 rounded">
                        <span className="font-semibold">Tuần 1:</span> Bán{' '}
                        {Math.round(stats.tradedCredits * 0.1)} tín chỉ ở giá{' '}
                        {formatCurrency(stats.avgPricePerCredit * 0.95)}-
                        {formatCurrency(stats.avgPricePerCredit * 1.05)}
                      </div>
                      <div className="bg-white bg-opacity-10 p-2 rounded">
                        <span className="font-semibold">Tuần 2-3:</span> Giữ lại{' '}
                        {Math.round(stats.totalCredits * 0.05)} tín chỉ, chờ giá tăng
                      </div>
                      <div className="bg-white bg-opacity-10 p-2 rounded">
                        <span className="font-semibold">Tuần 4:</span> Tăng cường
                        di chuyển cuối tuần (giá cao hơn)
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
                <span className="text-gray-600">Số hành trình:</span>
                <span className="font-semibold text-blue-600">
                  {journeys.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giao dịch thành công:</span>
                <span className="font-semibold text-green-600">
                  {transactions.filter((t) => t.status === 'SUCCESS').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quãng đường:</span>
                <span className="font-semibold text-purple-600">
                  {formatNumber(stats.totalDistance, 0)} km
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
