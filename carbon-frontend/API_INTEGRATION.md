# Hướng dẫn Kết nối với Backend API

## 1. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `carbon-frontend` với nội dung:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Development Mode (đặt false khi có backend thật)
VITE_DEV_MODE=false
```

**Lưu ý:** 
- Thay `http://localhost:8000/api` bằng URL thật của backend API
- Đặt `VITE_DEV_MODE=false` để tắt chế độ mock data

## 2. Cấu trúc API Endpoints

Backend API cần implement các endpoints sau:

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/profile` - Lấy thông tin user
- `POST /api/auth/refresh` - Refresh token

### EV Owner Endpoints

#### Trips
- `GET /api/ev-owner/trips` - Lấy danh sách hành trình
- `POST /api/ev-owner/trips` - Tải dữ liệu hành trình mới
- `GET /api/ev-owner/trips/:id` - Lấy chi tiết hành trình

#### Carbon Wallet
- `GET /api/ev-owner/carbon-wallet` - Lấy thông tin ví carbon
- `GET /api/ev-owner/carbon-wallet/transactions` - Lấy lịch sử giao dịch ví

#### Listings
- `GET /api/ev-owner/listings` - Lấy danh sách niêm yết
- `POST /api/ev-owner/listings` - Tạo niêm yết mới
- `PUT /api/ev-owner/listings/:id` - Cập nhật niêm yết
- `DELETE /api/ev-owner/listings/:id` - Xóa niêm yết
- `POST /api/ev-owner/ai-price-suggestion` - Gợi ý giá từ AI

#### Transactions
- `GET /api/ev-owner/transactions` - Lấy danh sách giao dịch
- `GET /api/ev-owner/transactions/:id` - Lấy chi tiết giao dịch
- `POST /api/ev-owner/transactions/:id/cancel` - Hủy giao dịch

#### Reports
- `GET /api/ev-owner/reports` - Lấy báo cáo
- `GET /api/ev-owner/reports/dashboard` - Lấy thống kê dashboard
- `GET /api/ev-owner/reports/export/:format` - Xuất báo cáo (CSV/PDF)

#### Withdraw
- `POST /api/ev-owner/withdraw` - Rút tiền

## 3. Format Response từ Backend

### Dashboard Stats Response
```json
{
  "stats": {
    "availableCredits": 245,
    "totalRevenue": 8750,
    "totalDistance": 12450,
    "totalCo2Saved": 18.1
  },
  "trends": {
    "creditsChange": 12.3,
    "revenueChange": 15.2,
    "distanceChange": 8.9,
    "co2Change": 12.3
  },
  "charts": {
    "weeklyRevenue": [
      { "day": "T2", "value": 120 },
      ...
    ],
    "co2Trend": [
      { "month": "T7", "value": 2.2 },
      ...
    ],
    "revenueTrend": [
      { "month": "T7", "value": 520 },
      ...
    ],
    "creditDistribution": [
      { "name": "Đã bán", "value": 189 },
      { "name": "Đang niêm yết", "value": 45 },
      { "name": "Có sẵn", "value": 11 }
    ]
  },
  "recentActivities": [
    {
      "icon": "📤",
      "title": "Tải dữ liệu hành trình thành công",
      "description": "125 km • Tạo 15 tín chỉ carbon",
      "time": "2 giờ trước",
      "value": "+15 tín chỉ",
      "type": "upload"
    },
    ...
  ]
}
```

### Carbon Wallet Response
```json
{
  "balance": 245.5,
  "available": 245.5,
  "pending": 0,
  "locked": 0,
  "totalEarned": 189.2,
  "totalSold": 189.2,
  "statistics": {
    "totalCredits": 245.5,
    "soldCredits": 189.2,
    "pendingCredits": 0,
    "availableCredits": 245.5
  },
  "transactions": [
    {
      "id": "1",
      "type": "earned",
      "amount": 15.5,
      "description": "Từ hành trình #123",
      "date": "2024-01-15T10:30:00Z",
      "status": "completed"
    },
    ...
  ]
}
```

### Listing Response
```json
{
  "id": "1",
  "vehicleType": "car",
  "creditAmount": 0.052,
  "marketType": "voluntary",
  "listingPrice": 5.5,
  "description": "Carbon credits from EV trips",
  "status": "approved",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## 4. Authentication

Backend cần trả về JWT token khi login:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "EV Owner",
    "email": "evowner@example.com",
    "role": "EV_OWNER"
  }
}
```

Token sẽ được lưu trong `localStorage` với key `authToken` và tự động thêm vào header `Authorization: Bearer <token>` cho mọi request.

## 5. Sử dụng trong Components

### Ví dụ: Dashboard Component

```jsx
import { useDashboardStats } from '../../hooks/useEvOwner';
import Loading from '../../components/common/Loading';

const Dashboard = () => {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading data</div>;

  const { stats, trends, charts, recentActivities } = data;

  return (
    <div>
      {/* Sử dụng data từ API */}
      <div>{stats.availableCredits}</div>
      {/* ... */}
    </div>
  );
};
```

### Ví dụ: Upload Trip

```jsx
import { useUploadTrip } from '../../hooks/useEvOwner';

const UploadTrips = () => {
  const uploadMutation = useUploadTrip();

  const handleSubmit = async (tripData) => {
    await uploadMutation.mutateAsync(tripData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

## 6. Tắt Development Mode

Trong file `src/context/AuthContext.jsx`, chế độ DEV_MODE sẽ tự động tắt khi:
- `VITE_DEV_MODE=false` trong file `.env`
- Hoặc khi `import.meta.env.DEV` là `false` (production build)

Khi tắt DEV_MODE:
- Không còn tự động login với mock user
- Tất cả API calls sẽ gọi đến backend thật
- Lỗi API sẽ được xử lý đúng cách

## 7. Error Handling

API client đã được cấu hình để:
- Tự động thêm JWT token vào header
- Xử lý lỗi 401 (unauthorized) - tự động logout và redirect về login
- Xử lý network errors trong development mode

## 8. Testing

1. Đảm bảo backend API đang chạy
2. Cập nhật `VITE_API_URL` trong `.env`
3. Đặt `VITE_DEV_MODE=false`
4. Restart dev server: `npm run dev`
5. Test các chức năng với dữ liệu thật

## 9. CORS Configuration

Backend cần cấu hình CORS để cho phép frontend gọi API:

```javascript
// Example for Express.js
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
```

