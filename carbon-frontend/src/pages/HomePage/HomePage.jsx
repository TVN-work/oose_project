import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
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
          setMobileMenuOpen(false);
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


  // Welcome message on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success('🌱 Chào mừng đến với Carbon Credit Marketplace!', {
        duration: 4000,
        icon: '🌱',
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="home-page bg-white">
      {/* Hero Section */}
      <section id="home" className="hero-bg min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-white slide-in-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Biến mỗi km xe điện thành{' '}
                <span className="text-yellow-300">giá trị carbon xanh</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
                Theo dõi lượng phát thải CO₂ giảm, nhận tín chỉ carbon và tham gia giao dịch minh bạch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="bg-white text-primary-green px-8 py-4 rounded-lg font-bold text-lg btn-hover shadow-lg text-center"
                >
                  🚀 Bắt đầu ngay
                </Link>
                <Link
                  to="/how-it-works"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg btn-hover text-center"
                >
                  📖 Tìm hiểu thêm
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="slide-in-right">
              <div className="relative">
                {/* EV Car Illustration */}
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
                  <div className="text-center mb-6">
                    <div className="ev-car floating"></div>
                    <h3 className="text-2xl font-bold text-white mb-2">Xe điện → Tín chỉ Carbon</h3>
                    <p className="text-gray-200">Chuyển đổi hành trình thành giá trị</p>
                  </div>

                  {/* Process Preview */}
                  <div className="space-y-3">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center">
                      <span className="text-2xl mr-3">📊</span>
                      <span className="text-white text-sm">Theo dõi tự động CO₂ giảm phát thải</span>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center">
                      <span className="text-2xl mr-3">🏆</span>
                      <span className="text-white text-sm">Nhận tín chỉ carbon được xác minh</span>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center">
                      <span className="text-2xl mr-3">💰</span>
                      <span className="text-white text-sm">Giao dịch và tạo thu nhập</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center floating pulse-green"
                  style={{ animationDelay: '0.5s' }}
                >
                  <span className="text-2xl">🌱</span>
                </div>
                <div
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center floating"
                  style={{ animationDelay: '1s' }}
                >
                  <span className="text-xl">⚡</span>
                </div>
                <div
                  className="absolute top-1/2 -left-8 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center floating"
                  style={{ animationDelay: '1.5s' }}
                >
                  <span className="text-lg">🌍</span>
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
            <div className="animate-on-scroll feature-card">
              <div className="w-20 h-20 mx-auto gradient-green rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl text-white">💚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Thu nhập từ xe sạch</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Giúp chủ xe điện tạo thêm thu nhập từ việc lái xe sạch. Mỗi km di chuyển đều được quy đổi thành giá trị thực.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="animate-on-scroll feature-card" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 mx-auto gradient-green rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl text-white">🌍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Giảm phát thải toàn cầu</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Góp phần giảm phát thải toàn cầu thông qua việc khuyến khích sử dụng xe điện và tạo động lực cho giao thông bền vững.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="animate-on-scroll feature-card" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 mx-auto gradient-green rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl text-white">🔒</span>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="animate-on-scroll step-card">
              <div className="step-number">1</div>
              <div className="text-6xl mb-6 mt-4">🔗</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Kết nối dữ liệu hành trình</h3>
              <p className="text-gray-600">
                Kết nối ứng dụng với xe điện của bạn để tự động theo dõi quãng đường di chuyển và mức tiêu thụ năng lượng.
              </p>
            </div>

            {/* Step 2 */}
            <div className="animate-on-scroll step-card" style={{ animationDelay: '0.1s' }}>
              <div className="step-number">2</div>
              <div className="text-6xl mb-6 mt-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quy đổi CO₂ thành tín chỉ</h3>
              <p className="text-gray-600">
                Hệ thống tự động tính toán lượng CO₂ giảm phát thải và quy đổi thành tín chỉ carbon theo tiêu chuẩn quốc tế.
              </p>
            </div>

            {/* Step 3 */}
            <div className="animate-on-scroll step-card" style={{ animationDelay: '0.2s' }}>
              <div className="step-number">3</div>
              <div className="text-6xl mb-6 mt-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Xác minh & phê duyệt</h3>
              <p className="text-gray-600">
                Tổ chức xác minh carbon độc lập (CVA) kiểm tra và xác nhận tính chính xác của tín chỉ carbon.
              </p>
            </div>

            {/* Step 4 */}
            <div className="animate-on-scroll step-card" style={{ animationDelay: '0.3s' }}>
              <div className="step-number">4</div>
              <div className="text-6xl mb-6 mt-4">🏪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Niêm yết và giao dịch</h3>
              <p className="text-gray-600">
                Niêm yết tín chỉ carbon trên thị trường và bán cho các doanh nghiệp cần bù đắp phát thải carbon.
              </p>
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
            <div className="animate-on-scroll community-card">
              <div className="text-6xl mb-6">🚗</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chủ xe điện (EV Owner)</h3>
              <p className="text-gray-600 mb-6">
                Chủ sở hữu xe điện tạo tín chỉ carbon từ việc giảm phát thải CO₂ và kiếm thu nhập từ giao dịch tín chỉ.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li>• Theo dõi hành trình tự động</li>
                <li>• Nhận tín chỉ carbon</li>
                <li>• Bán trên thị trường</li>
                <li>• Thu nhập thụ động</li>
              </ul>
            </div>

            {/* Buyers */}
            <div className="animate-on-scroll community-card" style={{ animationDelay: '0.1s' }}>
              <div className="text-6xl mb-6">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Người mua tín chỉ (Buyer)</h3>
              <p className="text-gray-600 mb-6">
                Doanh nghiệp và tổ chức mua tín chỉ carbon để bù đắp phát thải và đạt mục tiêu phát triển bền vững.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li>• Tìm kiếm tín chỉ chất lượng</li>
                <li>• So sánh giá cả minh bạch</li>
                <li>• Mua và thanh toán dễ dàng</li>
                <li>• Nhận chứng nhận bù đắp</li>
              </ul>
            </div>

            {/* CVA */}
            <div className="animate-on-scroll community-card" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tổ chức xác minh (CVA)</h3>
              <p className="text-gray-600 mb-6">
                Tổ chức xác minh carbon độc lập đảm bảo tính chính xác và minh bạch của tín chỉ carbon.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li>• Xác minh dữ liệu chính xác</li>
                <li>• Cấp chứng nhận tín chỉ</li>
                <li>• Kiểm toán định kỳ</li>
                <li>• Đảm bảo chất lượng</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center animate-on-scroll">
            <Link
              to="/auth"
              className="inline-block bg-primary-green text-white px-8 py-4 rounded-lg font-bold text-lg btn-hover shadow-lg"
            >
              🌱 Đăng ký để tham gia nền tảng
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
            <div className="animate-on-scroll stats-card">
              <div className="text-5xl mb-4">🏆</div>
              <div className="stat-number text-4xl font-bold text-primary-green mb-2" data-target="12000">0</div>
              <p className="text-gray-600 font-semibold text-lg">Tín chỉ carbon đã giao dịch</p>
              <p className="text-sm text-gray-500 mt-2">Và con số này đang tăng mỗi ngày</p>
            </div>

            <div className="animate-on-scroll stats-card" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl mb-4">🌍</div>
              <div className="stat-number text-4xl font-bold text-primary-green mb-2" data-target="250">0</div>
              <p className="text-gray-600 font-semibold text-lg">Tấn CO₂ được bù đắp</p>
              <p className="text-sm text-gray-500 mt-2">Góp phần giảm phát thải toàn cầu</p>
            </div>

            <div className="animate-on-scroll stats-card" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl mb-4">🏢</div>
              <div className="stat-number text-4xl font-bold text-primary-green mb-2" data-target="50">0</div>
              <p className="text-gray-600 font-semibold text-lg">Tổ chức CVA tham gia</p>
              <p className="text-sm text-gray-500 mt-2">Đảm bảo xác minh chất lượng cao</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="final-cta" className="py-20 bg-light-green">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tham gia nền tảng giao dịch carbon dành cho xe điện
            </h2>
            <p className="text-xl text-gray-600 mb-4">Vì hành tinh xanh</p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Hãy là một phần của cuộc cách mạng giao thông xanh. Bắt đầu tạo thu nhập từ xe điện và góp phần bảo vệ môi trường ngay hôm nay.
            </p>

            <Link
              to="/auth"
              className="inline-block bg-primary-green text-white px-10 py-4 rounded-lg font-bold text-xl btn-hover shadow-lg"
            >
              🚀 Đăng ký ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

