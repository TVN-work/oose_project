# VNPay Payment Integration Setup

## Frontend-Backend Flow

### Luồng thanh toán VNPay:

1. **Frontend (Checkout)** → Gọi `/api/transactions/:id/pay?paymentMethod=VN_PAY`
2. **Backend** → Tạo VNPay payment URL và trả về cho frontend
3. **Frontend** → Thêm `returnurl` parameter và redirect sang VNPay
4. **VNPay** → Xử lý thanh toán, sau đó redirect về callback URL
5. **Frontend (PaymentCallback)** → Nhận callback từ VNPay, gọi backend verify
6. **Backend** → Xác minh signature, cập nhật transaction status
7. **Frontend** → Hiển thị kết quả thành công/thất bại, redirect marketplace

## Backend Configuration Required

### 1. VNPayConfig - Cấu hình returnUrl

Khi tạo VNPay payment URL, cần set **returnUrl** trỏ về frontend callback:

```java
// Trong VNPayService hoặc VNPayConfig
private String getReturnUrl() {
    // Lấy từ environment variable hoặc config
    return System.getenv("VNPAY_RETURN_URL") 
        || "https://yourdomain.com/buyer/payment/callback";
}
```

### 2. VNPayService - Thêm returnurl vào payment URL

```java
@Service
public class VNPayService {
    
    private final VNPayConfig vnpayConfig;
    
    public String buildPaymentUrl(PaymentRequest request) {
        // ... existing code ...
        
        // Thêm return URL
        String returnUrl = System.getenv("VNPAY_RETURN_URL") 
            || "https://yourdomain.com/buyer/payment/callback";
        
        params.put("vnp_ReturnUrl", returnUrl);
        
        // Build URL...
    }
}
```

### 3. PaymentController - `/api/payments/vnpay-return` endpoint

Endpoint này nhận callback từ VNPay (hoặc từ frontend relay):

```
GET /api/payments/vnpay-return?vnp_Amount=...&vnp_ResponseCode=...&vnp_TxnRef=...&vnp_SecureHash=...
```

**Trình tự xử lý:**
1. Verify signature (vnp_SecureHash)
2. Lấy transaction từ database (dùng vnp_TxnRef)
3. Nếu vnp_ResponseCode = "00": update status = SUCCESS
4. Nếu khác: update status = FAILED
5. Trả về JSON response cho frontend

## Environment Variables

Thêm vào `.env` hoặc config properties:

```properties
# VNPay
VNPAY_RETURN_URL=https://yourdomain.com/buyer/payment/callback
VNPAY_TMNCODE=your_tmn_code
VNPAY_SECRET_KEY=your_secret_key
VNPAY_SANDBOX_URL=https://sandbox.vnpayment.vn/paygate
VNPAY_PRODUCTION_URL=https://pay.vnpay.vn/paygate
```

## Frontend URLs

- **Checkout page**: `https://yourdomain.com/buyer/checkout`
- **Callback page**: `https://yourdomain.com/buyer/payment/callback`
- **Marketplace**: `https://yourdomain.com/buyer/marketplace`

## VNPay Parameter Mapping

| VNPay Param | Meaning | Frontend Use |
|---|---|---|
| `vnp_ResponseCode` | "00" = success, others = failed | Check payment status |
| `vnp_TxnRef` | Our transaction ID | Match with transaction in DB |
| `vnp_TransactionNo` | VNPay transaction ID | Display in receipt |
| `vnp_Amount` | Amount * 100 | Verify amount (divide by 100) |
| `vnp_BankCode` | Bank code | Display payment method |
| `vnp_PayDate` | Payment time (YYYYMMDDHHmmss) | Display payment time |
| `vnp_SecureHash` | Signature for verification | Verify in backend |

## Testing

### Sandbox Testing URL
```
https://sandbox.vnpayment.vn/paygate
```

### Test Cards
- Card: 4111111111111111
- OTP: 123456

## Security Notes

1. ✅ Frontend verify signature: NO (không cần, backend sẽ verify)
2. ✅ Backend verify signature: YES (bắt buộc)
3. ✅ Validate amount matches: YES
4. ✅ Use HTTPS only: YES
5. ✅ Never log payment data: YES

## Troubleshooting

### Issue: Frontend callback page không nhận được response
**Solution**: Kiểm tra VNPay config, returnUrl phải đúng

### Issue: Signature verification failed
**Solution**: Check vnpayConfig.getSecretKey() - phải khớp với VNPay admin

### Issue: Transaction status không update
**Solution**: Check transaction ID matching giữa vnp_TxnRef và database

### Issue: Redirect loop
**Solution**: Đảm bảo returnUrl không trỏ lại payment page
