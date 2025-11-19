import { useState } from 'react';
import { User, Car, Lock, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [notifications, setNotifications] = useState({
    transaction: true,
    newCredit: true,
    withdraw: false,
    weeklyReport: true,
    monthlyReport: true,
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    toast.success('💾 Đã cập nhật thông tin cá nhân!');
  };

  const handleUpdateVehicle = (e) => {
    e.preventDefault();
    toast.success('🚗 Đã cập nhật thông tin xe điện!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;
    if (newPassword !== confirmPassword) {
      toast.error('❌ Mật khẩu xác nhận không khớp!');
      return;
    }
    toast.success('🔑 Đã đổi mật khẩu thành công!');
    e.target.reset();
  };

  const handleSaveNotifications = () => {
    toast.success('🔔 Đã lưu cài đặt thông báo!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Profile Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <User className="mr-3" />
          Thông tin cá nhân
        </h3>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input
                type="text"
                defaultValue="Nguyễn Văn An"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue="evowner@email.com"
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
              💾 Lưu thay đổi
            </button>
          </div>
        </form>
      </div>

      {/* Vehicle Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Car className="mr-3" />
          Thông tin xe điện
        </h3>
        <form onSubmit={handleUpdateVehicle} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hãng xe</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500">
                <option>Tesla</option>
                <option>VinFast</option>
                <option>BMW</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <input
                type="text"
                defaultValue="Model 3"
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

      {/* Security Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Lock className="mr-3" />
          Tùy chọn bảo mật
        </h3>
        <div className="space-y-8">
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Đổi mật khẩu</h4>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                🔑 Đổi mật khẩu
              </button>
            </form>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h4 className="font-semibold text-gray-800 mb-4">Xác thực hai yếu tố (2FA)</h4>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-800">Bảo mật nâng cao</p>
                <p className="text-sm text-gray-600">Thêm lớp bảo mật cho tài khoản của bạn</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFAEnabled}
                  onChange={(e) => setTwoFAEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Bell className="mr-3" />
          Tùy chọn thông báo
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Thông báo giao dịch</h4>
            <div className="space-y-4">
              {[
                { key: 'transaction', label: 'Giao dịch thành công', desc: 'Nhận thông báo khi bán tín chỉ thành công' },
                { key: 'newCredit', label: 'Tín chỉ mới', desc: 'Thông báo khi tạo tín chỉ từ hành trình' },
                { key: 'withdraw', label: 'Rút tiền', desc: 'Thông báo về trạng thái rút tiền' },
              ].map((notif) => (
                <div key={notif.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800">{notif.label}</p>
                    <p className="text-sm text-gray-600">{notif.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[notif.key]}
                      onChange={(e) =>
                        setNotifications({ ...notifications, [notif.key]: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveNotifications}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
            >
              🔔 Lưu cài đặt thông báo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

