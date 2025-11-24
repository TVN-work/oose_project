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
  ChevronLeft,
  ChevronRight,
  Bike,
  Truck,
  Container,
  Zap,
  Plus,
  X,
  Search,
  Wifi,
  Radio,
  Settings
} from 'lucide-react';
import { useUploadTrip } from '../../../hooks/useEvOwner';
import { useCreateVehicle } from '../../../hooks/useVehicle';
import { useUploadImage } from '../../../hooks/useMedia';
import vehicleService from '../../../services/vehicle/vehicleService';
import vehicleTypeService from '../../../services/vehicle/vehicleTypeService';
import journeyService from '../../../services/journey/journeyService';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Alert from '../../../components/common/Alert';
import Loading from '../../../components/common/Loading';

/**
 * Upload Trips - Production Ready
 * 
 * Two main methods:
 * 1. File Upload: Upload trip data from JSON/CSV file
 * 2. Manual Input: Enter trip data manually via form
 */
const UploadTrips = () => {
  // Tab state
  // Removed file upload tab - only manual input now

  // Vehicle selection
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
  const vehicleDropdownRef = useRef(null);

  // File upload states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Vehicle info table state
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);

  // Create Vehicle Modal states
  const [showCreateVehicleModal, setShowCreateVehicleModal] = useState(false);
  const [vehicleTypeSearch, setVehicleTypeSearch] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [isVehicleTypeDropdownOpen, setIsVehicleTypeDropdownOpen] = useState(false);
  const [newVehicleData, setNewVehicleData] = useState({
    vin: '',
    licensePlate: '',
    registrationNumber: '',
    color: '',
    registrationDate: '',
    mileage: '',
    note: '',
  });
  const [isCreatingVehicle, setIsCreatingVehicle] = useState(false);

  // IoT Simulation states
  const [isSimulatingIoT, setIsSimulatingIoT] = useState(false);

  // Vehicle creation and image upload states
  const [vehicleImages, setVehicleImages] = useState([]);
  const [uploadingVehicleImages, setUploadingVehicleImages] = useState(false);

  // Pagination state for journey history
  const [journeyHistoryPage, setJourneyHistoryPage] = useState(0);
  const [journeyHistorySize, setJourneyHistorySize] = useState(10);
  const [journeyHistoryTotal, setJourneyHistoryTotal] = useState(0);

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
  const vehicleCO2Info = [
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
  const createVehicleMutation = useCreateVehicle();
  const uploadImageMutation = useUploadImage();
  const queryClient = useQueryClient();

  // Fetch user's vehicles using vehicleService.getMyVehicles (with ownerId from localStorage)
  const { data: vehiclesData, isLoading: vehiclesLoading, refetch: refetchVehicles } = useQuery({
    queryKey: ['vehicles', 'my-vehicles'],
    queryFn: () => vehicleService.getMyVehicles(),
    enabled: true, // Auto-load on mount
  });

  const vehicles = vehiclesData || [];

  // Selected vehicle details
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  // Fetch journey histories when a vehicle is selected
  const { data: journeyHistoriesResponse, isLoading: journeyHistoriesLoading, refetch: refetchJourneyHistories } = useQuery({
    queryKey: ['journeyHistories', selectedVehicle?.journey?.id, journeyHistoryPage, journeyHistorySize],
    queryFn: () => {
      if (!selectedVehicle?.journey?.id) return { content: [], totalElements: 0 };
      return journeyService.getJourneyHistoryByJourneyId(selectedVehicle.journey.id, {
        page: journeyHistoryPage,
        size: journeyHistorySize,
        sort: 'createdAt',
        order: 'desc'
      });
    },
    enabled: !!selectedVehicle?.journey?.id,
    staleTime: 0,
  });

  const journeyHistories = journeyHistoriesResponse?.content || [];

  // Update total count when data changes
  useEffect(() => {
    if (journeyHistoriesResponse?.totalElements !== undefined) {
      setJourneyHistoryTotal(journeyHistoriesResponse.totalElements);
    }
  }, [journeyHistoriesResponse]);

  // Fetch all vehicle types for the create vehicle modal
  const { data: vehicleTypesData, isLoading: vehicleTypesLoading } = useQuery({
    queryKey: ['vehicleTypes', 'all'],
    queryFn: () => vehicleTypeService.getAllVehicleTypes({ page: 0, entry: 100 }),
    enabled: showCreateVehicleModal,
  });

  const vehicleTypes = vehicleTypesData || [];

  // Filter vehicle types based on search
  const filteredVehicleTypes = vehicleTypes.filter(vt => {
    const searchLower = vehicleTypeSearch.toLowerCase();
    const fullName = `${vt.manufacturer} ${vt.model}`.toLowerCase();
    return fullName.includes(searchLower);
  });

  // Handle load vehicles button click
  const handleLoadVehicles = async () => {
    try {
      await refetchVehicles();
      showAlert('Đã tải danh sách xe thành công!', 'success');
    } catch (error) {
      showAlert('Lỗi khi tải danh sách xe', 'error');
    }
  };

  // Handle IoT Simulation - Add random distance to journey
  const handleIoTSimulation = async () => {
    if (!selectedVehicleId || !selectedVehicle?.journey?.id) {
      showAlert('Vui lòng chọn xe có journey để giả lập IoT', 'error');
      return;
    }

    setIsSimulatingIoT(true);
    showAlert('Đang kết nối thiết bị IoT...', 'info');

    try {
      // Get current distance from journey
      const currentDistance = selectedVehicle.journey?.distanceKm ||
        selectedVehicle.journey?.distance_km ||
        selectedVehicle.journey?.distance ||
        selectedVehicle.mileage ||
        selectedVehicle.distance || 0;

      // Generate random additional distance between 50-150 km
      const additionalDistance = Math.floor(Math.random() * (150 - 50 + 1)) + 50;

      // Calculate new total distance = current distance + additional distance
      // This ensures newTotalDistance > currentDistance
      const newTotalDistance = currentDistance + additionalDistance;

      // Simulate IoT data with random speed between 60-90 km/h
      const randomSpeed = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
      const energyUsed = (additionalDistance * 0.15); // ~0.15 kWh/km average for electric vehicles

      const journeyData = {
        journeyId: selectedVehicle.journey.id,
        newDistance: additionalDistance, // Quãng đường thêm vào (50-150km)
        newDistanceKm: newTotalDistance, // Tổng quãng đường mới (current + additional) - LUÔN LỚN HƠN current
        averageSpeed: randomSpeed,
        energyUsed: energyUsed,
        certificateImageUrl: [],
      };

      console.log('📡 IoT Simulation data:', {
        ...journeyData,
        currentDistanceFromJourney: currentDistance,
        additionalDistance,
        newTotalDistance,
        isNewDistanceGreater: newTotalDistance > currentDistance // Should always be true
      });

      // Call API to create journey history
      await journeyService.createJourney(journeyData);

      showAlert(`✅ Đã giả lập thành công! +${additionalDistance}km (Tổng: ${newTotalDistance.toLocaleString()}km), Tốc độ TB: ${randomSpeed}km/h`, 'success');

      // Refetch journey histories and vehicles
      await refetchJourneyHistories();
      await refetchVehicles(); // Update vehicle mileage
      await queryClient.invalidateQueries({ queryKey: ['vehicles'] });

    } catch (error) {
      console.error('❌ IoT Simulation error:', error);
      showAlert(error.message || 'Lỗi khi giả lập IoT', 'error');
    } finally {
      setIsSimulatingIoT(false);
    }
  };

  // Handle vehicle image upload
  const handleVehicleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingVehicleImages(true);
    try {
      const uploadPromises = files.map(file => uploadImageMutation.mutateAsync(file));
      const uploadResults = await Promise.all(uploadPromises);

      // Add uploaded images with full URLs
      const newImages = uploadResults.map(result => ({
        id: Date.now() + Math.random(),
        pathUrl: result.pathUrl,
        fullUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8222'}${result.pathUrl}`,
        name: result.pathUrl.split('/').pop()
      }));

      setVehicleImages(prev => [...prev, ...newImages]);
      showAlert('Tải ảnh thành công', 'success');
    } catch (error) {
      console.error('Error uploading vehicle images:', error);
      showAlert('Lỗi khi tải ảnh: ' + (error.message || 'Không xác định'), 'error');
    } finally {
      setUploadingVehicleImages(false);
    }
  };

  // Remove vehicle image
  const removeVehicleImage = (imageId) => {
    setVehicleImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Handle Create New Vehicle
  const handleCreateVehicle = async (e) => {
    e.preventDefault();

    if (!selectedVehicleType) {
      showAlert('Vui lòng chọn loại xe', 'error');
      return;
    }

    if (!newVehicleData.vin || !newVehicleData.licensePlate) {
      showAlert('Vui lòng nhập VIN và biển số xe', 'error');
      return;
    }

    setIsCreatingVehicle(true);

    try {
      const ownerId = localStorage.getItem('userId');
      if (!ownerId) {
        throw new Error('Không tìm thấy thông tin user. Vui lòng đăng nhập lại.');
      }

      const vehicleData = {
        ownerId: ownerId,
        vin: newVehicleData.vin.toUpperCase(),
        licensePlate: newVehicleData.licensePlate.toUpperCase(),
        registrationNumber: newVehicleData.registrationNumber || '',
        color: newVehicleData.color || '',
        registrationDate: newVehicleData.registrationDate || null,
        mileage: newVehicleData.mileage ? parseInt(newVehicleData.mileage) : 0,
        vehicleTypeId: selectedVehicleType.id,
        registrationImageUrl: vehicleImages.map(img => img.fullUrl), // Include uploaded image URLs
        note: newVehicleData.note || '',
      };

      console.log('🚗 Creating vehicle:', vehicleData);

      // Use the mutation hook for vehicle creation
      await createVehicleMutation.mutateAsync(vehicleData);

      showAlert('✅ Tạo xe mới thành công!', 'success');

      // Reset form and close modal
      setNewVehicleData({
        vin: '',
        licensePlate: '',
        registrationNumber: '',
        color: '',
        registrationDate: '',
        mileage: '',
        note: '',
      });
      setSelectedVehicleType(null);
      setVehicleTypeSearch('');
      setVehicleImages([]); // Clear uploaded images
      setShowCreateVehicleModal(false);

      // Refetch vehicles
      await refetchVehicles();

    } catch (error) {
      console.error('❌ Create vehicle error:', error);
      showAlert(error.message || 'Lỗi khi tạo xe mới', 'error');
    } finally {
      setIsCreatingVehicle(false);
    }
  };

  // Refetch journey histories when vehicle is selected
  useEffect(() => {
    if (selectedVehicle?.journey?.id) {
      refetchJourneyHistories();
    }
  }, [selectedVehicle?.journey?.id, refetchJourneyHistories, selectedVehicleId]);

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
                      CO₂ tiết kiệm<br />
                      <span className="text-xs font-normal text-gray-500">(so với xe xăng/dầu)</span>
                    </th>
                    <th className="text-center py-3 px-4 text-base font-bold text-gray-800 w-1/3">
                      Tín chỉ nhận được<br />
                      <span className="text-xs font-normal text-gray-500">(Ví dụ: 1000 km)</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vehicleCO2Info.map((vehicle, index) => {
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Car className="mr-3" />
            Chọn xe
          </h3>
          <button
            onClick={() => setShowCreateVehicleModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm xe mới
          </button>
        </div>

        {/* Empty vehicles message */}
        {vehicles.length === 0 && !vehiclesLoading && (
          <div className="text-center py-6">
            <p className="text-gray-600">Bạn chưa có xe nào. Hãy thêm xe mới để bắt đầu.</p>
          </div>
        )}

        {/* Loading state */}
        {vehiclesLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-green-600 mr-2" />
            <span className="text-gray-600">Đang tải danh sách xe...</span>
          </div>
        )}

        {/* Vehicle dropdown - Show when vehicles are loaded */}
        {vehicles.length > 0 && (
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
                       ${isVehicleDropdownOpen
                  ? 'border-green-500 ring-2 ring-green-500 ring-offset-1'
                  : 'border-gray-300'
                }`}
            >
              <span className={`font-medium text-lg ${selectedVehicleId ? 'text-gray-800' : 'text-gray-500'
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
              <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 transition-transform duration-200 ${isVehicleDropdownOpen ? 'rotate-180' : ''
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

                          // Reset form when vehicle changes
                          setManualData({
                            startLocation: '',
                            endLocation: '',
                            distance: '',
                            energyUsed: '',
                            averageSpeed: '',
                            date: '',
                            time: ''
                          });

                          // Reset pagination when vehicle changes
                          setJourneyHistoryPage(0);
                          setJourneyHistoryTotal(0);
                        }}
                        className={`w-full px-4 py-3 text-left text-base font-medium transition-all duration-150
                                 hover:bg-green-50 hover:text-green-700
                                 ${selectedVehicleId === vehicle.id
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
        )}

        {selectedVehicle && (
          <div className="mt-4 space-y-4">
            <Alert variant="success">
              <strong>Xe đã chọn:</strong>{' '}
              {selectedVehicle.vehicleType?.manufacturer || selectedVehicle.vehicle_type?.manufacturer}{' '}
              {selectedVehicle.vehicleType?.model || selectedVehicle.vehicle_type?.model}{' '}
              - {selectedVehicle.licensePlate || selectedVehicle.license_plate}
            </Alert>
          </div>
        )}
      </div>

      {/* Vehicle Details - Always show when vehicle is selected */}
      {selectedVehicleId && selectedVehicle && (
        <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-8 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <Car className="mr-3 text-blue-600" />
              Thông tin chi tiết xe
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              Đã chọn
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2">
                Thông tin cơ bản
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Hãng xe:</span>
                  <span className="text-gray-800 font-semibold">
                    {selectedVehicle.vehicleType?.manufacturer ||
                      selectedVehicle.vehicle_type?.manufacturer ||
                      'Không xác định'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Model:</span>
                  <span className="text-gray-800 font-semibold">
                    {selectedVehicle.vehicleType?.model ||
                      selectedVehicle.vehicle_type?.model ||
                      'Không xác định'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Biển số:</span>
                  <span className="text-gray-800 font-semibold">
                    {selectedVehicle.licensePlate || selectedVehicle.license_plate || 'Không có'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">VIN:</span>
                  <span className="text-gray-800 font-mono text-sm">
                    {selectedVehicle.vin || 'Không có'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Số km hiện tại:</span>
                  <span className="text-blue-600 font-bold">
                    {(() => {
                      // Lấy distanceKm từ journey trong vehicle response
                      const distanceFromJourney = selectedVehicle.journey?.distanceKm ||
                        selectedVehicle.journey?.distance_km ||
                        selectedVehicle.journey?.distance || 0;
                      // Fallback về mileage nếu không có journey data
                      const fallbackDistance = selectedVehicle.mileage || selectedVehicle.distance || 0;
                      const currentDistance = distanceFromJourney || fallbackDistance;
                      return currentDistance.toLocaleString();
                    })()} km
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Ngày đăng ký:</span>
                  <span className="text-gray-800 font-semibold">
                    {(() => {
                      const regDate = selectedVehicle.registrationDate ||
                        selectedVehicle.registration_date;
                      if (regDate) {
                        return new Date(regDate).toLocaleDateString('vi-VN');
                      }
                      return 'Chưa cập nhật';
                    })()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Màu xe:</span>
                  <span className="text-gray-800 font-semibold">
                    {selectedVehicle.color || 'Không xác định'}
                  </span>
                </div>

                {selectedVehicle.registrationNumber && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Số đăng ký:</span>
                    <span className="text-gray-800 font-semibold">
                      {selectedVehicle.registrationNumber || selectedVehicle.registration_number}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Images */}
          {(() => {
            // Handle multiple image URL formats from API
            const imageUrls = selectedVehicle.registrationImageUrl ||
              selectedVehicle.registration_image_url ||
              selectedVehicle.imageUrls ||
              selectedVehicle.images;

            if (!imageUrls) return null;

            // Convert to array if it's a string or handle different formats
            let images = [];
            if (typeof imageUrls === 'string') {
              // If it's a JSON string, try to parse it
              try {
                images = JSON.parse(imageUrls);
              } catch (e) {
                // If it's just a single URL string
                images = [imageUrls];
              }
            } else if (Array.isArray(imageUrls)) {
              images = imageUrls;
            }

            if (!images.length) return null;

            return (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                  Hình ảnh xe ({images.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:shadow-lg transition-shadow"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200"></div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Ảnh {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">

          </div>
        </div>
      )}

      {/* IoT Simulation Section - Show when vehicle is selected */}
      {selectedVehicleId && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <Radio className="w-5 h-5 mr-2 animate-pulse" />
                Giả lập kết nối IoT
              </h3>
              <p className="text-purple-100 text-sm">
                {selectedVehicle?.journey?.id
                  ? 'Nhấn nút bên phải để giả lập dữ liệu từ thiết bị IoT (thêm 50-150km vào quãng đường hiện tại)'
                  : 'Xe chưa có journey. Vui lòng liên hệ admin để kích hoạt journey cho xe.'}
              </p>
            </div>
            <button
              onClick={handleIoTSimulation}
              disabled={isSimulatingIoT || !selectedVehicle?.journey?.id}
              className="px-6 py-3 bg-white text-purple-700 rounded-xl hover:bg-purple-50 transition font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSimulatingIoT ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang kết nối...
                </>
              ) : (
                <>
                  <Wifi className="w-5 h-5" />
                  Gửi dữ liệu IoT
                </>
              )}
            </button>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs text-purple-200">Hiện tại</p>
              <p className="text-sm font-bold">
                {(() => {
                  const current = selectedVehicle?.journey?.distanceKm ||
                    selectedVehicle?.journey?.distance_km ||
                    selectedVehicle?.journey?.distance || 0;
                  return current.toLocaleString();
                })()} km
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs text-purple-200">Thêm vào</p>
              <p className="text-lg font-bold">+50-150 km</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs text-purple-200">Năng lượng</p>
              <p className="text-sm font-bold">7.5-22.5 kWh</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs text-purple-200">Tốc độ TB</p>
              <p className="text-sm font-bold">60-90 km/h</p>
            </div>
          </div>
        </div>
      )}



      {/* Journey History - Only show when vehicle is selected */}
      {
        selectedVehicleId && (
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FileText className="mr-3" />
              Lịch sử tải dữ liệu hành trình
            </h3>
            <p className="text-gray-600 mb-6">
              Danh sách các chuyến đi đã tải lên cho xe:{' '}
              <span className="font-semibold text-green-600">
                {selectedVehicle?.vehicleType?.manufacturer || selectedVehicle?.vehicle_type?.manufacturer}{' '}
                {selectedVehicle?.vehicleType?.model || selectedVehicle?.vehicle_type?.model}{' '}
                - {selectedVehicle?.licensePlate || selectedVehicle?.license_plate}
              </span>
            </p>

            {/* Loading state */}
            {journeyHistoriesLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-green-600 mr-2" />
                <span className="text-gray-600">Đang tải lịch sử hành trình...</span>
              </div>
            )}

            {/* Empty state */}
            {!journeyHistoriesLoading && journeyHistories.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có dữ liệu hành trình nào được tải lên cho xe này</p>
              </div>
            )}

            {/* Table with data */}
            {!journeyHistoriesLoading && journeyHistories.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày tạo</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Quãng đường (km)</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Năng lượng (kWh)</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Tốc độ TB (km/h)</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {journeyHistories.map((history) => {
                        const date = new Date(history.createdAt || history.created_at);

                        // Map status from API: PENDING, APPROVED, REJECTED, CANCELLED
                        const statusLower = (history.status || 'PENDING').toLowerCase();
                        let displayStatus = 'pending';
                        if (statusLower === 'approved') displayStatus = 'completed';
                        else if (statusLower === 'rejected') displayStatus = 'rejected';
                        else if (statusLower === 'cancelled') displayStatus = 'failed';
                        else displayStatus = 'pending';

                        return (
                          <tr key={history.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-800">
                              {date.toLocaleDateString('vi-VN')}
                              <br />
                              <span className="text-xs text-gray-500">
                                {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-800 text-right font-semibold">
                              {(history.newDistance || history.distance || 0).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-sm text-blue-600 text-right font-semibold">
                              {(history.energyUsed || history.energy_used || 0).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-sm text-purple-600 text-right font-semibold">
                              {(history.averageSpeed || history.average_speed || 0).toFixed(1)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {getStatusBadge(displayStatus)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Hiển thị:</span>
                      <select
                        value={journeyHistorySize}
                        onChange={(e) => {
                          setJourneyHistorySize(parseInt(e.target.value));
                          setJourneyHistoryPage(0); // Reset to first page
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-green-500"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-sm text-gray-600">/ trang</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Hiển thị {Math.min(journeyHistoryPage * journeyHistorySize + 1, journeyHistoryTotal)} -
                      {Math.min((journeyHistoryPage + 1) * journeyHistorySize, journeyHistoryTotal)}
                      trong tổng số {journeyHistoryTotal} hành trình
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setJourneyHistoryPage(Math.max(0, journeyHistoryPage - 1))}
                      disabled={journeyHistoryPage === 0 || journeyHistoriesLoading}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, Math.ceil(journeyHistoryTotal / journeyHistorySize)) }, (_, i) => {
                        const totalPages = Math.ceil(journeyHistoryTotal / journeyHistorySize);
                        let pageNumber;

                        if (totalPages <= 5) {
                          pageNumber = i;
                        } else if (journeyHistoryPage < 3) {
                          pageNumber = i;
                        } else if (journeyHistoryPage > totalPages - 4) {
                          pageNumber = totalPages - 5 + i;
                        } else {
                          pageNumber = journeyHistoryPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setJourneyHistoryPage(pageNumber)}
                            className={`px-3 py-1 text-sm border rounded-md transition-colors ${pageNumber === journeyHistoryPage
                              ? 'bg-green-600 text-white border-green-600'
                              : 'border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {pageNumber + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setJourneyHistoryPage(Math.min(Math.ceil(journeyHistoryTotal / journeyHistorySize) - 1, journeyHistoryPage + 1))}
                      disabled={journeyHistoryPage >= Math.ceil(journeyHistoryTotal / journeyHistorySize) - 1 || journeyHistoriesLoading}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <Alert variant="info">
                    <strong>Lưu ý:</strong> Các chuyến đi đã được xác minh sẽ tự động cộng tín chỉ vào ví carbon của bạn.
                    Dữ liệu được sắp xếp theo thời gian tạo mới nhất.
                  </Alert>
                </div>
              </>
            )}
          </div>
        )
      }

      {/* Create Vehicle Modal */}
      {
        showCreateVehicleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Car className="w-6 h-6 mr-2 text-green-600" />
                  Thêm xe mới
                </h2>
                <button
                  onClick={() => {
                    setShowCreateVehicleModal(false);
                    setSelectedVehicleType(null);
                    setVehicleTypeSearch('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreateVehicle} className="p-6 space-y-6">
                {/* Vehicle Type Selection with Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại xe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={vehicleTypeSearch}
                        onChange={(e) => {
                          setVehicleTypeSearch(e.target.value);
                          setIsVehicleTypeDropdownOpen(true);
                        }}
                        onFocus={() => setIsVehicleTypeDropdownOpen(true)}
                        placeholder="Tìm kiếm hãng xe, model..."
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    {/* Dropdown */}
                    {isVehicleTypeDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {vehicleTypesLoading ? (
                          <div className="p-4 text-center text-gray-500">
                            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                            Đang tải...
                          </div>
                        ) : filteredVehicleTypes.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            Không tìm thấy loại xe phù hợp
                          </div>
                        ) : (
                          filteredVehicleTypes.map((vt) => (
                            <button
                              key={vt.id}
                              type="button"
                              onClick={() => {
                                setSelectedVehicleType(vt);
                                setVehicleTypeSearch(`${vt.manufacturer} ${vt.model}`);
                                setIsVehicleTypeDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left hover:bg-green-50 transition flex justify-between items-center ${selectedVehicleType?.id === vt.id ? 'bg-green-100' : ''
                                }`}
                            >
                              <div>
                                <p className="font-semibold text-gray-800">{vt.manufacturer} {vt.model}</p>
                                <p className="text-xs text-gray-500">CO₂/km: {vt.co2PerKm} kg</p>
                              </div>
                              {selectedVehicleType?.id === vt.id && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {selectedVehicleType && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-green-800">
                          {selectedVehicleType.manufacturer} {selectedVehicleType.model}
                        </p>
                        <p className="text-xs text-green-600">CO₂/km: {selectedVehicleType.co2PerKm} kg</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVehicleType(null);
                          setVehicleTypeSearch('');
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* VIN and License Plate */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số VIN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newVehicleData.vin}
                      onChange={(e) => setNewVehicleData({ ...newVehicleData, vin: e.target.value })}
                      placeholder="WBADT43452G123456"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 uppercase"
                      maxLength={17}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">17 ký tự</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biển số xe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newVehicleData.licensePlate}
                      onChange={(e) => setNewVehicleData({ ...newVehicleData, licensePlate: e.target.value })}
                      placeholder="30A-123.45"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 uppercase"
                      required
                    />
                  </div>
                </div>

                {/* Registration Number and Color */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số đăng ký
                    </label>
                    <input
                      type="text"
                      value={newVehicleData.registrationNumber}
                      onChange={(e) => setNewVehicleData({ ...newVehicleData, registrationNumber: e.target.value })}
                      placeholder="Số đăng ký xe"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Màu xe
                    </label>
                    <input
                      type="text"
                      value={newVehicleData.color}
                      onChange={(e) => setNewVehicleData({ ...newVehicleData, color: e.target.value })}
                      placeholder="Trắng, Đen, Xám..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                {/* Registration Date and Mileage */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày đăng ký
                    </label>
                    <input
                      type="date"
                      value={newVehicleData.registrationDate}
                      onChange={(e) => setNewVehicleData({ ...newVehicleData, registrationDate: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số km đã đi
                    </label>
                    <input
                      type="number"
                      value={newVehicleData.mileage}
                      onChange={(e) => setNewVehicleData({ ...newVehicleData, mileage: e.target.value })}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                {/* Vehicle Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh xe (tùy chọn)
                  </label>
                  <div className="space-y-3">
                    {/* Upload Button */}
                    <div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleVehicleImageUpload}
                        className="hidden"
                        id="vehicle-images-upload"
                        disabled={uploadingVehicleImages}
                      />
                      <label
                        htmlFor="vehicle-images-upload"
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors ${uploadingVehicleImages ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingVehicleImages ? 'Đang tải...' : 'Chọn ảnh xe'}
                      </label>
                    </div>

                    {/* Image Preview */}
                    {vehicleImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {vehicleImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.fullUrl}
                              alt="Vehicle"
                              className="w-full h-20 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeVehicleImage(image.id)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={newVehicleData.note}
                    onChange={(e) => setNewVehicleData({ ...newVehicleData, note: e.target.value })}
                    placeholder="Ghi chú thêm về xe..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateVehicleModal(false);
                      setSelectedVehicleType(null);
                      setVehicleTypeSearch('');
                      setVehicleImages([]); // Clear uploaded images
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingVehicle || !selectedVehicleType}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCreatingVehicle ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Tạo xe mới
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default UploadTrips;
