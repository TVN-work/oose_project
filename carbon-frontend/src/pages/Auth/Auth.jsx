import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Auth.css';

const Auth = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('ev-owner');
  const [currentForm, setCurrentForm] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);


  // Welcome message on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success('🏠 Chào mừng đến với Carbon Credit Marketplace!', {
        duration: 4000,
        icon: '🌱',
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const openAuthModal = (role, formType) => {
    setCurrentRole(role);
    setCurrentForm(formType);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const toggleAuthForm = (formType) => {
    setCurrentForm(formType);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`✅ Đăng nhập thành công! Chào mừng ${currentRole === 'ev-owner' ? 'EV Owner' : 'Buyer'}!`);
      closeAuthModal();
      
      // Navigate to appropriate dashboard
      setTimeout(() => {
        if (currentRole === 'ev-owner') {
          navigate('/ev-owner/dashboard');
        } else {
          navigate('/buyer/dashboard');
        }
      }, 1000);
    }, 2000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`🎉 Đăng ký thành công! Chào mừng ${currentRole === 'ev-owner' ? 'EV Owner' : 'Buyer'} mới!`);
      closeAuthModal();
      
      // Show verification message
      setTimeout(() => {
        toast.success('📧 Vui lòng kiểm tra email để xác minh tài khoản!', { duration: 5000 });
      }, 1000);
    }, 3000);
  };

  const redirectToLogin = (role) => {
    openAuthModal(role, 'login');
  };

  const redirectToSignup = (role) => {
    openAuthModal(role, 'signup');
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="hero-bg min-h-screen flex items-center relative">
        {/* Particle Background */}
        <div className="particles">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 30}%`,
                width: `${4 + (i % 3)}px`,
                height: `${4 + (i % 3)}px`,
                animationDelay: `${i}s`
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          {/* Header Content */}
          <div className="text-center mb-16 slide-in-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Tham gia nền tảng 
              <span className="text-yellow-300"> Giao dịch Tín chỉ Carbon</span>
              <br />cho Chủ sở hữu Xe điện
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Đăng nhập hoặc đăng ký để bắt đầu quản lý và giao dịch tín chỉ carbon. 
              Chọn vai trò phù hợp với bạn để truy cập vào hệ thống.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">1,247</div>
                <div className="text-sm text-gray-200">EV Owners</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">856</div>
                <div className="text-sm text-gray-200">Buyers</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">3,521</div>
                <div className="text-sm text-gray-200">Tín chỉ đã bán</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">$158K</div>
                <div className="text-sm text-gray-200">Tổng giao dịch</div>
              </div>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* EV Owner Card */}
            <div className="role-card p-8 animate-on-scroll">
              <div className="text-center">
                <div className="feature-icon role-icon">
                  🚗
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Chủ sở hữu xe điện</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Tạo và bán tín chỉ carbon từ việc sử dụng xe điện của bạn. 
                  Kiếm thu nhập từ việc bảo vệ môi trường.
                </p>
              </div>
              
              {/* Benefits */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">✨ Lợi ích dành cho bạn:</h4>
                <div className="space-y-2">
                  <div className="benefit-item">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">Tạo tín chỉ carbon từ hành trình xe điện</span>
                  </div>
                  <div className="benefit-item">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">Theo dõi thu nhập từ bán tín chỉ</span>
                  </div>
                  <div className="benefit-item">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">Quản lý hồ sơ xe và chứng nhận</span>
                  </div>
                  <div className="benefit-item">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">Nhận thông báo về giá thị trường</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-4">
                <button onClick={() => redirectToLogin('ev-owner')} className="w-full bg-primary-green text-white py-4 px-6 rounded-lg font-bold text-lg btn-hover">
                  🔐 Đăng nhập EV Owner
                </button>
                <button onClick={() => redirectToSignup('ev-owner')} className="w-full bg-transparent border-2 border-primary-green text-primary-green py-4 px-6 rounded-lg font-bold text-lg btn-secondary">
                  📝 Đăng ký làm EV Owner
                </button>
              </div>
              
              {/* Quick Info */}
              <div className="mt-6 p-4 bg-light-green rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">💡</span>
                  <span>Cần có xe điện và giấy tờ chứng minh sở hữu để đăng ký</span>
                </div>
              </div>
            </div>

            {/* Buyer Card */}
            <div className="role-card p-8 animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="text-center">
                <div className="feature-icon role-icon">
                  🏢
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Người mua tín chỉ carbon</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Mua tín chỉ carbon để bù đắp phát thải CO₂ của doanh nghiệp hoặc cá nhân. 
                  Đóng góp vào mục tiêu Net Zero.
                </p>
              </div>
              
              {/* Benefits */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">✨ Lợi ích dành cho bạn:</h4>
                <div className="space-y-2">
                  <div className="benefit-item">
                    <span className="text-blue mr-3">✓</span>
                    <span className="text-gray-700">Mua tín chỉ carbon đã xác minh</span>
                  </div>
                  <div className="benefit-item">
                    <span className="text-blue mr-3">✓</span>
                    <span className="text-gray-700">Theo dõi danh mục tín chỉ sở hữu</span>
                  </div>
                  <div className="benefit-item">
                    <span className="text-blue mr-3">✓</span>
                    <span className="text-gray-700">Nhận chứng nhận bù đắp carbon</span>
                  </div>
                  <div className="benefit-item">
                    <span className="text-blue mr-3">✓</span>
                    <span className="text-gray-700">Tham gia đấu giá tín chỉ premium</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-4">
                <button onClick={() => redirectToLogin('buyer')} className="w-full bg-blue text-white py-4 px-6 rounded-lg font-bold text-lg btn-hover">
                  🔐 Đăng nhập Buyer
                </button>
                <button onClick={() => redirectToSignup('buyer')} className="w-full bg-transparent border-2 border-blue text-blue py-4 px-6 rounded-lg font-bold text-lg btn-secondary">
                  📝 Đăng ký làm Buyer
                </button>
              </div>
              
              {/* Quick Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">💡</span>
                  <span>Dành cho doanh nghiệp và cá nhân muốn bù đắp carbon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="text-center mt-16 animate-on-scroll" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">🔒 Bảo mật & Tin cậy</h3>
              <p className="text-gray-100 mb-6">
                Tất cả giao dịch được mã hóa và bảo mật. Tín chỉ carbon được xác minh bởi các tổ chức kiểm toán uy tín.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">🛡️</div>
                  <div className="font-semibold text-white">Bảo mật SSL</div>
                  <div className="text-sm text-gray-200">Mã hóa 256-bit</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">✅</div>
                  <div className="font-semibold text-white">Xác minh CVA</div>
                  <div className="text-sm text-gray-200">Kiểm toán độc lập</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">📊</div>
                  <div className="font-semibold text-white">Minh bạch</div>
                  <div className="text-sm text-gray-200">Theo dõi real-time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🤝 Cần hỗ trợ?</h3>
            <p className="text-lg text-gray-600 mb-8">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp bạn bắt đầu hành trình giao dịch carbon.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-3">📞</div>
                <h4 className="font-semibold text-gray-900 mb-2">Hotline hỗ trợ</h4>
                <p className="text-gray-600">1900 1234</p>
                <p className="text-sm text-gray-500">8:00 - 18:00 (T2-T6)</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-3">💬</div>
                <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
                <p className="text-gray-600">Trò chuyện trực tiếp</p>
                <p className="text-sm text-gray-500">24/7 online</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-3">📧</div>
                <h4 className="font-semibold text-gray-900 mb-2">Email hỗ trợ</h4>
                <p className="text-gray-600">support@carbonmarket.vn</p>
                <p className="text-sm text-gray-500">Phản hồi trong 2h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login/Signup Modal */}
      {authModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeAuthModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentForm === 'login' 
                      ? `Đăng nhập ${currentRole === 'ev-owner' ? 'EV Owner' : 'Buyer'}`
                      : `Đăng ký ${currentRole === 'ev-owner' ? 'EV Owner' : 'Buyer'}`
                    }
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {currentForm === 'login' 
                      ? 'Truy cập vào tài khoản của bạn'
                      : 'Tạo tài khoản mới'
                    }
                  </p>
                </div>
                <button onClick={closeAuthModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Role Icon */}
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto ${currentRole === 'ev-owner' ? 'gradient-green' : 'gradient-blue'} rounded-2xl flex items-center justify-center text-4xl mb-4`}>
                  {currentRole === 'ev-owner' ? '🚗' : '🏢'}
                </div>
                <div className="text-gray-600">
                  {currentRole === 'ev-owner' 
                    ? 'Chủ sở hữu xe điện - Tạo và bán tín chỉ carbon'
                    : 'Người mua tín chỉ carbon - Bù đắp phát thải CO₂'
                  }
                </div>
              </div>

              {/* Login Form */}
              {currentForm === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                    <input 
                      type="password" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-green focus:ring-primary-green" />
                      <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                    </label>
                    <a href="#" className="text-sm text-primary-green hover:underline">Quên mật khẩu?</a>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-primary-green text-white py-3 rounded-lg font-semibold btn-hover disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Đang đăng nhập...
                      </>
                    ) : (
                      '🔐 Đăng nhập'
                    )}
                  </button>
                </form>
              )}

              {/* Signup Form */}
              {currentForm === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                    <input 
                      type="tel" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                      placeholder="0123 456 789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                    <input 
                      type="password" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
                    <input 
                      type="password" 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                      placeholder="••••••••"
                    />
                  </div>
                  
                  {/* EV Owner specific fields */}
                  {currentRole === 'ev-owner' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Biển số xe điện</label>
                        <input 
                          type="text" 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                          placeholder="30A-12345"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hãng xe</label>
                        <select required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent">
                          <option value="">Chọn hãng xe</option>
                          <option value="vinfast">VinFast</option>
                          <option value="tesla">Tesla</option>
                          <option value="bmw">BMW</option>
                          <option value="mercedes">Mercedes</option>
                          <option value="audi">Audi</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Model xe</label>
                        <input 
                          type="text" 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                          placeholder="VF8, Model 3, iX3..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Buyer specific fields */}
                  {currentRole === 'buyer' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Loại tài khoản</label>
                        <select required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent">
                          <option value="">Chọn loại tài khoản</option>
                          <option value="individual">Cá nhân</option>
                          <option value="company">Doanh nghiệp</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên công ty (nếu có)</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                          placeholder="Công ty ABC"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mã số thuế (nếu có)</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" 
                          placeholder="0123456789"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input type="checkbox" required className="rounded border-gray-300 text-primary-green focus:ring-primary-green" />
                    <span className="ml-2 text-sm text-gray-600">
                      Tôi đồng ý với <a href="#" className="text-primary-green hover:underline">Điều khoản sử dụng</a> và <a href="#" className="text-primary-green hover:underline">Chính sách bảo mật</a>
                    </span>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-primary-green text-white py-3 rounded-lg font-semibold btn-hover disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Đang tạo tài khoản...
                      </>
                    ) : (
                      '📝 Đăng ký tài khoản'
                    )}
                  </button>
                </form>
              )}

              {/* Toggle between Login/Signup */}
              <div className="mt-6 text-center">
                {currentForm === 'login' ? (
                  <div>
                    <span className="text-gray-600">Chưa có tài khoản? </span>
                    <button onClick={() => toggleAuthForm('signup')} className="text-primary-green font-semibold hover:underline">
                      Đăng ký ngay
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-gray-600">Đã có tài khoản? </span>
                    <button onClick={() => toggleAuthForm('login')} className="text-primary-green font-semibold hover:underline">
                      Đăng nhập
                    </button>
                  </div>
                )}
              </div>

              {/* Social Login */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="mr-2">📧</span>
                    Google
                  </button>
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="mr-2">📘</span>
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;

