import { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Filter,
  RotateCcw,
  Calendar,
  DollarSign,
  Users,
  FileText,
  MessageSquare,
  X,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../../components/common/Modal';
import { useAdminTransactions, useResolveDispute } from '../../../hooks/useAdmin';
import Loading from '../../../components/common/Loading';
import { formatCurrency, formatNumber } from '../../../utils';

const TransactionsPage = () => {
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: '',
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [disputeResolution, setDisputeResolution] = useState({
    resolution: '',
    notes: '',
  });

  // Fetch transactions from API
  const { data: transactionsData, isLoading, refetch } = useAdminTransactions(filters);
  const transactions = transactionsData || [];
  
  const resolveDisputeMutation = useResolveDispute();

  // Calculate stats from transactions
  const completed = transactions.filter(tx => tx.status === 'COMPLETED' || tx.status === 'completed').length;
  const processing = transactions.filter(tx => tx.status === 'PENDING' || tx.status === 'PROCESSING' || tx.status === 'processing').length;
  const disputes = transactions.filter(tx => tx.status === 'DISPUTE' || tx.status === 'dispute').length;
  const failed = transactions.filter(tx => tx.status === 'FAILED' || tx.status === 'CANCELLED' || tx.status === 'failed' || tx.status === 'cancelled').length;

  const totalValue = transactions.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);
  const totalFees = transactions.reduce((sum, tx) => sum + (parseFloat(tx.fee) || parseFloat(tx.amount) * 0.03 || 0), 0);

  const stats = [
    {
      icon: CheckCircle,
      value: formatNumber(completed),
      label: 'Hoàn thành',
      color: 'green',
    },
    {
      icon: Clock,
      value: formatNumber(processing),
      label: 'Đang xử lý',
      color: 'orange',
    },
    {
      icon: AlertTriangle,
      value: formatNumber(disputes),
      label: 'Tranh chấp',
      color: 'red',
    },
    {
      icon: XCircle,
      value: formatNumber(failed),
      label: 'Thất bại/Hủy',
      color: 'purple',
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    refetch();
    toast.success('Đã áp dụng bộ lọc');
  };

  const resetFilters = () => {
    setFilters({ status: '', date: '', search: '' });
    refetch();
    toast.success('Đã đặt lại bộ lọc');
  };

  const viewDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleResolveDispute = (transaction) => {
    setSelectedTransaction(transaction);
    setDisputeResolution({ resolution: '', notes: '' });
    setShowDisputeModal(true);
  };

  const confirmResolveDispute = async () => {
    if (!disputeResolution.resolution.trim()) {
      toast.error('Vui lòng chọn phương án giải quyết');
      return;
    }

    try {
      await resolveDisputeMutation.mutateAsync({
        transactionId: selectedTransaction.id,
        resolutionData: {
          resolution: disputeResolution.resolution,
          notes: disputeResolution.notes,
        },
      });
      refetch();
      setShowDisputeModal(false);
      setSelectedTransaction(null);
      setDisputeResolution({ resolution: '', notes: '' });
    } catch (error) {
      // Error handled by hook
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      COMPLETED: { text: 'Hoàn thành', color: 'green', icon: CheckCircle },
      completed: { text: 'Hoàn thành', color: 'green', icon: CheckCircle },
      PENDING: { text: 'Đang xử lý', color: 'yellow', icon: Clock },
      pending: { text: 'Đang xử lý', color: 'yellow', icon: Clock },
      PROCESSING: { text: 'Đang xử lý', color: 'yellow', icon: Clock },
      processing: { text: 'Đang xử lý', color: 'yellow', icon: Clock },
      DISPUTE: { text: 'Tranh chấp', color: 'red', icon: AlertTriangle },
      dispute: { text: 'Tranh chấp', color: 'red', icon: AlertTriangle },
      FAILED: { text: 'Thất bại', color: 'purple', icon: XCircle },
      failed: { text: 'Thất bại', color: 'purple', icon: XCircle },
      CANCELLED: { text: 'Đã hủy', color: 'gray', icon: XCircle },
      cancelled: { text: 'Đã hủy', color: 'gray', icon: XCircle },
    };

    const badge = statusMap[status] || statusMap.PENDING;
    const Icon = badge.icon;

    const colorClasses = {
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colorClasses[badge.color]}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  const exportTransactions = () => {
    toast.info('Đang xuất dữ liệu giao dịch...');
    // TODO: Implement export functionality
  };

  if (isLoading) {
    return <Loading />;
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = !filters.search || 
      (tx.id || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (tx.seller_name || tx.seller || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (tx.buyer_name || tx.buyer || '').toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || 
      (tx.status || '').toLowerCase() === filters.status.toLowerCase();
    
    const matchesDate = !filters.date || 
      (tx.created_at && new Date(tx.created_at).toISOString().split('T')[0] === filters.date);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quản lý giao dịch</h2>
            <p className="opacity-90 mb-4">
              Tổng cộng {formatNumber(transactions.length)} giao dịch với giá trị {formatCurrency(totalValue)}
            </p>
            <div className="flex space-x-4">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">{formatNumber(processing)} giao dịch đang xử lý</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">{formatNumber(disputes)} tranh chấp cần xử lý</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">Phí hệ thống: {formatCurrency(totalFees)}</span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <CreditCard className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: { bg: 'bg-green-500', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
            orange: { bg: 'bg-orange-500', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
            red: { bg: 'bg-red-500', text: 'text-red-600', gradient: 'from-red-500 to-red-600' },
            purple: { bg: 'bg-purple-500', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
          };
          const colors = colorClasses[stat.color] || colorClasses.green;

          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-lg transition-all">
              <div className={`w-12 h-12 bg-gradient-to-r ${colors.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className={`text-2xl font-bold ${colors.text} mb-1`}>{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Tìm mã GD, người bán, người mua..."
                value={filters.search}
                onChange={handleFilterChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="completed">Hoàn thành</option>
              <option value="processing">Đang xử lý</option>
              <option value="pending">Chờ xử lý</option>
              <option value="dispute">Tranh chấp</option>
              <option value="failed">Thất bại</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center text-sm font-semibold"
            >
              <Search className="w-4 h-4 mr-2" />
              Áp dụng
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center text-sm font-semibold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Đặt lại
            </button>
          </div>
          <button
            onClick={exportTransactions}
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
          <CreditCard className="w-5 h-5 mr-2" />
          Danh sách giao dịch ({filteredTransactions.length})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Mã GD</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Thời gian</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Người bán</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Người mua</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Tín chỉ</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Giá trị</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Phí</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Trạng thái</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Chưa có giao dịch nào</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {filters.status || filters.date || filters.search
                        ? 'Không tìm thấy giao dịch phù hợp với bộ lọc'
                        : 'Giao dịch sẽ xuất hiện khi có hoạt động mua bán'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        #{tx.id?.substring(0, 8) || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {tx.created_at 
                        ? new Date(tx.created_at).toLocaleString('vi-VN')
                        : tx.time || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                          <Users className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {tx.seller_name || tx.seller || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {tx.buyer_name || tx.buyer || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-green-600 text-sm">
                      {formatNumber(tx.credit || tx.credits || 0)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-blue-600 text-sm">
                      {formatCurrency(tx.amount || 0)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-orange-600 text-sm">
                      {formatCurrency(tx.fee || (tx.amount * 0.03) || 0)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(tx.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => viewDetail(tx)}
                          className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </button>
                        {(tx.status === 'DISPUTE' || tx.status === 'dispute') && (
                          <button
                            onClick={() => handleResolveDispute(tx)}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Giải quyết
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={showDetailModal} 
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTransaction(null);
        }} 
        title="Chi tiết giao dịch"
        size="large"
      >
        {selectedTransaction && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã giao dịch</label>
                  <p className="text-gray-800 font-mono text-sm">{selectedTransaction.id || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                  <p className="text-gray-800 text-sm">
                    {selectedTransaction.created_at 
                      ? new Date(selectedTransaction.created_at).toLocaleString('vi-VN')
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Người bán</label>
                  <p className="text-gray-800">{selectedTransaction.seller_name || selectedTransaction.seller || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Người mua</label>
                  <p className="text-gray-800">{selectedTransaction.buyer_name || selectedTransaction.buyer || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tín chỉ</label>
                  <p className="text-gray-800 font-bold">{formatNumber(selectedTransaction.credit || selectedTransaction.credits || 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị</label>
                  <p className="text-gray-800 font-bold">{formatCurrency(selectedTransaction.amount || 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phí hệ thống</label>
                  <p className="text-gray-800 font-bold">{formatCurrency(selectedTransaction.fee || (selectedTransaction.amount * 0.03) || 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
              </div>
            </div>
            {selectedTransaction.payment_method && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
                <p className="text-gray-800">{selectedTransaction.payment_method}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Dispute Resolution Modal */}
      <Modal 
        isOpen={showDisputeModal} 
        onClose={() => {
          setShowDisputeModal(false);
          setSelectedTransaction(null);
          setDisputeResolution({ resolution: '', notes: '' });
        }} 
        title="Giải quyết tranh chấp"
        size="large"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Giao dịch:</strong> #{selectedTransaction.id?.substring(0, 8) || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Giá trị:</strong> {formatCurrency(selectedTransaction.amount || 0)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phương án giải quyết *</label>
              <select
                value={disputeResolution.resolution}
                onChange={(e) => setDisputeResolution({ ...disputeResolution, resolution: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Chọn phương án...</option>
                <option value="refund_buyer">Hoàn tiền cho người mua</option>
                <option value="refund_seller">Hoàn tiền cho người bán</option>
                <option value="partial_refund">Hoàn tiền một phần</option>
                <option value="complete_transaction">Hoàn tất giao dịch</option>
                <option value="cancel_transaction">Hủy giao dịch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
              <textarea
                value={disputeResolution.notes}
                onChange={(e) => setDisputeResolution({ ...disputeResolution, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows="4"
                placeholder="Nhập ghi chú về quyết định giải quyết tranh chấp..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setShowDisputeModal(false);
                  setSelectedTransaction(null);
                  setDisputeResolution({ resolution: '', notes: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmResolveDispute}
                disabled={resolveDisputeMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {resolveDisputeMutation.isPending ? 'Đang xử lý...' : 'Xác nhận giải quyết'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransactionsPage;
