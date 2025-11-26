import { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  RotateCcw,
  Shield,
  Car,
  Building2,
  User as UserIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useUsers } from '../../../hooks/useUser';
import Loading from '../../../components/common/Loading';
import { formatNumber } from '../../../utils';

const UsersPage = () => {
  const [filters, setFilters] = useState({
    role: '',
    search: '',
  });

  // Fetch users from userService API
  const { data: usersData, isLoading, refetch } = useUsers({ page: 0, entry: 1000 });
  // Handle different response formats from API
  const users = Array.isArray(usersData) ? usersData : (usersData?.content || usersData?.data || []);

  // Calculate stats from users
  const evOwners = users.filter(u => u.roles?.includes('EV_OWNER') || u.role === 'EV_OWNER').length;
  const buyers = users.filter(u => u.roles?.includes('CC_BUYER') || u.role === 'CC_BUYER' || u.role === 'Buyer').length;
  const verifiers = users.filter(u => u.roles?.includes('CVA') || u.roles?.includes('VERIFIER') || u.role === 'CVA' || u.role === 'VERIFIER').length;

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
      icon: Users,
      value: formatNumber(users.length),
      label: 'Tổng người dùng',
      color: 'green',
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
    setFilters({ role: '', search: '' });
    refetch();
    toast.success('Đã đặt lại bộ lọc');
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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = !filters.search ||
      (user.full_name || user.fullName || user.name || user.username || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (user.phone_number || user.phoneNumber || '').toLowerCase().includes(filters.search.toLowerCase());

    const matchesRole = !filters.role ||
      (user.roles || user.role || '').includes(filters.role) ||
      (filters.role === 'EV_OWNER' && (user.roles?.includes('EV_OWNER') || user.role === 'EV Owner' || user.role === 'EV_OWNER')) ||
      (filters.role === 'CC_BUYER' && (user.roles?.includes('CC_BUYER') || user.role === 'Buyer' || user.role === 'CC Buyer' || user.role === 'CC_BUYER')) ||
      (filters.role === 'CVA' && (user.roles?.includes('CVA') || user.roles?.includes('VERIFIER') || user.role === 'CVA' || user.role === 'VERIFIER'));

    return matchesSearch && matchesRole;
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
      <div className="grid md:grid-cols-4 gap-4">
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
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Họ và tên</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Số điện thoại</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Vai trò</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Chưa có người dùng nào</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {filters.role || filters.search
                        ? 'Không tìm thấy người dùng phù hợp với bộ lọc'
                        : 'Người dùng sẽ xuất hiện khi họ đăng ký tài khoản'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.roles || user.role);
                  const RoleIcon = roleBadge.icon;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 bg-${roleBadge.color}-100 rounded-full flex items-center justify-center mr-2`}>
                            <RoleIcon className={`w-4 h-4 text-${roleBadge.color}-600`} />
                          </div>
                          <span className="font-medium text-gray-800 text-sm">
                            {user.fullName || user.full_name || user.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.email || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.phoneNumber || user.phone_number || user.phone || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${roleBadge.color}-100 text-${roleBadge.color}-800`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleBadge.text}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
