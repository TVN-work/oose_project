import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Car, 
  Smartphone, 
  BarChart3, 
  CheckCircle2, 
  Wallet, 
  ShoppingCart, 
  Lock, 
  FileText, 
  Award, 
  TrendingUp, 
  Building2,
  Brain,
  Shield,
  Sparkles,
  Rocket,
  ArrowRight,
  Activity,
  ArrowDown,
  CheckCircle,
  Clock,
  Eye,
  DollarSign,
  UserPlus,
  LogIn,
  HelpCircle,
  ChevronRight,
  Upload,
  CreditCard,
  Receipt,
  Download
} from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const [activeRole, setActiveRole] = useState('ev-owner');

  const steps = [
    {
      number: 1,
      title: 'Kết nối & Thu thập dữ liệu hành trình',
      description: 'Chủ xe điện (EV Owner) kết nối dữ liệu xe hoặc tải file hành trình. Hệ thống tự động tính toán lượng CO₂ giảm phát thải so với xe xăng truyền thống.',
      icon: Car,
      color: 'green',
      features: [
        { icon: Smartphone, title: 'Kết nối tự động', desc: 'API đồng bộ dữ liệu từ xe điện thông minh' },
        { icon: BarChart3, title: 'Tính toán chính xác', desc: 'AI phân tích và so sánh với xe xăng cùng loại' },
      ],
    },
    {
      number: 2,
      title: 'Phê duyệt & Cấp tín chỉ carbon',
      description: 'Dữ liệu được gửi đến tổ chức xác minh (CVA). CVA kiểm tra, xác thực, sau đó cấp tín chỉ carbon tương ứng và ghi nhận vào ví carbon của EV Owner.',
      icon: CheckCircle2,
      color: 'blue',
      features: [
        { icon: Shield, title: 'Xác minh chuyên nghiệp', desc: 'CVA kiểm tra theo tiêu chuẩn quốc tế' },
        { icon: Wallet, title: 'Ví carbon cá nhân', desc: 'Tín chỉ được lưu trữ an toàn trong ví' },
      ],
    },
    {
      number: 3,
      title: 'Niêm yết & Giao dịch',
      description: 'EV Owner có thể niêm yết tín chỉ carbon để bán (theo giá cố định hoặc đấu giá). Người mua (Buyer) tìm kiếm, chọn và thanh toán trực tuyến qua ví điện tử hoặc ngân hàng.',
      icon: ShoppingCart,
      color: 'green',
      features: [
        { icon: Brain, title: 'Định giá linh hoạt', desc: 'AI gợi ý giá hoặc tự đặt giá theo ý muốn' },
        { icon: Lock, title: 'Thanh toán an toàn', desc: 'Hỗ trợ nhiều phương thức thanh toán' },
      ],
    },
    {
      number: 4,
      title: 'Chứng nhận & Báo cáo',
      description: 'Buyer nhận chứng chỉ tín chỉ carbon để dùng trong báo cáo ESG hoặc bù đắp phát thải. Hệ thống ghi nhận giao dịch minh bạch, có thể xuất báo cáo cho các bên liên quan.',
      icon: FileText,
      color: 'blue',
      features: [
        { icon: Award, title: 'Chứng nhận quốc tế', desc: 'Được công nhận trong báo cáo ESG' },
        { icon: TrendingUp, title: 'Báo cáo chi tiết', desc: 'Xuất báo cáo tác động môi trường' },
      ],
    },
  ];

  const userGuides = {
    'ev-owner': {
      title: 'Hướng dẫn cho Chủ xe điện',
      steps: [
        { icon: UserPlus, title: 'Đăng ký tài khoản', desc: 'Tạo tài khoản EV Owner và xác thực thông tin' },
        { icon: Car, title: 'Đăng ký xe điện', desc: 'Thêm thông tin xe điện và giấy tờ đăng ký' },
        { icon: Upload, title: 'Tải dữ liệu hành trình', desc: 'Upload file hoặc kết nối API để đồng bộ dữ liệu' },
        { icon: BarChart3, title: 'Xem tín chỉ carbon', desc: 'Theo dõi số lượng tín chỉ đã được cấp trong ví' },
        { icon: ShoppingCart, title: 'Niêm yết bán', desc: 'Tạo listing để bán tín chỉ với giá cố định hoặc đấu giá' },
        { icon: Receipt, title: 'Quản lý giao dịch', desc: 'Theo dõi và quản lý các giao dịch bán tín chỉ' },
      ],
    },
    'buyer': {
      title: 'Hướng dẫn cho Người mua',
      steps: [
        { icon: UserPlus, title: 'Đăng ký tài khoản', desc: 'Tạo tài khoản Buyer và xác thực doanh nghiệp' },
        { icon: ShoppingCart, title: 'Tìm kiếm tín chỉ', desc: 'Duyệt marketplace và tìm tín chỉ phù hợp' },
        { icon: CreditCard, title: 'Thanh toán', desc: 'Chọn phương thức thanh toán và hoàn tất giao dịch' },
        { icon: FileText, title: 'Nhận chứng nhận', desc: 'Tải về chứng chỉ carbon để sử dụng trong báo cáo ESG' },
        { icon: Receipt, title: 'Lịch sử mua hàng', desc: 'Xem lại tất cả các giao dịch đã thực hiện' },
      ],
    },
  };

  const faqs = [
    {
      question: 'Làm thế nào để đăng ký tài khoản?',
      answer: 'Bạn có thể đăng ký bằng cách nhấp vào nút "Đăng ký" ở trang chủ, chọn vai trò (EV Owner hoặc Buyer), điền thông tin và xác thực email.',
    },
    {
      question: 'Tín chỉ carbon được tính như thế nào?',
      answer: 'Hệ thống tự động tính toán dựa trên quãng đường di chuyển, loại xe và so sánh với xe xăng tương đương. Công thức: CO₂ giảm = (Quãng đường × Hệ số phát thải xe xăng) - (Quãng đường × Hệ số phát thải xe điện).',
    },
    {
      question: 'Thời gian xử lý yêu cầu xác minh là bao lâu?',
      answer: 'Thông thường, CVA sẽ xử lý và phê duyệt yêu cầu trong vòng 24-48 giờ làm việc sau khi nhận được đầy đủ thông tin.',
    },
    {
      question: 'Có thể hủy listing sau khi đã tạo không?',
      answer: 'Có, bạn có thể hủy listing nếu chưa có người mua. Tín chỉ sẽ được hoàn trả vào ví carbon của bạn.',
    },
    {
      question: 'Phương thức thanh toán nào được hỗ trợ?',
      answer: 'Chúng tôi hỗ trợ thanh toán qua ví điện tử, chuyển khoản ngân hàng và thẻ tín dụng/ghi nợ.',
    },
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
      <section id="how-it-works-hero" className="hero-bg-new min-h-[80vh] flex items-center relative overflow-hidden">
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
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Quy trình hoạt động</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Cách nền tảng{' '}
                <span className="text-yellow-300">Carbon Credit Marketplace</span>{' '}
                hoạt động
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
                Hướng dẫn chi tiết từng bước để bắt đầu giao dịch tín chỉ carbon trên nền tảng của chúng tôi
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={scrollToSteps} 
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg btn-hover shadow-xl text-center flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <FileText className="w-5 h-5" />
                  Xem quy trình 4 bước
                </button>
                <button 
                  onClick={connectEV} 
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg btn-hover text-center flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Đăng ký ngay
                </button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="slide-in-right">
              <div className="process-illustration-new">
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Quy trình hoạt động tổng quan</h3>
                  </div>
                  
                  {/* Process Flow */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flowchart-node-new green step-flow-new group">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-2 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                        <Car className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900">Xe điện</div>
                      <div className="text-xs text-gray-600">Dữ liệu hành trình</div>
                    </div>
                    <div className="flowchart-node-new blue step-flow-new group" style={{ animationDelay: '0.5s' }}>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-2 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900">Xác minh</div>
                      <div className="text-xs text-gray-600">CVA kiểm tra</div>
                    </div>
                    <div className="flowchart-node-new purple step-flow-new group" style={{ animationDelay: '1s' }}>
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-2 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                        <ShoppingCart className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900">Thị trường</div>
                      <div className="text-xs text-gray-600">Giao dịch tín chỉ</div>
                    </div>
                    <div className="flowchart-node-new orange step-flow-new group" style={{ animationDelay: '1.5s' }}>
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-2 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900">Chứng nhận</div>
                      <div className="text-xs text-gray-600">Báo cáo ESG</div>
                    </div>
                  </div>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white bg-opacity-90 rounded-lg p-4 shadow-md">
                      <div className="text-2xl font-bold text-green-600 mb-1">4</div>
                      <div className="text-xs text-gray-600 font-medium">Bước đơn giản</div>
                    </div>
                    <div className="bg-white bg-opacity-90 rounded-lg p-4 shadow-md">
                      <div className="text-2xl font-bold text-blue-600 mb-1">24h</div>
                      <div className="text-xs text-gray-600 font-medium">Xử lý nhanh</div>
                    </div>
                    <div className="bg-white bg-opacity-90 rounded-lg p-4 shadow-md">
                      <div className="text-2xl font-bold text-purple-600 mb-1">100%</div>
                      <div className="text-xs text-gray-600 font-medium">Minh bạch</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps Process Section */}
      <section id="four-steps" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quy Trình 4 Bước Chính</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Từ việc kết nối xe điện đến nhận chứng nhận carbon - quy trình đơn giản, minh bạch và hiệu quả
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.number}>
                  <div className="animate-on-scroll">
                    <div className={`step-card-new ${step.color} group`}>
                      <div className={`grid md:grid-cols-3 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                        <div className={`text-center ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                          <div className={`w-24 h-24 mx-auto ${step.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-12 h-12 text-white" />
                          </div>
                          <div className={`${step.color === 'green' ? 'bg-green-600' : 'bg-blue-600'} text-white px-4 py-2 rounded-full text-sm font-bold inline-block`}>
                            BƯỚC {step.number}
                          </div>
                        </div>
                        <div className={`md:col-span-2 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                          <p className="text-gray-600 text-lg mb-6 leading-relaxed">{step.description}</p>
                          <div className="grid md:grid-cols-2 gap-4">
                            {step.features.map((feature, idx) => {
                              const FeatureIcon = feature.icon;
                              return (
                                <div key={idx} className={`bg-${step.color}-50 p-4 rounded-lg border border-${step.color}-200`}>
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 bg-${step.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                      <FeatureIcon className={`w-5 h-5 text-${step.color}-600`} />
                                    </div>
                                    <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                                  </div>
                                  <p className="text-sm text-gray-600 ml-0">{feature.desc}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flow-arrow-new animate-on-scroll flex justify-center my-4">
                      <ArrowDown className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Guides Section */}
      <section id="user-guides" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Hướng Dẫn Sử Dụng</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hướng dẫn chi tiết cho từng nhóm người dùng để bắt đầu sử dụng nền tảng
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveRole('ev-owner')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  activeRole === 'ev-owner'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Car className="w-5 h-5" />
                Chủ xe điện
              </button>
              <button
                onClick={() => setActiveRole('buyer')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  activeRole === 'buyer'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2 className="w-5 h-5" />
                Người mua
              </button>
            </div>
          </div>

          {/* Guide Content */}
          <div className="animate-on-scroll">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {userGuides[activeRole].title}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userGuides[activeRole].steps.map((guide, index) => {
                  const GuideIcon = guide.icon;
                  return (
                    <div key={index} className="guide-step-card group">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${
                          activeRole === 'ev-owner' ? 'from-green-500 to-green-600' : 'from-blue-500 to-blue-600'
                        } rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                          <GuideIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white mb-2 ${
                            activeRole === 'ev-owner' ? 'bg-green-600' : 'bg-blue-600'
                          }`}>
                            {index + 1}
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2">{guide.title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{guide.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section id="quick-start" className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Bắt Đầu Ngay</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Đăng ký tài khoản và bắt đầu hành trình của bạn trong 3 bước đơn giản
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg border border-gray-200">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">1. Đăng ký tài khoản</h3>
                  <p className="text-gray-600 mb-4">Tạo tài khoản miễn phí và chọn vai trò phù hợp với bạn</p>
                  <Link 
                    to="/auth" 
                    className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors"
                  >
                    Đăng ký ngay <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">2. Kết nối xe điện</h3>
                  <p className="text-gray-600 mb-4">Đăng ký thông tin xe điện và tải dữ liệu hành trình đầu tiên</p>
                  <Link 
                    to="/how-it-works#user-guides" 
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    Xem hướng dẫn <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">3. Bắt đầu giao dịch</h3>
                  <p className="text-gray-600 mb-4">Niêm yết tín chỉ để bán hoặc tìm kiếm tín chỉ để mua</p>
                  <Link 
                    to="/marketplace" 
                    className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                  >
                    Xem marketplace <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Câu Hỏi Thường Gặp</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những câu hỏi phổ biến về nền tảng và cách sử dụng
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="animate-on-scroll faq-card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white animate-on-scroll">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn sàng bắt đầu hành trình kiếm tiền từ xe điện?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Đăng ký ngay để kết nối xe điện, nhận tín chỉ carbon và bắt đầu giao dịch trên nền tảng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth" 
                className="bg-white text-green-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-transform"
              >
                <Sparkles className="w-5 h-5" />
                Đăng ký miễn phí
              </Link>
              <Link 
                to="/contact" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Activity className="w-5 h-5" />
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
