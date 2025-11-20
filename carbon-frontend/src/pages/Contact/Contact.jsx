import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    requestType: '',
    message: '',
    privacy: false,
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showCVAInfo, setShowCVAInfo] = useState(false);
  const fileInputRef = useRef(null);
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

  // Calculate form progress
  useEffect(() => {
    let progress = 0;
    const totalFields = 6; // fullName, email, phone, role, requestType, message
    
    if (formData.fullName) progress += 16.67;
    if (formData.email) progress += 16.67;
    if (formData.phone) progress += 16.67;
    if (formData.role) progress += 16.67;
    if (formData.requestType) progress += 16.67;
    if (formData.message) progress += 16.67;
    
    setFormProgress(progress);
  }, [formData]);

  // Update character count
  useEffect(() => {
    setCharCount(formData.message.length);
  }, [formData.message]);

  // Show CVA info when role is CVA or Admin
  useEffect(() => {
    setShowCVAInfo(formData.role === 'cva' || formData.role === 'admin');
  }, [formData.role]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const validTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (file.size > maxSize) {
        toast.error(`File ${file.name} vượt quá 10MB`);
        return false;
      }
      if (!validTypes.includes(fileExtension)) {
        toast.error(`File ${file.name} không đúng định dạng`);
        return false;
      }
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileRemove = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const droppedFiles = Array.from(e.dataTransfer.files);
    const fileInput = fileInputRef.current;
    if (fileInput) {
      const dataTransfer = new DataTransfer();
      droppedFiles.forEach(file => dataTransfer.items.add(file));
      fileInput.files = dataTransfer.files;
      handleFileChange({ target: { files: dataTransfer.files } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);
    setShowError(false);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      toast.success('✅ Gửi yêu cầu thành công! Chúng tôi sẽ phản hồi trong vòng 2 giờ.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: '',
        requestType: '',
        message: '',
        privacy: false,
      });
      setFiles([]);
      setFormProgress(0);
      setCharCount(0);
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="hero-bg pb-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="text-center slide-in-left">
            <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <span className="text-2xl mr-3">📞</span>
              <span className="text-white font-medium">Liên hệ & Hỗ trợ 24/7</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Chúng tôi luôn sẵn sàng 
              <span className="text-yellow-300"> hỗ trợ bạn</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Gửi yêu cầu hỗ trợ, đăng ký hợp tác, hoặc xác minh tài khoản. 
              Đội ngũ chuyên gia của chúng tôi sẽ phản hồi nhanh chóng và chuyên nghiệp.
            </p>
            
            {/* Quick Contact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">&lt; 2h</div>
                <div className="text-sm text-gray-200">Thời gian phản hồi</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">24/7</div>
                <div className="text-sm text-gray-200">Hỗ trợ trực tuyến</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">98%</div>
                <div className="text-sm text-gray-200">Độ hài lòng</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">5★</div>
                <div className="text-sm text-gray-200">Đánh giá dịch vụ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-on-scroll">
              <div className="form-container p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 gradient-green rounded-2xl flex items-center justify-center mx-auto mb-4 floating">
                    <span className="text-white text-3xl">📝</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Gửi yêu cầu hỗ trợ</h2>
                  <p className="text-gray-600">
                    Điền thông tin chi tiết để chúng tôi có thể hỗ trợ bạn một cách tốt nhất
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar mb-8">
                  <div className="progress-fill" style={{ width: `${formProgress}%` }}></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="fullName"
                        required 
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 rounded-lg" 
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        required 
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 rounded-lg" 
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="tel" 
                        name="phone"
                        required 
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 rounded-lg" 
                        placeholder="0123 456 789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vai trò <span className="text-red-500">*</span>
                      </label>
                      <select 
                        name="role" 
                        required 
                        value={formData.role}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 rounded-lg"
                      >
                        <option value="">Chọn vai trò của bạn</option>
                        <option value="ev-owner">🚗 Chủ sở hữu xe điện</option>
                        <option value="buyer">🏢 Người mua tín chỉ carbon</option>
                        <option value="cva">✅ Tổ chức xác minh (CVA)</option>
                        <option value="admin">⚙️ Quản trị viên</option>
                        <option value="partner">🤝 Đối tác tiềm năng</option>
                        <option value="media">📰 Báo chí/Truyền thông</option>
                        <option value="other">❓ Khác</option>
                      </select>
                    </div>
                  </div>

                  {/* Request Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại yêu cầu <span className="text-red-500">*</span>
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-green transition-colors">
                        <input 
                          type="radio" 
                          name="requestType" 
                          value="support" 
                          checked={formData.requestType === 'support'}
                          onChange={handleInputChange}
                          className="text-primary-green"
                        />
                        <span className="ml-3">🛠️ Hỗ trợ kỹ thuật</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-green transition-colors">
                        <input 
                          type="radio" 
                          name="requestType" 
                          value="verification" 
                          checked={formData.requestType === 'verification'}
                          onChange={handleInputChange}
                          className="text-primary-green"
                        />
                        <span className="ml-3">✅ Xác minh tài khoản</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-green transition-colors">
                        <input 
                          type="radio" 
                          name="requestType" 
                          value="partnership" 
                          checked={formData.requestType === 'partnership'}
                          onChange={handleInputChange}
                          className="text-primary-green"
                        />
                        <span className="ml-3">🤝 Hợp tác kinh doanh</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-green transition-colors">
                        <input 
                          type="radio" 
                          name="requestType" 
                          value="other" 
                          checked={formData.requestType === 'other'}
                          onChange={handleInputChange}
                          className="text-primary-green"
                        />
                        <span className="ml-3">❓ Khác</span>
                      </label>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung yêu cầu <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      name="message"
                      required 
                      rows="6" 
                      value={formData.message}
                      onChange={handleInputChange}
                      maxLength={1000}
                      className="form-input w-full px-4 py-3 rounded-lg resize-none" 
                      placeholder="Mô tả chi tiết yêu cầu của bạn. Bao gồm thông tin cần thiết để chúng tôi có thể hỗ trợ bạn tốt nhất..."
                    />
                    <div className="text-sm text-gray-500 mt-2">
                      <span>{charCount}</span>/1000 ký tự
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tệp đính kèm (tùy chọn)
                    </label>
                    <div 
                      className="file-upload p-6 text-center"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        id="fileInput" 
                        name="attachment" 
                        multiple 
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="text-4xl mb-4">📎</div>
                      <p className="text-gray-600 mb-2">
                        Kéo thả tệp vào đây hoặc{' '}
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()} 
                          className="text-primary-green font-medium hover:underline"
                        >
                          chọn tệp
                        </button>
                      </p>
                      <p className="text-sm text-gray-500">Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (tối đa 10MB mỗi tệp)</p>
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm text-gray-700 truncate">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => handleFileRemove(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CVA Information */}
                  {showCVAInfo && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">ℹ️</span>
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">Thông tin dành cho CVA/Quản trị viên</h4>
                          <p className="text-blue-800 text-sm">
                            Vui lòng đính kèm các tài liệu pháp lý và chứng nhận liên quan đến tổ chức của bạn. 
                            Đội ngũ kỹ thuật sẽ xem xét và phản hồi qua email trong vòng 24-48 giờ.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Privacy Notice */}
                  <div className="flex items-start space-x-3">
                    <input 
                      type="checkbox" 
                      id="privacy" 
                      name="privacy" 
                      required 
                      checked={formData.privacy}
                      onChange={handleInputChange}
                      className="mt-1 rounded border-gray-300 text-primary-green focus:ring-primary-green"
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-600">
                      Tôi đồng ý với <a href="#" className="text-primary-green hover:underline">Chính sách bảo mật</a> 
                      và cho phép Carbon Credit Marketplace xử lý thông tin cá nhân của tôi để phục vụ mục đích hỗ trợ.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-primary w-full py-4 px-6 text-white font-bold text-lg rounded-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading-spinner"></span>
                        Đang gửi...
                      </>
                    ) : (
                      '🚀 Gửi yêu cầu hỗ trợ'
                    )}
                  </button>

                  {/* Success/Error Messages */}
                  {showSuccess && (
                    <div className="success-message">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">✅</span>
                        <div>
                          <h4 className="font-semibold">Gửi yêu cầu thành công!</h4>
                          <p className="text-sm mt-1">Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong vòng 2 giờ.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {showError && (
                    <div className="error-message">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">❌</span>
                        <div>
                          <h4 className="font-semibold">Có lỗi xảy ra!</h4>
                          <p className="text-sm mt-1">Vui lòng thử lại hoặc liên hệ trực tiếp qua hotline.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-8">
                {/* Company Info */}
                <div className="contact-card p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 gradient-green rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-3xl">🏢</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Thông tin công ty</h3>
                    <p className="text-gray-600">Carbon Credit Marketplace Vietnam</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-2xl mr-4">📍</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">Địa chỉ</h4>
                        <p className="text-gray-600">Tầng 15, Tòa nhà Keangnam<br />Phạm Hùng, Nam Từ Liêm, Hà Nội</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-2xl mr-4">📧</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">Email hỗ trợ</h4>
                        <a href="mailto:support@carbonmarket.vn" className="text-primary-green hover:underline">support@carbonmarket.vn</a>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-2xl mr-4">📞</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">Hotline</h4>
                        <a href="tel:+84123456789" className="text-primary-green hover:underline">+84 123 456 789</a>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-2xl mr-4">🕒</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">Giờ làm việc</h4>
                        <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 18:00<br />Thứ 7: 8:00 - 12:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="contact-card p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Kết nối với chúng tôi</h3>
                  <div className="flex justify-center space-x-4">
                    <a href="#" className="social-icon bg-blue-500 text-white hover:bg-blue-600 p-3 rounded-full" title="Facebook">
                      <span className="text-xl">📘</span>
                    </a>
                    <a href="#" className="social-icon bg-blue-400 text-white hover:bg-blue-500 p-3 rounded-full" title="Twitter">
                      <span className="text-xl">🐦</span>
                    </a>
                    <a href="#" className="social-icon bg-blue-700 text-white hover:bg-blue-800 p-3 rounded-full" title="LinkedIn">
                      <span className="text-xl">💼</span>
                    </a>
                    <a href="#" className="social-icon bg-red-500 text-white hover:bg-red-600 p-3 rounded-full" title="YouTube">
                      <span className="text-xl">📺</span>
                    </a>
                  </div>
                </div>

                {/* Quick Support */}
                <div className="contact-card p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Hỗ trợ nhanh</h3>
                  <div className="space-y-4">
                    <Link to="/contact" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <span className="text-2xl mr-4">💬</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">Live Chat</h4>
                        <p className="text-sm text-gray-600">Trò chuyện trực tiếp với chuyên viên</p>
                      </div>
                    </Link>

                    <Link to="/faqs" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <span className="text-2xl mr-4">❓</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">FAQ</h4>
                        <p className="text-sm text-gray-600">Câu hỏi thường gặp</p>
                      </div>
                    </Link>

                    <Link to="/how-it-works" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <span className="text-2xl mr-4">📚</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">Hướng dẫn</h4>
                        <p className="text-sm text-gray-600">Tài liệu và video hướng dẫn</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CVA Special Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cva-section p-8 animate-on-scroll relative z-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary-green rounded-2xl flex items-center justify-center mx-auto mb-6 floating">
                <span className="text-white text-4xl">🏛️</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Dành cho Tổ chức Xác minh (CVA) & Quản trị viên
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Bạn là tổ chức kiểm toán, xác minh carbon credit hoặc quản trị viên hệ thống? 
                Chúng tôi có quy trình đặc biệt để cấp quyền truy cập cho bạn.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  Yêu cầu tài liệu
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Giấy phép kinh doanh/Chứng nhận tổ chức
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Chứng chỉ ISO 14064 hoặc tương đương
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Danh sách chuyên viên kiểm toán
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Thư giới thiệu từ cơ quan có thẩm quyền
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  Quy trình xử lý
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-green text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                    <span className="text-gray-700">Gửi yêu cầu + tài liệu</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-green text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                    <span className="text-gray-700">Xem xét và xác minh (24-48h)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-green text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                    <span className="text-gray-700">Cấp quyền truy cập qua email</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">⚠️</span>
                  <p className="text-yellow-800 font-medium">
                    Vui lòng gửi yêu cầu xác minh quyền truy cập cùng tài liệu pháp lý của bạn. 
                    Đội ngũ kỹ thuật sẽ phản hồi qua email trong vòng 24-48 giờ.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, role: 'cva' }));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary px-8 py-4 text-white font-bold text-lg rounded-lg"
              >
                🏛️ Gửi yêu cầu xác minh CVA
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

