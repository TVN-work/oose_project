import { useState } from 'react';
import {
  Award,
  CheckCircle,
  FileText,
  FileCheck,
  User,
  Car,
  Shield,
  Calendar,
  AlertCircle,
  X,
  CheckCircle2,
  Globe,
  Route,
  Battery,
  Gauge,
  Info,
  Loader2,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../../components/common/Modal';
import { useVerificationRequests } from '../../../hooks/useVerifier';
import { useIssueCredits } from '../../../hooks/useVerifier';
import Loading from '../../../components/common/Loading';
import { formatNumber } from '../../../utils';

const IssueCredits = () => {
  const [showIssuanceForm, setShowIssuanceForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [notes, setNotes] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch approved requests ready for credit issuance
  const { data: requestsData, isLoading, refetch } = useVerificationRequests({ status: 'approved' });
  const approvedRequests = requestsData || [];

  // Filter out requests that might already have credits issued
  const readyForIssuance = approvedRequests.filter(r => r.status === 'approved');

  const issueMutation = useIssueCredits();

  // Calculate stats
  const totalReady = readyForIssuance.length;
  const totalCreditsPending = readyForIssuance.reduce((sum, r) => sum + parseFloat(r.credits || r.creditAmount || 0), 0);
  const recentlyIssuedCount = approvedRequests.filter(r => r.status === 'approved').length;

  const handleIssueCredit = (profile) => {
    setSelectedProfile(profile);
    setCreditAmount(profile.credits || profile.creditAmount || '0');
    setNotes('');
    setErrors({});
    setShowIssuanceForm(true);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!creditAmount || parseFloat(creditAmount) <= 0) {
      newErrors.creditAmount = 'Số lượng tín chỉ phải lớn hơn 0';
    }

    if (parseFloat(creditAmount) > parseFloat(selectedProfile.credits || selectedProfile.creditAmount || 0) * 1.1) {
      newErrors.creditAmount = 'Số lượng tín chỉ không được vượt quá 110% số lượng dự kiến';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const confirmIssuance = async (e) => {
    e.preventDefault();

    if (!selectedProfile) return;

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      const amount = parseFloat(creditAmount);

      await issueMutation.mutateAsync({
        requestId: selectedProfile.id,
        creditData: {
          amount: amount,
          notes: notes,
        },
      });

      toast.success(`Phát hành thành công! ${formatNumber(amount)} tín chỉ đã được cấp cho ${selectedProfile.owner || selectedProfile.evOwner}.`);
      setShowIssuanceForm(false);
      setNotes('');
      setCreditAmount('');
      setSelectedProfile(null);
      setErrors({});
      refetch();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const cancelIssuance = () => {
    setShowIssuanceForm(false);
    setNotes('');
    setCreditAmount('');
    setSelectedProfile(null);
    setErrors({});
  };

  if (isLoading) {
    return <Loading />;
  }

  // Recently issued credits (from all requests that are approved)
  const recentlyIssued = approvedRequests
    .filter(r => r.status === 'approved')
    .slice(0, 5)
    .map(r => ({
      id: r.id,
      owner: r.owner || r.evOwner || 'N/A',
      vehicle: r.vehicle || 'N/A',
      credits: r.credits || r.creditAmount || '0',
      issueDate: r.date || (r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : 'N/A'),
      status: 'issued',
    }));

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Award className="w-8 h-8 mr-3" />
              Phát hành tín chỉ carbon
            </h1>
            <p className="text-green-50 text-lg">
              Cấp tín chỉ và ghi vào ví carbon của EV Owner
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border-2 border-green-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{totalReady}</p>
          <p className="text-sm text-gray-600">Hồ sơ chờ cấp tín chỉ</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{formatNumber(totalCreditsPending)}</p>
          <p className="text-sm text-gray-600">Tổng tín chỉ chờ cấp</p>
        </div>
        <div className="bg-white rounded-xl border-2 border-purple-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{recentlyIssuedCount}</p>
          <p className="text-sm text-gray-600">Tín chỉ đã phát hành</p>
        </div>
      </div>

      {/* Approved Profiles Ready for Credit Issuance */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Award className="mr-3 w-5 h-5" />
            Hồ sơ đã duyệt - Chờ cấp tín chỉ
          </h3>
          <div className="text-sm text-gray-600">
            Tổng: <span className="font-semibold text-gray-800">{readyForIssuance.length}</span> hồ sơ
          </div>
        </div>

        {readyForIssuance.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có hồ sơ nào sẵn sàng để phát hành tín chỉ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Mã hồ sơ</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">EV Owner</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Phương tiện</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Số tín chỉ dự kiến</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Ngày phê duyệt</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {readyForIssuance.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">#{profile.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{profile.owner || profile.evOwner || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{profile.ownerEmail || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Car className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-800">{profile.vehicle || profile.vehicleName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-green-500 mr-2" />
                        <span className="font-bold text-green-600">
                          {formatNumber(profile.credits || profile.creditAmount || 0)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {profile.date || (profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : 'N/A')}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleIssueCredit(profile)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Phát hành
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enhanced Credit Issuance Form Modal */}
      <Modal
        isOpen={showIssuanceForm}
        onClose={cancelIssuance}
        title="Xác nhận phát hành tín chỉ"
        size="large"
      >
        {selectedProfile && (
          <form onSubmit={confirmIssuance} className="space-y-6">
            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Lưu ý quan trọng</p>
                  <p>Vui lòng kiểm tra kỹ thông tin trước khi phát hành. Tín chỉ sẽ được ghi vào ví carbon của EV Owner ngay sau khi xác nhận.</p>
                </div>
              </div>
            </div>

            {/* Request Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Thông tin hồ sơ
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Mã hồ sơ</label>
                  <p className="font-mono text-sm bg-white px-3 py-2 rounded border border-gray-200">#{selectedProfile.id}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ngày phê duyệt</label>
                  <p className="text-sm text-gray-800">
                    {selectedProfile.date || (selectedProfile.createdAt ? new Date(selectedProfile.createdAt).toLocaleDateString('vi-VN') : 'N/A')}
                  </p>
                </div>
              </div>
            </div>

            {/* EV Owner & Vehicle Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  EV Owner
                </label>
                <p className="text-gray-800 font-semibold">{selectedProfile.owner || selectedProfile.evOwner || 'N/A'}</p>
                {selectedProfile.ownerEmail && (
                  <p className="text-xs text-gray-500 mt-1">{selectedProfile.ownerEmail}</p>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Car className="w-4 h-4 mr-1" />
                  Phương tiện
                </label>
                <p className="text-gray-800 font-semibold">{selectedProfile.vehicle || selectedProfile.vehicleName || 'N/A'}</p>
                {selectedProfile.licensePlate && (
                  <p className="text-xs text-gray-500 mt-1">Biển số: {selectedProfile.licensePlate}</p>
                )}
              </div>
            </div>

            {/* Trip Data Summary */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Route className="w-4 h-4 mr-2" />
                Tóm tắt dữ liệu hành trình
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center mb-1">
                    <Route className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-xs text-gray-600">Quãng đường</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {formatNumber(selectedProfile.distance || selectedProfile.mileage || 0)} km
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <Globe className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-xs text-gray-600">CO₂ giảm</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    {selectedProfile.co2Saved || selectedProfile.co2Reduced || 'N/A'}
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <Battery className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-xs text-gray-600">Năng lượng</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {formatNumber(selectedProfile.energyUsed || 0)} kWh
                  </p>
                </div>
              </div>
            </div>

            {/* Credit Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Award className="w-4 h-4 mr-1" />
                Số lượng tín chỉ cần cấp <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                max={parseFloat(selectedProfile.credits || selectedProfile.creditAmount || 0) * 1.1}
                value={creditAmount}
                onChange={(e) => {
                  setCreditAmount(e.target.value);
                  if (errors.creditAmount) {
                    setErrors({ ...errors, creditAmount: '' });
                  }
                }}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.creditAmount
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                  }`}
                placeholder="Nhập số lượng tín chỉ"
              />
              {errors.creditAmount && (
                <p className="text-xs text-red-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.creditAmount}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Số lượng dự kiến: <span className="font-semibold">{formatNumber(selectedProfile.credits || selectedProfile.creditAmount || 0)}</span> tín chỉ
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="4"
                placeholder="Nhập ghi chú về việc phát hành tín chỉ (nếu có)..."
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={cancelIssuance}
                className="bg-gray-500 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={issueMutation.isPending || !!errors.creditAmount}
                className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {issueMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Xác nhận phát hành
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Recently Issued Credits */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FileText className="mr-3 w-5 h-5" />
            Tín chỉ đã phát hành gần đây
          </h3>
          <div className="text-sm text-gray-600">
            Tổng: <span className="font-semibold text-gray-800">{recentlyIssued.length}</span> tín chỉ
          </div>
        </div>

        {recentlyIssued.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có tín chỉ nào được phát hành</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Mã tín chỉ</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">EV Owner</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Phương tiện</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Số lượng</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Ngày phát hành</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentlyIssued.map((credit) => (
                  <tr key={credit.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">#{credit.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{credit.owner}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Car className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-800">{credit.vehicle}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-green-600">
                      {formatNumber(credit.credits)}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{credit.issueDate}</td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold border border-green-300 flex items-center w-fit">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã phát hành
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueCredits;
