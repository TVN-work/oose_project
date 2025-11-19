# Hướng dẫn Nhanh: Kết nối với Backend API

## Bước 1: Tạo file .env

Tạo file `.env` trong thư mục `carbon-frontend`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_DEV_MODE=false
```

**Lưu ý:** Thay `http://localhost:8000/api` bằng URL thật của backend.

## Bước 2: Đảm bảo Backend đang chạy

Backend API cần implement các endpoints theo format trong file `API_INTEGRATION.md`.

## Bước 3: Cập nhật Components

Thay thế mock data bằng hooks từ `useEvOwner`:

```jsx
// Trước (mock data)
const stats = [
  { value: '245', label: 'Tín chỉ có sẵn' },
  // ...
];

// Sau (API data)
import { useDashboardStats } from '../../../hooks/useEvOwner';

const Dashboard = () => {
  const { data, isLoading, error } = useDashboardStats();
  
  if (isLoading) return <Loading />;
  if (error) return <div>Error</div>;
  
  // Sử dụng data từ API
  const stats = data.stats;
  // ...
};
```

## Bước 4: Restart Dev Server

```bash
npm run dev
```

## Các Hooks có sẵn

- `useDashboardStats()` - Thống kê dashboard
- `useTrips()` - Danh sách hành trình
- `useUploadTrip()` - Tải hành trình mới
- `useCarbonWallet()` - Thông tin ví carbon
- `useListings()` - Danh sách niêm yết
- `useCreateListing()` - Tạo niêm yết
- `useTransactions()` - Danh sách giao dịch
- `useReports()` - Báo cáo
- `usePriceSuggestion()` - Gợi ý giá từ AI

Xem file `src/hooks/useEvOwner.js` để biết chi tiết.

## Troubleshooting

1. **Lỗi CORS:** Cấu hình CORS trên backend để cho phép frontend
2. **401 Unauthorized:** Kiểm tra JWT token trong localStorage
3. **Network Error:** Kiểm tra `VITE_API_URL` và đảm bảo backend đang chạy

Xem `API_INTEGRATION.md` để biết chi tiết về API format.

