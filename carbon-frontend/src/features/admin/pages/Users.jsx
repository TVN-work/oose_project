import { useState } from 'react';
import { 
  Users, 
  Search, 
  Eye, 
  Edit, 
  UserCheck, 
  UserX,
  Filter,
  RotateCcw,
  Shield,
  Car,
  Building2,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../../components/common/Modal';
import { useUsers, useLockUser, useUnlockUser, useUpdateUser } from '../../../hooks/useAdmin';
import Loading from '../../../components/common/Loading';
import { formatNumber } from '../../../utils';

const UsersPage = () => {
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Fetch users from API
  const { data: usersData, isLoading, refetch } = useUsers(filters);
  const users = usersData || [];
  
  const lockMutation = useLockUser();
  const unlockMutation = useUnlockUser();
  const updateMutation = useUpdateUser();

  // Calculate stats from users
  const evOwners = users.filter(u => u.roles?.includes('EV_OWNER') || u.role === 'EV_OWNER').length;
  const buyers = users.filter(u => u.roles?.includes('CC_BUYER') || u.role === 'CC_BUYER' || u.role === 'Buyer').length;
  const verifiers = users.filter(u => u.roles?.includes('CVA') || u.roles?.includes('VERIFIER') || u.role === 'CVA' || u.role === 'VERIFIER').length;
  const activeUsers = users.filter(u => u.status === 'active' || u.status === 'ACTIVE' || !u.status || u.locked === false).length;
  const lockedUsers = users.filter(u => u.status === 'locked' || u.status === 'LOCKED' || u.locked === true).length;

  const stats = [
    {
      icon: Car,
      value: formatNumber(evOwners),
      label: 'EV Owner',
      color: 'blue',
    },
    {
      icon: Building2,
      value: formatNumber(buyers),
      label: 'Buyer',
      color: 'orange',
    },
    {
      icon: Shield,
      value: formatNumber(verifiers),
      label: 'CVA/Verifier',
      color: 'purple',
    },
    {
      icon: CheckCircle,
      value: formatNumber(activeUsers),
      label: 'Hoạt động',
      color: 'green',
    },
    {
      icon: XCircle,
      value: formatNumber(lockedUsers),
      label: 'Bị khóa',
      color: 'red',
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    refetch();
    toast.success('Đã áp dụng bộ lọc');
  };

  const resetFilters = () => {
    setFilters({ role: '', status: '', search: '' });
    refetch();
    toast.success('Đã đặt lại bộ lọc');
  };

  const viewUser = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      full_name: user.full_name || user.fullName || user.name || '',
      email: user.email || '',
      phone_number: user.phone_number || user.phoneNumber || user.phone || '',
      roles: user.roles || user.role || '',
    });
    setShowEditModal(true);
  };

  const handleLockUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn khóa tài khoản này?')) {
      try {
        await lockMutation.mutateAsync(userId);
        refetch();
        toast.success('Đã khóa tài khoản');
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleUnlockUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn mở khóa tài khoản này?')) {
      try {
        await unlockMutation.mutateAsync(userId);
        refetch();
        toast.success('Đã mở khóa tài khoản');
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await updateMutation.mutateAsync({
        userId: selectedUser.id,
        userData: editFormData,
      });
      refetch();
      setShowEditModal(false);
      setSelectedUser(null);
      toast.success('Đã cập nhật thông tin người dùng');
    } catch (error) {
      // Error handled by hook
    }
  };

  const getRoleBadge = (roles) => {
    const roleStr = roles || '';
    if (roleStr.includes('EV_OWNER') || roleStr === 'EV Owner') {
      return { text: 'EV Owner', color: 'blue', icon: Car };
    }
    if (roleStr.includes('CC_BUYER') || roleStr === 'Buyer' || roleStr === 'CC Buyer') {
      return { text: 'Buyer', color: 'orange', icon: Building2 };
    }
    if (roleStr.includes('CVA') || roleStr.includes('VERIFIER') || roleStr === 'CVA' || roleStr === 'VERIFIER') {
      return { text: 'CVA', color: 'purple', icon: Shield };
    }
    if (roleStr.includes('ADMIN') || roleStr === 'Admin') {
      return { text: 'Admin', color: 'red', icon: Shield };
    }
    return { text: roleStr || 'N/A', color: 'gray', icon: UserIcon };
  };

  const getStatusBadge = (user) => {
    const isLocked = user.locked === true || user.status === 'locked' || user.status === 'LOCKED';
    
    if (isLocked) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-200">
          <XCircle className="w-3 h-3" />
          Đã khóa
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3" />
        Hoạt động
      </span>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = !filters.search || 
      (user.full_name || user.fullName || user.name || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesRole = !filters.role || 
      (user.roles || user.role || '').includes(filters.role) ||
      (filters.role === 'EV_OWNER' && (user.roles?.includes('EV_OWNER') || user.role === 'EV Owner')) ||
      (filters.role === 'CC_BUYER' && (user.roles?.includes('CC_BUYER') || user.role === 'Buyer' || user.role === 'CC Buyer')) ||
      (filters.role === 'CVA' && (user.roles?.includes('CVA') || user.roles?.includes('VERIFIER') || user.role === 'CVA' || user.role === 'VERIFIER'));
    
    const matchesStatus = !filters.status ||
      (filters.status === 'active' && !user.locked && user.status !== 'locked' && user.status !== 'LOCKED') ||
      (filters.status === 'locked' && (user.locked === true || user.status === 'locked' || user.status === 'LOCKED'));
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quản lý người dùng</h2>
            <p className="opacity-90 mb-4">
              Tổng cộng {formatNumber(users.length)} người dùng đang hoạt động trong hệ thống
            </p>
            <div className="flex space-x-4">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">{formatNumber(evOwners)} EV Owner</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">{formatNumber(buyers)} Buyer</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">{formatNumber(verifiers)} CVA</span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <Users className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: { bg: 'bg-blue-500', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
            orange: { bg: 'bg-orange-500', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
            purple: { bg: 'bg-purple-500', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
            green: { bg: 'bg-green-500', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
            red: { bg: 'bg-red-500', text: 'text-red-600', gradient: 'from-red-500 to-red-600' },
          };
          const colors = colorClasses[stat.color] || colorClasses.blue;

          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-lg transition-all">
              <div className={`w-12 h-12 bg-gradient-to-r ${colors.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className={`text-2xl font-bold ${colors.text} mb-1`}>{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Tìm kiếm theo tên, email..."
                value={filters.search}
                onChange={handleFilterChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Tất cả vai trò</option>
              <option value="EV_OWNER">EV Owner</option>
              <option value="CC_BUYER">Buyer</option>
              <option value="CVA">CVA/Verifier</option>
            </select>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Đã khóa</option>
            </select>
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center text-sm font-semibold"
            >
              <Search className="w-4 h-4 mr-2" />
              Áp dụng
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center text-sm font-semibold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Danh sách người dùng ({filteredUsers.length})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Người dùng</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Vai trò</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Ngày tham gia</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Trạng thái</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Chưa có người dùng nào</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {filters.role || filters.status || filters.search
                        ? 'Không tìm thấy người dùng phù hợp với bộ lọc'
                        : 'Người dùng sẽ xuất hiện khi họ đăng ký tài khoản'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.roles || user.role);
                  const RoleIcon = roleBadge.icon;
                  const isLocked = user.locked === true || user.status === 'locked' || user.status === 'LOCKED';

                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 bg-${roleBadge.color}-100 rounded-full flex items-center justify-center mr-3`}>
                            <RoleIcon className={`w-5 h-5 text-${roleBadge.color}-600`} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {user.full_name || user.fullName || user.name || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500">{user.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${roleBadge.color}-100 text-${roleBadge.color}-800`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleBadge.text}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.created_at 
                          ? new Date(user.created_at).toLocaleDateString('vi-VN')
                          : user.joinDate || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(user)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => viewUser(user)}
                            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Xem
                          </button>
                          <button
                            onClick={() => editUser(user)}
                            className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Sửa
                          </button>
                          {isLocked ? (
                            <button
                              onClick={() => handleUnlockUser(user.id)}
                              disabled={unlockMutation.isPending}
                              className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center disabled:opacity-50"
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              Mở khóa
                            </button>
                          ) : (
                            <button
                              onClick={() => handleLockUser(user.id)}
                              disabled={lockMutation.isPending}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center disabled:opacity-50"
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Khóa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={showDetailModal} 
        onClose={() => {
          setShowDetailModal(false);
          setSelectedUser(null);
        }} 
        title="Chi tiết người dùng"
        size="large"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                  <p className="text-gray-800">{selectedUser.full_name || selectedUser.fullName || selectedUser.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-800">{selectedUser.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <p className="text-gray-800">{selectedUser.phone_number || selectedUser.phoneNumber || selectedUser.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <p className="text-gray-800">{selectedUser.roles || selectedUser.role || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tham gia</label>
                  <p className="text-gray-800">
                    {selectedUser.created_at 
                      ? new Date(selectedUser.created_at).toLocaleDateString('vi-VN')
                      : selectedUser.joinDate || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  {getStatusBadge(selectedUser)}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
          setEditFormData({});
        }} 
        title="Chỉnh sửa người dùng"
        size="large"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đầy đủ</label>
            <input
              type="text"
              value={editFormData.full_name || ''}
              onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={editFormData.email || ''}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              value={editFormData.phone_number || ''}
              onChange={(e) => setEditFormData({ ...editFormData, phone_number: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <input
              type="text"
              value={editFormData.roles || ''}
              onChange={(e) => setEditFormData({ ...editFormData, roles: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="EV_OWNER, CC_BUYER, CVA, ADMIN"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setSelectedUser(null);
                setEditFormData({});
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
