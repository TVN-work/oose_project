import { useState } from 'react';
import { Download, RefreshCw, Eye, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrencyFromUsd } from '../../../utils';

const PurchaseHistory = () => {
  const [filters, setFilters] = useState({
    timeRange: '',
    status: '',
    priceRange: '',
  });

  const transactions = [
    {
      id: 'TX-2024001',
      date: '15/12/2024',
      time: '09:30 AM',
      seller: 'Nguyễn Văn A',
      vehicle: 'Tesla Model 3',
      credits: 125,
      co2Saved: 9.2,
      value: 2812.50,
      pricePerCredit: 22.50,
      status: 'success',
      type: 'Mua tín chỉ',
    },
    {
      id: 'TX-2024002',
      date: '12/12/2024',
      time: '14:15 PM',
      seller: 'Trần Thị B',
      vehicle: 'VinFast VF8',
      credits: 85,
      co2Saved: 6.3,
      value: 1785.00,
      pricePerCredit: 21.00,
      status: 'success',
      type: 'Đấu giá',
    },
    {
      id: 'TX-2024003',
      date: '10/12/2024',
      time: '11:45 AM',
      seller: 'Lê Văn C',
      vehicle: 'BMW iX3',
      credits: 200,
      co2Saved: 14.8,
      value: 4760.00,
      pricePerCredit: 23.80,
      status: 'success',
      type: 'Mua tín chỉ',
    },
    {
      id: 'TX-2024004',
      date: '08/12/2024',
      time: '16:20 PM',
      seller: 'Phạm Thị D',
      vehicle: 'Audi e-tron',
      credits: 150,
      co2Saved: 11.1,
      value: 3630.00,
      pricePerCredit: 24.20,
      status: 'pending',
      type: 'Thương lượng',
    },
    {
      id: 'TX-2024005',
      date: '05/12/2024',
      time: '13:10 PM',
      seller: 'Hoàng Văn E',
      vehicle: 'Hyundai Kona EV',
      credits: 95,
      co2Saved: 7.0,
      value: 0,
      pricePerCredit: 23.50,
      status: 'failed',
      type: 'Mua tín chỉ',
    },
    {
      id: 'TX-2024006',
      date: '03/12/2024',
      time: '10:25 AM',
      seller: 'Vũ Thị F',
      vehicle: 'Nissan Leaf',
      credits: 75,
      co2Saved: 5.5,
      value: 1642.50,
      pricePerCredit: 21.90,
      status: 'success',
      type: 'Mua tín chỉ',
    },
    {
      id: 'TX-2024007',
      date: '01/12/2024',
      time: '15:30 PM',
      seller: 'Đỗ Văn G',
      vehicle: 'Kia EV6',
      credits: 110,
      co2Saved: 8.1,
      value: 2420.00,
      pricePerCredit: 22.00,
      status: 'pending',
      type: 'Đấu giá',
    },
  ];

  const handleExport = () => {
    toast.success('Đang xuất file Excel chứa lịch sử giao dịch...');
    setTimeout(() => {
      toast.success('✅ Đã xuất file Excel thành công!');
    }, 1500);
  };

  const handleRefresh = () => {
    toast.success('🔄 Đã cập nhật danh sách giao dịch mới nhất!');
  };

  const handleViewDetails = (transactionId) => {
    toast.success(`Đang xem chi tiết giao dịch ${transactionId}...`);
  };

  const handleApplyFilters = () => {
    toast.success('🔍 Đã áp dụng bộ lọc. Tìm thấy 15 giao dịch phù hợp!');
  };

  const handleQuickFilter = (type) => {
    const filterNames = {
      today: 'Hôm nay',
      week: 'Tuần này',
      success: 'Thành công',
      pending: 'Đang xử lý',
    };
    toast.success(`🏷️ Đã lọc theo: ${filterNames[type]}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Thành công
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Đang xử lý
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Thất bại
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">15</p>
          <p className="text-sm text-gray-600">Tổng giao dịch</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">12</p>
          <p className="text-sm text-gray-600">Thành công</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">2</p>
          <p className="text-sm text-gray-600">Đang xử lý</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">1</p>
          <p className="text-sm text-gray-600">Thất bại</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="mr-3">🔍</span>
            Lọc giao dịch
          </h3>
          <button
            onClick={() => {
              setFilters({ timeRange: '', status: '', priceRange: '' });
              toast.success('🔄 Đã đặt lại tất cả bộ lọc về mặc định!');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            🔄 Đặt lại bộ lọc
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng thời gian</label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả thời gian</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="3months">3 tháng qua</option>
              <option value="6months">6 tháng qua</option>
              <option value="1year">1 năm qua</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="pending">Đang xử lý</option>
              <option value="failed">Thất bại</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả mức giá</option>
              <option value="under-1000">Dưới {formatCurrencyFromUsd(1000)}</option>
              <option value="1000-3000">{formatCurrencyFromUsd(1000)} - {formatCurrencyFromUsd(3000)}</option>
              <option value="3000-5000">{formatCurrencyFromUsd(3000)} - {formatCurrencyFromUsd(5000)}</option>
              <option value="over-5000">Trên {formatCurrencyFromUsd(5000)}</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔍 Áp dụng
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Lọc nhanh:</span>
          <button
            onClick={() => handleQuickFilter('today')}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors"
          >
            📅 Hôm nay
          </button>
          <button
            onClick={() => handleQuickFilter('week')}
            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition-colors"
          >
            📊 Tuần này
          </button>
          <button
            onClick={() => handleQuickFilter('success')}
            className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs hover:bg-emerald-200 transition-colors"
          >
            ✅ Thành công
          </button>
          <button
            onClick={() => handleQuickFilter('pending')}
            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs hover:bg-yellow-200 transition-colors"
          >
            ⏳ Đang xử lý
          </button>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="mr-3">💳</span>
              Lịch sử giao dịch
            </h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </button>
              <button
                onClick={handleRefresh}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mã giao dịch
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày giao dịch
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người bán
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số tín chỉ
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giá trị
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">TX</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{tx.id}</div>
                        <div className="text-xs text-gray-500">{tx.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">{tx.date}</div>
                    <div className="text-xs text-gray-500">{tx.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-green-600 text-xs">🚗</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{tx.seller}</div>
                        <div className="text-xs text-gray-500">{tx.vehicle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-800">{tx.credits} tín chỉ</div>
                    <div className="text-xs text-gray-500">{tx.co2Saved} tấn CO2</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${
                      tx.status === 'failed' ? 'text-red-600' : tx.status === 'pending' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {tx.value > 0 ? formatCurrencyFromUsd(tx.value) : '0.00'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tx.value > 0 ? `${formatCurrencyFromUsd(tx.pricePerCredit)}/tín chỉ` : 'Giao dịch thất bại'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleViewDetails(tx.id)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center mx-auto"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị 7 trong tổng số 15 giao dịch
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                ← Trước
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</span>
              <span className="px-3 py-1 text-gray-600 text-sm">2</span>
              <span className="px-3 py-1 text-gray-600 text-sm">3</span>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                Sau →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;

