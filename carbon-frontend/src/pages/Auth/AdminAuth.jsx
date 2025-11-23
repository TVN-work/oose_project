import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Mail, 
  Loader2,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert';
import { useAlert } from '../../hooks/useAlert';
import './Auth.css';

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();

  // Determine role from URL path
  const isAdmin = location.pathname.includes('/admin/login');
  const isVerifier = location.pathname.includes('/verifier/login');
  const roleType = isAdmin ? 'Admin' : 'CVA';
  const roleColor = isAdmin ? 'red' : 'purple';
  const roleGradient = isAdmin 
    ? 'from-red-500 to-red-600' 
    : 'from-purple-500 to-purple-600';
  const roleBgColor = isAdmin ? 'bg-red-50' : 'bg-purple-50';
  const roleTextColor = isAdmin ? 'text-red-600' : 'text-purple-600';
  const roleBorderColor = isAdmin ? 'border-red-200' : 'border-purple-200';
  const roleButtonColor = isAdmin 
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
    : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500';

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim()) {
      showAlert('Vui lòng nhập email', 'error');
      return;
    }
    
    if (!password.trim()) {
      showAlert('Vui lòng nhập mật khẩu', 'error');
      return;
    }

    setIsLoading(true);
    hideAlert();

    try {
      const response = await login({
        email: email.trim(),
        password: password,
      });

      setIsLoading(false);
      showAlert('Đăng nhập thành công!', 'success');

      // Navigate based on user's actual role from API response
      setTimeout(() => {
        const userData = response.data || response;
        const userRole = userData.role || userData.user?.role || userData.user?.roles;

        if (userRole === 'VERIFIER' || userRole === 'CVA') {
          navigate('/verifier/dashboard');
        } else if (userRole === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          // If role doesn't match, show error
          showAlert('Bạn không có quyền truy cập trang này!', 'error');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      }, 500);
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error?.response?.data?.message || error?.message || 'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.';
      showAlert(errorMessage, 'error');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${roleGradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng nhập {roleType}
          </h2>
          <p className="text-gray-600 text-sm">
            {isAdmin 
              ? 'Quản trị viên hệ thống Carbon Credit Marketplace' 
              : 'Tổ chức kiểm toán và xác minh carbon'}
          </p>
        </div>

        {/* Alert */}
        {alertMessage && (
          <Alert
            message={alertMessage}
            type={alertType}
            onClose={hideAlert}
          />
        )}

        {/* Login Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  placeholder="admin@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  placeholder="Nhập mật khẩu của bạn"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <button
                type="button"
                onClick={() => showAlert('Vui lòng liên hệ quản trị viên để đặt lại mật khẩu', 'info')}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                disabled={isLoading}
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className={`w-full ${roleButtonColor} text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
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

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Đây là trang đăng nhập dành riêng cho {roleType.toLowerCase()}. 
                Nếu bạn không phải {roleType.toLowerCase()}, vui lòng{' '}
                <Link to="/" className="text-blue-600 hover:underline">
                  quay lại trang chủ
                </Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Link>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Carbon Credit Marketplace. Bảo mật và quyền riêng tư.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
