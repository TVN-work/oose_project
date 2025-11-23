import { useState } from 'react';
import { 
  Tag, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  RotateCcw,
  Eye,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  Car,
  Calendar,
  FileText,
  X,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../../components/common/Modal';
import { useAdminListings, useApproveListing, useRejectListing } from '../../../hooks/useAdmin';
import Loading from '../../../components/common/Loading';
import { formatCurrency, formatNumber } from '../../../utils';

const ListingsPage = () => {
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: '',
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Fetch listings from API
  const { data: listingsData, isLoading, refetch } = useAdminListings(filters);
  const listings = listingsData || [];
  
  const approveMutation = useApproveListing();
  const rejectMutation = useRejectListing();

  // Calculate stats from listings
  const active = listings.filter(l => l.status === 'ACTIVE' || l.status === 'active').length;
  const pending = listings.filter(l => l.status === 'PENDING' || l.status === 'pending').length;
  const rejected = listings.filter(l => l.status === 'REJECTED' || l.status === 'rejected').length;
  const sold = listings.filter(l => l.status === 'SOLD' || l.status === 'sold').length;

  const stats = [
    {
      icon: Tag,
      value: formatNumber(active),
      label: 'Đang hoạt động',
      color: 'green',
    },
    {
      icon: Clock,
      value: formatNumber(pending),
      label: 'Chờ duyệt',
      color: 'yellow',
    },
    {
      icon: XCircle,
      value: formatNumber(rejected),
      label: 'Bị từ chối',
      color: 'red',
    },
    {
      icon: CheckCircle,
      value: formatNumber(sold),
      label: 'Đã bán',
      color: 'blue',
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
    setFilters({ status: '', type: '', search: '' });
    refetch();
    toast.success('Đã đặt lại bộ lọc');
  };

  const viewDetail = (listing) => {
    setSelectedListing(listing);
    setShowDetailModal(true);
  };

  const handleApproveListing = async (listingId) => {
    if (window.confirm(`Bạn có chắc chắn muốn duyệt niêm yết #${listingId}?`)) {
      try {
        await approveMutation.mutateAsync(listingId);
        refetch();
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleRejectListing = (listing) => {
    setSelectedListing(listing);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const confirmRejectListing = async () => {
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        listingId: selectedListing.id,
        reason: rejectReason,
      });
      refetch();
      setShowRejectModal(false);
      setSelectedListing(null);
      setRejectReason('');
    } catch (error) {
      // Error handled by hook
    }
  };

  const approveAllPending = async () => {
    const pendingListings = listings.filter(l => l.status === 'PENDING' || l.status === 'pending');
    if (pendingListings.length === 0) {
      toast.info('Không có niêm yết nào chờ duyệt');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn duyệt tất cả ${pendingListings.length} niêm yết chờ duyệt?`)) {
      try {
        await Promise.all(pendingListings.map(l => approveMutation.mutateAsync(l.id)));
        refetch();
        toast.success(`Đã duyệt ${pendingListings.length} niêm yết`);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi duyệt một số niêm yết');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      ACTIVE: { text: 'Hoạt động', color: 'green', icon: CheckCircle },
      active: { text: 'Hoạt động', color: 'green', icon: CheckCircle },
      PENDING: { text: 'Chờ duyệt', color: 'yellow', icon: Clock },
      pending: { text: 'Chờ duyệt', color: 'yellow', icon: Clock },
      REJECTED: { text: 'Bị từ chối', color: 'red', icon: XCircle },
      rejected: { text: 'Bị từ chối', color: 'red', icon: XCircle },
      SOLD: { text: 'Đã bán', color: 'blue', icon: CheckCircle },
      sold: { text: 'Đã bán', color: 'blue', icon: CheckCircle },
    };

    const badge = statusMap[status] || statusMap.PENDING;
    const Icon = badge.icon;

    const colorClasses = {
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colorClasses[badge.color]}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  // Filter listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = !filters.search || 
      (listing.id || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (listing.seller_name || listing.seller || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (listing.vehicleInfo || listing.vehicle || '').toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || 
      (listing.status || '').toLowerCase() === filters.status.toLowerCase();
    
    const matchesType = !filters.type || 
      (listing.listing_type || listing.type || '').toLowerCase() === filters.type.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quản lý niêm yết tín chỉ</h2>
            <p className="opacity-90 mb-4">
              {formatNumber(active)} niêm yết đang hoạt động, {formatNumber(pending)} chờ duyệt
            </p>
            <div className="flex space-x-4">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">{formatNumber(listings.length)} tổng niêm yết</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">{formatNumber(pending)} cần xem xét</span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <Tag className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: { bg: 'bg-green-500', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
            yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', gradient: 'from-yellow-500 to-yellow-600' },
            red: { bg: 'bg-red-500', text: 'text-red-600', gradient: 'from-red-500 to-red-600' },
            blue: { bg: 'bg-blue-500', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
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
                placeholder="Tìm kiếm theo ID, người bán, xe..."
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
              <option value="pending">Chờ duyệt</option>
              <option value="rejected">Bị từ chối</option>
              <option value="sold">Đã bán</option>
            </select>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Tất cả loại</option>
              <option value="FIXED_PRICE">Bán trực tiếp</option>
              <option value="AUCTION">Đấu giá</option>
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
          {pending > 0 && (
            <button
              onClick={approveAllPending}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center text-sm font-semibold"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Duyệt tất cả ({pending})
            </button>
          )}
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Tag className="w-5 h-5 mr-2" />
          Danh sách niêm yết ({filteredListings.length})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Người bán</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Xe</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Tín chỉ</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Giá</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Loại</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Trạng thái</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center">
                    <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Chưa có niêm yết nào</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {filters.status || filters.type || filters.search
                        ? 'Không tìm thấy niêm yết phù hợp với bộ lọc'
                        : 'Niêm yết sẽ xuất hiện khi EV Owner tạo mới'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => {
                  const isPending = listing.status === 'PENDING' || listing.status === 'pending';
                  const listingType = listing.listing_type || listing.type || 'FIXED_PRICE';
                  const price = listingType === 'AUCTION' 
                    ? (listing.starting_price || listing.startingPrice || 0)
                    : (listing.price_per_credit || listing.pricePerCredit || 0);

                  return (
                    <tr key={listing.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          #{listing.id?.substring(0, 8) || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                            <Users className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            {listing.seller_name || listing.seller || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Car className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-800">
                            {listing.vehicleInfo || listing.vehicle || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-green-600 text-sm">
                        {formatNumber(listing.quantity || 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-blue-600 text-sm">
                        {formatCurrency(price)}
                        {listingType === 'AUCTION' && <span className="text-xs text-gray-500 ml-1">(khởi điểm)</span>}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded ${
                          listingType === 'FIXED_PRICE' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {listingType === 'FIXED_PRICE' ? 'Bán trực tiếp' : 'Đấu giá'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(listing.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => viewDetail(listing)}
                            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Xem
                          </button>
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApproveListing(listing.id)}
                                disabled={approveMutation.isPending}
                                className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Duyệt
                              </button>
                              <button
                                onClick={() => handleRejectListing(listing)}
                                disabled={rejectMutation.isPending}
                                className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Từ chối
                              </button>
                            </>
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
          setSelectedListing(null);
        }} 
        title="Chi tiết niêm yết"
        size="large"
      >
        {selectedListing && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Niêm yết</label>
                  <p className="text-gray-800 font-mono text-sm">{selectedListing.id || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Người bán</label>
                  <p className="text-gray-800">{selectedListing.seller_name || selectedListing.seller || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xe</label>
                  <p className="text-gray-800">{selectedListing.vehicleInfo || selectedListing.vehicle || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tín chỉ</label>
                  <p className="text-gray-800 font-bold">{formatNumber(selectedListing.quantity || 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                  <p className="text-gray-800 font-bold">
                    {formatCurrency(
                      (selectedListing.listing_type || selectedListing.type) === 'AUCTION'
                        ? (selectedListing.starting_price || selectedListing.startingPrice || 0)
                        : (selectedListing.price_per_credit || selectedListing.pricePerCredit || 0)
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                  <p className="text-gray-800">
                    {(selectedListing.listing_type || selectedListing.type) === 'FIXED_PRICE' ? 'Bán trực tiếp' : 'Đấu giá'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                  <p className="text-gray-800 text-sm">
                    {selectedListing.created_at 
                      ? new Date(selectedListing.created_at).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  {getStatusBadge(selectedListing.status)}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal 
        isOpen={showRejectModal} 
        onClose={() => {
          setShowRejectModal(false);
          setSelectedListing(null);
          setRejectReason('');
        }} 
        title="Từ chối niêm yết"
        size="medium"
      >
        {selectedListing && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Niêm yết:</strong> #{selectedListing.id?.substring(0, 8) || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Người bán:</strong> {selectedListing.seller_name || selectedListing.seller || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lý do từ chối *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows="4"
                placeholder="Nhập lý do từ chối niêm yết này..."
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedListing(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmRejectListing}
                disabled={rejectMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {rejectMutation.isPending ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ListingsPage;
