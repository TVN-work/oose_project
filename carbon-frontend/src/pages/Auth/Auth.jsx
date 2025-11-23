import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  Building2, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  CheckCircle2, 
  Shield, 
  BarChart3, 
  Loader2,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert';
import { useAlert } from '../../hooks/useAlert';
import authService from '../../services/auth/authService';
import './Auth.css';

const Auth = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('ev-owner');
  const [currentForm, setCurrentForm] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();

  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const openAuthModal = (role, formType) => {
    setCurrentRole(role);
    setCurrentForm(formType);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    // Reset signup form
    setSignupData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
  };

  const toggleAuthForm = (formType) => {
    setCurrentForm(formType);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const password = formData.get('password');

      if (!email || !password) {
        showAlert('Vui lòng nhập đầy đủ email và mật khẩu!', 'error');
        setIsLoading(false);
        return;
      }

      const response = await login({
        email: email,
        password: password,
      });

      setIsLoading(false);
      showAlert(`Đăng nhập thành công!`, 'success');
      closeAuthModal();

      // Navigate based on user's actual role from API response
      setTimeout(() => {
        const userData = response.data || response;
        const userRole = userData.role || userData.user?.role;

        if (userRole === 'EV_OWNER') {
          navigate('/ev-owner/dashboard');
        } else if (userRole === 'BUYER') {
          navigate('/buyer/dashboard');
        } else if (userRole === 'VERIFIER') {
          navigate('/verifier/dashboard');
        } else if (userRole === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          // Default fallback based on selected role in UI
          if (currentRole === 'ev-owner') {
            navigate('/ev-owner/dashboard');
          } else if (currentRole === 'buyer') {
            navigate('/buyer/dashboard');
          } else if (currentRole === 'verifier') {
            navigate('/verifier/dashboard');
          } else if (currentRole === 'admin') {
            navigate('/admin/dashboard');
          }
        }
      }, 500);
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error?.response?.data?.message || error?.message || 'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.';
      showAlert(errorMessage, 'error');
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate passwords match
      if (signupData.password !== signupData.confirmPassword) {
        showAlert('Mật khẩu xác nhận không khớp!', 'error');
        setIsLoading(false);
        return;
      }

      const roleKey = currentRole === 'ev-owner' ? 'EV_OWNER' : 'BUYER';

      // Register via auth service
      try {
        await authService.register({
          email: signupData.email,
          fullName: signupData.fullName,
          phone: signupData.phone,
          password: signupData.password,
          role: roleKey,
        });
      } catch (registerError) {
        // Handle registration errors
        if (registerError?.response?.status === 409) {
          showAlert('Email này đã được sử dụng! Vui lòng sử dụng email khác hoặc đăng nhập.', 'error');
        } else {
          const errorMessage = registerError?.response?.data?.message || registerError?.message || 'Đăng ký thất bại! Vui lòng thử lại.';
          showAlert(errorMessage, 'error');
        }
        setIsLoading(false);
        return;
      }

      // Auto login after successful signup
      try {
        await login({
          email: signupData.email,
          password: signupData.password,
        });

        setIsLoading(false);
        showAlert(`Đăng ký thành công! Chào mừng ${currentRole === 'ev-owner' ? 'EV Owner' : 'Buyer'} mới!`, 'success');
        closeAuthModal();

        // Navigate to dashboard after successful signup and login
        setTimeout(() => {
          if (currentRole === 'ev-owner') {
            navigate('/ev-owner/dashboard');
          } else if (currentRole === 'buyer') {
            navigate('/buyer/dashboard');
          }
        }, 500);
      } catch (loginError) {
        console.error('Auto login after signup failed:', loginError);
        // If auto login fails, still show success but ask user to login manually
        setIsLoading(false);
        showAlert('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.', 'success');
        toggleAuthForm('login');
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error?.response?.data?.message || error?.message || 'Đăng ký thất bại! Vui lòng thử lại.';
      showAlert(errorMessage, 'error');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Carbon Credit Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nền tảng giao dịch tín chỉ carbon cho chủ sở hữu xe điện và người mua tín chỉ
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* EV Owner Card */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-8 hover:shadow-xl hover:border-green-500 transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Car className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Chủ sở hữu xe điện</h2>
              <p className="text-gray-600 leading-relaxed">
                Tạo và bán tín chỉ carbon từ việc sử dụng xe điện của bạn.
                Kiếm thu nhập từ việc bảo vệ môi trường.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Tạo tín chỉ carbon từ hành trình xe điện</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Theo dõi thu nhập từ bán tín chỉ</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Quản lý hồ sơ xe và chứng nhận</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Nhận thông báo về giá thị trường</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => openAuthModal('ev-owner', 'login')}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Đăng nhập
              </button>
              <button
                onClick={() => openAuthModal('ev-owner', 'signup')}
                className="w-full bg-transparent border-2 border-green-600 text-green-600 py-3 px-6 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Đăng ký
              </button>
            </div>

            <div className="mt-6 p-3 bg-green-50 rounded-lg">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <HelpCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Cần có xe điện và giấy tờ chứng minh sở hữu để đăng ký</span>
              </div>
            </div>
          </div>

          {/* Buyer Card */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-8 hover:shadow-xl hover:border-blue-500 transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Người mua tín chỉ carbon</h2>
              <p className="text-gray-600 leading-relaxed">
                Mua tín chỉ carbon để bù đắp phát thải CO₂ của doanh nghiệp hoặc cá nhân.
                Đóng góp vào mục tiêu Net Zero.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Mua tín chỉ carbon đã xác minh</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Theo dõi danh mục tín chỉ sở hữu</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Nhận chứng nhận bù đắp carbon</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Tham gia đấu giá tín chỉ premium</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => openAuthModal('buyer', 'login')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Đăng nhập
              </button>
              <button
                onClick={() => openAuthModal('buyer', 'signup')}
                className="w-full bg-transparent border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Đăng ký
              </button>
            </div>

            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Dành cho doanh nghiệp và cá nhân muốn bù đắp carbon</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login/Signup Modal */}
      {authModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeAuthModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-y-auto auth-modal-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentForm === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                </h2>
                <p className="text-gray-600 mt-1 text-sm">
                  {currentForm === 'login' 
                    ? 'Truy cập vào tài khoản của bạn'
                    : 'Tạo tài khoản mới'
                  }
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5">
                {/* Role Badge */}
                <div className="text-center mb-5">
                  <div className={`w-14 h-14 mx-auto ${currentRole === 'ev-owner' ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mb-2.5`}>
                    {currentRole === 'ev-owner' ? (
                      <Car className="w-7 h-7 text-green-600" />
                    ) : (
                      <Building2 className="w-7 h-7 text-blue-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentRole === 'ev-owner' 
                      ? 'Chủ sở hữu xe điện'
                      : 'Người mua tín chỉ carbon'
                    }
                  </div>
                </div>

              {/* Login Form */}
              {currentForm === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-0 bg-transparent border-0 focus:outline-none focus:ring-0"
                        title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                    </label>
                    <a href="#" className="text-sm text-green-600 hover:underline">Quên mật khẩu?</a>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang đăng nhập...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        Đăng nhập
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Signup Form */}
              {currentForm === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-4" autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true">
                  {/* Hidden fields to trick password managers */}
                  <input type="text" name="username" autoComplete="username" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} tabIndex={-1} readOnly />
                  <input type="password" name="password" autoComplete="current-password" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} tabIndex={-1} readOnly />

                  {/* Basic Information - 2 columns */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={signupData.fullName}
                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                        placeholder="Nguyễn Văn A"
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                        placeholder="0123 456 789"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* Email - Full width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                      placeholder="your.email@example.com"
                      autoComplete="off"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-bwignore="true"
                      name="signup-email"
                      id="signup-email-field"
                    />
                  </div>

                  {/* Password - 2 columns */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          data-lpignore="true"
                          data-1p-ignore="true"
                          data-bwignore="true"
                          data-form-type="other"
                          name="new-password"
                          id="new-password-field"
                          spellCheck="false"
                          autoCapitalize="off"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-0 bg-transparent border-0 focus:outline-none focus:ring-0"
                          title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Xác nhận mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          data-lpignore="true"
                          data-1p-ignore="true"
                          data-bwignore="true"
                          data-form-type="other"
                          name="confirm-new-password"
                          id="confirm-new-password-field"
                          spellCheck="false"
                          autoCapitalize="off"
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

                  <div className="flex items-start gap-2 pt-2">
                    <input type="checkbox" required className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-600">
                      Tôi đồng ý với <a href="#" className="text-green-600 hover:underline">Điều khoản sử dụng</a> và <a href="#" className="text-green-600 hover:underline">Chính sách bảo mật</a>
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang tạo tài khoản...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Đăng ký tài khoản
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Toggle between Login/Signup */}
              <div className="text-center mt-5">
                {currentForm === 'login' ? (
                  <div>
                    <span className="text-gray-600">Chưa có tài khoản? </span>
                    <button onClick={() => toggleAuthForm('signup')} className="text-green-600 font-semibold hover:underline">
                      Đăng ký ngay
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-gray-600">Đã có tài khoản? </span>
                    <button onClick={() => toggleAuthForm('login')} className="text-green-600 font-semibold hover:underline">
                      Đăng nhập
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
