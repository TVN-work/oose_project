import { useState } from 'react';
import { Award, CheckCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../../components/common/Modal';

const IssueCredits = () => {
  const [showIssuanceForm, setShowIssuanceForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [notes, setNotes] = useState('');

  const approvedProfiles = [
    {
      id: 'VR002',
      owner: 'Trần Thị Bình',
      vehicle: 'VinFast VF8',
      approvalDate: '14/12/2024',
      credits: '0.022',
    },
    {
      id: 'VR008',
      owner: 'Hoàng Văn Nam',
      vehicle: 'Audi e-tron',
      approvalDate: '13/12/2024',
      credits: '0.035',
    },
    {
      id: 'VR009',
      owner: 'Nguyễn Thị Lan',
      vehicle: 'Hyundai Ioniq 5',
      approvalDate: '12/12/2024',
      credits: '0.028',
    },
  ];

  const recentlyIssued = [
    {
      id: 'CC-001-2024',
      owner: 'Lê Minh Đức',
      vehicle: 'Tesla Model Y',
      credits: '0.045',
      issueDate: '11/12/2024',
      status: 'issued',
    },
    {
      id: 'CC-002-2024',
      owner: 'Võ Thị Hoa',
      vehicle: 'BMW i4',
      credits: '0.038',
      issueDate: '10/12/2024',
      status: 'issued',
    },
  ];

  const handleIssueCredit = (profile) => {
    setSelectedProfile(profile);
    setShowIssuanceForm(true);
  };

  const confirmIssuance = (e) => {
    e.preventDefault();
    toast.success(`🏷️ Phát hành thành công! Tín chỉ đã được cấp cho ${selectedProfile.owner}.`);
    setShowIssuanceForm(false);
    setNotes('');
    setSelectedProfile(null);
  };

  const cancelIssuance = () => {
    setShowIssuanceForm(false);
    setNotes('');
    setSelectedProfile(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Approved Profiles Ready for Credit Issuance */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Award className="mr-3 w-6 h-6" />
          Hồ sơ đã duyệt - Chờ cấp tín chỉ
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Mã hồ sơ</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">EV Owner</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Số tín chỉ cần cấp</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Ngày phê duyệt</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {approvedProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded">#{profile.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600">👤</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{profile.owner}</p>
                        <p className="text-xs text-gray-500">{profile.vehicle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-green-600">{profile.credits}</td>
                  <td className="py-4 px-4 text-gray-600">{profile.approvalDate}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleIssueCredit(profile)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      🏷️ Phát hành
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Issuance Form Modal */}
      <Modal
        isOpen={showIssuanceForm}
        onClose={cancelIssuance}
        title="Form xác nhận phát hành tín chỉ"
      >
        {selectedProfile && (
          <form onSubmit={confirmIssuance} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID hồ sơ</label>
                <input
                  type="text"
                  value={selectedProfile.id}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng tín chỉ</label>
                <input
                  type="text"
                  value={selectedProfile.credits}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                rows="4"
                placeholder="Nhập ghi chú về việc phát hành tín chỉ..."
              ></textarea>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={cancelIssuance}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors font-semibold"
              >
                ❌ Hủy bỏ
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
              >
                ✅ Xác nhận phát hành
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Recently Issued Credits */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FileText className="mr-3 w-5 h-5" />
          Tín chỉ đã phát hành gần đây
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Mã tín chỉ</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">EV Owner</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Số lượng</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Ngày phát hành</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentlyIssued.map((credit) => (
                <tr key={credit.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded">{credit.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-gray-800">{credit.owner}</p>
                      <p className="text-xs text-gray-500">{credit.vehicle}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-green-600">{credit.credits}</td>
                  <td className="py-4 px-4 text-gray-600">{credit.issueDate}</td>
                  <td className="py-4 px-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center w-fit">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Đã phát hành
                    </span>
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

export default IssueCredits;

