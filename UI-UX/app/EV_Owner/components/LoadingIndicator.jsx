import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 z-50">
      <div className="flex items-center">
        <div className="loading-spinner mr-3"></div>
        <span className="text-gray-700 font-medium">Đang tải...</span>
      </div>
    </div>
  );
};

export default LoadingIndicator;

