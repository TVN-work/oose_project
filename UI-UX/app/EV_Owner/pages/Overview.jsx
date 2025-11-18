import React from 'react';
import { useNavigate } from 'react-router-dom';

const Overview = ({ onNavigate }) => {
  const navigate = onNavigate || useNavigate();

  return (
    <div className="max-w-7xl mx-auto fade-in">
      {/* Welcome Card */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-8 mb-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚗</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chào mừng đến với EV Owner Dashboard</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Quản lý và kiếm tiền từ việc lái xe điện của bạn. Tải dữ liệu hành trình, tạo tín chỉ carbon và bán
            cho những người quan tâm đến môi trường!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/upload-data')}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
            >
              📤 Tải dữ liệu hành trình
            </button>
            <button
              onClick={() => navigate('/carbon-wallet')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              💰 Xem ví Carbon
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌱</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">245</p>
          <p className="text-sm text-gray-600">Tín chỉ có sẵn</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">$8,750</p>
          <p className="text-sm text-gray-600">Tổng thu nhập</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛣️</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">12,450</p>
          <p className="text-sm text-gray-600">Km đã đi</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌍</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">18.1</p>
          <p className="text-sm text-gray-600">Tấn CO2 tiết kiệm</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📈</span>
          Hoạt động gần đây
        </h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-green-600">📤</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Tải dữ liệu hành trình thành công</p>
              <p className="text-sm text-gray-600">125 km • Tạo 15 tín chỉ carbon • 2 giờ trước</p>
            </div>
            <span className="text-green-600 font-semibold">+15 tín chỉ</span>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-600">💰</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Bán tín chỉ thành công</p>
              <p className="text-sm text-gray-600">50 tín chỉ cho Carbon Buyer • 1 ngày trước</p>
            </div>
            <span className="text-blue-600 font-semibold">+$1,250</span>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-purple-600">🏷️</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Niêm yết tín chỉ mới</p>
              <p className="text-sm text-gray-600">80 tín chỉ với giá $25/tín chỉ • 3 ngày trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

