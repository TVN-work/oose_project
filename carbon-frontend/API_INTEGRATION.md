# Hướng dẫn Kết nối với Backend API

## 1. Kiến trúc Backend

Hệ thống backend sử dụng **Microservices Architecture** với Spring Boot và Spring Cloud:

### 1.1. API Gateway (Spring Cloud Gateway)
- **Base URL**: `http://localhost:8080/api/v1` (hoặc production URL)
- Tất cả requests từ frontend đều đi qua API Gateway
- Gateway thực hiện:
  - **Routing**: Định tuyến request đến đúng microservice
  - **Authentication & Authorization**: Kiểm tra JWT token
  - **Rate Limiting**: Giới hạn số lượng requests
  - **Load Balancing**: Phân phối tải qua Eureka
  - **Logging & Monitoring**: Ghi log và giám sát

### 1.2. Service Discovery (Netflix Eureka)
- Các microservices tự động đăng ký với Eureka Server
- Gateway và services khác tìm service đích qua Eureka
- Không cần biết IP/Port cố định của services

### 1.3. Các Microservices

| Service | Chức năng | Endpoints Prefix |
|---------|-----------|------------------|
| **User Service** | Quản lý người dùng, authentication | `/users/*` |
| **Vehicle Service** | Quản lý xe điện, dữ liệu hành trình | `/vehicles/*` |
| **Carbon Calculation Service** | Tính toán CO₂ và quy đổi tín chỉ | `/carbon/*` |
| **Verification Service** | CVA: xác minh và phát hành tín chỉ | `/verification/*` |
| **Market Service** | Niêm yết, bán, đấu giá tín chỉ | `/market/*` |
| **Transaction Service** | Quản lý giao dịch | `/transactions/*` |
| **Wallet Service** | Quản lý ví carbon và thanh toán | `/wallets/*` |
| **Certificate Service** | Tạo và quản lý chứng nhận | `/certificates/*` |
| **Media Service** | Lưu trữ file, ảnh, tài liệu | `/media/*` |
| **Admin Service** | Quản trị hệ thống | `/admin/*` |

### 1.4. Giao tiếp Bất đồng bộ (Apache Kafka)

Các events quan trọng được phát hành qua Kafka:
- `trip.synced`: Vehicle Service → Carbon Calculation Service
- `credit.calculated`: Carbon Calculation Service → Verification Service
- `credit.issued`: Verification Service → Wallet Service
- `transaction.completed`: Transaction Service → Notification Service

## 2. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `carbon-frontend`:

```env
# API Gateway URL (tất cả requests đi qua Gateway)
VITE_API_URL=http://localhost:8080/api/v1

# Development Mode (đặt false khi có backend thật)
VITE_DEV_MODE=false

# WebSocket URL (nếu có real-time updates)
VITE_WS_URL=ws://localhost:8080/ws
```

**Lưu ý:** 
- Thay `http://localhost:8080/api/v1` bằng URL thật của API Gateway
- Đặt `VITE_DEV_MODE=false` để tắt chế độ mock data
- Port 8080 là port mặc định của Spring Cloud Gateway

## 3. Authentication Flow

### 3.1. Login Flow
```
Frontend → API Gateway → User Service
Response: JWT Token + User Info
```

### 3.2. JWT Token Structure
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "expiresIn": 3600,
  "user": {
    "id": "1",
    "name": "EV Owner",
    "email": "evowner@example.com",
    "role": "EV_OWNER"
  }
}
```

### 3.3. Token Storage
- JWT token được lưu trong `localStorage` với key `authToken`
- Refresh token được lưu với key `refreshToken`
- Token tự động được thêm vào header: `Authorization: Bearer <token>`

### 3.4. Token Refresh
- Khi token hết hạn (401), frontend tự động gọi `/users/auth/refresh`
- Nếu refresh thành công, tiếp tục request
- Nếu refresh thất bại, redirect về login

## 4. API Endpoints Structure

Tất cả endpoints đi qua API Gateway với format: `/api/v1/{service}/{resource}`

### 4.1. User Service (`/users/*`)

#### Authentication
- `POST /api/v1/users/auth/login` - Đăng nhập
- `POST /api/v1/users/auth/register` - Đăng ký
- `POST /api/v1/users/auth/logout` - Đăng xuất
- `POST /api/v1/users/auth/refresh` - Refresh token
- `GET /api/v1/users/profile` - Lấy thông tin user
- `PUT /api/v1/users/profile` - Cập nhật thông tin
- `POST /api/v1/users/profile/password` - Đổi mật khẩu

### 4.2. Vehicle Service (`/vehicles/*`)

#### Trip Management
- `GET /api/v1/vehicles/trips` - Lấy danh sách hành trình
- `POST /api/v1/vehicles/trips/upload` - Tải dữ liệu hành trình (Use Case 1)
- `GET /api/v1/vehicles/trips/:id` - Lấy chi tiết hành trình
- `PUT /api/v1/vehicles/trips/:id` - Cập nhật hành trình
- `DELETE /api/v1/vehicles/trips/:id` - Xóa hành trình

#### Vehicle Info
- `GET /api/v1/vehicles/info` - Lấy thông tin xe điện
- `PUT /api/v1/vehicles/info` - Cập nhật thông tin xe

### 4.3. Carbon Calculation Service (`/carbon/*`)

#### CO₂ Calculation
- `POST /api/v1/carbon/calculate` - Tính toán CO₂ và quy đổi tín chỉ (Use Case 2)
- `GET /api/v1/carbon/calculate/:id/status` - Kiểm tra trạng thái tính toán
- `GET /api/v1/carbon/calculate/:id/result` - Lấy kết quả tính toán

**Flow:**
1. Upload trip data → Vehicle Service
2. Trigger calculation → Carbon Calculation Service
3. Calculation Service lấy data từ Vehicle Service
4. Tính toán CO₂ và số tín chỉ
5. Gửi yêu cầu xác minh đến Verification Service (Kafka: `credit.calculated`)

### 4.4. Wallet Service (`/wallets/*`)

#### Carbon Wallet
- `GET /api/v1/wallets/carbon` - Lấy thông tin ví carbon (Use Case 3)
- `GET /api/v1/wallets/carbon/transactions` - Lịch sử giao dịch ví carbon

#### Payment Wallet
- `GET /api/v1/wallets/payment` - Lấy thông tin ví thanh toán
- `GET /api/v1/wallets/payment/transactions` - Lịch sử giao dịch thanh toán
- `POST /api/v1/wallets/withdraw` - Rút tiền (Use Case 6)
- `POST /api/v1/wallets/deposit` - Nạp tiền

**Flow khi CVA cấp tín chỉ:**
- Verification Service → Wallet Service (Kafka: `credit.issued`)
- Wallet Service ghi tín chỉ vào ví carbon của EV Owner

### 4.5. Market Service (`/market/*`)

#### Listings (EV Owner)
- `GET /api/v1/market/listings` - Lấy danh sách niêm yết (Use Case 4)
- `POST /api/v1/market/listings` - Tạo niêm yết mới
- `PUT /api/v1/market/listings/:id` - Cập nhật niêm yết
- `DELETE /api/v1/market/listings/:id` - Xóa niêm yết
- `POST /api/v1/market/listings/ai-price-suggestion` - AI gợi ý giá (Use Case 8)

#### Marketplace (Buyer)
- `GET /api/v1/market/marketplace` - Tìm kiếm và lọc tín chỉ (Use Case 9)
- `GET /api/v1/market/marketplace/:id` - Chi tiết listing
- `POST /api/v1/market/marketplace/search` - Tìm kiếm nâng cao

#### Auction
- `GET /api/v1/market/auctions/:id` - Thông tin đấu giá (Use Case 11)
- `POST /api/v1/market/auctions/:id/bid` - Đặt giá
- `GET /api/v1/market/auctions/:id/status` - Trạng thái đấu giá

### 4.6. Transaction Service (`/transactions/*`)

#### EV Owner Transactions
- `GET /api/v1/transactions/ev-owner` - Danh sách giao dịch (Use Case 5)
- `GET /api/v1/transactions/:id` - Chi tiết giao dịch
- `POST /api/v1/transactions/:id/cancel` - Hủy giao dịch
- `POST /api/v1/transactions/:id/complete` - Hoàn tất giao dịch

#### Buyer Transactions
- `GET /api/v1/transactions/buyer` - Lịch sử mua (Use Case 14)
- `POST /api/v1/transactions/purchase` - Mua trực tiếp (Use Case 10)

#### Payment
- `POST /api/v1/transactions/:id/payment` - Thanh toán online (Use Case 12)
- `GET /api/v1/transactions/payment-methods` - Phương thức thanh toán

**Flow:**
- Mua trực tiếp → Tạo transaction → Thanh toán (include)
- Tham gia đấu giá → Nếu thắng → Thanh toán (include)

### 4.7. Verification Service (`/verification/*`)

#### Verification Requests
- `GET /api/v1/verification/requests` - Danh sách yêu cầu xác minh (Use Case 15, 16)
- `GET /api/v1/verification/requests/:id` - Chi tiết yêu cầu
- `POST /api/v1/verification/ev-data/:id` - Xác thực dữ liệu xe điện (Use Case 15)
- `POST /api/v1/verification/emission/:id` - Kiểm tra dữ liệu phát thải (Use Case 16)

#### Approval & Issuance
- `POST /api/v1/verification/requests/:id/approve` - Duyệt yêu cầu (Use Case 17)
- `POST /api/v1/verification/requests/:id/reject` - Từ chối yêu cầu
- `POST /api/v1/verification/issue-credits` - Cấp tín chỉ và ghi vào ví (Use Case 18)

#### Reports
- `GET /api/v1/verification/reports` - Báo cáo phát hành tín chỉ

### 4.8. Certificate Service (`/certificates/*`)

#### Certificates
- `GET /api/v1/certificates` - Danh sách chứng nhận (Use Case 13)
- `GET /api/v1/certificates/:id` - Chi tiết chứng nhận
- `GET /api/v1/certificates/:id/download` - Tải chứng nhận
- `POST /api/v1/certificates/generate` - Tạo chứng nhận (sau khi thanh toán thành công)

**Flow:**
- Thanh toán thành công → Transaction Service → Certificate Service
- Certificate được tạo tự động (extend từ Purchase Success)

### 4.9. Admin Service (`/admin/*`)

#### User Management
- `GET /api/v1/admin/users` - Danh sách người dùng (Use Case 19)
- `GET /api/v1/admin/users/:id` - Chi tiết người dùng
- `PUT /api/v1/admin/users/:id` - Cập nhật người dùng
- `POST /api/v1/admin/users/:id/lock` - Khóa tài khoản
- `POST /api/v1/admin/users/:id/unlock` - Mở khóa tài khoản

#### Transaction Management
- `GET /api/v1/admin/transactions` - Danh sách giao dịch (Use Case 20)
- `POST /api/v1/admin/transactions/:id/resolve` - Giải quyết tranh chấp

#### Wallet Management
- `GET /api/v1/admin/wallets` - Danh sách ví (Use Case 21)
- `GET /api/v1/admin/wallets/:id` - Chi tiết ví
- `POST /api/v1/admin/wallets/:id/freeze` - Khóa ví

#### Listing Management
- `GET /api/v1/admin/listings` - Danh sách niêm yết (Use Case 22)
- `POST /api/v1/admin/listings/:id/approve` - Duyệt niêm yết
- `POST /api/v1/admin/listings/:id/reject` - Từ chối niêm yết

#### Reports
- `GET /api/v1/admin/reports` - Báo cáo tổng hợp (Use Case 23)
- `POST /api/v1/admin/reports/generate` - Tạo báo cáo
- `GET /api/v1/admin/stats` - Thống kê hệ thống

### 4.10. Media Service (`/media/*`)

#### File Management
- `POST /api/v1/media/upload` - Upload file (ảnh, tài liệu)
- `GET /api/v1/media/:id` - Download file
- `DELETE /api/v1/media/:id` - Xóa file

## 5. Sequence Flows

### 5.1. Credit Issuance Flow (Use Case 2)

```
1. EV Owner → API Gateway → Vehicle Service
   POST /api/v1/vehicles/trips/upload
   Response: Trip data saved

2. API Gateway → Carbon Calculation Service
   POST /api/v1/carbon/calculate
   (Calculation Service lấy data từ Vehicle Service)

3. Carbon Calculation Service → Verification Service
   (Kafka: credit.calculated event)

4. CVA xác minh → Verification Service
   POST /api/v1/verification/requests/:id/approve

5. Verification Service → Wallet Service
   POST /api/v1/verification/issue-credits
   (Kafka: credit.issued event)

6. Wallet Service → API Gateway → EV Owner
   Response: Credits added to wallet
```

### 5.2. Purchase Flow (Use Case 10, 12)

```
1. Buyer → API Gateway → Market Service
   GET /api/v1/market/marketplace/:id

2. Buyer → API Gateway → Transaction Service
   POST /api/v1/transactions/purchase
   (Include: Online Payment)

3. Transaction Service → Wallet Service
   POST /api/v1/transactions/:id/payment

4. Payment Success → Certificate Service
   POST /api/v1/certificates/generate
   (Extend: Receive Certificate)
```

## 6. Request/Response Formats

### 6.1. Standard Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "timestamp": "2024-12-20T10:30:00Z"
}
```

### 6.2. Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { ... }
  },
  "timestamp": "2024-12-20T10:30:00Z"
}
```

### 6.3. Pagination Format

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "size": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 7. Error Handling

### 7.1. HTTP Status Codes

- `200 OK` - Request thành công
- `201 Created` - Tạo resource thành công
- `400 Bad Request` - Request không hợp lệ
- `401 Unauthorized` - Chưa đăng nhập hoặc token hết hạn
- `403 Forbidden` - Không có quyền truy cập
- `404 Not Found` - Resource không tồn tại
- `409 Conflict` - Conflict (ví dụ: listing đã bán)
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Lỗi server

### 7.2. Exception Cases (từ Use Cases)

#### Upload Trip Data (Use Case 1)
- File không đúng định dạng → `400 Bad Request`
- Dữ liệu thiếu hoặc sai → `422 Unprocessable Entity`

#### Calculate Carbon Credits (Use Case 2)
- CVA từ chối xác minh → `403 Forbidden` với message lý do

#### List Carbon Credit (Use Case 4)
- Số dư không đủ → `400 Bad Request` với message

#### Manage Transactions (Use Case 5)
- Giao dịch không tồn tại → `404 Not Found`
- Giao dịch đang bị khóa → `409 Conflict`
- Payment Service lỗi → `503 Service Unavailable`
- Giao dịch đã Completed → `400 Bad Request`

#### Withdraw Earnings (Use Case 6)
- Số dư không đủ → `400 Bad Request`
- Payment Gateway lỗi → `503 Service Unavailable`
- Sai thông tin tài khoản → `422 Unprocessable Entity`
- Vượt hạn mức ngày → `429 Too Many Requests`

#### Search Carbon Credits (Use Case 9)
- Không tìm thấy listing → `404 Not Found`
- Search Service timeout → `504 Gateway Timeout`

#### Direct Purchase (Use Case 10)
- Listing hết hàng → `409 Conflict`
- Listing bị Owner hủy → `410 Gone`
- Giá bị thay đổi → `409 Conflict`

#### Join Auction (Use Case 11)
- Đấu giá đã đóng → `410 Gone`
- Giá bid thấp hơn tối thiểu → `400 Bad Request`
- Buyer bị khóa → `403 Forbidden`

#### Online Payment (Use Case 12)
- Thanh toán thất bại → `402 Payment Required`
- Payment gateway lỗi → `503 Service Unavailable`
- Buyer hủy giao dịch → `410 Gone`

## 8. Real-time Updates

### 8.1. WebSocket/SSE (nếu có)

Để nhận real-time updates về:
- Trạng thái tính toán CO₂
- Kết quả xác minh từ CVA
- Tín chỉ mới được cấp
- Cập nhật đấu giá
- Thông báo giao dịch

### 8.2. Polling (Alternative)

Nếu không có WebSocket, có thể polling:
- Trạng thái tính toán: Poll `/api/v1/carbon/calculate/:id/status` mỗi 5 giây
- Trạng thái đấu giá: Poll `/api/v1/market/auctions/:id/status` mỗi 2 giây

## 9. Rate Limiting

API Gateway có rate limiting:
- **Default**: 100 requests/phút/user
- **Authentication endpoints**: 10 requests/phút/IP
- **File upload**: 5 requests/phút/user

Khi vượt quá limit, response `429 Too Many Requests` với header:
```
Retry-After: 60
```

## 10. CORS Configuration

Backend API Gateway cần cấu hình CORS:

```yaml
# Spring Cloud Gateway CORS config
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "http://localhost:5173"
            allowedMethods: "GET,POST,PUT,DELETE,OPTIONS"
            allowedHeaders: "*"
            allowCredentials: true
```

## 11. Testing với Backend

1. **Start Backend Services:**
   - Eureka Server
   - API Gateway
   - Tất cả microservices

2. **Cấu hình Frontend:**
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   VITE_DEV_MODE=false
   ```

3. **Test Flow:**
   - Login → Nhận JWT token
   - Upload trip data → Vehicle Service
   - Trigger calculation → Carbon Calculation Service
   - Check verification status → Verification Service
   - View wallet → Wallet Service

## 12. Development vs Production

### Development
- Sử dụng mock data khi backend chưa sẵn sàng
- `VITE_DEV_MODE=true` hoặc không set
- Mock services tự động fallback khi API không available

### Production
- `VITE_DEV_MODE=false`
- Tất cả requests đi qua API Gateway
- Real-time updates qua WebSocket/SSE
- Proper error handling và retry logic
