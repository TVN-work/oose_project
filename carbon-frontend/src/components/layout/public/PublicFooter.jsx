import { Link } from 'react-router-dom';
import './PublicFooter.css';

const PublicFooter = () => {
  return (
    <footer className="public-footer bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 gradient-green rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">🌱</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Carbon Credit</h3>
                <p className="text-sm text-gray-400">Marketplace</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Nền tảng giao dịch tín chỉ carbon đầu tiên dành cho chủ sở hữu xe điện. Kết nối công nghệ và bền vững.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-green transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-400 hover:text-primary-green transition-colors">
                  Thị trường
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-primary-green transition-colors">
                  Cách hoạt động
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-green transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Chính sách</h4>
            <ul className="space-y-2">
              <li>
                <a href="#terms" className="text-gray-400 hover:text-primary-green transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-gray-400 hover:text-primary-green transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-400 hover:text-primary-green transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-green transition-colors">
                  Hỗ trợ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-400 mb-4">
              <li className="flex items-center">
                <span className="mr-2">📧</span>
                <span>contact@carbonmarketplace.com</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                <span>+84 123 456 789</span>
              </li>
            </ul>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-green transition-colors">
                <span className="text-2xl">💼</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-green transition-colors">
                <span className="text-2xl">📘</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-green transition-colors">
                <span className="text-2xl">📧</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Carbon Credit Marketplace. Tất cả quyền được bảo lưu.{' '}
            <span className="text-primary-green ml-2">Phát triển bền vững cho tương lai xanh 🌱</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;

