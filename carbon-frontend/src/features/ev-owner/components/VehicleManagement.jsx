import { useState, useEffect, useRef } from 'react';
import { Car, Plus, Edit2, Trash2, Upload, Save, X, FileText, Bike, Truck, Container, ChevronDown } from 'lucide-react';
import { useVehicles, useVehicleTypes, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from '../../../hooks/useEvOwner';
import Loading from '../../../components/common/Loading';
import Alert from '../../../components/common/Alert';
import { useAlert } from '../../../hooks/useAlert';

/**
 * Vehicle Management Component
 * Full CRUD for vehicles matching database schema
 * 
 * Database fields:
 * - id, owner_id, vehicle_type_id
 * - vin (unique), license_plate (unique)
 * - mileage, registration_date, registration_image_url
 */
const VehicleManagement = () => {
  const { alertMessage, alertType, showAlert, hideAlert } = useAlert();
  
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(null);
  
  // NEW: Category selection state (2-step form)
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Custom dropdown state
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const vehicleDropdownRef = useRef(null);
  
  // Fetch data
  const { data: vehicles, isLoading: vehiclesLoading, refetch: refetchVehicles } = useVehicles();
  const { data: vehicleTypes, isLoading: typesLoading } = useVehicleTypes();
  
  // Mutations
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const deleteMutation = useDeleteVehicle();
  
  // Form state
  const [formData, setFormData] = useState({
    vehicleTypeId: '',
    vin: '',
    licensePlate: '',
    registrationDate: '',
    registrationImageUrl: '',
    mileage: 0,
  });
  
  const resetForm = () => {
    setFormData({
      vehicleTypeId: '',
      vin: '',
      licensePlate: '',
      registrationDate: '',
      registrationImageUrl: '',
      mileage: 0,
    });
    setSelectedCategory(''); // Reset category
    setIsAddingVehicle(false);
    setEditingVehicle(null);
    setUploadingImage(null);
    setIsVehicleDropdownOpen(false);
  };
  
  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (vehicleDropdownRef.current && !vehicleDropdownRef.current.contains(event.target)) {
        setIsVehicleDropdownOpen(false);
      }
    };
    
    if (isVehicleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVehicleDropdownOpen]);
  
  // Category definitions with icons
  const categories = [
    {
      value: 'motorcycle',
      name: 'Xe máy điện',
      icon: Bike,
      iconColor: 'blue',
      description: '50-70 kg CO₂/km'
    },
    {
      value: 'car',
      name: 'Ô tô điện',
      icon: Car,
      iconColor: 'green',
      description: '100-200 kg CO₂/km'
    },
    {
      value: 'truck',
      name: 'Xe tải điện',
      icon: Truck,
      iconColor: 'purple',
      description: '200-300 kg CO₂/km'
    },
    {
      value: 'heavy_truck',
      name: 'Xe tải hạng nặng',
      icon: Container,
      iconColor: 'orange',
      description: '>300 kg CO₂/km'
    },
  ];
  
  const handleImageUpload = async (e, vehicleId = null) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showAlert('Chỉ chấp nhận file ảnh (JPG, PNG)', 'error');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert('Kích thước file tối đa 5MB', 'error');
      return;
    }
    
    try {
      setUploadingImage(vehicleId);
      
      // Mock mode: Create fake URL instead of uploading
      const isMockMode = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;
      
      let url;
      if (isMockMode) {
        // In mock mode, create a local object URL
        url = URL.createObjectURL(file);
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // Real backend: Upload to Media Service
        const uploadData = new FormData();
        uploadData.append('file', file);
        
        const response = await fetch('/api/v1/media/upload', {
          method: 'POST',
          body: uploadData,
        });
        
        if (!response.ok) throw new Error('Upload failed');
        
        const data = await response.json();
        url = data.url;
      }
      
      // Update form data or vehicle
      if (vehicleId) {
        // Update existing vehicle
        await updateMutation.mutateAsync({
          id: vehicleId,
          registrationImageUrl: url,
        });
        showAlert('Đã cập nhật ảnh đăng ký xe!', 'success');
        refetchVehicles();
      } else {
        // Update form for new vehicle
        setFormData({ ...formData, registrationImageUrl: url });
        showAlert('Đã tải ảnh lên!', 'success');
      }
    } catch (error) {
      showAlert(error.message || 'Lỗi khi tải ảnh lên', 'error');
    } finally {
      setUploadingImage(null);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!selectedCategory) {
      showAlert('Vui lòng chọn phân loại xe (Bước 1)', 'error');
      return;
    }
    
    if (!formData.vehicleTypeId) {
      showAlert('Vui lòng chọn xe cụ thể (Bước 2)', 'error');
      return;
    }
    
    if (!formData.vin || formData.vin.length < 10) {
      showAlert('Số khung (VIN) không hợp lệ (tối thiểu 10 ký tự)', 'error');
      return;
    }
    
    if (!formData.licensePlate) {
      showAlert('Vui lòng nhập biển số xe', 'error');
      return;
    }
    
    // Check for duplicate VIN and license plate before submitting
    const vehiclesList = vehicles?.data || vehicles || [];
    const normalizedVin = formData.vin.trim().toUpperCase();
    const normalizedLicensePlate = formData.licensePlate.trim().toUpperCase();
    
    // Check duplicate VIN (skip if editing the same vehicle)
    const duplicateVin = vehiclesList.find(v => {
      const existingVin = (v.vin || '').trim().toUpperCase();
      return existingVin === normalizedVin && (!editingVehicle || v.id !== editingVehicle.id);
    });
    
    if (duplicateVin) {
      showAlert('Số khung (VIN) đã tồn tại trong hệ thống. Vui lòng kiểm tra lại!', 'error');
      return;
    }
    
    // Check duplicate license plate (skip if editing the same vehicle)
    const duplicateLicensePlate = vehiclesList.find(v => {
      const existingPlate = (v.licensePlate || v.license_plate || '').trim().toUpperCase();
      return existingPlate === normalizedLicensePlate && (!editingVehicle || v.id !== editingVehicle.id);
    });
    
    if (duplicateLicensePlate) {
      showAlert('Biển số xe đã tồn tại trong hệ thống. Vui lòng kiểm tra lại!', 'error');
      return;
    }
    
    try {
      if (editingVehicle) {
        // Update existing vehicle
        await updateMutation.mutateAsync({
          id: editingVehicle.id,
          ...formData,
        });
        showAlert('Đã cập nhật thông tin xe!', 'success');
      } else {
        // Create new vehicle
        await createMutation.mutateAsync(formData);
        showAlert('Đã thêm xe mới thành công!', 'success');
      }
      
      resetForm();
      refetchVehicles();
    } catch (error) {
      if (error.message?.includes('VIN')) {
        showAlert('Số khung (VIN) đã tồn tại trong hệ thống', 'error');
      } else if (error.message?.includes('license')) {
        showAlert('Biển số xe đã tồn tại trong hệ thống', 'error');
      } else {
        showAlert(error.message || 'Có lỗi xảy ra', 'error');
      }
    }
  };
  
  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    
    // Find vehicle type to get category
    const vehicleTypeId = vehicle.vehicleTypeId || vehicle.vehicle_type_id;
    const vehicleTypesList = vehicleTypes?.data || vehicleTypes || [];
    const vehicleType = vehicleTypesList.find(t => t.id === vehicleTypeId);
    
    // Set category if found
    if (vehicleType && vehicleType.category) {
      setSelectedCategory(vehicleType.category);
    }
    
    setFormData({
      vehicleTypeId,
      vin: vehicle.vin,
      licensePlate: vehicle.licensePlate || vehicle.license_plate,
      registrationDate: vehicle.registrationDate || vehicle.registration_date,
      registrationImageUrl: vehicle.registrationImageUrl || vehicle.registration_image_url || '',
      mileage: vehicle.mileage || 0,
    });
    setIsAddingVehicle(true);
  };
  
  const handleDelete = async (vehicleId) => {
    if (!confirm('Bạn có chắc muốn xóa xe này? Hành động này không thể hoàn tác.')) {
      return;
    }
    
    try {
      await deleteMutation.mutateAsync(vehicleId);
      showAlert('Đã xóa xe thành công!', 'success');
      refetchVehicles();
    } catch (error) {
      if (error.message?.includes('journey') || error.message?.includes('trip')) {
        showAlert('Không thể xóa xe có lịch sử hành trình. Vui lòng xóa hành trình trước.', 'error');
      } else {
        showAlert(error.message || 'Có lỗi khi xóa xe', 'error');
      }
    }
  };
  
  if (vehiclesLoading || typesLoading) {
    return <Loading />;
  }
  
  const vehiclesList = vehicles?.data || vehicles || [];
  const vehicleTypesList = vehicleTypes?.data || vehicleTypes || [];
  
  return (
    <div className="space-y-6">
      {/* Alert Messages (Toast style) */}
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Car className="mr-3" />
            Quản lý xe điện
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý thông tin xe điện của bạn ({vehiclesList.length} xe)
          </p>
        </div>
        
        {!isAddingVehicle && (
          <button
            onClick={() => setIsAddingVehicle(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm xe mới
          </button>
        )}
      </div>
      
      {/* Add/Edit Vehicle Form */}
      {isAddingVehicle && (
        <div className="bg-white border-2 border-green-200 rounded-xl p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-gray-800 flex items-center">
              {editingVehicle ? (
                <>
                  <Edit2 className="w-5 h-5 mr-2 text-blue-600" />
                  Chỉnh sửa xe
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2 text-green-600" />
                  Thêm xe mới
                </>
              )}
            </h4>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Bước 1: Chọn phân loại xe <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const IconComponent = cat.icon;
                  const bgColors = {
                    blue: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
                    green: 'bg-green-100 hover:bg-green-200 border-green-300',
                    purple: 'bg-purple-100 hover:bg-purple-200 border-purple-300',
                    orange: 'bg-orange-100 hover:bg-orange-200 border-orange-300',
                  };
                  const iconColors = {
                    blue: 'text-blue-600',
                    green: 'text-green-600',
                    purple: 'text-purple-600',
                    orange: 'text-orange-600',
                  };
                  const isSelected = selectedCategory === cat.value;
                  
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setFormData({ ...formData, vehicleTypeId: '' }); // Reset vehicle selection
                      }}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        isSelected 
                          ? 'border-green-500 bg-green-50 shadow-md scale-105' 
                          : `border-gray-200 ${bgColors[cat.iconColor]}`
                      }`}
                    >
                      <IconComponent className={`w-8 h-8 mx-auto mb-2 ${
                        isSelected ? 'text-green-600' : iconColors[cat.iconColor]
                      }`} />
                      <p className={`text-sm font-semibold ${
                        isSelected ? 'text-green-700' : 'text-gray-800'
                      }`}>
                        {cat.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {cat.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* STEP 2: Specific Vehicle Selection (only show if category selected) */}
            {selectedCategory && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Bước 2: Chọn xe cụ thể <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={vehicleDropdownRef}>
                  {/* Custom Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                    className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl bg-white text-left
                               hover:border-gray-400 hover:shadow-sm
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
                               transition-all duration-200 ${
                                 isVehicleDropdownOpen 
                                   ? 'border-green-500 ring-2 ring-green-500 ring-offset-1' 
                                   : 'border-gray-300'
                               }`}
                  >
                    <span className={`font-medium text-base ${
                      formData.vehicleTypeId ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {formData.vehicleTypeId 
                        ? (() => {
                            const selectedType = vehicleTypesList
                              .filter(type => type.category === selectedCategory)
                              .find(type => type.id === formData.vehicleTypeId);
                            return selectedType 
                              ? `${selectedType.manufacturer} ${selectedType.model} (CO₂: ${selectedType.co2PerKm || selectedType.co2per_km} kg/km)`
                              : '-- Chọn xe --';
                          })()
                        : '-- Chọn xe --'}
                    </span>
                    <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      isVehicleDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {/* Custom Dropdown Options */}
                  {isVehicleDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl overflow-hidden">
                      <div className="max-h-60 overflow-y-auto">
                        {vehicleTypesList
                          .filter(type => type.category === selectedCategory)
                          .map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, vehicleTypeId: type.id });
                                setIsVehicleDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-base font-medium transition-all duration-150
                                         hover:bg-green-50 hover:text-green-700
                                         ${
                                           formData.vehicleTypeId === type.id
                                             ? 'bg-green-100 text-green-700 font-semibold'
                                             : 'text-gray-800'
                                         }`}
                            >
                              {type.manufacturer} {type.model} (CO₂: {type.co2PerKm || type.co2per_km} kg/km)
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Hệ số CO₂ của xe sẽ được dùng để tính toán tín chỉ carbon từ quãng đường
                </p>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* VIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số khung (VIN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                  placeholder="VD: WBADT43452G123456"
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium text-base placeholder:text-gray-400
                             hover:border-gray-400 hover:shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:border-green-500
                             transition-all duration-200"
                  minLength={10}
                  maxLength={17}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Số khung xe (17 ký tự), unique trong hệ thống
                </p>
              </div>
              
              {/* License Plate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biển số xe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                  placeholder="VD: 30A-12345"
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium text-base placeholder:text-gray-400
                             hover:border-gray-400 hover:shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:border-green-500
                             transition-all duration-200"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Biển số xe, unique trong hệ thống
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Registration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày đăng ký xe
                </label>
                <input
                  type="date"
                  value={formData.registrationDate}
                  onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium text-base cursor-pointer
                             hover:border-gray-400 hover:shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:border-green-500
                             transition-all duration-200"
                />
              </div>
              
              {/* Mileage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số km đã đi
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium text-base placeholder:text-gray-400
                             hover:border-gray-400 hover:shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:border-green-500
                             transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tổng km hiện tại (sẽ tự động cập nhật khi upload trip)
                </p>
              </div>
            </div>
            
            {/* Registration Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh đăng ký xe
              </label>
              <div className="flex items-center space-x-4">
                {formData.registrationImageUrl && (
                  <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={formData.registrationImageUrl}
                      alt="Registration"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <label className="cursor-pointer bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e)}
                      className="hidden"
                      disabled={uploadingImage !== null}
                    />
                    {uploadingImage === null ? (
                      <>
                        <Upload className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-blue-600 font-semibold">
                          {formData.registrationImageUrl ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                        </span>
                      </>
                    ) : (
                      <span className="text-blue-600">Đang tải...</span>
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG tối đa 5MB. Ảnh đăng ký xe hoặc giấy tờ liên quan.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingVehicle ? 'Lưu thay đổi' : 'Thêm xe'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Vehicles List */}
      {vehiclesList.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Chưa có xe nào
          </h4>
          <p className="text-gray-600 mb-6">
            Thêm xe điện đầu tiên để bắt đầu tạo tín chỉ carbon
          </p>
          <button
            onClick={() => setIsAddingVehicle(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm xe đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {vehiclesList.map((vehicle) => {
            const vehicleType = vehicleTypesList.find(
              t => t.id === (vehicle.vehicleTypeId || vehicle.vehicle_type_id)
            );
            
            return (
              <div
                key={vehicle.id}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-gray-300 hover:scale-[1.01] transition-all duration-300"
              >
                {/* Vehicle Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                      <Car className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        {vehicleType?.manufacturer} {vehicleType?.model}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {vehicle.licensePlate || vehicle.license_plate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Vehicle Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-32">Số khung (VIN):</span>
                    <span className="font-semibold text-gray-800">{vehicle.vin}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-32">Ngày đăng ký:</span>
                    <span className="font-semibold text-gray-800">
                      {vehicle.registrationDate || vehicle.registration_date || 'Chưa cập nhật'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-32">Số km đã đi:</span>
                    <span className="font-semibold text-gray-800">
                      {(vehicle.mileage || 0).toLocaleString()} km
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-32">Hệ số CO₂:</span>
                    <span className="font-semibold text-green-600">
                      {vehicleType?.co2PerKm || vehicleType?.co2per_km || 0} kg/km
                    </span>
                  </div>
                </div>
                
                {/* Registration Image */}
                {(vehicle.registrationImageUrl || vehicle.registration_image_url) && (
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      Ảnh đăng ký xe:
                    </p>
                    <img
                      src={vehicle.registrationImageUrl || vehicle.registration_image_url}
                      alt="Registration"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;

