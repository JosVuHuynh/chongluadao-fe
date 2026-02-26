# Hướng dẫn cấu hình Cloudinary (Signed Upload)

## Luồng hoạt động

```
1. Frontend gọi: POST /api/v1/uploads/signature
   Body: { folder: "reports" }
   ↓
2. Backend trả về: { timestamp, signature, apiKey, cloudName }
   ↓
3. Frontend upload file + signature + folder lên Cloudinary
   ↓
4. Cloudinary trả về: { secure_url }
   ↓
5. Frontend gửi report với evidenceUrls
```

## Bước 1: Tạo tài khoản Cloudinary

1. Truy cập https://cloudinary.com/users/register/free
2. Đăng ký tài khoản miễn phí
3. Đăng nhập vào dashboard

## Bước 2: Lấy thông tin cấu hình

Trong Cloudinary Dashboard, bạn sẽ thấy:
- **Cloud Name**: Tên cloud của bạn (VD: `dcmr6fwux`)
- **API Key**: Khóa API (VD: `123456789012345`)
- **API Secret**: Mã bí mật API (VD: `abcdefghijklmnopqrstuvwxyz123456`)

⚠️ **LƯU Ý**: API Secret phải được giữ bí mật và chỉ sử dụng ở backend!

## Bước 3: Cấu hình Backend

Backend của bạn cần tạo endpoint `POST /api/v1/uploads/signature` để tạo chữ ký:

### Node.js/Express Example:

```javascript
const crypto = require('crypto');

// POST /api/v1/uploads/signature
router.post('/uploads/signature', (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const cloudName = 'YOUR_CLOUD_NAME'; // Thay bằng cloud name của bạn
  const apiKey = 'YOUR_API_KEY';       // Thay bằng API key
  const apiSecret = 'YOUR_API_SECRET'; // Thay bằng API secret
  
  // Tạo signature
  const stringToSign = `timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash('sha256')
    .update(stringToSign)
    .digest('hex');
  
  res.json({
    timestamp,
    signature,
    apiKey,
    cloudName
  });
});
```

### Response format:

```json
{
  "timestamp": 1704844800,
  "signature": "a1b2c3d4e5f6...",
  "apiKey": "123456789012345",
  "cloudName": "dcmr6fwux"
}
```

## Bước 4: Cập nhật Frontend

✅ **Không cần cấu hình gì ở frontend!**

Frontend sẽ tự động lấy `cloudName` từ backend response khi gọi `/api/v1/uploads/signature`.

## Bước 5: Test upload

1. Đảm bảo backend đã chạy và endpoint `/api/v1/uploads/signature` hoạt động
2. Vào trang **Tố cáo lừa đảo**
3. Điền form và upload ảnh
4. Kiểm tra Network tab:
   - Request 1: `POST /api/v1/uploads/signature` → lấy signature
   - Request 2: `POST https://api.cloudinary.com/.../upload` → upload file
5. Kiểm tra Cloudinary Dashboard > Media Library để xem ảnh đã upload

## Giới hạn FREE tier

- **Storage**: 25GB
- **Bandwidth**: 25GB/tháng
- **Transformations**: 25 credits/tháng
- Đủ cho development và small projects

## Bảo mật

✅ **Signed Upload** (phương pháp này):
- API Secret được giữ an toàn ở backend
- Mỗi upload cần signature mới từ server
- Kiểm soát được ai upload, upload gì

❌ **Unsigned Upload** (không dùng):
- API Secret có thể bị lộ
- Bất kỳ ai cũng có thể upload
- Khó kiểm soát

## Troubleshooting

### Lỗi 401 Unauthorized
- Kiểm tra signature có đúng không
- Đảm bảo timestamp chưa hết hạn (± 1 giờ)
- Verify API Key và Cloud Name

### Lỗi "Cannot get signature"
- Kiểm tra backend endpoint `/api/v1/uploads/signature` đã hoạt động chưa
- Kiểm tra CORS settings của backend
- Xem console log để debug

### Lỗi CORS
- Backend cần enable CORS cho Cloudinary domain
- Thêm header: `Access-Control-Allow-Origin: *`

### Upload chậm
- Nén ảnh trước khi upload nếu file quá lớn
- Kiểm tra kết nối internet
- Cloudinary CDN nhanh nhưng tùy thuộc vào vị trí server