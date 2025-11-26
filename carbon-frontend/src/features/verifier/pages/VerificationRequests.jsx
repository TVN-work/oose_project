import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  RotateCcw,
  Calendar,
  Shield,
  AlertCircle,
  FileText,
  Car,
  Route,
  Globe,
  Award,
  User,
  Clock,
  CheckCircle2,
  X,
  Download,
  Image as ImageIcon,
  Gauge,
  Battery,
  MapPin,
  FileImage,
  Info,
  ExternalLink
} from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Loading from '../../../components/common/Loading';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';
import verificationService, { VERIFICATION_TYPES, VERIFICATION_STATUSES } from '../../../services/verification/verificationService';
import userService from '../../../services/user/userService';

const VerificationRequests = () => {
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    page: 0,
    entry: 10,
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [note, setNote] = useState('');

  const queryClient = useQueryClient();
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();

  // Fetch verification requests from API
  const { data: requestsData, isLoading, refetch } = useQuery({
    queryKey: ['verification-requests', filters],
    queryFn: () => verificationService.getAllVerificationRequests(filters),
    staleTime: 2 * 60 * 1000,
  });

  const requests = Array.isArray(requestsData) ? requestsData : (requestsData?.content || []);

  // Fetch user names for all unique userIds
  const userIds = [...new Set(requests.map(r => r.userId).filter(Boolean))];
  const userQueries = userIds.map(userId => ({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  }));

  const { data: usersData } = useQuery({
    queryKey: ['users-batch', userIds.join(',')],
    queryFn: async () => {
      const results = await Promise.all(
        userIds.map(id => userService.getUserById(id).catch(() => null))
      );
      return results;
    },
    enabled: userIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Create user map for quick lookup
  const userMap = {};
  if (usersData) {
    usersData.forEach((user, index) => {
      if (user) {
        userMap[userIds[index]] = user;
      }
    });
  }

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: ({ requestId, note }) =>
      verificationService.updateVerificationRequest(requestId, { status: 'APPROVED', note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verification-requests'] });
      showAlert('Đã duyệt yêu cầu thành công!', 'success');
      setShowDetailModal(false);
      setSelectedRequest(null);
      setNote('');
    },
    onError: (error) => {
      showAlert(error.message || 'Lỗi khi duyệt yêu cầu', 'error');
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ requestId, note }) =>
      verificationService.updateVerificationRequest(requestId, { status: 'REJECTED', note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verification-requests'] });
      showAlert('Đã từ chối yêu cầu!', 'success');
      setShowRejectModal(false);
      setShowDetailModal(false);
      setRejectionReason('');
      setSelectedRequest(null);
    },
    onError: (error) => {
      showAlert(error.message || 'Lỗi khi từ chối yêu cầu', 'error');
    },
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 0 }));
  };

  const applyFilters = () => {
    refetch();
    showAlert('Đã áp dụng bộ lọc', 'info');
  };

  const resetFilters = () => {
    setFilters({ status: '', type: '', page: 0, entry: 10 });
    refetch();
    showAlert('Đã đặt lại bộ lọc', 'info');
  };

  const viewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
    setNote(request.note || '');
  };

  const handleApprove = async (requestId) => {
    if (window.confirm(`Bạn có chắc chắn muốn phê duyệt yêu cầu này?`)) {
      approveMutation.mutate({ requestId, note });
    }
  };

  const handleReject = async (requestId) => {
    setSelectedRequest(requests.find(r => r.id === requestId));
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      showAlert('Vui lòng nhập lý do từ chối', 'error');
      return;
    }
    rejectMutation.mutate({
      requestId: selectedRequest.id,
      note: rejectionReason
    });
  };

  // Format datetime from "HH:MM DD-MM-YYYY" format
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    // If already in "HH:MM DD-MM-YYYY" format, return as-is
    if (dateString.includes(' ') && dateString.split(' ').length === 2) {
      return dateString;
    }
    // Try to parse ISO format
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString('vi-VN');
      }
    } catch (e) {
      // ignore
    }
    return dateString;
  };

  if (isLoading) {
    return <Loading />;
  }

  const getStatusBadge = (status) => {
    const upperStatus = status?.toUpperCase();
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      APPROVED: 'bg-green-100 text-green-800 border-green-300',
      REJECTED: 'bg-red-100 text-red-800 border-red-300',
      CANCELLED: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    const labels = {
      PENDING: 'Chờ xác minh',
      APPROVED: 'Đã duyệt',
      REJECTED: 'Từ chối',
      CANCELLED: 'Đã hủy',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[upperStatus] || badges.PENDING}`}>
        {labels[upperStatus] || labels.PENDING}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const upperType = type?.toUpperCase();
    const badges = {
      VEHICLE: 'bg-blue-100 text-blue-800 border-blue-300',
      JOURNEY: 'bg-purple-100 text-purple-800 border-purple-300',
    };
    const labels = {
      VEHICLE: 'Duyệt xe',
      JOURNEY: 'Phát hành tín chỉ',
    };
    const icons = {
      VEHICLE: <Car className="w-3 h-3 mr-1" />,
      JOURNEY: <Route className="w-3 h-3 mr-1" />,
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border inline-flex items-center ${badges[upperType] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {icons[upperType]}
        {labels[upperType] || type || 'N/A'}
      </span>
    );
  };

  // Stats summary
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status?.toUpperCase() === 'PENDING').length,
    approved: requests.filter(r => r.status?.toUpperCase() === 'APPROVED').length,
    rejected: requests.filter(r => r.status?.toUpperCase() === 'REJECTED').length,
    vehicle: requests.filter(r => r.type?.toUpperCase() === 'VEHICLE').length,
    journey: requests.filter(r => r.type?.toUpperCase() === 'JOURNEY').length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Alert Component */}
      <Alert
        isOpen={!!alertMessage}
        type={alertType}
        message={alertMessage}
        onClose={hideAlert}
        position="top-right"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Shield className="w-8 h-8 mr-3" />
              Quản lý yêu cầu xác minh
            </h1>
            <p className="text-blue-50 text-lg">
              Duyệt xe & Phát hành tín chỉ carbon
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">{stats.total}</p>
          <p className="text-xs text-gray-600">Tổng yêu cầu</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-yellow-200 shadow-sm p-4 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">{stats.pending}</p>
          <p className="text-xs text-gray-600">Chờ xác minh</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-green-200 shadow-sm p-4 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">{stats.approved}</p>
          <p className="text-xs text-gray-600">Đã duyệt</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-red-200 shadow-sm p-4 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">{stats.rejected}</p>
          <p className="text-xs text-gray-600">Từ chối</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-4 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">{stats.vehicle}</p>
          <p className="text-xs text-gray-600">Duyệt xe</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-purple-200 shadow-sm p-4 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Route className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">{stats.journey}</p>
          <p className="text-xs text-gray-600">Phát hành TC</p>
        </div>
      </div>

      {/* Filter & Actions Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Tất cả loại</option>
              <option value="VEHICLE">Duyệt xe</option>
              <option value="JOURNEY">Phát hành tín chỉ</option>
            </select>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác minh</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Từ chối</option>
              <option value="CANCELLED">Đã hủy</option>
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

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <FileCheck className="w-5 h-5 mr-2" />
            Danh sách yêu cầu ({requestsData?.totalElements || requests.length})
          </h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Hiển thị:</label>
            <select
              value={filters.entry}
              onChange={(e) => setFilters(prev => ({ ...prev, entry: Number(e.target.value), page: 0 }))}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">mục/trang</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full" style={{ minWidth: '1400px' }}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '160px' }}>Mã yêu cầu</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '160px' }}>Loại</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '300px' }}>Tiêu đề</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '220px' }}>Người yêu cầu</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '180px' }}>Ngày tạo</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '140px' }}>Trạng thái</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '180px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Chưa có yêu cầu nào</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {filters.status || filters.type
                        ? 'Không tìm thấy yêu cầu phù hợp với bộ lọc'
                        : 'Yêu cầu xác minh sẽ xuất hiện khi EV Owner gửi hồ sơ'}
                    </p>
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => viewDetail(request)}
                  >
                    <td className="py-3 px-4" style={{ minWidth: '160px' }}>
                      <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 whitespace-nowrap inline-block">
                        {request.id?.substring(0, 12)}...
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap" style={{ minWidth: '160px' }}>
                      {getTypeBadge(request.type)}
                    </td>
                    <td className="py-3 px-4" style={{ minWidth: '300px' }}>
                      <div className="text-sm text-gray-800 whitespace-nowrap" title={request.title}>
                        {request.title || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4" style={{ minWidth: '220px' }}>
                      <div className="flex items-center whitespace-nowrap">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {userMap[request.userId]?.fullName || userMap[request.userId]?.username || 'Đang tải...'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {userMap[request.userId]?.email || ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap" style={{ minWidth: '180px' }}>
                      {formatDateTime(request.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap" style={{ minWidth: '140px' }}>
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="py-3 px-4" style={{ minWidth: '180px' }}>
                      <div className="flex flex-col items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Nút Xem ở trên cùng */}
                        <button
                          onClick={() => viewDetail(request)}
                          className="bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-xs flex items-center whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Xem chi tiết
                        </button>
                        {/* 2 nút Duyệt/Từ chối ở dưới */}
                        {request.status?.toUpperCase() === 'PENDING' && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleApprove(request.id)}
                              disabled={approveMutation.isPending}
                              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-xs flex items-center disabled:opacity-50 whitespace-nowrap"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-xs flex items-center whitespace-nowrap"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Từ chối
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(requestsData?.totalPages > 1 || requests.length > 0) && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Hiển thị {requests.length > 0 ? filters.page * filters.entry + 1 : 0} - {Math.min((filters.page + 1) * filters.entry, requestsData?.totalElements || requests.length)} trong tổng số {requestsData?.totalElements || requests.length} yêu cầu
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: 0 }))}
                disabled={filters.page === 0}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                «
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                disabled={filters.page === 0}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ‹ Trước
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const totalPages = requestsData?.totalPages || Math.ceil(requests.length / filters.entry) || 1;
                  const currentPage = filters.page;
                  const pages = [];

                  let startPage = Math.max(0, currentPage - 2);
                  let endPage = Math.min(totalPages - 1, currentPage + 2);

                  if (currentPage < 2) {
                    endPage = Math.min(totalPages - 1, 4);
                  }
                  if (currentPage > totalPages - 3) {
                    startPage = Math.max(0, totalPages - 5);
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setFilters(prev => ({ ...prev, page: i }))}
                        className={`px-3 py-1.5 rounded-lg text-sm transition ${currentPage === i
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                  return pages;
                })()}
              </div>

              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={filters.page >= (requestsData?.totalPages || Math.ceil(requests.length / filters.entry)) - 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Sau ›
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: (requestsData?.totalPages || Math.ceil(requests.length / filters.entry)) - 1 }))}
                disabled={filters.page >= (requestsData?.totalPages || Math.ceil(requests.length / filters.entry)) - 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedRequest(null);
          setNote('');
        }}
        title="Chi tiết yêu cầu xác minh"
        size="large"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Header with Type Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTypeBadge(selectedRequest.type)}
                {getStatusBadge(selectedRequest.status)}
              </div>
            </div>

            {/* Main Content */}
            <div className="max-h-[60vh] overflow-y-auto space-y-6">
              {/* Request Info Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Mã yêu cầu
                  </label>
                  <p className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-1.5 rounded border border-blue-200 break-all">{selectedRequest.id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Mã tham chiếu
                  </label>
                  <p className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-1.5 rounded border border-blue-200 break-all">{selectedRequest.referenceId || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Ngày tạo
                  </label>
                  <p className="text-gray-800">{formatDateTime(selectedRequest.createdAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Ngày cập nhật
                  </label>
                  <p className="text-gray-800">{formatDateTime(selectedRequest.updatedAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Người yêu cầu
                  </label>
                  <div className="flex items-center mt-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {userMap[selectedRequest.userId]?.fullName || userMap[selectedRequest.userId]?.username || 'Đang tải...'}
                      </p>
                      <p className="text-xs text-gray-500">{userMap[selectedRequest.userId]?.email || ''}</p>
                      <p className="text-xs text-gray-400 font-mono">ID: {selectedRequest.userId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title and Description */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Tiêu đề
                  </label>
                  <p className="text-gray-800 font-semibold">{selectedRequest.title || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    Mô tả
                  </label>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedRequest.description || 'Không có mô tả'}</p>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <FileImage className="w-4 h-4 mr-1" />
                  Tài liệu đính kèm
                </label>
                {selectedRequest.documentUrl && selectedRequest.documentUrl.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedRequest.documentUrl.map((url, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Tài liệu {index + 1}</span>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Xem
                          </a>
                        </div>
                        <div className="bg-gray-100 rounded border border-gray-200 p-2">
                          <img
                            src={url}
                            alt={`Document ${index + 1}`}
                            className="w-full h-32 object-contain rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden flex-col items-center justify-center text-gray-500 text-sm py-4">
                            <FileImage className="w-8 h-8 mb-2 text-gray-300" />
                            <p className="text-xs">Không thể hiển thị</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                    <FileImage className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Chưa có tài liệu đính kèm</p>
                  </div>
                )}
              </div>

              {/* Note */}
              {selectedRequest.status?.toUpperCase() === 'PENDING' ? (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Ghi chú xác minh
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows="3"
                    placeholder="Nhập ghi chú khi duyệt hoặc từ chối..."
                  />
                </div>
              ) : selectedRequest.note ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Ghi chú xác minh
                  </label>
                  <p className="text-gray-700 text-sm bg-white p-3 rounded border">{selectedRequest.note}</p>
                </div>
              ) : null}
            </div>

            {/* Action Buttons */}
            {selectedRequest.status?.toUpperCase() === 'PENDING' && (
              <div className="flex space-x-3 pt-4 border-t">
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  disabled={approveMutation.isPending}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {approveMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Duyệt yêu cầu
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  disabled={rejectMutation.isPending}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Từ chối
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason('');
        }}
        title="Từ chối yêu cầu xác minh"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-1">Lưu ý</p>
                <p className="text-sm text-yellow-700">
                  Vui lòng cung cấp lý do từ chối rõ ràng để EV Owner có thể cải thiện và gửi lại yêu cầu.
                </p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do từ chối <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="4"
              placeholder="Nhập lý do từ chối yêu cầu xác minh..."
            />
          </div>
          <div className="flex space-x-3 pt-4 border-t">
            <button
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
              }}
              className="flex-1 bg-gray-500 text-white py-2.5 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              Hủy
            </button>
            <button
              onClick={confirmReject}
              disabled={!rejectionReason.trim() || rejectMutation.isPending}
              className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xác nhận từ chối
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VerificationRequests;
