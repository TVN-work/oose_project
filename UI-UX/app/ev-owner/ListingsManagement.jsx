import React, { useState, useEffect } from 'react';
import './ListingsManagement.css';

const ListingsManagement = () => {
  // Form state
  const [vehicleType, setVehicleType] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [marketType, setMarketType] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Vehicle factors for price calculation
  const vehicleFactors = {
    'motorcycle': 0.9,
    'car': 1.1,
    'truck': 1.3,
    'logistics': 1.6
  };

  // Base prices for different markets
  const basePrices = {
    'voluntary': 5,
    'compliance': 150
  };

  // History data (in a real app, this would come from an API)
  const [history, setHistory] = useState([
    {
      date: '15/10/2025',
      vehicleType: 'Ô tô điện',
      creditAmount: '0.052',
      marketType: 'Tự nguyện',
      price: '5.5',
      status: 'approved'
    },
    {
      date: '12/10/2025',
      vehicleType: 'Xe máy điện',
      creditAmount: '0.030',
      marketType: 'Tự nguyện',
      price: '4.5',
      status: 'pending'
    },
    {
      date: '09/10/2025',
      vehicleType: 'Xe tải điện',
      creditAmount: '0.210',
      marketType: 'Bắt buộc',
      price: '180',
      status: 'rejected'
    },
    {
      date: '05/10/2025',
      vehicleType: 'Ô tô điện',
      creditAmount: '0.087',
      marketType: 'Tự nguyện',
      price: '5.2',
      status: 'approved'
    },
    {
      date: '02/10/2025',
      vehicleType: 'Logistics điện hóa',
      creditAmount: '0.340',
      marketType: 'Tự nguyện',
      price: '7.8',
      status: 'approved'
    }
  ]);

  // Calculate profit prediction
  const calculateProfit = () => {
    const credit = parseFloat(creditAmount) || 0;
    const price = parseFloat(listingPrice) || 0;
    if (credit > 0 && price > 0) {
      return credit * price;
    }
    return 0;
  };

  const profit = calculateProfit();
  const showProfitPrediction = profit > 0;

  // Auto calculate price based on vehicle type and market
  const autoCalculatePrice = () => {
    if (!vehicleType || !marketType) {
      showNotification('⚠️ Vui lòng chọn loại phương tiện và thị trường trước!', 'warning');
      return;
    }

    const basePrice = basePrices[marketType];
    const factor = vehicleFactors[vehicleType];
    const suggestedPrice = basePrice * factor;

    setListingPrice(suggestedPrice.toFixed(1));
    showNotification(
      `💡 Giá gợi ý: ${suggestedPrice.toFixed(1)} USD/tín chỉ\n\nDựa trên ${getVehicleName(vehicleType)} trong thị trường ${getMarketName(marketType)}`,
      'success'
    );
  };

  // Update price suggestion when vehicle type or market changes
  useEffect(() => {
    if (vehicleType && marketType && !listingPrice) {
      const basePrice = basePrices[marketType];
      const factor = vehicleFactors[vehicleType];
      const suggestedPrice = basePrice * factor;
      setListingPrice(suggestedPrice.toFixed(1));
    }
  }, [vehicleType, marketType]);

  // Submit listing
  const submitListing = () => {
    // Validation
    if (!vehicleType) {
      showNotification('⚠️ Vui lòng chọn loại phương tiện!', 'error');
      return;
    }

    if (!creditAmount || parseFloat(creditAmount) <= 0) {
      showNotification('⚠️ Vui lòng nhập số tín chỉ hợp lệ!', 'error');
      return;
    }

    if (!marketType) {
      showNotification('⚠️ Vui lòng chọn thị trường!', 'error');
      return;
    }

    if (!listingPrice || parseFloat(listingPrice) <= 0) {
      showNotification('⚠️ Vui lòng nhập giá niêm yết hợp lệ!', 'error');
      return;
    }

    // Simulate submission
    showNotification('📤 Đang gửi niêm yết...\n\nVui lòng chờ trong giây lát.', 'info');

    setTimeout(() => {
      showNotification(
        '✅ Niêm yết thành công!\n\nTín chỉ của bạn đã được gửi đến CVA để xác minh. Thời gian xử lý: 1-3 ngày làm việc.',
        'success'
      );

      // Add to history
      const today = new Date().toLocaleDateString('vi-VN');
      const newEntry = {
        date: today,
        vehicleType: getVehicleName(vehicleType),
        creditAmount: creditAmount,
        marketType: getMarketName(marketType),
        price: listingPrice,
        status: 'pending'
      };

      setHistory([newEntry, ...history]);

      // Reset form
      resetForm();
    }, 2000);
  };

  // Reset form
  const resetForm = () => {
    setVehicleType('');
    setCreditAmount('');
    setMarketType('');
    setListingPrice('');
    setDescription('');
  };

  // Helper functions
  const getVehicleName = (type) => {
    const names = {
      'motorcycle': 'Xe máy điện',
      'car': 'Ô tô điện',
      'truck': 'Xe tải điện',
      'logistics': 'Logistics điện hóa'
    };
    return names[type] || type;
  };

  const getMarketName = (type) => {
    const names = {
      'voluntary': 'Tự nguyện',
      'compliance': 'Bắt buộc'
    };
    return names[type] || type;
  };

  // Notification system
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    const colors = {
      success: '#2ECC71',
      error: '#e74c3c',
      warning: '#F39C12',
      info: '#3498DB'
    };

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type] || colors.info};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 400px;
      font-size: 14px;
      line-height: 1.4;
      white-space: pre-line;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  };

  // Get status display
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'approved':
        return <span className="status-approved">✅ Đã duyệt</span>;
      case 'pending':
        return <span className="status-pending">⏳ Chờ CVA</span>;
      case 'rejected':
        return <span className="status-rejected">❌ Từ chối</span>;
      default:
        return status;
    }
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth <= 1024) {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.querySelector('.mobile-menu-btn');

        if (
          sidebar &&
          menuBtn &&
          !sidebar.contains(e.target) &&
          !menuBtn.contains(e.target) &&
          sidebarOpen
        ) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <div className="dashboard-container">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
          <div className="sidebar-header">
            <div className="user-profile">
              <div className="user-avatar">NV</div>
              <div className="user-info">
                <h3>Nguyễn Văn A</h3>
                <div className="user-status">
                  <span>✅</span>
                  <span>Đã xác minh</span>
                </div>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <a href="#" className="nav-item">
              <span className="nav-icon">📊</span>
              <span>Tổng quan</span>
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">📤</span>
              <span>Tải dữ liệu hành trình</span>
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">💰</span>
              <span>Ví Carbon</span>
            </a>
            <a href="#" className="nav-item active">
              <span className="nav-icon">🏷️</span>
              <span>Niêm yết tín chỉ</span>
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">🔄</span>
              <span>Giao dịch</span>
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">📈</span>
              <span>Báo cáo</span>
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">⚙️</span>
              <span>Cài đặt</span>
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Page Header */}
          <div className="content-card">
            <div className="page-header">
              <h1 className="page-title">
                💹 Niêm yết tín chỉ carbon
              </h1>
              <p className="page-description">
                Đăng bán tín chỉ carbon của bạn lên sàn giao dịch. Hệ thống sẽ gợi ý giá hợp lý theo loại xe và thị trường.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="two-column-layout">
              {/* Left Column - Listing Form */}
              <div className="listing-form">
                <div className="form-group">
                  <label className="form-label">Loại phương tiện</label>
                  <select
                    className="form-select"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    <option value="">Chọn loại phương tiện</option>
                    <option value="motorcycle">Xe máy điện</option>
                    <option value="car">Ô tô điện</option>
                    <option value="truck">Xe tải điện</option>
                    <option value="logistics">Logistics điện hóa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Số tín chỉ muốn niêm yết</label>
                  <input
                    type="number"
                    className="form-input"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    placeholder="Ví dụ: 0.052"
                    step="0.001"
                    min="0"
                  />
                  <div className="form-description">Số tín chỉ carbon có sẵn trong ví của bạn</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Thị trường</label>
                  <select
                    className="form-select"
                    value={marketType}
                    onChange={(e) => setMarketType(e.target.value)}
                  >
                    <option value="">Chọn thị trường</option>
                    <option value="voluntary">Tự nguyện</option>
                    <option value="compliance">Bắt buộc</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Giá niêm yết (USD/tín chỉ)</label>
                  <div className="price-input-group">
                    <input
                      type="number"
                      className="form-input"
                      value={listingPrice}
                      onChange={(e) => setListingPrice(e.target.value)}
                      placeholder="Ví dụ: 5.5"
                      step="0.1"
                      min="0"
                    />
                    <button className="auto-price-btn" onClick={autoCalculatePrice}>
                      ⚙️ Tự động tính giá
                    </button>
                  </div>
                  <div className="form-description">Giá bán mong muốn cho mỗi tín chỉ carbon</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả thêm (tùy chọn)</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả chi tiết về nguồn gốc tín chỉ, loại xe, khu vực hoạt động..."
                  />
                  <div className="form-description">Thông tin bổ sung giúp người mua hiểu rõ hơn về tín chỉ</div>
                </div>

                <div className="form-actions">
                  <button className="btn-primary" onClick={submitListing}>
                    📤 Niêm yết tín chỉ
                  </button>
                </div>

                {/* Profit Prediction */}
                {showProfitPrediction && (
                  <div className="profit-prediction">
                    <h3 className="profit-title">
                      💵 Dự đoán lợi nhuận
                    </h3>
                    <div className="profit-calculation">
                      {creditAmount} tín chỉ × {listingPrice} USD = Tổng USD dự kiến
                    </div>
                    <div className="profit-result">
                      {profit.toFixed(3)} USD
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Reference Cards */}
              <div className="right-column">
                {/* Market Prices Card */}
                <div className="info-card market-prices">
                  <h3 className="card-title">
                    📈 Giá tín chỉ tại Việt Nam (2025)
                  </h3>

                  <table className="price-table">
                    <thead>
                      <tr>
                        <th>Thị trường</th>
                        <th>Giá (USD/tín chỉ)</th>
                        <th>Đặc điểm</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Tự nguyện</td>
                        <td className="price-highlight">~5</td>
                        <td>Cho doanh nghiệp, cá nhân tự nguyện giảm phát thải</td>
                      </tr>
                      <tr>
                        <td>Bắt buộc (2029 dự kiến)</td>
                        <td className="price-highlight">100–300</td>
                        <td>Dành cho doanh nghiệp phải bù đắp phát thải</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="card-note">
                    ⚠️ Giá thay đổi tùy nguồn cung, loại dự án và tiêu chuẩn chứng nhận.
                  </div>
                </div>

                {/* Vehicle Factors Card */}
                <div className="info-card vehicle-factors">
                  <h3 className="card-title">
                    🚗 Hệ số loại xe
                  </h3>

                  <table className="price-table">
                    <thead>
                      <tr>
                        <th>Loại xe</th>
                        <th>Hệ số</th>
                        <th>Giá gợi ý (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Xe máy điện</td>
                        <td>×0.9</td>
                        <td className="price-highlight">4.5</td>
                      </tr>
                      <tr>
                        <td>Ô tô điện</td>
                        <td>×1.1</td>
                        <td className="price-highlight">5.5</td>
                      </tr>
                      <tr>
                        <td>Xe tải điện</td>
                        <td>×1.3</td>
                        <td className="price-highlight">6.5</td>
                      </tr>
                      <tr>
                        <td>Logistics điện hóa</td>
                        <td>×1.6</td>
                        <td className="price-highlight">8.0</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="card-note">
                    <strong>📘 Công thức gợi ý giá:</strong><br />
                    Giá gợi ý = Giá cơ sở × Hệ số loại xe<br />
                    VD: Ô tô điện × 5 USD = 5.5 USD/tín chỉ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="content-card history-section">
            <div className="page-header">
              <h2 style={{
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🕓 Lịch sử niêm yết gần đây
              </h2>
            </div>

            <div style={{ padding: '0 40px 40px' }}>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Loại xe</th>
                    <th>Số tín chỉ</th>
                    <th>Thị trường</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.date}</td>
                      <td>{entry.vehicleType}</td>
                      <td>{entry.creditAmount}</td>
                      <td>{entry.marketType}</td>
                      <td>{entry.price}</td>
                      <td>{getStatusDisplay(entry.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Process */}
          <div className="content-card">
            <div className="verification-process">
              <h3 className="process-title">
                🔍 Quy trình xác minh
              </h3>
              <div className="process-steps">
                <p><strong>1. Gửi niêm yết:</strong> Sau khi bạn niêm yết, tín chỉ sẽ được CVA (Tổ chức Xác minh Carbon) xem xét.</p>
                <p><strong>2. Xác minh:</strong> CVA kiểm tra tính hợp lệ của dữ liệu hành trình và tín chỉ carbon.</p>
                <p><strong>3. Phê duyệt:</strong> Khi được duyệt → hiển thị "Đã duyệt" và thêm lên Sàn giao dịch Carbon Việt Nam (VCM).</p>
                <p><strong>4. Từ chối:</strong> Khi bị từ chối → hiển thị "Từ chối" và cho phép người dùng chỉnh sửa lại giá hoặc số tín chỉ.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingsManagement;

