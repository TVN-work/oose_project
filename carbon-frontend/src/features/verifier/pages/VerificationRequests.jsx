import { useState } from 'react';
import { FileCheck, CheckCircle, XCircle, Eye, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../../components/common/Modal';
import { useVerificationRequests } from '../../../hooks/useVerifier';
import { useApproveRequest, useRejectRequest } from '../../../hooks/useVerifier';
import Loading from '../../../components/common/Loading';

const VerificationRequests = () => {
  const [filters, setFilters] = useState({
    status: '',
    date: '',
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch verification requests from API
  const { data: requestsData, isLoading, refetch } = useVerificationRequests(filters);
  const requests = requestsData || [];
  
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    refetch();
    toast.success('🔍 Đã áp dụng bộ lọc');
  };

  const viewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleApprove = async (requestId) => {
    if (window.confirm(`Bạn có chắc chắn muốn phê duyệt yêu cầu ${requestId}?`)) {
      try {
        await approveMutation.mutateAsync({ requestId });
        refetch();
        if (showDetailModal) {
          setShowDetailModal(false);
        }
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const handleReject = async (requestId) => {
    const reason = window.prompt('Vui lòng nhập lý do từ chối:');
    if (reason) {
      try {
        await rejectMutation.mutateAsync({ requestId, rejectionReason: reason });
        refetch();
        if (showDetailModal) {
          setShowDetailModal(false);
        }
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <FileCheck className="mr-3 w-6 h-6" />
            Bộ lọc yêu cầu
          </h3>

          <div className="flex flex-wrap items-center gap-4">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Mã hồ sơ</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">EV Owner</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Ngày gửi</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Số tín chỉ dự kiến</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Trạng thái</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">#{request.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600">👤</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{request.owner || request.evOwner}</p>
                        <p className="text-xs text-gray-500">{request.vehicle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{request.date || new Date(request.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="py-4 px-4 font-bold text-blue-600">{request.credits || request.creditAmount}</td>
                  <td className="py-4 px-4">
                    {request.status === 'pending' && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Chờ duyệt
                      </span>
                    )}
                    {request.status === 'approved' && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Đã duyệt
                      </span>
                    )}
                    {request.status === 'rejected' && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Từ chối
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewDetail(request)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </button>
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={request.status !== 'pending' || approveMutation.isPending}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={request.status !== 'pending' || rejectMutation.isPending}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Từ chối
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">Hiển thị {requests.length} trong tổng số 23 yêu cầu</p>
          <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Trước
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Sau</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết yêu cầu xác minh">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã hồ sơ</label>
                <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">#{selectedRequest.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày gửi</label>
                <p className="text-gray-800">{selectedRequest.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EV Owner</label>
                <p className="text-gray-800">{selectedRequest.owner}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe</label>
                <p className="text-gray-800">{selectedRequest.vehicle}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quãng đường</label>
                <p className="text-gray-800">{selectedRequest.mileage}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CO2 giảm</label>
                <p className="text-gray-800">{selectedRequest.co2Saved}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tín chỉ dự kiến</label>
                <p className="font-bold text-blue-600">{selectedRequest.credits}</p>
              </div>
            </div>
            <div className="flex space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  handleApprove(selectedRequest.id);
                }}
                disabled={selectedRequest.status !== 'pending' || approveMutation.isPending}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✅ Duyệt
              </button>
              <button
                onClick={() => {
                  handleReject(selectedRequest.id);
                }}
                disabled={selectedRequest.status !== 'pending' || rejectMutation.isPending}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ❌ Từ chối
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VerificationRequests;

