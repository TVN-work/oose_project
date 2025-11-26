import { useState, useMemo } from 'react';
import { Receipt, Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, User, X, Calendar, CreditCard, Hash, FileText, Edit2, Save } from 'lucide-react';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import transactionService from '../../../services/transaction/transactionService';
import userService from '../../../services/user/userService';
import { formatCurrency, formatDate } from '../../../utils';
import Loading from '../../../components/common/Loading';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';

/**
 * Transactions Management Page for Verifier
 * View and manage all platform transactions
 */
const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const queryClient = useQueryClient();
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();

  // Fetch transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', 'verifier', page, pageSize, statusFilter, paymentMethodFilter],
    queryFn: () => transactionService.getAllTransactions({
      page,
      entry: pageSize,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      paymentMethod: paymentMethodFilter !== 'ALL' ? paymentMethodFilter : undefined,
      field: 'createdAt',
      sort: 'DESC',
    }),
    staleTime: 30000,
  });

  // Extract unique user IDs
  const userIds = useMemo(() => {
    if (!transactions) return [];
    const ids = new Set();
    transactions.forEach(t => {
      if (t.buyerId) ids.add(t.buyerId);
      if (t.sellerId) ids.add(t.sellerId);
    });
    return Array.from(ids);
  }, [transactions]);

  // Fetch user details for all buyers and sellers
  const userQueries = useQueries({
    queries: userIds.map(userId => ({
      queryKey: ['user', userId],
      queryFn: () => userService.getUserById(userId),
      staleTime: 60000,
      retry: 1,
    })),
  });

  // Create user lookup map
  const userMap = useMemo(() => {
    const map = {};
    userQueries.forEach((query, index) => {
      if (query.data) {
        map[userIds[index]] = query.data;
      }
    });
    return map;
  }, [userQueries, userIds]);

  // Mutation for updating transaction status
  const updateStatusMutation = useMutation({
    mutationFn: ({ transactionId, status }) => transactionService.updateTransactionStatus(transactionId, status),
    onSuccess: () => {
      // Refetch transactions
      queryClient.invalidateQueries(['transactions', 'verifier']);
      setIsEditingStatus(false);
      setSelectedTransaction(null);
      showAlert('Cập nhật trạng thái thành công!', 'success');
    },
    onError: (error) => {
      console.error('Error updating transaction status:', error);
      showAlert('Cập nhật trạng thái thất bại. Vui lòng thử lại!', 'error');
    },
  });

  // Handler for opening edit mode
  const handleEditStatus = () => {
    setNewStatus(selectedTransaction.status);
    setIsEditingStatus(true);
  };

  // Handler for saving status update
  const handleSaveStatus = () => {
    if (!newStatus || newStatus === selectedTransaction.status) {
      setIsEditingStatus(false);
      return;
    }
    updateStatusMutation.mutate({
      transactionId: selectedTransaction.id,
      status: newStatus,
    });
  };

  // Helper to get user display name
  const getUserDisplay = (userId) => {
    if (!userId) return 'N/A';
    const user = userMap[userId];
    if (user) {
      return user.fullName || user.username || user.email || userId.substring(0, 8);
    }
    return userId.substring(0, 8) + '...';
  };

  // Helper to format datetime - handles both ISO and pre-formatted strings
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: 'N/A', time: 'N/A' };

    // Check if it's already formatted as "HH:MM DD-MM-YYYY"
    if (typeof dateString === 'string' && dateString.includes('-') && dateString.includes(':')) {
      const parts = dateString.split(' ');
      if (parts.length >= 2) {
        const time = parts[0]; // "07:23"
        const datePart = parts[1]; // "26-11-2025"
        return { date: datePart, time: time };
      }
    }

    // Fallback to Date parsing for ISO format
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('vi-VN'),
        time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return { date: 'N/A', time: 'N/A' };
    }
  };

  // Filter transactions by search term
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    if (!searchTerm) return transactions;

    const searchLower = searchTerm.toLowerCase();
    return transactions.filter(transaction =>
      transaction.id?.toLowerCase().includes(searchLower) ||
      transaction.buyerId?.toLowerCase().includes(searchLower) ||
      transaction.sellerId?.toLowerCase().includes(searchLower) ||
      transaction.listingId?.toLowerCase().includes(searchLower)
    );
  }, [transactions, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!transactions) return { total: 0, success: 0, pending: 0, failed: 0, totalAmount: 0, totalCredit: 0 };

    return {
      total: transactions.length,
      success: transactions.filter(t => t.status === 'SUCCESS').length,
      pending: transactions.filter(t => t.status === 'PENDING_PAYMENT').length,
      failed: transactions.filter(t => t.status === 'FAILED' || t.status === 'CANCELED').length,
      totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      totalCredit: transactions.reduce((sum, t) => sum + (t.credit || 0), 0),
    };
  }, [transactions]);

  const getStatusBadge = (status) => {
    const config = {
      'SUCCESS': { icon: CheckCircle, text: 'Thành công', color: 'bg-green-100 text-green-700' },
      'PENDING_PAYMENT': { icon: Clock, text: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-700' },
      'FAILED': { icon: XCircle, text: 'Thất bại', color: 'bg-red-100 text-red-700' },
      'CANCELED': { icon: XCircle, text: 'Đã hủy', color: 'bg-gray-100 text-gray-700' },
    };

    const statusConfig = config[status] || config['PENDING_PAYMENT'];
    const Icon = statusConfig.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {statusConfig.text}
      </span>
    );
  };

  const getPaymentMethodBadge = (method) => {
    const colors = {
      'WALLET': 'bg-blue-100 text-blue-700',
      'VN_PAY': 'bg-orange-100 text-orange-700',
    };

    const labels = {
      'WALLET': 'Ví',
      'VN_PAY': 'VNPay',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colors[method] || 'bg-gray-100 text-gray-700'}`}>
        {labels[method] || method}
      </span>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {alertMessage && (
        <Alert
          key={`alert-${alertMessage}`}
          variant={alertType}
          dismissible
          position="toast"
          onDismiss={hideAlert}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Receipt className="mr-3 text-blue-600" />
            Quản lý giao dịch
          </h1>
          <p className="text-gray-600 mt-1">Theo dõi và quản lý tất cả giao dịch trên nền tảng</p>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
          <Download className="w-4 h-4" />
          Xuất báo cáo
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Tổng giao dịch</span>
            <Receipt className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Thành công: {stats.success}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Chờ thanh toán</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-500 mt-1">Cần xử lý</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Tổng giá trị</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalAmount)}</p>
          <p className="text-xs text-gray-500 mt-1">VND</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Tín chỉ giao dịch</span>
            <CheckCircle className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalCredit.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Tổng tín chỉ</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo ID giao dịch, người mua, người bán..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="SUCCESS">Thành công</option>
              <option value="PENDING_PAYMENT">Chờ thanh toán</option>
              <option value="FAILED">Thất bại</option>
              <option value="CANCELED">Đã hủy</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả phương thức</option>
              <option value="WALLET">Ví điện tử</option>
              <option value="VN_PAY">VNPay</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Receipt className="w-5 h-5 mr-2" />
            Danh sách giao dịch ({filteredTransactions.length})
          </h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Hiển thị:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPage(0);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">mục/trang</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full" style={{ minWidth: '1400px' }}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '160px' }}>Mã GD</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '220px' }}>Người mua</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '220px' }}>Người bán</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '140px' }}>Số lượng</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '160px' }}>Giá trị</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '140px' }}>Phương thức</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '150px' }}>Trạng thái</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '160px' }}>Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Không có giao dịch nào</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 transition cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <td className="py-3 px-4" style={{ minWidth: '160px' }}>
                      <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 whitespace-nowrap inline-block">
                        {transaction.id.substring(0, 12)}...
                      </span>
                    </td>
                    <td className="py-3 px-4" style={{ minWidth: '220px' }}>
                      <div className="flex items-center whitespace-nowrap">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {getUserDisplay(transaction.buyerId)}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            {transaction.buyerId?.substring(0, 12)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4" style={{ minWidth: '220px' }}>
                      <div className="flex items-center whitespace-nowrap">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {getUserDisplay(transaction.sellerId)}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            {transaction.sellerId?.substring(0, 12)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap" style={{ minWidth: '140px' }}>
                      <span className="text-sm font-semibold text-gray-800">
                        {transaction.credit?.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">tín chỉ</span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap" style={{ minWidth: '160px' }}>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap" style={{ minWidth: '140px' }}>
                      {getPaymentMethodBadge(transaction.paymentMethod)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap" style={{ minWidth: '150px' }}>
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap" style={{ minWidth: '160px' }}>
                      <div className="text-sm text-gray-600">
                        {formatDateTime(transaction.createdAt).date}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDateTime(transaction.createdAt).time}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Hiển thị {filteredTransactions.length > 0 ? page * pageSize + 1 : 0} - {Math.min((page + 1) * pageSize, filteredTransactions.length)} trong tổng số {filteredTransactions.length} giao dịch
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(0)}
                disabled={page === 0}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                «
              </button>
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ‹ Trước
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
                  const currentPage = page;
                  const pages = [];

                  let startPage = Math.max(0, currentPage - 2);
                  let endPage = Math.min(totalPages - 1, currentPage + 2);

                  if (currentPage < 2) {
                    endPage = Math.min(totalPages - 1, 4);
                  }
                  if (currentPage > totalPages - 3) {
                    startPage = Math.max(0, totalPages - 5);
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition ${currentPage === i
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                  return pages;
                })()}
              </div>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(filteredTransactions.length / pageSize) - 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Sau ›
              </button>
              <button
                onClick={() => setPage(Math.ceil(filteredTransactions.length / pageSize) - 1)}
                disabled={page >= Math.ceil(filteredTransactions.length / pageSize) - 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Receipt className="w-6 h-6 text-blue-600" />
                Chi tiết giao dịch
              </h2>
              <div className="flex items-center gap-2">
                {!isEditingStatus ? (
                  <button
                    onClick={handleEditStatus}
                    className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600"
                    title="Chỉnh sửa trạng thái"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSaveStatus}
                    disabled={updateStatusMutation.isPending}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {updateStatusMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedTransaction(null);
                    setIsEditingStatus(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Transaction ID & Status */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Mã giao dịch</p>
                    <p className="text-lg font-mono font-bold text-blue-600">
                      {selectedTransaction.id}
                    </p>
                  </div>
                  <div>
                    {isEditingStatus ? (
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                      >
                        <option value="PENDING_PAYMENT">Chờ thanh toán</option>
                        <option value="SUCCESS">Thành công</option>
                        <option value="FAILED">Thất bại</option>
                        <option value="CANCELED">Đã hủy</option>
                      </select>
                    ) : (
                      getStatusBadge(selectedTransaction.status)
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateTime(selectedTransaction.createdAt).date}</span>
                  <span className="text-gray-400">•</span>
                  <Clock className="w-4 h-4" />
                  <span>{formatDateTime(selectedTransaction.createdAt).time}</span>
                </div>
              </div>

              {/* Buyer & Seller Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-700">Người mua</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Tên</p>
                      <p className="text-sm font-medium text-gray-800">
                        {getUserDisplay(selectedTransaction.buyerId)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ID</p>
                      <p className="text-xs font-mono text-gray-600 break-all">
                        {selectedTransaction.buyerId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-700">Người bán</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Tên</p>
                      <p className="text-sm font-medium text-gray-800">
                        {getUserDisplay(selectedTransaction.sellerId)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ID</p>
                      <p className="text-xs font-mono text-gray-600 break-all">
                        {selectedTransaction.sellerId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Thông tin giao dịch
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-gray-600">Số lượng tín chỉ</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedTransaction.credit?.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-gray-600">Tổng giá trị</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Phương thức thanh toán</span>
                    <div>{getPaymentMethodBadge(selectedTransaction.paymentMethod)}</div>
                  </div>

                  {selectedTransaction.listingId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Mã niêm yết</span>
                      <span className="text-sm font-mono text-gray-800">
                        {selectedTransaction.listingId.substring(0, 16)}...
                      </span>
                    </div>
                  )}

                  {selectedTransaction.updatedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cập nhật lần cuối</span>
                      <span className="text-sm text-gray-800">
                        {formatDateTime(selectedTransaction.updatedAt).time} {formatDateTime(selectedTransaction.updatedAt).date}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <button
                onClick={() => {
                  setSelectedTransaction(null);
                  setIsEditingStatus(false);
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
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

export default Transactions;
