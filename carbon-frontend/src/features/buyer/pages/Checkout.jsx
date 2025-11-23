import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Shield, Check, CreditCard, Building2, Wallet, Info } from 'lucide-react';
import { usePurchase, useProcessPayment } from '../../../hooks/useBuyer';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '../../../components/common/Modal';
import toast from 'react-hot-toast';
import { formatCurrencyFromUsd, usdToVnd } from '../../../utils';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const purchaseMutation = usePurchase();
  const paymentMutation = useProcessPayment();
  const queryClient = useQueryClient();

  // Get order data from navigation state or use defaults
  const orderData = location.state || {
    listingId: 'CC-001',
    seller: 'Trần Thị B',
    vehicle: 'VinFast VF8',
    mileage: '28,500 km',
    co2Saved: '2.1 tấn',
    quantity: 85,
    pricePerCredit: 22.00,
    transactionFee: 15.00,
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchasedCredits, setPurchasedCredits] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const quantity = orderData.quantity || 85;
  const pricePerCredit = orderData.pricePerCredit || 22.00;
  const transactionFee = orderData.transactionFee || 15.00;
  const subtotal = quantity * pricePerCredit;
  const total = subtotal + transactionFee;

  useEffect(() => {
    // Welcome notification
    setTimeout(() => {
      toast.success('💳 Hoàn tất thanh toán để sở hữu tín chỉ carbon!');
    }, 1000);
  }, []);

  const selectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    if (method !== 'wallet') {
      setSelectedWallet(null);
    }
  };

  const selectWallet = (wallet) => {
    setSelectedWallet(wallet);
  };

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      // Format card number with spaces
      formattedValue = value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
      formattedValue = formattedValue.match(/.{1,4}/g)?.join(' ') || formattedValue;
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    } else if (field === 'expiryDate') {
      // Format expiry date MM/YY
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
      if (formattedValue.length > 5) formattedValue = formattedValue.substring(0, 5);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    setCardData((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const canProceed = () => {
    if (!termsAccepted) return false;
    if (!selectedPaymentMethod) return false;
    if (selectedPaymentMethod === 'wallet' && !selectedWallet) return false;
    if (selectedPaymentMethod === 'card') {
      return (
        cardData.cardNumber.length >= 19 &&
        cardData.expiryDate.length === 5 &&
        cardData.cvv.length === 3 &&
        cardData.cardName.trim().length > 0
      );
    }
    return true;
  };

  const processPayment = async () => {
    if (!canProceed()) {
      if (!termsAccepted) {
        toast.error('❌ Vui lòng đồng ý với điều khoản sử dụng!');
      } else if (!selectedPaymentMethod) {
        toast.error('❌ Vui lòng chọn phương thức thanh toán!');
      } else if (selectedPaymentMethod === 'wallet' && !selectedWallet) {
        toast.error('❌ Vui lòng chọn ví điện tử!');
      }
      return;
    }

    setIsProcessing(true);
    toast.loading('⏳ Đang tạo đơn hàng...', { id: 'payment-processing' });

    try {
      // Step 1: Create purchase transaction (API Gateway → Transaction Service)
      const purchaseResult = await purchaseMutation.mutateAsync({
        creditId: orderData.listingId,
        amount: total, // Amount in USD
        quantity: quantity,
      });

      const txId = purchaseResult.transactionId || purchaseResult.transaction?.id;
      if (!txId) {
        throw new Error('Không nhận được transaction ID');
      }

      setTransactionId(txId);
      toast.dismiss('payment-processing');
      toast.loading('⏳ Đang xử lý thanh toán...', { id: 'payment-processing' });

      // Step 2: Process payment (API Gateway → Payment Service)
      const paymentData = {
        paymentMethod: selectedPaymentMethod,
        wallet: selectedWallet,
        cardData: selectedPaymentMethod === 'credit_card' ? cardData : null,
      };

      const paymentResult = await paymentMutation.mutateAsync({
        transactionId: txId,
        paymentData: paymentData,
      });

      toast.dismiss('payment-processing');

      // Step 3: If payment successful, credits are added to wallet (API Gateway → Carbon-Wallet Service)
      // This is handled by backend automatically
      if (paymentResult.success) {
        // Invalidate queries to refresh wallet and purchase history
        queryClient.invalidateQueries({ queryKey: ['buyer', 'purchase-history'] });
        queryClient.invalidateQueries({ queryKey: ['buyer', 'certificates'] });
        queryClient.invalidateQueries({ queryKey: ['buyer', 'dashboard'] });
        
        // Dispatch event to update wallet (if wallet component is listening)
        window.dispatchEvent(new CustomEvent('credits-purchased', {
          detail: {
            transactionId: txId,
            credits: quantity,
            amount: total,
          }
        }));

        setPurchasedCredits(quantity);
        setShowSuccessModal(true);
        toast.success(`✅ Thanh toán thành công! ${quantity} tín chỉ đã được thêm vào ví của bạn.`);
      } else {
        throw new Error('Thanh toán thất bại');
      }
    } catch (error) {
      toast.dismiss('payment-processing');
      toast.error(`❌ ${error.message || 'Thanh toán thất bại. Vui lòng thử lại!'}`);
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const viewCertificate = () => {
    setShowSuccessModal(false);
    navigate('/buyer/certificates');
    toast.success('🏆 Đang chuyển đến trang chứng nhận...');
  };

  const goBack = () => {
    navigate(-1);
  };

  const getPaymentButtonText = () => {
    if (!selectedPaymentMethod) return 'Chọn phương thức thanh toán';
    if (selectedPaymentMethod === 'wallet' && !selectedWallet) return 'Chọn ví điện tử';
    if (!termsAccepted) return 'Đồng ý điều khoản để tiếp tục';
    return `💳 Thanh toán ngay - ${formatCurrencyFromUsd(total)}`;
  };

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
                    Tóm tắt đơn hàng
                  </h3>
                </div>

                <div className="p-6">
                  {/* Seller Info */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Người bán</h4>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                        {orderData.seller?.charAt(0) || 'T'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{orderData.seller || 'Trần Thị B'}</div>
                        <div className="flex items-center text-sm text-green-600">
                          <Check className="mr-1 w-4 h-4" />
                          <span>Đã xác minh</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Credit Details */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-3">Chi tiết tín chỉ</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loại xe:</span>
                          <span className="font-medium">{orderData.vehicle || 'VinFast VF8'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quãng đường:</span>
                          <span className="font-medium">{orderData.mileage || '28,500 km'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Giảm CO2:</span>
                          <span className="font-medium text-green-600">{orderData.co2Saved || '2.1 tấn'}</span>
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
                      <span className="font-semibold">{formatCurrencyFromUsd(pricePerCredit)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phí giao dịch:</span>
                      <span className="font-semibold">{formatCurrencyFromUsd(transactionFee)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrencyFromUsd(total)}
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
                    {/* Wallet Method */}
                    <div
                      onClick={() => selectPaymentMethod('wallet')}
                      className={`p-4 rounded-xl transition-all cursor-pointer border-2 ${
                        selectedPaymentMethod === 'wallet'
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50'
                          : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">Ví điện tử</div>
                          <div className="text-sm text-gray-600">MoMo, ZaloPay, VNPay</div>
                        </div>
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                          {selectedPaymentMethod === 'wallet' && (
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bank Method */}
                    <div
                      onClick={() => selectPaymentMethod('bank')}
                      className={`p-4 rounded-xl transition-all cursor-pointer border-2 ${
                        selectedPaymentMethod === 'bank'
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50'
                          : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">Chuyển khoản ngân hàng</div>
                          <div className="text-sm text-gray-600">Vietcombank, Techcombank, BIDV</div>
                        </div>
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                          {selectedPaymentMethod === 'bank' && (
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Method */}
                    <div
                      onClick={() => selectPaymentMethod('card')}
                      className={`p-4 rounded-xl transition-all cursor-pointer border-2 ${
                        selectedPaymentMethod === 'card'
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50'
                          : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center mr-4">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">Thẻ tín dụng/ghi nợ</div>
                          <div className="text-sm text-gray-600">Visa, Mastercard, JCB</div>
                        </div>
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                          {selectedPaymentMethod === 'card' && (
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Form Details */}
                  {selectedPaymentMethod && (
                    <div className="mb-8">
                      {/* Wallet Form */}
                      {selectedPaymentMethod === 'wallet' && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-4">Chọn ví điện tử</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {['momo', 'zalopay', 'vnpay'].map((wallet) => (
                              <button
                                key={wallet}
                                onClick={() => selectWallet(wallet)}
                                className={`p-4 border-2 rounded-lg transition-colors ${
                                  selectedWallet === wallet
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-400'
                                }`}
                              >
                                <div className="text-center">
                                  <div
                                    className={`w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold ${
                                      wallet === 'momo'
                                        ? 'bg-pink-500'
                                        : wallet === 'zalopay'
                                        ? 'bg-blue-500'
                                        : 'bg-red-500'
                                    }`}
                                  >
                                    {wallet === 'momo' ? 'M' : wallet === 'zalopay' ? 'Z' : 'V'}
                                  </div>
                                  <div className="text-sm font-medium">
                                    {wallet === 'momo' ? 'MoMo' : wallet === 'zalopay' ? 'ZaloPay' : 'VNPay'}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bank Form */}
                      {selectedPaymentMethod === 'bank' && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-4">Thông tin chuyển khoản</h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="text-sm space-y-1">
                              <div>
                                <strong>Ngân hàng:</strong> Vietcombank
                              </div>
                              <div>
                                <strong>Số tài khoản:</strong> 1234567890
                              </div>
                              <div>
                                <strong>Chủ tài khoản:</strong> CARBON CREDIT MARKETPLACE
                              </div>
                              <div>
                                <strong>Nội dung:</strong> THANHTOAN-CC-{orderData.listingId || '001'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start text-sm text-gray-600">
                            <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Sau khi chuyển khoản, vui lòng chờ 5-10 phút để hệ thống xác nhận.</span>
                          </div>
                        </div>
                      )}

                      {/* Card Form */}
                      {selectedPaymentMethod === 'card' && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-4">Thông tin thẻ</h4>
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Số thẻ</label>
                              <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={cardData.cardNumber}
                                onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                                maxLength={19}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Tháng/Năm</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={cardData.expiryDate}
                                onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                                maxLength={5}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                              <input
                                type="text"
                                placeholder="123"
                                value={cardData.cvv}
                                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                                maxLength={3}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Tên chủ thẻ</label>
                              <input
                                type="text"
                                placeholder="NGUYEN VAN A"
                                value={cardData.cardName}
                                onChange={(e) => handleCardInputChange('cardName', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              />
                            </div>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="text-sm text-yellow-700">
                              ⚠️ <strong>Demo:</strong> Đây là form mẫu, không xử lý thanh toán thực tế.
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
                        <Link to="#" className="text-blue-600 hover:underline">
                          Điều khoản sử dụng
                        </Link>{' '}
                        và{' '}
                        <Link to="#" className="text-blue-600 hover:underline">
                          Chính sách bảo mật
                        </Link>{' '}
                        của Carbon Credit Marketplace. Tôi xác nhận rằng thông tin thanh toán là chính xác và tôi có
                        quyền sử dụng phương thức thanh toán đã chọn.
                      </div>
                    </label>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={processPayment}
                    disabled={!canProceed() || isProcessing}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                      canProceed() && !isProcessing
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white transform hover:scale-105'
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-pulse mr-2">⏳</span>
                        <span>Đang xử lý...</span>
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
            Bạn đã sở hữu {purchasedCredits || quantity} tín chỉ carbon từ {orderData.seller || 'Trần Thị B'}
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-semibold text-green-600">
                  #{transactionId || purchaseMutation.data?.transactionId || 'CC001234'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số lượng:</span>
                <span className="font-semibold">{purchasedCredits || quantity} tín chỉ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng thanh toán:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrencyFromUsd(total)}
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
                <div className="font-semibold">Tín chỉ đã được thêm vào ví của bạn</div>
                <div className="text-xs mt-1">Bạn có thể xem số dư tín chỉ trong Dashboard hoặc Ví Carbon</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={viewCertificate}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white py-3 rounded-lg font-semibold transition-all"
            >
              🏆 Xem chứng nhận
            </button>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/buyer/dashboard');
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;

