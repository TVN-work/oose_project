import { useState } from 'react';
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
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../../components/common/Modal';
import { useVerificationRequests } from '../../../hooks/useVerifier';
import { useApproveRequest, useRejectRequest, useValidateEmissionData } from '../../../hooks/useVerifier';
import Loading from '../../../components/common/Loading';
import { formatNumber, formatCurrency } from '../../../utils';

const VerificationRequests = () => {
  const [filters, setFilters] = useState({
    status: '',
    date: '',
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'trip', 'vehicle', 'documents'

  // Fetch verification requests from API
  const { data: requestsData, isLoading, refetch } = useVerificationRequests(filters);
  const requests = requestsData || [];
  
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();
  const validateMutation = useValidateEmissionData();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    refetch();
    toast.success('Đã áp dụng bộ lọc');
  };

  const resetFilters = () => {
    setFilters({ status: '', date: '' });
    refetch();
    toast.success('Đã đặt lại bộ lọc');
  };

  const viewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
    setActiveTab('overview');
  };

  const handleApprove = async (requestId) => {
    if (window.confirm(`Bạn có chắc chắn muốn phê duyệt yêu cầu ${requestId}?`)) {
      try {
        await approveMutation.mutateAsync({ requestId });
        refetch();
        if (showDetailModal) {
          setShowDetailModal(false);
          setSelectedRequest(null);
        }
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const handleReject = async (requestId) => {
    setSelectedRequest(requests.find(r => r.id === requestId));
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      await rejectMutation.mutateAsync({ 
        requestId: selectedRequest.id, 
        rejectionReason: rejectionReason 
      });
      refetch();
      setShowRejectModal(false);
      setShowDetailModal(false);
      setRejectionReason('');
      setSelectedRequest(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleValidateEmission = async (requestId) => {
    try {
      await validateMutation.mutateAsync({ 
        requestId, 
        validationData: {} 
      });
      toast.success('Đã kiểm tra dữ liệu phát thải');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[status] || badges.pending}`}>
        {labels[status] || labels.pending}
      </span>
    );
  };

  // Stats summary
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Shield className="w-8 h-8 mr-3" />
              Quản lý yêu cầu xác minh
            </h1>
            <p className="text-blue-50 text-lg">
              Kiểm tra dữ liệu phát thải & hồ sơ tín chỉ carbon
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{stats.total}</p>
          <p className="text-sm text-gray-600">Tổng yêu cầu</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-yellow-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{stats.pending}</p>
          <p className="text-sm text-gray-600">Chờ duyệt</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-green-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{stats.approved}</p>
          <p className="text-sm text-gray-600">Đã duyệt</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-red-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{stats.rejected}</p>
          <p className="text-sm text-gray-600">Từ chối</p>
        </div>
      </div>

      {/* Filter & Actions Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              placeholder="Lọc theo ngày"
            />
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
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <FileCheck className="w-5 h-5 mr-2" />
          Danh sách yêu cầu ({requests.length})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Mã hồ sơ</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">EV Owner</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Phương tiện</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Ngày gửi</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Số tín chỉ</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Trạng thái</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Chưa có yêu cầu nào</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {filters.status || filters.date
                        ? 'Không tìm thấy yêu cầu phù hợp với bộ lọc'
                        : 'Yêu cầu xác minh sẽ xuất hiện khi EV Owner gửi hồ sơ'}
                    </p>
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        #{request.id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {request.owner || request.evOwner || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">{request.ownerEmail || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Car className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-800">{request.vehicle || request.vehicleName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {request.date || (request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN') : 'N/A')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-blue-600">
                        {formatNumber(request.credits || request.creditAmount || 0)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => viewDetail(request)}
                          className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              disabled={approveMutation.isPending}
                              className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Từ chối
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Detail Modal */}
      <Modal 
        isOpen={showDetailModal} 
        onClose={() => {
          setShowDetailModal(false);
          setSelectedRequest(null);
          setActiveTab('overview');
        }} 
        title="Chi tiết yêu cầu xác minh"
        size="large"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex space-x-4">
                {[
                  { id: 'overview', label: 'Tổng quan', icon: Info },
                  { id: 'trip', label: 'Dữ liệu hành trình', icon: Route },
                  { id: 'vehicle', label: 'Thông tin xe', icon: Car },
                  { id: 'documents', label: 'Tài liệu', icon: FileImage },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-4 py-2 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600 font-semibold'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Request Info Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        Mã hồ sơ
                      </label>
                      <p className="font-mono text-sm bg-white px-2 py-1 rounded border">#{selectedRequest.id}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Ngày gửi
                      </label>
                      <p className="text-gray-800">
                        {selectedRequest.date || (selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleDateString('vi-VN') : 'N/A')}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        EV Owner
                      </label>
                      <p className="text-gray-800 font-semibold">{selectedRequest.owner || selectedRequest.evOwner || 'N/A'}</p>
                      {selectedRequest.ownerEmail && (
                        <p className="text-xs text-gray-500 mt-1">{selectedRequest.ownerEmail}</p>
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Trạng thái
                      </label>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600">
                          {formatNumber(selectedRequest.credits || selectedRequest.creditAmount || 0)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">Tín chỉ dự kiến</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <Globe className="w-5 h-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          {selectedRequest.co2Saved || selectedRequest.co2Reduced || 'N/A'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">CO₂ giảm phát thải</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <Route className="w-5 h-5 text-purple-600" />
                        <span className="text-2xl font-bold text-purple-600">
                          {selectedRequest.mileage || selectedRequest.distance || 'N/A'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">Quãng đường</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'trip' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center">
                    <Route className="w-5 h-5 mr-2" />
                    Thông tin hành trình
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Route className="w-4 h-4 mr-1" />
                        Quãng đường (km)
                      </label>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatNumber(selectedRequest.distance || selectedRequest.mileage || 0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Battery className="w-4 h-4 mr-1" />
                        Năng lượng tiêu thụ (kWh)
                      </label>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatNumber(selectedRequest.energyUsed || 0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Gauge className="w-4 h-4 mr-1" />
                        Tốc độ trung bình (km/h)
                      </label>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatNumber(selectedRequest.avgSpeed || selectedRequest.averageSpeed || 0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        CO₂ giảm (tấn)
                      </label>
                      <p className="text-lg font-semibold text-green-600">
                        {selectedRequest.co2Saved || selectedRequest.co2Reduced || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {selectedRequest.note && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                      <p className="text-sm text-gray-700">{selectedRequest.note}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'vehicle' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center">
                    <Car className="w-5 h-5 mr-2" />
                    Thông tin phương tiện
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên xe</label>
                      <p className="text-lg font-semibold text-gray-800">
                        {selectedRequest.vehicle || selectedRequest.vehicleName || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Biển số</label>
                      <p className="text-lg font-semibold text-gray-800">
                        {selectedRequest.licensePlate || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số khung (VIN)</label>
                      <p className="text-sm font-mono text-gray-800">
                        {selectedRequest.vin || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hãng/Model</label>
                      <p className="text-lg font-semibold text-gray-800">
                        {selectedRequest.manufacturer || 'N/A'} {selectedRequest.model || ''}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tổng quãng đường</label>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatNumber(selectedRequest.totalMileage || selectedRequest.mileage || 0)} km
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đăng ký</label>
                      <p className="text-lg font-semibold text-gray-800">
                        {selectedRequest.registrationDate || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center">
                    <FileImage className="w-5 h-5 mr-2" />
                    Tài liệu đính kèm
                  </h4>
                  {selectedRequest.documentUrl || selectedRequest.certificateImageUrl ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {[selectedRequest.documentUrl, selectedRequest.certificateImageUrl]
                        .filter(Boolean)
                        .map((url, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Tài liệu {index + 1}</span>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Tải xuống
                              </a>
                            </div>
                            <div className="bg-white rounded border border-gray-200 p-2">
                              <img
                                src={url}
                                alt={`Document ${index + 1}`}
                                className="w-full h-48 object-contain rounded"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div className="hidden text-center text-gray-500 text-sm py-8">
                                <FileImage className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>Không thể hiển thị hình ảnh</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <FileImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Chưa có tài liệu đính kèm</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {selectedRequest.status === 'pending' && (
              <div className="flex space-x-3 pt-4 border-t">
                <button
                  onClick={() => handleValidateEmission(selectedRequest.id)}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Kiểm tra dữ liệu phát thải
                </button>
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  disabled={approveMutation.isPending}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Duyệt yêu cầu
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
