import { useState, useMemo } from 'react';
import {
  Leaf,
  Search,
  Download,
  User,
  X,
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  DollarSign,
  Activity,
  BarChart3,
} from 'lucide-react';
import { useQuery, useQueries } from '@tanstack/react-query';
import carbonCreditService from '../../../services/carbonCredit/carbonCreditService';
import userService from '../../../services/user/userService';
import { auditService, AUDIT_TYPES, AUDIT_ACTIONS } from '../../../services/audit/auditService';
import Loading from '../../../components/common/Loading';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';

/**
 * Carbon Credits Management Page for Admin
 * View and manage all platform carbon credits with audit history
 */
const CarbonCreditsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedCredit, setSelectedCredit] = useState(null);

  // User search states
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();

  // Fetch users for search dropdown
  const { data: searchUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users', 'search', userSearchTerm],
    queryFn: () => userService.getAllUsers({
      page: 0,
      entry: 20,
      fullName: userSearchTerm || undefined,
    }),
    enabled: userSearchTerm.length >= 1,
    staleTime: 30000,
  });

  const userSearchResults = Array.isArray(searchUsers) ? searchUsers : (searchUsers?.content || searchUsers?.data || []);

  // Fetch carbon credits
  const { data: carbonCredits, isLoading } = useQuery({
    queryKey: ['carbonCredits', 'admin', page, pageSize],
    queryFn: () => carbonCreditService.getAllCarbonCredits({
      page,
      entry: pageSize,
      field: 'id',
      sort: 'DESC',
    }),
    staleTime: 30000,
  });

  // Extract carbon credit list
  const creditList = useMemo(() => {
    if (!carbonCredits) return [];
    return Array.isArray(carbonCredits) ? carbonCredits : (carbonCredits?.content || carbonCredits?.data || []);
  }, [carbonCredits]);

  // Extract unique owner IDs from carbon credits
  const ownerIds = useMemo(() => {
    if (!creditList) return [];
    const ids = new Set();
    creditList.forEach(c => {
      if (c.ownerId) ids.add(c.ownerId);
    });
    return Array.from(ids);
  }, [creditList]);

  // Fetch user details for credit owners using useQueries
  const ownerQueries = useQueries({
    queries: ownerIds.map(ownerId => ({
      queryKey: ['user', ownerId],
      queryFn: () => userService.getUserById(ownerId),
      staleTime: 60000,
      retry: 1,
    })),
  });

  // Create ownerId to user lookup map
  const ownerUserMap = useMemo(() => {
    const map = {};
    ownerQueries.forEach((query, index) => {
      if (query.data) {
        map[ownerIds[index]] = query.data;
      }
    });
    return map;
  }, [ownerQueries, ownerIds]);

  // Fetch audit for selected carbon credit using ownerId directly
  const { data: creditAudits, isLoading: isLoadingAudits } = useQuery({
    queryKey: ['audit', 'carbon-credit', selectedCredit?.ownerId],
    queryFn: () => auditService.getAll({
      ownerId: selectedCredit?.ownerId,
      type: AUDIT_TYPES.CARBON_CREDIT,
      page: 0,
      entry: 50,
      field: 'createdAt',
      sort: 'DESC',
    }),
    enabled: !!selectedCredit?.ownerId,
    staleTime: 30000,
  });

  const auditList = useMemo(() => {
    if (!creditAudits) return [];
    return Array.isArray(creditAudits) ? creditAudits : (creditAudits?.content || creditAudits?.data || []);
  }, [creditAudits]);

  // Handler for selecting user from dropdown
  const handleSelectUser = (user) => {
    setSelectedUserId(user.id);
    setUserSearchTerm(user.fullName || user.username || user.email || '');
    setShowUserDropdown(false);
    setPage(0);
  };

  // Handler for clearing user filter
  const handleClearUserFilter = () => {
    setSelectedUserId(null);
    setUserSearchTerm('');
    setPage(0);
  };

  // Helper to get user display name for credit using ownerId
  const getCreditOwner = (ownerId) => {
    if (!ownerId) return { name: 'Không xác định', email: '', userId: null };
    const user = ownerUserMap[ownerId];
    if (user) {
      return {
        name: user.fullName || user.username || user.email || 'N/A',
        email: user.email || '',
        userId: user.id,
      };
    }
    return { name: 'Đang tải...', email: '', userId: ownerId };
  };

  // Helper to format datetime
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: 'N/A', time: 'N/A' };

    if (typeof dateString === 'string' && dateString.includes('-') && dateString.includes(':')) {
      const parts = dateString.split(' ');
      if (parts.length >= 2) {
        const time = parts[0];
        const datePart = parts[1];
        return { date: datePart, time: time };
      }
    }

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

  // Helper to format credit amount
  const formatCredit = (credit, decimals = 2) => {
    if (typeof credit !== 'number') {
      return '0 tín chỉ';
    }
    return `${credit.toFixed(decimals)} tín chỉ`;
  };

  // Filter credits by search term and selected user
  const filteredCredits = useMemo(() => {
    if (!creditList) return [];

    let result = creditList;

    // Filter by selected user (using ownerId)
    if (selectedUserId) {
      result = result.filter(c => c.ownerId === selectedUserId);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(credit => {
        const owner = getCreditOwner(credit.ownerId);
        return credit.id?.toLowerCase().includes(searchLower) ||
          owner.name?.toLowerCase().includes(searchLower);
      });
    }

    return result;
  }, [creditList, searchTerm, selectedUserId, ownerUserMap]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!creditList) return { total: 0, totalCredits: 0, availableCredits: 0, tradedCredits: 0 };

    const totalCredits = creditList.reduce((sum, c) => sum + (c.totalCredit || 0), 0);
    const availableCredits = creditList.reduce((sum, c) => sum + (c.availableCredit || 0), 0);
    const tradedCredits = creditList.reduce((sum, c) => sum + (c.tradedCredit || 0), 0);

    return {
      total: creditList.length,
      totalCredits,
      availableCredits,
      tradedCredits,
    };
  }, [creditList]);

  // Get action badge for audit
  const getActionBadge = (action) => {
    const config = {
      [AUDIT_ACTIONS.CREDIT_TOP_UP]: { icon: ArrowDownLeft, text: 'Nạp tín chỉ', color: 'bg-green-100 text-green-700' },
      [AUDIT_ACTIONS.CREDIT_TRADE]: { icon: ArrowUpRight, text: 'Bán tín chỉ', color: 'bg-purple-100 text-purple-700' },
      [AUDIT_ACTIONS.CREDIT_BUY]: { icon: DollarSign, text: 'Mua tín chỉ', color: 'bg-blue-100 text-blue-700' },
      [AUDIT_ACTIONS.ADJUST_MANUAL]: { icon: RefreshCw, text: 'Điều chỉnh', color: 'bg-gray-100 text-gray-700' },
      [AUDIT_ACTIONS.DEPOSIT]: { icon: TrendingUp, text: 'Nạp', color: 'bg-green-100 text-green-700' },
      [AUDIT_ACTIONS.WITHDRAW]: { icon: TrendingDown, text: 'Rút', color: 'bg-red-100 text-red-700' },
    };

    const actionConfig = config[action] || { icon: FileText, text: action || 'N/A', color: 'bg-gray-100 text-gray-700' };
    const Icon = actionConfig.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${actionConfig.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {actionConfig.text}
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
            <Leaf className="mr-3 text-green-600" />
            Quản lý tín chỉ Carbon
          </h1>
          <p className="text-gray-600 mt-1">Theo dõi và quản lý tất cả tín chỉ carbon trên nền tảng</p>
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
            <span className="text-sm text-gray-600">Tổng số tài khoản</span>
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Trên hệ thống</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Tổng tín chỉ</span>
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCredit(stats.totalCredits)}</p>
          <p className="text-xs text-gray-500 mt-1">Đã phát hành</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Tín chỉ khả dụng</span>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{formatCredit(stats.availableCredits)}</p>
          <p className="text-xs text-gray-500 mt-1">Có thể giao dịch</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Đã giao dịch</span>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{formatCredit(stats.tradedCredits)}</p>
          <p className="text-xs text-gray-500 mt-1">Tổng giao dịch</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* User Search with Dropdown */}
          <div className="md:col-span-2 relative">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm người dùng theo tên..."
                  value={userSearchTerm}
                  onChange={(e) => {
                    setUserSearchTerm(e.target.value);
                    setShowUserDropdown(true);
                    if (!e.target.value) {
                      setSelectedUserId(null);
                    }
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {(userSearchTerm || selectedUserId) && (
                  <button
                    onClick={handleClearUserFilter}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* User Dropdown */}
            {showUserDropdown && userSearchTerm && userSearchResults.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {isLoadingUsers ? (
                  <div className="p-3 text-center text-gray-500">Đang tìm kiếm...</div>
                ) : (
                  userSearchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full px-4 py-3 text-left bg-white hover:bg-gray-100 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {user.fullName || user.username || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email || user.phoneNumber || ''}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {selectedUserId && (
              <p className="text-xs text-green-600 mt-1">Đang lọc tín chỉ của người dùng đã chọn</p>
            )}
          </div>

          {/* Credit ID Search */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm mã tín chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Carbon Credits Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-green-600" />
            Danh sách tín chỉ Carbon ({filteredCredits.length})
          </h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Hiển thị:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPage(0);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
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
          <table className="w-full" style={{ minWidth: '700px' }}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '220px' }}>Chủ sở hữu</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '140px' }}>Tổng tín chỉ</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '140px' }}>Khả dụng</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '140px' }}>Đã giao dịch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCredits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Không có tín chỉ nào</p>
                  </td>
                </tr>
              ) : (
                filteredCredits.map((credit) => {
                  const owner = getCreditOwner(credit.ownerId);
                  const availableCredit = (credit.totalCredit || 0) - (credit.tradedCredit || 0);
                  return (
                    <tr
                      key={credit.id}
                      className="hover:bg-gray-50 transition cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => setSelectedCredit(credit)}
                    >
                      <td className="py-3 px-4" style={{ minWidth: '220px' }}>
                        <div className="flex items-center whitespace-nowrap">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                            <User className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {owner.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {owner.email || 'Chưa liên kết'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap" style={{ minWidth: '140px' }}>
                        <span className="text-lg font-bold text-green-600">
                          {(credit.totalCredit || 0).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">tín chỉ</span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap" style={{ minWidth: '140px' }}>
                        <span className="text-lg font-bold text-blue-600">
                          {availableCredit.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">tín chỉ</span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap" style={{ minWidth: '140px' }}>
                        <span className="text-lg font-bold text-purple-600">
                          {(credit.tradedCredit || 0).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">tín chỉ</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCredits.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Hiển thị {filteredCredits.length > 0 ? page * pageSize + 1 : 0} - {Math.min((page + 1) * pageSize, filteredCredits.length)} trong tổng số {filteredCredits.length} tài khoản
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
                  const totalPages = Math.ceil(filteredCredits.length / pageSize) || 1;
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
                          ? 'bg-green-600 text-white font-semibold'
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
                disabled={page >= Math.ceil(filteredCredits.length / pageSize) - 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Sau ›
              </button>
              <button
                onClick={() => setPage(Math.ceil(filteredCredits.length / pageSize) - 1)}
                disabled={page >= Math.ceil(filteredCredits.length / pageSize) - 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Carbon Credit Detail Modal with Audit History */}
      {selectedCredit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-600" />
                Chi tiết tín chỉ Carbon
              </h2>
              <button
                onClick={() => setSelectedCredit(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Credit Info */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Tổng tín chỉ</p>
                    <p className="text-xl font-bold text-green-600">
                      {(selectedCredit.totalCredit || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Khả dụng</p>
                    <p className="text-xl font-bold text-blue-600">
                      {((selectedCredit.totalCredit || 0) - (selectedCredit.tradedCredit || 0)).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Đã giao dịch</p>
                    <p className="text-xl font-bold text-purple-600">
                      {(selectedCredit.tradedCredit || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tỷ lệ sử dụng</span>
                  <span className="font-medium text-gray-800">
                    {selectedCredit.totalCredit > 0
                      ? ((selectedCredit.tradedCredit || 0) / selectedCredit.totalCredit * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${selectedCredit.totalCredit > 0
                        ? Math.min(100, (selectedCredit.tradedCredit || 0) / selectedCredit.totalCredit * 100)
                        : 0}%`
                    }}
                  />
                </div>
              </div>

              {/* Owner Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-700">Chủ sở hữu</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Tên</p>
                    <p className="text-sm font-medium text-gray-800">
                      {getCreditOwner(selectedCredit.ownerId).name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-600">
                      {getCreditOwner(selectedCredit.ownerId).email || 'Chưa có thông tin'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Audit History */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Lịch sử giao dịch tín chỉ
                </h3>

                {isLoadingAudits ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Đang tải...</p>
                  </div>
                ) : auditList.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Chưa có lịch sử giao dịch</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">Thời gian</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">Loại</th>
                          <th className="text-right py-2 px-3 font-semibold text-gray-700 text-xs">Trước GD</th>
                          <th className="text-right py-2 px-3 font-semibold text-gray-700 text-xs">Thay đổi</th>
                          <th className="text-right py-2 px-3 font-semibold text-gray-700 text-xs">Sau GD</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {auditList.map((audit) => {
                          const change = (audit.balanceAfter || 0) - (audit.balanceBefore || 0);
                          const isPositive = change >= 0;
                          return (
                            <tr key={audit.id} className="hover:bg-gray-50">
                              <td className="py-2 px-3 text-xs text-gray-600">
                                <div>{formatDateTime(audit.createdAt).date}</div>
                                <div className="text-gray-400">{formatDateTime(audit.createdAt).time}</div>
                              </td>
                              <td className="py-2 px-3">
                                {getActionBadge(audit.action)}
                              </td>
                              <td className="py-2 px-3 text-right text-xs text-gray-600">
                                {(audit.balanceBefore || 0).toFixed(2)}
                              </td>
                              <td className={`py-2 px-3 text-right text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {isPositive ? '+' : ''}{change.toFixed(2)}
                              </td>
                              <td className="py-2 px-3 text-right text-xs font-semibold text-gray-800">
                                {(audit.balanceAfter || 0).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <button
                onClick={() => setSelectedCredit(null)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
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

export default CarbonCreditsPage;
