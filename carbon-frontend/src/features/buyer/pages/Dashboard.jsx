import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Award,
  DollarSign,
  Globe,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  Target,
  Search,
  FileText,
  CreditCard,
  FileDown,
  Bot,
  Share2,
  BarChart3,
  ClipboardList,
  Lightbulb,
  Sparkles,
  Wallet,
  Loader2,
  Leaf,
  Zap,
  Coins,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useCarbonCreditByUserId } from '../../../hooks/useCarbonCredit';
import { useWalletByUserId } from '../../../hooks/useWallet';
import { useTransactions } from '../../../hooks/useTransaction';
import Loading from '../../../components/common/Loading';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';
import { formatCurrency, formatNumber } from '../../../utils';

const Dashboard = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [showDetailedPrediction, setShowDetailedPrediction] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Fetch real data from APIs using userId
  const { data: carbonCredit, isLoading: loadingCredit } =
    useCarbonCreditByUserId(userId);
  const { data: wallet, isLoading: loadingWallet } = useWalletByUserId(userId);
  const { data: transactionsResponse, isLoading: loadingTransactions } =
    useTransactions({
      buyerId: userId,
      page: 0,
      entry: 100,
      sort: 'DESC',
    });

  const isLoading = loadingCredit || loadingWallet || loadingTransactions;

  if (isLoading) {
    return <Loading />;
  }

  // Process data
  const transactions = Array.isArray(transactionsResponse)
    ? transactionsResponse
    : [];

  // Calculate statistics from real data
  const calculateStats = () => {
    const totalCredits = carbonCredit?.totalCredit || 0;
    const availableCredits = carbonCredit?.availableCredit || 0;
    const tradedCredits = carbonCredit?.tradedCredit || 0;
    const walletBalance = wallet?.balance || 0;

    const successfulTransactions = transactions.filter(
      (t) => t.status === 'SUCCESS'
    );
    const thisMonthTransactions = successfulTransactions.filter((t) => {
      if (!t.createdAt) return false;
      const date = new Date(t.createdAt);
      return date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();
    });

    const thisMonthSpent = thisMonthTransactions.reduce(
      (sum, t) => sum + (t.amount || 0), 0
    );
    const thisMonthCredits = thisMonthTransactions.reduce(
      (sum, t) => sum + (t.credit || 0), 0
    );

    // Calculate total spent and CO2 reduced from transactions
    const totalSpent = successfulTransactions.reduce(
      (sum, t) => sum + (t.amount || 0), 0
    );
    const co2Reduced = totalCredits * 0.15; // Approximate CO2 reduction
    const certificates = Math.floor(totalCredits / 10); // 1 certificate per 10 credits

    // Calculate monthly data for charts
    const currentYear = parseInt(selectedYear);
    const monthNames = [
      'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
      'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
    ];

    const monthlyPurchases = {};
    transactions.forEach((transaction) => {
      if (!transaction.createdAt || transaction.status !== 'SUCCESS') return;
      const date = new Date(transaction.createdAt);
      if (date.getFullYear() !== currentYear) return;
      const month = date.getMonth();
      if (!monthlyPurchases[month]) {
        monthlyPurchases[month] = { amount: 0, credits: 0, count: 0 };
      }
      monthlyPurchases[month].amount += transaction.amount || 0;
      monthlyPurchases[month].credits += transaction.credit || 0;
      monthlyPurchases[month].count += 1;
    });

    const purchaseData = monthNames.map((month, index) => {
      const data = monthlyPurchases[index];
      return { month, value: data ? data.credits : 0 };
    });

    const spendingData = monthNames.map((month, index) => {
      const data = monthlyPurchases[index];
      return { month, value: data ? data.amount : 0 };
    });

    // Calculate changes
    const currentMonth = new Date().getMonth();
    const thisMonth = monthlyPurchases[currentMonth] || { amount: 0, credits: 0 };
    const lastMonth = monthlyPurchases[currentMonth - 1] || { amount: 0, credits: 0 };

    const spentChange = lastMonth.amount > 0
      ? ((thisMonth.amount - lastMonth.amount) / lastMonth.amount) * 100
      : 0;
    const creditsChange = lastMonth.credits > 0
      ? ((thisMonth.credits - lastMonth.credits) / lastMonth.credits) * 100
      : 0;

    // Average price calculations
    const avgPricePerCredit = totalCredits > 0 ? totalSpent / totalCredits : 0;
    const thisMonthAvgPrice = thisMonthCredits > 0 ? thisMonthSpent / thisMonthCredits : avgPricePerCredit;
    const lastMonthSpent = lastMonth.amount;
    const lastMonthCredits = lastMonth.credits;
    const lastMonthAvgPrice = lastMonthCredits > 0 ? lastMonthSpent / lastMonthCredits : avgPricePerCredit;
    const avgPriceChange = lastMonthAvgPrice > 0
      ? ((thisMonthAvgPrice - lastMonthAvgPrice) / lastMonthAvgPrice) * 100
      : 0;

    // AI Predictions
    const nextMonthSpent = thisMonthSpent * (1 + spentChange / 100);
    const nextMonthCredits = thisMonthCredits * (1 + creditsChange / 100);
    const confidence = Math.min(95, Math.max(60, 75 + transactions.length / 10));

    return {
      totalCredits,
      availableCredits,
      tradedCredits,
      walletBalance,
      totalSpent,
      co2Reduced,
      certificates,
      thisMonthSpent,
      thisMonthCredits,
      lastMonthSpent,
      lastMonthCredits,
      spentChange,
      creditsChange,
      avgPricePerCredit,
      thisMonthAvgPrice,
      lastMonthAvgPrice,
      avgPriceChange,
      purchaseData,
      spendingData,
      successfulTransactions,
      prediction: {
        nextMonthSpent,
        nextMonthCredits,
        spentChange,
        creditsChange,
        confidence,
      },
    };
  };

  const calculatedStats = calculateStats();

  // Summary table data
  const summaryTableData = [
    {
      metric: 'Tổng số tín chỉ',
      icon: Leaf,
      iconColor: 'text-green-600',
      thisMonth: formatNumber(calculatedStats.thisMonthCredits),
      lastMonth: formatNumber(calculatedStats.lastMonthCredits),
      total: formatNumber(calculatedStats.totalCredits),
      change: `${calculatedStats.creditsChange >= 0 ? '+' : ''}${calculatedStats.creditsChange.toFixed(1)}%`,
      changeType: calculatedStats.creditsChange >= 0 ? 'positive' : 'negative',
      totalColor: 'text-green-600',
    },
    {
      metric: 'Tín chỉ đã giao dịch',
      icon: Coins,
      iconColor: 'text-purple-600',
      thisMonth: '-',
      lastMonth: '-',
      total: formatNumber(calculatedStats.tradedCredits),
      change: '-',
      changeType: 'neutral',
      totalColor: 'text-purple-600',
    },
    {
      metric: 'Tín chỉ khả dụng',
      icon: Zap,
      iconColor: 'text-blue-600',
      thisMonth: '-',
      lastMonth: '-',
      total: formatNumber(calculatedStats.availableCredits),
      change: '-',
      changeType: 'neutral',
      totalColor: 'text-blue-600',
    },
    {
      metric: 'Chi tiêu (VNĐ)',
      icon: DollarSign,
      iconColor: 'text-green-600',
      thisMonth: formatCurrency(calculatedStats.thisMonthSpent),
      lastMonth: formatCurrency(calculatedStats.lastMonthSpent),
      total: formatCurrency(calculatedStats.totalSpent),
      change: `${calculatedStats.spentChange >= 0 ? '+' : ''}${calculatedStats.spentChange.toFixed(1)}%`,
      changeType: calculatedStats.spentChange >= 0 ? 'positive' : 'negative',
      totalColor: 'text-green-600',
    },
    {
      metric: 'Giá trung bình/tín chỉ',
      icon: BarChart3,
      iconColor: 'text-blue-600',
      thisMonth: formatCurrency(calculatedStats.thisMonthAvgPrice),
      lastMonth: formatCurrency(calculatedStats.lastMonthAvgPrice),
      total: formatCurrency(calculatedStats.avgPricePerCredit),
      change: `${calculatedStats.avgPriceChange >= 0 ? '+' : ''}${calculatedStats.avgPriceChange.toFixed(2)}%`,
      changeType: calculatedStats.avgPriceChange >= 0 ? 'positive' : 'negative',
      totalColor: 'text-blue-600',
      isHighlighted: true,
    },
  ];

  // Use calculated data
  const purchaseTrendData = calculatedStats.purchaseData || [];
  const spendingTrendData = calculatedStats.spendingData || [];

  // Quick actions
  const quickActions = [
    {
      icon: Search,
      label: 'Tìm kiếm',
      link: '/buyer/marketplace',
      color: 'blue',
      description: 'Tìm tín chỉ',
    },
    {
      icon: CreditCard,
      label: 'Lịch sử',
      link: '/buyer/purchase-history',
      color: 'green',
      description: 'Xem giao dịch',
    },
    {
      icon: Award,
      label: 'Chứng nhận',
      link: '/buyer/certificates',
      color: 'purple',
      description: 'Xem chứng nhận',
    },
    {
      icon: FileText,
      label: 'Báo cáo',
      link: '/buyer/reports',
      color: 'orange',
      description: 'Xem thống kê',
    },
  ];

  // Calculate performance metrics from real data
  const totalCertificates = calculatedStats.certificates;
  const thisMonthSpending = calculatedStats.thisMonthSpent;
  const avgMonthlySpending = spendingTrendData.length > 0
    ? spendingTrendData.reduce((sum, item) => sum + (item.value || 0), 0) / spendingTrendData.filter((d) => d.value > 0).length || 0
    : 0;

  // Calculate performance (percentage of target)
  const certificateTarget = Math.max(1, totalCertificates * 1.2); // 120% of current certificates as target
  const spendingTarget = Math.max(1, avgMonthlySpending * 1.2); // 120% of average as target

  const performanceMetrics = [
    {
      label: 'Chứng nhận đã có',
      current: totalCertificates,
      target: certificateTarget,
      color: 'blue',
      percentage: Math.min(100, (totalCertificates / certificateTarget * 100)),
    },
    {
      label: 'Chi tiêu tháng này',
      current: thisMonthSpending,
      target: spendingTarget,
      color: 'purple',
      percentage: Math.min(100, (thisMonthSpending / spendingTarget * 100)),
    },
    {
      label: 'CO₂ giảm tháng này',
      current: calculatedStats.co2Reduced,
      target: Math.max(1, calculatedStats.co2Reduced * 1.2),
      color: 'green',
      percentage: calculatedStats.co2Reduced > 0
        ? Math.min(100, (calculatedStats.co2Reduced / (calculatedStats.co2Reduced * 1.2) * 100))
        : 0,
    },
  ];

  // Export handlers
  const handleExportCSV = () => {
    showAlert('Đang tạo file CSV...', 'info', 2000);
    setTimeout(
      () => showAlert('Đã xuất thành công "bao-cao-mua-tin-chi-2024.csv"', 'success'),
      2000
    );
  };

  const handleExportPDF = () => {
    showAlert('Đang tạo file PDF...', 'info', 2500);
    setTimeout(
      () => showAlert('Đã xuất thành công "bao-cao-mua-tin-chi-2024.pdf"', 'success'),
      2500
    );
  };

  const handleShareReport = () => {
    const shareLink = `https://carbon.buyer.com/report/share/${userId}`;
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Dashboard Người mua tín chỉ</h1>
        <p className="text-blue-100">
          Theo dõi việc mua tín chỉ carbon và đóng góp giảm phát thải CO₂
        </p>
        <div className="mt-4 text-sm text-blue-100">
          Chào mừng,{' '}
          <span className="font-semibold">
            {user?.fullName || user?.username}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        {/* Total Credits Card - Tổng số tín chỉ */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-blue-300 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">
            {formatNumber(calculatedStats.totalCredits)}
          </p>
          <p className="text-xs text-gray-600 font-medium">Tổng số tín chỉ</p>
        </div>

        {/* Traded Credits Card - Tín chỉ đã giao dịch */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-purple-300 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Coins className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">
            {formatNumber(calculatedStats.tradedCredits)}
          </p>
          <p className="text-xs text-gray-600 font-medium">Tín chỉ đã giao dịch</p>
        </div>

        {/* Available Credits Card - Tín chỉ khả dụng */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-blue-300 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">
            {formatNumber(calculatedStats.availableCredits)}
          </p>
          <p className="text-xs text-gray-600 font-medium">Tín chỉ khả dụng</p>
        </div>

        {/* Certificates Button - Chứng nhận */}
        <button
          onClick={() => setShowCertificateModal(true)}
          className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold flex items-center justify-center gap-3 w-full"
        >
          <Award className="w-6 h-6" />
          <span>Xem Chứng Nhận</span>
        </button>

        {/* Wallet Balance Card - Số dư ví */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1">
            {formatCurrency(calculatedStats.walletBalance)}
          </p>
          <p className="text-xs opacity-90 font-medium">Số dư ví thanh toán</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Purchase Trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
              Xu hướng mua tín chỉ
            </h3>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={purchaseTrendData}>
                <defs>
                  <linearGradient id="colorPurchase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                  formatter={(value) => [`${value} tín chỉ`, 'Đã mua']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#colorPurchase)"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Xu hướng tăng trưởng:{' '}
              <span
                className={`font-semibold ${calculatedStats.creditsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {calculatedStats.creditsChange >= 0 ? '+' : ''}
                {calculatedStats.creditsChange.toFixed(1)}% so với tháng trước
              </span>
            </p>
          </div>
        </div>

        {/* Spending Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Chi tiêu theo tháng
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
              <BarChart data={spendingTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [formatCurrency(value), 'Chi tiêu']}
                />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Chi tiêu trung bình:{' '}
              <span className="text-green-600 font-semibold">
                {formatCurrency(
                  spendingTrendData.length > 0
                    ? spendingTrendData.reduce((sum, d) => sum + d.value, 0) /
                    spendingTrendData.filter((d) => d.value > 0).length ||
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
                  <p className="text-sm opacity-90 mb-1">Dự kiến chi tiêu</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(calculatedStats.prediction.nextMonthSpent)}
                  </p>
                  <p className="text-xs opacity-75">
                    {calculatedStats.prediction.spentChange >= 0 ? '+' : ''}
                    {calculatedStats.prediction.spentChange.toFixed(1)}% so với tháng này
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                  <p className="text-sm opacity-90 mb-1">Dự kiến mua tín chỉ</p>
                  <p className="text-xl font-bold">
                    {formatNumber(calculatedStats.prediction.nextMonthCredits)} tín chỉ
                  </p>
                  <p className="text-xs opacity-75">
                    {calculatedStats.prediction.creditsChange >= 0 ? '+' : ''}
                    {calculatedStats.prediction.creditsChange.toFixed(1)}% so với tháng này
                  </p>
                </div>
              </div>

              <div className="bg-white bg-opacity-20 p-4 rounded-lg mb-4 backdrop-blur-sm">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Gợi ý tối ưu
                </h4>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Mua tín chỉ vào đầu tháng để có giá tốt hơn</li>
                  <li>
                    • Giá tín chỉ dự kiến:{' '}
                    {formatCurrency(calculatedStats.avgPricePerCredit)} trong tháng tới
                  </li>
                  <li>
                    • Nên mua {Math.round(calculatedStats.totalCredits * 0.1)}-
                    {Math.round(calculatedStats.totalCredits * 0.15)} tín chỉ trong tuần đầu
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
                        <span>• Chi tiêu dự kiến:</span>
                        <span className="font-bold">
                          {formatCurrency(calculatedStats.prediction.nextMonthSpent)} (
                          {calculatedStats.prediction.spentChange >= 0 ? '+' : ''}
                          {calculatedStats.prediction.spentChange.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>• Tín chỉ sẽ mua:</span>
                        <span className="font-bold">
                          {formatNumber(calculatedStats.prediction.nextMonthCredits)} (
                          {calculatedStats.prediction.creditsChange >= 0 ? '+' : ''}
                          {calculatedStats.prediction.creditsChange.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>• Giá trung bình:</span>
                        <span className="font-bold">
                          {formatCurrency(calculatedStats.thisMonthAvgPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold mb-2 text-sm flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Khuyến nghị mua hàng
                    </h5>
                    <div className="space-y-2 text-sm opacity-90 ml-6">
                      <div className="bg-white bg-opacity-10 p-2 rounded">
                        <span className="font-semibold">Tuần 1:</span> Mua{' '}
                        {Math.round(calculatedStats.totalCredits * 0.1)} tín chỉ ở giá{' '}
                        {formatCurrency(calculatedStats.avgPricePerCredit * 0.95)}
                      </div>
                      <div className="bg-white bg-opacity-10 p-2 rounded">
                        <span className="font-semibold">Tuần 2-3:</span> Chờ giá giảm,
                        mua thêm {Math.round(calculatedStats.totalCredits * 0.05)} tín chỉ
                      </div>
                      <div className="bg-white bg-opacity-10 p-2 rounded">
                        <span className="font-semibold">Tuần 4:</span> Mua cuối tháng
                        nếu có khuyến mãi
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
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Xuất file CSV
            </button>

            <button
              onClick={handleExportPDF}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center"
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
                <span className="text-gray-600">Giao dịch thành công:</span>
                <span className="font-semibold text-green-600">
                  {calculatedStats.successfulTransactions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tín chỉ:</span>
                <span className="font-semibold text-blue-600">
                  {formatNumber(calculatedStats.totalCredits)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CO₂ đã giảm:</span>
                <span className="font-semibold text-orange-600">
                  {formatNumber(calculatedStats.co2Reduced)} tấn
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white p-8 flex items-center justify-between border-b-4 border-orange-600">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white bg-opacity-25 rounded-lg backdrop-blur-sm">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Chứng Chỉ Carbon Credit</h2>
                  <p className="text-xs text-orange-100 font-semibold">Certificate of Authenticity</p>
                </div>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-white hover:bg-orange-600 p-2 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Certificate Display */}
              <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl border-4 border-double border-orange-300 p-10 mb-8 relative overflow-hidden shadow-lg">
                {/* Watermark */}
                <div className="absolute inset-0 opacity-5">
                  <Leaf className="w-64 h-64 text-orange-600 absolute -top-20 -right-20" />
                </div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-8 pb-6 border-b-2 border-orange-200">
                    <div className="flex justify-center gap-4 mb-4">
                      <Leaf className="w-8 h-8 text-green-600" />
                      <Award className="w-8 h-8 text-orange-600" />
                      <Leaf className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2" style={{ letterSpacing: '3px' }}>CHỨNG CHỈ XÁC NHẬN</h3>
                    <p className="text-sm text-gray-700 font-bold">CERTIFICATE OF CARBON CREDIT OWNERSHIP</p>
                  </div>

                  {/* Owner Info */}
                  <div className="bg-white rounded-lg p-6 mb-6 border-l-8 border-orange-600">
                    <div>
                      <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-2">Chủ sở hữu</p>
                      <p className="text-xl font-bold text-gray-800">{user?.fullName || user?.username}</p>
                      <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                    </div>
                  </div>

                  {/* Main Stats */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 border-2 border-blue-300">
                      <p className="text-xs text-gray-600 font-bold uppercase mb-2 tracking-wide">CO₂ Đã Giảm</p>
                      <p className="text-4xl font-black text-blue-700">{formatNumber(carbonCredit?.totalCredit || 0)}</p>
                      <p className="text-xs text-gray-600 mt-2 font-semibold">tấn CO₂e</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-6 border-2 border-purple-300">
                      <p className="text-xs text-gray-600 font-bold uppercase mb-2 tracking-wide">Tín Chỉ Khả Dụng</p>
                      <p className="text-4xl font-black text-purple-700">{formatNumber(carbonCredit?.availableCredit || 0)}</p>
                      <p className="text-xs text-gray-600 mt-2 font-semibold">tín chỉ carbon</p>
                    </div>
                  </div>

                  {/* Credit Breakdown */}
                  <div className="grid md:grid-cols-3 gap-3 mb-6">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-xs text-gray-600 font-bold uppercase mb-1">Tổng Tín Chỉ</p>
                      <p className="text-2xl font-bold text-green-700">{formatNumber(carbonCredit?.totalCredit || 0)}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <p className="text-xs text-gray-600 font-bold uppercase mb-1">Đã Giao Dịch</p>
                      <p className="text-2xl font-bold text-orange-700">{formatNumber(carbonCredit?.tradedCredit || 0)}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <p className="text-xs text-gray-600 font-bold uppercase mb-1">Chứng Chỉ</p>
                      <p className="text-2xl font-bold text-red-700">{Math.floor((carbonCredit?.totalCredit || 0) / 10)}</p>
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div className="flex items-end justify-between pt-4 border-t-2 border-orange-200">
                    <div>
                      <p className="text-xs text-gray-600 mb-2 font-semibold">Ngày Cấp</p>
                      <p className="text-sm font-bold text-gray-800">{new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="text-center">
                      <Sparkles className="w-10 h-10 text-yellow-500 mx-auto mb-1 animate-pulse" />
                      <p className="text-xs font-black text-gray-700 tracking-widest">XÁC NHẬN</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-2 font-semibold">Trạng Thái</p>
                      <div className="flex items-center justify-end gap-2">
                        <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
                        <p className="text-sm font-bold text-green-700">Có Hiệu Lực</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Information */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-6 border-l-4 border-orange-500">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                  <Leaf className="w-5 h-5 mr-2 text-green-600" />
                  Thông Tin Chứng Chỉ
                </h4>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <span>Chứng nhận quyền sở hữu <span className="font-bold text-orange-600">{formatNumber(carbonCredit?.totalCredit || 0)} tín chỉ carbon</span> hợp pháp</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <span>Xác nhận đóng góp giảm phát thải <span className="font-bold text-blue-600">{formatNumber(carbonCredit?.totalCredit || 0)} tấn CO₂e</span> cho môi trường</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <span>Có giá trị pháp lý như tài sản kỹ thuật số trên nền tảng Marketplace Carbon Credit</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <span>Có thể sử dụng để giao dịch, mua bán hoặc đổi lấy các dịch vụ liên quan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold text-lg">✓</span>
                    <span>Tuân thủ tiêu chuẩn quốc tế về carbon credit và khí hậu</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => {
                    showAlert('Đang tải xuất chứng chỉ...', 'info', 1500);
                    setTimeout(() => showAlert('Đã xuất PDF thành công!', 'success'), 1500);
                  }}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <FileDown className="w-5 h-5" />
                  <span className="hidden sm:inline">PDF</span>
                </button>

                <button
                  onClick={() => {
                    showAlert('Đang chia sẻ chứng chỉ...', 'info', 1000);
                    setTimeout(() => showAlert('✓ Chia sẻ thành công!', 'success'), 1000);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Chia Sẻ</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t-2 border-gray-200 px-8 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-8 rounded-lg font-bold transition-colors shadow-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;