import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Shield, 
  Database, 
  Wrench, 
  RotateCcw,
  User,
  Bell,
  Lock,
  Globe,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  const [generalSettings, setGeneralSettings] = useState({
    transactionFee: 3,
    minPrice: 50000,
    maxPrice: 10000000,
    autoApprove: true,
    maintenanceMode: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    activityLog: true,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    systemAlerts: true,
    transactionAlerts: true,
    userAlerts: true,
    reportAlerts: true,
  });

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || user?.full_name || user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phone_number || user?.phoneNumber || user?.phone || '',
  });

  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseFloat(value) || value,
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveGeneralSettings = () => {
    toast.success('Đã lưu cài đặt chung');
  };

  const saveSecuritySettings = () => {
    toast.success('Đã lưu cài đặt bảo mật');
  };

  const saveNotificationSettings = () => {
    toast.success('Đã lưu cài đặt thông báo');
  };

  const saveProfile = () => {
    toast.success('Đã cập nhật thông tin cá nhân');
  };

  const backupSystem = () => {
    toast.info('Đang thực hiện sao lưu hệ thống...');
  };

  const maintenanceMode = () => {
    const newMode = !generalSettings.maintenanceMode;
    setGeneralSettings((prev) => ({ ...prev, maintenanceMode: newMode }));
    toast.warning(newMode ? 'Đã bật chế độ bảo trì' : 'Đã tắt chế độ bảo trì');
  };

  const restartSystem = () => {
    if (window.confirm('Bạn có chắc chắn muốn khởi động lại hệ thống? Hành động này có thể ảnh hưởng đến người dùng đang hoạt động.')) {
      toast.warning('Đang khởi động lại hệ thống...');
    }
  };

  const tabs = [
    { id: 'general', label: 'Cài đặt chung', icon: SettingsIcon },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'maintenance', label: 'Bảo trì', icon: Wrench },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Cài đặt hệ thống</h2>
            <p className="opacity-90 mb-4">Cấu hình và quản lý hệ thống Carbon Credit Marketplace</p>
            <div className="flex space-x-4">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">Hệ thống ổn định</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">Uptime: 99.9%</span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <SettingsIcon className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Cài đặt chung hệ thống
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phí giao dịch (%)</label>
                    <input
                      type="number"
                      name="transactionFee"
                      value={generalSettings.transactionFee}
                      onChange={handleGeneralChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      min="0"
                      max="10"
                      step="0.1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Phí hệ thống tính trên mỗi giao dịch</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá tối thiểu (VND)</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={generalSettings.minPrice}
                      onChange={handleGeneralChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Giá tối thiểu cho mỗi tín chỉ carbon</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá tối đa (VND)</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={generalSettings.maxPrice}
                      onChange={handleGeneralChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Giá tối đa cho mỗi tín chỉ carbon</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Tự động duyệt niêm yết</p>
                      <p className="text-sm text-gray-600">Duyệt tự động các niêm yết từ người dùng đã xác thực</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="autoApprove"
                        checked={generalSettings.autoApprove}
                        onChange={handleGeneralChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={saveGeneralSettings}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    Lưu cài đặt
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Cài đặt bảo mật
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Xác thực 2 bước</p>
                      <p className="text-sm text-gray-600">Bắt buộc xác thực 2 bước cho tất cả admin</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        checked={securitySettings.twoFactorAuth}
                        onChange={handleSecurityChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Ghi log hoạt động</p>
                      <p className="text-sm text-gray-600">Ghi lại tất cả hoạt động của admin vào audit log</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="activityLog"
                        checked={securitySettings.activityLog}
                        onChange={handleSecurityChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian timeout phiên (phút)</label>
                    <input
                      type="number"
                      name="sessionTimeout"
                      value={securitySettings.sessionTimeout}
                      onChange={handleSecurityChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      min="5"
                      max="120"
                    />
                    <p className="text-xs text-gray-500 mt-1">Thời gian tự động đăng xuất khi không hoạt động</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chính sách mật khẩu</label>
                    <select
                      name="passwordPolicy"
                      value={securitySettings.passwordPolicy}
                      onChange={handleSecurityChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="weak">Yếu (6 ký tự)</option>
                      <option value="medium">Trung bình (8 ký tự, chữ + số)</option>
                      <option value="strong">Mạnh (8+ ký tự, chữ hoa/thường + số + ký tự đặc biệt)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={saveSecuritySettings}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-semibold"
                  >
                    <Shield className="w-4 h-4" />
                    Lưu bảo mật
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Cài đặt thông báo
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Cảnh báo hệ thống</p>
                      <p className="text-sm text-gray-600">Nhận thông báo về các sự cố hệ thống</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="systemAlerts"
                        checked={notificationSettings.systemAlerts}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Cảnh báo giao dịch</p>
                      <p className="text-sm text-gray-600">Nhận thông báo về giao dịch lớn và tranh chấp</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="transactionAlerts"
                        checked={notificationSettings.transactionAlerts}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Cảnh báo người dùng</p>
                      <p className="text-sm text-gray-600">Nhận thông báo về hoạt động bất thường của người dùng</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="userAlerts"
                        checked={notificationSettings.userAlerts}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Cảnh báo báo cáo</p>
                      <p className="text-sm text-gray-600">Nhận thông báo khi có báo cáo mới được tạo</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="reportAlerts"
                        checked={notificationSettings.reportAlerts}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={saveNotificationSettings}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    Lưu cài đặt
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Thông tin cá nhân
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên đầy đủ</label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={saveProfile}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    Lưu thông tin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Wrench className="w-5 h-5 mr-2" />
                  Bảo trì hệ thống
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white border-2 border-green-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Sao lưu dữ liệu</h4>
                    <p className="text-sm text-gray-600 mb-4">Sao lưu toàn bộ dữ liệu hệ thống vào backup server</p>
                    <button
                      onClick={backupSystem}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all w-full"
                    >
                      <Database className="w-4 h-4 inline mr-2" />
                      Sao lưu ngay
                    </button>
                  </div>

                  <div className="bg-white border-2 border-orange-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wrench className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Chế độ bảo trì</h4>
                    <p className="text-sm text-gray-600 mb-4">Chuyển hệ thống sang chế độ bảo trì (người dùng không thể truy cập)</p>
                    <button
                      onClick={maintenanceMode}
                      className={`${
                        generalSettings.maintenanceMode
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : 'bg-gradient-to-r from-orange-500 to-orange-600'
                      } text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all w-full`}
                    >
                      {generalSettings.maintenanceMode ? (
                        <>
                          <XCircle className="w-4 h-4 inline mr-2" />
                          Tắt bảo trì
                        </>
                      ) : (
                        <>
                          <Wrench className="w-4 h-4 inline mr-2" />
                          Bật bảo trì
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-white border-2 border-red-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RotateCcw className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Khởi động lại</h4>
                    <p className="text-sm text-gray-600 mb-4">Khởi động lại toàn bộ hệ thống (cảnh báo: sẽ ảnh hưởng đến người dùng)</p>
                    <button
                      onClick={restartSystem}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all w-full"
                    >
                      <RotateCcw className="w-4 h-4 inline mr-2" />
                      Khởi động lại
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
