import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  Grid3x3,
  List,
  ChevronDown,
  DollarSign,
  Tag,
  BarChart3,
  CheckCircle2,
  Clock,
  Gavel,
  Eye,
  TrendingUp,
  Leaf,
  Car,
  Building2,
  Users,
  Sparkles,
  Store,
  Shield,
  FileText,
  Activity,
  Zap,
  Coins
} from 'lucide-react';
import './Marketplace.css';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    price: [],
    type: [],
    status: [],
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState(null);
  const navigate = useNavigate();
  const observerRef = useRef(null);

  // Tỷ giá quy đổi: 1 USD = 25,000 VNĐ
  const USD_TO_VND = 25000;
  
  // Hàm quy đổi USD sang VNĐ
  const usdToVnd = (usd) => {
    return Math.round(usd * USD_TO_VND);
  };
  
  // Hàm format số VNĐ
  const formatVnd = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

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

  const priceRanges = [
    { value: '0-625000', label: '0 - 625,000 VNĐ', minUsd: 0, maxUsd: 25 },
    { value: '625000-1250000', label: '625,000 - 1,250,000 VNĐ', minUsd: 25, maxUsd: 50 },
    { value: '1250000-2500000', label: '1,250,000 - 2,500,000 VNĐ', minUsd: 50, maxUsd: 100 },
    { value: '2500000+', label: 'Trên 2,500,000 VNĐ', minUsd: 100, maxUsd: null },
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
    if (searchQuery && !credit.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !credit.owner.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filters.price.length > 0) {
      const priceMatch = filters.price.some(rangeValue => {
        const range = priceRanges.find(r => r.value === rangeValue);
        if (!range) return false;
        if (range.maxUsd === null) {
          return credit.price >= range.minUsd;
        }
        return credit.price >= range.minUsd && credit.price <= range.maxUsd;
      });
      if (!priceMatch) return false;
    }

    if (filters.type.length > 0 && !filters.type.includes(credit.type)) {
      return false;
    }

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

  const getStatusBadge = (status) => {
    const badges = {
      available: { text: 'Đang bán', class: 'status-available' },
      auction: { text: 'Đấu giá', class: 'status-auction' },
      sold: { text: 'Đã bán', class: 'status-sold' },
    };
    return badges[status] || badges.available;
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="marketplace-hero" className="hero-bg-marketplace min-h-[80vh] flex items-center relative overflow-hidden">
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
                <Store className="w-4 h-4" />
                <span className="text-sm font-medium">Thị trường tín chỉ carbon</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Khám phá{' '}
                <span className="text-yellow-300">thị trường tín chỉ carbon</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
                Xem và theo dõi các tín chỉ carbon được niêm yết từ chủ sở hữu xe điện — 
                minh bạch, xác minh và sẵn sàng giao dịch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={scrollToMarketplace} 
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg btn-hover shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <BarChart3 className="w-5 h-5" />
                  Xem thị trường ngay
                </button>
                <Link 
                  to="/auth" 
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg btn-hover text-center flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <Shield className="w-5 h-5" />
                  Đăng nhập để giao dịch
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="slide-in-right">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Thống kê thị trường hôm nay</h3>
                </div>
                
                {/* Live Market Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-1">{filteredCredits.length}</div>
                    <div className="text-sm text-gray-200">Tín chỉ đang bán</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-1">
                      {filteredCredits.reduce((sum, c) => sum + c.amount, 0).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-200">Tín chỉ carbon</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-1">
                      {filteredCredits.length > 0 
                        ? formatVnd(usdToVnd(filteredCredits.reduce((sum, c) => sum + c.price, 0) / filteredCredits.length))
                        : '0'}₫
                    </div>
                    <div className="text-sm text-gray-200">Giá trung bình</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-300 mb-1">89%</div>
                    <div className="text-sm text-gray-200">Đã xác minh</div>
                  </div>
                </div>
                
                {/* Market Trend */}
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Xu hướng giá
                    </span>
                    <span className="text-green-300 font-bold flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +12.5%
                    </span>
                  </div>
                  <div className="text-sm text-gray-200">So với tuần trước</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section id="filter-bar" className="bg-white shadow-sm py-6 sticky top-16 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Box */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm theo tên EV Owner hoặc ID tín chỉ..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-3">
              {/* Price Filter */}
              <div className={`filter-dropdown-new ${activeFilter === 'price' ? 'active' : ''}`}>
                <button 
                  onClick={() => toggleFilter('price')} 
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Coins className="w-4 h-4" />
                  <span>Khoảng giá</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="filter-dropdown-content-new">
                  <div className="p-2">
                    {priceRanges.map(range => (
                      <label key={range.value} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" 
                          checked={filters.price.includes(range.value)}
                          onChange={() => handleFilterChange('price', range.value)}
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Type Filter */}
              <div className={`filter-dropdown-new ${activeFilter === 'type' ? 'active' : ''}`}>
                <button 
                  onClick={() => toggleFilter('type')} 
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                  <span>Loại</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="filter-dropdown-content-new">
                  <div className="p-2">
                    {typeOptions.map(option => (
                      <label key={option.value} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" 
                          checked={filters.type.includes(option.value)}
                          onChange={() => handleFilterChange('type', option.value)}
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div className={`filter-dropdown-new ${activeFilter === 'status' ? 'active' : ''}`}>
                <button 
                  onClick={() => toggleFilter('status')} 
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Trạng thái</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="filter-dropdown-content-new">
                  <div className="p-2">
                    {statusOptions.map(option => (
                      <label key={option.value} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" 
                          checked={filters.status.includes(option.value)}
                          onChange={() => handleFilterChange('status', option.value)}
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select 
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
              <p className="text-gray-600 mt-1 text-sm">Hiển thị <span className="font-semibold">{filteredCredits.length}</span> kết quả</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => toggleView('grid')} 
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                title="Grid view"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => toggleView('list')} 
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                title="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Credit Cards Grid */}
          {filteredCredits.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-600">Vui lòng thử lại với bộ lọc khác</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredCredits.map((credit) => {
                const statusBadge = getStatusBadge(credit.status);
                return (
                  <div key={credit.id} className="trading-card-new bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{credit.id}</h3>
                        <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                          <Users className="w-4 h-4" />
                          {credit.owner}
                        </p>
                      </div>
                      {credit.verified && (
                        <div className="verified-badge-new flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs font-semibold">Đã xác minh</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm flex items-center gap-1">
                          <Leaf className="w-4 h-4" />
                          Số lượng:
                        </span>
                        <span className="font-semibold text-gray-900">{credit.amount} tín chỉ</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm flex items-center gap-1">
                          <Coins className="w-4 h-4" />
                          {credit.status === 'sold' ? 'Đã bán với giá:' : credit.type === 'auction' ? 'Giá hiện tại:' : 'Giá:'}
                        </span>
                        <span className={`font-bold text-2xl ${credit.status === 'sold' ? 'text-gray-500' : 'text-green-600'}`}>
                          {formatVnd(usdToVnd(credit.price))}₫
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          CVA:
                        </span>
                        <span className="font-medium text-gray-900 text-sm">{credit.cva}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                      <span className={`status-badge-new ${statusBadge.class}`}>{statusBadge.text}</span>
                      {credit.status === 'auction' && credit.auctionTime && (
                        <div className="auction-timer-new flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-semibold">{credit.auctionTime}</span>
                        </div>
                      )}
                      {credit.status === 'sold' && credit.soldDate && (
                        <span className="text-xs text-gray-500">Bán ngày {credit.soldDate}</span>
                      )}
                    </div>
                    
                    {credit.status === 'sold' ? (
                      <button className="w-full bg-gray-200 text-gray-600 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2" disabled>
                        <CheckCircle2 className="w-4 h-4" />
                        Đã bán
                      </button>
                    ) : credit.status === 'auction' ? (
                      <button 
                        onClick={() => viewDetails(credit.id)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Gavel className="w-4 h-4" />
                        Tham gia đấu giá
                      </button>
                    ) : (
                      <button 
                        onClick={() => viewDetails(credit.id)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
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
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2">
                <Activity className="w-5 h-5" />
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-green-600" />
                Quy trình giao dịch tín chỉ carbon
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
                Mỗi tín chỉ carbon tương đương với 1 tấn CO₂ giảm phát thải. 
                Dữ liệu được xác minh bởi tổ chức kiểm toán (CVA) và niêm yết minh bạch trên nền tảng.
              </p>
              
              {/* Process Steps */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="process-step-new bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">1. EV Owner tạo tín chỉ</h4>
                  <p className="text-sm text-gray-600">Từ dữ liệu hành trình xe điện</p>
                </div>
                <div className="process-step-new bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">2. CVA xác minh</h4>
                  <p className="text-sm text-gray-600">Kiểm tra và chứng nhận tín chỉ</p>
                </div>
                <div className="process-step-new bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">3. Niêm yết Marketplace</h4>
                  <p className="text-sm text-gray-600">Đăng bán hoặc đấu giá công khai</p>
                </div>
                <div className="process-step-new bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
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
            <div className="stats-card-new green animate-on-scroll">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">15,680</div>
              <div className="text-gray-600">Tín chỉ đã bán</div>
            </div>
            <div className="stats-card-new blue animate-on-scroll" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{formatVnd(9800000000)}₫</div>
              <div className="text-gray-600">Tổng giá trị giao dịch</div>
            </div>
            <div className="stats-card-new purple animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1,250+</div>
              <div className="text-gray-600">Xe điện đã đăng ký</div>
            </div>
            <div className="stats-card-new orange animate-on-scroll" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">89</div>
              <div className="text-gray-600">Doanh nghiệp mua tín chỉ</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white animate-on-scroll">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bắt đầu giao dịch tín chỉ carbon ngay hôm nay
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Đăng ký để trở thành EV Owner và kiếm thu nhập từ xe điện, hoặc trở thành Buyer để mua tín chỉ carbon.
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
                to="/how-it-works" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
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
