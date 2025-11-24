import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  X,
  Car,
  Leaf,
  Building2,
  Shield,
  CheckCircle,
  Globe,
  Users,
  Award,
  Calculator,
  Ticket,
  Coins,
  Wallet,
  ShoppingCart,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Phone,
  LogIn,
  Sparkles,
  FileText,
  Clock,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Store,
  Gavel,
  FileSignature,
  AlertCircle,
  Info,
  MessageSquare
} from 'lucide-react';
import './FAQs.css';

const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const observerRef = useRef(null);

  // FAQ Data Structure
  const faqCategories = [
    {
      id: 'overview',
      title: 'Tổng quan về nền tảng',
      description: 'Hiểu về Carbon Credit Marketplace và cách thức hoạt động',
      icon: Globe,
      gradient: 'category-overview',
      faqs: [
        {
          id: 'overview-1',
          question: 'Carbon Credit Marketplace là gì?',
          answer: `Carbon Credit Marketplace for EV Owners là nền tảng giao dịch tín chỉ carbon đầu tiên tại Việt Nam được thiết kế đặc biệt cho chủ sở hữu xe điện. Nền tảng giúp chủ xe điện kiếm thu nhập từ việc giảm phát thải CO₂ bằng cách bán tín chỉ carbon cho các doanh nghiệp và tổ chức có nhu cầu bù trừ khí thải.`,
          icon: Leaf,
          benefits: [
            'Thu nhập thụ động từ việc sử dụng xe điện',
            'Góp phần bảo vệ môi trường và giảm ô nhiễm',
            'Kết nối minh bạch giữa người bán và người mua',
            'Xác minh chính xác bởi tổ chức CVA uy tín',
          ],
        },
        {
          id: 'overview-2',
          question: 'Ai có thể tham gia nền tảng này?',
          answer: `Nền tảng được thiết kế cho 4 nhóm đối tượng chính, mỗi nhóm có vai trò và quyền lợi riêng biệt:`,
          icon: Users,
          roles: [
            { name: 'EV Owner (Chủ xe điện)', icon: Car, desc: 'Cá nhân hoặc tổ chức sở hữu xe điện hợp pháp tại Việt Nam', color: 'green' },
            { name: 'Buyer (Người mua tín chỉ)', icon: Building2, desc: 'Doanh nghiệp, tổ chức muốn bù trừ khí thải CO₂', color: 'blue' },
            { name: 'CVA (Tổ chức xác minh)', icon: CheckCircle, desc: 'Tổ chức kiểm toán carbon được cấp phép', color: 'purple' },
            { name: 'Admin (Quản trị viên)', icon: Shield, desc: 'Đội ngũ vận hành và quản lý nền tảng', color: 'gray' },
          ],
        },
        {
          id: 'overview-3',
          question: 'Tín chỉ carbon là gì?',
          answer: `Tín chỉ carbon (Carbon Credit) là đơn vị đo lường được chuẩn hóa quốc tế, trong đó 1 tín chỉ = 1 tấn CO₂ được cắt giảm hoặc loại bỏ khỏi khí quyển.`,
          icon: Award,
          calculation: [
            'Bước 1: Tính lượng CO₂ tiết kiệm = (Quãng đường × Mức phát thải xe xăng) - (Quãng đường × Mức phát thải điện)',
            'Bước 2: CVA xác minh dữ liệu và tính toán chính xác',
            'Bước 3: Cấp tín chỉ carbon tương ứng với lượng CO₂ tiết kiệm',
          ],
          example: 'Nếu xe điện của bạn tiết kiệm được 2.5 tấn CO₂ trong năm, bạn sẽ nhận được 2.5 tín chỉ carbon để bán trên marketplace.',
        },
      ],
    },
    {
      id: 'ev-owner',
      title: 'Dành cho Chủ sở hữu xe điện (EV Owner)',
      description: 'Hướng dẫn chi tiết cho chủ xe điện tham gia nền tảng',
      icon: Car,
      gradient: 'category-ev-owner',
      faqs: [
        {
          id: 'ev-owner-1',
          question: 'Làm thế nào để tính lượng CO₂ giảm phát thải của xe điện?',
          answer: `Hệ thống tự động tính toán lượng CO₂ tiết kiệm dựa trên dữ liệu thực tế của xe điện và so sánh với xe xăng cùng loại. Quy trình tính toán được thực hiện theo tiêu chuẩn quốc tế ISO 14064.`,
          icon: Calculator,
          formula: {
            title: 'Công thức tính toán:',
            items: [
              'CO₂ tiết kiệm = CO₂ xe xăng - CO₂ xe điện',
              'CO₂ xe xăng = Quãng đường × 0.23 kg CO₂/km',
              'CO₂ xe điện = Quãng đường × 0.08 kg CO₂/km (tùy nguồn điện)',
            ],
          },
          dataNeeded: [
            'Quãng đường di chuyển hàng tháng (km)',
            'Mức tiêu thụ điện của xe (kWh/100km)',
            'Loại xe điện và năm sản xuất',
            'Nguồn điện sạc (lưới điện quốc gia/năng lượng tái tạo)',
          ],
        },
        {
          id: 'ev-owner-2',
          question: 'Làm sao để nhận được tín chỉ carbon?',
          answer: `Quy trình nhận tín chỉ carbon được thực hiện qua 5 bước đơn giản và minh bạch:`,
          icon: Ticket,
          steps: [
            { step: 1, title: 'Đăng ký tài khoản EV Owner', desc: 'Cung cấp thông tin cá nhân và giấy tờ xe điện' },
            { step: 2, title: 'Kết nối dữ liệu xe điện', desc: 'Đồng bộ dữ liệu từ ứng dụng xe hoặc nhập thủ công' },
            { step: 3, title: 'Tích lũy dữ liệu sử dụng', desc: 'Hệ thống theo dõi quãng đường và mức tiêu thụ điện' },
            { step: 4, title: 'CVA xác minh dữ liệu', desc: 'Tổ chức kiểm toán độc lập xác nhận tính chính xác' },
            { step: 5, title: 'Nhận tín chỉ carbon', desc: 'Tín chỉ được ghi vào ví carbon và sẵn sàng bán' },
          ],
        },
        {
          id: 'ev-owner-3',
          question: 'Tôi có thể bán tín chỉ bằng cách nào?',
          answer: `Nền tảng cung cấp 3 phương thức bán tín chỉ carbon linh hoạt để tối ưu hóa lợi nhuận:`,
          icon: Coins,
          methods: [
            { name: 'Bán trực tiếp', icon: Store, items: ['Đặt giá cố định', 'Bán ngay lập tức', 'Phù hợp số lượng nhỏ', 'Phí: 2.5%'], color: 'green' },
            { name: 'Đấu giá', icon: Gavel, items: ['Giá khởi điểm thấp', 'Tối ưu hóa giá bán', 'Thời gian 7-14 ngày', 'Phí: 3.0%'], color: 'blue' },
            { name: 'Hợp đồng dài hạn', icon: FileSignature, items: ['Cam kết 6-12 tháng', 'Giá ổn định', 'Ưu tiên doanh nghiệp', 'Phí: 2.0%'], color: 'purple' },
          ],
        },
        {
          id: 'ev-owner-4',
          question: 'Có thể rút tiền về tài khoản ngân hàng không?',
          answer: `Có, bạn có thể rút tiền về tài khoản ngân hàng sau khi hoàn tất giao dịch và xác minh danh tính. Quy trình rút tiền được thiết kế đơn giản và bảo mật cao.`,
          icon: Wallet,
          conditions: [
            'Tài khoản đã xác minh đầy đủ (KYC)',
            'Số dư tối thiểu: 500,000 VNĐ',
            'Tài khoản ngân hàng cùng tên chủ sở hữu',
            'Không có giao dịch đang tranh chấp',
          ],
          withdrawalInfo: [
            'Thời gian xử lý: 1-3 ngày làm việc',
            'Phí rút tiền: 15,000 VNĐ/lần',
            'Hỗ trợ tất cả ngân hàng lớn tại Việt Nam',
            'Thông báo SMS khi hoàn tất',
          ],
        },
      ],
    },
    {
      id: 'buyer',
      title: 'Dành cho Người mua tín chỉ (Buyer)',
      description: 'Hướng dẫn mua tín chỉ carbon cho doanh nghiệp và tổ chức',
      icon: Building2,
      gradient: 'category-buyer',
      faqs: [
        {
          id: 'buyer-1',
          question: 'Làm thế nào để mua tín chỉ carbon?',
          answer: `Quy trình mua tín chỉ carbon trên nền tảng rất đơn giản và minh bạch:`,
          icon: ShoppingCart,
          steps: [
            { step: 1, title: 'Đăng ký tài khoản Buyer', desc: 'Cung cấp thông tin doanh nghiệp và xác minh' },
            { step: 2, title: 'Tìm kiếm tín chỉ phù hợp', desc: 'Lọc theo số lượng, giá, khu vực, chứng nhận' },
            { step: 3, title: 'Chọn phương thức mua', desc: 'Mua trực tiếp hoặc tham gia đấu giá' },
            { step: 4, title: 'Thanh toán an toàn', desc: 'Hỗ trợ nhiều phương thức thanh toán' },
            { step: 5, title: 'Nhận chứng nhận', desc: 'Nhận chứng nhận tín chỉ carbon để báo cáo' },
          ],
        },
        {
          id: 'buyer-2',
          question: 'Tín chỉ carbon có được xác minh không?',
          answer: `Tất cả tín chỉ carbon trên nền tảng đều được xác minh bởi các tổ chức CVA (Carbon Verification & Audit) uy tín và được công nhận quốc tế.`,
          icon: FileCheck,
          verification: [
            'Xác minh bởi CVA được cấp phép',
            'Tuân thủ tiêu chuẩn ISO 14064',
            'Chứng nhận minh bạch và truy xuất nguồn gốc',
            'Được công nhận bởi các tổ chức quốc tế',
          ],
        },
      ],
    },
    {
      id: 'cva',
      title: 'Dành cho Tổ chức xác minh (CVA)',
      description: 'Thông tin cho tổ chức kiểm toán và xác minh carbon',
      icon: ShieldCheck,
      gradient: 'category-cva',
      faqs: [
        {
          id: 'cva-1',
          question: 'Làm thế nào để trở thành CVA trên nền tảng?',
          answer: `Các tổ chức kiểm toán carbon có thể đăng ký trở thành CVA trên nền tảng sau khi đáp ứng các yêu cầu về chứng nhận và năng lực.`,
          icon: Building2,
          requirements: [
            'Giấy phép kinh doanh/Chứng nhận tổ chức',
            'Chứng chỉ ISO 14064 hoặc tương đương',
            'Danh sách chuyên viên kiểm toán',
            'Thư giới thiệu từ cơ quan có thẩm quyền',
          ],
        },
      ],
    },
    {
      id: 'security',
      title: 'Bảo mật & Quyền riêng tư',
      description: 'Thông tin về bảo mật và quyền riêng tư trên nền tảng',
      icon: Shield,
      gradient: 'category-security',
      faqs: [
        {
          id: 'security-1',
          question: 'Thông tin cá nhân có được bảo mật không?',
          answer: `Chúng tôi cam kết bảo vệ thông tin cá nhân của người dùng theo tiêu chuẩn quốc tế về bảo mật dữ liệu.`,
          icon: ShieldCheck,
          security: [
            'Mã hóa SSL/TLS 256-bit',
            'Tuân thủ GDPR và Luật An ninh mạng Việt Nam',
            'Không chia sẻ thông tin với bên thứ ba',
            'Kiểm toán bảo mật định kỳ',
          ],
        },
      ],
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

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Removed welcome toast message

  const toggleFAQ = (faqId) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter FAQs based on search query with useMemo for performance
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqCategories;
    }
    const searchLower = searchQuery.toLowerCase();
    return faqCategories
      .map(category => ({
        ...category,
        faqs: (category.faqs || []).filter(faq => {
          const question = faq.question?.toLowerCase() || '';
          const answer = faq.answer?.toLowerCase() || '';
          return question.includes(searchLower) || answer.includes(searchLower);
        }),
      }))
      .filter(category => category.faqs && category.faqs.length > 0);
  }, [searchQuery]);

  const highlightText = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="highlight">{part}</span> : part
    );
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="hero-bg-faq py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg animate-on-scroll">
            <HelpCircle className="w-5 h-5 mr-3 text-green-primary" />
            <span className="text-green-primary font-semibold">Câu hỏi thường gặp</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-on-scroll">
            Tìm hiểu về 
            <span className="text-green-primary"> Carbon Credit</span>
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto animate-on-scroll">
            Khám phá cách hoạt động của nền tảng giao dịch tín chỉ carbon, vai trò của các bên tham gia 
            và quy trình giảm phát thải CO₂ từ xe điện.
          </p>
          
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-on-scroll">
            <div className="stats-card-faq">
              <Car className="w-8 h-8 mx-auto mb-3 text-green-primary" />
              <div className="text-2xl font-bold text-green-primary">1,250+</div>
              <div className="text-sm text-gray-600">Xe điện đã đăng ký</div>
            </div>
            <div className="stats-card-faq">
              <Leaf className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">15,680</div>
              <div className="text-sm text-gray-600">Tín chỉ carbon đã bán</div>
            </div>
            <div className="stats-card-faq">
              <Building2 className="w-8 h-8 mx-auto mb-3 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">89</div>
              <div className="text-sm text-gray-600">Doanh nghiệp mua tín chỉ</div>
            </div>
            <div className="stats-card-faq">
              <ShieldCheck className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-gray-600">Tổ chức CVA hợp tác</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="search-container-faq">
            <Search className="search-icon-faq" />
            <input 
              type="text" 
              className="search-input-faq" 
              placeholder="Tìm kiếm câu hỏi... (ví dụ: tín chỉ carbon, xe điện, CVA)"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-3 text-center">
              Tìm thấy {filteredCategories.reduce((sum, cat) => sum + cat.faqs.length, 0)} kết quả
            </p>
          )}
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-600">Vui lòng thử lại với từ khóa khác</p>
            </div>
          ) : (
            filteredCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;
              return (
              <div key={category.id} className="faq-category-new animate-on-scroll" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                <div className="faq-category-header-new">
                  <div className="flex items-center">
                    <div className={`faq-category-icon ${category.gradient}`}>
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-green-dark">
                        {categoryIndex + 1}. {category.title}
                      </h2>
                      <p className="text-green-800 mt-1">{category.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {category.faqs.map((faq) => {
                    const FAQIcon = faq.icon;
                    return (
                    <div key={faq.id} className="faq-item-new">
                      <div 
                        className={`faq-question-new ${openFAQ === faq.id ? 'active' : ''}`}
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <div className="flex items-center flex-1">
                          <div className="faq-item-icon">
                            <FAQIcon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-gray-900">{highlightText(faq.question)}</span>
                        </div>
                        {openFAQ === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className={`faq-answer-new ${openFAQ === faq.id ? 'active' : ''}`}>
                        <p className="text-gray-700 leading-relaxed mb-4">{highlightText(faq.answer)}</p>
                        
                        {/* Render additional content based on FAQ type */}
                        {faq.benefits && (
                          <div className="bg-blue-50 rounded-lg p-3.5 border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2 text-sm">Lợi ích chính:</h4>
                            <ul className="text-blue-800 space-y-1 text-sm">
                              {faq.benefits.map((benefit, idx) => (
                                <li key={idx}>• {benefit}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {faq.roles && (
                          <div className="grid md:grid-cols-2 gap-3">
                            {faq.roles.map((role, idx) => {
                              const RoleIcon = role.icon;
                              return (
                              <div key={idx} className={`bg-${role.color}-50 rounded-lg p-3.5 border border-${role.color}-200`}>
                                <h4 className={`font-semibold text-${role.color}-900 mb-1.5 flex items-center text-sm`}>
                                  <RoleIcon className="w-4 h-4 mr-2" />
                                  {role.name}
                                </h4>
                                <p className={`text-${role.color}-800 text-xs leading-relaxed`}>{role.desc}</p>
                              </div>
                              );
                            })}
                          </div>
                        )}

                        {faq.calculation && (
                          <>
                            <div className="bg-orange-50 rounded-lg p-3.5 mb-3 border border-orange-200">
                              <h4 className="font-semibold text-orange-900 mb-2 text-sm">Cách tính tín chỉ từ xe điện:</h4>
                              <div className="text-orange-800 space-y-1.5 text-sm">
                                {faq.calculation.map((step, idx) => (
                                  <p key={idx}><strong>Bước {idx + 1}:</strong> {step}</p>
                                ))}
                              </div>
                            </div>
                            {faq.example && (
                              <div className="bg-green-50 rounded-lg p-3.5 border border-green-200">
                                <p className="text-green-800 text-sm">
                                  <strong>Ví dụ:</strong> {faq.example}
                                </p>
                              </div>
                            )}
                          </>
                        )}

                        {faq.formula && (
                          <>
                            <div className="bg-green-50 rounded-lg p-3.5 mb-3 border border-green-200">
                              <h4 className="font-semibold text-green-900 mb-2 text-sm">{faq.formula.title}</h4>
                              <div className="space-y-1.5 text-green-800 text-sm">
                                {faq.formula.items.map((item, idx) => (
                                  <p key={idx}>{item}</p>
                                ))}
                              </div>
                            </div>
                            {faq.dataNeeded && (
                              <div className="bg-blue-50 rounded-lg p-3.5 border border-blue-200">
                                <h4 className="font-semibold text-blue-900 mb-2 text-sm">Dữ liệu cần thiết:</h4>
                                <ul className="text-blue-800 space-y-1 text-sm">
                                  {faq.dataNeeded.map((data, idx) => (
                                    <li key={idx}>• {data}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}

                        {faq.steps && (
                          <div className="space-y-3">
                            {faq.steps.map((step) => (
                              <div key={step.step} className="flex items-start space-x-3">
                                <div className="w-7 h-7 bg-green-primary text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{step.title}</h4>
                                  <p className="text-gray-600 text-xs leading-relaxed">{step.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {faq.methods && (
                          <div className="grid md:grid-cols-3 gap-3">
                            {faq.methods.map((method, idx) => {
                              const MethodIcon = method.icon;
                              return (
                              <div key={idx} className={`bg-${method.color}-50 border border-${method.color}-200 rounded-lg p-3.5`}>
                                <h4 className={`font-semibold text-${method.color}-900 mb-2 flex items-center text-sm`}>
                                  <MethodIcon className="w-4 h-4 mr-2" />
                                  {method.name}
                                </h4>
                                <ul className={`text-${method.color}-800 text-xs space-y-1 leading-relaxed`}>
                                  {method.items.map((item, itemIdx) => (
                                    <li key={itemIdx}>• {item}</li>
                                  ))}
                                </ul>
                              </div>
                              );
                            })}
                          </div>
                        )}

                        {faq.conditions && (
                          <>
                            <div className="bg-blue-50 rounded-lg p-3.5 mb-3 border border-blue-200">
                              <h4 className="font-semibold text-blue-900 mb-2 text-sm">Điều kiện rút tiền:</h4>
                              <ul className="text-blue-800 space-y-1 text-sm">
                                {faq.conditions.map((condition, idx) => (
                                  <li key={idx}>• {condition}</li>
                                ))}
                              </ul>
                            </div>
                            {faq.withdrawalInfo && (
                              <div className="bg-green-50 rounded-lg p-3.5 border border-green-200">
                                <h4 className="font-semibold text-green-900 mb-2 text-sm">Thời gian và phí:</h4>
                                <ul className="text-green-800 space-y-1 text-sm">
                                  {faq.withdrawalInfo.map((info, idx) => (
                                    <li key={idx}>• {info}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}

                        {faq.verification && (
                          <div className="bg-green-50 rounded-lg p-3.5 border border-green-200">
                            <h4 className="font-semibold text-green-900 mb-2 text-sm">Xác minh:</h4>
                            <ul className="text-green-800 space-y-1 text-sm">
                              {faq.verification.map((item, idx) => (
                                <li key={idx}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {faq.requirements && (
                          <div className="bg-purple-50 rounded-lg p-3.5 border border-purple-200">
                            <h4 className="font-semibold text-purple-900 mb-2 text-sm">Yêu cầu:</h4>
                            <ul className="text-purple-800 space-y-1 text-sm">
                              {faq.requirements.map((req, idx) => (
                                <li key={idx}>• {req}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {faq.security && (
                          <div className="bg-blue-50 rounded-lg p-3.5 border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2 text-sm">Bảo mật:</h4>
                            <ul className="text-blue-800 space-y-1 text-sm">
                              {faq.security.map((item, idx) => (
                                <li key={idx}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
              );
            })
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="contact-cta-new animate-on-scroll">
            <div className="relative z-10">
              <MessageSquare className="w-16 h-16 mx-auto mb-6 text-white" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Vẫn còn thắc mắc?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi câu hỏi của bạn. 
                Liên hệ ngay để được tư vấn miễn phí.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="bg-white text-green-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Liên hệ hỗ trợ
                </Link>
                <Link to="/auth" className="bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-colors inline-flex items-center justify-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default FAQs;

