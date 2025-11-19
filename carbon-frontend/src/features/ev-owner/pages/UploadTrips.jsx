import { useState } from 'react';
import { Upload, Car, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadTrips = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();
      if (['csv', 'json', 'gpx'].includes(fileType)) {
        toast.success(`📁 Đã chọn file: ${file.name}`);
        simulateUpload();
      } else {
        toast.error('❌ Định dạng file không được hỗ trợ. Vui lòng chọn file CSV, JSON hoặc GPX.');
        e.target.value = '';
      }
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowPreview(true);
          setShowSummary(true);
          toast.success('✅ Tải file thành công! Dữ liệu đã được phân tích.');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateConnection = () => {
    toast.loading('🚗 Đang kết nối với xe điện...');
    setTimeout(() => {
      toast.dismiss();
      setShowPreview(true);
      setShowSummary(true);
      toast.success('✅ Đã tải dữ liệu demo từ xe thành công!');
    }, 3000);
  };

  const requestVerification = () => {
    toast.loading('🔍 Đang gửi yêu cầu xác minh...');
    setTimeout(() => {
      setVerificationStatus('processing');
      toast.dismiss();
      toast.success('🔍 Đã gửi yêu cầu xác minh tín chỉ carbon!');
      
      setTimeout(() => {
        setVerificationStatus('approved');
        toast.success('✅ Tín chỉ carbon đã được xác minh và phê duyệt!');
      }, 5000);
    }, 2000);
  };

  const downloadSample = (type) => {
    if (type === 'csv') {
      const csvContent = `timestamp,latitude,longitude,speed,distance,energy
2024-07-15 08:30:00,10.762622,106.660172,45,0.5,0.08
2024-07-15 08:31:00,10.763145,106.661234,52,0.8,0.12
2024-07-15 08:32:00,10.764567,106.662890,38,0.6,0.09`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample_trip_data.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('📥 Đã tải file mẫu CSV!');
    } else {
      const jsonContent = JSON.stringify([
        {
          timestamp: '2024-07-15 08:30:00',
          latitude: 10.762622,
          longitude: 106.660172,
          speed: 45,
          distance: 0.5,
          energy: 0.08,
        },
      ], null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample_trip_data.json';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('📥 Đã tải file mẫu JSON!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Upload className="mr-3" />
          Tải dữ liệu hành trình
        </h3>
        <p className="text-gray-600 mb-8">
          Tải lên dữ liệu lái xe của bạn để tạo tín chỉ carbon từ việc sử dụng xe điện
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div>
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Kéo thả file hoặc click để chọn
              </h4>
              <p className="text-gray-600 mb-4">Hỗ trợ: CSV, JSON, GPX (tối đa 10MB)</p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('fileInput').click();
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
                >
                  📁 Chọn file
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    simulateConnection();
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Car className="w-5 h-5 inline mr-2" />
                  Giả lập kết nối xe
                </button>
              </div>
              <input
                type="file"
                id="fileInput"
                accept=".csv,.json,.gpx"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Đang tải lên...</span>
                  <span className="text-sm text-gray-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <span className="mr-2">💡</span>
                Hướng dẫn chuẩn bị dữ liệu
              </h4>
              <div className="space-y-4 text-sm text-blue-700">
                <div>
                  <h5 className="font-semibold text-blue-800 mb-2">Định dạng file hỗ trợ:</h5>
                  <ul className="space-y-1">
                    <li>• <strong>CSV:</strong> Timestamp, Latitude, Longitude, Speed, Distance, Energy</li>
                    <li>• <strong>JSON:</strong> Array các object với các trường tương tự</li>
                    <li>• <strong>GPX:</strong> File GPS từ thiết bị định vị</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                <span className="mr-2">🌱</span>
                Quy đổi tín chỉ carbon
              </h4>
              <div className="text-sm text-green-700 space-y-2">
                <p><strong>Công thức:</strong> 1 km xe điện = 0.12 kg CO₂ tiết kiệm</p>
                <p><strong>Tín chỉ:</strong> 1 tấn CO₂ = 1 tín chỉ carbon</p>
                <p><strong>Ví dụ:</strong> 100 km → 12 kg CO₂ → 0.012 tín chỉ</p>
              </div>
            </div>

            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-2">📄 File mẫu:</h5>
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadSample('csv')}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-3 h-3 inline mr-1" />
                  Tải CSV mẫu
                </button>
                <button
                  onClick={() => downloadSample('json')}
                  className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                >
                  <Download className="w-3 h-3 inline mr-1" />
                  Tải JSON mẫu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Preview */}
      {showPreview && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 animate-fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">👁️</span>
            Xem trước dữ liệu
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Thời gian</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vĩ độ</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Kinh độ</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tốc độ (km/h)</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Khoảng cách (km)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 px-4">2024-07-15 08:3{i}:00</td>
                    <td className="py-3 px-4">10.762622</td>
                    <td className="py-3 px-4">106.660172</td>
                    <td className="py-3 px-4">{40 + i * 5}</td>
                    <td className="py-3 px-4">0.{i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trip Summary */}
      {showSummary && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 animate-fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">📊</span>
            Tóm tắt hành trình
          </h3>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛣️</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">125.7</p>
              <p className="text-sm text-blue-700">Tổng quãng đường (km)</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-3xl font-bold text-orange-600">18.5</p>
              <p className="text-sm text-orange-700">Năng lượng tiêu thụ (kWh)</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <p className="text-3xl font-bold text-green-600">15.08</p>
              <p className="text-sm text-green-700">CO₂ giảm phát thải (kg)</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <p className="text-3xl font-bold text-purple-600">0.015</p>
              <p className="text-sm text-purple-700">Tín chỉ carbon quy đổi</p>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🔍</span>
              Trạng thái xác minh tín chỉ carbon
            </h4>
            {verificationStatus === 'pending' && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600">⏳</span>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-800">Chờ xác minh</p>
                    <p className="text-sm text-yellow-600">Dữ liệu đang được kiểm tra bởi hệ thống AI</p>
                  </div>
                </div>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Pending
                </span>
              </div>
            )}
            {verificationStatus === 'processing' && (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600">🔄</span>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800">Đang xác minh</p>
                    <p className="text-sm text-blue-600">AI đang phân tích dữ liệu hành trình</p>
                  </div>
                </div>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Processing
                </span>
              </div>
            )}
            {verificationStatus === 'approved' && (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600">✅</span>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Đã xác minh</p>
                    <p className="text-sm text-green-600">Tín chỉ carbon đã được phê duyệt</p>
                  </div>
                </div>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Approved
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {verificationStatus === 'pending' && (
              <button
                onClick={requestVerification}
                className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center"
              >
                <span className="mr-2">🔍</span>
                Yêu cầu xác minh tín chỉ carbon
              </button>
            )}
            {verificationStatus === 'approved' && (
              <button
                onClick={() => toast.success('✅ Đã thêm 0.015 tín chỉ vào ví của bạn!')}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center"
              >
                <span className="mr-2">✅</span>
                Thêm vào ví
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadTrips;

