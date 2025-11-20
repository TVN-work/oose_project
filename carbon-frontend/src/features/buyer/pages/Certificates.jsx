import { useState } from 'react';
import { Download, RefreshCw, Award, DollarSign, Globe, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const Certificates = () => {
  const certificates = [
    {
      id: 'CC-001234',
      date: '15/12/2024',
      time: '09:30 AM',
      owner: 'Nguyễn Văn A',
      vehicle: 'Tesla Model 3',
      credits: 125,
      co2Saved: 9.2,
      value: 2812.50,
      pricePerCredit: 22.50,
      status: 'verified',
    },
    {
      id: 'CC-001235',
      date: '12/12/2024',
      time: '14:15 PM',
      owner: 'Trần Thị B',
      vehicle: 'VinFast VF8',
      credits: 85,
      co2Saved: 6.3,
      value: 1785.00,
      pricePerCredit: 21.00,
      status: 'verified',
    },
    {
      id: 'CC-001236',
      date: '10/12/2024',
      time: '11:45 AM',
      owner: 'Lê Văn C',
      vehicle: 'BMW iX3',
      credits: 200,
      co2Saved: 14.8,
      value: 4760.00,
      pricePerCredit: 23.80,
      status: 'verified',
    },
    {
      id: 'CC-001237',
      date: '08/12/2024',
      time: '16:20 PM',
      owner: 'Phạm Thị D',
      vehicle: 'Audi e-tron',
      credits: 150,
      co2Saved: 11.1,
      value: 3630.00,
      pricePerCredit: 24.20,
      status: 'verified',
    },
    {
      id: 'CC-001238',
      date: '05/12/2024',
      time: '13:10 PM',
      owner: 'Hoàng Văn E',
      vehicle: 'Hyundai Kona EV',
      credits: 95,
      co2Saved: 7.0,
      value: 2232.50,
      pricePerCredit: 23.50,
      status: 'pending',
    },
  ];

  const handleDownload = (certificateId) => {
    toast.success(`Đang tải chứng nhận ${certificateId}. File PDF sẽ được tải xuống...`);
    // Simulate download
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `Certificate_${certificateId}.pdf`;
      link.click();
    }, 1000);
  };

  const handleExportAll = () => {
    toast.success('Đang tạo file ZIP chứa tất cả chứng nhận. Vui lòng chờ...');
    setTimeout(() => {
      toast.success('✅ Đã tải xuống tất cả chứng nhận thành công!');
    }, 2000);
  };

  const handleRefresh = () => {
    toast.success('🔄 Đã cập nhật danh sách chứng nhận mới nhất!');
  };

  const getStatusBadge = (status) => {
    if (status === 'verified') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✅ Đã xác minh
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        ⏳ Đang xử lý
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">8</p>
          <p className="text-sm text-gray-600">Tổng chứng nhận</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">587</p>
          <p className="text-sm text-gray-600">Tổng tín chỉ</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">43.2</p>
          <p className="text-sm text-gray-600">Tấn CO2 giảm</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">$12,450</p>
          <p className="text-sm text-gray-600">Tổng giá trị</p>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="mr-3">📜</span>
              Danh sách chứng nhận tín chỉ carbon
            </h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportAll}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Tải tất cả
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
                  Mã chứng nhận
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày cấp
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  EV Owner
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
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold text-sm">CC</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{cert.id}</div>
                        <div className="text-xs text-gray-500">Chứng nhận chính thức</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">{cert.date}</div>
                    <div className="text-xs text-gray-500">{cert.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-blue-600 text-xs">🚗</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{cert.owner}</div>
                        <div className="text-xs text-gray-500">{cert.vehicle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-800">{cert.credits} tín chỉ</div>
                    <div className="text-xs text-gray-500">{cert.co2Saved} tấn CO2</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-600">${cert.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className="text-xs text-gray-500">${cert.pricePerCredit}/tín chỉ</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(cert.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {cert.status === 'verified' ? (
                      <button
                        onClick={() => handleDownload(cert.id)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center mx-auto"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Tải PDF
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-400 text-white px-3 py-1.5 rounded-lg cursor-not-allowed text-xs font-medium"
                      >
                        📄 Chờ xử lý
                      </button>
                    )}
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
              Hiển thị 5 trong tổng số 8 chứng nhận
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                ← Trước
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</span>
              <span className="px-3 py-1 text-gray-600 text-sm">2</span>
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

export default Certificates;

