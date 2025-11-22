import { useState, useEffect } from 'react';
import { User, Lock, Bell, Key, Info, Loader2, Eye, EyeOff, Mail, Phone, Calendar, Save } from 'lucide-react';
import VehicleManagement from '../components/VehicleManagement';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';
import { authService } from '../../../services/auth/authService';
import { useAuth } from '../../../context/AuthContext';

const Settings = () => {
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();
  const { user, setUser } = useAuth();
  
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
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
    transaction: true,
    newCredit: true,
    withdraw: false,
    weeklyReport: true,
    monthlyReport: true,
  });
  
  // Load user data into form
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.full_name || user.name || '',
        email: user.email || '',
        phoneNumber: user.phone_number || user.phone || '',
        dob: user.dob || '',
      });
    }
  }, [user]);
  
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!profileData.fullName || profileData.fullName.trim() === '') {
      showAlert('Vui lòng nhập họ và tên', 'error');
      return;
    }
    
    if (!profileData.email || profileData.email.trim() === '') {
      showAlert('Vui lòng nhập email', 'error');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      showAlert('Email không hợp lệ', 'error');
      return;
    }
    
    setIsUpdatingProfile(true);
    try {
      const response = await authService.updateProfile({
        fullName: profileData.fullName.trim(),
        email: profileData.email.trim(),
        phoneNumber: profileData.phoneNumber.trim() || null,
        dob: profileData.dob || null,
      });
      
      // Update user in context
      if (response.user) {
        setUser(response.user);
      }
      
      showAlert('Đã cập nhật thông tin cá nhân thành công!', 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Có lỗi xảy ra khi cập nhật thông tin';
      
      // Check for specific errors
      const errorLower = errorMessage.toLowerCase();
      if (errorLower.includes('email') && errorLower.includes('exist')) {
        showAlert('Email này đã được sử dụng. Vui lòng chọn email khác!', 'error');
      } else {
        showAlert(errorMessage, 'error');
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };


  const handleChangePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword')?.trim() || '';
    const newPassword = formData.get('newPassword')?.trim() || '';
    const confirmPassword = formData.get('confirmPassword')?.trim() || '';
    
    // Validation: Mật khẩu hiện tại
    if (!currentPassword) {
      showAlert('Vui lòng nhập mật khẩu hiện tại', 'error');
      return;
    }
    
    // Validation: Mật khẩu mới
    if (!newPassword) {
      showAlert('Vui lòng nhập mật khẩu mới', 'error');
      return;
    }
    
    // Validation: Mật khẩu mới không được trùng với mật khẩu hiện tại
    if (currentPassword === newPassword) {
      showAlert('Mật khẩu mới không được trùng với mật khẩu hiện tại', 'error');
      return;
    }
    
    // Validation: Điều kiện mật khẩu mới
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      showAlert(passwordErrors[0], 'error');
      return;
    }
    
    // Validation: Xác nhận mật khẩu
    if (!confirmPassword) {
      showAlert('Vui lòng xác nhận mật khẩu mới', 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showAlert('Mật khẩu xác nhận không khớp với mật khẩu mới', 'error');
      return;
    }
    
    // Call API to change password
    setIsChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword, confirmPassword);
      showAlert('Đã đổi mật khẩu thành công!', 'success');
      e.target.reset();
    } catch (error) {
      // Handle error from backend
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Có lỗi xảy ra khi đổi mật khẩu';
      
      // Check if it's a wrong current password error
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
      } else if (errorLower.includes('password') && errorLower.includes('match')) {
        showAlert('Mật khẩu mới và xác nhận không khớp', 'error');
      } else {
        showAlert(errorMessage, 'error');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSaveNotifications = () => {
    showAlert('Đã lưu cài đặt thông báo!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Alert Messages (Toast style) */}
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
      
      {/* Profile Settings */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <User className="mr-3" />
          Thông tin cá nhân
        </h3>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                placeholder="0123 456 789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Ngày sinh
              </label>
              <input
                type="date"
                name="dob"
                value={profileData.dob}
                onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Vehicle Management Section */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
        <VehicleManagement />
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Lock className="mr-3" />
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
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="Nhập mật khẩu hiện tại"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-0 bg-transparent border-0 focus:outline-none focus:ring-0"
                title={showCurrentPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 h-6">
                Mật khẩu mới <span className="text-red-500">*</span>
                <button
                  type="button"
                  onClick={() => setShowPasswordRequirements(!showPasswordRequirements)}
                  className="text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-0"
                  title="Xem yêu cầu mật khẩu"
                >
                  <Info className="w-4 h-4" />
                </button>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                  placeholder="Nhập mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-0 bg-transparent border-0 focus:outline-none focus:ring-0"
                  title={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {showPasswordRequirements && (
                <div className="mt-2">
                  <Alert variant="info" className="py-2.5">
                    <div className="text-xs space-y-1">
                      <p className="font-semibold mb-1">Yêu cầu mật khẩu:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                        <li>Tối thiểu 8 ký tự</li>
                        <li>Có ít nhất 1 chữ hoa (A-Z)</li>
                        <li>Có ít nhất 1 chữ thường (a-z)</li>
                        <li>Có ít nhất 1 số (0-9)</li>
                        <li>Có ít nhất 1 ký tự đặc biệt (!@#$%^&*...)</li>
                      </ul>
                    </div>
                  </Alert>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 h-6">
                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-0 bg-transparent border-0 focus:outline-none focus:ring-0"
                  title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? (
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
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
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
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
            >
              <Bell className="w-4 h-4 mr-2" />
              Lưu cài đặt thông báo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

