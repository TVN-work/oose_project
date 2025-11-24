import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  HelpCircle,
  BookOpen,
  Send,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Users,
  Shield,
  Briefcase,
  FileText,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Sparkles,
  Info,
  CheckCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
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
    const totalFields = 6;
    
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
      const maxSize = 10 * 1024 * 1024;
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

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      toast.success('Gửi yêu cầu thành công! Chúng tôi sẽ phản hồi trong vòng 2 giờ.');
      
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
      
      setTimeout(() => setShowSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="hero-bg-contact min-h-[70vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 via-blue-500/85 to-emerald-600/90"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="text-center text-white slide-in-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Liên hệ & Hỗ trợ 24/7</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Chúng tôi luôn sẵn sàng{' '}
              <span className="text-yellow-300">hỗ trợ bạn</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Gửi yêu cầu hỗ trợ, đăng ký hợp tác, hoặc xác minh tài khoản. 
              Đội ngũ chuyên gia của chúng tôi sẽ phản hồi nhanh chóng và chuyên nghiệp.
            </p>
            
            {/* Quick Contact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">&lt; 2h</div>
                <div className="text-sm text-gray-200">Thời gian phản hồi</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">24/7</div>
                <div className="text-sm text-gray-200">Hỗ trợ trực tuyến</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">98%</div>
                <div className="text-sm text-gray-200">Độ hài lòng</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">5★</div>
                <div className="text-sm text-gray-200">Đánh giá dịch vụ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="animate-on-scroll">
              <div className="form-container-new p-6 lg:p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Gửi yêu cầu hỗ trợ</h2>
                  <p className="text-gray-600 text-sm">
                    Điền thông tin chi tiết để chúng tôi có thể hỗ trợ bạn một cách tốt nhất
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-new mb-6">
                  <div className="progress-fill-new" style={{ width: `${formProgress}%` }}></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
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
                        className="form-input-new w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
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
                        className="form-input-new w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
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
                        className="form-input-new w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
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
                        className="form-input-new w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      >
                        <option value="">Chọn vai trò của bạn</option>
                        <option value="ev-owner">Chủ sở hữu xe điện</option>
                        <option value="buyer">Người mua tín chỉ carbon</option>
                        <option value="cva">Tổ chức xác minh (CVA)</option>
                        <option value="admin">Quản trị viên</option>
                        <option value="partner">Đối tác tiềm năng</option>
                        <option value="media">Báo chí/Truyền thông</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>

                  {/* Request Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại yêu cầu <span className="text-red-500">*</span>
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <input 
                          type="radio" 
                          name="requestType" 
                          value="support" 
                          checked={formData.requestType === 'support'}
                          onChange={handleInputChange}
                          className="text-green-600"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Hỗ trợ kỹ thuật</span>
                      </label>
                      <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <input 
                          type="radio" 
                          name="requestType" 
                          value="verification" 
                          checked={formData.requestType === 'verification'}
                          onChange={handleInputChange}
                          className="text-green-600"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Xác minh tài khoản</span>
                      </label>
                      <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <input 
                          type="radio" 
                          name="requestType" 
                          value="partnership" 
                          checked={formData.requestType === 'partnership'}
                          onChange={handleInputChange}
                          className="text-green-600"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Hợp tác kinh doanh</span>
                      </label>
                      <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <input 
                          type="radio" 
                          name="requestType" 
                          value="other" 
                          checked={formData.requestType === 'other'}
                          onChange={handleInputChange}
                          className="text-green-600"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Khác</span>
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
                      rows="5" 
                      value={formData.message}
                      onChange={handleInputChange}
                      maxLength={1000}
                      className="form-input-new w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none" 
                      placeholder="Mô tả chi tiết yêu cầu của bạn..."
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {charCount}/1000 ký tự
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tệp đính kèm (tùy chọn)
                    </label>
                    <div 
                      className="file-upload-new p-4 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
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
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Kéo thả tệp vào đây hoặc{' '}
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()} 
                          className="text-green-600 font-medium hover:underline"
                        >
                          chọn tệp
                        </button>
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (tối đa 10MB mỗi tệp)</p>
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                              <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => handleFileRemove(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <X className="w-4 h-4" />
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
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Thông tin dành cho CVA/Quản trị viên</h4>
                          <p className="text-blue-800 text-sm">
                            Vui lòng đính kèm các tài liệu pháp lý và chứng nhận liên quan đến tổ chức của bạn. 
                            Đội ngũ kỹ thuật sẽ xem xét và phản hồi qua email trong vòng 24-48 giờ.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Privacy Notice */}
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="privacy" 
                      name="privacy" 
                      required 
                      checked={formData.privacy}
                      onChange={handleInputChange}
                      className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-600">
                      Tôi đồng ý với <a href="#" className="text-green-600 hover:underline">Chính sách bảo mật</a> 
                      {' '}và cho phép Carbon Credit Marketplace xử lý thông tin cá nhân của tôi.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-primary-new w-full py-3 px-6 text-white font-bold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Gửi yêu cầu hỗ trợ
                      </>
                    )}
                  </button>

                  {/* Success/Error Messages */}
                  {showSuccess && (
                    <div className="success-message-new p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        <div>
                          <h4 className="font-semibold text-white">Gửi yêu cầu thành công!</h4>
                          <p className="text-sm text-white/90 mt-1">Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong vòng 2 giờ.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {showError && (
                    <div className="error-message-new p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-white" />
                        <div>
                          <h4 className="font-semibold text-white">Có lỗi xảy ra!</h4>
                          <p className="text-sm text-white/90 mt-1">Vui lòng thử lại hoặc liên hệ trực tiếp qua hotline.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="animate-on-scroll contact-card-new p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Thông tin công ty</h3>
                  <p className="text-gray-600 text-sm">Carbon Credit Marketplace Vietnam</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Địa chỉ</h4>
                      <p className="text-gray-600 text-sm">Tầng 15, Tòa nhà Keangnam<br />Phạm Hùng, Nam Từ Liêm, Hà Nội</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Email hỗ trợ</h4>
                      <a href="mailto:support@carbonmarket.vn" className="text-green-600 hover:underline text-sm">support@carbonmarket.vn</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Hotline</h4>
                      <a href="tel:+84123456789" className="text-green-600 hover:underline text-sm">+84 123 456 789</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Giờ làm việc</h4>
                      <p className="text-gray-600 text-sm">Thứ 2 - Thứ 6: 8:00 - 18:00<br />Thứ 7: 8:00 - 12:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="animate-on-scroll contact-card-new p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Kết nối với chúng tôi</h3>
                <div className="flex justify-center gap-3">
                  <a href="#" className="social-icon-new bg-blue-500 text-white hover:bg-blue-600 p-3 rounded-lg transition-all" title="Facebook">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="social-icon-new bg-blue-400 text-white hover:bg-blue-500 p-3 rounded-lg transition-all" title="Twitter">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="social-icon-new bg-blue-700 text-white hover:bg-blue-800 p-3 rounded-lg transition-all" title="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="social-icon-new bg-red-500 text-white hover:bg-red-600 p-3 rounded-lg transition-all" title="YouTube">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Quick Support */}
              <div className="animate-on-scroll contact-card-new p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Hỗ trợ nhanh</h3>
                <div className="space-y-3">
                  <Link to="/contact" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Live Chat</h4>
                      <p className="text-xs text-gray-600">Trò chuyện trực tiếp với chuyên viên</p>
                    </div>
                  </Link>

                  <Link to="/faqs" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">FAQ</h4>
                      <p className="text-xs text-gray-600">Câu hỏi thường gặp</p>
                    </div>
                  </Link>

                  <Link to="/how-it-works" className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Hướng dẫn</h4>
                      <p className="text-xs text-gray-600">Tài liệu và video hướng dẫn</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CVA Special Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cva-section-new p-8 animate-on-scroll">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Dành cho Tổ chức Xác minh (CVA) & Quản trị viên
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Bạn là tổ chức kiểm toán, xác minh carbon credit hoặc quản trị viên hệ thống? 
                Chúng tôi có quy trình đặc biệt để cấp quyền truy cập cho bạn.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Yêu cầu tài liệu
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Giấy phép kinh doanh/Chứng nhận tổ chức</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Chứng chỉ ISO 14064 hoặc tương đương</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Danh sách chuyên viên kiểm toán</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Thư giới thiệu từ cơ quan có thẩm quyền</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Quy trình xử lý
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-sm text-gray-700">Gửi yêu cầu + tài liệu</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-sm text-gray-700">Xem xét và xác minh (24-48h)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-sm text-gray-700">Cấp quyền truy cập qua email</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-yellow-800 font-medium text-sm">
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
                className="btn-primary-new px-8 py-3 text-white font-bold rounded-lg inline-flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Gửi yêu cầu xác minh CVA
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
