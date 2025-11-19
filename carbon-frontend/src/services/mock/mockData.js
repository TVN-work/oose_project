// Mock data for development

export const mockUsers = {
  EV_OWNER: {
    id: '1',
    name: 'EV Owner',
    email: 'evowner@example.com',
    role: 'EV_OWNER',
    vehicle: 'Tesla Model 3',
    verified: true,
  },
  BUYER: {
    id: '2',
    name: 'Carbon Buyer',
    email: 'buyer@example.com',
    role: 'BUYER',
    memberLevel: 'Gold',
    verified: true,
  },
  VERIFIER: {
    id: '3',
    name: 'Verifier',
    email: 'verifier@example.com',
    role: 'VERIFIER',
    verified: true,
  },
  ADMIN: {
    id: '4',
    name: 'Admin',
    email: 'admin@example.com',
    role: 'ADMIN',
    verified: true,
  },
};

export const mockDashboardStats = {
  EV_OWNER: {
    stats: {
      availableCredits: 245,
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

export const mockCarbonWallet = {
  balance: 245.5,
  available: 245.5,
  pending: 0,
  locked: 0,
  totalEarned: 189.2,
  totalSold: 189.2,
  statistics: {
    totalCredits: 245.5,
    soldCredits: 189.2,
    pendingCredits: 0,
    availableCredits: 245.5,
  },
  transactions: [
    {
      id: '1',
      type: 'earned',
      amount: 15.5,
      description: 'Từ hành trình #123',
      date: '2024-01-15T10:30:00Z',
      status: 'completed',
    },
    {
      id: '2',
      type: 'sold',
      amount: -50.0,
      description: 'Bán cho Carbon Buyer',
      date: '2024-01-14T14:20:00Z',
      status: 'completed',
    },
  ],
};

export const mockListings = [
  {
    id: '1',
    vehicleType: 'car',
    creditAmount: 0.052,
    marketType: 'voluntary',
    listingPrice: 5.5,
    description: 'Carbon credits from EV trips',
    status: 'approved',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    vehicleType: 'motorcycle',
    creditAmount: 0.030,
    marketType: 'voluntary',
    listingPrice: 4.5,
    description: 'Carbon credits from motorcycle trips',
    status: 'pending',
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
  },
];

export const mockTransactions = [
  {
    id: 'TX-001',
    type: 'sale',
    amount: 275.0,
    credits: 50,
    buyer: 'Carbon Buyer',
    status: 'completed',
    date: '2024-01-14T14:20:00Z',
  },
  {
    id: 'TX-002',
    type: 'sale',
    amount: 137.5,
    credits: 25,
    buyer: 'Another Buyer',
    status: 'pending',
    date: '2024-01-15T10:00:00Z',
  },
];

export const mockMarketplaceCredits = [
  {
    id: 'CC-001',
    owner: 'Nguyễn Văn A',
    vehicle: 'Tesla Model 3',
    credits: 125,
    price: 22.50,
    region: 'Hà Nội',
    co2Saved: 9.2,
    verified: true,
    type: 'buy-now',
  },
  {
    id: 'CC-002',
    owner: 'Trần Thị B',
    vehicle: 'VinFast VF8',
    credits: 85,
    price: 21.00,
    region: 'TP.HCM',
    co2Saved: 6.3,
    verified: true,
    type: 'auction',
    timeLeft: '2h 15m',
  },
];

export const mockCertificates = [
  {
    id: 'CC-001234',
    date: '2024-12-15T09:30:00Z',
    owner: 'Nguyễn Văn A',
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
    owner: 'Trần Thị B',
    vehicle: 'VinFast VF8',
    credits: 85,
    co2Saved: 6.3,
    value: 1785.00,
    pricePerCredit: 21.00,
    status: 'verified',
  },
];

// Helper function to simulate API delay
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

