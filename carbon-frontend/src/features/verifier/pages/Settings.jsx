import { useState } from 'react';
import { Settings as SettingsIcon, Building2, Lock, User, Bell, Plus, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [orgInfo, setOrgInfo] = useState({
    name: 'Carbon Verification Authority',
    code: 'CVA-2024-001',
    email: 'admin@cva.org',
    phone: '+84 28 1234 5678',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    system: true,
  });

  const auditors = [
    { name: 'CVA Admin', email: 'admin@cva.org', role: 'Quản trị viên' },
    { name: 'Kiểm toán viên A', email: 'auditor1@cva.org', role: 'Kiểm toán viên' },
  ];

  const handleOrgInfoChange = (e) => {
    const { name, value } = e.target;
    setOrgInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateOrganization = (e) => {
    e.preventDefault();
    toast.success('Đã cập nhật thông tin tổ chức!');
  };

  const changePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    toast.success('Đã đổi mật khẩu thành công!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const addAuditor = () => {
    toast.info('Chức năng thêm kiểm toán viên đang được phát triển');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Organization Information */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Building2 className="mr-3 w-5 h-5" />
          Thông tin tổ chức
        </h3>

        <form onSubmit={updateOrganization} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên đơn vị</label>
              <input
                type="text"
                name="name"
                value={orgInfo.name}
                onChange={handleOrgInfoChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mã CVA</label>
              <input
                type="text"
                name="code"
                value={orgInfo.code}
                onChange={handleOrgInfoChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={orgInfo.email}
                onChange={handleOrgInfoChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={orgInfo.phone}
                onChange={handleOrgInfoChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Lock className="mr-3 w-5 h-5" />
          Bảo mật
        </h3>

        <div className="space-y-6">
          {/* Change Password */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Đổi mật khẩu</h4>
            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>

          {/* User Management */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2 w-5 h-5" />
              Quản lý phân quyền người kiểm toán
            </h4>
            <div className="space-y-3">
              {auditors.map((auditor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800">{auditor.name}</p>
                    <p className="text-sm text-gray-600">{auditor.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      auditor.role === 'Quản trị viên'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {auditor.role}
                  </span>
                </div>
              ))}

              <button
                onClick={addAuditor}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Thêm kiểm toán viên mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Bell className="mr-3 w-5 h-5" />
          Cấu hình thông báo
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-semibold text-gray-800">Thông báo email</p>
              <p className="text-sm text-gray-600">Nhận email khi có yêu cầu xác minh mới</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationToggle('email')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-semibold text-gray-800">Thông báo hệ thống</p>
              <p className="text-sm text-gray-600">Hiển thị thông báo trên dashboard</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.system}
                onChange={() => handleNotificationToggle('system')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

