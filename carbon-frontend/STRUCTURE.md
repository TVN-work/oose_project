# Cấu trúc thư mục Carbon Frontend

## Tổng quan

Dự án được tổ chức theo kiến trúc Feature-based với các module riêng biệt cho từng actor trong hệ thống.

## Cấu trúc chi tiết

```
carbon-frontend/
│
├── src/
│   ├── features/                    # Modules theo từng actor
│   │   ├── ev-owner/                # Module cho EV Owner
│   │   │   ├── components/          # Components riêng của EV Owner
│   │   │   ├── pages/               # Pages: Dashboard, CarbonWallet, Listings, etc.
│   │   │   ├── services/            # API services cho EV Owner
│   │   │   └── hooks/               # Custom hooks cho EV Owner
│   │   │
│   │   ├── buyer/                   # Module cho Buyer
│   │   │   ├── components/
│   │   │   ├── pages/               # Pages: Marketplace, PurchaseHistory, Certificates
│   │   │   ├── services/
│   │   │   └── hooks/
│   │   │
│   │   ├── verifier/                # Module cho Verifier
│   │   │   ├── components/
│   │   │   ├── pages/               # Pages: VerificationRequests, Reports
│   │   │   ├── services/
│   │   │   └── hooks/
│   │   │
│   │   └── admin/                   # Module cho Admin
│   │       ├── components/
│   │       ├── pages/               # Pages: UserManagement, TransactionManagement, Reports
│   │       ├── services/
│   │       └── hooks/
│   │
│   ├── components/                  # Shared components
│   │   ├── common/                  # Common UI components (Button, Input, Card, Modal, etc.)
│   │   └── layout/                  # Layout components (Header, Sidebar, Footer, etc.)
│   │
│   ├── pages/                       # Public pages (Home, Login, Register, etc.)
│   │
│   ├── services/                    # API services
│   │   ├── api/                     # API client configuration
│   │   │   └── client.js            # Axios instance với interceptors
│   │   └── auth/                    # Authentication services
│   │       └── authService.js       # Login, Register, Logout, etc.
│   │
│   ├── hooks/                       # Custom React hooks (shared)
│   │
│   ├── utils/                       # Utility functions
│   │   └── index.js                 # formatCurrency, formatDate, debounce, etc.
│   │
│   ├── context/                     # React Context providers
│   │   └── AuthContext.jsx          # Authentication context
│   │
│   ├── routes/                      # Route configuration
│   │   ├── index.jsx                # Router configuration với protected routes
│   │   └── ProtectedRoute.jsx       # HOC cho protected routes
│   │
│   ├── config/                      # Configuration files
│   │   └── api.js                   # API endpoints và base URL
│   │
│   ├── constants/                   # Constants
│   │   └── roles.js                 # User roles và labels
│   │
│   ├── types/                       # TypeScript types (nếu sử dụng TS)
│   │
│   └── assets/                      # Static assets (images, icons, etc.)
│
├── public/                          # Public static files
│
├── Dockerfile                       # Docker build configuration
├── docker-compose.yml               # Docker Compose configuration
├── nginx.conf                       # Nginx configuration cho production
├── package.json                     # Dependencies và scripts
└── README.md                        # Documentation
```

## Quy tắc tổ chức code

### 1. Features (Actor-based modules)
Mỗi actor có module riêng trong `src/features/`:
- **components/**: Components chỉ dùng trong module đó
- **pages/**: Các trang của module
- **services/**: API calls riêng của module
- **hooks/**: Custom hooks riêng của module

### 2. Shared Components
- **components/common/**: Components có thể tái sử dụng (Button, Input, Card, etc.)
- **components/layout/**: Layout components (Header, Sidebar, Footer)

### 3. Services
- **services/api/client.js**: Axios instance với interceptors
- **services/auth/**: Authentication services
- Mỗi feature có thể có services riêng trong `features/[actor]/services/`

### 4. Routing
- Routes được định nghĩa trong `src/routes/index.jsx`
- Protected routes sử dụng `ProtectedRoute` component
- Routes được phân chia theo actor

### 5. State Management
- **Context API**: Cho global state (Auth, Theme, etc.)
- **React Query**: Cho server state (data fetching, caching)
- **Local State**: useState, useReducer cho component state

## Ví dụ sử dụng

### Tạo component trong feature
```jsx
// src/features/ev-owner/components/CarbonWalletCard.jsx
export const CarbonWalletCard = () => {
  // Component code
}
```

### Tạo page trong feature
```jsx
// src/features/ev-owner/pages/CarbonWallet.jsx
import { CarbonWalletCard } from '../components/CarbonWalletCard';

export const CarbonWallet = () => {
  return <CarbonWalletCard />;
}
```

### Tạo service trong feature
```jsx
// src/features/ev-owner/services/carbonWalletService.js
import apiClient from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../config/api';

export const carbonWalletService = {
  getBalance: () => apiClient.get(API_ENDPOINTS.EV_OWNER.CARBON_WALLET),
  // ...
};
```

### Sử dụng trong component
```jsx
import { useQuery } from '@tanstack/react-query';
import { carbonWalletService } from '../services/carbonWalletService';

const MyComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['carbonWallet'],
    queryFn: carbonWalletService.getBalance,
  });
  // ...
};
```

## Docker

### Development
```bash
npm run dev
```

### Production với Docker
```bash
docker-compose up -d
```

Frontend service sẽ chạy trên port 3000 và proxy API requests đến backend service.

