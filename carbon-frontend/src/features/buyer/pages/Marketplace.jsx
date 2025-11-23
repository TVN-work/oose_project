import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Eye, Gavel, MessageCircle, Bolt, Star, CheckCircle, Clock, XCircle, Tag, DollarSign, Calendar, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { buyerService } from '../../../services/buyer/buyerService';
import Loading from '../../../components/common/Loading';
import toast from 'react-hot-toast';
import { formatCurrencyFromUsd, usdToVnd, formatDate } from '../../../utils';

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    creditAmount: '',
    priceRange: '',
    region: '',
    transactionType: '',
  });

  // Build query params from filters
  const queryParams = useMemo(() => {
    const params = {};
    
    if (searchQuery) {
      params.search = searchQuery;
    }
    
    // Transaction type filter
    if (filters.transactionType === 'buy-now') {
      params.type = 'buy-now';
    } else if (filters.transactionType === 'auction') {
      params.type = 'auction';
    }
    
    // Price range filter
    if (filters.priceRange) {
      const USD_TO_VND_RATE = 25000;
      if (filters.priceRange === 'under-20') {
        params.maxPrice = 20;
      } else if (filters.priceRange === '20-25') {
        params.minPrice = 20;
        params.maxPrice = 25;
      } else if (filters.priceRange === '25-30') {
        params.minPrice = 25;
        params.maxPrice = 30;
      } else if (filters.priceRange === 'over-30') {
        params.minPrice = 30;
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
    
    // Region filter
    if (filters.region) {
      params.region = filters.region;
    }
    
    return params;
  }, [searchQuery, filters]);

  // Fetch marketplace data from database
  const { data: marketplaceData, isLoading, error, refetch } = useQuery({
    queryKey: ['buyer', 'marketplace', queryParams],
    queryFn: () => buyerService.getMarketplace(queryParams),
    staleTime: 30000, // 30 seconds
  });

  const credits = marketplaceData?.data || [];

  const handleBuyNow = (credit) => {
    // Navigate to checkout with credit data
    navigate('/buyer/checkout', {
      state: {
        listingId: credit.id,
        seller: credit.owner,
        vehicle: credit.vehicle,
        quantity: credit.credits,
        pricePerCredit: credit.price,
        region: credit.region,
        co2Saved: `${credit.co2Saved} tấn`,
        type: 'fixed_price',
      },
    });
  };

  const handleJoinAuction = (credit) => {
    // Navigate to auction page with credit data
    navigate(`/buyer/auction/${credit.id}`, {
      state: {
        listingId: credit.id,
        seller: credit.owner,
        vehicle: credit.vehicle,
        credits: credit.credits,
        startingPrice: credit.price * 0.8, // Assume starting price is 80% of listed price
        currentPrice: credit.price,
        region: credit.region,
        co2Saved: `${credit.co2Saved} tấn`,
        mileage: '28,500 km', // Default value
        rating: 4.9,
        reviews: 89,
      },
    });
  };

  const handleNegotiate = (creditId) => {
    toast.success(`Đã gửi yêu cầu thương lượng cho ${creditId}. Chờ phản hồi từ người bán...`);
  };


  const handleApplyFilters = () => {
    refetch();
    toast.success(`Đã áp dụng bộ lọc. Tìm thấy ${marketplaceData?.total || 0} tín chỉ phù hợp!`);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Không thể tải dữ liệu marketplace. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  const handleQuickFilter = (type) => {
    const filterNames = {
      verified: 'Đã xác minh',
      instant: 'Mua ngay',
      auction: 'Đấu giá',
      premium: 'Premium',
    };
    toast.success(`Đã lọc theo: ${filterNames[type]}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Search className="w-5 h-5 mr-3" />
            Tìm kiếm & Lọc tín chỉ
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{marketplaceData?.total || 0} tín chỉ có sẵn</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên chủ xe, mã tín chỉ, loại xe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng tín chỉ</label>
            <select
              value={filters.creditAmount}
              onChange={(e) => setFilters({ ...filters, creditAmount: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả mức giá</option>
              <option value="under-20">Dưới {formatCurrencyFromUsd(20)}</option>
              <option value="20-25">{formatCurrencyFromUsd(20)} - {formatCurrencyFromUsd(25)}</option>
              <option value="25-30">{formatCurrencyFromUsd(25)} - {formatCurrencyFromUsd(30)}</option>
              <option value="over-30">Trên {formatCurrencyFromUsd(30)}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
            <select
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả khu vực</option>
              <option value="hanoi">Hà Nội</option>
              <option value="hcm">TP.HCM</option>
              <option value="danang">Đà Nẵng</option>
              <option value="haiphong">Hải Phòng</option>
              <option value="cantho">Cần Thơ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại giao dịch</label>
            <select
              value={filters.transactionType}
              onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="buy-now">Mua ngay</option>
              <option value="auction">Đấu giá</option>
              <option value="negotiate">Thương lượng</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Lọc nhanh:</span>
          <button
            onClick={() => handleQuickFilter('verified')}
            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition-colors flex items-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            Đã xác minh
          </button>
          <button
            onClick={() => handleQuickFilter('instant')}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors flex items-center gap-1"
          >
            <Bolt className="w-3 h-3" />
            Mua ngay
          </button>
          <button
            onClick={() => handleQuickFilter('auction')}
            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs hover:bg-purple-200 transition-colors flex items-center gap-1"
          >
            <Gavel className="w-3 h-3" />
            Đấu giá
          </button>
          <button
            onClick={() => handleQuickFilter('premium')}
            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs hover:bg-yellow-200 transition-colors flex items-center gap-1"
          >
            <Star className="w-3 h-3" />
            Premium
          </button>
        </div>
      </div>

      {/* Marketplace Grid */}
      {credits.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy tín chỉ nào</h3>
          <p className="text-gray-600 mb-4">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilters({ creditAmount: '', priceRange: '', region: '', transactionType: '' });
              refetch();
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credits.map((credit) => {
            // Helper functions for badges (similar to EV Owner)
            const getVerificationBadge = (verified) => {
              if (verified) {
                return (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-4 h-4" />
                    Đã xác minh
                  </span>
                );
              }
              return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-700 border-yellow-200">
                  <Clock className="w-4 h-4" />
                  Chờ xác minh
                </span>
              );
            };

            const getListingTypeBadge = (type) => {
              if (type === 'buy-now' || type === 'fixed_price') {
                return (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                    <ShoppingCart className="w-3 h-3" />
                    Giá cố định
                  </span>
                );
              } else if (type === 'auction') {
                return (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                    <Gavel className="w-3 h-3" />
                    Đấu giá
                  </span>
                );
              }
              return null;
            };

            const getStatusBadge = (status) => {
              const statusMap = {
                'ACTIVE': { label: 'Đang bán', icon: CheckCircle, style: 'bg-green-100 text-green-700 border-green-200' },
                'BIDDING': { label: 'Đang đấu giá', icon: Gavel, style: 'bg-purple-100 text-purple-700 border-purple-200' },
                'SOLD': { label: 'Đã bán', icon: CheckCircle, style: 'bg-blue-100 text-blue-700 border-blue-200' },
                'AUCTION_ENDED': { label: 'Đã đấu giá', icon: Clock, style: 'bg-gray-100 text-gray-700 border-gray-200' },
              };
              
              const statusInfo = statusMap[status] || { label: status || 'Đang bán', icon: CheckCircle, style: 'bg-green-100 text-green-700 border-green-200' };
              const Icon = statusInfo.icon;
              
              return (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.style}`}>
                  <Icon className="w-4 h-4" />
                  {statusInfo.label}
                </span>
              );
            };

            // Calculate total value
            const totalValue = (credit.credits || 0) * (credit.price || 0);

            return (
              <div
                key={credit.id}
                className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-gray-300 transition-all bg-white"
              >
                {/* Header: Tên người tạo niêm yết và Xác minh CVA (góc phải) */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-gray-800">{credit.owner}</h4>
                  </div>
                  {getVerificationBadge(credit.verified)}
                </div>

                {/* Ngày đăng tải */}
                <div className="mb-3">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(credit.created_at || credit.date)}
                  </p>
                </div>

                {/* Số lượng tín chỉ */}
                <div className="mb-3">
                  <p className="text-lg font-bold text-gray-800">
                    {credit.credits} tín chỉ
                  </p>
                </div>
                
                <div className="space-y-2 mb-4">
                  {/* Tổng giá trị */}
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Tổng giá trị:
                    </span>
                    <span className="font-bold text-green-600 text-lg">{formatCurrencyFromUsd(totalValue)}</span>
                  </div>
                  
                  {/* Loại niêm yết */}
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Loại:</span>
                    {getListingTypeBadge(credit.type)}
                  </div>
                  
                  {/* Trạng thái niêm yết */}
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    {getStatusBadge(credit.status || 'ACTIVE')}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  {credit.type === 'buy-now' && (
                    <button
                      onClick={() => handleBuyNow(credit)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Mua ngay
                    </button>
                  )}
                  {credit.type === 'auction' && (
                    <button
                      onClick={() => handleJoinAuction(credit)}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      <Gavel className="w-4 h-4 mr-1" />
                      Tham gia đấu giá
                    </button>
                  )}
                  {credit.type === 'negotiate' && (
                    <button
                      onClick={() => handleNegotiate(credit.id)}
                      className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Thương lượng
                    </button>
                  )}
                  <Link
                    to={`/buyer/marketplace/${credit.id}`}
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

      {/* Load More Button */}
      <div className="text-center">
        <button
          onClick={() => toast.success('Đã tải thêm 6 tín chỉ carbon mới!')}
          className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
        >
          <FileText className="w-4 h-4" />
          Xem thêm tín chỉ
        </button>
      </div>
    </div>
  );
};

export default Marketplace;

