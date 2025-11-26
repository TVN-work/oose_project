import { useState, useMemo } from 'react';
import {
  Download,
  RefreshCw,
  Eye,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  RotateCcw,
  Calendar,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTransactions, useTransactionUtils } from '../../../hooks/useTransaction';
import { TRANSACTION_STATUSES } from '../../../services/transaction/transactionService';
import { useAuth } from '../../../context/AuthContext';
import Loading from '../../../components/common/Loading';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../../utils';

const PurchaseHistory = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({
    timeRange: '',
    status: '',
    priceRange: '',
  });

  // Get transaction utilities
  const { getStatusDisplay, getPaymentMethodDisplay } = useTransactionUtils();

  // Build query params from filters for transactionService.getAllTransactions
  const queryParams = useMemo(() => {
    const params = {
      buyerId: userId,
      page: currentPage,
      entry: pageSize,
      field: 'createdAt',
      sort: 'DESC',
    };

    // Status filter
    if (filters.status) {
      params.status = filters.status;
    }

    // Price range filter (VND)
    // Note: amount filter in API is exact match, so we can't use range
    // For now, we'll filter on client side after fetching

    return params;
  }, [userId, currentPage, pageSize, filters.status]);

  // Fetch transactions from API using useTransactions hook with buyerId filter
  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useTransactions(queryParams);

  // Process transactions data
  const transactions = useMemo(() => {
    const data = Array.isArray(transactionsData) ? transactionsData : [];

    // Apply client-side price range filter if needed
    let filteredData = data;
    if (filters.priceRange) {
      filteredData = data.filter((tx) => {
        const amount = tx.amount || 0;
        switch (filters.priceRange) {
          case 'under-500k':
            return amount < 500000;
          case '500k-1m':
            return amount >= 500000 && amount < 1000000;
          case '1m-5m':
            return amount >= 1000000 && amount < 5000000;
          case 'over-5m':
            return amount >= 5000000;
          default:
            return true;
        }
      });
    }

    return filteredData.map((tx) => {
      const createdDate = new Date(tx.createdAt);
      const pricePerCredit = tx.credit > 0 ? tx.amount / tx.credit : 0;
      const co2Saved = (tx.credit || 0) * 0.1; // Estimate: 1 credit ≈ 0.1 ton CO2

      return {
        id: tx.id,
        date: formatDate(tx.createdAt),
        time: createdDate.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sellerId: tx.sellerId,
        listingId: tx.listingId,
        credits: tx.credit || 0,
        co2Saved: parseFloat(co2Saved.toFixed(2)),
        amount: tx.amount || 0,
        pricePerCredit: pricePerCredit,
        status: tx.status,
        paymentMethod: tx.paymentMethod,
        paidAt: tx.paidAt,
        transaction: tx,
      };
    });
  }, [transactionsData, filters.priceRange]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const data = Array.isArray(transactionsData) ? transactionsData : [];
    const total = data.length;
    const success = data.filter(
      (t) => t.status === TRANSACTION_STATUSES.SUCCESS
    ).length;
    const pending = data.filter(
      (t) => t.status === TRANSACTION_STATUSES.PENDING_PAYMENT
    ).length;
    const failed = data.filter(
      (t) =>
        t.status === TRANSACTION_STATUSES.FAILED ||
        t.status === TRANSACTION_STATUSES.CANCELED
    ).length;
    const totalAmount = data
      .filter((t) => t.status === TRANSACTION_STATUSES.SUCCESS)
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalCredits = data
      .filter((t) => t.status === TRANSACTION_STATUSES.SUCCESS)
      .reduce((sum, t) => sum + (t.credit || 0), 0);
    return { total, success, pending, failed, totalAmount, totalCredits };
  }, [transactionsData]);

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (transactions.length === pageSize) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const display = getStatusDisplay(status);
    const colorMap = {
      yellow: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: Clock,
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle,
      },
      red: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircle,
      },
      gray: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: Clock,
      },
    };

    const colorInfo = colorMap[display.color] || colorMap.gray;
    const Icon = colorInfo.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorInfo.bg} ${colorInfo.text}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {display.text}
      </span>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">
            Không thể tải lịch sử mua hàng. Vui lòng thử lại sau.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    toast.success('Đang xuất file Excel chứa lịch sử giao dịch...');
    setTimeout(() => {
      toast.success('✅ Đã xuất file Excel thành công!');
    }, 1500);
  };

  const handleRefresh = () => {
    refetch();
    toast.success('🔄 Đã cập nhật danh sách giao dịch mới nhất!');
  };

  const handleViewDetails = (transactionId) => {
    toast.success(`Đang xem chi tiết giao dịch ${transactionId}...`);
  };

  const handleApplyFilters = () => {
    setCurrentPage(0);
    refetch();
    toast.success('🔍 Đã áp dụng bộ lọc!');
  };

  const handleResetFilters = () => {
    setFilters({ timeRange: '', status: '', priceRange: '' });
    setCurrentPage(0);
    refetch();
    toast.success('🔄 Đã đặt lại tất cả bộ lọc về mặc định!');
  };

  const handleQuickFilter = (type) => {
    if (type === 'success') {
      setFilters((prev) => ({ ...prev, status: TRANSACTION_STATUSES.SUCCESS }));
    } else if (type === 'pending') {
      setFilters((prev) => ({
        ...prev,
        status: TRANSACTION_STATUSES.PENDING_PAYMENT,
      }));
    }
    setCurrentPage(0);
    setTimeout(() => refetch(), 100);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
          <p className="text-sm text-gray-600">Tổng giao dịch</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{summary.success}</p>
          <p className="text-sm text-gray-600">Thành công</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{summary.pending}</p>
          <p className="text-sm text-gray-600">Đang xử lý</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{summary.failed}</p>
          <p className="text-sm text-gray-600">Thất bại</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Search className="w-5 h-5 mr-3" />
            Lọc giao dịch
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`}
              />
            </button>
            <button
              onClick={handleResetFilters}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              Đặt lại bộ lọc
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value={TRANSACTION_STATUSES.SUCCESS}>Thành công</option>
              <option value={TRANSACTION_STATUSES.PENDING_PAYMENT}>
                Chờ thanh toán
              </option>
              <option value={TRANSACTION_STATUSES.FAILED}>Thất bại</option>
              <option value={TRANSACTION_STATUSES.CANCELED}>Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng giá
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) =>
                setFilters({ ...filters, priceRange: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả mức giá</option>
              <option value="under-500k">Dưới 500.000đ</option>
              <option value="500k-1m">500.000đ - 1.000.000đ</option>
              <option value="1m-5m">1.000.000đ - 5.000.000đ</option>
              <option value="over-5m">Trên 5.000.000đ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tổng chi tiêu
            </label>
            <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-700 font-semibold">
                {formatCurrency(summary.totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔍 Áp dụng
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Lọc nhanh:</span>
          <button
            onClick={() => handleQuickFilter('success')}
            className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs hover:bg-emerald-200 transition-colors flex items-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            Thành công
          </button>
          <button
            onClick={() => handleQuickFilter('pending')}
            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs hover:bg-yellow-200 transition-colors flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            Chờ thanh toán
          </button>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <CreditCard className="w-5 h-5 mr-3" />
              Lịch sử giao dịch
            </h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </button>
              <button
                onClick={handleRefresh}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mã giao dịch
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày giao dịch
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số tín chỉ
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giá trị
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Chưa có giao dịch nào
                    </h3>
                    <p className="text-gray-600">
                      Bạn chưa mua tín chỉ carbon nào. Hãy khám phá marketplace
                      để bắt đầu!
                    </p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const paymentDisplay = getPaymentMethodDisplay(
                    tx.paymentMethod
                  );
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold text-sm">
                              TX
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-800">
                              {tx.id?.slice(0, 8)}...
                            </div>
                            <div className="text-xs text-gray-500">
                              Listing: {tx.listingId?.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-800">{tx.date}</div>
                        <div className="text-xs text-gray-500">{tx.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-800">
                          {tx.credits} tín chỉ
                        </div>
                        <div className="text-xs text-gray-500">
                          ~{tx.co2Saved} tấn CO2
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">
                          {formatCurrency(tx.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(tx.pricePerCredit)}/tín chỉ
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${paymentDisplay.color}-100 text-${paymentDisplay.color}-800`}
                        >
                          {paymentDisplay.text}
                        </span>
                        {tx.paidAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(tx.paidAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(tx.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleViewDetails(tx.id)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center mx-auto"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {transactions.length} giao dịch - Trang {currentPage + 1}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${currentPage === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                {currentPage + 1}
              </span>
              <button
                onClick={handleNextPage}
                disabled={transactions.length < pageSize}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${transactions.length < pageSize
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;

