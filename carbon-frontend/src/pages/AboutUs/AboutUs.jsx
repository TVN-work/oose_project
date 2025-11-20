import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
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


  // Welcome message on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success('🌱 Chào mừng đến với trang Giới thiệu!', {
        duration: 4000,
        icon: '🌱',
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  const exploreHowItWorks = () => {
    toast.loading('🔍 Khám phá cách hoạt động...', { id: 'explore' });
    setTimeout(() => {
      toast.success('💡 Cuộn xuống để tìm hiểu thêm về quy trình!', { id: 'explore' });
    }, 1000);
  };

  const registerPlatform = () => {
    toast.loading('🌱 Đăng ký tham gia nền tảng...', { id: 'register-platform' });
    setTimeout(() => {
      toast.success('🎉 Cảm ơn bạn đã quan tâm! Chúng tôi sẽ liên hệ sớm.', { id: 'register-platform' });
    }, 1500);
  };

  const contactUs = () => {
    toast.loading('📞 Liên hệ tư vấn...', { id: 'contact' });
    setTimeout(() => {
      toast.success('✅ Đội ngũ tư vấn sẽ liên hệ với bạn trong 24h!', { id: 'contact' });
    }, 1500);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="about-hero" className="hero-bg min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-white slide-in-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Vì một tương lai 
                <span className="text-yellow-300"> xanh hơn</span> cùng 
                <span className="text-blue-200"> Carbon Credit Marketplace</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
                Chúng tôi xây dựng nền tảng kết nối giữa chủ xe điện, doanh nghiệp và tổ chức xác minh carbon – 
                cùng hướng tới mục tiêu phát thải ròng bằng 0 (Net Zero).
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={exploreHowItWorks} className="bg-white text-primary-green px-8 py-4 rounded-lg font-bold text-lg btn-hover shadow-lg">
                  🔍 Khám phá cách chúng tôi hoạt động
                </button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="slide-in-right">
              <div className="relative">
                {/* EV and Planet Illustration */}
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
                  <div className="text-center mb-6">
                    <div className="flex justify-center items-center space-x-8 mb-4">
                      <div className="ev-car floating"></div>
                      <div className="text-4xl text-white">+</div>
                      <div className="planet floating" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Xe điện + Hành tinh xanh</h3>
                    <p className="text-gray-200">Kết nối công nghệ và bền vững</p>
                  </div>
                  
                  {/* Values Preview */}
                  <div className="space-y-3">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center">
                      <span className="text-2xl mr-3">🌱</span>
                      <span className="text-white text-sm">Minh bạch trong mọi giao dịch</span>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center">
                      <span className="text-2xl mr-3">🤝</span>
                      <span className="text-white text-sm">Kết nối cộng đồng xanh</span>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center">
                      <span className="text-2xl mr-3">🎯</span>
                      <span className="text-white text-sm">Hướng tới Net Zero 2050</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center floating pulse-green" style={{ animationDelay: '0.5s' }}>
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center floating" style={{ animationDelay: '1s' }}>
                  <span className="text-xl">⚡</span>
                </div>
                <div className="absolute top-1/2 -left-8 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center floating" style={{ animationDelay: '1.5s' }}>
                  <span className="text-lg">🌍</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission-vision" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sứ Mệnh & Tầm Nhìn</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Định hướng và mục tiêu dài hạn của Carbon Credit Marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="animate-on-scroll mission-card green">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto gradient-green rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl text-white">🌱</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ Mệnh</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed text-center">
                Tạo ra hệ sinh thái minh bạch giúp mỗi chủ xe điện có thể biến hành trình xanh của mình 
                thành giá trị thật thông qua tín chỉ carbon. Chúng tôi tin rằng mỗi km di chuyển bằng xe điện 
                đều có ý nghĩa và xứng đáng được ghi nhận.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span className="flex items-center"><span className="text-green-500 mr-1">✓</span> Minh bạch</span>
                  <span className="flex items-center"><span className="text-green-500 mr-1">✓</span> Bền vững</span>
                  <span className="flex items-center"><span className="text-green-500 mr-1">✓</span> Công bằng</span>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="animate-on-scroll mission-card blue" style={{ animationDelay: '0.1s' }}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto gradient-blue rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl text-white">🌏</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Tầm Nhìn</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed text-center">
                Trở thành nền tảng giao dịch carbon hàng đầu Đông Nam Á, thúc đẩy sự phát triển của giao thông xanh 
                và năng lượng sạch. Đến năm 2030, chúng tôi mong muốn kết nối 1 triệu chủ xe điện trong khu vực.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span className="flex items-center"><span className="text-blue-500 mr-1">🎯</span> Đông Nam Á</span>
                  <span className="flex items-center"><span className="text-blue-500 mr-1">🎯</span> 1M xe điện</span>
                  <span className="flex items-center"><span className="text-blue-500 mr-1">🎯</span> 2030</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section id="problem-solution" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Vấn Đề & Giải Pháp</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tại sao thế giới cần một thị trường carbon minh bạch và Carbon Credit Marketplace ra đời như thế nào
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Problem */}
            <div className="animate-on-scroll problem-solution-card">
              <div className="text-6xl mb-6 text-red-500">🚗</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Vấn đề hiện tại</h3>
              <p className="text-gray-600 mb-4">
                Phát thải từ giao thông chiếm hơn <strong>25%</strong> tổng lượng CO₂ toàn cầu. 
                Thiếu cơ chế ghi nhận và thương mại hóa giá trị giảm phát thải từ xe điện.
              </p>
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <strong>Thách thức:</strong> Không minh bạch, khó tiếp cận, thiếu động lực
              </div>
            </div>

            {/* Opportunity */}
            <div className="animate-on-scroll problem-solution-card" style={{ animationDelay: '0.1s' }}>
              <div className="text-6xl mb-6 text-blue-500">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cơ hội xe điện</h3>
              <p className="text-gray-600 mb-4">
                Với xe điện, chúng ta có thể giảm đáng kể lượng phát thải, nhưng chưa có cơ chế 
                ghi nhận và thương mại hóa giá trị này một cách hiệu quả.
              </p>
              <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                <strong>Tiềm năng:</strong> Hàng triệu xe điện, hàng tỷ km xanh
              </div>
            </div>

            {/* Solution */}
            <div className="animate-on-scroll problem-solution-card" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl mb-6 text-green-500">🌿</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Giải pháp của chúng tôi</h3>
              <p className="text-gray-600 mb-4">
                Carbon Credit Marketplace ra đời để giúp người dùng ghi nhận, xác minh và giao dịch 
                lượng CO₂ giảm phát thải — minh bạch, hiệu quả, và bền vững.
              </p>
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <strong>Kết quả:</strong> Thu nhập xanh, môi trường sạch
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 gradient-light-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lợi Ích Nổi Bật</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Giá trị mà Carbon Credit Marketplace mang lại cho từng nhóm người dùng
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* EV Owners */}
            <div className="animate-on-scroll benefit-card">
              <div className="text-6xl mb-6">🚗</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chủ xe điện (EV Owner)</h3>
              <p className="text-gray-600 mb-6">
                Theo dõi lượng CO₂ giảm, nhận tín chỉ và tạo thêm thu nhập từ việc lái xe sạch.
              </p>
              <ul className="text-sm text-gray-600 space-y-3 text-left">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Theo dõi tự động lượng CO₂ giảm phát thải</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Nhận tín chỉ carbon được xác minh</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Tạo thu nhập thụ động từ xe điện</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Góp phần bảo vệ môi trường</span>
                </li>
              </ul>
            </div>

            {/* Buyers */}
            <div className="animate-on-scroll benefit-card" style={{ animationDelay: '0.1s' }}>
              <div className="text-6xl mb-6">🏢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Người mua tín chỉ (Buyer)</h3>
              <p className="text-gray-600 mb-6">
                Mua tín chỉ để bù đắp phát thải và đạt mục tiêu ESG, phát triển bền vững.
              </p>
              <ul className="text-sm text-gray-600 space-y-3 text-left">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">✓</span>
                  <span>Tìm kiếm tín chỉ chất lượng cao</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">✓</span>
                  <span>So sánh giá cả minh bạch</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">✓</span>
                  <span>Đạt mục tiêu Net Zero</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">✓</span>
                  <span>Nhận chứng nhận bù đắp carbon</span>
                </li>
              </ul>
            </div>

            {/* CVA */}
            <div className="animate-on-scroll benefit-card" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tổ chức xác minh (CVA)</h3>
              <p className="text-gray-600 mb-6">
                Đảm bảo tính minh bạch và xác thực của tín chỉ carbon trong hệ thống.
              </p>
              <ul className="text-sm text-gray-600 space-y-3 text-left">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">✓</span>
                  <span>Xác minh dữ liệu chính xác</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">✓</span>
                  <span>Cấp chứng nhận tín chỉ</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">✓</span>
                  <span>Kiểm toán định kỳ hệ thống</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">✓</span>
                  <span>Đảm bảo chất lượng cao</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Trust Section */}
      <section id="technology" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Công Nghệ & Độ Tin Cậy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nền tảng kỹ thuật hiện đại đảm bảo tính minh bạch, bảo mật và hiệu quả
            </p>
          </div>

          {/* Technology Overview */}
          <div className="mb-16 animate-on-scroll">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Kiến Trúc Hệ Thống</h3>
                <p className="text-gray-600">Sơ đồ tổng quan về cách các thành phần kỹ thuật hoạt động</p>
              </div>
              
              {/* System Diagram */}
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 gradient-green rounded-full flex items-center justify-center mb-2">
                    <span className="text-white text-2xl">🚗</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Xe điện</span>
                </div>
                
                <div className="text-2xl text-gray-400">→</div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 gradient-blue rounded-full flex items-center justify-center mb-2">
                    <span className="text-white text-2xl">📱</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">API Sync</span>
                </div>
                
                <div className="text-2xl text-gray-400">→</div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white text-2xl">🧠</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">AI Processing</span>
                </div>
                
                <div className="text-2xl text-gray-400">→</div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white text-2xl">🔗</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Blockchain</span>
                </div>
                
                <div className="text-2xl text-gray-400">→</div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 gradient-green rounded-full flex items-center justify-center mb-2">
                    <span className="text-white text-2xl">🏪</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Marketplace</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="animate-on-scroll tech-card">
              <div className="text-4xl mb-4">🔧</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Microservice</h4>
              <p className="text-gray-600 text-sm">
                Kiến trúc microservice đảm bảo khả năng mở rộng và bảo trì dễ dàng.
              </p>
            </div>

            <div className="animate-on-scroll tech-card" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl mb-4">🔗</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Blockchain</h4>
              <p className="text-gray-600 text-sm">
                Công nghệ blockchain mô phỏng đảm bảo tính minh bạch và bất biến.
              </p>
            </div>

            <div className="animate-on-scroll tech-card" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">AI Pricing</h4>
              <p className="text-gray-600 text-sm">
                AI đề xuất giá thông minh dựa trên thị trường và xu hướng carbon.
              </p>
            </div>

            <div className="animate-on-scroll tech-card" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Bảo mật</h4>
              <p className="text-gray-600 text-sm">
                Dữ liệu được mã hóa và lưu trữ an toàn với các tiêu chuẩn cao nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Partners Section */}
      <section id="team-partners" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Team */}
          <div className="mb-20">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Đội Ngũ</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Những con người đam mê công nghệ và môi trường, cùng xây dựng tương lai xanh
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="animate-on-scroll team-card">
                <div className="team-avatar gradient-green">👨‍💼</div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Nguyễn Văn A</h4>
                <p className="text-primary-green font-medium mb-2">Business Analyst</p>
                <p className="text-gray-600 text-sm">
                  Chuyên gia phân tích kinh doanh với 8 năm kinh nghiệm trong lĩnh vực năng lượng xanh.
                </p>
              </div>

              <div className="animate-on-scroll team-card" style={{ animationDelay: '0.1s' }}>
                <div className="team-avatar gradient-blue">👨‍💻</div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Trần Thị B</h4>
                <p className="text-blue font-medium mb-2">DevOps Engineer</p>
                <p className="text-gray-600 text-sm">
                  Kỹ sư DevOps giàu kinh nghiệm trong việc xây dựng hạ tầng cloud và microservice.
                </p>
              </div>

              <div className="animate-on-scroll team-card" style={{ animationDelay: '0.2s' }}>
                <div className="team-avatar bg-purple-500">👩‍💻</div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Lê Văn C</h4>
                <p className="text-purple-600 font-medium mb-2">Frontend Engineer</p>
                <p className="text-gray-600 text-sm">
                  Chuyên gia frontend với đam mê tạo ra những trải nghiệm người dùng tuyệt vời.
                </p>
              </div>

              <div className="animate-on-scroll team-card" style={{ animationDelay: '0.3s' }}>
                <div className="team-avatar bg-orange-500">🔍</div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Phạm Thị D</h4>
                <p className="text-orange-600 font-medium mb-2">CVA Partner</p>
                <p className="text-gray-600 text-sm">
                  Đại diện tổ chức xác minh carbon với chứng chỉ quốc tế về kiểm toán môi trường.
                </p>
              </div>
            </div>
          </div>

          {/* Partners */}
          <div>
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Đối Tác</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Những đối tác chiến lược cùng chúng tôi xây dựng hệ sinh thái carbon xanh
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="animate-on-scroll partner-logo">
                <div className="text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="font-bold text-gray-900">EVN</div>
                  <div className="text-sm text-gray-600">Tập đoàn Điện lực</div>
                </div>
              </div>

              <div className="animate-on-scroll partner-logo" style={{ animationDelay: '0.1s' }}>
                <div className="text-center">
                  <div className="text-3xl mb-2">🚗</div>
                  <div className="font-bold text-gray-900">VinFast</div>
                  <div className="text-sm text-gray-600">Nhà sản xuất xe điện</div>
                </div>
              </div>

              <div className="animate-on-scroll partner-logo" style={{ animationDelay: '0.2s' }}>
                <div className="text-center">
                  <div className="text-3xl mb-2">🌱</div>
                  <div className="font-bold text-gray-900">CVA Việt Nam</div>
                  <div className="text-sm text-gray-600">Tổ chức xác minh carbon</div>
                </div>
              </div>

              <div className="animate-on-scroll partner-logo" style={{ animationDelay: '0.3s' }}>
                <div className="text-center">
                  <div className="text-3xl mb-2">🏛️</div>
                  <div className="font-bold text-gray-900">Bộ TN&MT</div>
                  <div className="text-sm text-gray-600">Cơ quan quản lý</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="final-cta" className="py-20 bg-light-green">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
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
              <button onClick={registerPlatform} className="bg-primary-green text-white px-10 py-4 rounded-lg font-bold text-xl btn-hover shadow-lg">
                🌱 Đăng ký tham gia nền tảng
              </button>
              <button onClick={contactUs} className="bg-white text-primary-green border-2 border-primary-green px-10 py-4 rounded-lg font-bold text-xl btn-hover">
                📞 Liên hệ tư vấn
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

