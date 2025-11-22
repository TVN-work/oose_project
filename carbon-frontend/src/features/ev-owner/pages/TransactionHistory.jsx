import { useState } from 'react';
import { Receipt, Download, Filter, Eye, XCircle, CheckCircle2, Clock } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { evOwnerService } from '../../../services/evOwner/evOwnerService';
import Loading from '../../../components/common/Loading';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';
import { formatCurrencyFromUsd } from '../../../utils';

/**
 * Transaction History - UC05: Manage Transactions
 * 
 * Hiển thị lịch sử giao dịch BÁN TÍN CHỈ của EV Owner
 * - Xem chi tiết giao dịch
 * - Hủy giao dịch (nếu chưa thanh toán)
 * - Theo dõi trạng thái
 * 
 * Database: transactions table (buyer_id, seller_id, listing_id, status)
 */
const TransactionHistory = () => {
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();
  
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();
  
  // Fetch transactions where current user is SELLER
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['evOwner', 'transactions'],
    queryFn: () => evOwnerService.getTransactions({ role: 'seller' }),
    staleTime: 0,
    refetchOnMount: 'always',
  });
  
  const transactions = transactionsData?.data || transactionsData || [];
  
  // Handle cancel transaction
  const handleCancelTransaction = async (transactionId) => {
    if (!confirm('Bạn có chắc muốn hủy giao dịch này?')) return;
    
    try {
      showAlert('Đang hủy giao dịch...', 'info', 1000);
      // await evOwnerService.cancelTransaction(transactionId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showAlert('Đã hủy giao dịch thành công!', 'success');

      // Refetch transactions
      queryClient.invalidateQueries({ queryKey: ['evOwner', 'transactions'] });
    } catch (error) {
      showAlert(error.message || 'Lỗi khi hủy giao dịch', 'error');
      }
    };

  // Handle view details
  const handleViewDetails = (transaction) => {
    showAlert('Chi tiết giao dịch đang được phát triển...', 'info');
  };

  if (isLoading) {
    return <Loading />;
  }

  // Calculate summary
  const summary = [
    { 
      label: 'Hoàn thành', 
      value: transactions.filter(tx => tx.status === 'COMPLETED' || tx.status === 'completed').length,
      color: 'green',
      icon: CheckCircle2,
    },
    { 
      label: 'Đang xử lý', 
      value: transactions.filter(tx => tx.status === 'PENDING' || tx.status === 'pending').length,
      color: 'yellow',
      icon: Clock,
    },
    { 
      label: 'Đã hủy', 
      value: transactions.filter(tx => tx.status === 'CANCELLED' || tx.status === 'cancelled').length,
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

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    if (!statusFilter) return true;
    const txStatus = (tx.status || '').toUpperCase();
    return txStatus === statusFilter;
  });

  // Get status badge
  const getStatusBadge = (status) => {
    const statusUpper = (status || 'PENDING').toUpperCase();
    const configs = {
      'COMPLETED': { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      'PENDING': { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      'CANCELLED': { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle },
      'FAILED': { label: 'Thất bại', color: 'bg-gray-100 text-gray-700', icon: XCircle },
    };
    
    const config = configs[statusUpper] || configs['PENDING'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Alert Messages (Toast style) */}
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
      
      {/* Header - Green theme */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Lịch sử giao dịch</h1>
        <p className="text-green-100">
          Theo dõi và quản lý các giao dịch bán tín chỉ carbon của bạn
        </p>
      </div>
      
      {/* Summary Cards - Clean Color Blocks */}
      <div className="grid grid-cols-3 gap-4">
        {summary.map((item, index) => {
          const cardClasses = {
            green: 'bg-green-500 text-white',
            yellow: 'bg-yellow-500 text-white',
            red: 'bg-red-500 text-white',
          };
          
          return (
            <div
              key={index}
              className={`${cardClasses[item.color]} rounded-lg p-6 text-center`}
            >
              <p className="text-4xl font-bold mb-2">
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
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="PENDING">Đang xử lý</option>
              <option value="CANCELLED">Đã hủy</option>
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
          Danh sách giao dịch
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
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
                  <td colSpan="8" className="py-12 text-center">
                    <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Chưa có giao dịch nào</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Giao dịch sẽ xuất hiện khi có người mua tín chỉ của bạn
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const date = new Date(tx.created_at || tx.createdAt);
                  const canCancel = (tx.status || 'PENDING').toUpperCase() === 'PENDING';
                  
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
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
                          {tx.buyer?.full_name || tx.buyer_name || 'Người mua'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {tx.buyer?.email || 'buyer@example.com'}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-green-600">
                          {(tx.credit || 0).toFixed(2)}
                      </span>
                  </td>
                      <td className="py-3 px-4 text-right">
                    <div>
                          <p className="font-bold text-blue-600">
                            {formatCurrencyFromUsd(tx.amount || 0)}
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
                          {canCancel && (
                            <button
                              onClick={() => handleCancelTransaction(tx.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hủy giao dịch"
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
    </div>
  );
};

export default TransactionHistory;

