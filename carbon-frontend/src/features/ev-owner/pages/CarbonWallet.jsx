import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, RefreshCw, Star, Tag, BarChart3, Upload } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const CarbonWallet = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const stats = [
    { icon: TrendingUp, value: '+32', label: 'Tín chỉ tháng này', color: 'green' },
    { icon: DollarSign, value: '$2,450', label: 'Thu nhập tháng này', color: 'blue' },
    { icon: RefreshCw, value: '18', label: 'Giao dịch hoàn thành', color: 'purple' },
    { icon: Star, value: '4.8', label: 'Đánh giá trung bình', color: 'orange' },
  ];

  const transactions = [
    { type: 'credit', title: 'Tạo tín chỉ từ hành trình', time: 'Hôm nay • 14:30', amount: '+15', color: 'green' },
    { type: 'debit', title: 'Bán tín chỉ', time: 'Hôm qua • 09:15', amount: '-50', color: 'red' },
    { type: 'credit', title: 'Tạo tín chỉ từ hành trình', time: '2 ngày trước • 16:45', amount: '+22', color: 'green' },
    { type: 'withdraw', title: 'Rút tiền thành công', time: '3 ngày trước • 11:20', amount: '$1,250', color: 'blue' },
  ];

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('❌ Vui lòng nhập số tiền hợp lệ');
      return;
    }
    toast.success(`✅ Yêu cầu rút $${withdrawAmount} đã được gửi thành công!`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">💰 Ví Carbon của bạn</h3>
            <div className="flex items-baseline space-x-4">
              <p className="text-4xl font-bold">245</p>
              <span className="text-lg opacity-90">tín chỉ</span>
            </div>
            <p className="opacity-90 mt-2">
              Giá trị ước tính: <span className="font-bold text-xl">$6,125</span>
            </p>
            <p className="text-sm opacity-75 mt-1">Giá trung bình: 5-10$/tín chỉ</p>
          </div>
          <div className="text-6xl opacity-20">🌱</div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-filter backdrop-blur-sm"
          >
            💸 Rút tiền
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-filter backdrop-blur-sm">
            📥 Nạp tín chỉ
          </button>
          <Link
            to="/ev-owner/listings"
            className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            🏷️ Bán ngay
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: 'bg-green-100 text-green-600',
            blue: 'bg-blue-100 text-blue-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
          };
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart and Transaction History */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Monthly Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <BarChart3 className="mr-3" />
            Biến động tín chỉ theo tháng
          </h3>
          <div className="h-64 relative">
            <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
              <div className="flex items-end space-x-3 h-full w-full">
                {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((month, index) => {
                  const heights = [60, 45, 75, 55, 85, 90, 100];
                  const isCurrent = index === 6;
                  return (
                    <div key={month} className="flex flex-col items-center flex-1">
                      <div
                        className={`${
                          isCurrent ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
                        } rounded-t-lg w-full transition-all duration-500`}
                        style={{ height: `${heights[index]}%` }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">📋</span>
            Lịch sử biến động
          </h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {transactions.map((tx, index) => {
              const colorClasses = {
                green: 'bg-green-50 border-green-200 text-green-600',
                red: 'bg-red-50 border-red-200 text-red-600',
                blue: 'bg-blue-50 border-blue-200 text-blue-600',
              };
              return (
                <div
                  key={index}
                  className={`flex items-center p-3 ${colorClasses[tx.color]} rounded-lg border`}
                >
                  <div className={`w-10 h-10 ${colorClasses[tx.color].replace('50', '100')} rounded-full flex items-center justify-center mr-3`}>
                    <span className={`text-sm ${tx.type === 'credit' ? '+' : tx.type === 'debit' ? '-' : ''}`}>
                      {tx.type === 'withdraw' ? '💰' : tx.type === 'credit' ? '+' : '-'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{tx.title}</p>
                    <p className="text-xs text-gray-600">{tx.time}</p>
                  </div>
                  <span className={`font-bold text-sm ${colorClasses[tx.color].split(' ')[2]}`}>
                    {tx.amount}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              to="/ev-owner/transactions"
              className="w-full text-center text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors block"
            >
              Xem tất cả giao dịch →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Niêm yết bán</h4>
          <p className="text-sm text-gray-600 mb-4">Đăng bán tín chỉ trên marketplace</p>
          <Link
            to="/ev-owner/listings"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            Bán ngay
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Xem báo cáo</h4>
          <p className="text-sm text-gray-600 mb-4">Phân tích thu nhập và hiệu suất</p>
          <Link
            to="/ev-owner/reports"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Xem báo cáo
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Tải dữ liệu</h4>
          <p className="text-sm text-gray-600 mb-4">Tải hành trình để tạo tín chỉ mới</p>
          <Link
            to="/ev-owner/upload-trips"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
          >
            Tải ngay
          </Link>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">💸</span>
                Rút tiền
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền muốn rút ($)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                  placeholder="Nhập số tiền"
                />
                <p className="text-xs text-gray-500 mt-1">Số dư khả dụng: $6,125</p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Xác nhận rút tiền
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarbonWallet;

