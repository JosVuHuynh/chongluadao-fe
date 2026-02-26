# 📝 Tóm tắt - Tích hợp API Tố cáo

## ✅ Đã hoàn thành

### 1. Frontend (React)
- ✅ `/services/reportService.ts` - Service xử lý upload Cloudinary + gọi API reports
- ✅ `/components/ReportScamPage.tsx` - Form tố cáo với validation đầy đủ
- ✅ **Giới hạn tối đa 5 ảnh** - Toast warning khi vượt giới hạn
- ✅ Loading states + Progress tracking khi upload
- ✅ Toast notifications cho mọi trạng thái
- ✅ `/components/AdminReportsTab.tsx` - Quản lý tố cáo với view chi tiết, xem ảnh, duyệt/từ chối/xóa

### 2. API Flow

```
┌──────────────────────────────────────────────────────────┐
│  1. User điền form + chọn ảnh (tối đa 5)                │
└─────────────────────┬────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────────┐
│  2. Click "Gửi tố cáo"                                   │
└─────────────────────┬────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────────┐
│  3. POST /api/v1/uploads/signature                       │
│     Body: { folder: "reports" }                          │
│     Backend trả về: { timestamp, signature, apiKey }     │
└─────────────────────┬────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────────┐
│  4. POST https://api.cloudinary.com/upload               │
│     Upload từng ảnh với signature + folder               │
│     Cloudinary trả về: { secure_url }                    │
└─────────────────────┬────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────────┐
│  5. POST /api/v1/reports                                 │
│     Gửi report data + evidenceUrls                       │
└─────────────────────┬────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────────┐
│  6. Hiển thị success dialog + reset form                 │
└──────────────────────────────────────────────────────────┘
```

## 🔧 Backend cần làm

### Endpoint 1: POST /api/v1/uploads/signature

**Request Body:**
```json
{
  "folder": "reports"
}
```

**Response:**
```json
{
  "timestamp": 1704844800,
  "signature": "abc123...",
  "apiKey": "123456789012345",
  "cloudName": "dcmr6fwux"
}
```

**⚠️ Lưu ý:** Signature phải được tạo với format: `folder=reports&timestamp={timestamp}{apiSecret}`

**Tham khảo code:** `/BACKEND_CLOUDINARY_EXAMPLE.md`

---

### Endpoint 2: POST /api/v1/reports

**Request Body:**
```json
{
  "scamTypeId": 1,
  "scamTypeOther": "",
  "phone": "0123456789",
  "bankAccount": "1234567890 - Vietcombank",
  "relatedLinks": [
    "https://facebook.com/scammer",
    "https://website-lua-dao.com"
  ],
  "description": "Mô tả chi tiết hành vi lừa đảo...",
  "evidenceUrls": [
    "https://res.cloudinary.com/.../image1.jpg",
    "https://res.cloudinary.com/.../image2.jpg"
  ],
  "reporterName": "Nguyễn Văn A",
  "contactInfo": "0987654321"
}
```

**Response:**
```json
{
  "id": 123,
  "scamTypeId": 1,
  "phone": "0123456789",
  "bankAccount": "1234567890 - Vietcombank",
  "relatedLinks": ["..."],
  "description": "...",
  "evidenceUrls": ["..."],
  "reporterName": "Nguyễn Văn A",
  "contactInfo": "0987654321",
  "status": "PENDING",
  "createdAt": "2024-01-10T10:00:00Z"
}
```

---

### Endpoint 3: GET /api/v1/admin/reports (Admin Only)

**Headers:** `Authorization: Bearer {token}`

**Query Params:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `q`: Search query (SĐT, STK, tên người tố cáo)
- `status`: Filter by status (PENDING, PROCESSING, APPROVED, REJECTED)

**Response:**
```json
{
  "data": [
    {
      "id": 3,
      "scamType": {
        "id": 3,
        "code": "SELLING",
        "name": "Lừa đảo bán hàng",
        "isActive": true
      },
      "scamTypeOther": null,
      "phone": "0123456789",
      "bankAccount": "1234567890",
      "relatedLinks": ["http://example.com"],
      "description": "Mô tả...",
      "evidenceUrls": [
        "https://res.cloudinary.com/.../image1.png",
        "https://res.cloudinary.com/.../image2.png"
      ],
      "reporterName": "Nguyễn Văn A",
      "contactInfo": "0987654321",
      "status": "PENDING",
      "createdAt": "2026-02-05T07:46:14.000Z",
      "updatedAt": "2026-02-05T07:46:14.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 3,
    "totalPages": 1
  }
}
```

---

### Endpoint 4: PATCH /api/v1/admin/reports/:id (Admin Only)

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "status": "VERIFIED",
  "description": "Admin đã xác minh tố cáo là hợp lệ",
  "evidenceUrls": [
    "https://res.cloudinary.com/xxx/image/upload/v1/report1.jpg"
  ]
}
```

**Response:**
```json
{
  "id": 3,
  "scamType": { ... },
  "status": "VERIFIED",
  "description": "Admin đã xác minh tố cáo là hợp lệ",
  "evidenceUrls": ["..."],
  ...
}
```

**⚠️ Lưu ý:** 
- Admin có thể cập nhật `status`, `description`, và `evidenceUrls`
- Các field khác (phone, bankAccount, v.v.) không thể thay đổi sau khi tạo

---

### Endpoint 5: DELETE /api/v1/admin/reports/:id (Admin Only)

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

---

### Endpoint 6: POST /api/v1/admin/reports (Admin Only - Thêm tố cáo)

**Headers:** `Authorization: Bearer {token}`

**Request Body:** (Giống với user tạo report)
```json
{
  "scamTypeId": 1,
  "scamTypeOther": "",
  "phone": "0123456789",
  "bankAccount": "1234567890 - Vietcombank",
  "relatedLinks": ["https://example.com"],
  "description": "Mô tả...",
  "evidenceUrls": [
    "https://res.cloudinary.com/.../image1.jpg"
  ],
  "reporterName": "Nguyễn Văn A",
  "contactInfo": "0987654321"
}
```

**Response:**
```json
{
  "id": 123,
  "scamType": { ... },
  "status": "PENDING",
  ...
}
```

## 📋 ScamType ID Mapping

```javascript
1: Lừa đảo chuyển khoản
2: Lừa đảo đầu tư
3: Lừa đảo bán hàng
4: Lừa đảo việc làm
5: Lừa đảo vay tiền
6: Lừa đảo trúng thưởng
7: Khác (nếu scamTypeId = 7, xem field scamTypeOther)
```

## 🔐 Cloudinary Setup

1. Đăng ký tài khoản: https://cloudinary.com/users/register/free
2. Lấy thông tin Dashboard:
   - Cloud Name
   - API Key
   - API Secret (GIỮ BÍ MẬT!)
3. Tạo endpoint backend theo hướng dẫn

## 📁 Files đã tạo

```
/services/reportService.ts          - Service chính
/components/ReportScamPage.tsx      - Form tố cáo (đã update)
/CLOUDINARY_SETUP.md                - Hướng dẫn setup Cloudinary
/BACKEND_CLOUDINARY_EXAMPLE.md      - Code mẫu backend (Node/Python/PHP)
/REPORT_API_SUMMARY.md              - File này
```

## 🧪 Testing

1. Chạy backend với 2 endpoints
2. Vào trang "Tố cáo lừa đảo"
3. Điền form + upload ảnh
4. Click "Gửi tố cáo"
5. Kiểm tra Network tab:
   - `POST /uploads/signature`
   - `POST cloudinary.com/upload` (c thể nhiều lần)
   - `POST /reports`
6. Kiểm tra Cloudinary Dashboard > Media Library

## ⚠️ Lưu ý quan trọng

1. **API Secret phải giữ bí mật** - Chỉ dùng ở backend
2. **Validate input** ở backend trước khi lưu database
3. **Rate limiting** để tránh spam reports
4. **File size limit** nên giới hạn ảnh max 5-10MB
5. **CORS** phải enable cho frontend domain

## 🐛 Common Issues

### "Không thể lấy signature"
→ Backend endpoint chưa chạy hoặc CORS chưa config

### "401 Unauthorized" khi upload Cloudinary
→ Signature sai hoặc timestamp đã hết hạn

### "Không thể gửi tố cáo"
→ Backend `/reports` endpoint có lỗi hoặc validation fail

---

**Tất cả đã sẵn sàng! Chỉ cần backend implement 2 endpoints là hoạt động được.** 🚀