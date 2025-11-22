import { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Edit3, 
  Car, 
  FileText,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Info,
  Loader2,
  ChevronDown,
  ChevronUp,
  Bike,
  Truck,
  Container,
  Zap
} from 'lucide-react';
import { useUploadTrip } from '../../../hooks/useEvOwner';
import { evOwnerService } from '../../../services/evOwner/evOwnerService';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Alert from '../../../components/common/Alert';

/**
 * Upload Trips - Production Ready
 * 
 * Two main methods:
 * 1. File Upload: Upload trip data from JSON/CSV file
 * 2. Manual Input: Enter trip data manually via form
 */
const UploadTrips = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'manual'
  
  // Vehicle selection
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const vehicleDropdownRef = useRef(null);
  
  // File upload states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Manual input states
  const [manualData, setManualData] = useState({
    distance: '',
    energyUsed: '',
    avgSpeed: '',
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [proofImages, setProofImages] = useState([]);
  
  // Vehicle info table state
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);
  
  // Alert states (replacing toast notifications)
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success'); // 'success' | 'error' | 'info'
  const alertTimeoutRef = useRef(null);
  
  // Helper function to show alert
  const showAlert = (message, type = 'success') => {
    // Clear existing timeout if any
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    
    setAlertType(type);
    setAlertMessage(message);
    
    // Auto dismiss after 5 seconds
    alertTimeoutRef.current = setTimeout(() => {
      setAlertMessage(null);
      alertTimeoutRef.current = null;
    }, 5000);
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);
  
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
  
  // Vehicle CO2 factors (for educational reference)
  const vehicleTypes = [
    {
      name: 'Xe máy điện',
      icon: Bike,
      iconColor: 'blue',
      co2PerKm: 0.050, // kg CO₂/km (xe xăng tương đương tiết kiệm)
      creditsPerKm: 0.00005, // 50g = 0.00005 tấn
      example1000km: 0.05, // tín chỉ cho 1000km
      description: '50 kg CO₂/km (so với xe xăng)'
    },
    {
      name: 'Ô tô điện',
      icon: Car,
      iconColor: 'green',
      co2PerKm: 0.150, // kg CO₂/km
      creditsPerKm: 0.00015,
      example1000km: 0.15,
      description: '150 kg CO₂/km (so với xe xăng)',
      highlight: true
    },
    {
      name: 'Xe tải điện',
      icon: Truck,
      iconColor: 'purple',
      co2PerKm: 0.250, // kg CO₂/km
      creditsPerKm: 0.00025,
      example1000km: 0.25,
      description: '250 kg CO₂/km (so với xe dầu)'
    },
    {
      name: 'Xe tải hạng nặng',
      icon: Container,
      iconColor: 'orange',
      co2PerKm: 0.350, // kg CO₂/km
      creditsPerKm: 0.00035,
      example1000km: 0.35,
      description: '350 kg CO₂/km (so với xe dầu)'
    },
  ];
  
  const uploadMutation = useUploadTrip();
  const queryClient = useQueryClient();

  // Fetch user's vehicles
  const { data: vehiclesData, isLoading: vehiclesLoading } = useQuery({
    queryKey: ['evOwner', 'vehicles'],
    queryFn: evOwnerService.getVehicles,
  });
  
  const vehicles = vehiclesData?.data || vehiclesData || [];
  
  // Fetch journey HISTORIES (chi tiết từng trip đã upload)
  const { data: journeyHistoriesData, isLoading: journeysLoading } = useQuery({
    queryKey: ['evOwner', 'journeyHistories'],
    queryFn: evOwnerService.getAllJourneyHistories,
    staleTime: 0, // Always refetch to show latest uploads
    refetchOnMount: 'always',
  });
  
  const journeyHistories = journeyHistoriesData?.data || journeyHistoriesData || [];
  
  // Selected vehicle details
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  
  // Generate sample file for download
  const generateSampleFile = (format) => {
    const sampleData = format === 'json' ? {
      version: "1.0",
      vehicle: {
        vin: "WBADT43452G123456",
        licensePlate: "30A-12345"
      },
      trips: [
        {
          startTime: "2024-01-15T08:30:00Z",
          endTime: "2024-01-15T09:15:00Z",
          distance: 45.8,
          energyUsed: 7.2,
          avgSpeed: 52,
          startLocation: {
            lat: 21.0285,
            lng: 105.8542
          },
          endLocation: {
            lat: 21.0245,
            lng: 105.8412
          }
        }
      ]
    } : `startTime,endTime,distance,energyUsed,avgSpeed,startLat,startLng,endLat,endLng
2024-01-15T08:30:00Z,2024-01-15T09:15:00Z,45.8,7.2,52,21.0285,105.8542,21.0245,105.8412
2024-01-15T17:00:00Z,2024-01-15T17:45:00Z,48.2,7.5,55,21.0245,105.8412,21.0285,105.8542`;

    const blob = new Blob(
      [format === 'json' ? JSON.stringify(sampleData, null, 2) : sampleData],
      { type: format === 'json' ? 'application/json' : 'text/csv' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trip-data-sample.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showAlert(`Đã tải file mẫu ${format.toUpperCase()}`, 'success');
  };
  
  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadedFile(file);
    setFileError(null);
    setParsedData(null);
    
    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (!['json', 'csv'].includes(fileType)) {
      setFileError('Chỉ hỗ trợ file JSON hoặc CSV');
      return;
    }
    
    try {
      const text = await file.text();
      
      if (fileType === 'json') {
        const data = JSON.parse(text);
        validateAndParseJSON(data);
      } else {
        validateAndParseCSV(text);
      }
              } catch (error) {
      setFileError(`Lỗi đọc file: ${error.message}`);
              }
  };
  
  // Validate and parse JSON
  const validateAndParseJSON = (data) => {
    // Required fields check
    if (!data.trips || !Array.isArray(data.trips)) {
      setFileError('File JSON thiếu field "trips" hoặc không đúng định dạng array');
      return;
    }
    
    if (data.trips.length === 0) {
      setFileError('Không có chuyến đi nào trong file');
      return;
    }
    
    // Validate each trip
    const requiredFields = ['distance', 'energyUsed'];
    for (let i = 0; i < data.trips.length; i++) {
      const trip = data.trips[i];
      for (const field of requiredFields) {
        if (!trip[field] || isNaN(parseFloat(trip[field]))) {
          setFileError(`Chuyến đi #${i + 1}: Thiếu hoặc sai field "${field}"`);
          return;
        }
      }
    }
    
    setParsedData(data);
    showAlert(`Đã phân tích file: ${data.trips.length} chuyến đi`, 'success');
  };
  
  // Validate and parse CSV
  const validateAndParseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      setFileError('File CSV rỗng hoặc thiếu dữ liệu');
      return;
    }
    
    const headers = lines[0].split(',').map(h => h.trim());
    const requiredHeaders = ['distance', 'energyUsed'];
    
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        setFileError(`File CSV thiếu cột bắt buộc: "${required}"`);
        return;
      }
    }
    
    const trips = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const trip = {};
      headers.forEach((header, index) => {
        trip[header] = values[index]?.trim();
      });
      trips.push(trip);
    }
    
    setParsedData({ trips });
    showAlert(`Đã phân tích file: ${trips.length} chuyến đi`, 'success');
  };
  
  // Submit parsed file data
  const handleSubmitFile = async () => {
    if (!selectedVehicleId) {
      showAlert('Vui lòng chọn xe', 'error');
      return;
    }
    
    if (!parsedData || !parsedData.trips) {
      showAlert('Chưa có dữ liệu để gửi', 'error');
      return;
        }
    
    setIsProcessing(true);

    try {
      // Upload each trip
      let successCount = 0;
      for (const trip of parsedData.trips) {
      const tripData = {
          vehicleId: selectedVehicleId,
          distance: parseFloat(trip.distance),
          energyUsed: parseFloat(trip.energyUsed),
          avgSpeed: trip.avgSpeed ? parseFloat(trip.avgSpeed) : 0,
          startTime: trip.startTime || new Date().toISOString(),
          endTime: trip.endTime || new Date().toISOString(),
          source: 'file_upload',
        };
        
        try {
          await uploadMutation.mutateAsync(tripData);
          successCount++;
        } catch (tripError) {
          console.error('Error uploading trip:', tripError);
          throw tripError;
        }
      }
      
      console.log('✅ All trips uploaded successfully:', successCount);
      showAlert(`Đã gửi ${successCount} chuyến đi đến xác minh!`, 'success');
      
      // Force refetch journey histories immediately
      await queryClient.invalidateQueries({ queryKey: ['evOwner', 'journeyHistories'] });
      await queryClient.refetchQueries({ queryKey: ['evOwner', 'journeyHistories'] });
      
      // Reset
      setUploadedFile(null);
      setParsedData(null);
      setFileError(null);
      
    } catch (error) {
      console.error('❌ Upload error:', error);
      showAlert(error.message || 'Lỗi khi gửi dữ liệu', 'error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle manual image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Validate
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      showAlert('Chỉ chấp nhận file ảnh', 'error');
      return;
    }
    
    setUploadingImage(true);
    
    try {
      // Mock upload
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const urls = validFiles.map(f => URL.createObjectURL(f));
      setProofImages([...proofImages, ...urls]);
      
      showAlert(`Đã tải lên ${validFiles.length} ảnh`, 'success');
          } catch (error) {
      showAlert('Lỗi khi tải ảnh', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle manual submit
  // Calculate estimated energy based on vehicle type and distance
  const calculateEstimatedEnergy = (distance) => {
    if (!distance || !selectedVehicle) return null;
    
    // Average energy consumption by vehicle category (kWh/100km)
    const energyConsumptionMap = {
      motorcycle: 2.5,    // 2.5 kWh/100km for e-motorcycles
      car: 15,            // 15 kWh/100km for e-cars
      truck: 45,          // 45 kWh/100km for e-trucks
      heavy_truck: 75,    // 75 kWh/100km for heavy e-trucks
    };
    
    // Get vehicle category from selected vehicle's type
    const vehicleType = selectedVehicle.vehicleType || selectedVehicle.vehicle_type;
    const category = vehicleType?.category;
    
    if (!category || !energyConsumptionMap[category]) {
      return distance * 0.15; // Default: 15 kWh/100km (car average)
    }
    
    const consumption = energyConsumptionMap[category];
    return (distance * consumption) / 100;
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedVehicleId) {
      showAlert('Vui lòng chọn xe', 'error');
      return;
    }
    
    // Validation
    if (!manualData.distance || parseFloat(manualData.distance) <= 0) {
      showAlert('Quãng đường phải lớn hơn 0', 'error');
      return;
    }
    
    // Auto-calculate energy if not provided
    let energyUsed = parseFloat(manualData.energyUsed);
    if (!energyUsed || energyUsed <= 0) {
      energyUsed = calculateEstimatedEnergy(parseFloat(manualData.distance));
      console.log('✅ Auto-calculated energy:', energyUsed, 'kWh');
    }
    
    try {
      const tripData = {
        vehicleId: selectedVehicleId,
        distance: parseFloat(manualData.distance),
        energyUsed: energyUsed,
        avgSpeed: parseFloat(manualData.avgSpeed) || 0,
        startTime: manualData.startDate || new Date().toISOString(),
        endTime: manualData.endDate || new Date().toISOString(),
        notes: manualData.notes,
        proofImages: proofImages,
        source: 'manual',
      };
      
      console.log('📤 Uploading trip data:', tripData);
      const result = await uploadMutation.mutateAsync(tripData);
      console.log('✅ Upload result:', result);
      
      showAlert('Đã gửi xác minh thành công!', 'success');
        
      // Force refetch journey histories immediately
      await queryClient.invalidateQueries({ queryKey: ['evOwner', 'journeyHistories'] });
      await queryClient.refetchQueries({ queryKey: ['evOwner', 'journeyHistories'] });
      
      // Reset form
      setManualData({
        distance: '',
        energyUsed: '',
        avgSpeed: '',
        startDate: '',
        endDate: '',
        notes: '',
      });
      setProofImages([]);
      
      } catch (error) {
      console.error('❌ Manual submit error:', error);
      showAlert(error.message || 'Lỗi khi gửi dữ liệu', 'error');
      }
  };

  // Status badge component
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { icon: Clock, text: 'Chờ xác minh', color: 'bg-yellow-100 text-yellow-700' },
      processing: { icon: Clock, text: 'Đang xác minh', color: 'bg-blue-100 text-blue-700' },
      calculating: { icon: Clock, text: 'Đang tính toán', color: 'bg-blue-100 text-blue-700' },
      verifying: { icon: Clock, text: 'Đang kiểm tra', color: 'bg-blue-100 text-blue-700' },
      completed: { icon: CheckCircle, text: 'Đã duyệt', color: 'bg-green-100 text-green-700' },
      approved: { icon: CheckCircle, text: 'Đã duyệt', color: 'bg-green-100 text-green-700' },
      rejected: { icon: XCircle, text: 'Từ chối', color: 'bg-red-100 text-red-700' },
      failed: { icon: XCircle, text: 'Thất bại', color: 'bg-red-100 text-red-700' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

  return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };
  
  // Empty state for no vehicles
  if (!vehiclesLoading && vehicles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Chưa có xe nào
        </h3>
          <p className="text-gray-600 mb-6">
            Bạn cần thêm xe vào hệ thống trước khi tải dữ liệu hành trình
          </p>
          <Link
            to="/ev-owner/settings"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            <Car className="w-5 h-5 mr-2" />
            Thêm xe ngay
          </Link>
              </div>
      </div>
    );
    }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Tải dữ liệu hành trình</h1>
        <p className="text-green-100">
          Upload file hoặc nhập thủ công dữ liệu hành trình để tính toán tín chỉ carbon
        </p>
      </div>
      
      {/* Alert Messages (Toast style - top right corner) */}
      {alertMessage && (
        <Alert 
          key={`alert-${alertMessage}`}
          variant={alertType} 
          dismissible 
          position="toast"
          onDismiss={() => {
            setAlertMessage(null);
          }}
        >
          {alertMessage}
        </Alert>
      )}
      
      {/* Vehicle CO2 Information Table (Collapsible) */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <button
          onClick={() => setShowVehicleInfo(!showVehicleInfo)}
          className="w-full bg-gradient-to-r from-blue-50 to-green-50 p-6 border-b border-gray-200 hover:from-blue-100 hover:to-green-100 transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Zap className="w-6 h-6 text-green-600" />
                Tín chỉ carbon theo loại xe
              </h2>
              <p className="text-sm text-gray-600">
                Cùng quãng đường nhưng loại xe khác nhau → CO₂ tiết kiệm khác nhau → Tín chỉ khác nhau
              </p>
              </div>
            <div className="ml-4">
              {showVehicleInfo ? (
                <ChevronUp className="w-6 h-6 text-gray-600" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-600" />
              )}
            </div>
          </div>
        </button>
        
        {showVehicleInfo && (
          <>
            <div className="overflow-x-auto animate-in fade-in duration-300">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 pl-[210px] text-left text-base font-bold text-gray-800 w-2/5">
                      Loại xe
                    </th>
                    <th className="text-center py-3 px-4 text-base font-bold text-gray-800 w-1/3">
                      CO₂ tiết kiệm<br/>
                      <span className="text-xs font-normal text-gray-500">(so với xe xăng/dầu)</span>
                    </th>
                    <th className="text-center py-3 px-4 text-base font-bold text-gray-800 w-1/3">
                      Tín chỉ nhận được<br/>
                      <span className="text-xs font-normal text-gray-500">(Ví dụ: 1000 km)</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vehicleTypes.map((vehicle, index) => {
                    const IconComponent = vehicle.icon;
                    const bgColorMap = {
                      blue: 'bg-blue-100',
                      green: 'bg-green-100',
                      purple: 'bg-purple-100',
                      orange: 'bg-orange-100',
                    };
                    const textColorMap = {
                      blue: 'text-blue-600',
                      green: 'text-green-600',
                      purple: 'text-purple-600',
                      orange: 'text-orange-600',
                    };
                    const multiplier = vehicle.co2PerKm / 0.050; // Relative to motorcycle
                    
                    return (
                      <tr 
                        key={index} 
                        className={`hover:bg-gray-50 transition-colors ${vehicle.highlight ? 'bg-green-50' : ''}`}
                      >
                        <td className="py-3 px-4 pl-[136px]">
                          <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 ${bgColorMap[vehicle.iconColor]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className={`w-5 h-5 ${textColorMap[vehicle.iconColor]}`} />
                </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{vehicle.name}</p>
                              <p className="text-xs text-gray-500">{vehicle.description}</p>
                </div>
              </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col items-center justify-center">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                              {(vehicle.co2PerKm * 1000).toFixed(0)} g/km
                            </span>
                            {multiplier > 1 && (
                              <p className="text-xs text-orange-600 font-semibold mt-1">
                                × {multiplier.toFixed(0)} lần
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-xl font-bold text-green-600">{vehicle.example1000km.toFixed(2)}</p>
                            <p className="text-xs text-gray-500 mt-0.5">tín chỉ carbon</p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          </div>

            <Alert variant="info" title="Giải thích:">
              <ul className="space-y-1 text-xs mt-2">
                <li>• <strong>CO₂ tiết kiệm:</strong> Lượng CO₂ mà xe điện giúp giảm so với xe xăng/dầu cùng loại</li>
                <li>• <strong>1 tấn CO₂</strong> giảm phát thải = <strong>1 carbon credit</strong></li>
                <li>• Xe lớn hơn → CO₂ tiết kiệm nhiều hơn → Tín chỉ nhiều hơn</li>
                <li>• Hệ thống sẽ <strong>TỰ ĐỘNG tính toán</strong> dựa trên loại xe bạn đã đăng ký</li>
              </ul>
            </Alert>
          </>
        )}
            </div>

      {/* Vehicle Selection - REQUIRED */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Car className="mr-3" />
          Chọn xe
        </h3>
        
        <div className="relative" ref={vehicleDropdownRef}>
          {/* Custom Dropdown Button */}
                <button
            type="button"
            onClick={() => !vehiclesLoading && setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
            disabled={vehiclesLoading}
            className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl bg-white text-left
                       hover:border-gray-400 hover:shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
                       transition-all duration-200
                       disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
                       ${
                         isVehicleDropdownOpen 
                           ? 'border-green-500 ring-2 ring-green-500 ring-offset-1' 
                           : 'border-gray-300'
                       }`}
          >
            <span className={`font-medium text-lg ${
              selectedVehicleId ? 'text-gray-800' : 'text-gray-500'
            }`}>
              {selectedVehicleId 
                ? (() => {
                    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
                    if (!selectedVehicle) return '-- Chọn xe của bạn --';
                    const manufacturer = selectedVehicle.vehicleType?.manufacturer || selectedVehicle.vehicle_type?.manufacturer || '';
                    const model = selectedVehicle.vehicleType?.model || selectedVehicle.vehicle_type?.model || '';
                    const plate = selectedVehicle.licensePlate || selectedVehicle.license_plate || '';
                    return `${manufacturer} ${model} - ${plate}`;
                  })()
                : '-- Chọn xe của bạn --'}
            </span>
            <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 transition-transform duration-200 ${
              isVehicleDropdownOpen ? 'rotate-180' : ''
            }`} />
                </button>
          
          {/* Custom Dropdown Options */}
          {isVehicleDropdownOpen && !vehiclesLoading && (
            <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {vehicles.map((vehicle) => {
                  const manufacturer = vehicle.vehicleType?.manufacturer || vehicle.vehicle_type?.manufacturer || '';
                  const model = vehicle.vehicleType?.model || vehicle.vehicle_type?.model || '';
                  const plate = vehicle.licensePlate || vehicle.license_plate || '';
                  
                  return (
                <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => {
                        setSelectedVehicleId(vehicle.id);
                        setIsVehicleDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-base font-medium transition-all duration-150
                                 hover:bg-green-50 hover:text-green-700
                                 ${
                                   selectedVehicleId === vehicle.id
                                     ? 'bg-green-100 text-green-700 font-semibold'
                                     : 'text-gray-800'
                                 }`}
                    >
                      {manufacturer} {model} - {plate}
                </button>
                  );
                })}
              </div>
            </div>
          )}
          </div>
        
        {selectedVehicle && (
          <div className="mt-4">
            <Alert variant="success">
              <strong>Xe đã chọn:</strong>{' '}
              {selectedVehicle.vehicleType?.manufacturer || selectedVehicle.vehicle_type?.manufacturer}{' '}
              {selectedVehicle.vehicleType?.model || selectedVehicle.vehicle_type?.model}{' '}
              - {selectedVehicle.licensePlate || selectedVehicle.license_plate}
            </Alert>
          </div>
        )}
      </div>

      {/* Tabs */}
      {selectedVehicleId && (
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
                <button
              onClick={() => setActiveTab('file')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                activeTab === 'file'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-5 h-5 inline-block mr-2" />
              Upload File
                </button>
                <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                activeTab === 'manual'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
                >
              <Edit3 className="w-5 h-5 inline-block mr-2" />
              Nhập thủ công
                </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* FILE UPLOAD TAB */}
            {activeTab === 'file' && (
          <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Upload file dữ liệu hành trình
          </h3>
                  <p className="text-gray-600 mb-6">
                    Hỗ trợ file JSON hoặc CSV. Xem hướng dẫn bên dưới để biết định dạng file.
                  </p>
                </div>
                
                {/* Two Column Layout: Upload Area (Left) + Sample Files (Right) */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* LEFT: File Upload Area */}
                  <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition cursor-pointer flex flex-col justify-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div>
                      <span className="text-green-600 hover:text-green-700 font-semibold">
                        Chọn file
                      </span>
                      <span className="text-gray-600"> hoặc kéo thả file vào đây</span>
              </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Hỗ trợ: JSON, CSV (Tối đa 10MB)
                    </p>
                    <input
                      type="file"
                      accept=".json,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {/* RIGHT: Download Sample Files */}
                  <div className="flex flex-col">
                    <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl flex-1 flex flex-col">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <Download className="w-5 h-5 mr-2" />
                        Tải file mẫu
              </h4>
                      <p className="text-sm text-blue-800 mb-4">
                        Tải xuống file mẫu để biết định dạng dữ liệu yêu cầu
                      </p>
                      <div className="space-y-3 mt-auto">
                <button
                          onClick={() => generateSampleFile('json')}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                >
                          <Download className="w-4 h-4 mr-2" />
                          File mẫu JSON
                </button>
                <button
                          onClick={() => generateSampleFile('csv')}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                >
                          <Download className="w-4 h-4 mr-2" />
                          File mẫu CSV
                </button>
              </div>
            </div>
          </div>
            </div>

                {/* Uploaded File Info */}
                {uploadedFile && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-600 mr-3" />
                        <div>
                          <p className="font-semibold text-gray-800">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
              </div>
            </div>
                      <button
                        onClick={() => {
                          setUploadedFile(null);
                          setParsedData(null);
                          setFileError(null);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Xóa
                      </button>
          </div>
        </div>
      )}

                {/* File Error */}
                {fileError && (
                  <Alert variant="danger">
                    {fileError}
                  </Alert>
                )}
                
                {/* Parsed Data Preview */}
                {parsedData && (
                  <div className="space-y-4">
                    <Alert variant="success" title="Đã phân tích file thành công!">
                      <div className="space-y-2 text-sm mt-2">
                        <p>
                          <strong>Số chuyến đi:</strong> {parsedData.trips.length}
                        </p>
                        <p>
                          <strong>Tổng quãng đường:</strong>{' '}
                          {parsedData.trips.reduce((sum, t) => sum + parseFloat(t.distance || 0), 0).toFixed(2)} km
                        </p>
                        <p>
                          <strong>Tổng năng lượng:</strong>{' '}
                          {parsedData.trips.reduce((sum, t) => sum + parseFloat(t.energyUsed || 0), 0).toFixed(2)} kWh
                        </p>
                      </div>
                    </Alert>

                    <button
                      onClick={handleSubmitFile}
                      disabled={isProcessing}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50 font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="w-5 h-5 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          Gửi xác minh
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                {/* Documentation Section - BELOW (Structure Only) */}
                <div className="border-t pt-6 mt-8">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-700" />
                    Cấu trúc file
            </h4>
                  
                  {/* File Format Documentation */}
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Format JSON:</p>
                        <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`{
  "version": "1.0",
  "vehicle": {
    "vin": "WBADT43452G123456",
    "licensePlate": "30A-12345"
  },
  "trips": [
    {
      "startTime": "2024-01-15T08:30:00Z",
      "endTime": "2024-01-15T09:15:00Z",
      "distance": 45.8,        // Required: km
      "energyUsed": 7.2,       // Required: kWh
      "avgSpeed": 52,          // Optional: km/h
      "startLocation": {       // Optional
        "lat": 21.0285,
        "lng": 105.8542
      },
      "endLocation": {         // Optional
        "lat": 21.0245,
        "lng": 105.8412
      }
    }
  ]
}`}</pre>
                  </div>

                  <div>
                        <p className="font-semibold text-gray-700 mb-2">Format CSV:</p>
                        <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`startTime,endTime,distance,energyUsed,avgSpeed,startLat,startLng,endLat,endLng
2024-01-15T08:30:00Z,2024-01-15T09:15:00Z,45.8,7.2,52,21.0285,105.8542,21.0245,105.8412`}</pre>
                  </div>

                      <Alert variant="warning" className="py-2.5">
                        <strong>Fields bắt buộc:</strong> <code className="bg-yellow-100 px-1 rounded">distance</code>, <code className="bg-yellow-100 px-1 rounded">energyUsed</code>
                      </Alert>
          </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* MANUAL INPUT TAB */}
            {activeTab === 'manual' && (
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Nhập dữ liệu hành trình
                  </h3>
                  <p className="text-gray-600">
                    Điền thông tin chuyến đi của bạn. Dữ liệu sẽ được gửi đến CVA để xác minh.
                  </p>
                  </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Distance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quãng đường (km) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={manualData.distance}
                      onChange={(e) => setManualData({ ...manualData, distance: e.target.value })}
                      placeholder="Ví dụ: 45.8"
                      className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium text-base placeholder:text-gray-400
                                 hover:border-gray-400 hover:shadow-sm
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:border-green-500
                                 transition-all duration-200"
                      required
                    />
                  </div>
                  
                  {/* Energy Used - OPTIONAL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      Năng lượng tiêu thụ (kWh)
                      <span className="text-xs text-gray-500 font-normal">(tùy chọn)</span>
                      <div className="relative group">
                        <Info className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-help transition-colors" />
                        <div className="absolute left-0 top-6 w-72 bg-gray-800 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg">
                          <p className="font-semibold mb-1">💡 Không biết năng lượng?</p>
                          <p>Để trống, hệ thống sẽ <strong>tự động tính toán</strong> dựa trên:</p>
                          <ul className="mt-2 space-y-1 ml-3">
                            <li>• Quãng đường</li>
                            <li>• Loại xe (hiệu suất TB)</li>
                          </ul>
                </div>
                      </div>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={manualData.energyUsed}
                      onChange={(e) => setManualData({ ...manualData, energyUsed: e.target.value })}
                      placeholder="Nếu biết chính xác (từ app xe)"
                      className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium text-base placeholder:text-gray-400
                                 hover:border-gray-400 hover:shadow-sm
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:border-green-500
                                 transition-all duration-200"
                    />
                    {/* Show estimated energy if distance is entered */}
                    {manualData.distance && !manualData.energyUsed && selectedVehicle && (
                      <div className="mt-2">
                        <Alert variant="info" className="py-2.5">
                          <span>
                            <strong>Ước tính:</strong> ~{calculateEstimatedEnergy(parseFloat(manualData.distance))?.toFixed(1)} kWh
                            <span className="ml-1">(tự động áp dụng nếu bỏ trống)</span>
                          </span>
                        </Alert>
                      </div>
                    )}
                  </div>
                  
                  {/* Average Speed */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tốc độ trung bình (km/h)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={manualData.avgSpeed}
                      onChange={(e) => setManualData({ ...manualData, avgSpeed: e.target.value })}
                      placeholder="Ví dụ: 52"
                      className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium text-base placeholder:text-gray-400
                                 hover:border-gray-400 hover:shadow-sm
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:border-green-500
                                 transition-all duration-200"
                    />
                  </div>
                  
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      value={manualData.startDate}
                      onChange={(e) => setManualData({ ...manualData, startDate: e.target.value })}
                      className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium text-base cursor-pointer
                                 hover:border-gray-400 hover:shadow-sm
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:border-green-500
                                 transition-all duration-200"
                    />
                </div>
              </div>
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={manualData.notes}
                    onChange={(e) => setManualData({ ...manualData, notes: e.target.value })}
                    placeholder="Mô tả về chuyến đi (tùy chọn)"
                    rows={3}
                    className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium text-base placeholder:text-gray-400 resize-none
                               hover:border-gray-400 hover:shadow-sm
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:border-green-500
                               transition-all duration-200"
                  />
                </div>
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh chứng minh (tùy chọn)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 cursor-pointer transition flex items-center">
                      <Upload className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="text-gray-700">Chọn ảnh</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {proofImages.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {proofImages.length} ảnh đã chọn
                </span>
            )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Ảnh màn hình từ ứng dụng xe, ảnh đồng hồ công tơ mét, hoặc ảnh khác chứng minh chuyến đi
                  </p>
          </div>

                {/* Submit Button */}
                <div className="pt-4">
              <button
                    type="submit"
                    disabled={uploadMutation.isPending}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 font-semibold text-base flex items-center justify-center gap-2"
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Gửi xác minh</span>
                      </>
                    )}
              </button>
                </div>
                
                <Alert variant="warning">
                  <strong>Lưu ý:</strong> Dữ liệu nhập thủ công sẽ cần được CVA xác minh kỹ hơn.
                  Khuyến nghị upload file dữ liệu từ xe để đảm bảo độ chính xác.
                </Alert>
              </form>
            )}
          </div>
        </div>
      )}
      
      {/* Journey History */}
      {journeyHistories.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="mr-3" />
            Lịch sử tải dữ liệu hành trình
          </h3>
          <p className="text-gray-600 mb-6">
            Danh sách các chuyến đi đã tải lên và trạng thái xác minh
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày tải</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Xe</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Quãng đường (km)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Năng lượng (kWh)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Tốc độ TB</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {journeyHistories.map((history) => {
                  const vehicle = history.vehicle || vehicles.find(v => v.id === history.journey?.vehicle_id);
                  const date = new Date(history.created_at || history.createdAt);
                  
                  // Map status: 0=pending, 1=verified, -1=rejected
                  let status = 'pending';
                  if (history.status === 1) status = 'completed';
                  else if (history.status === -1) status = 'rejected';
                  else if (history.verified_by) status = 'verifying';
                  
                  return (
                    <tr key={history.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {date.toLocaleDateString('vi-VN')} 
                        <br/>
                        <span className="text-xs text-gray-500">
                          {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        <div className="font-semibold">
                          {vehicle?.vehicleType?.manufacturer || vehicle?.vehicle_type?.manufacturer || 'N/A'}{' '}
                          {vehicle?.vehicleType?.model || vehicle?.vehicle_type?.model || ''}
                        </div>
                        <span className="text-xs text-gray-500">
                          {vehicle?.licensePlate || vehicle?.license_plate || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 text-right font-semibold">
                        {(history.distance || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-blue-600 text-right font-semibold">
                        {(history.energy_used || history.energyUsed || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-purple-600 text-right font-semibold">
                        {(history.average_speed || history.avgSpeed || 0).toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <Alert variant="info">
              <strong>Lưu ý:</strong> Các chuyến đi đã được xác minh sẽ tự động cộng tín chỉ vào ví carbon của bạn.
            </Alert>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadTrips;
