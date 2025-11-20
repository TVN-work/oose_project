import { useState } from 'react';
import { Users, Search, Eye, Edit, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../../components/common/Modal';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    {
      id: 'U001',
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@email.com',
      role: 'EV Owner',
      joinDate: '15/01/2024',
      transactions: 12,
      status: 'Hoạt động',
      statusColor: 'green',
    },
    {
      id: 'U002',
      name: 'Green Corporation',
      email: 'contact@greencorp.com',
      role: 'Buyer',
      joinDate: '20/02/2024',
      transactions: 8,
      status: 'Hoạt động',
      statusColor: 'green',
    },
    {
      id: 'U003',
      name: 'Trần Thị Bình',
      email: 'binh.tran@email.com',
      role: 'EV Owner',
      joinDate: '10/03/2024',
      transactions: 5,
      status: 'Tạm khóa',
      statusColor: 'red',
    },
  ];

  const stats = [
    { label: 'EV Owner', value: '856', color: 'blue', icon: '🚗' },
    { label: 'Buyer', value: '391', color: 'orange', icon: '🏢' },
    { label: 'Online', value: '247', color: 'green', icon: '✅' },
    { label: 'Bị khóa', value: '12', color: 'red', icon: '⚠️' },
  ];

  const viewUser = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const editUser = (userId) => {
    toast.info(`✏️ Đang chỉnh sửa người dùng #${userId}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quản lý người dùng</h2>
            <p className="opacity-90 mb-4">Tổng cộng 1,247 người dùng đang hoạt động trong hệ thống</p>
            <div className="flex space-x-4">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">856 EV Owner</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">391 Buyer</span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <Users className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-lg transition-all">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${
                stat.color === 'blue'
                  ? 'from-blue-500 to-blue-600'
                  : stat.color === 'orange'
                  ? 'from-orange-500 to-orange-600'
                  : stat.color === 'green'
                  ? 'from-green-500 to-green-600'
                  : 'from-red-500 to-red-600'
              } rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <span className="text-2xl text-white">{stat.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${
              stat.color === 'blue'
                ? 'text-blue-600'
                : stat.color === 'orange'
                ? 'text-orange-600'
                : stat.color === 'green'
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {stat.value}
            </p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* User Management Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Danh sách người dùng</h3>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả vai trò</option>
              <option value="EV Owner">EV Owner</option>
              <option value="Buyer">Buyer</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Người dùng</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Vai trò</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Ngày tham gia</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Giao dịch</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Trạng thái</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-sm">{user.role === 'EV Owner' ? '🚗' : '🏢'}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">{user.role}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{user.joinDate}</td>
                  <td className="py-4 px-4 font-bold text-green-600">{user.transactions}</td>
                  <td className="py-4 px-4">
                    <span className={`bg-${user.statusColor}-100 text-${user.statusColor}-800 px-3 py-1 rounded-full text-xs font-semibold`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewUser(user)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Xem
                      </button>
                      <button
                        onClick={() => editUser(user.id)}
                        className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 transition-colors flex items-center"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết người dùng">
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                <p className="text-gray-800">{selectedUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-800">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <p className="text-gray-800">{selectedUser.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tham gia</label>
                <p className="text-gray-800">{selectedUser.joinDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số giao dịch</label>
                <p className="text-gray-800">{selectedUser.transactions}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <p className="text-gray-800">{selectedUser.status}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersPage;

