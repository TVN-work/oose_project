import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  Mail,
  Send,
  LogIn,
  Sparkles,
  CheckCircle2,
  Car,
  Leaf,
  BarChart3,
  Zap,
  Globe,
  Award,
  Shield,
  Loader2,
  User,
  TrendingUp,
  BookOpen,
  Users
} from 'lucide-react';
import './Blog.css';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const observerRef = useRef(null);

  const categories = [
    { id: 'all', label: 'Tất cả', icon: Sparkles, color: 'from-green-500 to-green-600' },
    { id: 'basic', label: 'Kiến thức cơ bản', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { id: 'news', label: 'Tin tức & Chính sách', icon: TrendingUp, color: 'from-yellow-500 to-yellow-600' },
    { id: 'community', label: 'Cộng đồng EV', icon: Users, color: 'from-purple-500 to-purple-600' },
  ];

  const articles = [
    {
      id: 1,
      category: 'basic',
      categoryLabel: 'Kiến thức cơ bản',
      title: 'Tín chỉ Carbon là gì? Hướng dẫn từ A-Z cho người mới bắt đầu',
      description: 'Tìm hiểu khái niệm tín chỉ carbon, cách thức hoạt động và tại sao nó quan trọng trong việc chống biến đổi khí hậu. Hướng dẫn chi tiết dành cho người mới.',
      date: '15 Tháng 1, 2025',
      author: 'Carbon Credit Marketplace',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop',
      categoryColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 2,
      category: 'news',
      categoryLabel: 'Tin tức & Chính sách',
      title: 'Chính phủ Việt Nam công bố chính sách mới hỗ trợ xe điện 2025',
      description: 'Phân tích chi tiết các chính sách ưu đãi mới cho xe điện, tác động đến thị trường tín chỉ carbon và cơ hội cho chủ sở hữu xe điện.',
      date: '12 Tháng 1, 2025',
      author: 'Carbon Credit Marketplace',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=600&fit=crop',
      categoryColor: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 3,
      category: 'community',
      categoryLabel: 'Cộng đồng EV',
      title: 'Câu chuyện thành công: Anh Minh kiếm 2.5 triệu/tháng từ xe điện',
      description: 'Chia sẻ từ anh Nguyễn Văn Minh - tài xế Grab sử dụng xe điện VinFast VF5, đã kiếm thêm thu nhập ổn định từ việc bán tín chỉ carbon.',
      date: '10 Tháng 1, 2025',
      author: 'Carbon Credit Marketplace',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=600&fit=crop',
      categoryColor: 'bg-purple-100 text-purple-700',
    },
    {
      id: 4,
      category: 'basic',
      categoryLabel: 'Kiến thức cơ bản',
      title: 'So sánh phát thải CO₂: Xe điện vs Xe xăng - Số liệu thực tế',
      description: 'Phân tích chi tiết mức phát thải CO₂ của xe điện và xe xăng tại Việt Nam, bao gồm cả quá trình sản xuất điện và nhiên liệu.',
      date: '8 Tháng 1, 2025',
      author: 'Carbon Credit Marketplace',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      categoryColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 5,
      category: 'news',
      categoryLabel: 'Tin tức & Chính sách',
      title: 'Thị trường tín chỉ carbon toàn cầu đạt kỷ lục 1 tỷ USD năm 2024',
      description: 'Báo cáo tổng quan về sự phát triển của thị trường tín chỉ carbon thế giới và cơ hội cho các dự án tại Việt Nam.',
      date: '5 Tháng 1, 2025',
      author: 'Carbon Credit Marketplace',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop',
      categoryColor: 'bg-green-100 text-green-700',
    },
    {
      id: 6,
      category: 'community',
      categoryLabel: 'Cộng đồng EV',
      title: 'Top 10 chủ xe điện bán nhiều tín chỉ carbon nhất tháng 12/2024',
      description: 'Vinh danh những chủ xe điện xuất sắc nhất trong việc đóng góp vào việc giảm phát thải CO₂ và kiếm thu nhập từ tín chỉ carbon.',
      date: '2 Tháng 1, 2025',
      author: 'Carbon Credit Marketplace',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=600&fit=crop',
      categoryColor: 'bg-orange-100 text-orange-700',
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
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi tin tức mới nhất đến ${newsletterEmail}`);
      setNewsletterEmail('');
    }, 2000);
  };

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  const calculateReadingTime = (description) => {
    const wordCount = description.split(' ').length;
    return Math.ceil(wordCount / 200);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="hero-section-blog min-h-[60vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 via-blue-500/85 to-emerald-600/90"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-on-scroll">
              <Newspaper className="w-4 h-4" />
              <span className="text-sm font-medium">Tin tức & Kiến thức</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-on-scroll">
              Tin tức & Kiến thức về{' '}
              <span className="text-yellow-300">Tín chỉ Carbon</span>
              <br />và <span className="text-blue-200">Xe điện</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed animate-on-scroll">
              Cập nhật những thông tin mới nhất về thị trường tín chỉ carbon, xu hướng xe điện 
              và câu chuyện thành công từ cộng đồng EV Owner Việt Nam.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`category-btn-blog flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    activeCategory === category.id
                      ? `bg-gradient-to-br ${category.color} text-white shadow-md`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CategoryIcon className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Bài Viết Mới Nhất</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá những bài viết hữu ích về tín chỉ carbon và xe điện
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredArticles.map((article, index) => {
              return (
                <article 
                  key={article.id} 
                  className="article-card-blog bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-500 transition-all animate-on-scroll group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="article-image-blog h-48 relative overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`${article.categoryColor} px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm`}>
                        {article.categoryLabel}
                      </span>
                    </div>
                  </div>
                  
                  <div className="article-content-blog p-6">
                    <div className="flex items-center justify-end mb-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{calculateReadingTime(article.description)} phút đọc</span>
                      </div>
                    </div>
                    
                    <h3 className="article-title-blog text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="article-description-blog text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                    
                    <div className="article-meta-blog flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          <span className="truncate max-w-[100px]">{article.author}</span>
                        </div>
                      </div>
                      <Link 
                        to={`/blog/${article.id}`} 
                        className="read-more-btn-blog inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 font-semibold text-sm transition-colors"
                      >
                        Đọc thêm
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="newsletter-section-blog bg-white rounded-2xl p-8 lg:p-10 border border-gray-200 shadow-lg text-center animate-on-scroll">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Đăng ký nhận tin tức mới nhất</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Nhận thông báo về các bài viết mới, cập nhật chính sách và xu hướng thị trường 
              tín chỉ carbon qua email hàng tuần.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                className="newsletter-input-blog flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="newsletter-btn-blog bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Đăng ký ngay
                  </>
                )}
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
              Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất cứ lúc nào.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white animate-on-scroll">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bắt đầu hành trình kiếm tiền từ xe điện của bạn
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Đăng nhập để theo dõi tín chỉ carbon, xem báo cáo chi tiết và bắt đầu 
              kiếm thu nhập thụ động từ việc sử dụng xe điện thân thiện môi trường.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth" 
                className="bg-white text-green-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-transform"
              >
                <LogIn className="w-5 h-5" />
                Đăng nhập ngay
              </Link>
              <Link 
                to="/auth" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Đăng ký miễn phí
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm opacity-90 flex-wrap">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Miễn phí đăng ký</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Không phí ẩn</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
