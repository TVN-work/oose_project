import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Gavel, Clock, TrendingUp, Users, Award, Check, Info, Lock, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import marketService, { LISTING_STATUSES } from '../../../services/market/marketService';
import bidService from '../../../services/bid/bidService';
import { useAllBids } from '../../../hooks/useBid';
import { BID_SORT, SORT_DIRECTION } from '../../../types/constants';
import Modal from '../../../components/common/Modal';
import Loading from '../../../components/common/Loading';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { formatCurrency } from '../../../utils';

const AuctionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const countdownIntervalRef = useRef(null);

  // Bid pagination state
  const [bidPage, setBidPage] = useState(0);
  const [bidPageSize, setBidPageSize] = useState(10);

  // Fetch listing data from database
  const { data: listingData, isLoading, error, refetch } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => marketService.getListingById(id),
    enabled: !!id,
  });

  // Fetch bids separately with pagination and sorting
  const { data: bidsData, isLoading: bidsLoading, refetch: refetchBids } = useAllBids({
    listingId: id,
    page: bidPage,
    size: bidPageSize,
    sortBy: BID_SORT.AMOUNT,
    sort: SORT_DIRECTION.DESC,
  });

  // Place bid mutation
  const placeBidMutation = useMutation({
    mutationFn: (bidData) => bidService.createBid(bidData),
    onSuccess: () => {
      toast.success('✓ Đặt giá thành công!');
      setBidAmount('');
      refetch(); // Refresh listing data
      refetchBids(); // Refresh bids list
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
      queryClient.invalidateQueries({ queryKey: ['bids'] });
    },
    onError: (error) => {
      toast.error('❌ Lỗi: ' + (error.response?.data?.message || 'Không thể đặt giá'));
    },
  });

  // Get current user ID from auth
  const currentUserId = user?.id;

  const [bidAmount, setBidAmount] = useState('');
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showEndModal, setShowEndModal] = useState(false);

  // Process listing data
  const auctionData = useMemo(() => {
    if (!listingData) return null;

    const endTime = new Date(listingData.endTime);
    const now = new Date();
    const isEnded = now >= endTime || listingData.status === LISTING_STATUSES.ENDED || listingData.status === LISTING_STATUSES.SOLD;

    // Get bids from separate API call (sorted by amount desc)
    console.log('🔍 bidsData:', bidsData);

    // Handle both array response and paginated response
    const bidsList = Array.isArray(bidsData) ? bidsData : (bidsData?.content || []);
    console.log('📊 bidsList:', bidsList);

    // Get highest bid as current price (first item is highest due to DESC sort)
    const highestBid = bidsList.length > 0 ? bidsList[0] : null;
    const currentPrice = highestBid ? highestBid.amount : listingData.pricePerCredit;

    // Format bid history
    const bidHistory = bidsList.map((bid, index) => {
      return {
        id: bid.id || index,
        bidder: bid.bidderName,
        amount: bid.amount,
        time: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
        isWinning: index === 0,
      };
    });

    return {
      ...listingData,
      endTime: endTime,
      isEnded: isEnded,
      currentPrice: currentPrice,
      highestBid: highestBid,
      bidHistory: bidHistory,
      totalBids: Array.isArray(bidsData) ? bidsData.length : (bidsData?.totalElements || 0),
      totalBidPages: Array.isArray(bidsData) ? Math.ceil(bidsData.length / bidPageSize) : (bidsData?.totalPages || 0),
    };
  }, [listingData, bidsData, bidPageSize]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 AuctionPage Debug:', {
      id,
      listingData: !!listingData,
      bidsData,
      bidsLoading,
      auctionData: auctionData ? {
        totalBids: auctionData.totalBids,
        bidHistoryLength: auctionData.bidHistory?.length,
        bidHistory: auctionData.bidHistory,
      } : null,
    });
  }, [id, listingData, bidsData, bidsLoading, auctionData]);

  // Countdown timer
  useEffect(() => {
    if (!auctionData || auctionData.isEnded) {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (auctionData?.isEnded && !showEndModal) {
        setTimeout(() => setShowEndModal(true), 1000);
      }
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = auctionData.endTime.getTime() - now;

      if (distance < 0) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        refetch(); // Refresh to get updated status
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });
    };

    updateCountdown();
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [auctionData, showEndModal, refetch]);

  const quickBid = (amount) => {
    if (!auctionData) return;
    const newBid = auctionData.currentPrice + amount;
    setBidAmount(newBid.toFixed(2));
  };

  const updateBidCalculation = (value) => {
    setBidAmount(value);
  };

  const placeBid = async () => {
    if (!auctionData || auctionData.isEnded) {
      toast.error('❌ Đấu giá đã kết thúc!');
      return;
    }

    const bidValue = parseFloat(bidAmount);
    const minBid = auctionData.currentPrice + 0.5;

    if (!bidValue || bidValue <= auctionData.currentPrice) {
      toast.error(`❌ Giá đặt phải cao hơn giá hiện tại (${formatCurrency(auctionData.currentPrice)})`);
      return;
    }

    try {
      await placeBidMutation.mutateAsync({
        bidderId: currentUserId,
        bidderName: user?.fullName || user?.username,
        listingId: id,
        bidAmount: bidValue,
      });
    } catch (error) {
      // Error is handled by mutation
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !auctionData) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Không thể tải thông tin đấu giá. Vui lòng thử lại sau.</p>
          <button
            onClick={() => navigate('/buyer/marketplace')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay về Marketplace
          </button>
        </div>
      </div>
    );
  }

  const totalValue = auctionData.currentPrice * auctionData.quantity;
  const minBid = auctionData.currentPrice + 0.5;
  const totalIfWin = parseFloat(bidAmount || auctionData.currentPrice) * auctionData.quantity;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-6 mb-6 rounded-xl">
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
                <span className="mr-3 text-4xl">🔨</span>
                Tham gia đấu giá tín chỉ carbon
              </h1>
            </div>
            <p className="text-gray-600 ml-14">Đặt giá để sở hữu tín chỉ carbon chất lượng cao</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Trạng thái đấu giá</p>
              <p className="text-sm font-medium">
                {auctionData.isEnded ? '🔴 Đã kết thúc' : '🔥 Đang diễn ra'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Auction Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auction Info Card */}
            <div className="bg-white rounded-xl shadow-sm">
              {/* Seller Info */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
                      S
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Người bán</h2>
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center text-green-600">
                          <Check className="mr-1 w-4 h-4" />
                          <span className="font-medium">Đã xác minh</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">
                      🔨 Đấu giá
                    </div>
                  </div>
                </div>
              </div>

              {/* Auction Details */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Số lượng tín chỉ</span>
                        <span className="text-3xl font-bold text-blue-600">{auctionData.quantity}</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Giá khởi điểm</span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(auctionData.pricePerCredit)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Giá hiện tại</span>
                        <span className="text-3xl font-bold text-red-600">
                          {formatCurrency(auctionData.currentPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Tổng giá trị</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {formatCurrency(auctionData.currentPrice * auctionData.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Countdown Timer */}
                {!auctionData.isEnded && (
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-amber-300 p-6 rounded-xl mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center">
                      <Clock className="mr-2 w-5 h-5" />
                      Thời gian còn lại
                    </h3>
                    <div className="flex justify-center space-x-4">
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg min-w-[60px] h-[60px] flex items-center justify-center font-bold text-2xl shadow-lg">
                          {countdown.hours.toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm font-medium text-gray-700 mt-2">Giờ</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg min-w-[60px] h-[60px] flex items-center justify-center font-bold text-2xl shadow-lg">
                          {countdown.minutes.toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm font-medium text-gray-700 mt-2">Phút</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg min-w-[60px] h-[60px] flex items-center justify-center font-bold text-2xl shadow-lg">
                          {countdown.seconds.toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm font-medium text-gray-700 mt-2">Giây</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">📝</span>
                    Mô tả tín chỉ
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Tín chỉ carbon được tạo ra từ việc sử dụng xe điện cho các chuyến đi. Xe được bảo dưỡng định kỳ và đảm bảo hiệu suất tối ưu, góp phần giảm thiểu lượng khí thải CO2 so với xe xăng truyền thống.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-sm text-gray-600">🚗 Loại: {auctionData.type}</div>
                      <div className="text-sm text-gray-600">🌱 Giảm: {(auctionData.quantity * 0.15).toFixed(2)} tấn CO2</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-sm text-gray-600">🏆 Chuẩn: VCS Verified</div>
                      <div className="text-sm text-gray-600">✅ Đã xác minh CVA</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <TrendingUp className="mr-2 w-5 h-5" />
                  Lịch sử đặt giá
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {(() => {
                    console.log('🎨 Render conditions:', {
                      bidsLoading,
                      hasBidHistory: !!auctionData?.bidHistory,
                      bidHistoryLength: auctionData?.bidHistory?.length,
                      bidHistory: auctionData?.bidHistory,
                    });

                    if (bidsLoading) {
                      return (
                        <div className="text-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Đang tải lượt đặt giá...</p>
                        </div>
                      );
                    }

                    if (!auctionData?.bidHistory || auctionData.bidHistory.length === 0) {
                      return (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">Chưa có lượt đặt giá nào</p>
                        </div>
                      );
                    }

                    return auctionData.bidHistory.map((bid, index) => (
                      <div
                        key={bid.id}
                        className={`p-4 rounded-lg transition-all border-l-4 ${bid.isWinning
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-green-500'
                          : 'bg-gray-50 border-l-transparent hover:border-l-blue-500 hover:bg-gray-100'
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                              {bidPage * bidPageSize + index + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{bid.bidder}</div>
                              <div className="text-sm text-gray-600">{bid.time}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-xl font-bold ${bid.isWinning ? 'text-green-600' : 'text-gray-800'}`}
                            >
                              {formatCurrency(bid.amount)}
                            </div>
                            {bid.isWinning && (
                              <div className="text-sm text-green-600 font-medium">🏆 Đang dẫn đầu</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                {/* Pagination Controls */}
                {auctionData?.totalBids > bidPageSize && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Hiển thị:</span>
                        <select
                          value={bidPageSize}
                          onChange={(e) => {
                            setBidPageSize(parseInt(e.target.value));
                            setBidPage(0);
                          }}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-gray-600">
                          ({Math.min(bidPage * bidPageSize + 1, auctionData?.totalBids || 0)} -
                          {Math.min((bidPage + 1) * bidPageSize, auctionData?.totalBids || 0)} / {auctionData?.totalBids || 0})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setBidPage(Math.max(0, bidPage - 1))}
                          disabled={bidPage === 0 || bidsLoading}
                          className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          Trước
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, auctionData?.totalBidPages || 0) }, (_, i) => {
                            const totalPages = auctionData?.totalBidPages || 0;
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i;
                            } else if (bidPage < 3) {
                              pageNumber = i;
                            } else if (bidPage > totalPages - 4) {
                              pageNumber = totalPages - 5 + i;
                            } else {
                              pageNumber = bidPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNumber}
                                onClick={() => setBidPage(pageNumber)}
                                className={`px-3 py-1 text-sm border rounded-md transition-colors ${pageNumber === bidPage
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-gray-300 hover:bg-gray-50'
                                  }`}
                              >
                                {pageNumber + 1}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setBidPage(Math.min((auctionData?.totalBidPages || 1) - 1, bidPage + 1))}
                          disabled={bidPage >= (auctionData?.totalBidPages || 1) - 1 || bidsLoading}
                          className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bid Panel */}
          <div className="space-y-6">
            {/* Bid Form */}
            <div
              className={`bg-white rounded-xl shadow-sm sticky top-6 ${auctionData.isEnded ? 'opacity-80' : ''
                }`}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Gavel className="mr-2 w-5 h-5" />
                  Đặt giá của bạn
                </h3>

                {/* Current Bid Info */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Giá hiện tại cao nhất</div>
                    <div className="text-3xl font-bold text-blue-600">{formatCurrency(auctionData.currentPrice)}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      bởi {auctionData.bidHistory?.find((b) => b.isWinning)?.bidder || 'Chưa có'}
                    </div>
                  </div>
                </div>

                {/* Bid Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Giá đặt mới (VND)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-500 text-lg font-bold">₫</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      step="0.50"
                      min={auctionData.currentPrice + 0.5}
                      disabled={auctionData.isEnded || placeBidMutation.isPending}
                      placeholder={(auctionData.currentPrice + 0.5).toFixed(2)}
                      className="w-full pl-8 pr-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Giá tối thiểu: {formatCurrency(auctionData.currentPrice + 0.5)} (cao hơn {formatCurrency(0.50)})</div>
                </div>

                {/* Quick Bid Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[0.5, 1.0, 2.0].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBidAmount((parseFloat(bidAmount) || auctionData.currentPrice) + amount)}
                      disabled={auctionData.isEnded || placeBidMutation.isPending}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +{formatCurrency(amount)}
                    </button>
                  ))}
                </div>

                {/* Total Calculation */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Giá mỗi tín chỉ:</span>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(parseFloat(bidAmount) || auctionData.currentPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Số lượng:</span>
                      <span className="font-semibold text-gray-800">{auctionData.quantity} tín chỉ</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Tổng nếu thắng:</span>
                        <span className="text-xl font-bold text-blue-600">
                          {formatCurrency((parseFloat(bidAmount) || auctionData.currentPrice) * auctionData.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bid Button */}
                {auctionData.isEnded && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-4">
                    <p className="text-red-700 font-semibold text-center">⏰ Đấu giá đã kết thúc</p>
                  </div>
                )}

                {!auctionData.isEnded && (!bidAmount || parseFloat(bidAmount) <= auctionData.currentPrice) && (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-4">
                    <p className="text-yellow-700 font-semibold text-sm text-center">
                      ⚠️ {!bidAmount ? 'Nhập giá đặt' : 'Giá phải cao hơn ' + formatCurrency(auctionData.currentPrice)}
                    </p>
                  </div>
                )}

                <button
                  onClick={placeBid}
                  disabled={auctionData.isEnded || placeBidMutation.isPending || !bidAmount || parseFloat(bidAmount) <= auctionData.currentPrice}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform mb-4 ${auctionData.isEnded
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : (!bidAmount || parseFloat(bidAmount) <= auctionData.currentPrice)
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : placeBidMutation.isPending
                        ? 'bg-blue-500 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:shadow-lg text-white hover:scale-105'
                    }`}
                >
                  {placeBidMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                      Đang xử lý...
                    </>
                  ) : auctionData.isEnded ? (
                    '⏰ Đấu giá đã kết thúc'
                  ) : !bidAmount ? (
                    '📝 Nhập giá trước khi đặt'
                  ) : (
                    '🔨 Đặt giá ngay'
                  )}
                </button>

                {/* Info */}
                <div className="text-center text-sm text-gray-600 space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <Info className="w-4 h-4" />
                    Bạn chỉ thanh toán khi thắng đấu giá
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Lock className="w-4 h-4" />
                    Giao dịch được bảo mật 100%
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" />
                    Kết quả sẽ có ngay khi kết thúc
                  </p>
                </div>
              </div>
            </div>

            {/* Auction Stats */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="mr-2 w-5 h-5" />
                  Thống kê đấu giá
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số lượt đặt giá:</span>
                    <span className="font-semibold">{auctionData?.totalBids || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Người tham gia:</span>
                    <span className="font-semibold">{new Set(auctionData?.bidResponseList?.map(b => b.bidderName)).size || 0} người</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tăng giá trung bình:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(0.75)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian kết thúc:</span>
                    <span className="font-semibold">
                      {auctionData?.endTime ? auctionData.endTime.toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Bids */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Users className="mr-2 w-5 h-5" />
                  Giá của bạn
                </h3>
                <div className="space-y-2">
                  {auctionData?.bidResponseList && auctionData.bidResponseList.length > 0 ? (
                    auctionData.bidResponseList.map((bid, index) => {
                      const isWinning = index === 0;
                      return (
                        <div key={bid.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold text-gray-800">{formatCurrency(bid.amount)}</div>
                            <div className="text-sm text-gray-600">{bid.bidderName}</div>
                          </div>
                          <div className={`text-sm font-medium ${isWinning ? 'text-green-600' : 'text-gray-500'}`}>
                            {isWinning ? '🏆 Đang dẫn đầu' : '📉 Bị vượt qua'}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">Chưa có lượt đặt giá nào</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auction End Modal */}
      <Modal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        title={auctionData?.userIsWinning ? 'Chúc mừng!' : 'Đấu giá đã kết thúc'}
      >
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${auctionData?.userIsWinning ? 'bg-green-100' : 'bg-gray-100'
              }`}
          >
            <span className="text-4xl">{auctionData?.userIsWinning ? '🎉' : '😔'}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {auctionData?.userIsWinning ? 'Chúc mừng! Bạn đã thắng cuộc!' : 'Đấu giá đã kết thúc'}
          </h3>
          <p className="text-gray-600 mb-6">
            {auctionData?.userIsWinning
              ? 'Bạn đã thắng đấu giá tín chỉ carbon này!'
              : 'Rất tiếc, bạn không thắng cuộc đấu giá này.'}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">{auctionData?.userIsWinning ? 'Giá thắng:' : 'Giá thắng cuộc:'}</span>
                <span className={`font-bold ${auctionData?.userIsWinning ? 'text-green-600' : 'text-gray-800'}`}>
                  {formatCurrency(auctionData?.currentPrice || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số lượng:</span>
                <span className="font-semibold">{auctionData?.quantity || 0} tín chỉ</span>
              </div>
              {auctionData?.userIsWinning && (
                <div className="flex justify-between border-t pt-2">
                  <span className="text-lg font-bold">Tổng thanh toán:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(totalValue)}
                  </span>
                </div>
              )}
              {!auctionData?.userIsWinning && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Người thắng:</span>
                  <span className="font-semibold">{auctionData?.bidHistory?.find((b) => b.isWinning)?.bidder || 'Unknown'}</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {auctionData?.userIsWinning && (
              <button
                onClick={() => {
                  setShowEndModal(false);
                  navigate('/buyer/checkout', {
                    state: {
                      listingId: id,
                      seller: auctionData.seller?.full_name,
                      vehicle: auctionData.vehicle?.license_plate || 'Electric Vehicle',
                      quantity: auctionData.quantity,
                      pricePerCredit: auctionData.currentPrice,
                      transactionFee: 15.00,
                    },
                  });
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white py-3 rounded-lg font-semibold transition-all"
              >
                💳 Thanh toán ngay
              </button>
            )}
            <button
              onClick={() => {
                setShowEndModal(false);
                navigate('/buyer/marketplace');
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
            >
              {auctionData?.userIsWinning ? 'Xem chứng nhận' : 'Quay về Marketplace'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AuctionPage;
