# Carbon Credit Marketplace - Frontend Microservice

Nền tảng giao dịch tín chỉ carbon cho chủ sở hữu xe điện - Frontend Service

## 🏗️ Cấu trúc dự án

```
carbon-frontend/
├── src/
│   ├── features/              # Feature modules theo từng actor
│   │   ├── ev-owner/          # Chức năng cho EV Owner
│   │   │   ├── components/    # Components riêng cho EV Owner
│   │   │   ├── pages/         # Pages của EV Owner
│   │   │   ├── services/      # API services cho EV Owner
│   │   │   └── hooks/         # Custom hooks cho EV Owner
│   │   ├── buyer/             # Chức năng cho Buyer
│   │   ├── verifier/          # Chức năng cho Verifier
│   │   └── admin/             # Chức năng cho Admin
│   ├── components/            # Shared components
│   │   ├── common/           # Common components (Button, Input, etc.)
│   │   └── layout/           # Layout components (Header, Sidebar, etc.)
│   ├── pages/                # Public pages
│   ├── services/             # API services
│   │   ├── api/             # API client configuration
│   │   └── auth/            # Authentication services
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── context/             # React Context providers
│   ├── routes/              # Route configuration
│   ├── types/               # TypeScript types (nếu dùng TS)
│   ├── constants/           # Constants
│   └── config/              # Configuration files
├── public/                  # Static assets
├── Dockerfile               # Docker build file
├── docker-compose.yml       # Docker Compose configuration
├── nginx.conf              # Nginx configuration
└── package.json
```

## 👥 Actors và Chức năng

### 1. EV Owner (Chủ sở hữu xe điện)
- Kết nối và đồng bộ dữ liệu hành trình từ xe điện
- Tính toán lượng CO₂ giảm phát thải và quy đổi sang tín chỉ carbon
- Quản lý ví carbon (theo dõi số dư tín chỉ)
- Niêm yết tín chỉ carbon để bán (fixed price / auction)
- Quản lý giao dịch: theo dõi, hủy, hoặc hoàn tất
- Thanh toán & rút tiền sau khi bán tín chỉ
- Xem báo cáo cá nhân
- AI gợi ý giá bán tín chỉ

### 2. Buyer (Người mua tín chỉ carbon)
- Tìm kiếm & lọc tín chỉ theo số lượng, giá, khu vực
- Mua tín chỉ trực tiếp hoặc tham gia đấu giá
- Thanh toán online (e-wallet, banking, ...)
- Nhận chứng nhận tín chỉ (certificate)
- Quản lý lịch sử mua tín chỉ

### 3. Verifier (Tổ chức kiểm toán và xác minh carbon)
- Kiểm tra dữ liệu phát thải & hồ sơ tín chỉ
- Duyệt hoặc từ chối yêu cầu phát hành tín chỉ carbon
- Cấp tín chỉ và ghi vào ví carbon
- Xuất báo cáo phát hành tín chỉ carbon

### 4. Admin (Quản trị)
- Quản lý người dùng (EV owners, buyers, verifiers)
- Quản lý giao dịch: theo dõi, xác nhận, xử lý tranh chấp
- Quản lý ví điện tử và dòng tiền
- Quản lý niêm yết tín chỉ & giao dịch
- Tạo báo cáo tổng hợp giao dịch tín chỉ carbon

## 🚀 Cài đặt và Chạy

### Development

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### Production với Docker

```bash
# Build Docker image
npm run docker:build

# Chạy với Docker Compose
npm run docker:run

# Hoặc sử dụng docker-compose trực tiếp
docker-compose up -d
```

## 📦 Dependencies chính

- **React 19** - UI Framework
- **React Router DOM** - Routing
- **Axios** - HTTP Client
- **TanStack Query** - Data fetching & caching
- **Formik + Yup** - Form handling & validation
- **Recharts** - Charts & graphs
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Date-fns** - Date formatting

## 🔧 Environment Variables

Tạo file `.env` trong thư mục root:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Carbon Credit Marketplace
```

## 🐳 Docker

### Build image
```bash
docker build -t carbon-frontend .
```

### Run container
```bash
docker run -p 3000:80 carbon-frontend
```

### Docker Compose
```bash
docker-compose up -d
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run with Docker Compose

## 🏛️ Architecture

Dự án sử dụng kiến trúc microservice với:
- Frontend service (React) - Service này
- Backend services (sẽ được cấu hình riêng)
- Docker Compose để orchestrate các services

## 📄 License

MIT
