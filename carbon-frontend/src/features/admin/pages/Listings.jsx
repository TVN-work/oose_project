import { useState } from 'react';
import { Tag, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ListingsPage = () => {
  const [statusFilter, setStatusFilter] = useState('');

  const listings = [
    {
      id: 'L001',
      seller: 'Nguyễn Văn An',
      car: 'Tesla Model 3',
      credits: '0.045',
      price: '₫225,000',
      status: 'pending',
      statusColor: 'yellow',
    },
    {
      id: 'L002',
      seller: 'Trần Thị Bình',
      car: 'VinFast VF8',
      credits: '0.038',
      price: '₫195,000',
      status: 'active',
      statusColor: 'green',
    },
    {
      id: 'L003',
      seller: 'Lê Minh Cường',
      car: 'BMW iX3',
      credits: '0.052',
      price: '₫260,000',
      status: 'active',
      statusColor: 'green',
    },
  ];

  const approveListing = (listingId) => {
    toast.success(`✅ Đã duyệt niêm yết #${listingId}`);
  };

  const rejectListing = (listingId) => {
    toast.error(`❌ Đã từ chối niêm yết #${listingId}`);
  };

  const approveAllListings = () => {
    toast.success('✅ Đã duyệt tất cả niêm yết chờ duyệt!');
  };

  const getStatusBadge = (status, statusColor) => {
    const labels = {
      pending: 'Chờ duyệt',
      active: 'Hoạt động',
      rejected: 'Bị từ chối',
    };
    return (
      <span className={`bg-${statusColor}-100 text-${statusColor}-800 px-2 py-1 rounded text-xs font-semibold`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quản lý niêm yết tín chỉ</h2>
            <p className="opacity-90 mb-4">156 niêm yết đang hoạt động, 23 chờ duyệt</p>
            <div className="flex space-x-4">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">12 niêm yết mới hôm nay</span>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-sm">5 cần xem xét</span>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <Tag className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Listings Management */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Danh sách niêm yết</h3>
          <div className="flex space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="pending">Chờ duyệt</option>
              <option value="rejected">Bị từ chối</option>
            </select>
            <button
              onClick={approveAllListings}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Duyệt tất cả
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                {getStatusBadge(listing.status, listing.statusColor)}
                <span className="text-sm text-gray-600">#{listing.id}</span>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600">🚗</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{listing.seller}</p>
                  <p className="text-xs text-gray-500">{listing.car}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm">
                  <span className="font-semibold">Tín chỉ:</span> {listing.credits}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Giá:</span> <span className="text-green-600 font-bold">{listing.price}</span>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => approveListing(listing.id)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg hover:opacity-90 transition-all text-sm flex items-center justify-center"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Duyệt
                </button>
                <button
                  onClick={() => rejectListing(listing.id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg hover:opacity-90 transition-all text-sm flex items-center justify-center"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;

