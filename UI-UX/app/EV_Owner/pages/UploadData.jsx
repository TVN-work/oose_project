import React, { useState, useRef } from 'react';

const UploadData = ({ showNotification, showLoading, hideLoading }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();
      if (['csv', 'json', 'gpx'].includes(fileType)) {
        showNotification(`📁 Đã chọn file: ${file.name}`, 'info');
        setUploadProgress(75);
        setTimeout(() => {
          setUploadProgress(0);
          setShowPreview(true);
          setShowSummary(true);
          showNotification('✅ Tải file thành công! Dữ liệu đã được phân tích.', 'success');
        }, 3000);
      } else {
        showNotification('❌ Định dạng file không được hỗ trợ. Vui lòng chọn file CSV, JSON hoặc GPX.', 'error');
      }
    }
  };

  const simulateConnection = () => {
    showLoading();
    showNotification('🚗 Đang kết nối với xe điện...', 'info');
    setTimeout(() => {
      hideLoading();
      setShowPreview(true);
      setShowSummary(true);
      showNotification('✅ Đã tải dữ liệu demo từ xe thành công!', 'success');
    }, 3000);
  };

  const downloadSampleCSV = () => {
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
    showNotification('📥 Đã tải file mẫu CSV!', 'success');
  };

  const downloadSampleJSON = () => {
    const jsonContent = JSON.stringify(
      [
        {
          timestamp: '2024-07-15 08:30:00',
          latitude: 10.762622,
          longitude: 106.660172,
          speed: 45,
          distance: 0.5,
          energy: 0.08,
        },
      ],
      null,
      2
    );
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_trip_data.json';
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('📥 Đã tải file mẫu JSON!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 slide-in">
      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📤</span>
          Tải dữ liệu hành trình
        </h3>
        <p className="text-gray-600 mb-8">
          Tải lên dữ liệu lái xe của bạn để tạo tín chỉ carbon từ việc sử dụng xe điện
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div>
            <div
              onClick={handleFileSelect}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Kéo thả file hoặc click để chọn</h4>
              <p className="text-gray-600 mb-4">Hỗ trợ: CSV, JSON, GPX (tối đa 10MB)</p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileSelect();
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
                  🚗 Giả lập kết nối xe
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.gpx"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && (
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
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-blue-800 mb-2">Định dạng file hỗ trợ:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>CSV:</strong> Timestamp, Latitude, Longitude, Speed, Distance, Energy</li>
                    <li>• <strong>JSON:</strong> Array các object với các trường tương tự</li>
                    <li>• <strong>GPX:</strong> File GPS từ thiết bị định vị</li>
                  </ul>
                </div>

                <div className="bg-white border border-blue-300 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-800 mb-2">📄 File mẫu:</h5>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={downloadSampleCSV}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      📥 Tải file mẫu CSV
                    </button>
                    <button
                      onClick={downloadSampleJSON}
                      className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                    >
                      📥 Tải file mẫu JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                <span className="mr-2">🌱</span>
                Quy đổi tín chỉ carbon
              </h4>
              <div className="text-sm text-green-700 space-y-2">
                <p>
                  <strong>Công thức:</strong> 1 km xe điện = 0.12 kg CO₂ tiết kiệm
                </p>
                <p>
                  <strong>Tín chỉ:</strong> 1 tấn CO₂ = 1 tín chỉ carbon
                </p>
                <p>
                  <strong>Ví dụ:</strong> 100 km → 12 kg CO₂ → 0.012 tín chỉ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Preview Section */}
      {showPreview && (
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-8 fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">👁️</span>
            Xem trước dữ liệu
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Tên file:</span>
                <p className="font-semibold text-gray-800">trip_data_2024.csv</p>
              </div>
              <div>
                <span className="text-gray-600">Kích thước:</span>
                <p className="font-semibold text-gray-800">2.4 MB</p>
              </div>
              <div>
                <span className="text-gray-600">Số bản ghi:</span>
                <p className="font-semibold text-gray-800">1,247</p>
              </div>
              <div>
                <span className="text-gray-600">Trạng thái:</span>
                <p className="font-semibold text-green-600">✅ Hợp lệ</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trip Summary */}
      {showSummary && (
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-8 fade-in">
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
        </div>
      )}

      {/* Recent Uploads */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📋</span>
          Lịch sử tải lên gần đây
        </h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-green-600">✅</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">trip_data_2024_07_14.csv</p>
              <p className="text-sm text-gray-600">98.5 km • 11.82 kg CO₂ • 0.012 tín chỉ • 2 giờ trước</p>
            </div>
            <span className="text-green-600 font-semibold">Thành công</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadData;

