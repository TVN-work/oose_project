import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTransaction, useUpdateTransactionStatus } from '../../../hooks/useTransaction';
import { TRANSACTION_STATUSES } from '../../../services/transaction/transactionService';
import apiClient from '../../../services/api/client';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../../utils';
import { CheckCircle, XCircle, Loader2, Home, ShoppingCart } from 'lucide-react';

/**
 * PaymentCallback Component
 * Handles VNPay payment callback redirect from backend
 * 
 * Backend sẽ redirect về đây sau khi xác minh VNPay response
 * URL format:
 * /buyer/payment/callback?status=success&transactionId=...&message=...&amount=...&bankCode=...&payDate=...
 * hoặc
 * /buyer/payment/callback?status=failed&transactionId=...&message=...
 */
const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const updateStatusMutation = useUpdateTransactionStatus();

  // Parse callback params from backend
  const callbackStatus = searchParams.get('status'); // 'success' or 'failed'
  const transactionId = searchParams.get('transactionId');
  const callbackMessage = searchParams.get('message');
  const amount = searchParams.get('amount');
  const bankCode = searchParams.get('bankCode');
  const payDate = searchParams.get('payDate');
  const vnpTransactionNo = searchParams.get('vnpTransactionNo');

  // State
  const [status, setStatus] = useState('loading'); // loading, success, failed
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');

  // Process callback from backend
  useEffect(() => {
    const processCallback = async () => {
      // Check if we have status from backend
      if (!callbackStatus) {
        setStatus('failed');
        setMessage('Không tìm thấy thông tin thanh toán');
        return;
      }

      try {
        if (callbackStatus === 'success') {
          setStatus('success');
          setMessage(callbackMessage || 'Thanh toán thành công!');
          toast.success('🎉 Thanh toán thành công!');

          // Update frontend transaction status if needed
          if (transactionId) {
            try {
              await updateStatusMutation.mutateAsync({
                transactionId: transactionId,
                status: TRANSACTION_STATUSES.SUCCESS,
              });
            } catch (error) {
              console.warn('Error updating frontend transaction status:', error);
            }
          }
        } else {
          setStatus('failed');
          setMessage(callbackMessage || 'Thanh toán thất bại');
          toast.error('❌ Thanh toán thất bại');

          // Update transaction status to FAILED
          if (transactionId) {
            try {
              await updateStatusMutation.mutateAsync({
                transactionId: transactionId,
                status: TRANSACTION_STATUSES.FAILED,
              });
            } catch (error) {
              console.warn('Error updating frontend transaction status:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error processing callback:', error);
        setStatus('failed');
        setMessage('Lỗi xử lý kết quả thanh toán');
        toast.error('❌ Lỗi xử lý kết quả thanh toán');
      }
    };

    processCallback();
  }, [callbackStatus]);

  // Get error message based on response status
  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo)',
      '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking',
      '10': 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Đã hết hạn chờ thanh toán',
      '12': 'Thẻ/Tài khoản bị khóa',
      '13': 'Nhập sai mật khẩu xác thực giao dịch (OTP)',
      '24': 'Khách hàng hủy giao dịch',
      '51': 'Tài khoản không đủ số dư',
      '65': 'Vượt quá hạn mức giao dịch trong ngày',
      '75': 'Ngân hàng đang bảo trì',
      '79': 'Nhập sai mật khẩu thanh toán quá số lần',
      '99': 'Các lỗi khác',
    };
    return errorMessages[errorCode] || `Giao dịch không thành công (Mã: ${errorCode})`;
  };

  // Navigate handlers
  const goToMarketplace = () => {
    navigate('/buyer/marketplace');
  };

  const goToDashboard = () => {
    navigate('/buyer/dashboard');
  };

  const goToPurchaseHistory = () => {
    navigate('/buyer/purchase-history');
  };

  const formatPayDate = (payDate) => {
    if (!payDate) return '';
    // payDate format: YYYYMMDDHHmmss
    try {
      const year = payDate.substring(0, 4);
      const month = payDate.substring(4, 6);
      const day = payDate.substring(6, 8);
      const hour = payDate.substring(8, 10);
      const minute = payDate.substring(10, 12);
      const second = payDate.substring(12, 14);
      return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    } catch {
      return payDate;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {status === 'loading' && (
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          )}
          {status === 'failed' && (
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          )}
        </div>

        {/* Status Title */}
        <h1 className={`text-2xl font-bold text-center mb-2 ${status === 'success' ? 'text-green-600' :
          status === 'failed' ? 'text-red-600' : 'text-gray-800'
          }`}>
          {status === 'loading' && 'Đang xử lý...'}
          {status === 'success' && 'Thanh toán thành công!'}
          {status === 'failed' && 'Thanh toán thất bại'}
        </h1>

        {/* Status Message */}
        <p className="text-gray-600 text-center mb-6">
          {status === 'loading' && 'Vui lòng chờ trong giây lát...'}
          {status !== 'loading' && message}
        </p>

        {/* Transaction Details */}
        {status !== 'loading' && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            {transactionId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-medium text-gray-800 text-xs">{transactionId}</span>
              </div>
            )}
            {vnpTransactionNo && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mã VNPay:</span>
                <span className="font-medium text-gray-800">{vnpTransactionNo}</span>
              </div>
            )}
            {amount && parseInt(amount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-semibold text-green-600">{formatCurrency(parseInt(amount) / 100)}</span>
              </div>
            )}
            {bankCode && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-medium text-gray-800">{bankCode}</span>
              </div>
            )}
            {payDate && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium text-gray-800">{formatPayDate(payDate)}</span>
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-semibold">Tín chỉ đã được thêm vào tài khoản!</div>
                <div className="text-xs mt-1">Bạn có thể xem chi tiết trong lịch sử giao dịch</div>
              </div>
            </div>
          </div>
        )}

        {/* Failed Message */}
        {status === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center text-red-700">
              <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-semibold">Giao dịch không thành công</div>
                <div className="text-xs mt-1">Vui lòng thử lại hoặc chọn phương thức thanh toán khác</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {status !== 'loading' && (
          <div className="space-y-3">
            {status === 'success' && (
              <button
                onClick={goToPurchaseHistory}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                📋 Xem lịch sử giao dịch
              </button>
            )}

            <button
              onClick={goToMarketplace}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${status === 'success'
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Quay lại Marketplace
            </button>

            <button
              onClick={goToDashboard}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
