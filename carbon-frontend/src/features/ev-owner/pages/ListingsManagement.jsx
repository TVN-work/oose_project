import { useState, useEffect } from 'react';
import {
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Clock,
  Info,
  LineChart,
  BarChart3,
  Zap,
  Globe,
  Wallet,
  Sparkles,
  Gavel,
  ShoppingCart,
  Calendar
} from 'lucide-react';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';
import { formatCurrencyFromUsd, usdToVnd } from '../../../utils';
import { useMyCarbonCredit } from '../../../hooks/useCarbonCredit';
import { useListings, useCreateListing } from '../../../hooks/useMarket';
import { useAuth } from '../../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const LISTING_TYPE = {
  FIXED_PRICE: 'FIXED_PRICE',
  AUCTION: 'AUCTION',
};

const ListingsManagement = () => {
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch carbon credit data to get available credits
  const { data: carbonCreditData } = useMyCarbonCredit();
  const availableCredits = carbonCreditData?.availableCredit || 0;

  // Fetch listings from API filtered by sellerId
  const { data: listingsData, isLoading: listingsLoading } = useListings({ sellerId: user?.id });
  const myListings = listingsData || [];

  // Create listing mutation
  const createListingMutation = useCreateListing();

  const [formData, setFormData] = useState({
    listingType: LISTING_TYPE.FIXED_PRICE, // Default: Fixed Price
    quantity: '',
    pricePerCredit: '',
    startingPrice: '', // For auction
    endTime: '', // Only for auction
  });

  const [priceSuggestion, setPriceSuggestion] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);

  // ============ PRICE SUGGESTION TABLE ============
  // Bảng giá gợi ý dựa trên số lượng tín chỉ (đơn giản hóa, không phân biệt thị trường)
  const priceSuggestionRanges = [
    { min: 1, max: 10, price: 10.0, discount: 0 },
    { min: 10, max: 50, price: 9.8, discount: 2 },
    { min: 50, max: 100, price: 9.5, discount: 5 },
    { min: 100, max: 500, price: 9.0, discount: 10 },
    { min: 500, max: Infinity, price: 8.5, discount: 15 },
  ];

  // Market Statistics - Calculate from real listings data
  const marketStats = {
    totalListings: myListings.length || 0,
    activeBuyers: 89, // TODO: Get from API when available
    avgPrice: myListings.length > 0
      ? myListings.reduce((sum, l) => sum + (l.pricePerCredit || l.price_per_credit || 0), 0) / myListings.length / 25000 // Convert VND to USD for display
      : 18.5,
    last30DaysSales: myListings.filter(l => l.status === 'SOLD').length || 0,
    priceChange24h: +2.3, // TODO: Calculate from real data
    supplyDemandRatio: 0.92, // TODO: Get from API
  };

  // ============ AI PRICE SUGGESTION ============
  const calculateAIPriceSuggestion = (quantity) => {
    if (!quantity || parseFloat(quantity) <= 0) return null;

    const qty = parseFloat(quantity);

    // Tìm range phù hợp
    const range = priceSuggestionRanges.find(r => qty >= r.min && qty < r.max);
    if (!range) {
      // Nếu vượt quá range lớn nhất, dùng range cuối
      const lastRange = priceSuggestionRanges[priceSuggestionRanges.length - 1];
      return calculatePriceFromRange(qty, lastRange);
    }

    return calculatePriceFromRange(qty, range);
  };

  const calculatePriceFromRange = (quantity, range) => {
    // Giá cơ bản từ bảng
    let basePrice = range.price;

    // Điều chỉnh theo supply/demand
    if (marketStats.supplyDemandRatio < 0.9) {
      basePrice *= 1.05; // High demand, +5%
    } else if (marketStats.supplyDemandRatio > 1.2) {
      basePrice *= 0.97; // Oversupply, -3%
    }

    // Điều chỉnh theo xu hướng giá
    if (marketStats.priceChange24h > 0) {
      basePrice *= (1 + marketStats.priceChange24h / 100);
    }

    // Tính toán range giá
    const suggested = parseFloat(basePrice.toFixed(2));
    const minPrice = parseFloat((suggested * 0.92).toFixed(2));
    const maxPrice = parseFloat((suggested * 1.08).toFixed(2));

    // Confidence score dựa trên số lượng
    let confidence = 85;
    if (quantity >= 10 && quantity < 100) confidence = 90;
    if (quantity >= 100) confidence = 92;

    return {
      suggested,
      min: minPrice,
      max: maxPrice,
      confidence,
      range: `${range.min}-${range.max === Infinity ? '∞' : range.max} tín chỉ`,
      discount: range.discount,
    };
  };

  const calculateTotalPrice = (quantity, pricePerCredit) => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(pricePerCredit) || 0; // pricePerCredit đã là VNĐ

    if (!qty || !price) return null;

    return Math.round(qty * price); // Tổng giá tiền = số lượng × giá mỗi tín chỉ (VNĐ)
  };

  // ============ HANDLERS ============
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListingTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      listingType: type,
      // Reset price fields when switching type
      pricePerCredit: '',
      startingPrice: '',
      endTime: type === LISTING_TYPE.AUCTION ? prev.endTime : '', // Clear endTime for fixed price
    }));
    setPriceSuggestion(null);
    setTotalPrice(null);
  };

  // Auto-calculate AI price suggestion when quantity changes
  useEffect(() => {
    if (formData.quantity) {
      const suggestion = calculateAIPriceSuggestion(formData.quantity);
      setPriceSuggestion(suggestion);

      // Auto-fill price based on listing type
      if (suggestion) {
        if (formData.listingType === LISTING_TYPE.FIXED_PRICE) {
          // Tự động điền giá mỗi tín chỉ với giá đề xuất (convert USD sang VNĐ)
          const priceInVnd = usdToVnd(suggestion.suggested);
          setFormData(prev => ({
            ...prev,
            pricePerCredit: priceInVnd.toString()
          }));
        } else if (formData.listingType === LISTING_TYPE.AUCTION) {
          // For auction, starting price is usually 80% of suggested price (convert USD sang VNĐ)
          const startingPriceInUsd = suggestion.suggested * 0.8;
          const startingPriceInVnd = usdToVnd(startingPriceInUsd);
          setFormData(prev => ({
            ...prev,
            startingPrice: startingPriceInVnd.toString()
          }));
        }
      }
    } else {
      setPriceSuggestion(null);
      setFormData(prev => ({
        ...prev,
        pricePerCredit: '',
        startingPrice: '',
      }));
    }
  }, [formData.quantity, formData.listingType]);

  useEffect(() => {
    // Auto-calculate total price for fixed price listings
    if (formData.listingType === LISTING_TYPE.FIXED_PRICE && formData.quantity && formData.pricePerCredit) {
      const total = calculateTotalPrice(formData.quantity, formData.pricePerCredit);
      setTotalPrice(total);
    } else {
      setTotalPrice(null);
    }
  }, [formData.quantity, formData.pricePerCredit, formData.listingType]);

  // Set default end time for auction only (7 days from now)
  useEffect(() => {
    if (formData.listingType === LISTING_TYPE.AUCTION && !formData.endTime) {
      const defaultEndTime = new Date();
      defaultEndTime.setDate(defaultEndTime.getDate() + 7);
      const formattedDate = defaultEndTime.toISOString().slice(0, 16);
      setFormData(prev => ({ ...prev, endTime: formattedDate }));
    } else if (formData.listingType === LISTING_TYPE.FIXED_PRICE && formData.endTime) {
      // Clear endTime for fixed price
      setFormData(prev => ({ ...prev, endTime: '' }));
    }
  }, [formData.listingType]);

  // Listen for listing rejection events
  useEffect(() => {
    const handleListingRejected = (event) => {
      const notification = event.detail;

      if (notification.type === 'listing_rejected' && notification.listingId) {
        // Refetch listings to get updated status
        queryClient.invalidateQueries({ queryKey: ['listings'] });

        // Refetch carbon credits to get updated balance
        queryClient.invalidateQueries({ queryKey: ['carbonCredits'] });
      }
    };

    window.addEventListener('listing-rejected', handleListingRejected);

    return () => {
      window.removeEventListener('listing-rejected', handleListingRejected);
    };
  }, [queryClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const qty = parseFloat(formData.quantity);
    if (!qty || qty <= 0) {
      showAlert('Vui lòng nhập số lượng tín chỉ hợp lệ', 'error');
      return;
    }
    if (qty > availableCredits) {
      showAlert(`Số dư không đủ! Bạn chỉ có ${availableCredits.toFixed(2)} tín chỉ trong ví.`, 'error');
      return;
    }

    if (formData.listingType === LISTING_TYPE.FIXED_PRICE) {
      if (!formData.pricePerCredit || parseFloat(formData.pricePerCredit) <= 0) {
        showAlert('Vui lòng nhập giá mỗi tín chỉ hợp lệ', 'error');
        return;
      }
    } else if (formData.listingType === LISTING_TYPE.AUCTION) {
      if (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0) {
        showAlert('Vui lòng nhập giá khởi điểm hợp lệ', 'error');
        return;
      }
      if (!formData.endTime) {
        showAlert('Vui lòng chọn thời gian kết thúc', 'error');
        return;
      }
    }

    try {
      // Prepare listing data according to API spec
      const listingData = {
        sellerId: user?.id,
        creditId: carbonCreditData?.id, // Use the carbon credit ID
        quantity: qty,
        pricePerCredit: formData.listingType === LISTING_TYPE.FIXED_PRICE
          ? parseFloat(formData.pricePerCredit)
          : parseFloat(formData.startingPrice),
        type: formData.listingType,
        endTime: formData.listingType === LISTING_TYPE.AUCTION
          ? new Date(formData.endTime).toISOString()  // Convert to proper ISO format
          : (() => {
            // For fixed price listings, set endTime to 14 days from now
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 14);
            return endDate.toISOString();
          })(),
      };

      // Create listing via mutation
      await createListingMutation.mutateAsync(listingData);

      // Show success message
      const typeLabel = formData.listingType === LISTING_TYPE.FIXED_PRICE ? 'giá cố định' : 'đấu giá';
      showAlert(
        `Niêm yết ${typeLabel} thành công! ${qty} tín chỉ đã được trừ khỏi ví và đưa lên sàn giao dịch.`,
        'success',
        5000
      );

      // Reset form
      setFormData({
        listingType: LISTING_TYPE.FIXED_PRICE,
        quantity: '',
        pricePerCredit: '',
        startingPrice: '',
        endTime: '',
      });
      setPriceSuggestion(null);
      setTotalPrice(null);
    } catch (error) {
      console.error('Error creating listing:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo niêm yết';
      showAlert(errorMessage, 'error');
    }
  };

  // ============ RENDER ============
  // Trạng thái niêm yết: đã bán, đang bán, đang đấu giá, đã đấu giá
  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-700 border-green-200',
      BIDDING: 'bg-purple-100 text-purple-700 border-purple-200',
      SOLD: 'bg-blue-100 text-blue-700 border-blue-200',
      AUCTION_ENDED: 'bg-gray-100 text-gray-700 border-gray-200',
      EXPIRED: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const icons = {
      ACTIVE: <CheckCircle className="w-4 h-4" />,
      BIDDING: <Gavel className="w-4 h-4" />,
      SOLD: <CheckCircle className="w-4 h-4" />,
      AUCTION_ENDED: <Clock className="w-4 h-4" />,
      EXPIRED: <Clock className="w-4 h-4" />,
    };

    const labels = {
      ACTIVE: 'Đang bán',
      BIDDING: 'Đang đấu giá',
      SOLD: 'Đã bán',
      AUCTION_ENDED: 'Đã đấu giá',
      EXPIRED: 'Hết hạn',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {icons[status] || <Clock className="w-4 h-4" />}
        {labels[status] || status}
      </span>
    );
  };

  // Trạng thái xác minh CVA: chờ xác minh, đã xác minh, bị từ chối
  const getVerificationBadge = (verificationStatus) => {
    const styles = {
      VERIFIED: 'bg-green-100 text-green-700 border-green-200',
      PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      REJECTED: 'bg-red-100 text-red-700 border-red-200',
    };

    const icons = {
      VERIFIED: <CheckCircle className="w-4 h-4" />,
      PENDING_VERIFICATION: <Clock className="w-4 h-4" />,
      REJECTED: <XCircle className="w-4 h-4" />,
    };

    const labels = {
      VERIFIED: 'Đã xác minh',
      PENDING_VERIFICATION: 'Chờ xác minh',
      REJECTED: 'Bị từ chối',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[verificationStatus] || styles.PENDING_VERIFICATION}`}>
        {icons[verificationStatus] || icons.PENDING_VERIFICATION}
        {labels[verificationStatus] || 'Chờ xác minh'}
      </span>
    );
  };

  const getListingTypeBadge = (type) => {
    if (type === LISTING_TYPE.FIXED_PRICE) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
          <ShoppingCart className="w-3 h-3" />
          Giá cố định
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
          <Gavel className="w-3 h-3" />
          Đấu giá
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Tag className="w-8 h-8" />
          Niêm yết tín chỉ carbon
        </h1>
        <p className="text-green-100">
          Tạo niêm yết mới để bán tín chỉ carbon của bạn trên sàn giao dịch
        </p>
      </div>

      {/* Market Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">
              {marketStats.priceChange24h > 0 ? '+' : ''}{marketStats.priceChange24h}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrencyFromUsd(marketStats.avgPrice)}</p>
          <p className="text-xs text-gray-600">Giá trung bình/tín chỉ</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{marketStats.totalListings}</p>
          <p className="text-xs text-gray-600">Tín chỉ đang niêm yết</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-semibold">
              Cao
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{marketStats.activeBuyers}</p>
          <p className="text-xs text-gray-600">Người mua đang hoạt động</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{marketStats.last30DaysSales}</p>
          <p className="text-xs text-gray-600">Giao dịch 30 ngày qua</p>
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-700">Số dư tín chỉ khả dụng</h3>
            </div>
            <p className="text-4xl font-bold text-green-600">{availableCredits.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-1">
              tấn CO₂ = {availableCredits.toFixed(2)} carbon credits
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Giá trị ước tính</p>
            <p className="text-2xl font-bold text-gray-800">
              {formatCurrencyFromUsd(availableCredits * 10)}
            </p>
            <p className="text-xs text-gray-500">theo giá thị trường</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Listing Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Tag className="w-5 h-5 text-green-600" />
                Tạo niêm yết mới
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Listing Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Loại niêm yết <span className="text-red-500">*</span>
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleListingTypeChange(LISTING_TYPE.FIXED_PRICE)}
                    className={`p-6 rounded-xl text-left transition-all duration-300 border-2 ${formData.listingType === LISTING_TYPE.FIXED_PRICE
                      ? 'bg-blue-50 border-blue-400 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <ShoppingCart className={`w-6 h-6 ${formData.listingType === LISTING_TYPE.FIXED_PRICE ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`font-bold text-lg ${formData.listingType === LISTING_TYPE.FIXED_PRICE ? 'text-blue-700' : 'text-gray-700'}`}>
                        Giá cố định
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Bán với giá niêm yết cố định. Người mua có thể mua ngay.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleListingTypeChange(LISTING_TYPE.AUCTION)}
                    className={`p-6 rounded-xl text-left transition-all duration-300 border-2 ${formData.listingType === LISTING_TYPE.AUCTION
                      ? 'bg-purple-50 border-purple-400 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Gavel className={`w-6 h-6 ${formData.listingType === LISTING_TYPE.AUCTION ? 'text-purple-600' : 'text-gray-400'}`} />
                      <span className={`font-bold text-lg ${formData.listingType === LISTING_TYPE.AUCTION ? 'text-purple-700' : 'text-gray-700'}`}>
                        Đấu giá
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Bán qua đấu giá. Người mua đặt giá và giá cao nhất sẽ thắng.
                    </p>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  Số lượng tín chỉ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0.01"
                    max={availableCredits}
                    placeholder="Ví dụ: 0.85"
                    className="w-full px-4 pr-24 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">tấn CO₂</span>
                </div>
                <div className="mt-2">
                  <Alert variant="info" className="py-2.5">
                    <span className="font-medium">1 tín chỉ = 1 tấn CO₂ giảm phát thải</span>
                  </Alert>
                </div>
              </div>

              {/* AI Price Suggestion */}
              {priceSuggestion && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span>Gợi ý giá AI</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {priceSuggestion.confidence}% tin cậy
                        </span>
                      </h3>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">Tối thiểu</p>
                          <p className="text-xl font-bold text-gray-800">{formatCurrencyFromUsd(priceSuggestion.min)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-green-600 font-semibold">Đề xuất</p>
                          <p className="text-2xl font-bold text-green-600">{formatCurrencyFromUsd(priceSuggestion.suggested)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">Tối đa</p>
                          <p className="text-xl font-bold text-gray-800">{formatCurrencyFromUsd(priceSuggestion.max)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Khoảng: {priceSuggestion.range}</span>
                        {priceSuggestion.discount > 0 && (
                          <span className="text-green-600 font-semibold">Giảm {priceSuggestion.discount}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Per Credit (Fixed Price) or Starting Price (Auction) */}
              {formData.listingType === LISTING_TYPE.FIXED_PRICE ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Giá mỗi tín chỉ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="pricePerCredit"
                      value={formData.pricePerCredit}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0.01"
                      placeholder={priceSuggestion ? usdToVnd(priceSuggestion.suggested).toLocaleString('vi-VN') : "Nhập giá"}
                      className="w-full px-4 pr-32 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">VNĐ/tín chỉ</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-purple-600" />
                    Giá khởi điểm <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="startingPrice"
                      value={formData.startingPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0.01"
                      placeholder={priceSuggestion ? usdToVnd(priceSuggestion.suggested * 0.8).toLocaleString('vi-VN') : "Nhập giá khởi điểm"}
                      className="w-full px-4 pr-32 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">VNĐ/tín chỉ</span>
                  </div>
                  <div className="mt-2">
                    <Alert variant="info" className="py-2.5">
                      <Info className="w-4 h-4 inline mr-1" />
                      <span className="text-sm">Giá khởi điểm thường thấp hơn 20-30% so với giá thị trường để thu hút người đấu giá</span>
                    </Alert>
                  </div>
                </div>
              )}

              {/* End Time - Only for Auction */}
              {formData.listingType === LISTING_TYPE.AUCTION && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Thời gian kết thúc <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      required
                    />
                  </div>
                  <div className="mt-2">
                    <Alert variant="info" className="py-2.5">
                      <Clock className="w-4 h-4 inline mr-1" />
                      <span className="text-sm">
                        Phiên đấu giá sẽ kết thúc vào thời gian này
                      </span>
                    </Alert>
                  </div>
                </div>
              )}

              {/* Total Price (Only for Fixed Price) */}
              {totalPrice && formData.listingType === LISTING_TYPE.FIXED_PRICE && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Tổng giá tiền
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Số lượng tín chỉ:</span>
                      <span className="font-semibold text-gray-800">{formData.quantity} tín chỉ</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Giá mỗi tín chỉ:</span>
                      <span className="font-semibold text-gray-800">{parseFloat(formData.pricePerCredit || 0).toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="border-t border-green-300 pt-2 flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Tổng giá tiền:</span>
                      <span className="font-bold text-green-600 text-xl">{totalPrice ? totalPrice.toLocaleString('vi-VN') : '0'} VNĐ</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  createListingMutation.isPending ||
                  !formData.quantity ||
                  (formData.listingType === LISTING_TYPE.FIXED_PRICE && !formData.pricePerCredit) ||
                  (formData.listingType === LISTING_TYPE.AUCTION && (!formData.startingPrice || !formData.endTime))
                }
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-5 px-8 rounded-xl font-bold text-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {createListingMutation.isPending ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tạo niêm yết...</span>
                  </>
                ) : (
                  <>
                    <Tag className="w-6 h-6" />
                    <span>Tạo niêm yết mới</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Price Suggestion Table */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-blue-600" />
              Bảng giá gợi ý
            </h3>

            <div className="space-y-2">
              {priceSuggestionRanges.map((range, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-sm">
                  <span className="text-gray-600">
                    {range.min}-{range.max === Infinity ? '∞' : range.max} tín chỉ
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-gray-800">
                      {formatCurrencyFromUsd(range.price)}
                    </span>
                    {range.discount > 0 && (
                      <span className="text-xs text-green-600 ml-1">(-{range.discount}%)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Alert variant="info" className="py-2 text-xs">
                <Info className="w-3 h-3 inline mr-1" />
                Giá sẽ được điều chỉnh tự động dựa trên thị trường và số lượng
              </Alert>
            </div>
          </div>
        </div>
      </div>

      {/* My Listings */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Niêm yết của tôi
        </h3>

        {listingsLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : myListings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Chưa có niêm yết nào</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((listing) => {
              const quantity = listing.quantity || 0;
              const pricePerCredit = listing.pricePerCredit || 0;
              const listingType = listing.type || LISTING_TYPE.FIXED_PRICE;
              const status = listing.status || 'ACTIVE';
              const verificationStatus = 'VERIFIED'; // Assume all listings are verified for now
              const revenue = 0; // Calculate revenue if sold
              const createdAt = listing.createdAt || new Date();
              const date = new Date(createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

              return (
                <div key={listing.id} className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-gray-300 transition-all">
                  {/* Header: Số lượng tín chỉ, Ngày khởi tạo và Xác minh CVA (góc phải) */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-base font-bold text-gray-800">
                        {quantity} tín chỉ
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Ngày khởi tạo: {date}</p>
                    </div>
                    {getVerificationBadge(verificationStatus)}
                  </div>

                  <div className="space-y-2 mb-4">
                    {/* Loại niêm yết */}
                    <div className="flex items-center justify-between">
                      {getListingTypeBadge(listingType)}
                    </div>

                    {/* Giá/tín chỉ */}
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        {listingType === LISTING_TYPE.FIXED_PRICE ? 'Giá:' : 'Giá khởi điểm:'}
                      </span>
                      <span className="font-bold text-gray-800">{pricePerCredit.toLocaleString('vi-VN')} VNĐ/tín chỉ</span>
                    </div>

                    {/* Trạng thái niêm yết: đã bán, đang bán, đang đấu giá, đã đấu giá */}
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      {getStatusBadge(status)}
                    </div>
                  </div>

                  {/* Doanh thu */}
                  {revenue > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Doanh thu:
                        </span>
                        <span className="text-lg font-bold text-green-600">{revenue.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsManagement;
