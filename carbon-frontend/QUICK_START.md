# Quick Start Guide - EV Owner Dashboard

## Cách chạy và test

### 1. Cài đặt dependencies
```bash
cd carbon-frontend
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

### 3. Test với Mock Authentication

Mở browser console và chạy:
```javascript
// Login as EV Owner
mockEVOwnerAuth()

// Hoặc login as Buyer
mockBuyerAuth()

// Logout
clearMockAuth()
```

### 4. Truy cập các trang

Sau khi login với `mockEVOwnerAuth()`, bạn có thể truy cập:

- **Dashboard**: http://localhost:5173/ev-owner/dashboard
- **Upload Trips**: http://localhost:5173/ev-owner/upload-trips
- **Carbon Wallet**: http://localhost:5173/ev-owner/carbon-wallet
- **Listings**: http://localhost:5173/ev-owner/listings
- **Transactions**: http://localhost:5173/ev-owner/transactions
- **Reports**: http://localhost:5173/ev-owner/reports
- **Settings**: http://localhost:5173/ev-owner/settings

## Cấu trúc đã tạo

### ✅ Common Components
- `Button` - Button với variants
- `Card` - Card container với shadow
- `Badge` - Badge component
- `Modal` - Modal dialog
- `Loading` - Loading spinner
- `StatCard` - Stat card với icon

### ✅ Layout Components
- `Sidebar` - Sidebar navigation với Quick Actions và Stats Summary
- `Header` - Header với notifications và user menu
- `MainLayout` - Layout wrapper cho protected routes

### ✅ EV Owner Pages
- `Dashboard` - Dashboard với welcome card, stats và recent activity
- `UploadTrips` - Placeholder (đang phát triển)
- `CarbonWallet` - Placeholder (đang phát triển)
- `ListCredits` - Placeholder (đang phát triển)
- `Transactions` - Placeholder (đang phát triển)
- `Reports` - Placeholder (đang phát triển)
- `Settings` - Placeholder (đang phát triển)

## Thiết kế

Tất cả components và pages được thiết kế dựa trên file `EV_Owner.html` với:
- ✅ Sidebar với gradient green
- ✅ Quick Actions section
- ✅ Stats Summary
- ✅ Header với gradient background
- ✅ Animations (fade-in, slide-in)
- ✅ Custom scrollbar
- ✅ Responsive design

## Bước tiếp theo

1. Hoàn thiện các pages còn lại (UploadTrips, CarbonWallet, etc.)
2. Tạo các components riêng cho EV Owner (UploadArea, TripSummary)
3. Tích hợp API calls với backend
4. Thêm form validation
5. Thêm error handling

