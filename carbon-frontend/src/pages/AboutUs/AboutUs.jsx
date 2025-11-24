import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Globe, 
  Target, 
  Car, 
  Building2, 
  Search, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  Monitor,
  Network,
  Router,
  UserCircle,
  CheckCircle2,
  Wallet,
  Image,
  ShoppingCart,
  Receipt,
  Database,
  MessageSquare,
  Box,
  Server,
  Users,
  Handshake,
  Award,
  BarChart3,
  Activity,
  Shield,
  Zap
} from 'lucide-react';
import './AboutUs.css';

const AboutUs = () => {
  const observerRef = useRef(null);

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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="about-hero" className="hero-bg min-h-[80vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 via-blue-500/85 to-emerald-600/90"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-white slide-in-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Về chúng tôi</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Vì một tương lai{' '}
                <span className="text-yellow-300">xanh hơn</span> cùng{' '}
                <span className="text-blue-200">Carbon Credit Marketplace</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
                Nền tảng giao dịch tín chỉ carbon hàng đầu, kết nối chủ xe điện, doanh nghiệp và tổ chức xác minh carbon – 
                cùng hướng tới mục tiêu phát thải ròng bằng 0 (Net Zero).
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/how-it-works" 
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg btn-hover shadow-xl text-center flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <Activity className="w-5 h-5" />
                  Tìm hiểu cách hoạt động
                </Link>
                <Link 
                  to="/marketplace" 
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg btn-hover text-center flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Xem sàn giao dịch
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="slide-in-right">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="flex justify-center items-center gap-6 mb-4">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl">
                        <Car className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-3xl text-white font-bold">+</div>
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl">
                        <Globe className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Xe điện + Hành tinh xanh</h3>
                    <p className="text-gray-200">Kết nối công nghệ và bền vững</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white/20 rounded-lg p-4 flex items-center gap-3 backdrop-blur-sm">
                      <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">Minh bạch trong mọi giao dịch</span>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 flex items-center gap-3 backdrop-blur-sm">
                      <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">Kết nối cộng đồng xanh</span>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 flex items-center gap-3 backdrop-blur-sm">
                      <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">Hướng tới Net Zero 2050</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission-vision" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sứ Mệnh & Tầm Nhìn</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Định hướng và mục tiêu dài hạn của Carbon Credit Marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="animate-on-scroll mission-card-new mission-card-green group">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Leaf className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ Mệnh</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed text-center mb-6">
                Tạo ra hệ sinh thái minh bạch giúp mỗi chủ xe điện có thể biến hành trình xanh của mình 
                thành giá trị thật thông qua tín chỉ carbon. Chúng tôi tin rằng mỗi km di chuyển bằng xe điện 
                đều có ý nghĩa và xứng đáng được ghi nhận.
              </p>
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Minh bạch</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Bền vững</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Công bằng</span>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="animate-on-scroll mission-card-new mission-card-blue group" style={{ animationDelay: '0.1s' }}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Tầm Nhìn</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed text-center mb-6">
                Trở thành nền tảng giao dịch carbon hàng đầu Đông Nam Á, thúc đẩy sự phát triển của giao thông xanh 
                và năng lượng sạch. Đến năm 2030, chúng tôi mong muốn kết nối 1 triệu chủ xe điện trong khu vực.
              </p>
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>Đông Nam Á</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>1M xe điện</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>2030</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section id="problem-solution" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Vấn Đề & Giải Pháp</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tại sao thế giới cần một thị trường carbon minh bạch và Carbon Credit Marketplace ra đời như thế nào
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Problem */}
            <div className="animate-on-scroll problem-solution-card-new group">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors">
                <Car className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Vấn đề hiện tại</h3>
              <p className="text-gray-600 mb-4 text-center">
                Phát thải từ giao thông chiếm hơn <strong>25%</strong> tổng lượng CO₂ toàn cầu. 
                Thiếu cơ chế ghi nhận và thương mại hóa giá trị giảm phát thải từ xe điện.
              </p>
              <div className="text-sm text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
                <strong className="block mb-1">Thách thức:</strong>
                <span>Không minh bạch, khó tiếp cận, thiếu động lực</span>
              </div>
            </div>

            {/* Opportunity */}
            <div className="animate-on-scroll problem-solution-card-new group" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Cơ hội xe điện</h3>
              <p className="text-gray-600 mb-4 text-center">
                Với xe điện, chúng ta có thể giảm đáng kể lượng phát thải, nhưng chưa có cơ chế 
                ghi nhận và thương mại hóa giá trị này một cách hiệu quả.
              </p>
              <div className="text-sm text-blue-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <strong className="block mb-1">Tiềm năng:</strong>
                <span>Hàng triệu xe điện, hàng tỷ km xanh</span>
              </div>
            </div>

            {/* Solution */}
            <div className="animate-on-scroll problem-solution-card-new group" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Giải pháp của chúng tôi</h3>
              <p className="text-gray-600 mb-4 text-center">
                Carbon Credit Marketplace ra đời để giúp người dùng ghi nhận, xác minh và giao dịch 
                lượng CO₂ giảm phát thải — minh bạch, hiệu quả, và bền vững.
              </p>
              <div className="text-sm text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
                <strong className="block mb-1">Kết quả:</strong>
                <span>Thu nhập xanh, môi trường sạch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 gradient-light-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Giá Trị Cho Từng Nhóm Người Dùng</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Carbon Credit Marketplace mang lại lợi ích thiết thực cho mọi thành viên trong hệ sinh thái
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* EV Owners */}
            <div className="animate-on-scroll benefit-card-new benefit-card-green group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Chủ xe điện (EV Owner)</h3>
              <p className="text-gray-600 mb-6 text-center">
                Theo dõi lượng CO₂ giảm, nhận tín chỉ và tạo thêm thu nhập từ việc lái xe sạch.
              </p>
              <ul className="text-sm text-gray-600 space-y-3 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Theo dõi tự động lượng CO₂ giảm phát thải</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Nhận tín chỉ carbon được xác minh</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Tạo thu nhập thụ động từ xe điện</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Góp phần bảo vệ môi trường</span>
                </li>
              </ul>
            </div>

            {/* Buyers */}
            <div className="animate-on-scroll benefit-card-new benefit-card-blue group" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Người mua tín chỉ (Buyer)</h3>
              <p className="text-gray-600 mb-6 text-center">
                Mua tín chỉ để bù đắp phát thải và đạt mục tiêu ESG, phát triển bền vững.
              </p>
              <ul className="text-sm text-gray-600 space-y-3 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Tìm kiếm tín chỉ chất lượng cao</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>So sánh giá cả minh bạch</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Đạt mục tiêu Net Zero</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Nhận chứng nhận bù đắp carbon</span>
                </li>
              </ul>
            </div>

            {/* CVA */}
            <div className="animate-on-scroll benefit-card-new benefit-card-purple group" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Tổ chức xác minh (CVA)</h3>
              <p className="text-gray-600 mb-6 text-center">
                Đảm bảo tính minh bạch và xác thực của tín chỉ carbon trong hệ thống.
              </p>
              <ul className="text-sm text-gray-600 space-y-3 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Xác minh dữ liệu chính xác</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Cấp chứng nhận tín chỉ</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Kiểm toán định kỳ hệ thống</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Đảm bảo chất lượng cao</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Trust Section */}
      <section id="technology" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Công Nghệ & Độ Tin Cậy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nền tảng kỹ thuật hiện đại đảm bảo tính minh bạch, bảo mật và hiệu quả
            </p>
          </div>

          {/* Technology Overview */}
          <div className="mb-12 animate-on-scroll">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 lg:p-10 border border-gray-200 shadow-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Kiến Trúc Hệ Thống</h3>
                <p className="text-gray-600">Kiến trúc Microservices với Spring Boot và Spring Cloud</p>
              </div>
              
              {/* System Diagram */}
              <div className="space-y-6">
                {/* Layer 1: Client & API Gateway */}
                <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
                      <Monitor className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Client</span>
                    <span className="text-xs text-gray-500">Web/Mobile</span>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-gray-400 hidden lg:block" />
                  
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
                      <Router className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">API Gateway</span>
                    <span className="text-xs text-gray-500">Port 8222</span>
                  </div>
                </div>

                {/* Layer 2: Service Discovery */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
                      <Network className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Eureka Server</span>
                    <span className="text-xs text-gray-500">Port 8761</span>
                  </div>
                </div>

                {/* Layer 3: Microservices */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                      <UserCircle className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">User Service</span>
                    <span className="text-xs text-gray-500">8081</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">Vehicle Service</span>
                    <span className="text-xs text-gray-500">8082</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">Verification</span>
                    <span className="text-xs text-gray-500">8083</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">Wallet Service</span>
                    <span className="text-xs text-gray-500">8084</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                      <Image className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">Media Service</span>
                    <span className="text-xs text-gray-500">8085</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                      <ShoppingCart className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">Market Service</span>
                    <span className="text-xs text-gray-500">8086</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                      <Receipt className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">Transaction</span>
                    <span className="text-xs text-gray-500">8087</span>
                  </div>
                </div>

                {/* Layer 4: Infrastructure */}
                <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6 pt-4 border-t border-gray-300">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">PostgreSQL</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Apache Kafka</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                      <Box className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Docker</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="animate-on-scroll tech-card-new group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Box className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">Microservices</h4>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                Kiến trúc microservices với Spring Boot đảm bảo khả năng mở rộng, bảo trì dễ dàng và độc lập giữa các services.
              </p>
            </div>

            <div className="animate-on-scroll tech-card-new group" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Network className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">Service Discovery</h4>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                Eureka Server tự động quản lý và khám phá các microservices, đảm bảo giao tiếp linh hoạt và tự phục hồi.
              </p>
            </div>

            <div className="animate-on-scroll tech-card-new group" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">Event-Driven</h4>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                Apache Kafka xử lý giao tiếp bất đồng bộ giữa các services, đảm bảo tính nhất quán và hiệu suất cao.
              </p>
            </div>

            <div className="animate-on-scroll tech-card-new group" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">Bảo mật</h4>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                JWT authentication, Spring Security và API Gateway đảm bảo dữ liệu được mã hóa và bảo vệ an toàn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Partners Section */}
      <section id="team-partners" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Team */}
          <div className="mb-12">
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Đội Ngũ</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Những con người đam mê công nghệ và môi trường, cùng xây dựng tương lai xanh
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="animate-on-scroll team-card-new group">
                <div className="team-avatar-new bg-gradient-to-br from-green-500 to-green-600 mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Nguyễn An Quốc Đạt</h4>
                <p className="text-green-600 font-medium mb-2">Business Analyst</p>
                <p className="text-gray-600 text-sm text-center">
                  Chuyên gia phân tích kinh doanh với kinh nghiệm trong lĩnh vực năng lượng xanh và phát triển bền vững.
                </p>
              </div>

              <div className="animate-on-scroll team-card-new group" style={{ animationDelay: '0.1s' }}>
                <div className="team-avatar-new bg-gradient-to-br from-blue-500 to-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <Box className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Nguyễn Trọng Bằng</h4>
                <p className="text-blue-600 font-medium mb-2">DevOps Engineer</p>
                <p className="text-gray-600 text-sm text-center">
                  Kỹ sư DevOps chuyên xây dựng và vận hành hạ tầng cloud, microservices và hệ thống phân tán.
                </p>
              </div>

              <div className="animate-on-scroll team-card-new group" style={{ animationDelay: '0.2s' }}>
                <div className="team-avatar-new bg-gradient-to-br from-purple-500 to-purple-600 mb-4 group-hover:scale-110 transition-transform">
                  <Monitor className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Trịnh Văn Nam</h4>
                <p className="text-purple-600 font-medium mb-2">Frontend Engineer</p>
                <p className="text-gray-600 text-sm text-center">
                  Chuyên gia frontend với đam mê tạo ra những trải nghiệm người dùng tuyệt vời và giao diện hiện đại.
                </p>
              </div>
            </div>
          </div>

          {/* Partners */}
          <div>
            <div className="text-center mb-12 animate-on-scroll">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Đối Tác</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Những đối tác chiến lược cùng chúng tôi xây dựng hệ sinh thái carbon xanh
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="animate-on-scroll partner-logo-new group">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-bold text-gray-900">EVN</div>
                  <div className="text-sm text-gray-600">Tập đoàn Điện lực</div>
                </div>
              </div>

              <div className="animate-on-scroll partner-logo-new group" style={{ animationDelay: '0.1s' }}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-bold text-gray-900">VinFast</div>
                  <div className="text-sm text-gray-600">Nhà sản xuất xe điện</div>
                </div>
              </div>

              <div className="animate-on-scroll partner-logo-new group" style={{ animationDelay: '0.2s' }}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-bold text-gray-900">CVA Việt Nam</div>
                  <div className="text-sm text-gray-600">Tổ chức xác minh carbon</div>
                </div>
              </div>

              <div className="animate-on-scroll partner-logo-new group" style={{ animationDelay: '0.3s' }}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-bold text-gray-900">Bộ TN&MT</div>
                  <div className="text-sm text-gray-600">Cơ quan quản lý</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="final-cta" className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <Target className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cùng chúng tôi xây dựng tương lai xanh
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              Bắt đầu ngay hôm nay!
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Tham gia Carbon Credit Marketplace để trở thành một phần của cuộc cách mạng giao thông xanh. 
              Mỗi hành trình của bạn đều có ý nghĩa với hành tinh.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/how-it-works" 
                className="inline-flex items-center justify-center gap-2 bg-primary-green text-white px-10 py-4 rounded-lg font-bold text-xl btn-hover shadow-xl hover:scale-105 transition-transform"
              >
                <Activity className="w-6 h-6" />
                Tìm hiểu cách hoạt động
              </Link>
              <Link 
                to="/auth" 
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-green border-2 border-primary-green px-10 py-4 rounded-lg font-bold text-xl btn-hover hover:bg-green-50 transition-colors"
              >
                <Leaf className="w-6 h-6" />
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
