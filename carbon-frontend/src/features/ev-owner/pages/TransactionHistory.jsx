import { useState, useEffect } from 'react';
import {
  Receipt,
  Download,
  Filter,
  Eye,
  XCircle,
  CheckCircle2,
  Clock,
  X,
  ArrowUpRight,
  Calendar,
  User,
  CreditCard,
  FileText
} from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { evOwnerService } from '../../../services/evOwner/evOwnerService';
import { useAuth } from '../../../context/AuthContext';
import Loading from '../../../components/common/Loading';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';
import { formatCurrencyFromUsd } from '../../../utils';
import { TRANSACTION_STATUS, TRANSACTION_STATUS_LABELS } from '../../../types/constants';

/**
 * Transaction Management - UC05: Manage Transactions
 * 
 * Quản lý TẤT CẢ giao dịch BÁN của EV Owner:
 * - Chỉ hiển thị giao dịch mà EV Owner là seller
 * - Theo dõi, hủy, hoàn tất giao dịch
 * - Tự động cập nhật khi có giao dịch mới
 * 
 * Database: transactions table (buyer_id, seller_id, listing_id, status)
 */
const TransactionHistory = () => {
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Set current user ID in localStorage for mock database
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem('currentUserId', user.id);
    }
  }, [user]);

  // Fetch transactions where current user is SELLER (from database)
  const { data: transactionsData, isLoading, refetch } = useQuery({
    queryKey: ['evOwner', 'transactions'],
    queryFn: () => evOwnerService.getTransactions(), // Get transactions where user is seller
    staleTime: 0,
    refetchOnMount: 'always',
    refetchInterval: 5000, // Auto-refetch every 5 seconds to catch new transactions
  });

  const transactions = transactionsData?.data || transactionsData || [];

  // Listen for transaction creation events
  useEffect(() => {
    const handleTransactionCreated = () => {
      // Refetch transactions when a new transaction is created
      refetch();
    };

    // Listen for custom event when transaction is created
    window.addEventListener('transaction-created', handleTransactionCreated);

    return () => {
      window.removeEventListener('transaction-created', handleTransactionCreated);
    };
  }, [refetch]);

  // Cancel transaction mutation
  const cancelMutation = useMutation({
    mutationFn: (transactionId) => evOwnerService.cancelTransaction(transactionId),
    onSuccess: () => {
      showAlert('Đã hủy giao dịch thành công!', 'success');
      queryClient.invalidateQueries({ queryKey: ['evOwner', 'transactions'] });
    },
    onError: (error) => {
      showAlert(error.message || 'Lỗi khi hủy giao dịch', 'error');
    },
  });

  // Complete transaction mutation
  const completeMutation = useMutation({
    mutationFn: (transactionId) => evOwnerService.completeTransaction(transactionId),
    onSuccess: () => {
      showAlert('Đã hoàn tất giao dịch thành công!', 'success');
      queryClient.invalidateQueries({ queryKey: ['evOwner', 'transactions'] });
    },
    onError: (error) => {
      showAlert(error.message || 'Lỗi khi hoàn tất giao dịch', 'error');
    },
  });

  // Handle cancel transaction
  const handleCancelTransaction = async (transaction) => {
    if (!confirm(`Bạn có chắc muốn hủy giao dịch ${transaction.id.substring(0, 8)}?`)) return;

    const canCancel = transaction.status === TRANSACTION_STATUS.PENDING ||
      transaction.status === TRANSACTION_STATUS.PAYMENT_PROCESSING;

    if (!canCancel) {
      showAlert('Chỉ có thể hủy giao dịch đang chờ thanh toán hoặc đang xử lý!', 'error');
      return;
    }

    cancelMutation.mutate(transaction.id);
  };

  // Handle complete transaction
  const handleCompleteTransaction = async (transaction) => {
    if (!confirm(`Bạn có chắc muốn hoàn tất giao dịch ${transaction.id.substring(0, 8)}?`)) return;

    const canComplete = transaction.status === TRANSACTION_STATUS.PAYMENT_PROCESSING ||
      transaction.status === TRANSACTION_STATUS.PENDING;

    if (!canComplete) {
      showAlert('Chỉ có thể hoàn tất giao dịch đang xử lý!', 'error');
      return;
    }

    completeMutation.mutate(transaction.id);
  };

  // Handle view details
  const handleViewDetails = async (transaction) => {
    try {
      const detail = await evOwnerService.getTransactionById(transaction.id);
      setSelectedTransaction(detail?.data || detail || transaction);
      setShowDetailModal(true);
    } catch (error) {
      // Fallback to current transaction data
      setSelectedTransaction(transaction);
      setShowDetailModal(true);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  // Calculate summary
  const summary = [
    {
      label: 'Tổng giao dịch',
      value: transactions.length,
      color: 'blue',
      icon: Receipt,
    },
    {
      label: 'Hoàn thành',
      value: transactions.filter(tx =>
        tx.status === TRANSACTION_STATUS.COMPLETED ||
        tx.status?.toUpperCase() === 'COMPLETED'
      ).length,
      color: 'green',
      icon: CheckCircle2,
    },
    {
      label: 'Đang xử lý',
      value: transactions.filter(tx => {
        const status = (tx.status || '').toUpperCase();
        return status === TRANSACTION_STATUS.PENDING ||
          status === TRANSACTION_STATUS.PAYMENT_PROCESSING ||
          status === 'PENDING';
      }).length,
      color: 'yellow',
      icon: Clock,
    },
    {
      label: 'Đã hủy',
      value: transactions.filter(tx =>
        tx.status === TRANSACTION_STATUS.CANCELLED ||
        tx.status?.toUpperCase() === 'CANCELLED'
      ).length,
      color: 'red',
      icon: XCircle,
    },
  ];

  const handleExport = () => {
    showAlert('Đang xuất file Excel...', 'info', 2000);
    setTimeout(() => {
      showAlert('Đã xuất file Excel thành công!', 'success');
    }, 2000);
  };

  // Filter transactions by status only (all are sell transactions)
  const filteredTransactions = transactions.filter(tx => {
    if (!statusFilter) return true;
    const txStatus = (tx.status || '').toUpperCase();
    return txStatus === statusFilter;
  });

  // Get status badge
  const getStatusBadge = (status) => {
    const statusUpper = (status || TRANSACTION_STATUS.PENDING).toUpperCase();
    const label = TRANSACTION_STATUS_LABELS[statusUpper] || 'Chờ xử lý';

    const configs = {
      [TRANSACTION_STATUS.COMPLETED]: {
        label,
        color: 'bg-green-100 text-green-700',
        icon: CheckCircle2
      },
      [TRANSACTION_STATUS.PAYMENT_PROCESSING]: {
        label,
        color: 'bg-blue-100 text-blue-700',
        icon: Clock
      },
      [TRANSACTION_STATUS.PENDING]: {
        label,
        color: 'bg-yellow-100 text-yellow-700',
        icon: Clock
      },
      [TRANSACTION_STATUS.CANCELLED]: {
        label,
        color: 'bg-red-100 text-red-700',
        icon: XCircle
      },
      [TRANSACTION_STATUS.FAILED]: {
        label,
        color: 'bg-gray-100 text-gray-700',
        icon: XCircle
      },
    };

    const config = configs[statusUpper] || configs[TRANSACTION_STATUS.PENDING];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Get transaction type badge (always SELL for EV Owner)
  const getTypeBadge = () => {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <ArrowUpRight className="w-3 h-3 mr-1" />
        Bán
      </span>
    );
  };

  // Check if transaction can be cancelled
  const canCancel = (tx) => {
    const status = (tx.status || '').toUpperCase();
    return status === TRANSACTION_STATUS.PENDING ||
      status === TRANSACTION_STATUS.PAYMENT_PROCESSING;
  };

  // Check if transaction can be completed
  const canComplete = (tx) => {
    const status = (tx.status || '').toUpperCase();
    return status === TRANSACTION_STATUS.PAYMENT_PROCESSING ||
      status === TRANSACTION_STATUS.PENDING;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
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
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Quản lý giao dịch</h1>
        <p className="text-green-100">
          Theo dõi, hủy, hoặc hoàn tất tất cả giao dịch của bạn
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summary.map((item, index) => {
          const cardClasses = {
            blue: 'bg-blue-500 text-white',
            green: 'bg-green-500 text-white',
            yellow: 'bg-yellow-500 text-white',
            red: 'bg-red-500 text-white',
          };

          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`${cardClasses[item.color]} rounded-lg p-6 text-center`}
            >
              <Icon className="w-6 h-6 mx-auto mb-2 opacity-90" />
              <p className="text-3xl font-bold mb-1">
                {item.value}
              </p>
              <p className="text-sm font-medium opacity-90">{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter & Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value={TRANSACTION_STATUS.COMPLETED}>Hoàn thành</option>
              <option value={TRANSACTION_STATUS.PAYMENT_PROCESSING}>Đang xử lý</option>
              <option value={TRANSACTION_STATUS.PENDING}>Chờ thanh toán</option>
              <option value={TRANSACTION_STATUS.CANCELLED}>Đã hủy</option>
              <option value={TRANSACTION_STATUS.FAILED}>Thất bại</option>
            </select>

          </div>

          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center text-sm font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Receipt className="w-5 h-5 mr-2" />
          Danh sách giao dịch ({filteredTransactions.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Loại</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Mã GD</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Ngày</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Người mua</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Số tín chỉ</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Tổng tiền</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">PT Thanh toán</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Trạng thái</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center">
                    <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Chưa có giao dịch nào</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {statusFilter
                        ? 'Không tìm thấy giao dịch phù hợp với bộ lọc'
                        : 'Giao dịch sẽ xuất hiện khi có người mua tín chỉ của bạn'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const date = new Date(tx.created_at || tx.createdAt);
                  const buyer = tx.buyer || { full_name: tx.buyer_name, email: tx.buyer_email };

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        {getTypeBadge()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                          #{(tx.id || '').substring(0, 8)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-800">
                            {date.toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <p className="font-medium text-gray-800">
                          {buyer?.full_name || buyer?.fullName || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {buyer?.email || 'N/A'}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-green-600">
                          {(tx.credit || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div>
                          <p className="font-bold text-green-600">
                            +{formatCurrencyFromUsd(tx.amount || 0)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrencyFromUsd((tx.amount || 0) / (tx.credit || 1))}/tín chỉ
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        <span className="text-gray-700 capitalize">
                          {tx.payment_method || 'E-wallet'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(tx.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(tx)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canComplete(tx) && (
                            <button
                              onClick={() => handleCompleteTransaction(tx)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Hoàn tất"
                              disabled={completeMutation.isPending}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {canCancel(tx) && (
                            <button
                              onClick={() => handleCancelTransaction(tx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hủy giao dịch"
                              disabled={cancelMutation.isPending}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết giao dịch</h2>
                <p className="text-gray-600 mt-1 text-sm">
                  Mã: #{selectedTransaction.id?.substring(0, 8) || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Transaction Type & Status */}
              <div className="flex items-center justify-between">
                <div>
                  {getTypeBadge()}
                </div>
                <div>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
              </div>

              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Ngày tạo</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedTransaction.created_at || selectedTransaction.createdAt)
                      .toLocaleString('vi-VN')}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-medium">Phương thức</span>
                  </div>
                  <p className="font-semibold text-gray-900 capitalize">
                    {selectedTransaction.payment_method || 'E-wallet'}
                  </p>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Người mua</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {selectedTransaction.buyer?.full_name || selectedTransaction.buyer_name || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedTransaction.buyer?.email || selectedTransaction.buyer_email || 'N/A'}
                </p>
              </div>

              {/* Amount & Credit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm text-gray-600 mb-2">Số tín chỉ</div>
                  <p className="text-2xl font-bold text-green-600">
                    {(selectedTransaction.credit || 0).toFixed(2)}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm text-gray-600 mb-2">Tổng tiền</div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrencyFromUsd(selectedTransaction.amount || 0)}
                  </p>
                </div>
              </div>

              {/* Payment URL if exists */}
              {selectedTransaction.payment_url && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Link thanh toán</span>
                  </div>
                  <a
                    href={selectedTransaction.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm break-all"
                  >
                    {selectedTransaction.payment_url}
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {canComplete(selectedTransaction) && (
                  <button
                    onClick={() => {
                      handleCompleteTransaction(selectedTransaction);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                    disabled={completeMutation.isPending}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Hoàn tất
                  </button>
                )}
                {canCancel(selectedTransaction) && (
                  <button
                    onClick={() => {
                      handleCancelTransaction(selectedTransaction);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2"
                    disabled={cancelMutation.isPending}
                  >
                    <XCircle className="w-4 h-4" />
                    Hủy giao dịch
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
