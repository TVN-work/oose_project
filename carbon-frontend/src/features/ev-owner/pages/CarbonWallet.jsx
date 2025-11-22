import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, RefreshCw, Star, Tag, BarChart3, Upload, Wallet, Leaf, Coins, ArrowUpRight, ArrowDownLeft, Activity, CreditCard, TrendingDown } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useCarbonWallet, useWalletTransactions } from '../../../hooks/useEvOwner';
import { useQueryClient } from '@tanstack/react-query';
import Loading from '../../../components/common/Loading';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';
import { formatCurrencyFromUsd, usdToVnd } from '../../../utils';
import { evOwnerService } from '../../../services/evOwner/evOwnerService';

const CarbonWallet = () => {
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Fetch wallet data
  const { data: walletData, isLoading: walletLoading, refetch: refetchWallet } = useCarbonWallet();
  const { data: transactionsData, isLoading: transactionsLoading, refetch: refetchTransactions } = useWalletTransactions();
  const queryClient = useQueryClient();
  
  // Fetch payment wallet data
  const [paymentWallet, setPaymentWallet] = useState({ balance: 0, currency: 'VND' });
  const [paymentTransactions, setPaymentTransactions] = useState([]);
  const [isLoadingPaymentWallet, setIsLoadingPaymentWallet] = useState(false);

  // Load payment wallet data
  useEffect(() => {
    const loadPaymentWallet = async () => {
      setIsLoadingPaymentWallet(true);
      try {
        const data = await evOwnerService.getPaymentWallet();
        setPaymentWallet(data || { balance: 0, currency: 'VND' });
        
        const txData = await evOwnerService.getPaymentWalletTransactions();
        setPaymentTransactions(txData?.data || txData || []);
      } catch (error) {
        console.error('Error loading payment wallet:', error);
        setPaymentWallet({ balance: 5000000, currency: 'VND' }); // Fallback
        setPaymentTransactions([]);
      } finally {
        setIsLoadingPaymentWallet(false);
      }
    };
    loadPaymentWallet();
  }, [refreshKey]);

  // Use data from hooks, with fallback to default values
  const wallet = walletData || {
    balance: 245.5,
    available: 245.5,
    totalEarned: 189.2,
    totalSold: 189.2,
    statistics: {
      totalCredits: 245.5,
      soldCredits: 189.2,
      pendingCredits: 0,
      availableCredits: 245.5,
    },
  };
  
  const transactions = transactionsData?.data || transactionsData || [];

  // Listen for verification status changes (when credits are issued)
  useEffect(() => {
    const handleVerificationStatusChange = async (event) => {
      const notification = event.detail;
      
      if (notification.type === 'credit_issued') {
        queryClient.invalidateQueries({ queryKey: ['evOwner', 'wallet'] });
        queryClient.invalidateQueries({ queryKey: ['evOwner', 'wallet', 'transactions'] });
        
        setTimeout(async () => {
          queryClient.removeQueries({ queryKey: ['evOwner', 'wallet'] });
          queryClient.removeQueries({ queryKey: ['evOwner', 'wallet', 'transactions'] });
          
          await Promise.all([
            refetchWallet(),
            refetchTransactions(),
          ]);
          
          setRefreshKey(prev => prev + 1);
        }, 300);
        
        showAlert(
          `Tín chỉ đã được cấp! ${notification.message} Số dư mới: ${notification.newBalance?.toFixed(2) || '0.00'} tín chỉ`,
          'success',
          5000
        );
      }
    };

    const handleListingRejected = async (event) => {
      const notification = event.detail;
      
      if (notification.type === 'listing_rejected') {
        queryClient.invalidateQueries({ queryKey: ['evOwner', 'wallet'] });
        queryClient.invalidateQueries({ queryKey: ['evOwner', 'wallet', 'transactions'] });
        
        setTimeout(async () => {
          queryClient.removeQueries({ queryKey: ['evOwner', 'wallet'] });
          queryClient.removeQueries({ queryKey: ['evOwner', 'wallet', 'transactions'] });
          
          await Promise.all([
            refetchWallet(),
            refetchTransactions(),
          ]);
          
          setRefreshKey(prev => prev + 1);
        }, 300);
        
        showAlert(
          `Niêm yết bị từ chối! ${notification.quantity || 0} tín chỉ đã được hoàn trả vào ví. Lý do: ${notification.reason || 'Niêm yết không hợp lệ'}`,
          'info',
          5000
        );
      }
    };

    window.addEventListener('verification-status-changed', handleVerificationStatusChange);
    window.addEventListener('listing-rejected', handleListingRejected);
    
    return () => {
      window.removeEventListener('verification-status-changed', handleVerificationStatusChange);
      window.removeEventListener('listing-rejected', handleListingRejected);
    };
  }, [refetchWallet, refetchTransactions, queryClient, showAlert]);

  // Format carbon credit transactions
  // Only show: earned (from journeys), listing_created (when creating listings), and listing_rejected (when listing is rejected)
  // Do NOT show: sold (sales to buyers - those go to sales history)
  const formattedCarbonTransactions = useMemo(() => {
    const filteredTransactions = (transactions || []).filter(tx => {
      // Only include earned, listing_created, and listing_rejected transactions
      return tx.type === 'earned' || tx.type === 'listing_created' || tx.type === 'listing_rejected';
    });
    
    return filteredTransactions.slice(0, 10).map((tx, idx) => {
      const date = new Date(tx.date || tx.createdAt);
      const isToday = date.toDateString() === new Date().toDateString();
      const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString();
      
      let timeStr = '';
      if (isToday) {
        timeStr = `Hôm nay • ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (isYesterday) {
        timeStr = `Hôm qua • ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        timeStr = date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' }) + 
                  ' • ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      }
      
      const amount = tx.amount || 0;
      const isPositive = amount > 0;
      
      // Determine title based on transaction type
      let title = tx.description;
      if (!title) {
        if (tx.type === 'earned') {
          title = 'Tạo tín chỉ từ hành trình';
        } else if (tx.type === 'listing_created') {
          title = 'Tạo niêm yết tín chỉ';
        } else if (tx.type === 'listing_rejected') {
          title = 'Hoàn trả tín chỉ - Niêm yết bị từ chối';
        } else {
          title = 'Giao dịch tín chỉ';
        }
      }
      
      return {
        id: tx.id || `tx-${idx}`,
        type: isPositive ? 'credit' : 'debit',
        title: title,
        time: timeStr,
        amount: isPositive ? `+${amount.toFixed(2)}` : `${amount.toFixed(2)}`,
        color: isPositive ? 'green' : 'red',
        originalTx: tx,
      };
    });
  }, [transactions, refreshKey]);

  // Format payment wallet transactions
  const formattedPaymentTransactions = useMemo(() => {
    return (paymentTransactions || []).slice(0, 10).map((tx, idx) => {
      const date = new Date(tx.date || tx.createdAt);
      const isToday = date.toDateString() === new Date().toDateString();
      const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString();
      
      let timeStr = '';
      if (isToday) {
        timeStr = `Hôm nay • ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (isYesterday) {
        timeStr = `Hôm qua • ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        timeStr = date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' }) + 
                  ' • ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      }
      
      const amount = tx.amount || 0;
      const isPositive = amount > 0;
      
      // Determine title based on listing type
      let title = tx.description;
      if (!title) {
        if (tx.listingType === 'auction') {
          title = 'Bán tín chỉ - Đấu giá';
        } else if (tx.listingType === 'fixed_price') {
          title = 'Bán tín chỉ - Giá cố định';
        } else {
          title = 'Bán tín chỉ';
        }
      }
      
      return {
        id: tx.id || `ptx-${idx}`,
        type: isPositive ? 'credit' : 'debit',
        title: title,
        time: timeStr,
        amount: isPositive ? `+${amount.toLocaleString('vi-VN')}` : `-${Math.abs(amount).toLocaleString('vi-VN')}`,
        color: isPositive ? 'green' : 'red',
        originalTx: tx,
      };
    });
  }, [paymentTransactions, refreshKey]);

  // Early return AFTER all hooks have been called
  if (walletLoading || isLoadingPaymentWallet) {
    return <Loading />;
  }

  // Calculate statistics
  const totalEarned = wallet.totalEarned || 0;
  const totalSold = wallet.totalSold || 0;
  const availableCredits = wallet.balance || 0;
  const totalRevenue = totalSold * 25; // USD - Only for sold credits
  const paymentBalanceVnd = paymentWallet.balance || 0; // Already in VND

  return (
    <div className="max-w-7xl mx-auto space-y-6" key={refreshKey}>
      {/* Alert Messages */}
      {alertMessage && (
        <Alert 
          key={`alert-${alertMessage}`}
          variant={alertType} 
          dismissible 
          position="toast"
          onDismiss={hideAlert}
        >
          {alertMessage}
        </Alert>
      )}
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-green-600" />
            Ví Carbon
          </h1>
          <p className="text-gray-600 mt-2">Quản lý tín chỉ carbon và số dư thanh toán</p>
        </div>
      </div>

      {/* Two Wallets - Large Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Carbon Credit Wallet */}
        <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Leaf className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Ví Carbon</h3>
                  <p className="text-sm opacity-90">Tín chỉ carbon</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline space-x-3 mb-3">
                <p className="text-5xl font-bold" id="wallet-balance" key={`balance-${refreshKey}`}>
                  {availableCredits.toFixed(2)}
                </p>
                <span className="text-xl opacity-90">tín chỉ</span>
              </div>
              <p className="opacity-90 text-base mb-1">
                Số dư tín chỉ carbon
              </p>
              <p className="text-sm opacity-75">
                Tín chỉ chưa bán - Chỉ có giá trị khi được bán
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white border-opacity-20">
              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs opacity-75 mb-2">Tổng đã kiếm</p>
                <p className="text-2xl font-bold">{totalEarned.toFixed(2)}</p>
                <p className="text-xs opacity-75 mt-1">tín chỉ</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs opacity-75 mb-2">Đã bán</p>
                <p className="text-2xl font-bold">{totalSold.toFixed(2)}</p>
                <p className="text-xs opacity-75 mt-1">tín chỉ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Wallet */}
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Coins className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Ví Tiền</h3>
                  <p className="text-sm opacity-90">Số dư thanh toán</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline space-x-3 mb-3">
                <p className="text-5xl font-bold">
                  {(paymentWallet.balance || 0).toLocaleString('vi-VN')}
                </p>
                <span className="text-xl opacity-90">VNĐ</span>
              </div>
              <p className="opacity-90 text-base mb-1">
                Số dư tiền có được
              </p>
              <p className="text-sm opacity-75">
                Tiền nhận được từ bán tín chỉ
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white border-opacity-20">
              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs opacity-75 mb-2">Tổng nhận</p>
                <p className="text-2xl font-bold">
                  {formatCurrencyFromUsd(totalRevenue, false)}
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs opacity-75 mb-2">Lượt bán</p>
                <p className="text-2xl font-bold">{paymentTransactions.length}</p>
                <p className="text-xs opacity-75 mt-1">lượt</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
              +{((totalEarned / (totalEarned + totalSold)) * 100 || 0).toFixed(0)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalEarned.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Tín chỉ đã kiếm</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{(paymentWallet.balance || 0).toLocaleString('vi-VN')}</p>
          <p className="text-sm text-gray-600">Số dư ví tiền (VNĐ)</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{transactions.length + paymentTransactions.length}</p>
          <p className="text-sm text-gray-600">Tổng hoạt động</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">4.8</p>
          <p className="text-sm text-gray-600">Đánh giá trung bình</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Transaction History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carbon Credit Transactions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Lịch sử tín chỉ
              </h3>
              <Link
                to="/ev-owner/transactions"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Xem tất cả
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto" key={`carbon-transactions-${refreshKey}`}>
              {formattedCarbonTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Chưa có lịch sử tín chỉ nào</p>
                </div>
              ) : (
                formattedCarbonTransactions.map((tx) => {
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        tx.color === 'green' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {tx.type === 'credit' ? (
                          <ArrowDownLeft className={`w-6 h-6 ${tx.color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
                        ) : (
                          <ArrowUpRight className={`w-6 h-6 ${tx.color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{tx.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{tx.time}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${tx.color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount}
                        </p>
                        <p className="text-xs text-gray-500">tín chỉ</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sales History */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Coins className="w-5 h-5 text-blue-600" />
                Lịch sử bán
              </h3>
              <Link
                to="/ev-owner/transactions"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Xem tất cả
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto" key={`payment-transactions-${refreshKey}`}>
              {formattedPaymentTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Coins className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Chưa có lịch sử bán nào</p>
                </div>
              ) : (
                formattedPaymentTransactions.map((tx) => {
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        tx.color === 'green' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {tx.type === 'credit' ? (
                          <ArrowDownLeft className={`w-6 h-6 ${tx.color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
                        ) : (
                          <ArrowUpRight className={`w-6 h-6 ${tx.color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{tx.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{tx.time}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${tx.color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount}
                        </p>
                        <p className="text-xs text-gray-500">VNĐ</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Charts and Quick Actions */}
        <div className="space-y-6">
          {/* Chart Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Biến động tín chỉ
            </h3>
            <div className="h-64 relative">
              <div className="absolute inset-0 flex items-end justify-between px-2 pb-4">
                <div className="flex items-end space-x-2 h-full w-full">
                  {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((month, index) => {
                    const heights = [60, 45, 75, 55, 85, 90, 100];
                    const isCurrent = index === 6;
                    return (
                      <div key={month} className="flex flex-col items-center flex-1">
                        <div
                          className={`${
                            isCurrent ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
                          } rounded-t-lg w-full transition-all duration-300 cursor-pointer`}
                          style={{ height: `${heights[index]}%` }}
                          title={`${month}: ${heights[index]}%`}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2 font-medium">{month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tháng này:</span>
                <span className="font-semibold text-green-600">+{totalEarned.toFixed(1)} tín chỉ</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <Link
                to="/ev-owner/listings"
                className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
              >
                <Tag className="w-5 h-5 text-green-600 mr-3" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Niêm yết bán</p>
                  <p className="text-xs text-gray-600">Đăng bán tín chỉ</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                to="/ev-owner/reports"
                className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              >
                <BarChart3 className="w-5 h-5 text-blue-600 mr-3" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Xem báo cáo</p>
                  <p className="text-xs text-gray-600">Phân tích thu nhập</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                to="/ev-owner/upload-trips"
                className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
              >
                <Upload className="w-5 h-5 text-purple-600 mr-3" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Tải hành trình</p>
                  <p className="text-xs text-gray-600">Tạo tín chỉ mới</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tổng quan</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tổng tín chỉ:</span>
                <span className="font-bold text-gray-800">{totalEarned.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Đã bán:</span>
                <span className="font-bold text-gray-800">{totalSold.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Còn lại:</span>
                <span className="font-bold text-green-600">{availableCredits.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Tổng thu nhập:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {formatCurrencyFromUsd(totalRevenue, false)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonWallet;
