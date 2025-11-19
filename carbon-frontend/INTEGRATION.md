# Hướng dẫn tích hợp Frontend vào cc-marketplace-docker

## Tổng quan

Frontend service được thiết kế để tích hợp với kiến trúc microservices của backend thông qua API Gateway.

## Cấu trúc Backend (cc-marketplace-docker)

Backend sử dụng kiến trúc microservices với:
- **API Gateway**: Port 8222 (service name: `api-gateway`)
- **Eureka Server**: Port 8761 (service discovery)
- **Config Server**: Port 8888
- **Các microservices**:
  - User Service: Port 8081
  - Vehicle Service: Port 8082
  - Verification Service: Port 8083
  - Wallet Service: Port 8084
  - Media Service: Port 8085
  - Market Service: Port 8086
  - Transaction Service: Port 8087
- **Support Services**: PostgreSQL, Kafka, Zookeeper, Prometheus, Grafana
- **Network**: `microservices-network`

## Cách tích hợp

### Bước 1: Copy Frontend vào cc-marketplace-docker

```bash
# Trong thư mục cc-marketplace-docker
cp -r ../carbon-frontend ./carbon-frontend
```

### Bước 2: Thêm service vào docker-compose.yml chính

Mở file `docker-compose.yml` trong thư mục `cc-marketplace-docker` và thêm service `carbon-frontend` vào phần `services` (trước phần `networks`):

```yaml
services:
  # ... các services khác (config-server, eureka-server, api-gateway, etc.) ...
  
  # ==================================================================
  # CARBON FRONTEND SERVICE
  # ==================================================================
  carbon-frontend:
    build:
      context: ./carbon-frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=http://api-gateway:8222
    container_name: carbon-frontend
    ports:
      - "3001:80"  # Port 3001 để tránh conflict với Grafana (port 3000)
    restart: unless-stopped
    networks:
      - microservices-network
    depends_on:
      api-gateway:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  microservices-network:
    driver: bridge
```

**Lưu ý**: Bạn có thể copy toàn bộ nội dung từ file `docker-compose.integration.yml` và paste vào `docker-compose.yml` chính.

### Bước 3: Build và chạy

```bash
cd cc-marketplace-docker
docker-compose up -d --build carbon-frontend
```

Hoặc để chạy toàn bộ hệ thống:

```bash
docker-compose up -d --build
```

## Cấu hình API

Frontend sẽ gọi API thông qua:
- **Development (local)**: `http://localhost:8222` (API Gateway chạy trên localhost)
- **Production (Docker)**: `http://api-gateway:8222` (trong Docker network `microservices-network`)

Nginx trong container sẽ tự động proxy các request `/api/*` đến API Gateway.

## Ports

- **Frontend**: Port 3001 (để tránh conflict với Grafana port 3000)
- **API Gateway**: Port 8222
- **Eureka Server**: Port 8761
- **Grafana**: Port 3000
- **Prometheus**: Port 9495

## Network

Frontend kết nối vào network `microservices-network` cùng với tất cả các backend services để có thể giao tiếp với API Gateway và các microservices khác.

## Kiểm tra

Sau khi tích hợp, truy cập:
- **Frontend**: http://localhost:3001
- **API Gateway**: http://localhost:8222
- **Eureka Dashboard**: http://localhost:8761
- **Grafana**: http://localhost:3000

Frontend sẽ tự động proxy các API requests đến API Gateway thông qua nginx.

## Troubleshooting

### Frontend không kết nối được với API Gateway

1. Kiểm tra network: Đảm bảo frontend đã join vào `microservices-network`
   ```bash
   docker network inspect microservices-network
   ```

2. Kiểm tra API Gateway đã sẵn sàng:
   ```bash
   docker logs api-gateway
   curl http://localhost:8222/actuator/health
   ```

3. Kiểm tra nginx proxy:
   ```bash
   docker exec carbon-frontend cat /etc/nginx/conf.d/default.conf
   ```

### Build lỗi

Nếu build lỗi, kiểm tra:
- Đường dẫn `context: ./carbon-frontend` có đúng không
- File `Dockerfile` có tồn tại trong thư mục `carbon-frontend` không
- Build args `VITE_API_URL` đã được truyền đúng chưa

