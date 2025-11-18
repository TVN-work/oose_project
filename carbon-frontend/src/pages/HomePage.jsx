import { Link } from 'react-router-dom';
import { Leaf, Zap, Shield, Users, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Carbon Credit Marketplace
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-green-600 transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Đăng ký
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Nền tảng giao dịch tín chỉ carbon
            <br />
            <span className="text-green-600">cho chủ sở hữu xe điện</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Chuyển đổi hành trình xe điện của bạn thành tín chỉ carbon có giá trị.
            Tham gia vào cuộc chiến chống biến đổi khí hậu và kiếm thu nhập từ
            việc giảm phát thải CO₂.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <span>Bắt đầu ngay</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition"
            >
              Đã có tài khoản?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Dành cho ai?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* EV Owner */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Chủ sở hữu xe điện
            </h4>
            <p className="text-gray-600 mb-4">
              Kết nối xe điện, tính toán CO₂ giảm phát thải, và bán tín chỉ carbon
              để kiếm thu nhập.
            </p>
            <Link
              to="/register"
              className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1"
            >
              <span>Đăng ký ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Buyer */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Người mua tín chỉ
            </h4>
            <p className="text-gray-600 mb-4">
              Mua tín chỉ carbon để bù đắp lượng phát thải và nhận chứng nhận
              giảm phát thải.
            </p>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
            >
              <span>Đăng ký ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Verifier */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Tổ chức kiểm toán
            </h4>
            <p className="text-gray-600 mb-4">
              Xác minh và phê duyệt tín chỉ carbon, đảm bảo tính minh bạch và
              chính xác.
            </p>
            <Link
              to="/register"
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
            >
              <span>Đăng ký ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Admin */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Quản trị viên
            </h4>
            <p className="text-gray-600 mb-4">
              Quản lý người dùng, giao dịch và tạo báo cáo tổng hợp cho nền tảng.
            </p>
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-700 font-medium flex items-center space-x-1"
            >
              <span>Đăng nhập</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Leaf className="w-6 h-6 text-green-400" />
              <span className="text-xl font-bold">Carbon Credit Marketplace</span>
            </div>
            <p className="text-gray-400">
              © 2025 Carbon Credit Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

