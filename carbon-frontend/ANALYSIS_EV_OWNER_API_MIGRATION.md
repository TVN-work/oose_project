# Phân Tích Thay Thế API cho EV Owner Features

## 📋 Tổng Quan

Dựa trên các service đã tạo và màn hình hiện tại, đây là phân tích chi tiết về việc migration từ mock API sang real API.

---

## 🎯 Các Services Đã Tạo

### ✅ Đã Có Real API
1. **walletService** - Quản lý ví carbon & tiền
2. **carbonCreditService** - Quản lý carbon credits
3. **vehicleService** - Quản lý phương tiện
4. **vehicleTypeService** - Quản lý loại phương tiện
5. **mediaService** - Upload/download ảnh
6. **journeyService** - Quản lý hành trình (chỉ create & getById)
7. **verificationService** - Quản lý yêu cầu xác minh
8. **marketService** - Quản lý listings (niêm yết)
9. **bidService** - Quản lý đấu giá
10. **transactionService** - Quản lý giao dịch bán

---

## 📱 Phân Tích Từng Màn Hình

### 1. **Dashboard.jsx** 
**Chức năng:** Tổng quan thống kê

**API hiện tại (Mock):**
- `useDashboardStats()` → `evOwnerService.getDashboardStats()`

**Cần chuyển sang:**
```javascript
// Thay vì 1 endpoint tổng hợp, gọi nhiều endpoints riêng:

// 1. Wallet data (availableCredits, totalRevenue)
const { data: walletData } = useWallet(userId); // walletService
const { data: carbonCreditData } = useCarbonCreditByUserId(userId); // carbonCreditService

// 2. Journey statistics (totalDistance, CO2 saved)
const { data: journeys } = useJourneys({ 
  userId, 
  status: 'APPROVED' 
}); // journeyService - CẦN BỔ SUNG getAllJourneys

// 3. Recent activities
const { data: recentTransactions } = useTransactions({ 
  sellerId: userId,
  page: 0,
  entry: 5,
  sort: 'DESC'
}); // transactionService

// 4. Charts data - tính toán client-side từ journeys & transactions
```

**⚠️ VẤN ĐỀ:**
- `journeyService` chưa có `getAllJourneys()` - CHỈ CÓ `createJourney` và `getJourneyById`
- Cần bổ sung endpoint GET /api/journeys với filters

**📝 TODO:**
1. Thêm `getAllJourneys(params)` vào journeyService
2. Thêm hook `useJourneys(params)` để fetch danh sách
3. Tính toán statistics client-side từ dữ liệu thực

---

### 2. **CarbonWallet.jsx**
**Chức năng:** Quản lý ví carbon & ví tiền

**API hiện tại (Mock):**
- `useCarbonWallet()` → `evOwnerService.getCarbonWallet()`
- `useWalletTransactions()` → `evOwnerService.getCarbonWalletTransactions()`

**Cần chuyển sang:**
```javascript
// ✅ ĐÃ CÓ API
const { data: wallet } = useMyWallet(); // walletService.getWalletByUserId(userId)
const { data: carbonCredit } = useMyCarbonCredit(); // carbonCreditService.getCarbonCreditByUserId(userId)

// ⚠️ CHƯA CÓ: Lịch sử giao dịch ví carbon
// Hiện tại carbonCreditService chỉ có:
// - getCarbonCredits() - GET /carbon-credit (all)
// - getCarbonCreditById(id) - GET /carbon-credit/:id
// - getCarbonCreditByUserId(userId) - GET /carbon-credit/user/:userId
// - updateCarbonCredit(id, data) - PATCH /carbon-credit/:id

// CẦN: Endpoint lịch sử thay đổi carbon credit
// GET /carbon-credit/user/:userId/transactions
// Response: [{ type: 'earned'|'sold'|'refunded', amount, date, description }]
```

**⚠️ VẤN ĐỀ:**
- Không có endpoint lịch sử transactions của carbon credit
- Hiện tại chỉ có balance, không có history

**📝 TODO:**
1. Bổ sung endpoint GET /carbon-credit/user/:userId/transactions vào backend
2. Thêm `getCarbonCreditTransactions(userId)` vào carbonCreditService
3. Hoặc: Dùng transactionService để lấy lịch sử bán, journey để lấy lịch sử kiếm

---

### 3. **UploadTrips.jsx**
**Chức năng:** Tải dữ liệu hành trình

**API hiện tại (Mock):**
- `useUploadTrip()` → `evOwnerService.uploadTrip()`
- `evOwnerService.getAllJourneyHistories()`

**Cần chuyển sang:**
```javascript
// ✅ CREATE journey
const { mutate: createJourney } = useCreateJourney(); // journeyService.createJourney()

// ⚠️ CHƯA CÓ: Get all journeys
// Hiện tại journeyService CHỈ CÓ:
// - createJourney(data) - POST /journeys
// - getJourneyById(id) - GET /journeys/{id}

// CẦN: GET /journeys với filters
const { data: journeys } = useJourneys({ 
  vehicleId: selectedVehicleId,
  userId: userId, // Nếu backend hỗ trợ
  page: 0,
  entry: 10,
  sort: 'DESC'
});
```

**⚠️ VẤN ĐỀ:**
- `journeyService` KHÔNG CÓ `getAllJourneys()` 
- Backend chỉ cung cấp POST và GET by ID
- Không fetch được danh sách journeys đã upload

**📝 TODO:**
1. **BỔ SUNG BACKEND:** GET /api/journeys với query params:
   ```
   ?userId=&vehicleId=&status=&page=0&entry=10&field=id&sort=DESC
   ```
2. Thêm `getAllJourneys(params)` vào journeyService.js
3. Thêm hook `useJourneys(params)` vào useJourney.js

---

### 4. **ListingsManagement.jsx**
**Chức năng:** Quản lý niêm yết bán tín chỉ

**API hiện tại (Mock):**
- `useListings()` → `evOwnerService.getListings()`
- `useCreateListing()` → `evOwnerService.createListing()`

**Cần chuyển sang:**
```javascript
// ✅ ĐÃ CÓ API
const { data: listings } = useListings({ 
  sellerId: userId,
  page: 0,
  entry: 10,
  sort: 'DESC'
}); // marketService.getAllListings()

const { mutate: createListing } = useCreateListing(); // marketService.createListing()

const { mutate: updateStatus } = useUpdateListingStatus(); // marketService.updateListingStatus()

// ⚠️ CHƯA CÓ: AI price suggestion
// evOwnerService.getAIPriceSuggestion() - Mock
```

**⚠️ VẤN ĐỀ:**
- AI price suggestion là mock, cần backend hỗ trợ
- Hoặc: Tính toán client-side dựa trên market data

**📝 TODO:**
1. Thay `evOwnerService.getListings()` → `marketService.getAllListings({ sellerId })`
2. Thay `evOwnerService.createListing()` → `marketService.createListing()`
3. AI price: Keep client-side calculation hoặc chờ backend endpoint

---

### 5. **TransactionHistory.jsx**
**Chức năng:** Lịch sử giao dịch bán

**API hiện tại (Mock):**
- `evOwnerService.getTransactions()` - Get transactions where user is seller
- `evOwnerService.cancelTransaction(id)`
- `evOwnerService.completeTransaction(id)`

**Cần chuyển sang:**
```javascript
// ✅ ĐÃ CÓ API
const { data: transactions } = useTransactions({ 
  sellerId: userId,
  page: 0,
  entry: 10,
  sort: 'DESC'
}); // transactionService.getAllTransactions()

const { data: transaction } = useTransaction(id); // transactionService.getTransactionById()

const { mutate: updateStatus } = useUpdateTransactionStatus(); 
// transactionService.updateTransactionStatus(id, status)

// ⚠️ BACKEND CHỈ CÓ:
// - updateTransactionStatus(id, status) - PATCH /transactions/:id?status=...
// KHÔNG CÓ riêng cancelTransaction() và completeTransaction()
```

**⚠️ VẤN ĐỀ:**
- Backend không có endpoint riêng cho cancel/complete
- Chỉ có `updateTransactionStatus(id, status)`
- Cần map:
  - `cancelTransaction(id)` → `updateTransactionStatus(id, 'CANCELED')`
  - `completeTransaction(id)` → `updateTransactionStatus(id, 'SUCCESS')`

**📝 TODO:**
1. Thay `evOwnerService.getTransactions()` → `transactionService.getAllTransactions({ sellerId })`
2. Update cancel/complete logic:
   ```javascript
   const handleCancel = (id) => {
     updateStatus({ transactionId: id, status: 'CANCELED' });
   };
   
   const handleComplete = (id) => {
     updateStatus({ transactionId: id, status: 'SUCCESS' });
   };
   ```

---

### 6. **Các Màn Khác**

**Reports.jsx** - Mock data (charts, statistics)
→ Tính toán client-side từ real data (journeys, transactions, wallet)

**Settings.jsx** - Quản lý xe
```javascript
// ✅ ĐÃ CÓ
const { data: vehicles } = useMyVehicles(); // vehicleService
const { mutate: createVehicle } = useCreateVehicle(); // vehicleService
const { data: vehicleTypes } = useVehicleTypes(); // vehicleTypeService
```

---

## 🚨 CÁC VẤN ĐỀ CHÍNH

### 1. **journeyService THIẾU getAllJourneys()**
```
Hiện tại: CHỈ CÓ createJourney() và getJourneyById()
Cần: getAllJourneys(params) để fetch danh sách

Backend cần thêm:
GET /api/journeys?userId=&vehicleId=&status=&page=0&entry=10
```

### 2. **Không có endpoint lịch sử carbon credit transactions**
```
carbonCreditService CHỈ CÓ CRUD carbon_credit record
KHÔNG CÓ history/transactions của carbon credit

Cần:
GET /api/carbon-credit/user/:userId/transactions
Response: [{ type, amount, date, description, referenceId }]
```

### 3. **verificationService chưa được sử dụng**
```
Đã tạo verificationService nhưng chưa integrate vào UI
Journey verification status cần sync với verify_requests table

Flow:
1. User upload journey → Create verification request
2. CVA approve/reject → Update journey status
3. Approved → Issue carbon credits
```

---

## 📊 MIGRATION PLAN

### Phase 1: Core APIs (NGAY LẬP TỨC)
1. ✅ Market (listings) - `marketService`
2. ✅ Wallet - `walletService`, `carbonCreditService`
3. ⚠️ Journey - **CẦN BỔ SUNG getAllJourneys()**
4. ✅ Transactions - `transactionService`

### Phase 2: Additional Features
1. Vehicle management - `vehicleService`, `vehicleTypeService`
2. Media upload - `mediaService`
3. Verification flow - `verificationService` + journey integration

### Phase 3: Statistics & Charts
1. Dashboard statistics - Aggregate from real APIs
2. Reports - Calculate client-side from real data
3. AI features - Client-side calculation or wait for backend

---

## 🔧 HƯỚNG DẪN IMPLEMENTATION

### Bước 1: Bổ sung journeyService
```javascript
// File: src/services/journey/journeyService.js

/**
 * Get all journeys with filters
 */
getAllJourneys: async (params = {}) => {
  try {
    const {
      userId,
      vehicleId,
      status,
      page = 0,
      entry = 10,
      field = 'id',
      sort = 'DESC',
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      entry: entry.toString(),
      field,
      sort,
    });

    if (userId) queryParams.append('userId', userId);
    if (vehicleId) queryParams.append('vehicleId', vehicleId);
    if (status) queryParams.append('status', status);

    const response = await apiClient.get(`/journeys?${queryParams.toString()}`, {
      headers: { 'accept': '*/*' },
    });

    return response;
  } catch (error) {
    console.error('Error fetching journeys:', error);
    throw error;
  }
},
```

### Bước 2: Thêm hook useJourneys
```javascript
// File: src/hooks/useJourney.js

export const useJourneys = (params = {}) => {
  return useQuery({
    queryKey: ['journeys', params],
    queryFn: () => journeyService.getAllJourneys(params),
    staleTime: 60000,
    retry: 1,
  });
};
```

### Bước 3: Update Dashboard
```javascript
// File: src/features/ev-owner/pages/Dashboard.jsx

// Thay vì useDashboardStats() mock:
const { user } = useAuth();

// Real APIs
const { data: walletData } = useMyWallet();
const { data: carbonCreditData } = useMyCarbonCredit();
const { data: journeysData } = useJourneys({ 
  userId: user.id,
  status: 'APPROVED' 
});
const { data: transactionsData } = useTransactions({ 
  sellerId: user.id,
  page: 0,
  entry: 10
});

// Calculate statistics client-side
const totalDistance = journeysData?.reduce((sum, j) => sum + j.newDistance, 0) || 0;
const totalCO2Saved = totalDistance * 0.15 / 1000; // Tính từ distance
const availableCredits = carbonCreditData?.totalCredit || 0;
const totalRevenue = transactionsData?.filter(t => t.status === 'SUCCESS')
  .reduce((sum, t) => sum + t.amount, 0) || 0;
```

### Bước 4: Update CarbonWallet
```javascript
// File: src/features/ev-owner/pages/CarbonWallet.jsx

const { data: wallet } = useMyWallet();
const { data: carbonCredit } = useMyCarbonCredit();

// Lịch sử: Kết hợp từ journeys (earned) và transactions (sold)
const { data: journeys } = useJourneys({ userId: user.id, status: 'APPROVED' });
const { data: transactions } = useTransactions({ sellerId: user.id });

// Format lịch sử
const earnedHistory = journeys?.map(j => ({
  type: 'earned',
  amount: j.carbonCredit, // Hoặc tính từ distance
  date: j.createdAt,
  description: `Kiếm từ hành trình ${j.newDistance} km`
})) || [];

const soldHistory = transactions?.map(t => ({
  type: 'sold',
  amount: -t.credit,
  date: t.createdAt,
  description: `Bán ${t.credit} tín chỉ`
})) || [];

const combinedHistory = [...earnedHistory, ...soldHistory]
  .sort((a, b) => new Date(b.date) - new Date(a.date));
```

### Bước 5: Update ListingsManagement
```javascript
// File: src/features/ev-owner/pages/ListingsManagement.jsx

// Thay vì useListings() từ evOwnerService:
const { data: listingsData } = useListings({ 
  sellerId: user.id,
  page: 0,
  entry: 10 
}); // marketService

const { mutate: createListing } = useCreateListing(); // marketService
const { mutate: updateStatus } = useUpdateListingStatus(); // marketService
```

### Bước 6: Update TransactionHistory
```javascript
// File: src/features/ev-owner/pages/TransactionHistory.jsx

const { data: transactions } = useTransactions({ 
  sellerId: user.id 
}); // transactionService

const { mutate: updateStatus } = useUpdateTransactionStatus();

const handleCancel = (id) => {
  updateStatus({ transactionId: id, status: 'CANCELED' });
};

const handleComplete = (id) => {
  updateStatus({ transactionId: id, status: 'SUCCESS' });
};
```

---

## ✅ CHECKLIST

### Backend Requirements
- [ ] **URGENT:** Thêm GET /api/journeys với filters
- [ ] **OPTIONAL:** GET /api/carbon-credit/user/:userId/transactions
- [ ] Verify tất cả endpoints đã hoạt động đúng

### Frontend Implementation
- [ ] Bổ sung `getAllJourneys()` vào journeyService
- [ ] Thêm `useJourneys()` hook
- [ ] Update Dashboard để dùng real APIs
- [ ] Update CarbonWallet để dùng real APIs
- [ ] Update UploadTrips để dùng real APIs
- [ ] Update ListingsManagement để dùng real APIs
- [ ] Update TransactionHistory để dùng real APIs
- [ ] Test integration end-to-end
- [ ] Remove mock evOwnerService methods

---

## 🎯 KẾT LUẬN

**Điểm mạnh:**
- ✅ Đã có 10/10 services với real API endpoints
- ✅ Cấu trúc services và hooks rõ ràng, dễ maintenance
- ✅ Hầu hết các API chính đã có (wallet, market, transaction, vehicle)

**Điểm yếu:**
- ⚠️ `journeyService` thiếu `getAllJourneys()` - **CRITICAL**
- ⚠️ Không có endpoint lịch sử carbon credit transactions
- ⚠️ `verificationService` chưa được integrate vào flow

**Ưu tiên:**
1. **HIGH:** Bổ sung `getAllJourneys()` cho journeyService (backend + frontend)
2. **MEDIUM:** Integrate verificationService vào journey upload flow
3. **LOW:** Carbon credit transactions history (có thể tính từ journeys + transactions)

**Thời gian ước tính:**
- Backend: 2-4 hours (thêm GET /journeys endpoint)
- Frontend: 4-6 hours (update tất cả components)
- Testing: 2-3 hours
- **TOTAL:** 1-1.5 ngày làm việc
