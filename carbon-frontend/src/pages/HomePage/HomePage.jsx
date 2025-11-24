import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Leaf, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Car, 
  Building2, 
  Search, 
  Link2, 
  RefreshCw, 
  CheckCircle, 
  Store, 
  Users, 
  Award, 
  Globe, 
  ArrowRight,
  BarChart3,
  Lock,
  FileCheck,
  Sparkles,
  Target,
  Activity
} from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const [animatedElements, setAnimatedElements] = useState(new Set());
  const statsRef = useRef([]);

  // Smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimatedElements(prev => new Set([...prev, entry.target]));
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  // Counter animation for stats
  useEffect(() => {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const increment = target / 100;
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.ceil(current).toLocaleString() + '+';
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString() + '+';
        }
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      });

      observer.observe(counter);
    };

    counters.forEach(animateCounter);
  }, []);

  return (
    <div className="home-page bg-white">
      {/* Hero Section */}
      <section id="home" className="hero-bg min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 via-green-500/85 to-emerald-600/90"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-white slide-in-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Nền tảng giao dịch tín chỉ carbon hàng đầu</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Biến mỗi km xe điện thành{' '}
                <span className="text-yellow-300">giá trị carbon xanh</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
                Theo dõi lượng phát thải CO₂ giảm, nhận tín chỉ carbon và tham gia giao dịch minh bạch trên nền tảng blockchain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg btn-hover shadow-xl text-center flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <Zap className="w-5 h-5" />
                  Bắt đầu ngay
                </Link>
                <Link
                  to="/how-it-works"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg btn-hover text-center flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  Tìm hiểu thêm
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold">12K+</div>
                  <div className="text-sm text-gray-200">Tín chỉ đã giao dịch</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">250+</div>
                  <div className="text-sm text-gray-200">Tấn CO₂ bù đắp</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">1.2K+</div>
                  <div className="text-sm text-gray-200">Người dùng</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="slide-in-right">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-4">
                      <Car className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Xe điện → Tín chỉ Carbon</h3>
                    <p className="text-gray-200">Chuyển đổi hành trình thành giá trị</p>
                  </div>

                  {/* Process Preview */}
                  <div className="space-y-3">
                    <div className="bg-white/20 rounded-lg p-4 flex items-center gap-3 backdrop-blur-sm">
                      <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">Theo dõi tự động CO₂ giảm phát thải</span>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 flex items-center gap-3 backdrop-blur-sm">
                      <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">Nhận tín chỉ carbon được xác minh</span>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 flex items-center gap-3 backdrop-blur-sm">
                      <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">Giao dịch và tạo thu nhập</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center floating pulse-green shadow-lg">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center floating shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute top-1/2 -left-8 w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center floating shadow-lg">
                  <Globe className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lợi Ích Chính</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những giá trị cốt lõi mà Carbon Credit Marketplace mang lại cho cộng đồng xe điện
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="animate-on-scroll feature-card group">
              <div className="w-20 h-20 mx-auto gradient-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Thu nhập từ xe sạch</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Giúp chủ xe điện tạo thêm thu nhập từ việc lái xe sạch. Mỗi km di chuyển đều được quy đổi thành giá trị thực.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="animate-on-scroll feature-card group" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 mx-auto gradient-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Giảm phát thải toàn cầu</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Góp phần giảm phát thải toàn cầu thông qua việc khuyến khích sử dụng xe điện và tạo động lực cho giao thông bền vững.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="animate-on-scroll feature-card group" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 mx-auto gradient-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Giao dịch minh bạch</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Giao dịch minh bạch, xác minh bởi tổ chức độc lập (CVA). Đảm bảo tính chính xác và đáng tin cậy của mọi tín chỉ carbon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cách Hoạt Động</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quy trình đơn giản 4 bước để biến xe điện của bạn thành nguồn thu nhập xanh
            </p>
          </div>

          <div className="relative">
            {/* Connection Lines - Hidden on mobile */}
            <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-green-200 via-green-300 to-green-200"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="animate-on-scroll step-card-new group relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Car className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Đồng bộ hành trình</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Tải lên dữ liệu hành trình từ xe điện của bạn. Hệ thống tự động ghi nhận quãng đường, năng lượng tiêu thụ và thời gian di chuyển.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="animate-on-scroll step-card-new group relative" style={{ animationDelay: '0.1s' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Activity className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Tính toán CO₂</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Hệ thống tự động tính toán lượng CO₂ giảm phát thải dựa trên quãng đường và loại xe. Kết quả được quy đổi thành tín chỉ carbon theo tiêu chuẩn quốc tế.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="animate-on-scroll step-card-new group relative" style={{ animationDelay: '0.2s' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Xác minh CVA</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Tổ chức xác minh carbon (CVA) kiểm tra và xác nhận tính chính xác của dữ liệu. Sau khi được phê duyệt, tín chỉ carbon được cấp vào ví của bạn.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="animate-on-scroll step-card-new group relative" style={{ animationDelay: '0.3s' }}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                      <span className="text-white font-bold text-sm">4</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Bán trên thị trường</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Niêm yết tín chỉ carbon trên marketplace với giá bạn chọn. Bán trực tiếp hoặc đấu giá. Nhận thanh toán và tạo thu nhập từ việc lái xe sạch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 gradient-light-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cộng Đồng Người Dùng</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nền tảng kết nối 3 nhóm đối tượng chính trong hệ sinh thái carbon credit
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* EV Owners */}
            <div className="animate-on-scroll community-card-new community-card-green group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chủ xe điện (EV Owner)</h3>
              <p className="text-gray-600 mb-6">
                Chủ sở hữu xe điện tạo tín chỉ carbon từ việc giảm phát thải CO₂ và kiếm thu nhập từ giao dịch tín chỉ.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Theo dõi hành trình tự động</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Nhận tín chỉ carbon</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Bán trên thị trường</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Thu nhập thụ động</span>
                </li>
              </ul>
            </div>

            {/* Buyers */}
            <div className="animate-on-scroll community-card-new community-card-blue group" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Người mua tín chỉ (Buyer)</h3>
              <p className="text-gray-600 mb-6">
                Doanh nghiệp và tổ chức mua tín chỉ carbon để bù đắp phát thải và đạt mục tiêu phát triển bền vững.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Tìm kiếm tín chỉ chất lượng</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>So sánh giá cả minh bạch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Mua và thanh toán dễ dàng</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Nhận chứng nhận bù đắp</span>
                </li>
              </ul>
            </div>

            {/* CVA */}
            <div className="animate-on-scroll community-card-new community-card-purple group" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tổ chức xác minh (CVA)</h3>
              <p className="text-gray-600 mb-6">
                Tổ chức xác minh carbon độc lập đảm bảo tính chính xác và minh bạch của tín chỉ carbon.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Xác minh dữ liệu chính xác</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Cấp chứng nhận tín chỉ</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Kiểm toán định kỳ</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Đảm bảo chất lượng</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center animate-on-scroll">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-primary-green text-white px-8 py-4 rounded-lg font-bold text-lg btn-hover shadow-lg hover:scale-105 transition-transform"
            >
              <Leaf className="w-5 h-5" />
              Đăng ký để tham gia nền tảng
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Số Liệu & Tác Động</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những con số ấn tượng thể hiện tác động tích cực của nền tảng đến môi trường
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="animate-on-scroll stats-card group">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <div className="stat-number text-4xl font-bold text-primary-green mb-2" data-target="12000">0</div>
              <p className="text-gray-600 font-semibold text-lg">Tín chỉ carbon đã giao dịch</p>
              <p className="text-sm text-gray-500 mt-2">Và con số này đang tăng mỗi ngày</p>
            </div>

            <div className="animate-on-scroll stats-card group" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <div className="stat-number text-4xl font-bold text-primary-green mb-2" data-target="250">0</div>
              <p className="text-gray-600 font-semibold text-lg">Tấn CO₂ được bù đắp</p>
              <p className="text-sm text-gray-500 mt-2">Góp phần giảm phát thải toàn cầu</p>
            </div>

            <div className="animate-on-scroll stats-card group" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="stat-number text-4xl font-bold text-primary-green mb-2" data-target="50">0</div>
              <p className="text-gray-600 font-semibold text-lg">Tổ chức CVA tham gia</p>
              <p className="text-sm text-gray-500 mt-2">Đảm bảo xác minh chất lượng cao</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="final-cta" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <Target className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tham gia nền tảng giao dịch carbon dành cho xe điện
            </h2>
            <p className="text-xl text-gray-600 mb-4">Vì hành tinh xanh</p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Hãy là một phần của cuộc cách mạng giao thông xanh. Bắt đầu tạo thu nhập từ xe điện và góp phần bảo vệ môi trường ngay hôm nay.
            </p>

            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-primary-green text-white px-10 py-4 rounded-lg font-bold text-xl btn-hover shadow-xl hover:scale-105 transition-transform"
            >
              <Zap className="w-6 h-6" />
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
