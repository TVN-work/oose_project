import React, { useState } from 'react';

const Settings = ({ showNotification, showLoading, hideLoading }) => {
  const [profile, setProfile] = useState({
    fullName: 'Nguyễn Văn An',
    email: 'evowner@email.com',
    phone: '+84 901 234 567',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  });

  const [vehicle, setVehicle] = useState({
    brand: 'Tesla',
    model: 'Model 3',
    vehicleId: 'EV-TES-001-2024',
    year: 2023,
    licensePlate: '51A-12345',
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    showLoading();
    setTimeout(() => {
      hideLoading();
      showNotification('💾 Đã cập nhật thông tin cá nhân!', 'success');
    }, 1500);
  };

  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    showLoading();
    setTimeout(() => {
      hideLoading();
      showNotification('🚗 Đã cập nhật thông tin xe điện!', 'success');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 slide-in">
      {/* Profile Settings */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">👤</span>
          Thông tin cá nhân
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
            <textarea
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
              rows="3"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
            >
              💾 Lưu thay đổi
            </button>
          </div>
        </form>
      </div>

      {/* Vehicle Settings */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">🚗</span>
          Thông tin xe điện
        </h3>
        <form onSubmit={handleVehicleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hãng xe</label>
              <select
                value={vehicle.brand}
                onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                required
              >
                <option value="Tesla">Tesla</option>
                <option value="VinFast">VinFast</option>
                <option value="BMW">BMW</option>
                <option value="Audi">Audi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <input
                type="text"
                value={vehicle.model}
                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
            >
              🚗 Cập nhật thông tin xe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;

