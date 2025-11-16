import React from 'react';
import { useNavigate } from 'react-router-dom';

const CarbonWallet = ({ onNavigate, showNotification, showLoading, hideLoading }) => {
  const navigate = onNavigate || useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-8 slide-in">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white card-shadow">
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
            <p className="text-sm opacity-75 mt-1">Giá trung bình: $25/tín chỉ</p>
          </div>
          <div className="text-6xl opacity-20">🌱</div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => showNotification('💸 Tính năng rút tiền đang được phát triển', 'info')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-filter backdrop-blur-sm"
          >
            💸 Rút tiền
          </button>
          <button
            onClick={() => showNotification('📥 Tính năng nạp tín chỉ đang được phát triển', 'info')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-filter backdrop-blur-sm"
          >
            📥 Nạp tín chỉ
          </button>
          <button
            onClick={() => navigate('/list-credits')}
            className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            🏷️ Bán ngay
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-2xl font-bold text-green-600">+32</p>
          <p className="text-sm text-gray-600">Tín chỉ tháng này</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">$2,450</p>
          <p className="text-sm text-gray-600">Thu nhập tháng này</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔄</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">18</p>
          <p className="text-sm text-gray-600">Giao dịch hoàn thành</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">4.8</p>
          <p className="text-sm text-gray-600">Đánh giá trung bình</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📋</span>
          Lịch sử biến động
        </h3>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 text-sm">+</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">Tạo tín chỉ từ hành trình</p>
              <p className="text-xs text-gray-600">Hôm nay • 14:30</p>
            </div>
            <span className="text-green-600 font-bold text-sm">+15</span>
          </div>
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 text-sm">-</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">Bán tín chỉ</p>
              <p className="text-xs text-gray-600">Hôm qua • 09:15</p>
            </div>
            <span className="text-red-600 font-bold text-sm">-50</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonWallet;

