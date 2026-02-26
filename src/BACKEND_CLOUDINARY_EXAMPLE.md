# Backend - Cloudinary Signature Endpoint

## 📋 Yêu cầu

Backend cần có endpoint: **POST /api/v1/uploads/signature**

## 🔄 Flow chi tiết

```
┌─────────┐                    ┌─────────┐                    ┌──────────────┐
│ Browser │                    │ Backend │                    │  Cloudinary  │
└────┬────┘                    └────┬────┘                    └──────┬───────┘
     │                              │                                 │
     │ 1. POST /uploads/signature   │                                 │
     │    Body: { folder: "reports" }                                 │
     │─────────────────────────────>│                                 │
     │                              │                                 │
     │                              │ 2. Tạo signature với API Secret │
     │                              │───────────────┐                 │
     │                              │               │                 │
     │                              │<──────────────┘                 │
     │                              │                                 │
     │ 3. Return signature + apiKey │                                 │
     │<─────────────────────────────│                                 │
     │                              │                                 │
     │ 4. POST upload với signature + folder                          │
     │──────────────────────────────────────────────────────────────>│
     │                              │                                 │
     │                              │  5. Verify signature            │
     │                              │                 ┌───────────────┤
     │                              │                 │               │
     │                              │                 └──────────────>│
     │                              │                                 │
     │ 6. Return secure_url         │                                 │
     │<───────────────────────────────────────────────────────────────│
     │                              │                                 │
```

## 💻 Code Examples

### Node.js + Express

```javascript
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Cloudinary config (lưu trong .env)
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * POST /api/v1/uploads/signature
 * Tạo signature để upload ảnh lên Cloudinary
 */
router.post('/uploads/signature', (req, res) => {
  try {
    const { folder } = req.body; // Nhận folder từ frontend
    
    // Tạo timestamp (seconds)
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Tạo string để sign (theo format của Cloudinary)
    // Nếu có folder, thêm vào string to sign
    const paramsToSign = folder 
      ? `folder=${folder}&timestamp=${timestamp}`
      : `timestamp=${timestamp}`;
    
    const stringToSign = `${paramsToSign}${CLOUDINARY_API_SECRET}`;
    
    // Tạo SHA-256 signature
    const signature = crypto
      .createHash('sha256')
      .update(stringToSign)
      .digest('hex');
    
    // Trả về signature + thông tin cần thiết
    res.json({
      timestamp,
      signature,
      apiKey: CLOUDINARY_API_KEY,
      cloudName: CLOUDINARY_CLOUD_NAME
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({ 
      message: 'Không thể tạo signature' 
    });
  }
});

module.exports = router;
```

### .env file

```env
CLOUDINARY_CLOUD_NAME=dcmr6fwux
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### Python + Flask

```python
import os
import time
import hashlib
from flask import Blueprint, jsonify

cloudinary_bp = Blueprint('cloudinary', __name__)

CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')

@cloudinary_bp.route('/api/v1/uploads/signature', methods=['POST'])
def get_signature():
    try:
        data = request.get_json()
        folder = data.get('folder', '')
        
        # Tạo timestamp (seconds)
        timestamp = int(time.time())
        
        # Tạo string để sign
        if folder:
            params_to_sign = f"folder={folder}&timestamp={timestamp}"
        else:
            params_to_sign = f"timestamp={timestamp}"
        
        string_to_sign = f"{params_to_sign}{CLOUDINARY_API_SECRET}"
        
        # Tạo SHA-256 signature
        signature = hashlib.sha256(string_to_sign.encode()).hexdigest()
        
        # Trả về response
        return jsonify({
            'timestamp': timestamp,
            'signature': signature,
            'apiKey': CLOUDINARY_API_KEY,
            'cloudName': CLOUDINARY_CLOUD_NAME
        })
    except Exception as e:
        print(f"Error generating signature: {e}")
        return jsonify({'message': 'Không thể tạo signature'}), 500
```

### PHP + Laravel

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CloudinaryController extends Controller
{
    public function getSignature(Request $request)
    {
        try {
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $apiKey = env('CLOUDINARY_API_KEY');
            $apiSecret = env('CLOUDINARY_API_SECRET');
            
            $folder = $request->input('folder', '');
            
            // Tạo timestamp (seconds)
            $timestamp = time();
            
            // Tạo string để sign
            if ($folder) {
                $paramsToSign = "folder={$folder}&timestamp={$timestamp}";
            } else {
                $paramsToSign = "timestamp={$timestamp}";
            }
            
            $stringToSign = "{$paramsToSign}{$apiSecret}";
            
            // Tạo SHA-256 signature
            $signature = hash('sha256', $stringToSign);
            
            return response()->json([
                'timestamp' => $timestamp,
                'signature' => $signature,
                'apiKey' => $apiKey,
                'cloudName' => $cloudName
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Không thể tạo signature'
            ], 500);
        }
    }
}
```

## 🔒 Bảo mật

### ✅ Nên làm:
- Lưu API Secret trong environment variables (.env)
- **KHÔNG** commit .env file vào Git
- Thêm rate limiting để tránh spam
- Validate request origin (CORS)

### ❌ Không nên:
- Hardcode API Secret trong code
- Expose API Secret ra frontend
- Không kiểm tra quyền truy cập

## 🧪 Test Endpoint

### Dùng curl:
```bash
curl -X POST http://localhost:3000/api/v1/uploads/signature \
  -H "Content-Type: application/json" \
  -d '{"folder":"reports"}'
```

### Response mẫu:
```json
{
  "timestamp": 1704844800,
  "signature": "a1b2c3d4e5f6789abcdef0123456789",
  "apiKey": "123456789012345",
  "cloudName": "dcmr6fwux"
}
```

## 📌 Lưu ý

1. **Timestamp expiration**: Cloudinary chấp nhận signature trong khoảng ± 1 giờ từ timestamp. Nếu upload sau 1 giờ sẽ bị reject.

2. **Signature format**: Phải theo đúng format:
   - Với folder: `folder={folder}&timestamp={timestamp}{apiSecret}`
   - Không folder: `timestamp={timestamp}{apiSecret}`
   
   ⚠️ **QUAN TRỌNG**: Các params phải được sắp xếp theo thứ tự alphabet khi tạo signature!

3. **SHA-256**: Phải dùng SHA-256 hash algorithm, không phải MD5 hay SHA-1.

4. **CORS**: Nếu frontend và backend khác domain, cần config CORS:
   ```javascript
   app.use(cors({
     origin: 'http://localhost:5173', // Frontend URL
     credentials: true
   }));
   ```

5. **Folder structure**: Ảnh sẽ được lưu trong Cloudinary với structure:
   ```
   your_cloud_name/
   └── reports/
       ├── abc123.jpg
       ├── def456.png
       └── ...
   ```

## 🐛 Debug

### Console log để kiểm tra:
```javascript
console.log('Folder:', folder);
console.log('Timestamp:', timestamp);
console.log('String to sign:', stringToSign);
console.log('Signature:', signature);
```

### Kiểm tra response:
```javascript
// Trong browser console
fetch('http://localhost:3000/api/v1/uploads/signature', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ folder: 'reports' })
})
  .then(res => res.json())
  .then(data => console.log(data));
```