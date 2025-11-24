# API Integration Setup Guide

## Overview

The frontend has been configured to work with the real backend API running on `http://localhost:8222`.

## Configuration

### Environment Variables

Create a `.env` file in the `carbon-frontend` directory:

```bash
# Copy from example
cp .env.example .env
```

Default configuration:
```env
VITE_API_URL=http://localhost:8222/api
```

### API Endpoints

All authentication requests go through the API Gateway:

- **Login**: `POST http://localhost:8222/api/auth/login`
- **Register**: `POST http://localhost:8222/api/auth/register`
- **Profile**: `GET http://localhost:8222/api/customer/profile`
- **Logout**: `POST http://localhost:8222/api/auth/logout`

## Authentication Flow

### 1. Registration

**Endpoint**: `POST /api/auth/register`

**Content-Type**: `multipart/form-data`

**Request Body**:
```
fullName: string (required)
email: string (required)
password: string (required)
phoneNumber: string (required)
role: string (required) - one of: EV_OWNER, BUYER, VERIFIER, ADMIN
dob: date (YYYY-MM-DD format)
```

**Example**:
```bash
curl -X 'POST' \
  'http://localhost:8222/api/auth/register' \
  -H 'accept: */*' \
  -H 'Content-Type: multipart/form-data' \
  -F 'fullName=John Doe' \
  -F 'password=securepassword123' \
  -F 'email=john.doe@example.com' \
  -F 'phoneNumber=0123456789' \
  -F 'role=EV_OWNER' \
  -F 'dob=1990-01-01'
```

**Success Response**:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "user-id",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "role": "EV_OWNER"
  }
}
```

### 2. Login

**Endpoint**: `POST /api/auth/login`

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Example**:
```bash
curl -X 'POST' \
  'http://localhost:8222/api/auth/login' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password": "password123"
}'
```

**Success Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token-here",
    "expiresIn": 3600,
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "fullName": "User Name",
      "role": "EV_OWNER",
      "phoneNumber": "0123456789"
    }
  }
}
```

### 3. Get Profile

**Endpoint**: `GET /api/auth/profile`

**Headers**:
```
Authorization: Bearer <token>
```

**Example**:
```bash
curl -X 'GET' \
  'http://localhost:8222/api/auth/profile' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### 4. Logout

**Endpoint**: `POST /api/auth/logout`

**Headers**:
```
Authorization: Bearer <token>
```

## Frontend Integration

### Authentication Service

The authentication service (`src/services/auth/authService.js`) handles all API calls:

- **Login**: Sends JSON data to `/api/auth/login`
- **Register**: Sends FormData (multipart) to `/api/auth/register`
- **Get Profile**: Fetches user data with JWT token
- **Logout**: Invalidates session

### Auth Context

The `AuthContext` (`src/context/AuthContext.jsx`) manages:

- User state
- Authentication status
- JWT token storage
- Auto-login on page refresh

### Token Management

Tokens are stored in `localStorage`:

```javascript
localStorage.getItem('authToken')        // JWT access token
localStorage.getItem('refreshToken')     // Refresh token
localStorage.getItem('tokenExpiresAt')   // Token expiration timestamp
```

## Changes from Mock to Real API

### Removed

- ❌ Mock authentication service
- ❌ Mock database service
- ❌ Dev mode toggle
- ❌ Mock user creation
- ❌ Client-side password storage

### Updated

- ✅ API base URL: `http://localhost:8222/api` (no `/v1`)
- ✅ Auth endpoints: `/auth/login`, `/auth/register`
- ✅ Registration uses `multipart/form-data`
- ✅ Login uses `application/json`
- ✅ Proper JWT token handling
- ✅ Error messages from API

## Testing

### 1. Start the Backend

Ensure the backend API Gateway is running on `http://localhost:8222`

### 2. Start the Frontend

```bash
cd carbon-frontend
npm run dev
```

### 3. Test Registration

1. Go to `http://localhost:5173`
2. Click "Đăng ký" for either EV Owner or Buyer
3. Fill in the form:
   - Full Name
   - Email
   - Phone Number
   - Password
   - Confirm Password
4. Click "Đăng ký tài khoản"
5. Should auto-login and redirect to dashboard

### 4. Test Login

1. Go to `http://localhost:5173`
2. Click "Đăng nhập"
3. Enter email and password
4. Click "Đăng nhập"
5. Should redirect to role-specific dashboard

### 5. Test Protected Routes

1. Try accessing `/ev-owner/dashboard` without login
2. Should redirect to login page
3. After login, should access dashboard successfully

## Error Handling

The frontend handles these error scenarios:

- **Network errors**: "Không thể kết nối đến server"
- **401 Unauthorized**: Auto-logout and redirect to login
- **409 Conflict**: Email already exists
- **422 Validation error**: Invalid data
- **500 Server error**: Server error message

## User Roles

Supported roles in the system:

- `EV_OWNER` - Electric Vehicle Owner
- `BUYER` - Carbon Credit Buyer
- `VERIFIER` - Carbon Verification Authority
- `ADMIN` - System Administrator

## Next Steps

1. ✅ Authentication working with real API
2. ⏳ Implement other service endpoints (vehicles, carbon, wallet, etc.)
3. ⏳ Update dashboard data fetching
4. ⏳ Implement file upload for trip data
5. ⏳ Connect marketplace to real API
6. ⏳ Implement transaction flows

## Troubleshooting

### CORS Issues

If you see CORS errors, ensure the backend API Gateway has CORS configured:

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "http://localhost:5173"
            allowedMethods:
              - GET
              - POST
              - PUT
              - PATCH
              - DELETE
            allowedHeaders: "*"
            allowCredentials: true
```

### Token Expiration

If you get 401 errors:
1. Check token expiration
2. Clear localStorage
3. Login again

### API Not Running

If you see "Network Error":
1. Ensure backend is running on port 8222
2. Check API Gateway status
3. Verify all microservices are up
