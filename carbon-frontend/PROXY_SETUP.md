# Vite Proxy Configuration - CORS Workaround

## Vấn đề

Backend đang trả về duplicate CORS headers gây lỗi khi gọi API từ frontend.

## Giải pháp

Đã cấu hình Vite proxy để bypass CORS trong development.

### Các thay đổi:

1. **vite.config.js** - Thêm proxy configuration
2. **src/config/api.js** - Đổi API_BASE_URL từ `http://localhost:8222/api` → `/api`
3. **.env.example** - Cập nhật documentation

### Cách hoạt động:

```
Frontend (localhost:5173)
    ↓
Request to /api/auth/login
    ↓
Vite Proxy (same origin)
    ↓
Backend (localhost:8222/api/auth/login)
```

Vì request đi qua Vite proxy (cùng origin), browser không áp dụng CORS policy.

## Cách sử dụng

### 1. Restart Dev Server

```bash
# Stop current dev server (Ctrl+C)
npm run dev
```

### 2. Test Login

Mở browser và test login - CORS error sẽ biến mất!

### 3. Production

Trong production, cần:
- Set `VITE_API_URL=http://your-backend-domain.com/api`
- Backend phải có CORS config đúng (xem CORS_FIX.md)

## Kiểm tra

Mở Network tab trong DevTools:
- Request URL: `http://localhost:5173/api/auth/login` (proxied)
- Actual backend: `http://localhost:8222/api/auth/login`
- No CORS errors! ✅

## Lưu ý

- Proxy chỉ hoạt động trong development với `npm run dev`
- Build production (`npm run build`) không có proxy
- Production cần backend fix CORS đúng cách
