import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-16 h-16 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Truy cập bị từ chối
        </h2>
        
        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Bạn không có quyền truy cập vào trang này. 
          <br />
          Vui lòng đăng nhập với tài khoản phù hợp.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/auth"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Home className="w-5 h-5 mr-2" />
            Đăng nhập lại
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            <strong>Cần trợ giúp?</strong>
            <br />
            Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ quản trị viên.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

