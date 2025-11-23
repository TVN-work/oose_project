// Mock data for development
// Based on backend database schema

// Helper function to generate UUID-like ID
export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper function to get current timestamp
export const getTimestamp = () => new Date().toISOString();

// Helper function to simulate API delay
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ========== USERS ==========
export const mockUsers = {
  EV_OWNER: {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    dob: '1990-01-15',
    email: 'evowner@example.com',
    full_name: 'Nguyễn Văn A',
    phone_number: '+84901234567',
    roles: 'EV_OWNER', // Match USER_ROLES constant
    password: 'password', // Default password for mock users
  },
  BUYER: {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    dob: '1985-05-20',
    email: 'buyer@example.com',
    full_name: 'Trần Thị B',
    phone_number: '+84901234568',
    roles: 'BUYER', // Match USER_ROLES constant
    password: 'password', // Default password for mock users
  },
  VERIFIER: {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    dob: '1988-03-10',
    email: 'verifier@example.com',
    full_name: 'Lê Văn C',
    phone_number: '+84901234569',
    roles: 'VERIFIER', // Match USER_ROLES constant
    password: 'password', // Default password for mock users
  },
  ADMIN: {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    dob: '1980-07-25',
    email: 'admin@example.com',
    full_name: 'Phạm Thị D',
    phone_number: '+84901234570',
    roles: 'ADMIN', // Match USER_ROLES constant
    password: 'Admin@123', // Match backend default admin password
  },
};

// ========== WALLETS ==========
export const mockWallets = {
  EV_OWNER: {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    owner_id: mockUsers.EV_OWNER.id,
    balance: 1250.50,
  },
  BUYER: {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    owner_id: mockUsers.BUYER.id,
    balance: 5000.00,
  },
};

// ========== VEHICLE TYPES ==========
// Category values: 'motorcycle', 'car', 'truck', 'heavy_truck'
export const mockVehicleTypes = [
  // === MOTORCYCLE (Xe máy điện) ===
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    category: 'motorcycle',
    co2per_km: 0.050,
    manufacturer: 'VinFast',
    model: 'Klara',
  },
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    category: 'motorcycle',
    co2per_km: 0.045,
    manufacturer: 'Pega',
    model: 'Newtech',
  },
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    category: 'motorcycle',
    co2per_km: 0.048,
    manufacturer: 'Yadea',
    model: 'S3',
  },
  
  // === CAR (Ô tô điện) ===
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    category: 'car',
    co2per_km: 0.150,
    manufacturer: 'Tesla',
    model: 'Model 3',
  },
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    category: 'car',
    co2per_km: 0.155,
    manufacturer: 'VinFast',
    model: 'VF8',
  },
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    category: 'car',
    co2per_km: 0.145,
    manufacturer: 'BYD',
    model: 'Atto 3',
  },
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    category: 'car',
    co2per_km: 0.160,
    manufacturer: 'Hyundai',
    model: 'Ioniq 5',
  },
  
  // === TRUCK (Xe tải điện) ===
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    category: 'truck',
    co2per_km: 0.250,
    manufacturer: 'BYD',
    model: 'T5',
  },
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    category: 'truck',
    co2per_km: 0.260,
    manufacturer: 'Rivian',
    model: 'EDV 700',
  },
  
  // === HEAVY_TRUCK (Xe tải hạng nặng) ===
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    category: 'heavy_truck',
    co2per_km: 0.350,
    manufacturer: 'Tesla',
    model: 'Semi',
  },
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    category: 'heavy_truck',
    co2per_km: 0.370,
    manufacturer: 'Volvo',
    model: 'FH Electric',
  },
];

// ========== VEHICLES ==========
export const mockVehicles = [
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    owner_id: mockUsers.EV_OWNER.id,
    vehicle_type_id: mockVehicleTypes[0].id,
    license_plate: '30A-12345',
    mileage: 12500,
    registration_date: '2023-01-15',
    registration_image_url: '/images/registration-1.jpg',
    vin: '5YJ3E1EA1KF123456',
  },
];

// ========== JOURNEYS ==========
export const mockJourneys = [
  {
    id: generateId(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updated_at: getTimestamp(),
    vehicle_id: mockVehicles[0].id,
    distance_km: 125.5,
    energy_used: 18.5,
    avg_speed: 45.2,
    co2reduced: 6.526,
    journey_status: 'completed',
  },
  {
    id: generateId(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updated_at: getTimestamp(),
    vehicle_id: mockVehicles[0].id,
    distance_km: 89.3,
    energy_used: 13.2,
    avg_speed: 42.1,
    co2reduced: 4.644,
    journey_status: 'completed',
  },
  {
    id: generateId(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updated_at: getTimestamp(),
    vehicle_id: mockVehicles[0].id,
    distance_km: 156.8,
    energy_used: 22.1,
    avg_speed: 51.3,
    co2reduced: 8.154,
    journey_status: 'verifying',
  },
  {
    id: generateId(),
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updated_at: getTimestamp(),
    vehicle_id: mockVehicles[0].id,
    distance_km: 45.2,
    energy_used: 6.8,
    avg_speed: 38.5,
    co2reduced: 2.350,
    journey_status: 'calculating',
  },
];

// ========== JOURNEY HISTORIES ==========
export const mockJourneyHistories = [
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    journey_id: mockJourneys[0].id,
    average_speed: 45.2,
    certificate_image_url: '/images/certificate-1.jpg',
    energy_used: 18.5,
    distance: 125.5,
    note: 'Journey verified successfully',
    status: 1, // 1 = verified, 0 = pending, -1 = rejected
    verified_by: mockUsers.VERIFIER.id,
  },
];

// ========== CARBON CREDITS ==========
export const mockCarbonCredits = {
  EV_OWNER: {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    owner_id: mockUsers.EV_OWNER.id,
    available_credit: 245.5,
    total_credit: 434.7,
    traded_credit: 189.2,
  },
};

// Legacy format for backward compatibility
export const mockCarbonWallet = {
  balance: mockCarbonCredits.EV_OWNER.available_credit,
  available: mockCarbonCredits.EV_OWNER.available_credit,
  pending: 0,
  locked: 0,
  totalEarned: mockCarbonCredits.EV_OWNER.total_credit,
  totalSold: mockCarbonCredits.EV_OWNER.traded_credit,
  statistics: {
    totalCredits: mockCarbonCredits.EV_OWNER.total_credit,
    soldCredits: mockCarbonCredits.EV_OWNER.traded_credit,
    pendingCredits: 0,
    availableCredits: mockCarbonCredits.EV_OWNER.available_credit,
  },
  transactions: [
    // Tăng tín chỉ từ hành trình
    {
      id: generateId(),
      type: 'earned',
      amount: 12.5,
      description: 'Tạo tín chỉ từ hành trình',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      status: 'completed',
    },
    {
      id: generateId(),
      type: 'earned',
      amount: 8.3,
      description: 'Tạo tín chỉ từ hành trình',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      status: 'completed',
    },
    {
      id: generateId(),
      type: 'earned',
      amount: 15.2,
      description: 'Tạo tín chỉ từ hành trình',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      status: 'completed',
    },
    // Giảm tín chỉ khi tạo niêm yết
    {
      id: generateId(),
      type: 'listing_created',
      amount: -25.0,
      description: 'Tạo niêm yết tín chỉ',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      status: 'completed',
    },
    {
      id: generateId(),
      type: 'listing_created',
      amount: -50.0,
      description: 'Tạo niêm yết tín chỉ',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      status: 'completed',
    },
    {
      id: generateId(),
      type: 'listing_created',
      amount: -30.0,
      description: 'Tạo niêm yết tín chỉ',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      status: 'completed',
    },
  ],
};

// Payment wallet transactions (sales history)
export const mockPaymentWalletTransactions = [
  // Bán tín chỉ - Giá cố định
  {
    id: generateId(),
    type: 'sale',
    amount: 625000, // 25 credits * 25000 VND
    description: 'Bán tín chỉ - Giá cố định',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'completed',
    listingType: 'fixed_price',
    credits: 25.0,
  },
  {
    id: generateId(),
    type: 'sale',
    amount: 500000, // 20 credits * 25000 VND
    description: 'Bán tín chỉ - Giá cố định',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    status: 'completed',
    listingType: 'fixed_price',
    credits: 20.0,
  },
  // Bán tín chỉ - Đấu giá
  {
    id: generateId(),
    type: 'sale',
    amount: 750000, // 30 credits * 25000 VND (auction price)
    description: 'Bán tín chỉ - Đấu giá',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'completed',
    listingType: 'auction',
    credits: 30.0,
  },
  {
    id: generateId(),
    type: 'sale',
    amount: 875000, // 35 credits * 25000 VND (auction price)
    description: 'Bán tín chỉ - Đấu giá',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'completed',
    listingType: 'auction',
    credits: 35.0,
  },
];

// ========== MARKET LISTINGS ==========
export const mockMarketListings = [
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    seller_id: mockUsers.EV_OWNER.id,
    buyer_id: null,
    price_per_credit: 22.50,
    quantity: 125,
    start_time: getTimestamp(),
    listing_type: 'fixed_price',
    starting_price: 22.50,
    highest_bid_id: null,
  },
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    seller_id: mockUsers.EV_OWNER.id,
    buyer_id: null,
    price_per_credit: 21.00,
    quantity: 85,
    start_time: getTimestamp(),
    listing_type: 'auction',
    starting_price: 20.00,
    highest_bid_id: null,
  },
];

// Legacy format for backward compatibility
export const mockListings = mockMarketListings.map(listing => ({
  id: listing.id,
  vehicleType: 'car',
  creditAmount: listing.quantity,
  marketType: 'voluntary',
  listingPrice: listing.price_per_credit,
  description: 'Carbon credits from EV trips',
  status: 'approved',
  createdAt: listing.created_at,
  updatedAt: listing.updated_at,
  listing_type: listing.listing_type,
}));

// ========== BIDS ==========
export const mockBids = [
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    bidder_id: mockUsers.BUYER.id,
    listing_id: mockMarketListings[1].id,
    amount: 21.50,
    bidder_name: mockUsers.BUYER.full_name,
  },
];

// ========== TRANSACTIONS ==========
export const mockTransactions = [
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    buyer_id: mockUsers.BUYER.id,
    seller_id: mockUsers.EV_OWNER.id,
    listing_id: mockMarketListings[0].id,
    credit: 50,
    amount: 1125.00,
    payment_method: 'bank_transfer',
    payment_url: '/payment/redirect/123',
    status: 'completed',
  },
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    buyer_id: mockUsers.BUYER.id,
    seller_id: mockUsers.EV_OWNER.id,
    listing_id: mockMarketListings[0].id,
    credit: 25,
    amount: 562.50,
    payment_method: 'e_wallet',
    payment_url: '/payment/redirect/124',
    status: 'pending',
  },
];

// ========== AUDITS ==========
export const mockAudits = [
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    action: 'credit_earned',
    amount: 15.5,
    balance_after: 245.5,
    description: 'Earned from journey #123',
    owner_id: mockUsers.EV_OWNER.id,
    reference_id: mockJourneys[0].id,
    type: 'credit',
  },
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    action: 'credit_sold',
    amount: -50.0,
    balance_after: 195.5,
    description: 'Sold 50 credits to buyer',
    owner_id: mockUsers.EV_OWNER.id,
    reference_id: mockTransactions[0].id,
    type: 'credit',
  },
];

// ========== VERIFY REQUESTS ==========
export const mockVerifyRequests = [
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    user_id: mockUsers.EV_OWNER.id,
    description: 'Verify journey data for carbon credit issuance',
    document_url: '/documents/journey-123.pdf',
    reference_id: mockJourneys[0].id,
    title: 'Journey Verification Request',
    type: 'journey_verification',
    status: 'pending',
  },
];

// ========== IMAGES ==========
export const mockImages = [
  {
    id: generateId(),
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
    data: '/images/vehicle-registration-1.jpg',
    name: 'vehicle-registration-1.jpg',
    type: 'registration',
  },
];

// ========== DASHBOARD STATS (Legacy format for backward compatibility) ==========
export const mockDashboardStats = {
  EV_OWNER: {
    stats: {
      availableCredits: mockCarbonCredits.EV_OWNER.available_credit,
      totalRevenue: 8750,
      totalDistance: 12450,
      totalCo2Saved: 18.1,
    },
    trends: {
      creditsChange: 12.3,
      revenueChange: 15.2,
      distanceChange: 8.9,
      co2Change: 12.3,
    },
    charts: {
      weeklyRevenue: [
        { day: 'T2', value: 120 },
        { day: 'T3', value: 190 },
        { day: 'T4', value: 150 },
        { day: 'T5', value: 220 },
        { day: 'T6', value: 180 },
        { day: 'T7', value: 250 },
        { day: 'CN', value: 200 },
      ],
      co2Trend: [
        { month: 'T7', value: 2.2 },
        { month: 'T8', value: 2.7 },
        { month: 'T9', value: 2.4 },
        { month: 'T10', value: 2.6 },
        { month: 'T11', value: 2.3 },
        { month: 'T12', value: 2.8 },
      ],
      revenueTrend: [
        { month: 'T7', value: 520 },
        { month: 'T8', value: 630 },
        { month: 'T9', value: 560 },
        { month: 'T10', value: 610 },
        { month: 'T11', value: 540 },
        { month: 'T12', value: 587 },
      ],
      creditDistribution: [
        { name: 'Đã bán', value: 189, color: '#10b981' },
        { name: 'Đang niêm yết', value: 45, color: '#3b82f6' },
        { name: 'Có sẵn', value: 11, color: '#8b5cf6' },
      ],
    },
    recentActivities: [
      {
        icon: '📤',
        title: 'Tải dữ liệu hành trình thành công',
        description: '125 km • Tạo 15 tín chỉ carbon',
        time: '2 giờ trước',
        value: '+15 tín chỉ',
        type: 'upload',
      },
      {
        icon: '💰',
        title: 'Bán tín chỉ thành công',
        description: '50 tín chỉ cho Carbon Buyer',
        time: '1 ngày trước',
        value: '+$1,250',
        type: 'sale',
      },
    ],
  },
  BUYER: {
    stats: {
      creditsPurchased: 587,
      totalSpent: 12450,
      certificates: 8,
      co2Reduced: 43.2,
    },
    recentActivities: [
      {
        icon: '✅',
        title: 'Mua thành công 85 tín chỉ',
        description: 'Từ Trần Thị B • 2 giờ trước',
        value: '+$1,885',
      },
      {
        icon: '🏆',
        title: 'Nhận chứng nhận mới',
        description: 'Chứng nhận CC-001234 • 1 ngày trước',
      },
    ],
  },
};

// ========== MARKETPLACE CREDITS (Legacy format) ==========
export const mockMarketplaceCredits = mockMarketListings.map(listing => ({
  id: listing.id,
  owner: mockUsers.EV_OWNER.full_name,
  vehicle: 'Tesla Model 3',
  credits: listing.quantity,
  price: listing.price_per_credit,
  region: 'Hà Nội',
  co2Saved: 9.2,
  verified: true,
  type: listing.listing_type === 'fixed_price' ? 'buy-now' : 'auction',
  timeLeft: listing.listing_type === 'auction' ? '2h 15m' : null,
}));

// ========== CERTIFICATES (Legacy format) ==========
export const mockCertificates = [
  {
    id: 'CC-001234',
    date: '2024-12-15T09:30:00Z',
    owner: mockUsers.EV_OWNER.full_name,
    vehicle: 'Tesla Model 3',
    credits: 125,
    co2Saved: 9.2,
    value: 2812.50,
    pricePerCredit: 22.50,
    status: 'verified',
  },
  {
    id: 'CC-001235',
    date: '2024-12-12T14:15:00Z',
    owner: mockUsers.EV_OWNER.full_name,
    vehicle: 'VinFast VF8',
    credits: 85,
    co2Saved: 6.3,
    value: 1785.00,
    pricePerCredit: 21.00,
    status: 'verified',
  },
];
