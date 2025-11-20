import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Blog.css';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const observerRef = useRef(null);

  const categories = [
    { id: 'all', label: 'Tất cả', icon: '🌟' },
    { id: 'basic', label: 'Kiến thức cơ bản', icon: '📖' },
    { id: 'news', label: 'Tin tức & Chính sách', icon: '📈' },
    { id: 'community', label: 'Cộng đồng EV', icon: '👥' },
  ];

  const articles = [
    {
      id: 1,
      category: 'basic',
      title: 'Tín chỉ Carbon là gì? Hướng dẫn từ A-Z cho người mới bắt đầu',
      description: 'Tìm hiểu khái niệm tín chỉ carbon, cách thức hoạt động và tại sao nó quan trọng trong việc chống biến đổi khí hậu. Hướng dẫn chi tiết dành cho người mới.',
      date: '15 Tháng 1, 2025',
      icon: '🌱',
      gradient: 'from-green-400/20 to-blue-400/20',
    },
    {
      id: 2,
      category: 'news',
      title: 'Chính phủ Việt Nam công bố chính sách mới hỗ trợ xe điện 2025',
      description: 'Phân tích chi tiết các chính sách ưu đãi mới cho xe điện, tác động đến thị trường tín chỉ carbon và cơ hội cho chủ sở hữu xe điện.',
      date: '12 Tháng 1, 2025',
      icon: '📊',
      gradient: 'from-yellow-400/20 to-orange-400/20',
    },
    {
      id: 3,
      category: 'community',
      title: 'Câu chuyện thành công: Anh Minh kiếm 2.5 triệu/tháng từ xe điện',
      description: 'Chia sẻ từ anh Nguyễn Văn Minh - tài xế Grab sử dụng xe điện VinFast VF5, đã kiếm thêm thu nhập ổn định từ việc bán tín chỉ carbon.',
      date: '10 Tháng 1, 2025',
      icon: '🚗',
      gradient: 'from-purple-400/20 to-pink-400/20',
    },
    {
      id: 4,
      category: 'basic',
      title: 'So sánh phát thải CO₂: Xe điện vs Xe xăng - Số liệu thực tế',
      description: 'Phân tích chi tiết mức phát thải CO₂ của xe điện và xe xăng tại Việt Nam, bao gồm cả quá trình sản xuất điện và nhiên liệu.',
      date: '8 Tháng 1, 2025',
      icon: '⚡',
      gradient: 'from-blue-400/20 to-cyan-400/20',
    },
    {
      id: 5,
      category: 'news',
      title: 'Thị trường tín chỉ carbon toàn cầu đạt kỷ lục 1 tỷ USD năm 2024',
      description: 'Báo cáo tổng quan về sự phát triển của thị trường tín chỉ carbon thế giới và cơ hội cho các dự án tại Việt Nam.',
      date: '5 Tháng 1, 2025',
      icon: '🌍',
      gradient: 'from-green-400/20 to-teal-400/20',
    },
    {
      id: 6,
      category: 'community',
      title: 'Top 10 chủ xe điện bán nhiều tín chỉ carbon nhất tháng 12/2024',
      description: 'Vinh danh những chủ xe điện xuất sắc nhất trong việc đóng góp vào việc giảm phát thải CO₂ và kiếm thu nhập từ tín chỉ carbon.',
      date: '2 Tháng 1, 2025',
      icon: '🏆',
      gradient: 'from-orange-400/20 to-red-400/20',
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

  // Welcome message on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success('📰 Chào mừng đến với Tin tức & Kiến thức!', {
        duration: 4000,
        icon: '🌱',
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error('Vui lòng nhập email của bạn');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`✅ Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi tin tức mới nhất đến ${newsletterEmail}`);
      setNewsletterEmail('');
    }, 2000);
  };

  const getCategoryClass = (category) => {
    const classes = {
      basic: 'category-basic',
      news: 'category-news',
      community: 'category-community',
    };
    return classes[category] || 'category-basic';
  };

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  const calculateReadingTime = (description) => {
    const wordCount = description.split(' ').length;
    return Math.ceil(wordCount / 200);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 mb-6 shadow-sm animate-on-scroll">
            <span className="text-2xl mr-3">📰</span>
            <span className="text-green-primary font-semibold">Tin tức & Kiến thức</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-on-scroll">
            Tin tức & Kiến thức về
            <span className="text-green-primary"> Tín chỉ Carbon</span>
            <br />và <span className="text-green-primary">Xe điện</span>
          </h1>
          
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto animate-on-scroll">
            Cập nhật những thông tin mới nhất về thị trường tín chỉ carbon, xu hướng xe điện 
            và câu chuyện thành công từ cộng đồng EV Owner Việt Nam.
          </p>
          
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-on-scroll">
            <div className="stats-card">
              <div className="text-3xl mb-2">📚</div>
              <div className="stats-number text-blue-600">50+</div>
              <div className="text-sm text-gray-600">Bài viết hữu ích</div>
            </div>
            <div className="stats-card">
              <div className="text-3xl mb-2">🔄</div>
              <div className="stats-number text-green-primary">24/7</div>
              <div className="text-sm text-gray-600">Cập nhật tin tức</div>
            </div>
            <div className="stats-card">
              <div className="text-3xl mb-2">👥</div>
              <div className="stats-number text-orange-600">2,500+</div>
              <div className="text-sm text-gray-600">Độc giả thường xuyên</div>
            </div>
            <div className="stats-card">
              <div className="text-3xl mb-2">⭐</div>
              <div className="stats-number text-purple-600">4.9/5</div>
              <div className="text-sm text-gray-600">Đánh giá nội dung</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="category-filter max-w-4xl mx-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="article-grid grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
            {filteredArticles.map((article, index) => (
              <article 
                key={article.id} 
                className="article-card animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="article-image">
                  <span className="text-5xl">{article.icon}</span>
                  <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient}`}></div>
                </div>
                <div className="article-content">
                  <span className={`article-category ${getCategoryClass(article.category)}`}>
                    {categories.find(c => c.id === article.category)?.label}
                  </span>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-description">{article.description}</p>
                  <div className="article-meta">
                    <span className="article-date">
                      <span className="mr-2">📅</span>
                      {article.date}
                      <span className="ml-2 text-green-primary">• {calculateReadingTime(article.description)} phút đọc</span>
                    </span>
                    <a href="#" className="read-more-btn">
                      Đọc thêm <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="newsletter-section text-center animate-on-scroll">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Đăng ký nhận tin tức mới nhất</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Nhận thông báo về các bài viết mới, cập nhật chính sách và xu hướng thị trường 
              tín chỉ carbon qua email hàng tuần.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                className="newsletter-input flex-1"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="newsletter-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đăng ký ngay'}
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
              Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất cứ lúc nào.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cta-section animate-on-scroll">
            <div className="relative z-10">
              <div className="text-5xl mb-6">🚗💚</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Bắt đầu hành trình kiếm tiền từ xe điện của bạn
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Đăng nhập để theo dõi tín chỉ carbon, xem báo cáo chi tiết và bắt đầu 
                kiếm thu nhập thụ động từ việc sử dụng xe điện thân thiện môi trường.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth" className="cta-button">
                  <span className="mr-2">🔑</span>
                  Đăng nhập ngay
                </Link>
                <Link to="/auth" className="bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-colors inline-flex items-center">
                  <span className="mr-2">✨</span>
                  Đăng ký miễn phí
                </Link>
              </div>
              <div className="mt-6 text-sm opacity-75">
                <p>✅ Miễn phí đăng ký • ✅ Không phí ẩn • ✅ Hỗ trợ 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;

