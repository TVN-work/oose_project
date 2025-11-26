import { useState, useMemo } from 'react';
import {
  Car,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  AlertTriangle,
  Factory,
  Gauge,
  Leaf,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import vehicleTypeService from '../../../services/vehicle/vehicleTypeService';
import Loading from '../../../components/common/Loading';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';

/**
 * Vehicle Types Management Page for Admin
 * Full CRUD operations for vehicle types
 */
const VehicleTypesPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    manufacturer: '',
    model: '',
    co2PerKm: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();

  // Fetch vehicle types
  const { data: vehicleTypes, isLoading } = useQuery({
    queryKey: ['vehicleTypes', 'admin', page, pageSize],
    queryFn: () => vehicleTypeService.getAllVehicleTypes({
      page,
      entry: pageSize,
      field: 'id',
      sort: 'DESC',
    }),
    staleTime: 30000,
  });

  // Extract vehicle type list
  const vehicleTypeList = useMemo(() => {
    if (!vehicleTypes) return [];
    return Array.isArray(vehicleTypes) ? vehicleTypes : (vehicleTypes?.content || vehicleTypes?.data || []);
  }, [vehicleTypes]);

  // Get unique manufacturers for filter
  const manufacturers = useMemo(() => {
    return vehicleTypeService.getUniqueManufacturers(vehicleTypeList);
  }, [vehicleTypeList]);

  // Filter vehicle types
  const filteredVehicleTypes = useMemo(() => {
    let result = vehicleTypeList;

    // Filter by manufacturer
    if (manufacturerFilter) {
      result = result.filter(vt => vt.manufacturer === manufacturerFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(vt =>
        vt.manufacturer?.toLowerCase().includes(searchLower) ||
        vt.model?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [vehicleTypeList, searchTerm, manufacturerFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!vehicleTypeList.length) return { total: 0, manufacturers: 0, avgCo2: 0 };

    const uniqueManufacturers = new Set(vehicleTypeList.map(vt => vt.manufacturer)).size;
    const totalCo2 = vehicleTypeList.reduce((sum, vt) => sum + (vt.co2PerKm || 0), 0);
    const avgCo2 = vehicleTypeList.length > 0 ? totalCo2 / vehicleTypeList.length : 0;

    return {
      total: vehicleTypeList.length,
      manufacturers: uniqueManufacturers,
      avgCo2,
    };
  }, [vehicleTypeList]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => vehicleTypeService.createVehicleType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });
      setShowCreateModal(false);
      resetForm();
      showAlert('Tạo loại xe mới thành công!', 'success');
    },
    onError: (error) => {
      showAlert(error.message || 'Có lỗi xảy ra khi tạo loại xe', 'error');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => vehicleTypeService.updateVehicleType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });
      setShowEditModal(false);
      setSelectedVehicleType(null);
      resetForm();
      showAlert('Cập nhật loại xe thành công!', 'success');
    },
    onError: (error) => {
      showAlert(error.message || 'Có lỗi xảy ra khi cập nhật loại xe', 'error');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => vehicleTypeService.deleteVehicleType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });
      setShowDeleteModal(false);
      setSelectedVehicleType(null);
      showAlert('Xóa loại xe thành công!', 'success');
    },
    onError: (error) => {
      showAlert(error.message || 'Có lỗi xảy ra khi xóa loại xe', 'error');
    },
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      manufacturer: '',
      model: '',
      co2PerKm: '',
    });
    setFormErrors({});
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.manufacturer.trim()) {
      errors.manufacturer = 'Vui lòng nhập hãng xe';
    }

    if (!formData.model.trim()) {
      errors.model = 'Vui lòng nhập tên mẫu xe';
    }

    if (!formData.co2PerKm) {
      errors.co2PerKm = 'Vui lòng nhập lượng CO2/km';
    } else if (isNaN(parseFloat(formData.co2PerKm)) || parseFloat(formData.co2PerKm) < 0) {
      errors.co2PerKm = 'CO2/km phải là số dương';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create
  const handleCreate = () => {
    if (!validateForm()) return;

    createMutation.mutate({
      manufacturer: formData.manufacturer.trim(),
      model: formData.model.trim(),
      co2PerKm: parseFloat(formData.co2PerKm),
    });
  };

  // Handle edit click
  const handleEditClick = (vehicleType) => {
    setSelectedVehicleType(vehicleType);
    setFormData({
      manufacturer: vehicleType.manufacturer || '',
      model: vehicleType.model || '',
      co2PerKm: vehicleType.co2PerKm?.toString() || '',
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  // Handle update
  const handleUpdate = () => {
    if (!validateForm()) return;

    updateMutation.mutate({
      id: selectedVehicleType.id,
      data: {
        manufacturer: formData.manufacturer.trim(),
        model: formData.model.trim(),
        co2PerKm: parseFloat(formData.co2PerKm),
      },
    });
  };

  // Handle delete click
  const handleDeleteClick = (vehicleType) => {
    setSelectedVehicleType(vehicleType);
    setShowDeleteModal(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    deleteMutation.mutate(selectedVehicleType.id);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {alertMessage && (
        <Alert
          key={`alert-${alertMessage}`}
          variant={alertType}
          dismissible
          position="toast"
          onDismiss={hideAlert}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Car className="mr-3 text-blue-600" />
            Quản lý loại xe
          </h1>
          <p className="text-gray-600 mt-1">Quản lý các mẫu xe điện và thông số CO2</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm loại xe
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Tổng số loại xe</span>
            <Car className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Mẫu xe trong hệ thống</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Số hãng xe</span>
            <Factory className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.manufacturers}</p>
          <p className="text-xs text-gray-500 mt-1">Nhà sản xuất</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">CO2 trung bình</span>
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.avgCo2.toFixed(3)} kg/km</p>
          <p className="text-xs text-gray-500 mt-1">Trung bình các mẫu xe</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo hãng xe hoặc mẫu xe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Manufacturer Filter */}
          <div>
            <select
              value={manufacturerFilter}
              onChange={(e) => setManufacturerFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả hãng xe</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer} value={manufacturer}>
                  {manufacturer}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vehicle Types Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Car className="w-5 h-5 mr-2 text-blue-600" />
            Danh sách loại xe ({filteredVehicleTypes.length})
          </h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Hiển thị:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPage(0);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">mục/trang</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full" style={{ minWidth: '700px' }}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '180px' }}>Hãng xe</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '200px' }}>Mẫu xe</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '150px' }}>CO2/km</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm whitespace-nowrap" style={{ minWidth: '120px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVehicleTypes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Không có loại xe nào</p>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowCreateModal(true);
                      }}
                      className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Thêm loại xe mới
                    </button>
                  </td>
                </tr>
              ) : (
                filteredVehicleTypes.map((vehicleType) => (
                  <tr
                    key={vehicleType.id}
                    className="hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                  >
                    <td className="py-3 px-4" style={{ minWidth: '180px' }}>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                          <Factory className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800">
                          {vehicleType.manufacturer}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4" style={{ minWidth: '200px' }}>
                      <div className="flex items-center">
                        <Car className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">{vehicleType.model}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right" style={{ minWidth: '150px' }}>
                      <div className="flex items-center justify-end gap-2">
                        <Gauge className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-600">
                          {vehicleType.co2PerKm?.toFixed(3) || '0.000'}
                        </span>
                        <span className="text-xs text-gray-500">kg/km</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center" style={{ minWidth: '120px' }}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(vehicleType)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(vehicleType)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredVehicleTypes.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Hiển thị {filteredVehicleTypes.length > 0 ? page * pageSize + 1 : 0} - {Math.min((page + 1) * pageSize, filteredVehicleTypes.length)} trong tổng số {filteredVehicleTypes.length} loại xe
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(0)}
                disabled={page === 0}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                «
              </button>
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ‹ Trước
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const totalPages = Math.ceil(filteredVehicleTypes.length / pageSize) || 1;
                  const currentPage = page;
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
                        onClick={() => setPage(i)}
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
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(filteredVehicleTypes.length / pageSize) - 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Sau ›
              </button>
              <button
                onClick={() => setPage(Math.ceil(filteredVehicleTypes.length / pageSize) - 1)}
                disabled={page >= Math.ceil(filteredVehicleTypes.length / pageSize) - 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Thêm loại xe mới
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Manufacturer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hãng xe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  placeholder="VD: VinFast, Tesla, BYD..."
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.manufacturer ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {formErrors.manufacturer && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.manufacturer}</p>
                )}
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mẫu xe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="VD: VF e34, Model 3, Atto 3..."
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.model ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {formErrors.model && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.model}</p>
                )}
              </div>

              {/* CO2 per km */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lượng CO2/km (kg) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="co2PerKm"
                    value={formData.co2PerKm}
                    onChange={handleInputChange}
                    placeholder="VD: 0.12"
                    step="0.001"
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.co2PerKm ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    kg/km
                  </span>
                </div>
                {formErrors.co2PerKm && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.co2PerKm}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Lượng CO2 tiết kiệm được khi sử dụng xe điện so với xe xăng (trung bình 0.12 kg/km)
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Tạo mới
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedVehicleType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                Chỉnh sửa loại xe
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedVehicleType(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Manufacturer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hãng xe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  placeholder="VD: VinFast, Tesla, BYD..."
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.manufacturer ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {formErrors.manufacturer && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.manufacturer}</p>
                )}
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mẫu xe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="VD: VF e34, Model 3, Atto 3..."
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.model ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {formErrors.model && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.model}</p>
                )}
              </div>

              {/* CO2 per km */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lượng CO2/km (kg) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="co2PerKm"
                    value={formData.co2PerKm}
                    onChange={handleInputChange}
                    placeholder="VD: 0.12"
                    step="0.001"
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.co2PerKm ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    kg/km
                  </span>
                </div>
                {formErrors.co2PerKm && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.co2PerKm}</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedVehicleType(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedVehicleType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Xác nhận xóa
              </h2>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn xóa loại xe này?
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {selectedVehicleType.manufacturer} {selectedVehicleType.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      CO2: {selectedVehicleType.co2PerKm?.toFixed(3)} kg/km
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-red-600 mt-4">
                ⚠️ Hành động này không thể hoàn tác. Các xe đang sử dụng loại này có thể bị ảnh hưởng.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedVehicleType(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Xóa loại xe
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTypesPage;
