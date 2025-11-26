import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Building2, Lock, Bell, Save, AlertCircle, User, Mail, Phone, Calendar, Key, Info, Loader2, Eye, EyeOff } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customerService from '../../../services/customer/customerService';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';
import Loading from '../../../components/common/Loading';

const Settings = () => {
  const queryClient = useQueryClient();
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();

  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form data
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dob: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    system: true,
  });

  // Fetch profile data
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['customer-profile'],
    queryFn: () => customerService.getProfile(),
    staleTime: 5 * 60 * 1000,
  });

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setProfileData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
        dob: profile.dob || '',
      });
    }
  }, [profile]);

  // Password validation function
  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push('Mật khẩu phải có ít nhất 8 ký tự');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 số');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*...)');
    }

    return errors;
  };

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data) => customerService.changePassword(data),
    onSuccess: () => {
      showAlert('Đã đổi mật khẩu thành công!', 'success');
      setIsChangingPassword(false);
    },
    onError: (error) => {
      console.error('Password change error:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Có lỗi xảy ra khi đổi mật khẩu';

      const errorLower = errorMessage.toLowerCase();
      if (errorLower.includes('invalid old password') ||
        errorLower.includes('mật khẩu hiện tại') ||
        errorLower.includes('current password') ||
        errorLower.includes('old password') ||
        errorLower.includes('sai') ||
        errorLower.includes('incorrect') ||
        errorLower.includes('invalid') ||
        error.response?.status === 401) {
        showAlert('Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại!', 'error');
      } else if (errorLower.includes('unauthorized')) {
        showAlert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!', 'error');
      } else if (errorLower.includes('password') && errorLower.includes('match')) {
        showAlert('Mật khẩu mới và xác nhận không khớp', 'error');
      } else {
        showAlert(errorMessage, 'error');
      }
      setIsChangingPassword(false);
    },
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword')?.trim() || '';
    const newPassword = formData.get('newPassword')?.trim() || '';
    const confirmPassword = formData.get('confirmPassword')?.trim() || '';

    // Validation
    if (!currentPassword) {
      showAlert('Vui lòng nhập mật khẩu hiện tại', 'error');
      return;
    }

    if (!newPassword) {
      showAlert('Vui lòng nhập mật khẩu mới', 'error');
      return;
    }

    if (currentPassword === newPassword) {
      showAlert('Mật khẩu mới không được trùng với mật khẩu hiện tại', 'error');
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      showAlert(passwordErrors[0], 'error');
      return;
    }

    if (!confirmPassword) {
      showAlert('Vui lòng xác nhận mật khẩu mới', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('Mật khẩu xác nhận không khớp với mật khẩu mới', 'error');
      return;
    }

    setIsChangingPassword(true);
    changePasswordMutation.mutate({
      oldPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    });
    e.target.reset();
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoadingProfile) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Alert Messages */}
      {alertMessage && (
        <Alert
          key={`alert-${alertMessage}`}
          variant={alertType}
          dismissible
          position="toast"
          onDismiss={hideAlert}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Profile Information */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <User className="mr-3 w-5 h-5" />
          Thông tin cá nhân
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Họ và tên
            </label>
            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800">
              {profileData.fullName || 'Chưa cập nhật'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800">
              {profileData.email || 'Chưa cập nhật'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Số điện thoại
            </label>
            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800">
              {profileData.phoneNumber || 'Chưa cập nhật'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Ngày sinh
            </label>
            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800">
              {profileData.dob ? new Date(profileData.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
            </div>
          </div>
          {profile?.role && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Vai trò
              </label>
              <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                  {profile.role === 'CVA' || profile.role === 'VERIFIER' ? 'Tổ chức kiểm toán (CVA)' : profile.role}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Lock className="mr-3 w-5 h-5" />
          Đổi mật khẩu
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                placeholder="Nhập mật khẩu hiện tại"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Mật khẩu mới <span className="text-red-500">*</span>
                <button
                  type="button"
                  onClick={() => setShowPasswordRequirements(!showPasswordRequirements)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Info className="w-4 h-4" />
                </button>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="Nhập mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {showPasswordRequirements && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-semibold text-sm text-blue-800 mb-1">Yêu cầu mật khẩu:</p>
                  <ul className="list-disc list-inside text-xs text-blue-700 space-y-0.5">
                    <li>Tối thiểu 8 ký tự</li>
                    <li>Có ít nhất 1 chữ hoa (A-Z)</li>
                    <li>Có ít nhất 1 chữ thường (a-z)</li>
                    <li>Có ít nhất 1 số (0-9)</li>
                    <li>Có ít nhất 1 ký tự đặc biệt (!@#$%^&*...)</li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isChangingPassword || changePasswordMutation.isPending}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChangingPassword || changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </>
              )}
            </button>
          </div>
        </form>
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

