# CORS Error Fix Guide

## Vấn đề hiện tại

```
Access to XMLHttpRequest at 'http://localhost:8222/api/auth/login' from origin 'http://localhost:5173' 
has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header contains multiple values 
'http://localhost:5173, http://localhost:5173', but only one is allowed.
```

**Nguyên nhân**: Backend đang trả về **duplicate** `Access-Control-Allow-Origin` headers.

## Giải pháp

### 1. Kiểm tra Spring Cloud Gateway Configuration

Mở file `application.yml` hoặc `application.properties` của **API Gateway** và đảm bảo chỉ có **MỘT** cấu hình CORS:

#### Cấu hình đúng (application.yml):

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: 
              - "http://localhost:5173"
            allowedMethods:
              - GET
              - POST
              - PUT
              - PATCH
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: true
            maxAge: 3600
```

### 2. Kiểm tra WebMvcConfigurer CORS

Nếu có file `WebConfig.java` hoặc tương tự, **XÓA BỎ** hoặc comment các đoạn CORS config để tránh duplicate:

```java
// XÓA HOẶC COMMENT ĐOẠN NÀY NÊU ĐÃ CÓ CORS CONFIG Ở GATEWAY
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    // COMMENT HOẶC XÓA METHOD NÀY
    /*
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
    */
}
```

### 3. Kiểm tra Filter hoặc Interceptor

Tìm kiếm trong code các class có chứa:
- `CorsFilter`
- `@CrossOrigin`
- Response headers được set manually

**XÓA BỎ** hoặc disable chúng nếu đã có CORS config ở Gateway.

```java
// XÓA ANNOTATION NÀY NẾU CÓ
// @CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // ...
}
```

### 4. Cấu hình đơn giản nhất (Recommended)

**CHỈ CẤU HÌNH CORS Ở API GATEWAY**, không cấu hình ở các microservices khác.

#### application.yml (API Gateway):

```yaml
server:
  port: 8222

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      # CORS Configuration - CHỈ CẤU HÌNH MỘT LẦN Ở ĐÂY
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
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: true
            maxAge: 3600
      
      # Routes
      routes:
        - id: auth-service
          uri: lb://auth-service
          predicates:
            - Path=/api/auth/**
          filters:
            - StripPrefix=1
```

### 5. Kiểm tra sau khi fix

Sau khi fix backend, restart API Gateway và test:

```bash
# Test với curl
curl -X OPTIONS http://localhost:8222/api/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Kiểm tra response headers, phải có:
# Access-Control-Allow-Origin: http://localhost:5173  (CHỈ MỘT GIÁ TRỊ)
# Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
# Access-Control-Allow-Headers: *
# Access-Control-Allow-Credentials: true
```

### 6. Checklist

- [ ] Chỉ có MỘT nơi config CORS (Gateway)
- [ ] Không có `@CrossOrigin` annotation
- [ ] Không có `CorsFilter` bean
- [ ] Không có `addCorsMappings` trong WebConfig
- [ ] Không set CORS headers thủ công trong controller
- [ ] Restart API Gateway sau khi thay đổi
- [ ] Test với curl để kiểm tra headers
- [ ] Test login từ frontend

## Nếu vẫn lỗi

Nếu sau khi làm các bước trên vẫn lỗi, kiểm tra:

1. **Multiple Gateway instances**: Có thể có nhiều Gateway instance đang chạy
2. **Nginx/Proxy**: Kiểm tra xem có proxy nào thêm CORS headers không
3. **Browser cache**: Clear browser cache và thử lại
4. **Service Discovery**: Kiểm tra Eureka xem có nhiều instance không

## Frontend workaround (Tạm thời)

Nếu cần test ngay và chưa fix được backend, có thể dùng proxy trong Vite:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8222',
        changeOrigin: true,
      }
    }
  }
})
```

Sau đó update API_BASE_URL:
```javascript
// src/config/api.js
export const API_BASE_URL = '/api'; // Thay vì http://localhost:8222/api
```

**Lưu ý**: Đây chỉ là giải pháp tạm thời cho development, production vẫn cần fix CORS đúng cách.
