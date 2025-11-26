import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Eye,
  Gavel,
  Bolt,
  Star,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useListings, useMarketUtils } from '../../../hooks/useMarket';
import {
  LISTING_TYPES,
  LISTING_STATUSES,
} from '../../../services/market/marketService';
import Loading from '../../../components/common/Loading';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../../utils';

const Marketplace = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [filters, setFilters] = useState({
    creditAmount: '',
    priceRange: '',
    type: '',
    status: [],
  });

  // Get market utilities
  const { getTypeDisplay, getStatusDisplay } = useMarketUtils();

  // Build query params from filters for marketService.getAllListings
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      entry: pageSize,
      field: 'createdAt',
      sort: 'DESC',
    };

    // Listing type filter (FIXED_PRICE or AUCTION)
    if (filters.type) {
      params.type = filters.type;
    }

    // Status filter - support multiple status values
    if (filters.status && filters.status.length > 0) {
      params.status = filters.status;
    } else {
      // Default to ACTIVE and BIDDING status if no filter selected (available for purchase)
      params.status = [LISTING_STATUSES.ACTIVE, LISTING_STATUSES.BIDDING];
    }

    // Price range filter (VND)
    if (filters.priceRange) {
      if (filters.priceRange === 'under-500k') {
        params.maxPrice = 500000;
      } else if (filters.priceRange === '500k-1m') {
        params.minPrice = 500000;
        params.maxPrice = 1000000;
      } else if (filters.priceRange === '1m-5m') {
        params.minPrice = 1000000;
        params.maxPrice = 5000000;
      } else if (filters.priceRange === 'over-5m') {
        params.minPrice = 5000000;
      }
    }

    // Quantity range filter
    if (filters.creditAmount) {
      if (filters.creditAmount === '1-50') {
        params.minQuantity = 1;
        params.maxQuantity = 50;
      } else if (filters.creditAmount === '51-100') {
        params.minQuantity = 51;
        params.maxQuantity = 100;
      } else if (filters.creditAmount === '101-200') {
        params.minQuantity = 101;
        params.maxQuantity = 200;
      } else if (filters.creditAmount === '200+') {
        params.minQuantity = 200;
      }
    }

    return params;
  }, [currentPage, pageSize, filters]);

  // Fetch listings from API using useListings hook
  const {
    data: listingsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useListings(queryParams);

  // Process listings data
  const listings = Array.isArray(listingsData) ? listingsData : [];
  const totalListings = listings.length;

  // Handle buy now action
  const handleBuyNow = (listing) => {
    navigate('/buyer/checkout', {
      state: {
        listingId: listing.id,
        sellerId: listing.sellerId,
        quantity: listing.quantity,
        pricePerCredit: listing.pricePerCredit,
        type: LISTING_TYPES.FIXED_PRICE,
        totalPrice: listing.pricePerCredit * listing.quantity,
      },
    });
  };

  // Handle join auction action
  const handleJoinAuction = (listing) => {
    const highestBid = listing.bidResponseList?.length > 0
      ? Math.max(...listing.bidResponseList.map((b) => b.amount))
      : listing.pricePerCredit;

    navigate(`/buyer/auction/${listing.id}`, {
      state: {
        listingId: listing.id,
        sellerId: listing.sellerId,
        quantity: listing.quantity,
        startingPrice: listing.pricePerCredit,
        currentPrice: highestBid,
        endTime: listing.endTime,
        bidCount: listing.bidResponseList?.length || 0,
        bids: listing.bidResponseList || [],
      },
    });
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    setCurrentPage(0);
    refetch();
    toast.success('Đã áp dụng bộ lọc!');
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      creditAmount: '',
      priceRange: '',
      type: '',
      status: [],
    });
    setCurrentPage(0);
    refetch();
    toast.success('Đã xóa bộ lọc!');
  };

  // Handle quick filter
  const handleQuickFilter = (filterType) => {
    if (filterType === 'fixed_price') {
      setFilters((prev) => ({ ...prev, type: LISTING_TYPES.FIXED_PRICE }));
    } else if (filterType === 'auction') {
      setFilters((prev) => ({ ...prev, type: LISTING_TYPES.AUCTION }));
    } else if (filterType === 'active') {
      setFilters((prev) => ({ ...prev, status: [LISTING_STATUSES.ACTIVE] }));
    } else if (filterType === 'bidding') {
      setFilters((prev) => ({ ...prev, status: [LISTING_STATUSES.BIDDING] }));
    }
    setCurrentPage(0);
    setTimeout(() => refetch(), 100);
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (listings.length === pageSize) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Get listing type badge
  const getListingTypeBadge = (type) => {
    const display = getTypeDisplay(type);
    if (type === LISTING_TYPES.FIXED_PRICE) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
          <ShoppingCart className="w-3 h-3" />
          {display.text}
        </span>
      );
    } else if (type === LISTING_TYPES.AUCTION) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
          <Gavel className="w-3 h-3" />
          {display.text}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
        {display.text}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const display = getStatusDisplay(status);
    const colorMap = {
      green: 'bg-green-100 text-green-700 border-green-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const iconMap = {
      [LISTING_STATUSES.ACTIVE]: CheckCircle,
      [LISTING_STATUSES.BIDDING]: Gavel,
      [LISTING_STATUSES.PENDING_PAYMENT]: Clock,
      [LISTING_STATUSES.SOLD]: CheckCircle,
      [LISTING_STATUSES.ENDED]: Clock,
      [LISTING_STATUSES.CANCELED]: Clock,
      [LISTING_STATUSES.EXPIRED]: Clock,
    };

    const Icon = iconMap[status] || Clock;
    const colorClass = colorMap[display.color] || colorMap.gray;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}
      >
        <Icon className="w-3 h-3" />
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
            Không thể tải dữ liệu marketplace. Vui lòng thử lại sau.
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Search className="w-5 h-5 mr-3" />
            Tìm kiếm & Lọc niêm yết
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{totalListings} niêm yết</span>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng tín chỉ
            </label>
            <select
              value={filters.creditAmount}
              onChange={(e) =>
                setFilters({ ...filters, creditAmount: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="1-50">1-50 tín chỉ</option>
              <option value="51-100">51-100 tín chỉ</option>
              <option value="101-200">101-200 tín chỉ</option>
              <option value="200+">200+ tín chỉ</option>
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
              Loại niêm yết
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value={LISTING_TYPES.FIXED_PRICE}>Giá cố định</option>
              <option value={LISTING_TYPES.AUCTION}>Đấu giá</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: LISTING_STATUSES.ACTIVE, label: 'Đang hoạt động' },
                { value: LISTING_STATUSES.BIDDING, label: 'Đang đấu giá' },
                { value: LISTING_STATUSES.PENDING_PAYMENT, label: 'Chờ thanh toán' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors ${filters.status.includes(option.value)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.status.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, status: [...filters.status, option.value] });
                      } else {
                        setFilters({ ...filters, status: filters.status.filter(s => s !== option.value) });
                      }
                    }}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Lọc
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Lọc nhanh:</span>
          <button
            onClick={() => handleQuickFilter('active')}
            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition-colors flex items-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            Đang hoạt động
          </button>
          <button
            onClick={() => handleQuickFilter('fixed_price')}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors flex items-center gap-1"
          >
            <Bolt className="w-3 h-3" />
            Giá cố định
          </button>
          <button
            onClick={() => handleQuickFilter('auction')}
            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs hover:bg-purple-200 transition-colors flex items-center gap-1"
          >
            <Gavel className="w-3 h-3" />
            Đấu giá
          </button>
          <button
            onClick={() => handleQuickFilter('bidding')}
            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs hover:bg-yellow-200 transition-colors flex items-center gap-1"
          >
            <Star className="w-3 h-3" />
            Đang đấu giá
          </button>
        </div>
      </div>

      {/* Marketplace Grid */}
      {listings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Không tìm thấy niêm yết nào
          </h3>
          <p className="text-gray-600 mb-4">
            Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            // Calculate total value
            const totalValue =
              (listing.quantity || 0) * (listing.pricePerCredit || 0);

            // Get highest bid for auction
            const highestBid =
              listing.bidResponseList?.length > 0
                ? Math.max(...listing.bidResponseList.map((b) => b.amount))
                : null;

            // Check if auction is ending soon (within 24 hours)
            const isEndingSoon =
              listing.endTime &&
              new Date(listing.endTime).getTime() - Date.now() <
              24 * 60 * 60 * 1000;

            return (
              <div
                key={listing.id}
                className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-gray-300 transition-all bg-white"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">
                      ID: {listing.id?.slice(0, 8)}...
                    </p>
                    {getListingTypeBadge(listing.type)}
                  </div>
                  {getStatusBadge(listing.status)}
                </div>

                {/* Dates */}
                <div className="mb-3 space-y-1">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Tạo: {formatDate(listing.createdAt)}
                  </p>
                  {listing.endTime && (
                    <p
                      className={`text-sm flex items-center gap-1 ${isEndingSoon ? 'text-red-600 font-medium' : 'text-gray-500'}`}
                    >
                      <Clock className="w-4 h-4" />
                      Kết thúc: {formatDate(listing.endTime)}
                      {isEndingSoon && ' (Sắp hết hạn!)'}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="mb-3">
                  <p className="text-lg font-bold text-gray-800">
                    {listing.quantity} tín chỉ
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  {/* Price per credit */}
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Giá/tín chỉ:
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(listing.pricePerCredit)}
                    </span>
                  </div>

                  {/* Total value */}
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Tổng giá trị:</span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatCurrency(totalValue)}
                    </span>
                  </div>

                  {/* Highest bid (for auction) */}
                  {listing.type === LISTING_TYPES.AUCTION && (
                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Gavel className="w-4 h-4" />
                        Giá cao nhất:
                      </span>
                      <span className="font-semibold text-purple-600">
                        {highestBid
                          ? formatCurrency(highestBid)
                          : 'Chưa có đấu giá'}
                      </span>
                    </div>
                  )}

                  {/* Bid count (for auction) */}
                  {listing.type === LISTING_TYPES.AUCTION &&
                    listing.bidResponseList?.length > 0 && (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">
                          Số lượt đấu giá:
                        </span>
                        <span className="font-semibold text-gray-800">
                          {listing.bidResponseList.length} lượt
                        </span>
                      </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  {listing.type === LISTING_TYPES.FIXED_PRICE &&
                    listing.status === LISTING_STATUSES.ACTIVE && (
                      <button
                        onClick={() => handleBuyNow(listing)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Mua ngay
                      </button>
                    )}
                  {listing.type === LISTING_TYPES.AUCTION &&
                    (listing.status === LISTING_STATUSES.ACTIVE ||
                      listing.status === LISTING_STATUSES.BIDDING) && (
                      <button
                        onClick={() => handleJoinAuction(listing)}
                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        <Gavel className="w-4 h-4 mr-1" />
                        Tham gia đấu giá
                      </button>
                    )}
                  {(listing.status === LISTING_STATUSES.SOLD ||
                    listing.status === LISTING_STATUSES.ENDED) && (
                      <span className="flex-1 text-center py-2 px-4 text-gray-500 text-sm">
                        Đã kết thúc
                      </span>
                    )}
                  <Link
                    to={`/buyer/marketplace/${listing.id}`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {listings.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentPage === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Trang trước
          </button>
          <span className="text-sm text-gray-600">
            Trang {currentPage + 1}
          </span>
          <button
            onClick={handleNextPage}
            disabled={listings.length < pageSize}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${listings.length < pageSize
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
          >
            Trang sau
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Marketplace;