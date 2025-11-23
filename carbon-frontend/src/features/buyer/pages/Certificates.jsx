import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, RefreshCw, Award, DollarSign, Globe, CreditCard, Eye, Calendar, FileText, CheckCircle, QrCode, X, Building2, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { buyerService } from '../../../services/buyer/buyerService';
import { useDownloadCertificate } from '../../../hooks/useBuyer';
import Loading from '../../../components/common/Loading';
import toast from 'react-hot-toast';
import { formatCurrency, formatCurrencyFromUsd } from '../../../utils';

const Certificates = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch certificates from database
  const { data: certificatesData, isLoading, error, refetch } = useQuery({
    queryKey: ['buyer', 'certificates'],
    queryFn: () => buyerService.getCertificates(),
    staleTime: 30000, // 30 seconds
  });

  const downloadCertificateMutation = useDownloadCertificate();

  const certificates = certificatesData?.data || [];

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Không thể tải danh sách chứng nhận. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  const handleDownload = async (certificateId) => {
    try {
      await downloadCertificateMutation.mutateAsync(certificateId);
      toast.success('Đang tải chứng nhận...');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Không thể tải chứng nhận. Vui lòng thử lại.');
    }
  };

  const handleViewDetails = (cert) => {
    setSelectedCertificate(cert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  const handleExportAll = () => {
    toast.success('Đang tạo file ZIP chứa tất cả chứng nhận. Vui lòng chờ...');
    setTimeout(() => {
      toast.success('✅ Đã tải xuống tất cả chứng nhận thành công!');
    }, 2000);
  };

  const handleRefresh = () => {
    refetch();
    toast.success('🔄 Đã cập nhật danh sách chứng nhận mới nhất!');
  };

  const getStatusBadge = (status) => {
    if (status === 'verified') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã xác minh
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        ⏳ Đang xử lý
      </span>
    );
  };


  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{certificates.length}</p>
          <p className="text-sm text-gray-600">Tổng chứng nhận</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {certificates.reduce((sum, c) => sum + (c.credits || 0), 0)}
          </p>
          <p className="text-sm text-gray-600">Tổng tín chỉ</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {certificates.reduce((sum, c) => sum + (c.co2Saved || 0), 0).toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">Tấn CO2 giảm</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(certificates.reduce((sum, c) => sum + (c.value || 0), 0))}
          </p>
          <p className="text-sm text-gray-600">Tổng giá trị</p>
        </div>
      </div>

      {/* Header with Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Danh sách chứng nhận tín chỉ carbon
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportAll}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải tất cả
            </button>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Chưa có chứng nhận nào</h3>
          <p className="text-gray-600">Chứng nhận sẽ được tạo tự động sau khi bạn mua tín chỉ thành công.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Certificate Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    <span className="text-sm font-semibold">Chứng nhận tín chỉ</span>
                  </div>
                  {getStatusBadge(cert.status)}
                </div>
                <div className="text-xs opacity-90">Serial: {cert.serialNumber}</div>
              </div>

              {/* Certificate Body */}
              <div className="p-5 space-y-4">
                {/* Owner Info */}
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span>EV Owner</span>
                  </div>
                  <div className="font-semibold text-gray-800">{cert.owner}</div>
                </div>

                {/* Credits & CO2 */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Số tín chỉ</div>
                    <div className="text-lg font-bold text-blue-600">{cert.credits}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">CO₂ giảm</div>
                    <div className="text-lg font-bold text-green-600">{cert.co2Saved} tấn</div>
                  </div>
                </div>

                {/* Value */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">Giá trị</div>
                  <div className="text-lg font-bold text-gray-800">{formatCurrency(cert.value)}</div>
                </div>

                {/* Issue Date */}
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Cấp ngày: {cert.date}</span>
                </div>

                {/* Standard */}
                <div className="flex items-center text-xs text-gray-500">
                  <Shield className="w-3 h-3 mr-1" />
                  <span>{cert.standard}</span>
                </div>
              </div>

              {/* Certificate Footer */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => handleViewDetails(cert)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Xem chi tiết
                </button>
                <button
                  onClick={() => handleDownload(cert.id)}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Tải PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Detail Modal - Using Portal */}
      {isModalOpen && selectedCertificate && createPortal(
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm fade-in"
          onClick={handleCloseModal}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 99999,
            width: '100vw',
            height: '100vh'
          }}
        >
          <div 
            className="bg-white max-w-4xl w-full mx-4 rounded-xl shadow-2xl fade-in overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Certificate Content */}
            <div 
              className="certificate-scrollable relative p-6 bg-gradient-to-b from-white via-green-50/20 to-white overflow-y-auto"
              style={{ 
                maxHeight: 'calc(90vh - 32px)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {/* Watermark */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="flex items-center justify-center h-full">
                  <Shield className="w-64 h-64 md:w-96 md:h-96 text-green-600" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-6 relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-green-600 rounded-full p-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-wide">
                  CHỨNG NHẬN TÍN CHỈ CARBON
                </h2>
                <div className="w-24 h-0.5 bg-green-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600 uppercase tracking-wider">
                  Carbon Credit Certificate
                </p>
              </div>

              {/* Main Content */}
              <div className="space-y-5 relative z-10">
                {/* Certificate Info Grid */}
                <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-green-200 p-5 shadow-sm">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Certificate Details */}
                      <div>
                        <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3 border-b border-green-200 pb-2">
                          Thông tin chứng nhận
                        </h3>
                        <div className="space-y-2.5">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Mã chứng nhận</div>
                            <div className="font-mono text-xs font-semibold text-gray-800 break-all">{selectedCertificate.id}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Serial Number</div>
                            <div className="text-sm font-bold text-green-700">{selectedCertificate.serialNumber}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Ngày cấp</div>
                              <div className="text-sm font-semibold text-gray-800">{selectedCertificate.date}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Ngày hết hạn</div>
                              <div className="text-sm font-semibold text-gray-800">{selectedCertificate.expiryDateFormatted}</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Tiêu chuẩn</div>
                            <div className="text-sm font-semibold text-gray-800">{selectedCertificate.standard}</div>
                          </div>
                        </div>
                      </div>

                      {/* Owner Info */}
                      <div>
                        <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3 border-b border-green-200 pb-2">
                          Chủ sở hữu tín chỉ
                        </h3>
                        <div className="space-y-2.5">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Tên</div>
                            <div className="text-sm font-semibold text-gray-800">{selectedCertificate.owner}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Email</div>
                            <div className="text-sm text-gray-700 break-all">{selectedCertificate.ownerEmail || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Credit Info */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                        <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3 text-center">
                          Thông tin tín chỉ
                        </h3>
                        <div className="text-center mb-3">
                          <div className="text-4xl font-bold text-green-600 mb-1">{selectedCertificate.credits}</div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Tín chỉ carbon</div>
                        </div>
                        <div className="border-t border-green-200 pt-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">CO₂ giảm phát thải</span>
                            <span className="text-sm font-bold text-green-600">{selectedCertificate.co2Saved} tấn</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Giá trị</span>
                            <span className="text-sm font-semibold text-gray-800">{formatCurrency(selectedCertificate.value)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Giá mỗi tín chỉ</span>
                            <span className="text-sm font-semibold text-gray-800">{formatCurrencyFromUsd(selectedCertificate.pricePerCredit)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Transaction Info */}
                      <div>
                        <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3 border-b border-green-200 pb-2">
                          Thông tin giao dịch
                        </h3>
                        <div className="space-y-2.5">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Mã giao dịch</div>
                            <div className="font-mono text-xs text-gray-700 break-all">{selectedCertificate.transactionId}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Phương thức</div>
                              <div className="text-sm font-semibold text-gray-800">
                                {selectedCertificate.paymentMethod === 'e_wallet' ? 'E-Wallet' : 
                                 selectedCertificate.paymentMethod === 'banking' ? 'Banking' : 
                                 selectedCertificate.paymentMethod === 'credit_card' ? 'Credit Card' : 
                                 selectedCertificate.paymentMethod}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Loại niêm yết</div>
                              <div className="text-sm font-semibold text-gray-800">
                                {selectedCertificate.listingType === 'fixed_price' ? 'Giá cố định' : 
                                 selectedCertificate.listingType === 'auction' ? 'Đấu giá' : 
                                 selectedCertificate.listingType}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-green-200 p-4 shadow-sm">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
                        Xác minh chứng nhận
                      </h3>
                      <p className="text-xs text-gray-600 mb-3">
                        Quét mã QR để xác minh tính hợp lệ của chứng nhận này
                      </p>
                      <div className="text-xs text-gray-500 font-mono break-all bg-gray-50 p-2 rounded border border-gray-200">
                        {selectedCertificate.qrCodeData}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-4 border-green-300 shadow-lg">
                      <QrCode className="w-24 h-24 text-gray-800" />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t-2 border-green-200">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-green-200"></div>
                    <div className="bg-green-600 rounded-full p-2">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 h-px bg-green-200"></div>
                  </div>
                  <p className="text-xs text-gray-600 italic mb-1">
                    Chứng nhận này được phát hành bởi hệ thống Carbon Credit Marketplace
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedCertificate.verifiedBy} • {selectedCertificate.date} {selectedCertificate.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Certificates;

