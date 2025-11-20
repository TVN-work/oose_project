import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PublicHeader.css';

const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <header className="public-header bg-white shadow-sm fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-10 h-10 gradient-green rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-xl">🌱</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Carbon Credit</h1>
                    <p className="text-xs text-gray-600">Marketplace</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" className="nav-link text-gray-900 hover:text-primary-green font-medium">
                  Trang chủ
                </Link>
                <Link to="/about" className="nav-link text-gray-600 hover:text-primary-green font-medium">
                  Giới thiệu
                </Link>
                <Link to="/marketplace" className="nav-link text-gray-600 hover:text-primary-green font-medium">
                  Thị trường tín chỉ
                </Link>
                <Link to="/how-it-works" className="nav-link text-gray-600 hover:text-primary-green font-medium">
                  Cách hoạt động
                </Link>
                <Link to="/blog" className="nav-link text-gray-600 hover:text-primary-green font-medium">
                  Tin tức
                </Link>
                <Link to="/contact" className="nav-link text-gray-600 hover:text-primary-green font-medium">
                  Liên hệ
                </Link>
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <Link
                to="/auth"
                className="bg-primary-green text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
              >
                Đăng nhập
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`mobile-menu md:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-8 h-8 gradient-green rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold">🌱</span>
                </div>
                <span className="font-bold text-gray-900">Carbon Credit</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-4">
              <Link to="/" className="block text-gray-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Trang chủ
              </Link>
              <Link to="/about" className="block text-gray-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Giới thiệu
              </Link>
              <Link to="/marketplace" className="block text-gray-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Thị trường tín chỉ
              </Link>
              <Link to="/how-it-works" className="block text-gray-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Cách hoạt động
              </Link>
              <Link to="/blog" className="block text-gray-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Tin tức
              </Link>
              <Link to="/contact" className="block text-gray-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Liên hệ
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/auth"
                  className="block w-full bg-primary-green text-white px-4 py-2 rounded-lg font-semibold text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default PublicHeader;

