import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './HowItWorks.css';

const HowItWorks = () => {
  const navigate = useNavigate();
  const observerRef = useRef(null);

  const steps = [
    {
      number: 1,
      title: 'Kết nối & Thu thập dữ liệu hành trình',
      description: 'Chủ xe điện (EV Owner) kết nối dữ liệu xe hoặc tải file hành trình. Hệ thống tự động tính toán lượng CO₂ giảm phát thải so với xe xăng truyền thống.',
      icon: '🚗',
      color: 'green',
      features: [
        { title: '📱 Kết nối tự động', desc: 'API đồng bộ dữ liệu từ xe điện thông minh' },
        { title: '📊 Tính toán chính xác', desc: 'AI phân tích và so sánh với xe xăng cùng loại' },
      ],
    },
    {
      number: 2,
      title: 'Phê duyệt & Cấp tín chỉ carbon',
      description: 'Dữ liệu được gửi đến tổ chức xác minh (CVA). CVA kiểm tra, xác thực, sau đó cấp tín chỉ carbon tương ứng và ghi nhận vào ví carbon của EV Owner.',
      icon: '🔍',
      color: 'blue',
      features: [
        { title: '✅ Xác minh chuyên nghiệp', desc: 'CVA kiểm tra theo tiêu chuẩn quốc tế' },
        { title: '💳 Ví carbon cá nhân', desc: 'Tín chỉ được lưu trữ an toàn trong ví' },
      ],
    },
    {
      number: 3,
      title: 'Niêm yết & Giao dịch',
      description: 'EV Owner có thể niêm yết tín chỉ carbon để bán (theo giá cố định hoặc đấu giá). Người mua (Buyer) tìm kiếm, chọn và thanh toán trực tuyến qua ví điện tử hoặc ngân hàng.',
      icon: '🏪',
      color: 'green',
      features: [
        { title: '💰 Định giá linh hoạt', desc: 'AI gợi ý giá hoặc tự đặt giá theo ý muốn' },
        { title: '🔒 Thanh toán an toàn', desc: 'Hỗ trợ nhiều phương thức thanh toán' },
      ],
    },
    {
      number: 4,
      title: 'Chứng nhận & Báo cáo',
      description: 'Buyer nhận chứng chỉ tín chỉ carbon để dùng trong báo cáo ESG hoặc bù đắp phát thải. Hệ thống ghi nhận giao dịch minh bạch, có thể xuất báo cáo cho các bên liên quan.',
      icon: '📜',
      color: 'blue',
      features: [
        { title: '🏆 Chứng nhận quốc tế', desc: 'Được công nhận trong báo cáo ESG' },
        { title: '📈 Báo cáo chi tiết', desc: 'Xuất báo cáo tác động môi trường' },
      ],
    },
  ];

  const flowchartNodes = [
    { icon: '🚗', title: 'EV Owner', desc: 'Chủ xe điện', color: 'green', items: ['Kết nối dữ liệu xe', 'Nhận tín chỉ carbon', 'Niêm yết bán'] },
    { icon: '🔍', title: 'CVA', desc: 'Tổ chức xác minh', color: 'blue', items: ['Kiểm tra dữ liệu', 'Xác minh CO₂', 'Cấp tín chỉ'] },
    { icon: '🏪', title: 'Marketplace', desc: 'Sàn giao dịch', color: 'purple', items: ['Niêm yết tín chỉ', 'Kết nối mua bán', 'Xử lý thanh toán'] },
    { icon: '🏢', title: 'Buyer', desc: 'Người mua', color: 'orange', items: ['Tìm kiếm tín chỉ', 'Mua và thanh toán', 'Nhận chứng nhận'] },
  ];

  const technologies = [
    {
      icon: '🤖',
      title: 'AI Pricing',
      description: 'Trí tuệ nhân tạo phân tích thị trường và đề xuất giá tín chỉ carbon hợp lý dựa trên xu hướng và cung cầu.',
      benefit: 'Định giá chính xác, tối ưu lợi nhuận',
      color: 'green',
    },
    {
      icon: '🔧',
      title: 'Microservice',
      description: 'Kiến trúc microservice đảm bảo khả năng mở rộng linh hoạt, bảo trì dễ dàng và hiệu suất cao.',
      benefit: 'Ổn định, mở rộng dễ dàng',
      color: 'blue',
    },
    {
      icon: '🔗',
      title: 'Blockchain',
      description: 'Công nghệ blockchain mô phỏng đảm bảo tính minh bạch, bất biến và có thể truy xuất nguồn gốc.',
      benefit: 'Minh bạch 100%, không thể giả mạo',
      color: 'purple',
    },
    {
      icon: '🔒',
      title: 'API Bảo mật',
      description: 'API bảo mật cao với Docker Compose giúp đồng bộ dữ liệu xe điện an toàn và chính xác.',
      benefit: 'Dữ liệu an toàn, đồng bộ tự động',
      color: 'orange',
    },
  ];

  const benefits = [
    { icon: '⚡', title: 'Xử lý nhanh chóng', desc: 'Từ dữ liệu đến tín chỉ trong 24 giờ', color: 'green' },
    { icon: '🔒', title: 'Bảo mật cao', desc: 'Mã hóa SSL/TLS, tuân thủ GDPR', color: 'blue' },
    { icon: '📊', title: 'Minh bạch 100%', desc: 'Mọi giao dịch đều được ghi nhận công khai', color: 'purple' },
    { icon: '💰', title: 'Thu nhập thụ động', desc: 'Kiếm tiền từ việc sử dụng xe điện', color: 'orange' },
  ];

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
      toast.success('📋 Chào mừng đến với Hướng dẫn!', {
        duration: 4000,
        icon: '🌱',
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const scrollToSteps = () => {
    const element = document.getElementById('four-steps');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const connectEV = () => {
    navigate('/auth');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="how-it-works-hero" className="hero-bg min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-white slide-in-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Cách nền tảng 
                <span className="text-yellow-300"> Carbon Credit Marketplace</span> 
                hoạt động
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
                Từ dữ liệu hành trình của xe điện, chúng tôi giúp bạn tính toán lượng CO₂ giảm phát thải, 
                xác minh và quy đổi thành tín chỉ carbon có thể giao dịch minh bạch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={scrollToSteps} className="bg-white text-primary-green px-8 py-4 rounded-lg font-bold text-lg btn-hover shadow-lg">
                  📋 Xem quy trình 4 bước
                </button>
                <button onClick={connectEV} className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg btn-hover">
                  🚗 Kết nối xe điện ngay
                </button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="slide-in-right">
              <div className="process-illustration">
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Quy trình hoạt động tổng quan</h3>
                  </div>
                  
                  {/* Process Flow */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flowchart-node green step-flow">
                      <div className="text-3xl mb-2">🚗</div>
                      <div className="text-sm font-semibold text-gray-900">Xe điện</div>
                      <div className="text-xs text-gray-600">Dữ liệu hành trình</div>
                    </div>
                    <div className="flowchart-node blue step-flow" style={{ animationDelay: '0.5s' }}>
                      <div className="text-3xl mb-2">🔍</div>
                      <div className="text-sm font-semibold text-gray-900">Xác minh</div>
                      <div className="text-xs text-gray-600">CVA kiểm tra</div>
                    </div>
                    <div className="flowchart-node purple step-flow" style={{ animationDelay: '1s' }}>
                      <div className="text-3xl mb-2">🏪</div>
                      <div className="text-sm font-semibold text-gray-900">Thị trường</div>
                      <div className="text-xs text-gray-600">Giao dịch tín chỉ</div>
                    </div>
                    <div className="flowchart-node orange step-flow" style={{ animationDelay: '1.5s' }}>
                      <div className="text-3xl mb-2">📜</div>
                      <div className="text-sm font-semibold text-gray-900">Chứng nhận</div>
                      <div className="text-xs text-gray-600">Báo cáo ESG</div>
                    </div>
                  </div>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white bg-opacity-80 rounded-lg p-3">
                      <div className="text-2xl font-bold text-primary-green">4</div>
                      <div className="text-xs text-gray-600">Bước đơn giản</div>
                    </div>
                    <div className="bg-white bg-opacity-80 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue">24h</div>
                      <div className="text-xs text-gray-600">Xử lý nhanh</div>
                    </div>
                    <div className="bg-white bg-opacity-80 rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-600">100%</div>
                      <div className="text-xs text-gray-600">Minh bạch</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps Process Section */}
      <section id="four-steps" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quy Trình 4 Bước Chính</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Từ việc kết nối xe điện đến nhận chứng nhận carbon - quy trình đơn giản, minh bạch và hiệu quả
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.number}>
                <div className="animate-on-scroll">
                  <div className={`step-card ${step.color}`}>
                    <div className={`grid md:grid-cols-3 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                      <div className={`text-center ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                        <div className={`w-24 h-24 mx-auto ${step.color === 'green' ? 'gradient-green' : 'gradient-blue'} rounded-full flex items-center justify-center mb-4 pulse-green`}>
                          <span className="text-4xl text-white">{step.icon}</span>
                        </div>
                        <div className={`${step.color === 'green' ? 'bg-primary-green' : 'bg-blue'} text-white px-4 py-2 rounded-full text-sm font-bold inline-block`}>
                          BƯỚC {step.number}
                        </div>
                      </div>
                      <div className={`md:col-span-2 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                        <p className="text-gray-600 text-lg mb-6">{step.description}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          {step.features.map((feature, idx) => (
                            <div key={idx} className={`bg-${step.color}-50 p-4 rounded-lg`}>
                              <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                              <p className="text-sm text-gray-600">{feature.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flow-arrow animate-on-scroll"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flowchart Illustration Section */}
      <section id="flowchart" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lưu Đồ Minh Họa Quy Trình</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sơ đồ tổng quan về chuỗi giá trị từ EV Owner đến Buyer thông qua CVA và Marketplace
            </p>
          </div>

          <div className="animate-on-scroll">
            <div className="flowchart">
              <div className="grid md:grid-cols-4 gap-6">
                {flowchartNodes.map((node, index) => (
                  <div key={index} className="text-center">
                    <div className={`flowchart-node ${node.color} mb-4`}>
                      <div className="text-4xl mb-3">{node.icon}</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{node.title}</h4>
                      <p className="text-sm text-gray-600">{node.desc}</p>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      {node.items.map((item, idx) => (
                        <div key={idx}>• {item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Flow Arrows */}
              <div className="flex justify-center items-center mt-8 space-x-8">
                <div className="text-2xl text-primary-green font-bold">→</div>
                <div className="text-2xl text-blue font-bold">→</div>
                <div className="text-2xl text-purple-600 font-bold">→</div>
              </div>

              {/* Data Flow Labels */}
              <div className="grid md:grid-cols-3 gap-4 mt-4 text-center">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-primary-green">Dữ liệu hành trình</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue">Tín chỉ được xác minh</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-purple-600">Chứng nhận carbon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Transparency Section */}
      <section id="technology-transparency" className="py-20 gradient-light-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tính Minh Bạch & Công Nghệ Nền Tảng</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hệ thống công nghệ hiện đại đảm bảo tính chính xác, minh bạch và bảo mật trong mọi giao dịch
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {technologies.map((tech, index) => (
              <div key={index} className="animate-on-scroll tech-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-5xl mb-4">{tech.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{tech.title}</h4>
                <p className="text-gray-600 mb-4">{tech.description}</p>
                <div className={`text-sm text-${tech.color}-600 bg-${tech.color}-50 p-3 rounded-lg`}>
                  <strong>Lợi ích:</strong> {tech.benefit}
                </div>
              </div>
            ))}
          </div>

          {/* Technology Architecture */}
          <div className="animate-on-scroll">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Kiến Trúc Công Nghệ</h3>
              <div className="grid md:grid-cols-5 gap-4 items-center">
                <div className="text-center">
                  <div className="w-16 h-16 gradient-green rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-2xl">📱</span>
                  </div>
                  <div className="text-sm font-medium">Mobile App</div>
                </div>
                <div className="text-center text-2xl text-gray-400">→</div>
                <div className="text-center">
                  <div className="w-16 h-16 gradient-blue rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-2xl">☁️</span>
                  </div>
                  <div className="text-sm font-medium">Cloud API</div>
                </div>
                <div className="text-center text-2xl text-gray-400">→</div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-2xl">🗄️</span>
                  </div>
                  <div className="text-sm font-medium">Database</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lợi Ích Nổi Bật</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những ưu điểm vượt trội khi sử dụng nền tảng Carbon Credit Marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className={`benefit-card ${benefit.color} animate-on-scroll`} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-green to-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white animate-on-scroll">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn sàng bắt đầu hành trình kiếm tiền từ xe điện?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Đăng ký ngay để kết nối xe điện, nhận tín chỉ carbon và bắt đầu giao dịch trên nền tảng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="bg-white text-primary-green px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                <span className="mr-2">✨</span>
                Đăng ký miễn phí
              </Link>
              <Link to="/contact" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-primary-green transition-colors inline-flex items-center justify-center">
                <span className="mr-2">💬</span>
                Liên hệ hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;

