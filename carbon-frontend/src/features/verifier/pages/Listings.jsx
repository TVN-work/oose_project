import { useState, useMemo } from 'react';
import { ShoppingBag, Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Gavel, DollarSign, User, X, Calendar, Hash, FileText, Tag, Edit2, Save } from 'lucide-react';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import marketService from '../../../services/market/marketService';
import userService from '../../../services/user/userService';
import { formatCurrency, formatDate } from '../../../utils';
import Loading from '../../../components/common/Loading';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';

/**
 * Listings Management Page for Verifier
 * View and manage all marketplace listings
 */
const Listings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const queryClient = useQueryClient();
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();

  // Fetch listings
  const { data: listings, isLoading } = useQuery({
    queryKey: ['listings', 'verifier', page, pageSize, typeFilter, statusFilter],
    queryFn: () => marketService.getAllListings({
      page,
      entry: pageSize,
      type: typeFilter !== 'ALL' ? typeFilter : undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      field: 'createdAt',
      sort: 'DESC',
    }),
    staleTime: 30000,
  });

  // Extract unique seller IDs
  const sellerIds = useMemo(() => {
    if (!listings) return [];
    const ids = new Set();
    listings.forEach(l => {
      if (l.sellerId) ids.add(l.sellerId);
    });
    return Array.from(ids);
  }, [listings]);

  // Fetch seller details
  const sellerQueries = useQueries({
    queries: sellerIds.map(sellerId => ({
      queryKey: ['user', sellerId],
      queryFn: () => userService.getUserById(sellerId),
      staleTime: 60000,
      retry: 1,
    })),
  });

  // Create seller lookup map
  const sellerMap = useMemo(() => {
    const map = {};
    sellerQueries.forEach((query, index) => {
      if (query.data) {
        map[sellerIds[index]] = query.data;
      }
    });
    return map;
  }, [sellerQueries, sellerIds]);

  // Mutation for updating listing status
  const updateStatusMutation = useMutation({
    mutationFn: ({ listingId, status }) => marketService.updateListingStatus(listingId, status),
    onSuccess: () => {
      // Refetch listings
      queryClient.invalidateQueries(['listings', 'verifier']);
      setIsEditingStatus(false);
      setSelectedListing(null);
      showAlert('Cập nhật trạng thái thành công!', 'success');
    },
    onError: (error) => {
      console.error('Error updating listing status:', error);
      showAlert('Cập nhật trạng thái thất bại. Vui lòng thử lại!', 'error');
    },
  });

  // Handler for opening edit mode
  const handleEditStatus = () => {
    setNewStatus(selectedListing.status);
    setIsEditingStatus(true);
  };

  // Handler for saving status update
  const handleSaveStatus = () => {
    if (!newStatus || newStatus === selectedListing.status) {
      setIsEditingStatus(false);
      return;
    }
    updateStatusMutation.mutate({
      listingId: selectedListing.id,
      status: newStatus,
    });
  };

  // Helper to get seller display name
  const getSellerDisplay = (sellerId) => {
    if (!sellerId) return 'N/A';
    const seller = sellerMap[sellerId];
    if (seller) {
      return seller.fullName || seller.username || seller.email || sellerId.substring(0, 8);
    }
    return sellerId.substring(0, 8) + '...';
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

  // Filter listings by search term
  const filteredListings = useMemo(() => {
    if (!listings) return [];

    if (!searchTerm) return listings;

    const searchLower = searchTerm.toLowerCase();
    return listings.filter(listing =>
      listing.id?.toLowerCase().includes(searchLower) ||
      listing.sellerId?.toLowerCase().includes(searchLower)
    );
  }, [listings, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!listings) return { total: 0, active: 0, bidding: 0, sold: 0, totalValue: 0, totalQuantity: 0 };

    return {
      total: listings.length,
      active: listings.filter(l => l.status === 'ACTIVE').length,
      bidding: listings.filter(l => l.status === 'BIDDING').length,
      sold: listings.filter(l => l.status === 'SOLD').length,
      totalValue: listings.reduce((sum, l) => sum + ((l.pricePerCredit || 0) * (l.quantity || 0)), 0),
      totalQuantity: listings.reduce((sum, l) => sum + (l.quantity || 0), 0),
    };
  }, [listings]);

  const getTypeBadge = (type) => {
    const colors = {
      'FIXED_PRICE': 'bg-blue-100 text-blue-700',
      'AUCTION': 'bg-purple-100 text-purple-700',
    };

    const icons = {
      'FIXED_PRICE': DollarSign,
      'AUCTION': Gavel,
    };

    const labels = {
      'FIXED_PRICE': 'Giá cố định',
      'AUCTION': 'Đấu giá',
    };

    const Icon = icons[type] || DollarSign;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors[type] || 'bg-gray-100 text-gray-700'}`}>
        <Icon className="w-3 h-3 mr-1" />
        {labels[type] || type}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      'ACTIVE': { icon: CheckCircle, text: 'Đang bán', color: 'bg-green-100 text-green-700' },
      'BIDDING': { icon: Gavel, text: 'Đang đấu giá', color: 'bg-blue-100 text-blue-700' },
      'PENDING_PAYMENT': { icon: Clock, text: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-700' },
      'SOLD': { icon: CheckCircle, text: 'Đã bán', color: 'bg-gray-100 text-gray-700' },
      'ENDED': { icon: XCircle, text: 'Đã kết thúc', color: 'bg-gray-100 text-gray-700' },
      'CANCELED': { icon: XCircle, text: 'Đã hủy', color: 'bg-red-100 text-red-700' },
      'EXPIRED': { icon: Clock, text: 'Hết hạn', color: 'bg-orange-100 text-orange-700' },
    };

    const statusConfig = config[status] || config['ACTIVE'];
    const Icon = statusConfig.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {statusConfig.text}
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
            <ShoppingBag className="mr-3 text-purple-600" />
            Quản lý niêm yết
          </h1>
          <p className="text-gray-600 mt-1">Theo dõi và quản lý tất cả niêm yết trên marketplace</p>
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
            <span className="text-sm text-gray-600">Tổng niêm yết</span>
            <ShoppingBag className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Đang hoạt động: {stats.active}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Đang đấu giá</span>
            <Gavel className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.bidding}</p>
          <p className="text-xs text-gray-500 mt-1">Đang diễn ra</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Tổng giá trị</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalValue)}</p>
          <p className="text-xs text-gray-500 mt-1">VND</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Tín chỉ niêm yết</span>
            <CheckCircle className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalQuantity.toFixed(2)}</p>
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
                placeholder="Tìm theo ID niêm yết, người bán..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">Tất cả loại</option>
              <option value="FIXED_PRICE">Giá cố định</option>
              <option value="AUCTION">Đấu giá</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang bán</option>
              <option value="BIDDING">Đang đấu giá</option>
              <option value="PENDING_PAYMENT">Chờ thanh toán</option>
              <option value="SOLD">Đã bán</option>
              <option value="ENDED">Đã kết thúc</option>
              <option value="CANCELED">Đã hủy</option>
              <option value="EXPIRED">Hết hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Danh sách niêm yết ({filteredListings.length})
          </h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Hiển thị:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPage(0);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
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
          <table className="w-full" style={{ minWidth: '1500px' }}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '160px' }}>Mã niêm yết</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '220px' }}>Người bán</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '140px' }}>Loại</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '130px' }}>Số lượng</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '150px' }}>Giá/Tín chỉ</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '160px' }}>Tổng giá trị</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '120px' }}>Số lượt đặt</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '150px' }}>Trạng thái</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '160px' }}>Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Không có niêm yết nào</p>
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="hover:bg-gray-50 transition cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => setSelectedListing(listing)}
                  >
                    <td className="py-3 px-4" style={{ minWidth: '160px' }}>
                      <span className="font-mono text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200 whitespace-nowrap inline-block">
                        {listing.id.substring(0, 12)}...
                      </span>
                    </td>
                    <td className="py-3 px-4" style={{ minWidth: '220px' }}>
                      <div className="flex items-center whitespace-nowrap">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {getSellerDisplay(listing.sellerId)}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            {listing.sellerId?.substring(0, 12)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap" style={{ minWidth: '140px' }}>
                      {getTypeBadge(listing.type)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap" style={{ minWidth: '130px' }}>
                      <span className="text-sm font-semibold text-gray-800">
                        {listing.quantity?.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">tín chỉ</span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap" style={{ minWidth: '150px' }}>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatCurrency(listing.pricePerCredit)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap" style={{ minWidth: '160px' }}>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency((listing.pricePerCredit || 0) * (listing.quantity || 0))}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap" style={{ minWidth: '120px' }}>
                      <span className="text-sm font-semibold text-blue-600">
                        {listing.bidResponseList?.length || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap" style={{ minWidth: '150px' }}>
                      {getStatusBadge(listing.status)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap" style={{ minWidth: '160px' }}>
                      <div className="text-sm text-gray-600">
                        {formatDateTime(listing.createdAt).date}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDateTime(listing.createdAt).time}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredListings.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Hiển thị {filteredListings.length > 0 ? page * pageSize + 1 : 0} - {Math.min((page + 1) * pageSize, filteredListings.length)} trong tổng số {filteredListings.length} niêm yết
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
                  const totalPages = Math.ceil(filteredListings.length / pageSize) || 1;
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
                            ? 'bg-purple-600 text-white font-semibold'
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
                disabled={page >= Math.ceil(filteredListings.length / pageSize) - 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Sau ›
              </button>
              <button
                onClick={() => setPage(Math.ceil(filteredListings.length / pageSize) - 1)}
                disabled={page >= Math.ceil(filteredListings.length / pageSize) - 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
                Chi tiết niêm yết
              </h2>
              <div className="flex items-center gap-2">
                {!isEditingStatus ? (
                  <button
                    onClick={handleEditStatus}
                    className="p-2 hover:bg-purple-50 rounded-lg transition text-purple-600"
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
                    setSelectedListing(null);
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
              {/* Listing ID, Type & Status */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Mã niêm yết</p>
                    <p className="text-lg font-mono font-bold text-purple-600">
                      {selectedListing.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(selectedListing.type)}
                    {isEditingStatus ? (
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="px-3 py-2 border-2 border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                      >
                        <option value="ACTIVE">Đang bán</option>
                        <option value="BIDDING">Đang đấu giá</option>
                        <option value="PENDING_PAYMENT">Chờ thanh toán</option>
                        <option value="SOLD">Đã bán</option>
                        <option value="ENDED">Đã kết thúc</option>
                        <option value="CANCELED">Đã hủy</option>
                        <option value="EXPIRED">Hết hạn</option>
                      </select>
                    ) : (
                      getStatusBadge(selectedListing.status)
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateTime(selectedListing.createdAt).date}</span>
                  <span className="text-gray-400">•</span>
                  <Clock className="w-4 h-4" />
                  <span>{formatDateTime(selectedListing.createdAt).time}</span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-700">Người bán</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Tên</p>
                    <p className="text-sm font-medium text-gray-800">
                      {getSellerDisplay(selectedListing.sellerId)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ID</p>
                    <p className="text-xs font-mono text-gray-600 break-all">
                      {selectedListing.sellerId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Listing Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Thông tin niêm yết
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-gray-600">Số lượng</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedListing.quantity?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">tín chỉ</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-gray-600">Giá/Tín chỉ</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(selectedListing.pricePerCredit)}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <p className="text-xs text-gray-600">Tổng giá trị</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency((selectedListing.pricePerCredit || 0) * (selectedListing.quantity || 0))}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  {selectedListing.type === 'AUCTION' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Số lượt đặt giá</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {selectedListing.bidResponseList?.length || 0} lượt
                      </span>
                    </div>
                  )}

                  {selectedListing.endTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Thời gian kết thúc</span>
                      <span className="text-sm text-gray-800">
                        {formatDateTime(selectedListing.endTime).time} {formatDateTime(selectedListing.endTime).date}
                      </span>
                    </div>
                  )}

                  {selectedListing.updatedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cập nhật lần cuối</span>
                      <span className="text-sm text-gray-800">
                        {formatDateTime(selectedListing.updatedAt).time} {formatDateTime(selectedListing.updatedAt).date}
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
                  setSelectedListing(null);
                  setIsEditingStatus(false);
                }}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
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

export default Listings;
