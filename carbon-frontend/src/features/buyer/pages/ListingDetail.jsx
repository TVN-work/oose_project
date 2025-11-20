import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Share2, ShoppingCart, Check, Shield, MessageCircle, Gavel } from 'lucide-react';
import { useListingDetail } from '../../../hooks/useBuyer';
import Modal from '../../../components/common/Modal';
import Loading from '../../../components/common/Loading';
import toast from 'react-hot-toast';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { data: listing, isLoading } = useListingDetail(id);

  // Default listing data if API returns null
  const listingData = listing || {
    id: id || 'CC-001',
    owner: 'Nguyễn Văn A',
    vehicle: 'Tesla Model 3',
    credits: 150,
    price: 23.50,
    region: 'Hà Nội',
    co2Saved: 11.1,
    verified: true,
    type: 'buy-now',
    rating: 4.8,
    reviews: 127,
    memberSince: 'Tháng 3, 2024',
    totalSold: 2340,
    responseTime: '< 2 giờ',
    description: 'Tín chỉ carbon được tạo ra từ việc sử dụng xe Tesla Model 3 cho các chuyến đi trong nội thành Hà Nội. Xe được bảo dưỡng định kỳ và đảm bảo hiệu suất tối ưu, góp phần giảm thiểu lượng khí thải CO2 so với xe xăng truyền thống.',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  const maxCredits = listingData.credits || 150;
  const pricePerCredit = listingData.price || 23.50;
  const totalPrice = quantity * pricePerCredit;

  const similarListings = [
    {
      id: 'CC-002',
      owner: 'Trần Thị B',
      region: 'TP. HCM',
      credits: 85,
      price: 22.00,
      type: 'auction',
    },
    {
      id: 'CC-003',
      owner: 'Lê Minh C',
      region: 'Đà Nẵng',
      credits: 200,
      price: 24.75,
      type: 'buy-now',
    },
    {
      id: 'CC-004',
      owner: 'Vũ Minh F',
      region: 'Hà Nội',
      credits: 180,
      price: 23.90,
      type: 'buy-now',
    },
  ];

  const increaseQuantity = () => {
    if (quantity < maxCredits) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePurchase = () => {
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    setShowPurchaseModal(false);
    // Navigate to checkout with order data
    navigate('/buyer/checkout', {
      state: {
        listingId: listingData.id,
        seller: listingData.owner,
        vehicle: listingData.vehicle,
        mileage: '45,000 km', // Default value, can be from listingData if available
        co2Saved: listingData.co2Saved || '11.1 tấn',
        quantity: quantity,
        pricePerCredit: pricePerCredit,
        transactionFee: 15.00, // Default transaction fee
      },
    });
  };

  const getOwnerInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || 'U';
  };

  const getTypeBadge = (type) => {
    if (type === 'auction') {
      return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">🔨 Đấu giá</span>;
    }
    return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">💰 Giá cố định</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-6 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center mb-2">
              <button
                onClick={() => navigate('/buyer/marketplace')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3 text-4xl">📋</span>
                Chi tiết niêm yết
              </h1>
            </div>
            <p className="text-gray-600 ml-14">Thông tin chi tiết về tín chỉ carbon đang bán</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
              <Save className="w-4 h-4" />
              <span className="font-medium">Lưu</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="font-medium">Chia sẻ</span>
            </button>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Listing Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* EV Owner Info */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
                    {getOwnerInitial(listingData.owner)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{listingData.owner}</h2>
                    <div className="flex items-center mt-1 space-x-4">
                      {listingData.verified && (
                        <div className="flex items-center text-green-600">
                          <span className="mr-1">✅</span>
                          <span className="font-medium">Đã xác minh</span>
                        </div>
                      )}
                      {listingData.rating && (
                        <div className="flex items-center text-yellow-600">
                          <span className="mr-1">⭐</span>
                          <span className="font-medium">{listingData.rating}/5 ({listingData.reviews} đánh giá)</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-600">
                        <span className="mr-1">📍</span>
                        <span className="font-medium">{listingData.region}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Thành viên từ</div>
                  <div className="font-semibold text-gray-800">{listingData.memberSince || 'Tháng 3, 2024'}</div>
                </div>
              </div>
            </div>

            {/* Credit Details */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Số lượng tín chỉ</span>
                      <span className="text-3xl font-bold text-green-600">{listingData.credits}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Giá mỗi tín chỉ</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${pricePerCredit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Loại giao dịch</span>
                      {getTypeBadge(listingData.type)}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Tổng giá trị</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ${(listingData.credits * pricePerCredit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">📝</span>
                  Mô tả chi tiết
                </h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {listingData.description || `Tín chỉ carbon được tạo ra từ việc sử dụng xe ${listingData.vehicle} cho các chuyến đi trong nội thành ${listingData.region}.`} 
                    Xe được bảo dưỡng định kỳ và đảm bảo hiệu suất tối ưu, góp phần giảm thiểu lượng khí thải CO2 so với xe xăng truyền thống.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <span className="mr-2">🚗</span>
                        Thông tin xe
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Model: {listingData.vehicle}</li>
                        <li>• Năm sản xuất: 2023</li>
                        <li>• Quãng đường: 45,000 km</li>
                        <li>• Hiệu suất: 15 kWh/100km</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <span className="mr-2">🌱</span>
                        Tác động môi trường
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Giảm {listingData.co2Saved || 11.1} tấn CO2/năm</li>
                        <li>• Tiết kiệm 1,200L xăng</li>
                        <li>• Sử dụng năng lượng tái tạo</li>
                        <li>• Chứng nhận VCS Standard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Journey Timeline */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🛣️</span>
                  Hành trình tạo tín chỉ
                </h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">
                        1
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Đăng ký xe điện</div>
                        <div className="text-sm text-gray-600">15/03/2024 - Đăng ký xe {listingData.vehicle} vào hệ thống</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">
                        2
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Theo dõi hành trình</div>
                        <div className="text-sm text-gray-600">16/03 - 15/12/2024 - Ghi nhận 45,000km di chuyển sạch</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">
                        3
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">Xác minh & chứng nhận</div>
                        <div className="text-sm text-gray-600">16/12/2024 - Hoàn thành xác minh và cấp {listingData.credits} tín chỉ</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Listings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">🔍</span>
                Niêm yết tương tự
              </h3>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {similarListings.map((similar) => (
                  <Link
                    key={similar.id}
                    to={`/buyer/marketplace/${similar.id}`}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
                        {getOwnerInitial(similar.owner)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{similar.owner}</div>
                        <div className="text-xs text-gray-600">{similar.region}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tín chỉ:</span>
                        <span className="font-semibold">{similar.credits}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Giá:</span>
                        <span className="font-semibold text-green-600">${similar.price.toFixed(2)}</span>
                      </div>
                      <div className="text-center">
                        {getTypeBadge(similar.type)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Panel */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <ShoppingCart className="mr-2 w-5 h-5" />
                Mua tín chỉ carbon
              </h3>

              {/* Quantity Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Số lượng muốn mua</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center font-bold text-gray-700 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    max={maxCredits}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      if (val >= 1 && val <= maxCredits) {
                        setQuantity(val);
                      }
                    }}
                    className="flex-1 text-center text-lg font-bold py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center font-bold text-gray-700 transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Tối đa: {maxCredits} tín chỉ có sẵn
                </div>
              </div>

              {/* Price Calculation */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giá mỗi tín chỉ:</span>
                    <span className="font-semibold text-gray-800">${pricePerCredit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Số lượng:</span>
                    <span className="font-semibold text-gray-800">{quantity}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase/Auction Button */}
              {listingData.type === 'auction' ? (
                <button
                  onClick={() => {
                    navigate(`/buyer/auction/${listingData.id}`, {
                      state: {
                        listingId: listingData.id,
                        seller: listingData.owner,
                        vehicle: listingData.vehicle,
                        credits: listingData.credits,
                        startingPrice: pricePerCredit * 0.8,
                        currentPrice: pricePerCredit,
                        region: listingData.region,
                        co2Saved: `${listingData.co2Saved || 11.1} tấn`,
                        mileage: '45,000 km',
                        rating: listingData.rating || 4.8,
                        reviews: listingData.reviews || 127,
                        description: listingData.description,
                      },
                    });
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 mb-4"
                >
                  <Gavel className="w-5 h-5 inline mr-2" />
                  Tham gia đấu giá
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 mb-4"
                >
                  <ShoppingCart className="w-5 h-5 inline mr-2" />
                  Mua ngay
                </button>
              )}

              {/* Additional Info */}
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">✅ Thanh toán an toàn & bảo mật</p>
                <p className="mb-2">🏆 Chứng nhận được cấp ngay</p>
                <p>📧 Hóa đơn gửi qua email</p>
              </div>
            </div>
          </div>

          {/* Seller Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">👤</span>
                Thông tin người bán
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tham gia:</span>
                  <span className="font-semibold">8 tháng</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đã bán:</span>
                  <span className="font-semibold">{listingData.totalSold || 2340} tín chỉ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đánh giá:</span>
                  <span className="font-semibold text-yellow-600">
                    ⭐ {listingData.rating || 4.8}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phản hồi:</span>
                  <span className="font-semibold text-green-600">
                    {listingData.responseTime || '< 2 giờ'}
                  </span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Liên hệ người bán
              </button>
            </div>
          </div>

          {/* Trust & Safety */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="mr-2 w-5 h-5" />
                An toàn & Tin cậy
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  <span>Tín chỉ đã được xác minh</span>
                </div>
                <div className="flex items-center text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  <span>Tuân thủ tiêu chuẩn VCS</span>
                </div>
                <div className="flex items-center text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  <span>Bảo hiểm giao dịch</span>
                </div>
                <div className="flex items-center text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Xác nhận mua hàng"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Người bán:</span>
                <span className="font-semibold">{listingData.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số lượng:</span>
                <span className="font-semibold">{quantity} tín chỉ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giá:</span>
                <span className="font-semibold">${pricePerCredit.toFixed(2)}/tín chỉ</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Tổng cộng:</span>
                  <span className="text-lg font-bold text-green-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPurchaseModal(false)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={confirmPurchase}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Xác nhận thanh toán
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListingDetail;

