import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../../context/AuthContext';
import { 
  Menu, 
  X, 
  LogIn,
  User,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import './PublicHeader.css';

const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext) || {};

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const getUserDashboardPath = () => {
    if (!user?.role) return '/auth';
    const role = Array.isArray(user.role) ? user.role[0] : user.role;
    switch (role) {
      case 'EV_OWNER':
        return '/ev-owner/dashboard';
      case 'BUYER':
        return '/buyer/dashboard';
      case 'CVA':
        return '/verifier/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/auth';
    }
  };

  return (
    <>
      <header className={`public-header bg-white fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="flex-shrink-0 flex items-center">
                  <img 
                    src="/logo.png" 
                    alt="Carbon Credit Marketplace" 
                    className="w-10 h-10 mr-3 group-hover:opacity-80 transition-opacity"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Carbon Credit</h1>
                    <p className="text-xs text-gray-600">Marketplace</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-1 justify-center">
              <nav className="flex items-center space-x-1">
                <Link 
                  to="/" 
                  className={`nav-link px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/') 
                      ? 'text-primary-green bg-green-50' 
                      : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                  }`}
                >
                  Trang chủ
                </Link>
                <Link 
                  to="/about" 
                  className={`nav-link px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/about') 
                      ? 'text-primary-green bg-green-50' 
                      : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                  }`}
                >
                  Giới thiệu
                </Link>
                <Link 
                  to="/marketplace" 
                  className={`nav-link px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/marketplace') 
                      ? 'text-primary-green bg-green-50' 
                      : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                  }`}
                >
                  Thị trường
                </Link>
                <Link 
                  to="/how-it-works" 
                  className={`nav-link px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/how-it-works') 
                      ? 'text-primary-green bg-green-50' 
                      : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                  }`}
                >
                  Cách hoạt động
                </Link>
                <Link 
                  to="/blog" 
                  className={`nav-link px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/blog') 
                      ? 'text-primary-green bg-green-50' 
                      : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                  }`}
                >
                  Tin tức
                </Link>
                <Link 
                  to="/contact" 
                  className={`nav-link px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/contact') 
                      ? 'text-primary-green bg-green-50' 
                      : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                  }`}
                >
                  Liên hệ
                </Link>
              </nav>
            </div>

            {/* Right Side - Auth Buttons or User Menu */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="user-menu-container relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 gradient-green rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium">{user?.name || 'User'}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      </div>
                    <Link
                      to={getUserDashboardPath()}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Cài đặt
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Đăng xuất
                    </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-primary-green text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
                >
                  Đăng nhập
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`mobile-menu lg:hidden fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <div className="flex items-center">
                <img 
                  src="/logo.png" 
                  alt="Carbon Credit Marketplace" 
                  className="w-10 h-10 mr-3"
                />
                <div>
                  <span className="font-bold text-gray-900 block">Carbon Credit</span>
                  <span className="text-xs text-gray-600">Marketplace</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              <Link 
                to="/" 
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive('/') 
                    ? 'text-primary-green bg-green-50' 
                    : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                to="/about" 
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive('/about') 
                    ? 'text-primary-green bg-green-50' 
                    : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              <Link 
                to="/marketplace" 
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive('/marketplace') 
                    ? 'text-primary-green bg-green-50' 
                    : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Thị trường tín chỉ
              </Link>
              <Link 
                to="/how-it-works" 
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive('/how-it-works') 
                    ? 'text-primary-green bg-green-50' 
                    : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Cách hoạt động
              </Link>
              <Link 
                to="/blog" 
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive('/blog') 
                    ? 'text-primary-green bg-green-50' 
                    : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Tin tức
              </Link>
              <Link 
                to="/contact" 
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive('/contact') 
                    ? 'text-primary-green bg-green-50' 
                    : 'text-gray-700 hover:text-primary-green hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                      <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to={getUserDashboardPath()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Cài đặt
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <Link
                      to="/auth"
                      className="block w-full text-center bg-primary-green text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default PublicHeader;

