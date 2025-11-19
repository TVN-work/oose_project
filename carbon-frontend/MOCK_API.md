# Mock API Documentation

Hệ thống Mock API được tạo để phát triển frontend mà không cần backend thật.

## Cách hoạt động

Mock API tự động được kích hoạt khi:
- `VITE_DEV_MODE=true` trong file `.env`
- Hoặc `VITE_USE_MOCK=true` trong file `.env`
- Hoặc khi đang ở development mode (`import.meta.env.DEV`) và backend không có sẵn

## Cấu hình

Tạo file `.env` trong thư mục `carbon-frontend`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_DEV_MODE=true
VITE_USE_MOCK=true
```

## Mock Data

### Authentication
- **Login**: Tự động detect role dựa trên email hoặc path
- **Profile**: Trả về user phù hợp với route hiện tại
- **Token**: Tạo mock token tự động

### EV Owner Data
- Dashboard stats với charts data
- Carbon wallet với balance và transactions
- Listings với các trạng thái khác nhau
- Transactions history
- Reports với CO2 và revenue data

### Buyer Data
- Marketplace credits với nhiều loại (buy-now, auction, negotiate)
- Certificates với download PDF
- Purchase history
- Dashboard stats

## Delay Simulation

Tất cả mock API calls có delay để mô phỏng network latency:
- GET requests: 400-600ms
- POST requests: 800-1200ms
- Export/Download: 1000ms

## Sử dụng trong Components

### EV Owner
```jsx
import { useDashboardStats } from '../../hooks/useEvOwner';

const Dashboard = () => {
  const { data, isLoading } = useDashboardStats();
  // data sẽ chứa mock data nếu backend không có
};
```

### Buyer
```jsx
import { useBuyerDashboardStats } from '../../hooks/useBuyer';

const Dashboard = () => {
  const { data, isLoading } = useBuyerDashboardStats();
  // data sẽ chứa mock data nếu backend không có
};
```

## Tắt Mock API

Để sử dụng backend thật:
1. Đặt `VITE_DEV_MODE=false` trong `.env`
2. Đảm bảo backend đang chạy tại `VITE_API_URL`
3. Mock API sẽ tự động fallback về real API

## Customize Mock Data

Chỉnh sửa mock data trong:
- `src/services/mock/mockData.js` - Tất cả mock data
- `src/services/mock/mockAuthService.js` - Auth mock
- `src/services/mock/mockEvOwnerService.js` - EV Owner mock
- `src/services/mock/mockBuyerService.js` - Buyer mock

## Lưu ý

- Mock API chỉ hoạt động trong development mode
- Trong production, sẽ luôn sử dụng real API
- Mock data được lưu trong memory, không persist qua page reload (trừ auth token)

