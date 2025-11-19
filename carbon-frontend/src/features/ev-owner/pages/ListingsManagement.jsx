import { useState } from 'react';
import { Tag, TrendingUp, Car, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const ListingsManagement = () => {
  const [formData, setFormData] = useState({
    vehicleType: '',
    creditAmount: '',
    marketType: '',
    listingPrice: '',
    description: '',
  });

  const [showProfitPrediction, setShowProfitPrediction] = useState(false);

  // Vehicle factors for price calculation
  const vehicleFactors = {
    motorcycle: { factor: 0.9, name: 'Xe máy điện', suggestedPrice: 4.5 },
    car: { factor: 1.1, name: 'Ô tô điện', suggestedPrice: 5.5 },
    truck: { factor: 1.3, name: 'Xe tải điện', suggestedPrice: 6.5 },
    logistics: { factor: 1.6, name: 'Logistics điện hóa', suggestedPrice: 8.0 },
  };

  // Base prices for different markets
  const basePrices = {
    voluntary: 5,
    compliance: 150,
  };

  // History data
  const historyListings = [
    {
      date: '15/10/2025',
      vehicleType: 'Ô tô điện',
      creditAmount: '0.052',
      marketType: 'Tự nguyện',
      price: '5.5',
      status: 'approved',
      statusText: '✅ Đã duyệt',
    },
    {
      date: '12/10/2025',
      vehicleType: 'Xe máy điện',
      creditAmount: '0.030',
      marketType: 'Tự nguyện',
      price: '4.5',
      status: 'pending',
      statusText: '⏳ Chờ CVA',
    },
    {
      date: '09/10/2025',
      vehicleType: 'Xe tải điện',
      creditAmount: '0.210',
      marketType: 'Bắt buộc',
      price: '180',
      status: 'rejected',
      statusText: '❌ Từ chối',
    },
    {
      date: '05/10/2025',
      vehicleType: 'Ô tô điện',
      creditAmount: '0.087',
      marketType: 'Tự nguyện',
      price: '5.2',
      status: 'approved',
      statusText: '✅ Đã duyệt',
    },
    {
      date: '02/10/2025',
      vehicleType: 'Logistics điện hóa',
      creditAmount: '0.340',
      marketType: 'Tự nguyện',
      price: '7.8',
      status: 'approved',
      statusText: '✅ Đã duyệt',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update profit prediction when credit amount or price changes
    if (name === 'creditAmount' || name === 'listingPrice') {
      updateProfitPrediction(name === 'creditAmount' ? value : formData.creditAmount, name === 'listingPrice' ? value : formData.listingPrice);
    }

    // Auto-suggest price when vehicle type or market changes
    if (name === 'vehicleType' || name === 'marketType') {
      updatePriceSuggestion(name === 'vehicleType' ? value : formData.vehicleType, name === 'marketType' ? value : formData.marketType);
    }
  };

  const updatePriceSuggestion = (vehicleType, marketType) => {
    if (vehicleType && marketType && !formData.listingPrice) {
      const basePrice = basePrices[marketType];
      const factor = vehicleFactors[vehicleType]?.factor || 1;
      const suggestedPrice = basePrice * factor;
      setFormData((prev) => ({
        ...prev,
        listingPrice: suggestedPrice.toFixed(1),
      }));
      updateProfitPrediction(formData.creditAmount, suggestedPrice.toFixed(1));
    }
  };

  const autoCalculatePrice = () => {
    if (!formData.vehicleType || !formData.marketType) {
      toast.error('⚠️ Vui lòng chọn loại phương tiện và thị trường trước!');
      return;
    }

    const basePrice = basePrices[formData.marketType];
    const factor = vehicleFactors[formData.vehicleType]?.factor || 1;
    const suggestedPrice = basePrice * factor;

    setFormData((prev) => ({
      ...prev,
      listingPrice: suggestedPrice.toFixed(1),
    }));

    updateProfitPrediction(formData.creditAmount, suggestedPrice.toFixed(1));

    const vehicleName = vehicleFactors[formData.vehicleType]?.name || formData.vehicleType;
    const marketName = formData.marketType === 'voluntary' ? 'Tự nguyện' : 'Bắt buộc';
    toast.success(`💡 Giá gợi ý: ${suggestedPrice.toFixed(1)} USD/tín chỉ\n\nDựa trên ${vehicleName} trong thị trường ${marketName}`);
  };

  const updateProfitPrediction = (creditAmount, listingPrice) => {
    const amount = parseFloat(creditAmount) || 0;
    const price = parseFloat(listingPrice) || 0;

    if (amount > 0 && price > 0) {
      setShowProfitPrediction(true);
    } else {
      setShowProfitPrediction(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.vehicleType) {
      toast.error('⚠️ Vui lòng chọn loại phương tiện!');
      return;
    }

    if (!formData.creditAmount || parseFloat(formData.creditAmount) <= 0) {
      toast.error('⚠️ Vui lòng nhập số tín chỉ hợp lệ!');
      return;
    }

    if (!formData.marketType) {
      toast.error('⚠️ Vui lòng chọn thị trường!');
      return;
    }

    if (!formData.listingPrice || parseFloat(formData.listingPrice) <= 0) {
      toast.error('⚠️ Vui lòng nhập giá niêm yết hợp lệ!');
      return;
    }

    // Simulate submission
    toast.loading('📤 Đang gửi niêm yết...\n\nVui lòng chờ trong giây lát.');

    setTimeout(() => {
      toast.dismiss();
      toast.success('✅ Niêm yết thành công!\n\nTín chỉ của bạn đã được gửi đến CVA để xác minh. Thời gian xử lý: 1-3 ngày làm việc.');

      // Reset form
      setFormData({
        vehicleType: '',
        creditAmount: '',
        marketType: '',
        listingPrice: '',
        description: '',
      });
      setShowProfitPrediction(false);
    }, 2000);
  };

  const calculateProfit = () => {
    const amount = parseFloat(formData.creditAmount) || 0;
    const price = parseFloat(formData.listingPrice) || 0;
    return (amount * price).toFixed(3);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 font-semibold';
      case 'pending':
        return 'text-yellow-600 font-semibold';
      case 'rejected':
        return 'text-red-600 font-semibold';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span>💹</span>
            <span>Niêm yết tín chỉ carbon</span>
          </h1>
          <p className="text-gray-600 text-base leading-relaxed mt-2">
            Đăng bán tín chỉ carbon của bạn lên sàn giao dịch. Hệ thống sẽ gợi ý giá hợp lý theo loại xe và thị trường.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-10 p-10">
          {/* Left Column - Listing Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Loại phương tiện
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                >
                  <option value="">Chọn loại phương tiện</option>
                  <option value="motorcycle">Xe máy điện</option>
                  <option value="car">Ô tô điện</option>
                  <option value="truck">Xe tải điện</option>
                  <option value="logistics">Logistics điện hóa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Số tín chỉ muốn niêm yết
                </label>
                <input
                  type="number"
                  name="creditAmount"
                  value={formData.creditAmount}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 0.052"
                  step="0.001"
                  min="0"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Số tín chỉ carbon có sẵn trong ví của bạn</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Thị trường</label>
                <select
                  name="marketType"
                  value={formData.marketType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all cursor-pointer"
                >
                  <option value="">Chọn thị trường</option>
                  <option value="voluntary">Tự nguyện</option>
                  <option value="compliance">Bắt buộc</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Giá niêm yết (USD/tín chỉ)
                </label>
                <div className="flex gap-3 items-end">
                  <input
                    type="number"
                    name="listingPrice"
                    value={formData.listingPrice}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 5.5"
                    step="0.1"
                    min="0"
                    className="flex-1 px-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={autoCalculatePrice}
                    className="bg-blue-600 text-white px-5 py-3.5 rounded-lg font-semibold text-sm whitespace-nowrap hover:bg-blue-700 transition-all hover:-translate-y-0.5"
                  >
                    <Settings className="w-4 h-4 inline mr-2" />
                    Tự động tính giá
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Giá bán mong muốn cho mỗi tín chỉ carbon</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Mô tả thêm (tùy chọn)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Mô tả chi tiết về nguồn gốc tín chỉ, loại xe, khu vực hoạt động..."
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all resize-none"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Thông tin bổ sung giúp người mua hiểu rõ hơn về tín chỉ</p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-lg font-bold text-base hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  style={{ boxShadow: '0 6px 20px rgba(46, 204, 113, 0.3)' }}
                >
                  <span>📤</span>
                  <span>Niêm yết tín chỉ</span>
                </button>
              </div>
            </form>

            {/* Profit Prediction */}
            {showProfitPrediction && (
              <div className="bg-green-50 rounded-lg p-6 mt-6 border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span>💵</span>
                  <span>Dự đoán lợi nhuận</span>
                </h3>
                <div className="text-base text-gray-600 mb-2">
                  {formData.creditAmount} tín chỉ × {formData.listingPrice} USD = Tổng USD dự kiến
                </div>
                <div className="text-2xl font-bold text-green-600 mt-2">
                  {calculateProfit()} USD
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Reference Cards */}
          <div className="space-y-6">
            {/* Market Prices Card */}
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Giá tín chỉ tại Việt Nam (2025)</span>
              </h3>

              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800 bg-white bg-opacity-50">
                      Thị trường
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800 bg-white bg-opacity-50">
                      Giá (USD/tín chỉ)
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800 bg-white bg-opacity-50">
                      Đặc điểm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-2 text-sm text-gray-600">Tự nguyện</td>
                    <td className="py-3 px-2 text-sm font-semibold text-green-600">~5</td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      Cho doanh nghiệp, cá nhân tự nguyện giảm phát thải
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 text-sm text-gray-600">Bắt buộc (2029 dự kiến)</td>
                    <td className="py-3 px-2 text-sm font-semibold text-green-600">100–300</td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      Dành cho doanh nghiệp phải bù đắp phát thải
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-xs text-gray-600 leading-relaxed mt-3 p-3 bg-white bg-opacity-70 rounded">
                ⚠️ Giá thay đổi tùy nguồn cung, loại dự án và tiêu chuẩn chứng nhận.
              </div>
            </div>

            {/* Vehicle Factors Card */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5" />
                <span>Hệ số loại xe</span>
              </h3>

              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800 bg-white bg-opacity-50">
                      Loại xe
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800 bg-white bg-opacity-50">
                      Hệ số
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800 bg-white bg-opacity-50">
                      Giá gợi ý (USD)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(vehicleFactors).map(([key, { factor, name, suggestedPrice }]) => (
                    <tr key={key} className="border-b border-gray-200">
                      <td className="py-3 px-2 text-sm text-gray-600">{name}</td>
                      <td className="py-3 px-2 text-sm text-gray-600">×{factor}</td>
                      <td className="py-3 px-2 text-sm font-semibold text-green-600">{suggestedPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-xs text-gray-600 leading-relaxed mt-3 p-3 bg-white bg-opacity-70 rounded">
                <strong>📘 Công thức gợi ý giá:</strong>
                <br />
                Giá gợi ý = Giá cơ sở × Hệ số loại xe
                <br />
                VD: Ô tô điện × 5 USD = 5.5 USD/tín chỉ
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <span>🕓</span>
            <span>Lịch sử niêm yết gần đây</span>
          </h2>
        </div>

        <div className="px-10 py-10">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-4 px-3 text-sm font-semibold text-gray-800">Ngày</th>
                  <th className="text-left py-4 px-3 text-sm font-semibold text-gray-800">Loại xe</th>
                  <th className="text-left py-4 px-3 text-sm font-semibold text-gray-800">Số tín chỉ</th>
                  <th className="text-left py-4 px-3 text-sm font-semibold text-gray-800">Thị trường</th>
                  <th className="text-left py-4 px-3 text-sm font-semibold text-gray-800">Giá</th>
                  <th className="text-left py-4 px-3 text-sm font-semibold text-gray-800">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {historyListings.map((listing, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-3 text-sm text-gray-600">{listing.date}</td>
                    <td className="py-4 px-3 text-sm text-gray-600">{listing.vehicleType}</td>
                    <td className="py-4 px-3 text-sm text-gray-600">{listing.creditAmount}</td>
                    <td className="py-4 px-3 text-sm text-gray-600">{listing.marketType}</td>
                    <td className="py-4 px-3 text-sm text-gray-600">{listing.price}</td>
                    <td className="py-4 px-3 text-sm">
                      <span className={getStatusClass(listing.status)}>{listing.statusText}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Verification Process */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔍</span>
            <span>Quy trình xác minh</span>
          </h3>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>
              <strong>1. Gửi niêm yết:</strong> Sau khi bạn niêm yết, tín chỉ sẽ được CVA (Tổ chức Xác minh Carbon) xem xét.
            </p>
            <p>
              <strong>2. Xác minh:</strong> CVA kiểm tra tính hợp lệ của dữ liệu hành trình và tín chỉ carbon.
            </p>
            <p>
              <strong>3. Phê duyệt:</strong> Khi được duyệt → hiển thị "Đã duyệt" và thêm lên Sàn giao dịch Carbon Việt Nam (VCM).
            </p>
            <p>
              <strong>4. Từ chối:</strong> Khi bị từ chối → hiển thị "Từ chối" và cho phép người dùng chỉnh sửa lại giá hoặc số tín chỉ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingsManagement;
