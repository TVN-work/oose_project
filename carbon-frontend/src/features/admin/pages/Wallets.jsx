import { useState } from 'react';
import { 
  Wallet, 
  Eye, 
  Lock, 
  Unlock,
  Search,
  Filter,
  RotateCcw,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  Calendar,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../../components/common/Modal';
import { useAdminWallets, useFreezeWallet } from '../../../hooks/useAdmin';
import Loading from '../../../components/common/Loading';
import { formatCurrency, formatNumber } from '../../../utils';

const WalletsPage = () => {
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  // Fetch wallets from API
  const { data: walletsData, isLoading, refetch } = useAdminWallets(filters);
  const wallets = walletsData || [];
  
  const freezeMutation = useFreezeWallet();

  // Calculate stats from wallets
  const totalBalance = wallets.reduce((sum, w) => sum + (parseFloat(w.balance) || 0), 0);
  const activeWallets = wallets.filter(w => !w.frozen && w.status !== 'frozen').length;
  const frozenWallets = wallets.filter(w => w.frozen || w.status === 'frozen').length;
  const totalTransactions = wallets.reduce((sum, w) => sum + (parseInt(w.transactionCount || w.transactions || 0)), 0);

  // Mock monthly cash flow (should come from API)
  const monthlyCashFlow = 8500000;
  const systemFees = totalBalance * 0.03; // 3% of total balance

  const stats = [
    {
      icon: DollarSign,
      value: formatCurrency(totalBalance),
      label: 'Tổng số dư',
      color: 'green',
    },
    {
      icon: TrendingUp,
      value: formatCurrency(monthlyCashFlow),
      label: 'Dòng tiền tháng',
      color: 'blue',
    },
    {
      icon: CreditCard,
      value: formatCurrency(systemFees),
      label: 'Phí hệ thống',
      color: 'orange',
    },
    {
      icon: AlertTriangle,
      value: formatNumber(frozenWallets),
      label: 'Ví bị khóa',
      color: 'red',
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
    setFilters({ status: '', search: '' });
    refetch();
    toast.success('Đã đặt lại bộ lọc');
  };

  const viewWallet = (wallet) => {
    setSelectedWallet(wallet);
    setShowDetailModal(true);
  };

  const handleFreezeWallet = async (walletId) => {
    if (window.confirm('Bạn có chắc chắn muốn khóa ví này? Người dùng sẽ không thể thực hiện giao dịch.')) {
      try {
        await freezeMutation.mutateAsync(walletId);
        refetch();
        toast.success('Đã khóa ví');
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const getStatusBadge = (wallet) => {
    const isFrozen = wallet.frozen === true || wallet.status === 'frozen' || wallet.status === 'FROZEN';
    
    if (isFrozen) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-200">
          <Lock className="w-3 h-3" />
          Đã khóa
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3" />
        Hoạt động
      </span>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  // Filter wallets
  const filteredWallets = wallets.filter(wallet => {
    const matchesSearch = !filters.search || 
      (wallet.owner_name || wallet.user || wallet.owner || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (wallet.id || '').toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status ||
      (filters.status === 'active' && !wallet.frozen && wallet.status !== 'frozen') ||
      (filters.status === 'frozen' && (wallet.frozen === true || wallet.status === 'frozen'));
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quản lý ví & dòng tiền</h2>
            <p className="opacity-90 mb-4">
              Tổng giá trị trong hệ thống: {formatCurrency(totalBalance)} với {formatNumber(wallets.length)} ví
            </p>
            <div className="flex space-x-4">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">{formatNumber(activeWallets)} ví hoạt động</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">{formatCurrency(systemFees)} phí hệ thống</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">{formatNumber(totalTransactions)} giao dịch</span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <Wallet className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: { bg: 'bg-green-500', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
            blue: { bg: 'bg-blue-500', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
            orange: { bg: 'bg-orange-500', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
            red: { bg: 'bg-red-500', text: 'text-red-600', gradient: 'from-red-500 to-red-600' },
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
                placeholder="Tìm kiếm theo tên người dùng, ID ví..."
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
              <option value="active">Hoạt động</option>
              <option value="frozen">Đã khóa</option>
            </select>
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
        </div>
      </div>

      {/* Wallets Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Danh sách ví ({filteredWallets.length})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Người dùng</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Số dư</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Giao dịch</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Ngày tạo</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Trạng thái</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWallets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Chưa có ví nào</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {filters.status || filters.search
                        ? 'Không tìm thấy ví phù hợp với bộ lọc'
                        : 'Ví sẽ xuất hiện khi người dùng đăng ký tài khoản'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredWallets.map((wallet) => {
                  const isFrozen = wallet.frozen === true || wallet.status === 'frozen' || wallet.status === 'FROZEN';

                  return (
                    <tr key={wallet.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <Users className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {wallet.owner_name || wallet.user || wallet.owner || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500">ID: {wallet.id?.substring(0, 8) || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-green-600 text-sm">
                        {formatCurrency(wallet.balance || 0)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 text-sm">
                        {formatNumber(wallet.transactionCount || wallet.transactions || 0)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {wallet.created_at 
                          ? new Date(wallet.created_at).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(wallet)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => viewWallet(wallet)}
                            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Xem
                          </button>
                          {isFrozen ? (
                            <button
                              onClick={() => toast.info('Chức năng mở khóa ví đang được phát triển')}
                              className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
                            >
                              <Unlock className="w-4 h-4 mr-1" />
                              Mở khóa
                            </button>
                          ) : (
                            <button
                              onClick={() => handleFreezeWallet(wallet.id)}
                              disabled={freezeMutation.isPending}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center disabled:opacity-50"
                            >
                              <Lock className="w-4 h-4 mr-1" />
                              Khóa
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

      {/* Detail Modal */}
      <Modal 
        isOpen={showDetailModal} 
        onClose={() => {
          setShowDetailModal(false);
          setSelectedWallet(null);
        }} 
        title="Chi tiết ví"
        size="large"
      >
        {selectedWallet && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chủ sở hữu</label>
                  <p className="text-gray-800">{selectedWallet.owner_name || selectedWallet.user || selectedWallet.owner || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Ví</label>
                  <p className="text-gray-800 font-mono text-sm">{selectedWallet.id || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số dư</label>
                  <p className="text-gray-800 font-bold text-lg">{formatCurrency(selectedWallet.balance || 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số giao dịch</label>
                  <p className="text-gray-800">{formatNumber(selectedWallet.transactionCount || selectedWallet.transactions || 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                  <p className="text-gray-800 text-sm">
                    {selectedWallet.created_at 
                      ? new Date(selectedWallet.created_at).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  {getStatusBadge(selectedWallet)}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WalletsPage;
