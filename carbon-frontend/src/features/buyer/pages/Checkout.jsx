import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Shield, Check, Wallet, Info, Loader2 } from 'lucide-react';
import { useCreateTransaction, usePayTransaction, useTransactionUtils } from '../../../hooks/useTransaction';
import { useUser } from '../../../hooks/useUser';
import { useAuth } from '../../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { PAYMENT_METHODS } from '../../../services/transaction/transactionService';
import Modal from '../../../components/common/Modal';
import Loading from '../../../components/common/Loading';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../../utils';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { formatAmount } = useTransactionUtils();

  // Mutations
  const createTransactionMutation = useCreateTransaction();
  const payTransactionMutation = usePayTransaction();

  // Get listing data from navigation state
  const listingData = location.state;

  // Redirect if no listing data
  useEffect(() => {
    if (!listingData) {
      toast.error('Không tìm thấy thông tin niêm yết!');
      navigate('/buyer/marketplace');
    }
  }, [listingData, navigate]);

  // States
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [transaction, setTransaction] = useState(null);

  // Fetch seller info using /api/users/:id endpoint
  const { data: sellerInfo, isLoading: isLoadingSellerInfo } = useUser(listingData?.sellerId);

  // Fetch buyer info (current user)
  const buyerId = user?.id;
  const buyerName = user?.fullName || user?.name || user?.username || 'Bạn';

  // Calculate prices
  const quantity = listingData?.quantity || 0;
  const pricePerCredit = listingData?.pricePerCredit || 0;
  const totalPrice = listingData?.totalPrice || (quantity * pricePerCredit);

  // Create transaction when component mounts (if listing data exists)
  useEffect(() => {
    const createTransaction = async () => {
      if (!listingData || !buyerId || transaction || isCreatingTransaction) return;

      setIsCreatingTransaction(true);
      toast.loading('Đang tạo giao dịch...', { id: 'create-transaction' });

      try {
        const transactionData = {
          listingId: listingData.listingId,
          buyerId: buyerId,
          sellerId: listingData.sellerId,
          amount: totalPrice,
          credit: quantity,
          listingType: listingData.type,
        };

        const result = await createTransactionMutation.mutateAsync(transactionData);
        setTransaction(result);
        toast.dismiss('create-transaction');
        toast.success('Đã tạo giao dịch thành công!');
      } catch (error) {
        toast.dismiss('create-transaction');
        toast.error(`Lỗi tạo giao dịch: ${error.message || 'Vui lòng thử lại!'}`);
        console.error('Create transaction error:', error);
      } finally {
        setIsCreatingTransaction(false);
      }
    };

    createTransaction();
  }, [listingData, buyerId]);

  // Payment method options
  const paymentMethods = [
    {
      id: PAYMENT_METHODS.WALLET,
      name: 'Ví điện tử',
      description: 'Thanh toán từ số dư ví của bạn',
      icon: '💰',
      color: 'from-green-400 to-green-500',
    },
    {
      id: PAYMENT_METHODS.VN_PAY,
      name: 'VNPay',
      description: 'Thanh toán qua cổng VNPay',
      icon: '🏦',
      color: 'from-blue-400 to-blue-500',
    },
  ];

  const canProceed = useMemo(() => {
    return termsAccepted && selectedPaymentMethod && transaction;
  }, [termsAccepted, selectedPaymentMethod, transaction]);

  const processPayment = async () => {
    if (!canProceed || !transaction) {
      if (!termsAccepted) {
        toast.error('Vui lòng đồng ý với điều khoản sử dụng!');
      } else if (!selectedPaymentMethod) {
        toast.error('Vui lòng chọn phương thức thanh toán!');
      } else if (!transaction) {
        toast.error('Giao dịch chưa được tạo!');
      }
      return;
    }

    setIsProcessingPayment(true);
    toast.loading('Đang xử lý thanh toán...', { id: 'payment-processing' });

    try {
      const paymentResult = await payTransactionMutation.mutateAsync({
        transactionId: transaction.id,
        paymentMethod: selectedPaymentMethod,
      });

      toast.dismiss('payment-processing');

      // Handle response based on payment method
      if (selectedPaymentMethod === PAYMENT_METHODS.VN_PAY) {
        // VNPay returns a payment URL - redirect to it
        if (paymentResult.paymentUrl) {
          toast.success('Đang chuyển hướng đến VNPay...');
          // Backend sẽ xử lý callback và redirect về frontend
          window.location.href = paymentResult.paymentUrl;
          return;
        } else {
          throw new Error('Không nhận được URL thanh toán từ VNPay');
        }
      } else if (selectedPaymentMethod === PAYMENT_METHODS.WALLET) {
        // Wallet payment - wait for response
        if (paymentResult.status === 'SUCCESS' || paymentResult.success) {
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['listings'] });

          setShowSuccessModal(true);
          toast.success(`Thanh toán thành công! ${quantity} tín chỉ đã được thêm vào ví của bạn.`);
        } else {
          throw new Error(paymentResult.message || 'Thanh toán thất bại');
        }
      }
    } catch (error) {
      toast.dismiss('payment-processing');
      toast.error(`Thanh toán thất bại: ${error.message || 'Vui lòng thử lại!'}`);
      console.error('Payment error:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const viewPurchaseHistory = () => {
    setShowSuccessModal(false);
    navigate('/buyer/purchase-history');
  };

  const goBack = () => {
    navigate(-1);
  };

  const getPaymentButtonText = () => {
    if (isCreatingTransaction) return 'Đang tạo giao dịch...';
    if (!transaction) return 'Chờ tạo giao dịch...';
    if (!selectedPaymentMethod) return 'Chọn phương thức thanh toán';
    if (!termsAccepted) return 'Đồng ý điều khoản để tiếp tục';
    return `💳 Thanh toán ngay - ${formatCurrency(totalPrice)}`;
  };

  // Show loading while creating transaction
  if (!listingData) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-6 mb-6 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center mb-2">
              <button
                onClick={goBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3 text-4xl">💳</span>
                Thanh toán đơn hàng
              </h1>
            </div>
            <p className="text-gray-600 ml-14">Hoàn tất thanh toán để sở hữu tín chỉ carbon</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full flex items-center">
              <Shield className="mr-2 w-4 h-4" />
              <span className="font-medium text-sm">Bảo mật SSL</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm sticky top-6">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2">📋</span>
                    Thông tin giao dịch
                  </h3>
                </div>

                <div className="p-6">
                  {/* Transaction ID */}
                  {transaction && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm text-blue-600">Mã giao dịch</div>
                      <div className="font-semibold text-blue-800 text-sm break-all">
                        {transaction.id}
                      </div>
                    </div>
                  )}

                  {isCreatingTransaction && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2 text-yellow-600" />
                      <span className="text-sm text-yellow-700">Đang tạo giao dịch...</span>
                    </div>
                  )}

                  {/* Buyer Info */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Người mua</h4>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                        {buyerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{buyerName}</div>
                        <div className="flex items-center text-sm text-green-600">
                          <Check className="mr-1 w-4 h-4" />
                          <span>Bạn</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seller Info */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Người bán</h4>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                        {isLoadingSellerInfo ? '...' : (sellerInfo?.fullName || sellerInfo?.username || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        {isLoadingSellerInfo ? (
                          <div className="flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            <span className="text-gray-500">Đang tải...</span>
                          </div>
                        ) : (
                          <>
                            <div className="font-semibold text-gray-800">
                              {sellerInfo?.fullName || sellerInfo?.username || listingData.sellerId}
                            </div>
                            <div className="flex items-center text-sm text-green-600">
                              <Check className="mr-1 w-4 h-4" />
                              <span>Đã xác minh</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Listing Details */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-3">Chi tiết niêm yết</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mã niêm yết:</span>
                          <span className="font-medium text-xs">{listingData.listingId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loại:</span>
                          <span className="font-medium">
                            {listingData.type === 'FIXED_PRICE' ? 'Giá cố định' : 'Đấu giá'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Số lượng tín chỉ:</span>
                      <span className="font-semibold">{quantity} tín chỉ</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Đơn giá:</span>
                      <span className="font-semibold">{formatCurrency(pricePerCredit)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrency(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center text-green-700">
                      <Shield className="mr-2 w-5 h-5" />
                      <div className="text-sm">
                        <div className="font-semibold">Giao dịch được bảo vệ</div>
                        <div>Mã hóa SSL 256-bit</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2">💰</span>
                    Phương thức thanh toán
                  </h3>
                </div>

                <div className="p-6">
                  {/* Payment Methods */}
                  <div className="space-y-4 mb-8">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-4 rounded-xl transition-all cursor-pointer border-2 ${selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50'
                          : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                          }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center mr-4`}>
                            <span className="text-2xl">{method.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{method.name}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                            {selectedPaymentMethod === method.id && (
                              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Method Info */}
                  {selectedPaymentMethod && (
                    <div className="mb-8">
                      {selectedPaymentMethod === PAYMENT_METHODS.WALLET && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <Info className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-green-700">
                              <div className="font-semibold mb-1">Thanh toán bằng ví điện tử</div>
                              <div>Số tiền sẽ được trừ trực tiếp từ số dư ví của bạn. Giao dịch sẽ được xử lý ngay lập tức.</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedPaymentMethod === PAYMENT_METHODS.VN_PAY && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-700">
                              <div className="font-semibold mb-1">Thanh toán qua VNPay</div>
                              <div>Bạn sẽ được chuyển hướng đến trang thanh toán VNPay để hoàn tất giao dịch. Hỗ trợ thẻ ATM, Visa, Mastercard.</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Terms and Conditions */}
                  <div className="mt-8 mb-6">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 mr-3 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="text-sm text-gray-700">
                        Tôi đồng ý với{' '}
                        <Link to="/terms" className="text-blue-600 hover:underline">
                          Điều khoản sử dụng
                        </Link>{' '}
                        và{' '}
                        <Link to="/privacy" className="text-blue-600 hover:underline">
                          Chính sách bảo mật
                        </Link>{' '}
                        của Carbon Credit Marketplace. Tôi xác nhận rằng thông tin thanh toán là chính xác.
                      </div>
                    </label>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={processPayment}
                    disabled={!canProceed || isProcessingPayment || isCreatingTransaction}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${canProceed && !isProcessingPayment && !isCreatingTransaction
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white transform hover:scale-[1.02]'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                  >
                    {isProcessingPayment ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        <span>Đang xử lý thanh toán...</span>
                      </span>
                    ) : (
                      getPaymentButtonText()
                    )}
                  </button>

                  {/* Security Notice */}
                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Shield className="mr-2 w-4 h-4" />
                      <span>Thông tin của bạn được mã hóa và bảo mật tuyệt đối</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Thanh toán thành công!"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎉</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h3>
          <p className="text-gray-600 mb-6">
            Bạn đã mua thành công {quantity} tín chỉ carbon
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-semibold text-green-600 text-xs">
                  {transaction?.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số lượng:</span>
                <span className="font-semibold">{quantity} tín chỉ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng thanh toán:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức:</span>
                <span className="font-semibold">
                  {selectedPaymentMethod === PAYMENT_METHODS.WALLET ? 'Ví điện tử' : 'VNPay'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-semibold">{new Date().toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center text-blue-700">
              <span className="text-2xl mr-2">✅</span>
              <div className="text-sm">
                <div className="font-semibold">Tín chỉ đã được thêm vào tài khoản của bạn</div>
                <div className="text-xs mt-1">Bạn có thể xem chi tiết trong lịch sử giao dịch</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={viewPurchaseHistory}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white py-3 rounded-lg font-semibold transition-all"
            >
              📋 Xem lịch sử giao dịch
            </button>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/buyer/dashboard');
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;

