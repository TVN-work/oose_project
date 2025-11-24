import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle,
  Award,
  TrendingUp
} from 'lucide-react';
import './PublicFooter.css';

const PublicFooter = () => {

  return (
    <footer className="public-footer bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 border-b border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-3">
            {/* Company Info */}
            <div>
              <Link to="/" className="flex items-center mb-4 group">
                <img 
                  src="/logo.png" 
                  alt="Carbon Credit Marketplace" 
                  className="w-10 h-10 mr-3 group-hover:opacity-80 transition-opacity"
                />
                <div>
                  <h3 className="text-lg font-bold">Carbon Credit</h3>
                  <p className="text-xs text-gray-400">Marketplace</p>
                </div>
              </Link>
              <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                Nền tảng giao dịch tín chỉ carbon đầu tiên dành cho chủ sở hữu xe điện.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Shield className="w-3.5 h-3.5 text-primary-green" />
                  <span>SSL</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <CheckCircle className="w-3.5 h-3.5 text-primary-green" />
                  <span>CVA</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Award className="w-3.5 h-3.5 text-primary-green" />
                  <span>ISO</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-center space-x-2">
                <a 
                  href="#" 
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-green transition-all group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-green transition-all group"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-green transition-all group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-green transition-all group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-white">
                Sản phẩm
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/marketplace" className="text-gray-400 hover:text-primary-green transition-colors text-sm block">
                    Thị trường tín chỉ
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-gray-400 hover:text-primary-green transition-colors text-sm block">
                    Cách hoạt động
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-400 hover:text-primary-green transition-colors text-sm block">
                    Tin tức & Blog
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-primary-green transition-colors text-sm block">
                    Về chúng tôi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-white">
                Hỗ trợ
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/faqs" className="text-gray-400 hover:text-primary-green transition-colors text-sm block">
                    Câu hỏi thường gặp
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-primary-green transition-colors text-sm block">
                    Liên hệ hỗ trợ
                  </Link>
                </li>
                <li>
                  <a href="#help" className="text-gray-400 hover:text-primary-green transition-colors text-sm block">
                    Trung tâm trợ giúp
                  </a>
                </li>
                <li>
                  <a href="#terms" className="text-gray-400 hover:text-primary-green transition-colors text-sm block">
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="text-gray-400 hover:text-primary-green transition-colors text-sm block">
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-white">
                Liên hệ
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                  <div>
                    <a href="mailto:contact@carbonmarketplace.com" className="text-gray-400 hover:text-primary-green transition-colors text-sm block">
                      contact@carbonmarketplace.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                  <div>
                    <a href="tel:+84123456789" className="text-gray-400 hover:text-primary-green transition-colors text-sm block">
                      +84 123 456 789
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm">
                      Hà Nội, Việt Nam
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-gray-400">
              <p>© 2025 Carbon Credit Marketplace. Tất cả quyền được bảo lưu.</p>
              <div className="flex items-center gap-4">
                <a href="#terms" className="hover:text-primary-green transition-colors">
                  Điều khoản
                </a>
                <span className="text-gray-600">|</span>
                <a href="#privacy" className="hover:text-primary-green transition-colors">
                  Bảo mật
                </a>
                <span className="text-gray-600">|</span>
                <a href="#cookies" className="hover:text-primary-green transition-colors">
                  Cookies
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <TrendingUp className="w-4 h-4 text-primary-green" />
              <span>Phát triển bền vững cho tương lai xanh</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
