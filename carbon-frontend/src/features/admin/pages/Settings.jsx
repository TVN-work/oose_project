import { useState } from 'react';
import { Settings as SettingsIcon, Save, Shield, Database, Wrench, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [generalSettings, setGeneralSettings] = useState({
    transactionFee: 3,
    minPrice: 50000,
    autoApprove: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    activityLog: true,
  });

  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, checked } = e.target;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const saveGeneralSettings = () => {
    toast.success('💾 Đã lưu cài đặt chung!');
  };

  const saveSecuritySettings = () => {
    toast.success('🔒 Đã lưu cài đặt bảo mật!');
  };

  const backupSystem = () => {
    toast.info('💾 Đang thực hiện sao lưu hệ thống...');
  };

  const maintenanceMode = () => {
    toast.warning('🔧 Đã chuyển sang chế độ bảo trì!');
  };

  const restartSystem = () => {
    toast.warning('🔄 Đang khởi động lại hệ thống...');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Cài đặt hệ thống</h2>
            <p className="opacity-90 mb-4">Cấu hình và bảo trì hệ thống Carbon Credit Marketplace</p>
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

      {/* System Settings */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Cài đặt chung</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phí giao dịch (%)</label>
              <input
                type="number"
                name="transactionFee"
                value={generalSettings.transactionFee}
                onChange={handleGeneralChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá tối thiểu (VND)</label>
              <input
                type="number"
                name="minPrice"
                value={generalSettings.minPrice}
                onChange={handleGeneralChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
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
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all font-semibold flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu cài đặt
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Cài đặt bảo mật
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Xác thực 2 bước</p>
                <p className="text-sm text-gray-600">Bắt buộc xác thực 2 bước cho admin</p>
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

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Ghi log hoạt động</p>
                <p className="text-sm text-gray-600">Ghi lại tất cả hoạt động của admin</p>
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
          </div>

          <div className="mt-6">
            <button
              onClick={saveSecuritySettings}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all font-semibold flex items-center"
            >
              <Shield className="w-4 h-4 mr-2" />
              Lưu bảo mật
            </button>
          </div>
        </div>
      </div>

      {/* System Maintenance */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Bảo trì hệ thống</h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Sao lưu dữ liệu</h4>
            <p className="text-sm text-gray-600 mb-4">Sao lưu toàn bộ dữ liệu hệ thống</p>
            <button
              onClick={backupSystem}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
            >
              💾 Sao lưu ngay
            </button>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Bảo trì hệ thống</h4>
            <p className="text-sm text-gray-600 mb-4">Chuyển hệ thống sang chế độ bảo trì</p>
            <button
              onClick={maintenanceMode}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
            >
              🔧 Bảo trì
            </button>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Khởi động lại</h4>
            <p className="text-sm text-gray-600 mb-4">Khởi động lại toàn bộ hệ thống</p>
            <button
              onClick={restartSystem}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
            >
              🔄 Khởi động lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

