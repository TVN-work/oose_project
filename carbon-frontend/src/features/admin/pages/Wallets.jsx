import { useState } from 'react';
import { Wallet, Eye, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const WalletsPage = () => {
  const wallets = [
    {
      user: 'Green Corporation',
      balance: '₫2,450,000',
      transactions: 15,
      status: 'Hoạt động',
      statusColor: 'green',
    },
    {
      user: 'Nguyễn Văn An',
      balance: '₫850,000',
      transactions: 8,
      status: 'Hoạt động',
      statusColor: 'green',
    },
    {
      user: 'Eco Solutions',
      balance: '₫1,200,000',
      transactions: 12,
      status: 'Bị khóa',
      statusColor: 'red',
    },
  ];

  const stats = [
    { label: 'Tổng số dư', value: '₫45.2M', color: 'green', icon: '💳' },
    { label: 'Dòng tiền tháng', value: '₫8.5M', color: 'blue', icon: '📈' },
    { label: 'Phí hệ thống', value: '₫1.87M', color: 'orange', icon: '🏦' },
    { label: 'Ví bị khóa', value: '5', color: 'red', icon: '⚠️' },
  ];

  const viewWallet = (user) => {
    toast.info(`👁️ Đang xem ví của ${user}`);
  };

  const freezeWallet = (user) => {
    toast.warning(`🔒 Đã khóa ví của ${user}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quản lý ví & dòng tiền</h2>
            <p className="opacity-90 mb-4">Tổng giá trị trong hệ thống: ₫62.3M</p>
            <div className="flex space-x-4">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">1,247 ví hoạt động</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">₫1.87M phí hệ thống</span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <Wallet className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-lg transition-all">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${
                stat.color === 'green'
                  ? 'from-green-500 to-green-600'
                  : stat.color === 'blue'
                  ? 'from-blue-500 to-blue-600'
                  : stat.color === 'orange'
                  ? 'from-orange-500 to-orange-600'
                  : 'from-red-500 to-red-600'
              } rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <span className="text-2xl text-white">{stat.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${
              stat.color === 'green'
                ? 'text-green-600'
                : stat.color === 'blue'
                ? 'text-blue-600'
                : stat.color === 'orange'
                ? 'text-orange-600'
                : 'text-red-600'
            }`}>
              {stat.value}
            </p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Wallet Management */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Quản lý ví người dùng</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Người dùng</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Số dư</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Giao dịch</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Trạng thái</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {wallets.map((wallet, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600">💳</span>
                      </div>
                      <span className="font-semibold text-gray-800">{wallet.user}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-green-600">{wallet.balance}</td>
                  <td className="py-4 px-4 text-gray-600">{wallet.transactions}</td>
                  <td className="py-4 px-4">
                    <span className={`bg-${wallet.statusColor}-100 text-${wallet.statusColor}-800 px-3 py-1 rounded-full text-xs font-semibold`}>
                      {wallet.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewWallet(wallet.user)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Xem
                      </button>
                      <button
                        onClick={() => freezeWallet(wallet.user)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors flex items-center"
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        Khóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalletsPage;

