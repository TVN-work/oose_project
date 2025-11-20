import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Gavel, Clock, TrendingUp, Users, Award, Check } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import toast from 'react-hot-toast';

const AuctionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const countdownIntervalRef = useRef(null);

  // Get auction data from location state or use defaults
  const initialAuctionData = location.state || {
    listingId: id || 'CC-002',
    seller: 'Trần Thị B',
    vehicle: 'VinFast VF8',
    credits: 85,
    startingPrice: 18.00,
    currentPrice: 22.00,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 45 * 60 * 1000 + 30 * 1000), // 2h 45m 30s from now
    region: 'TP. Hồ Chí Minh',
    co2Saved: '2.1 tấn',
    mileage: '28,500 km',
    rating: 4.9,
    reviews: 89,
    description: 'Tín chỉ carbon từ xe VinFast VF8, chuyến đi liên tỉnh từ TP.HCM đến Đà Lạt. Hành trình xanh với cảnh quan tuyệt đẹp, góp phần giảm thiểu khí thải CO2 và bảo vệ môi trường.',
  };

  const [auctionData, setAuctionData] = useState({
    currentPrice: initialAuctionData.currentPrice || 22.00,
    totalCredits: initialAuctionData.credits || 85,
    endTime: initialAuctionData.endTime ? new Date(initialAuctionData.endTime) : new Date(Date.now() + 2 * 60 * 60 * 1000 + 45 * 60 * 1000 + 30 * 1000),
    isEnded: false,
    winner: null,
    totalBids: 12,
    participants: 8,
  });

  const [bidHistory, setBidHistory] = useState([
    { id: 1, bidder: 'Buyer***789', amount: 22.00, time: '16:42:15', isWinning: true },
    { id: 2, bidder: 'Green***456', amount: 21.50, time: '16:41:32', isWinning: false },
    { id: 3, bidder: 'Eco***123', amount: 21.00, time: '16:40:18', isWinning: false },
    { id: 4, bidder: 'Carbon***999', amount: 20.50, time: '16:38:45', isWinning: false },
    { id: 5, bidder: 'Clean***777', amount: 20.00, time: '16:37:22', isWinning: false },
    { id: 6, bidder: 'Buyer***789', amount: 19.50, time: '16:35:10', isWinning: false },
    { id: 7, bidder: 'Green***456', amount: 19.00, time: '16:33:55', isWinning: false },
    { id: 8, bidder: 'Eco***123', amount: 18.50, time: '16:32:30', isWinning: false },
  ]);

  const [userBids, setUserBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showEndModal, setShowEndModal] = useState(false);
  const [userWon, setUserWon] = useState(false);

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      if (auctionData.isEnded) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        return;
      }

      const now = new Date().getTime();
      const distance = auctionData.endTime.getTime() - now;

      if (distance < 0) {
        endAuction();
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });

      // Add urgency effects when time is running out
      if (distance < 5 * 60 * 1000) {
        // Less than 5 minutes - could add pulse animation class
      }
    };

    updateCountdown();
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [auctionData.isEnded, auctionData.endTime]);

  // Simulate other bidders (for demo)
  useEffect(() => {
    if (auctionData.isEnded) return;

    const simulateBid = () => {
      if (Math.random() < 0.3 && !auctionData.isEnded) {
        const bidders = ['Green***456', 'Eco***123', 'Carbon***999', 'Clean***777'];
        const randomBidder = bidders[Math.floor(Math.random() * bidders.length)];
        const newBid = auctionData.currentPrice + 0.5 + Math.random() * 2;

        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN', { hour12: false });

        // Mark previous bids as not winning
        const updatedHistory = bidHistory.map((bid) => ({ ...bid, isWinning: false }));
        const updatedUserBids = userBids.map((bid) => ({ ...bid, isWinning: false }));

        const newBidEntry = {
          id: Date.now(),
          bidder: randomBidder,
          amount: parseFloat(newBid.toFixed(2)),
          time: timeString,
          isWinning: true,
        };

        setBidHistory([newBidEntry, ...updatedHistory]);
        setAuctionData((prev) => ({
          ...prev,
          currentPrice: parseFloat(newBid.toFixed(2)),
          totalBids: prev.totalBids + 1,
        }));

        toast.info(`🔔 ${randomBidder} đã đặt giá $${newBid.toFixed(2)}`);
      }
    };

    const interval = setInterval(simulateBid, 10000 + Math.random() * 20000); // Random between 10-30 seconds

    return () => clearInterval(interval);
  }, [auctionData, bidHistory, userBids]);

  const quickBid = (amount) => {
    const newBid = auctionData.currentPrice + amount;
    setBidAmount(newBid.toFixed(2));
  };

  const updateBidCalculation = (value) => {
    setBidAmount(value);
  };

  const placeBid = () => {
    if (auctionData.isEnded) {
      toast.error('❌ Đấu giá đã kết thúc!');
      return;
    }

    const bidValue = parseFloat(bidAmount);
    const minBid = auctionData.currentPrice + 0.5;

    if (!bidValue || bidValue < minBid) {
      toast.error(`❌ Giá đặt phải ít nhất $${minBid.toFixed(2)}`);
      return;
    }

    // Update auction data
    const now = new Date();
    const timeString = now.toLocaleTimeString('vi-VN', { hour12: false });

    // Mark previous bids as not winning
    const updatedHistory = bidHistory.map((bid) => ({ ...bid, isWinning: false }));
    const updatedUserBids = userBids.map((bid) => ({ ...bid, isWinning: false }));

    // Add new bid
    const newBidEntry = {
      id: Date.now(),
      bidder: 'Bạn',
      amount: bidValue,
      time: timeString,
      isWinning: true,
    };

    const newUserBid = {
      id: Date.now(),
      amount: bidValue,
      time: timeString,
      isWinning: true,
    };

    setBidHistory([newBidEntry, ...updatedHistory]);
    setUserBids([newUserBid, ...updatedUserBids]);
    setAuctionData((prev) => ({
      ...prev,
      currentPrice: bidValue,
      totalBids: prev.totalBids + 1,
    }));

    setBidAmount('');
    toast.success(`🎉 Đã đặt giá thành công $${bidValue.toFixed(2)}!`);
  };

  const endAuction = () => {
    setAuctionData((prev) => ({ ...prev, isEnded: true }));
    const userIsWinner = userBids.some((bid) => bid.isWinning);
    setUserWon(userIsWinner);
    setTimeout(() => {
      setShowEndModal(true);
    }, 1000);
  };

  const goBack = () => {
    navigate('/buyer/marketplace');
  };

  const totalValue = auctionData.currentPrice * auctionData.totalCredits;
  const minBid = auctionData.currentPrice + 0.5;
  const totalIfWin = parseFloat(bidAmount || auctionData.currentPrice) * auctionData.totalCredits;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-6 mb-6 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center mb-2">
              <button
                onClick={goBack}
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
                      {initialAuctionData.seller?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{initialAuctionData.seller || 'Trần Thị B'}</h2>
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center text-green-600">
                          <Check className="mr-1 w-4 h-4" />
                          <span className="font-medium">Đã xác minh</span>
                        </div>
                        <div className="flex items-center text-yellow-600">
                          <span className="mr-1">⭐</span>
                          <span className="font-medium">
                            {initialAuctionData.rating || 4.9}/5 ({initialAuctionData.reviews || 89} đánh giá)
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span className="mr-1">📍</span>
                          <span className="font-medium">{initialAuctionData.region || 'TP. Hồ Chí Minh'}</span>
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
                        <span className="text-3xl font-bold text-blue-600">{auctionData.totalCredits}</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Giá khởi điểm</span>
                        <span className="text-2xl font-bold text-green-600">
                          ${(initialAuctionData.startingPrice || 18.0).toFixed(2)}
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
                          ${auctionData.currentPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Tổng giá trị</span>
                        <span className="text-2xl font-bold text-purple-600">
                          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Countdown Timer */}
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

                {/* Description */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">📝</span>
                    Mô tả tín chỉ
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {initialAuctionData.description ||
                      'Tín chỉ carbon từ xe VinFast VF8, chuyến đi liên tỉnh từ TP.HCM đến Đà Lạt. Hành trình xanh với cảnh quan tuyệt đẹp, góp phần giảm thiểu khí thải CO2 và bảo vệ môi trường.'}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-sm text-gray-600">🚗 Xe: {initialAuctionData.vehicle || 'VinFast VF8'}</div>
                      <div className="text-sm text-gray-600">📏 Quãng đường: {initialAuctionData.mileage || '28,500 km'}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-sm text-gray-600">🌱 Giảm: {initialAuctionData.co2Saved || '2.1 tấn'} CO2</div>
                      <div className="text-sm text-gray-600">🏆 Chuẩn: VCS Verified</div>
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
                  {bidHistory.map((bid, index) => (
                    <div
                      key={bid.id}
                      className={`p-4 rounded-lg transition-all border-l-4 ${
                        bid.isWinning
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-green-500'
                          : 'bg-gray-50 border-l-transparent hover:border-l-blue-500 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            {index + 1}
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
                            ${bid.amount.toFixed(2)}
                          </div>
                          {bid.isWinning && (
                            <div className="text-sm text-green-600 font-medium">🏆 Đang dẫn đầu</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bid Panel */}
          <div className="space-y-6">
            {/* Bid Form */}
            <div
              className={`bg-white rounded-xl shadow-sm sticky top-6 ${
                auctionData.isEnded ? 'opacity-80' : ''
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
                    <div className="text-3xl font-bold text-blue-600">${auctionData.currentPrice.toFixed(2)}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      bởi {bidHistory.find((b) => b.isWinning)?.bidder || 'Buyer***789'}
                    </div>
                  </div>
                </div>

                {/* Bid Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Giá đặt mới (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-500 text-lg font-bold">$</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => updateBidCalculation(e.target.value)}
                      step="0.50"
                      min={minBid}
                      disabled={auctionData.isEnded}
                      placeholder={minBid.toFixed(2)}
                      className="w-full pl-8 pr-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Giá tối thiểu: ${minBid.toFixed(2)} (cao hơn $0.50)</div>
                </div>

                {/* Quick Bid Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[0.5, 1.0, 2.0].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => quickBid(amount)}
                      disabled={auctionData.isEnded}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +${amount.toFixed(2)}
                    </button>
                  ))}
                </div>

                {/* Total Calculation */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Giá mỗi tín chỉ:</span>
                      <span className="font-semibold text-gray-800">
                        ${(parseFloat(bidAmount) || auctionData.currentPrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Số lượng:</span>
                      <span className="font-semibold text-gray-800">{auctionData.totalCredits} tín chỉ</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Tổng nếu thắng:</span>
                        <span className="text-xl font-bold text-blue-600">
                          ${totalIfWin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bid Button */}
                <button
                  onClick={placeBid}
                  disabled={auctionData.isEnded}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 mb-4 ${
                    auctionData.isEnded
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white'
                  }`}
                >
                  {auctionData.isEnded ? '⏰ Đấu giá đã kết thúc' : '🔨 Đặt giá'}
                </button>

                {/* Info */}
                <div className="text-center text-sm text-gray-600">
                  <p className="mb-1">💡 Bạn chỉ thanh toán khi thắng đấu giá</p>
                  <p className="mb-1">🔒 Giao dịch được bảo mật 100%</p>
                  <p>⚡ Kết quả sẽ có ngay khi kết thúc</p>
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
                    <span className="font-semibold">{auctionData.totalBids}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Người tham gia:</span>
                    <span className="font-semibold">{auctionData.participants} người</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tăng giá trung bình:</span>
                    <span className="font-semibold text-green-600">$0.75</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian bắt đầu:</span>
                    <span className="font-semibold">
                      {new Date(auctionData.endTime.getTime() - 2 * 60 * 60 * 1000 - 45 * 60 * 1000 - 30 * 1000).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
                  {userBids.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-4">Bạn chưa đặt giá nào</div>
                  ) : (
                    userBids.map((bid) => (
                      <div key={bid.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-gray-800">${bid.amount.toFixed(2)}</div>
                          <div className="text-sm text-gray-600">{bid.time}</div>
                        </div>
                        <div className={`text-sm font-medium ${bid.isWinning ? 'text-green-600' : 'text-gray-500'}`}>
                          {bid.isWinning ? '🏆 Đang dẫn đầu' : '📉 Bị vượt qua'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auction End Modal */}
      <Modal isOpen={showEndModal} onClose={() => setShowEndModal(false)} title={userWon ? 'Chúc mừng!' : 'Đấu giá đã kết thúc'}>
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              userWon ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            <span className="text-4xl">{userWon ? '🎉' : '😔'}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {userWon ? 'Chúc mừng! Bạn đã thắng cuộc!' : 'Đấu giá đã kết thúc'}
          </h3>
          <p className="text-gray-600 mb-6">
            {userWon
              ? 'Bạn đã thắng đấu giá tín chỉ carbon này!'
              : 'Rất tiếc, bạn không thắng cuộc đấu giá này.'}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">{userWon ? 'Giá thắng:' : 'Giá thắng cuộc:'}</span>
                <span className={`font-bold ${userWon ? 'text-green-600' : 'text-gray-800'}`}>
                  ${auctionData.currentPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số lượng:</span>
                <span className="font-semibold">{auctionData.totalCredits} tín chỉ</span>
              </div>
              {userWon && (
                <div className="flex justify-between border-t pt-2">
                  <span className="text-lg font-bold">Tổng thanh toán:</span>
                  <span className="text-lg font-bold text-green-600">
                    ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              {!userWon && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Người thắng:</span>
                  <span className="font-semibold">{bidHistory.find((b) => b.isWinning)?.bidder || 'Buyer***789'}</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {userWon && (
              <button
                onClick={() => {
                  setShowEndModal(false);
                  navigate('/buyer/checkout', {
                    state: {
                      listingId: initialAuctionData.listingId,
                      seller: initialAuctionData.seller,
                      vehicle: initialAuctionData.vehicle,
                      mileage: initialAuctionData.mileage,
                      co2Saved: initialAuctionData.co2Saved,
                      quantity: auctionData.totalCredits,
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
              {userWon ? 'Xem chứng nhận' : 'Quay về Marketplace'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AuctionPage;

