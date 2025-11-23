import { useState, useMemo } from 'react';
import { Download, RefreshCw, Eye, CreditCard, CheckCircle, Clock, XCircle, Search, RotateCcw, Calendar, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { buyerService } from '../../../services/buyer/buyerService';
import Loading from '../../../components/common/Loading';
import toast from 'react-hot-toast';
import { formatCurrency, formatCurrencyFromUsd, formatDate, usdToVnd } from '../../../utils';

const PurchaseHistory = () => {
  const [filters, setFilters] = useState({
    timeRange: '',
    status: '',
    priceRange: '',
  });

  // Build query params from filters
  const queryParams = useMemo(() => {
    const params = {};
    
    if (filters.status) {
      params.status = filters.status;
    }
    
    // Price range filter
    if (filters.priceRange) {
      if (filters.priceRange === 'under-1000') {
        params.maxPrice = 1000;
      } else if (filters.priceRange === '1000-5000') {
        params.minPrice = 1000;
        params.maxPrice = 5000;
      } else if (filters.priceRange === '5000-10000') {
        params.minPrice = 5000;
        params.maxPrice = 10000;
      } else if (filters.priceRange === 'over-10000') {
        params.minPrice = 10000;
      }
    }
    
    return params;
  }, [filters]);

  // Fetch purchase history from database
  const { data: purchaseHistoryData, isLoading, error, refetch } = useQuery({
    queryKey: ['buyer', 'purchase-history', queryParams],
    queryFn: () => buyerService.getPurchaseHistory(queryParams),
    staleTime: 30000, // 30 seconds
  });

  // Transform transactions to display format
  const transactions = useMemo(() => {
    if (!purchaseHistoryData?.data) return [];
    
    return purchaseHistoryData.data.map(tx => {
      const date = new Date(tx.created_at);
      const USD_TO_VND_RATE = 25000;
      const amountInVnd = (tx.amount || 0) * USD_TO_VND_RATE;
      const pricePerCredit = tx.credit > 0 ? (tx.amount || 0) / tx.credit : 0;
      const co2Saved = (tx.credit || 0) * 0.1; // Estimate: 1 credit ≈ 0.1 ton CO2
      
      // Determine transaction type
      const listing = tx.listing;
      const type = listing?.listing_type === 'auction' ? 'Đấu giá' : 'Mua tín chỉ';
      
      // Map status
      const statusMap = {
        'COMPLETED': 'success',
        'completed': 'success',
        'PENDING_PAYMENT': 'pending',
        'pending': 'pending',
        'PAYMENT_PROCESSING': 'pending',
        'CANCELLED': 'failed',
        'cancelled': 'failed',
        'FAILED': 'failed',
        'failed': 'failed',
      };
      const status = statusMap[tx.status?.toUpperCase()] || 'pending';
      
      return {
        id: tx.id,
        date: formatDate(tx.created_at),
        time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        seller: tx.seller?.full_name || 'Unknown',
        vehicle: 'Electric Vehicle', // Can be enhanced with vehicle data
        credits: tx.credit || 0,
        co2Saved: parseFloat(co2Saved.toFixed(2)),
        value: amountInVnd,
        pricePerCredit: pricePerCredit,
        status: status,
        type: type,
        transaction: tx,
      };
    });
  }, [purchaseHistoryData]);

  // Calculate summary stats (must be before early returns)
  const summary = useMemo(() => {
    const total = transactions.length;
    const success = transactions.filter(t => t.status === 'success').length;
    const pending = transactions.filter(t => t.status === 'pending').length;
    const failed = transactions.filter(t => t.status === 'failed').length;
    return { total, success, pending, failed };
  }, [transactions]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Không thể tải lịch sử mua hàng. Vui lòng thử lại sau.</p>
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
    refetch();
    toast.success(`🔍 Đã áp dụng bộ lọc. Tìm thấy ${transactions.length} giao dịch phù hợp!`);
  };

  const handleQuickFilter = (type) => {
    const filterNames = {
      today: 'Hôm nay',
      week: 'Tuần này',
      success: 'Thành công',
      pending: 'Đang xử lý',
    };
    toast.success(`🏷️ Đã lọc theo: ${filterNames[type]}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Thành công
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Đang xử lý
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Thất bại
          </span>
        );
      default:
        return null;
    }
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
          <button
            onClick={() => {
              setFilters({ timeRange: '', status: '', priceRange: '' });
              toast.success('🔄 Đã đặt lại tất cả bộ lọc về mặc định!');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Đặt lại bộ lọc
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng thời gian</label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả thời gian</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="3months">3 tháng qua</option>
              <option value="6months">6 tháng qua</option>
              <option value="1year">1 năm qua</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="pending">Đang xử lý</option>
              <option value="failed">Thất bại</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả mức giá</option>
              <option value="under-1000">Dưới {formatCurrencyFromUsd(1000)}</option>
              <option value="1000-3000">{formatCurrencyFromUsd(1000)} - {formatCurrencyFromUsd(3000)}</option>
              <option value="3000-5000">{formatCurrencyFromUsd(3000)} - {formatCurrencyFromUsd(5000)}</option>
              <option value="over-5000">Trên {formatCurrencyFromUsd(5000)}</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔍 Áp dụng
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Lọc nhanh:</span>
          <button
            onClick={() => handleQuickFilter('today')}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors flex items-center gap-1"
          >
            <Calendar className="w-3 h-3" />
            Hôm nay
          </button>
          <button
            onClick={() => handleQuickFilter('week')}
            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition-colors flex items-center gap-1"
          >
            <BarChart3 className="w-3 h-3" />
            Tuần này
          </button>
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
            Đang xử lý
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
                  Người bán
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số tín chỉ
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giá trị
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
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Chưa có giao dịch nào</h3>
                    <p className="text-gray-600">Bạn chưa mua tín chỉ carbon nào. Hãy khám phá marketplace để bắt đầu!</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">TX</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{tx.id}</div>
                        <div className="text-xs text-gray-500">{tx.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">{tx.date}</div>
                    <div className="text-xs text-gray-500">{tx.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-green-600 text-xs">🚗</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{tx.seller}</div>
                        <div className="text-xs text-gray-500">{tx.vehicle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-800">{tx.credits} tín chỉ</div>
                    <div className="text-xs text-gray-500">{tx.co2Saved} tấn CO2</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${
                      tx.status === 'failed' ? 'text-red-600' : tx.status === 'pending' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {tx.value > 0 ? formatCurrency(tx.value) : '0 VNĐ'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tx.value > 0 ? `${formatCurrencyFromUsd(tx.pricePerCredit)}/tín chỉ` : 'Giao dịch thất bại'}
                    </div>
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
              )))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {transactions.length} trong tổng số {summary.total} giao dịch
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                ← Trước
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</span>
              <span className="px-3 py-1 text-gray-600 text-sm">2</span>
              <span className="px-3 py-1 text-gray-600 text-sm">3</span>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                Sau →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;

