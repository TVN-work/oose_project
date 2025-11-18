import React from 'react';

const ListCredits = ({ showNotification, showLoading, hideLoading }) => {
  return (
    <div className="max-w-7xl mx-auto slide-in">
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">🏷️</span>
          Niêm yết tín chỉ
        </h3>
        <p className="text-gray-600 mb-8">
          Để sử dụng tính năng niêm yết tín chỉ đầy đủ, vui lòng truy cập trang{' '}
          <a href="../ev-owner/listings_management.html" className="text-blue-600 hover:underline">
            Niêm yết tín chỉ
          </a>
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-blue-800">
            💡 <strong>Lưu ý:</strong> Trang niêm yết tín chỉ đầy đủ đã được chuyển đổi sang React tại{' '}
            <code className="bg-blue-100 px-2 py-1 rounded">ev-owner/ListingsManagement.jsx</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListCredits;

