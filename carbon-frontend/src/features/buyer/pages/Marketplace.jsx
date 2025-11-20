import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Eye, Gavel, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    creditAmount: '',
    priceRange: '',
    region: '',
    transactionType: '',
  });

  const credits = [
    {
      id: 'CC-001',
      owner: 'Nguyễn Văn A',
      vehicle: 'Tesla Model 3',
      credits: 125,
      price: 22.50,
      region: 'Hà Nội',
      co2Saved: 9.2,
      verified: true,
      type: 'buy-now',
    },
    {
      id: 'CC-002',
      owner: 'Trần Thị B',
      vehicle: 'VinFast VF8',
      credits: 85,
      price: 21.00,
      region: 'TP.HCM',
      co2Saved: 6.3,
      verified: true,
      type: 'auction',
      timeLeft: '2h 15m',
    },
    {
      id: 'CC-003',
      owner: 'Lê Văn C',
      vehicle: 'BMW iX3',
      credits: 200,
      price: 23.80,
      region: 'Đà Nẵng',
      co2Saved: 14.8,
      verified: true,
      premium: true,
      type: 'buy-now',
    },
    {
      id: 'CC-004',
      owner: 'Phạm Thị D',
      vehicle: 'Audi e-tron',
      credits: 150,
      price: 24.20,
      region: 'Hải Phòng',
      co2Saved: 11.1,
      verified: true,
      type: 'negotiate',
    },
    {
      id: 'CC-005',
      owner: 'Hoàng Văn E',
      vehicle: 'Hyundai Kona EV',
      credits: 95,
      price: 23.50,
      region: 'Cần Thơ',
      co2Saved: 7.0,
      verified: true,
      type: 'auction',
      timeLeft: '5h 42m',
    },
    {
      id: 'CC-006',
      owner: 'Vũ Thị F',
      vehicle: 'Nissan Leaf',
      credits: 75,
      price: 21.90,
      region: 'Hà Nội',
      co2Saved: 5.5,
      verified: true,
      premium: true,
      type: 'buy-now',
    },
  ];

  const handleBuyNow = (creditId) => {
    toast.success(`Đang chuẩn bị mua tín chỉ ${creditId}. Chuyển đến trang thanh toán...`);
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
    toast.success('Đã áp dụng bộ lọc. Tìm thấy 125 tín chỉ phù hợp!');
  };

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
            <span className="mr-3">🔍</span>
            Tìm kiếm & Lọc tín chỉ
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>125 tín chỉ có sẵn</span>
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
              <option value="under-20">Dưới $20</option>
              <option value="20-25">$20 - $25</option>
              <option value="25-30">$25 - $30</option>
              <option value="over-30">Trên $30</option>
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔍 Tìm kiếm
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Lọc nhanh:</span>
          <button
            onClick={() => handleQuickFilter('verified')}
            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition-colors"
          >
            ✅ Đã xác minh
          </button>
          <button
            onClick={() => handleQuickFilter('instant')}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors"
          >
            ⚡ Mua ngay
          </button>
          <button
            onClick={() => handleQuickFilter('auction')}
            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs hover:bg-purple-200 transition-colors"
          >
            🔨 Đấu giá
          </button>
          <button
            onClick={() => handleQuickFilter('premium')}
            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs hover:bg-yellow-200 transition-colors"
          >
            ⭐ Premium
          </button>
        </div>
      </div>

      {/* Marketplace Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {credits.map((credit) => (
          <div
            key={credit.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-lg">🚗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{credit.owner}</h4>
                    <p className="text-sm text-gray-600">{credit.vehicle}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {credit.verified && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                      Đã xác minh
                    </span>
                  )}
                  {credit.premium && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                      ⭐
                    </span>
                  )}
                </div>
              </div>

              {/* Credit Info */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Tín chỉ có sẵn:</span>
                  <span className="font-bold text-lg text-gray-800">{credit.credits} tín chỉ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    {credit.type === 'auction' ? 'Giá khởi điểm:' : 'Giá mỗi tín chỉ:'}
                  </span>
                  <span className={`font-bold text-lg ${
                    credit.type === 'auction' ? 'text-purple-600' : 'text-green-600'
                  }`}>
                    ${credit.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Khu vực:</span>
                  <span className="font-semibold text-gray-800">{credit.region}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    {credit.timeLeft ? 'Thời gian còn lại:' : 'CO2 giảm:'}
                  </span>
                  <span className={`font-semibold ${
                    credit.timeLeft ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {credit.timeLeft || `${credit.co2Saved} tấn`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {credit.type === 'buy-now' && (
                  <button
                    onClick={() => handleBuyNow(credit.id)}
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
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <button
          onClick={() => toast.success('Đã tải thêm 6 tín chỉ carbon mới!')}
          className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
        >
          📄 Xem thêm tín chỉ
        </button>
      </div>
    </div>
  );
};

export default Marketplace;

