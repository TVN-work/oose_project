import { useState } from 'react';
import { formatCurrencyFromUsd } from '../../../utils';
import { Edit, Wallet, Lock, User, Bell, Download, Pause, Trash2, CreditCard, RefreshCw, FileText, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    allowContact: true,
    shareAnalytics: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    transaction: true,
    auction: true,
    emailMarketing: false,
    sms: true,
  });

  const handleToggle = (category, key) => {
    if (category === 'privacy') {
      setPrivacySettings({ ...privacySettings, [key]: !privacySettings[key] });
    } else {
      setNotificationSettings({ ...notificationSettings, [key]: !notificationSettings[key] });
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case 'editProfile':
        toast.success('Đang mở form chỉnh sửa thông tin cá nhân...');
        break;
      case 'manageWallet':
        toast.success('Đang chuyển đến trang quản lý ví điện tử...');
        break;
      case 'addFunds':
        toast.success('Đang mở form nạp tiền vào ví. Chọn phương thức thanh toán...');
        break;
      case 'withdrawFunds':
        toast.success('Đang mở form rút tiền. Vui lòng xác minh danh tính...');
        break;
      case 'viewWalletHistory':
        toast.success('Đang tải lịch sử giao dịch ví điện tử...');
        break;
      case 'setupAutoReload':
        toast.success('Đang thiết lập tự động nạp tiền khi số dư thấp...');
        break;
      case 'changePassword':
        toast.success('Đang mở form đổi mật khẩu. Vui lòng nhập mật khẩu hiện tại...');
        break;
      case 'manage2FA':
        toast.success('Đang mở cài đặt xác thực 2 bước. Quét mã QR bằng app...');
        break;
      case 'manageSecurityQuestions':
        toast.success('Đang cập nhật câu hỏi bảo mật. Chọn 3 câu hỏi mới...');
        break;
      case 'verifyIncome':
        toast.success('Đang mở form xác minh thu nhập. Tải lên bảng lương hoặc hợp đồng...');
        break;
      case 'manageBankAccount':
        toast.success('Đang quản lý tài khoản ngân hàng liên kết. Thêm/xóa tài khoản...');
        break;
      case 'exportAccountData':
        toast.success('Đang chuẩn bị file dữ liệu tài khoản. Sẽ gửi qua email...');
        setTimeout(() => {
          toast.success('✅ Đã gửi file dữ liệu tài khoản đến email của bạn!');
        }, 3000);
        break;
      case 'deactivateAccount':
        if (window.confirm('⚠️ Bạn có chắc muốn tạm khóa tài khoản? Bạn sẽ không thể đăng nhập cho đến khi kích hoạt lại.')) {
          toast.success('⏸️ Đang tạm khóa tài khoản. Bạn có thể kích hoạt lại bất cứ lúc nào...');
        }
        break;
      case 'deleteAccount':
        if (window.confirm('🚨 CẢNH BÁO: Việc xóa tài khoản không thể hoàn tác!\n\nTất cả dữ liệu, giao dịch và chứng nhận sẽ bị xóa vĩnh viễn.\n\nBạn có chắc chắn muốn tiếp tục?')) {
          if (window.confirm('🔐 Để xác nhận, vui lòng nhập mật khẩu và mã xác thực 2FA.\n\nBạn có muốn tiếp tục quy trình xóa tài khoản?')) {
            toast.error('🗑️ Đang khởi tạo quy trình xóa tài khoản. Kiểm tra email để xác nhận cuối cùng...');
          }
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Account Information Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <User className="mr-3 w-6 h-6" />
            Thông tin tài khoản
          </h3>
          <button
            onClick={() => handleAction('editProfile')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                <span className="text-white font-bold text-2xl">CB</span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-800 mb-2">Carbon Buyer</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Tài khoản đã xác minh</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                      ⭐ Gold Member
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">Thành viên từ: 15/01/2024</div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-gray-800">Nguyễn Văn Carbon Buyer</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-gray-800">carbonbuyer@email.com</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                  ✅ Đã xác minh
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-gray-800">+84 901 234 567</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                  ✅ Đã xác minh
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-gray-800">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Information Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <CreditCard className="mr-3 w-6 h-6" />
            Thông tin ví điện tử
          </h3>
          <button
            onClick={() => handleAction('manageWallet')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Quản lý ví
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Wallet Balance */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Số dư hiện tại</h4>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-bold mb-2">{formatCurrencyFromUsd(15750)}</div>
            <div className="text-sm opacity-90">Có thể sử dụng ngay</div>
          </div>

          {/* Pending Transactions */}
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Đang xử lý</h4>
              <span className="text-2xl">⏳</span>
            </div>
            <div className="text-3xl font-bold mb-2">{formatCurrencyFromUsd(2420)}</div>
            <div className="text-sm opacity-90">2 giao dịch chờ</div>
          </div>

          {/* Total Spent */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Tổng chi tiêu</h4>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold mb-2">{formatCurrencyFromUsd(12450)}</div>
            <div className="text-sm opacity-90">Từ đầu năm</div>
          </div>
        </div>

        {/* Wallet Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => handleAction('addFunds')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Nạp tiền
          </button>
          <button
            onClick={() => handleAction('withdrawFunds')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Rút tiền
          </button>
          <button
            onClick={() => handleAction('viewWalletHistory')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            Lịch sử ví
          </button>
          <button
            onClick={() => handleAction('setupAutoReload')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tự động nạp
          </button>
        </div>
      </div>

      {/* Security Settings Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Lock className="mr-3 w-6 h-6" />
            Cài đặt bảo mật
          </h3>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-green-600 font-medium">Bảo mật cao</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Password & Authentication */}
          <div className="space-y-6">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Lock className="mr-2 w-5 h-5" />
              Mật khẩu & Xác thực
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Mật khẩu đăng nhập</div>
                  <div className="text-sm text-gray-600">Cập nhật lần cuối: 15/11/2024</div>
                </div>
                <button
                  onClick={() => handleAction('changePassword')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Đổi mật khẩu
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Xác thực 2 bước (2FA)</div>
                  <div className="text-sm text-green-600">✅ Đã kích hoạt</div>
                </div>
                <button
                  onClick={() => handleAction('manage2FA')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Quản lý 2FA
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Câu hỏi bảo mật</div>
                  <div className="text-sm text-green-600">✅ Đã thiết lập</div>
                </div>
                <button
                  onClick={() => handleAction('manageSecurityQuestions')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>

          {/* Identity Verification */}
          <div className="space-y-6">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <User className="mr-2 w-5 h-5" />
              Xác minh danh tính
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">CCCD/CMND</div>
                  <div className="text-sm text-green-600">✅ Đã xác minh</div>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Hoàn thành
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Xác minh khuôn mặt</div>
                  <div className="text-sm text-green-600">✅ Đã xác minh</div>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Hoàn thành
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Xác minh thu nhập</div>
                  <div className="text-sm text-yellow-600">⏳ Tùy chọn</div>
                </div>
                <button
                  onClick={() => handleAction('verifyIncome')}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                >
                  Xác minh
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Xác minh ngân hàng</div>
                  <div className="text-sm text-blue-600">✅ Đã liên kết</div>
                </div>
                <button
                  onClick={() => handleAction('manageBankAccount')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Quản lý
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Notifications Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Bell className="mr-3 w-6 h-6" />
          Quyền riêng tư & Thông báo
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Privacy Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Cài đặt quyền riêng tư</h4>

            <div className="space-y-3">
              {[
                { key: 'publicProfile', label: 'Hiển thị hồ sơ công khai' },
                { key: 'allowContact', label: 'Cho phép liên hệ từ người bán' },
                { key: 'shareAnalytics', label: 'Chia sẻ dữ liệu phân tích' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={privacySettings[item.key]}
                      onChange={() => handleToggle('privacy', item.key)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Cài đặt thông báo</h4>

            <div className="space-y-3">
              {[
                { key: 'transaction', label: 'Thông báo giao dịch' },
                { key: 'auction', label: 'Thông báo đấu giá' },
                { key: 'emailMarketing', label: 'Email marketing' },
                { key: 'sms', label: 'Thông báo SMS' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings[item.key]}
                      onChange={() => handleToggle('notification', item.key)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Lock className="mr-3 w-6 h-6" />
          Hành động tài khoản
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => handleAction('exportAccountData')}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            <Download className="w-8 h-8 mx-auto mb-2" />
            <div className="font-medium">Xuất dữ liệu</div>
            <div className="text-sm opacity-90">Tải về thông tin tài khoản</div>
          </button>

          <button
            onClick={() => handleAction('deactivateAccount')}
            className="bg-yellow-600 text-white p-4 rounded-lg hover:bg-yellow-700 transition-colors text-center"
          >
            <Pause className="w-8 h-8 mx-auto mb-2" />
            <div className="font-medium">Tạm khóa tài khoản</div>
            <div className="text-sm opacity-90">Tạm thời vô hiệu hóa</div>
          </button>

          <button
            onClick={() => handleAction('deleteAccount')}
            className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors text-center"
          >
            <Trash2 className="w-8 h-8 mx-auto mb-2" />
            <div className="font-medium">Xóa tài khoản</div>
            <div className="text-sm opacity-90">Xóa vĩnh viễn tài khoản</div>
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <span className="text-yellow-600 mr-3 text-xl">⚠️</span>
            <div>
              <div className="font-medium text-yellow-800">Lưu ý quan trọng</div>
              <div className="text-sm text-yellow-700 mt-1">
                Việc xóa tài khoản sẽ không thể hoàn tác. Vui lòng đảm bảo bạn đã hoàn thành tất cả giao dịch và rút hết số dư trong ví trước khi thực hiện.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

