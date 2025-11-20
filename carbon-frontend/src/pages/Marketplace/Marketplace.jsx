import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Marketplace.css';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    region: [],
    price: [],
    type: [],
    status: [],
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState(null);
  const navigate = useNavigate();
  const observerRef = useRef(null);

  const credits = [
    {
      id: 'CC-2025-001',
      owner: 'Nguyễn Văn A',
      amount: 2.5,
      price: 42,
      region: 'hanoi',
      type: 'fixed',
      status: 'available',
      cva: 'GreenCert Vietnam',
      verified: true,
    },
    {
      id: 'CC-2025-002',
      owner: 'Trần Thị B',
      amount: 1.8,
      price: 38,
      region: 'hcm',
      type: 'auction',
      status: 'auction',
      cva: 'EcoVerify Asia',
      verified: true,
      auctionTime: '2h 15m',
    },
    {
      id: 'CC-2025-003',
      owner: 'Lê Minh C',
      amount: 3.2,
      price: 55,
      region: 'danang',
      type: 'fixed',
      status: 'available',
      cva: 'CarbonCheck VN',
      verified: true,
    },
    {
      id: 'CC-2025-004',
      owner: 'Phạm Văn D',
      amount: 1.5,
      price: 28,
      region: 'hanoi',
      type: 'auction',
      status: 'auction',
      cva: 'GreenCert Vietnam',
      verified: true,
      auctionTime: '5h 42m',
    },
    {
      id: 'CC-2025-005',
      owner: 'Hoàng Thị E',
      amount: 4.1,
      price: 75,
      region: 'hcm',
      type: 'fixed',
      status: 'available',
      cva: 'EcoVerify Asia',
      verified: true,
    },
    {
      id: 'CC-2025-006',
      owner: 'Vũ Minh F',
      amount: 2.8,
      price: 48,
      region: 'danang',
      type: 'fixed',
      status: 'sold',
      cva: 'CarbonCheck VN',
      verified: true,
      soldDate: '15/01',
    },
  ];

  const regionOptions = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP.HCM' },
    { value: 'danang', label: 'Đà Nẵng' },
  ];

  const priceRanges = [
    { value: '0-25', label: '$0 - $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100+', label: '$100+' },
  ];

  const typeOptions = [
    { value: 'fixed', label: 'Giá cố định' },
    { value: 'auction', label: 'Đấu giá' },
  ];

  const statusOptions = [
    { value: 'available', label: 'Đang bán' },
    { value: 'auction', label: 'Đấu giá' },
    { value: 'sold', label: 'Đã bán' },
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
      toast.success('🏪 Chào mừng đến với Thị trường tín chỉ carbon!', {
        duration: 4000,
        icon: '🌱',
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  const toggleFilter = (filterType) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (value) => {
    setSortBy(value);
  };

  const toggleView = (mode) => {
    setViewMode(mode);
  };

  const viewDetails = (creditId) => {
    navigate(`/buyer/marketplace/${creditId}`);
  };

  const scrollToMarketplace = () => {
    const element = document.getElementById('credit-listings');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter and sort credits
  const filteredCredits = credits.filter(credit => {
    // Search filter
    if (searchQuery && !credit.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !credit.owner.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Region filter
    if (filters.region.length > 0 && !filters.region.includes(credit.region)) {
      return false;
    }

    // Price filter
    if (filters.price.length > 0) {
      const priceMatch = filters.price.some(range => {
        const [min, max] = range.split('-').map(Number);
        if (range.includes('+')) {
          return credit.price >= 100;
        }
        return credit.price >= min && credit.price <= max;
      });
      if (!priceMatch) return false;
    }

    // Type filter
    if (filters.type.length > 0 && !filters.type.includes(credit.type)) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(credit.status)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'amount-high':
        return b.amount - a.amount;
      case 'newest':
      default:
        return b.id.localeCompare(a.id);
    }
  });

  const getRegionLabel = (region) => {
    const option = regionOptions.find(opt => opt.value === region);
    return option ? option.label : region;
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: { text: 'Đang bán', class: 'status-available' },
      auction: { text: 'Đấu giá', class: 'status-auction' },
      sold: { text: 'Đã bán', class: 'status-sold' },
    };
    return badges[status] || badges.available;
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section id="marketplace-hero" className="hero-bg min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-white slide-in-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Khám phá 
                <span className="text-yellow-300"> thị trường tín chỉ carbon</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
                Xem và theo dõi các tín chỉ carbon được niêm yết từ chủ sở hữu xe điện — 
                minh bạch, xác minh và sẵn sàng giao dịch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={scrollToMarketplace} className="bg-white text-primary-green px-8 py-4 rounded-lg font-bold text-lg btn-hover shadow-lg">
                  📊 Xem thị trường ngay
                </button>
                <Link to="/auth" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg btn-hover text-center">
                  🔐 Đăng nhập để giao dịch
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="slide-in-right">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Thống kê thị trường hôm nay</h3>
                </div>
                
                {/* Live Market Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-1">{filteredCredits.length}</div>
                    <div className="text-sm text-gray-200">Tín chỉ đang bán</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-1">
                      {filteredCredits.reduce((sum, c) => sum + c.amount, 0).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-200">Tấn CO₂ giảm</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-1">
                      ${filteredCredits.length > 0 
                        ? (filteredCredits.reduce((sum, c) => sum + c.price, 0) / filteredCredits.length).toFixed(0)
                        : '0'}
                    </div>
                    <div className="text-sm text-gray-200">Giá trung bình</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-1">89%</div>
                    <div className="text-sm text-gray-200">Đã xác minh</div>
                  </div>
                </div>
                
                {/* Market Trend */}
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Xu hướng giá</span>
                    <span className="trend-up text-green-300 font-bold">↗ +12.5%</span>
                  </div>
                  <div className="text-sm text-gray-200">So với tuần trước</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section id="filter-bar" className="bg-white shadow-sm py-6 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Box */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tìm theo tên EV Owner hoặc ID tín chỉ..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              {/* Region Filter */}
              <div className={`filter-dropdown ${activeFilter === 'region' ? 'active' : ''}`}>
                <button 
                  onClick={() => toggleFilter('region')} 
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>🌍 Khu vực</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="filter-dropdown-content">
                  <div className="p-2">
                    {regionOptions.map(option => (
                      <label key={option.value} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2" 
                          checked={filters.region.includes(option.value)}
                          onChange={() => handleFilterChange('region', option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Filter */}
              <div className={`filter-dropdown ${activeFilter === 'price' ? 'active' : ''}`}>
                <button 
                  onClick={() => toggleFilter('price')} 
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>💰 Giá</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="filter-dropdown-content">
                  <div className="p-2">
                    {priceRanges.map(range => (
                      <label key={range.value} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2" 
                          checked={filters.price.includes(range.value)}
                          onChange={() => handleFilterChange('price', range.value)}
                        />
                        {range.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Type Filter */}
              <div className={`filter-dropdown ${activeFilter === 'type' ? 'active' : ''}`}>
                <button 
                  onClick={() => toggleFilter('type')} 
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>🏷️ Loại</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="filter-dropdown-content">
                  <div className="p-2">
                    {typeOptions.map(option => (
                      <label key={option.value} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2" 
                          checked={filters.type.includes(option.value)}
                          onChange={() => handleFilterChange('type', option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div className={`filter-dropdown ${activeFilter === 'status' ? 'active' : ''}`}>
                <button 
                  onClick={() => toggleFilter('status')} 
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>📊 Trạng thái</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="filter-dropdown-content">
                  <div className="p-2">
                    {statusOptions.map(option => (
                      <label key={option.value} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2" 
                          checked={filters.status.includes(option.value)}
                          onChange={() => handleFilterChange('status', option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Sắp xếp:</span>
              <select 
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-low">Giá thấp → cao</option>
                <option value="price-high">Giá cao → thấp</option>
                <option value="amount-high">Số lượng nhiều nhất</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Carbon Credit Listings */}
      <section id="credit-listings" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Danh sách tín chỉ carbon</h2>
              <p className="text-gray-600 mt-1">Hiển thị <span>{filteredCredits.length}</span> kết quả</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleView('grid')} 
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-green text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => toggleView('list')} 
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-green text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Credit Cards Grid */}
          {filteredCredits.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-600">Vui lòng thử lại với bộ lọc khác</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredCredits.map((credit) => {
                const statusBadge = getStatusBadge(credit.status);
                return (
                  <div key={credit.id} className="trading-card bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{credit.id}</h3>
                        <p className="text-gray-600 text-sm">{credit.owner}</p>
                      </div>
                      {credit.verified && (
                        <div className="verified-badge">
                          ✓ Đã xác minh
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số lượng:</span>
                        <span className="font-semibold">{credit.amount} tấn CO₂</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {credit.status === 'sold' ? 'Đã bán với giá:' : credit.type === 'auction' ? 'Giá hiện tại:' : 'Giá:'}
                        </span>
                        <span className={`font-bold text-2xl ${credit.status === 'sold' ? 'text-gray-500' : 'price-animation'}`}>
                          ${credit.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Khu vực:</span>
                        <span className="font-medium">🏙️ {getRegionLabel(credit.region)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CVA:</span>
                        <span className="font-medium">{credit.cva}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className={`status-badge ${statusBadge.class}`}>{statusBadge.text}</span>
                      {credit.status === 'auction' && credit.auctionTime && (
                        <div className="auction-timer">
                          ⏰ {credit.auctionTime}
                        </div>
                      )}
                      {credit.status === 'sold' && credit.soldDate && (
                        <span className="text-sm text-gray-500">Bán ngày {credit.soldDate}</span>
                      )}
                      {credit.status === 'available' && (
                        <span className="text-sm text-gray-500">Loại: {credit.type === 'fixed' ? 'Giá cố định' : 'Đấu giá'}</span>
                      )}
                    </div>
                    
                    {credit.status === 'sold' ? (
                      <button className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-semibold cursor-not-allowed" disabled>
                        Đã bán
                      </button>
                    ) : credit.status === 'auction' ? (
                      <button 
                        onClick={() => viewDetails(credit.id)}
                        className="w-full bg-blue text-white py-3 rounded-lg font-semibold btn-hover"
                      >
                        Tham gia đấu giá
                      </button>
                    ) : (
                      <button 
                        onClick={() => viewDetails(credit.id)}
                        className="w-full bg-primary-green text-white py-3 rounded-lg font-semibold btn-hover"
                      >
                        Xem chi tiết
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {filteredCredits.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-primary-green text-white px-8 py-3 rounded-lg font-semibold btn-hover">
                Xem thêm tín chỉ
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Process Description */}
      <section id="process-description" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <div className="bg-light-green rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Quy trình giao dịch tín chỉ carbon</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
                Mỗi tín chỉ carbon tương đương với 1 tấn CO₂ giảm phát thải. 
                Dữ liệu được xác minh bởi tổ chức kiểm toán (CVA) và niêm yết minh bạch trên nền tảng.
              </p>
              
              {/* Process Steps */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="process-step">
                  <div className="text-4xl mb-3">🚗</div>
                  <h4 className="font-bold text-gray-900 mb-2">1. EV Owner tạo tín chỉ</h4>
                  <p className="text-sm text-gray-600">Từ dữ liệu hành trình xe điện</p>
                </div>
                <div className="process-step">
                  <div className="text-4xl mb-3">🔍</div>
                  <h4 className="font-bold text-gray-900 mb-2">2. CVA xác minh</h4>
                  <p className="text-sm text-gray-600">Kiểm tra và chứng nhận tín chỉ</p>
                </div>
                <div className="process-step">
                  <div className="text-4xl mb-3">🏪</div>
                  <h4 className="font-bold text-gray-900 mb-2">3. Niêm yết Marketplace</h4>
                  <p className="text-sm text-gray-600">Đăng bán hoặc đấu giá công khai</p>
                </div>
                <div className="process-step">
                  <div className="text-4xl mb-3">🏢</div>
                  <h4 className="font-bold text-gray-900 mb-2">4. Buyer mua & nhận chứng nhận</h4>
                  <p className="text-sm text-gray-600">Thanh toán và nhận chứng chỉ carbon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thống kê thị trường</h2>
            <p className="text-xl text-gray-600">Dữ liệu tổng hợp về giao dịch tín chỉ carbon</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="stats-card green animate-on-scroll">
              <div className="text-4xl mb-3">🌱</div>
              <div className="text-3xl font-bold text-primary-green mb-2">15,680</div>
              <div className="text-gray-600">Tín chỉ đã bán</div>
            </div>
            <div className="stats-card blue animate-on-scroll" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl mb-3">💰</div>
              <div className="text-3xl font-bold text-blue mb-2">$392K</div>
              <div className="text-gray-600">Tổng giá trị giao dịch</div>
            </div>
            <div className="stats-card purple animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-3">🚗</div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1,250+</div>
              <div className="text-gray-600">Xe điện đã đăng ký</div>
            </div>
            <div className="stats-card orange animate-on-scroll" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl mb-3">🏢</div>
              <div className="text-3xl font-bold text-orange-600 mb-2">89</div>
              <div className="text-gray-600">Doanh nghiệp mua tín chỉ</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-green to-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white animate-on-scroll">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bắt đầu giao dịch tín chỉ carbon ngay hôm nay
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Đăng ký để trở thành EV Owner và kiếm thu nhập từ xe điện, hoặc trở thành Buyer để mua tín chỉ carbon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="bg-white text-primary-green px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                <span className="mr-2">✨</span>
                Đăng ký miễn phí
              </Link>
              <Link to="/how-it-works" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-primary-green transition-colors inline-flex items-center justify-center">
                <span className="mr-2">📋</span>
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Marketplace;

