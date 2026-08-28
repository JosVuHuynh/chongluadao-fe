# Tính năng hiện có — chongluadao-fe

Mô tả từng trang/tính năng trên giao diện, và trang nào **thực sự gọi API backend** so với trang nào đang dùng **dữ liệu tĩnh/mock**. Xem [chongluadao-be/docs/API_REFERENCE.md](../../chongluadao-be/docs/API_REFERENCE.md) để biết chi tiết endpoint tương ứng.

## Trang công khai (có Header/Footer)

### Trang chủ (`home` — `HomePage.tsx`)
Giới thiệu tổng quan, ô tìm kiếm nhanh (điều hướng sang trang `lookup` kèm từ khoá), các số liệu/khối nội dung giới thiệu tính năng.

### Tố cáo lừa đảo (`report` — `ReportScamPage.tsx`)
Form tố cáo đầy đủ: chọn loại lừa đảo (gọi `GET /scam-types`), nhập thông tin kẻ lừa đảo, mô tả, link liên quan, upload tối đa 5 ảnh bằng chứng (qua luồng S3 presign), rồi gửi (`POST /reports`). **Kết nối API thật**, hoạt động đầy đủ theo đúng luồng ở `docs/CONVENTIONS.md`.

### Doanh nghiệp uy tín (`businesses` — `TrustedBusinessPage.tsx`)
Danh sách doanh nghiệp đã xác thực, lọc theo danh mục/từ khoá, hiển thị huy hiệu uy tín, mạng xã hội, thông tin CEO. Gọi `GET /business/list` — **kết nối API thật**.

### Tin tức (`news` — `NewsPage.tsx`)
Bảng tin thật, dùng `services/newsService.ts`: danh sách bài viết công khai (`GET /news`, phân trang "Xem thêm"), like dạng toggle (`POST /news/:id/like`) và bình luận (`GET`/`POST /news/:id/comments`) cho mọi user đã đăng nhập; khách chưa đăng nhập bấm thích/bình luận sẽ được điều hướng sang trang đăng nhập. **Kết nối API thật.** Không có nút "đăng bài" trên trang này — đăng bài chỉ thực hiện được qua `AdminNewsTab` (admin) hoặc tab "Tin tức" trong `BusinessPortal.tsx` (doanh nghiệp), đúng mô hình phân quyền của backend (chỉ `ADMIN`/`BUSINESS` được đăng, mọi role chỉ like/comment). Tính năng "share" của bản mock cũ đã bị bỏ vì app không có URL/route thật cho từng bài viết để chia sẻ.

### Tra cứu (`lookup` — `LookupPage.tsx`)
Ô tìm kiếm số điện thoại/tên/MST..., trả về cả doanh nghiệp uy tín lẫn cảnh báo lừa đảo liên quan. Gọi `GET /search` — **kết nối API thật**. Nhận `initialQuery` từ ô tìm kiếm ở trang chủ. Frontend gửi nguyên chuỗi người dùng nhập, không tự parse/chuẩn hoá URL gì cả — toàn bộ việc nhận diện "đây là link Facebook, quy về cùng 1 người" nằm ở backend (xem `chongluadao-be/docs/API_REFERENCE.md` §8.1): tìm bằng link share `facebook.com/share/xxxx/` vẫn ra đúng report đã lưu bằng link profile gốc `facebook.com/username`, và ngược lại. Lưu ý: khi chuỗi tìm là link `/share/xxxx/`, backend phải gọi ra Facebook để giải mã nên request có thể chậm hơn bình thường (tối đa ~4s) trước khi trả kết quả.

### Cửa hàng (`shop`, `shop-detail` — `ShopsListPage.tsx`, `ShopDetailPage.tsx`)
Danh sách cửa hàng của các doanh nghiệp đã `VERIFIED` và có shop `APPROVED` (`GET /shops`, lọc theo danh mục/từ khoá), trang chi tiết hiển thị thông tin liên hệ + danh sách sản phẩm `APPROVED` của shop đó (`GET /shops/:id`) — **kết nối API thật**, dùng `services/shopService.ts`. Mỗi sản phẩm có nút "Xem sản phẩm" dẫn ra `buyUrl` bên ngoài (nền tảng không xử lý giỏ hàng/thanh toán). `ShopPage.tsx` (gói dịch vụ riêng của nền tảng — xác thực, bảo hiểm, quảng cáo) không được `App.tsx` gọi tới ở đâu cả — orphaned/dead code, không phải trang đang chạy.

## Trang xác thực (không có Header/Footer)

### Đăng nhập / Đăng ký (`login`, `register` — `LoginPage.tsx`, `RegisterPage.tsx`)
Gọi `POST /auth/login` / `POST /auth/register` thật. Sau đăng nhập, `App.tsx` tự điều hướng theo `role`: `ADMIN` → `admin`, `BUSINESS` → `business-portal`, còn lại → `home`.

## Trang theo vai trò (role-gated, không có Header/Footer)

### Cổng thông tin doanh nghiệp (`business-portal` — `BusinessPortal.tsx`, role `BUSINESS`)
Giao diện dashboard nhiều tab cho chủ doanh nghiệp. 3 tab dùng dữ liệu thật:
- **Tin tức**: xem bài đã đăng (`GET /news/mine`), đăng/sửa/xóa bài kèm ảnh (`newsService.ts`).
- **Cửa hàng**: tạo/sửa hồ sơ shop của doanh nghiệp (`shopService.getMyShop/createShop/updateShop`) — chỉ tạo được khi doanh nghiệp đã `VERIFIED`, shop mới luôn ở trạng thái chờ duyệt.
- **Sản phẩm**: quản lý sản phẩm của shop mình (`shopService.getMyProducts/createProduct/updateProduct/deleteProduct`) — bị khoá (hiện thông báo + nút chuyển sang tab Cửa hàng) cho tới khi shop được admin duyệt `APPROVED`.

Các tab còn lại (Tổng quan, Thống kê, Cài đặt) vẫn là UI/mock — backend chưa có endpoint self-service cho thống kê doanh nghiệp.

### Trang quản trị (`admin` — `AdminDashboard.tsx` + các tab con, role `ADMIN`)
- **Tổng quan** (`AdminOverviewTab.tsx`): số liệu thống kê, gọi `adminService.getStatistics()` → `GET /admin/statistics`. **Route này không tồn tại ở backend** (không có route/controller/service nào tên `statistics` trong `chongluadao-be/src`) — tab này sẽ luôn lỗi/rỗng khi chạy thật.
- **Người dùng** (`AdminUsersTab.tsx`): xem/tạo/sửa user qua `adminService.getUsers/createUser/updateUser` — khớp `GET/POST/PATCH /admin/users` thật. Nút xoá gọi `adminService.deleteUser()` → `DELETE /admin/users/:id`, nhưng route này không tồn tại.
- **Báo cáo** (`AdminReportsTab.tsx`): xem/lọc/duyệt/sửa report — khớp `GET/PATCH /admin/reports*`, **kết nối API thật**. Nút xoá report (nếu có trong UI) gọi `adminService.deleteReport()` → `DELETE /admin/reports/:id`, route này cũng **không tồn tại**.
- **Doanh nghiệp** (`AdminBusinessesTab.tsx`): xem/tạo/duyệt/từ chối/sửa doanh nghiệp — khớp `/admin/businesses*`, **kết nối API thật**. Tương tự, `deleteBusiness()` → `DELETE /admin/businesses/:id` không tồn tại.
- **Tin tức** (`AdminNewsTab.tsx`): xem tất cả bài viết (của cả admin lẫn doanh nghiệp, qua `GET /news`), đăng/sửa/xóa bất kỳ bài nào (`POST`/`PATCH`/`DELETE /news/:id`, admin có quyền quản trị mọi bài) — **kết nối API thật**, dùng `newsService.ts` (không dùng các hàm `adminService.getNews/createNews/...` cũ trỏ tới `/admin/news` không tồn tại).
- **Cửa hàng** (`AdminShopsTab.tsx`, thay cho `ShopManagementTab` mock cũ đã bị xóa khỏi `AdminDashboard.tsx`): xem/tìm/lọc mọi shop, duyệt/từ chối (kèm lý do)/gắn cờ nổi bật/xóa — **kết nối API thật** (`/admin/shops*`), dùng `shopService.ts`.
- **Sản phẩm** (`AdminProductsTab.tsx`, thay cho `ProductManagementTab` mock cũ): xem/tìm/lọc mọi sản phẩm của mọi shop, duyệt/từ chối kèm lý do — **kết nối API thật** (`/admin/products*`).

**Lưu ý chung quan trọng**: backend **không có route `DELETE`** cho user/report/business/shop (không có `router.delete(...)` trong các file route tương ứng) — mọi hàm `deleteX` trong `adminService.ts` (`deleteUser`, `deleteReport`, `deleteBusiness`, `deleteShop`) gọi vào endpoint không tồn tại và sẽ luôn nhận `404`. Ngoại lệ duy nhất là **tin tức**: `DELETE /news/:id` và `DELETE /news/:id/comments/:commentId` có thật (xem `chongluadao-be/docs/API_REFERENCE.md` mục 9) — `newsService.deleteNews()` ở frontend hoạt động đúng.

## Tổng kết: tính năng nào là thật, tính năng nào là mock

| Tính năng | Trạng thái |
|---|---|
| Đăng ký / đăng nhập / phân quyền | ✅ Thật |
| Gửi tố cáo lừa đảo + upload ảnh | ✅ Thật |
| Tra cứu (search) | ✅ Thật |
| Danh sách doanh nghiệp uy tín (công khai) | ✅ Thật |
| Admin: xem/tạo/sửa user, report, doanh nghiệp | ✅ Thật |
| Admin: **xoá** user/report/doanh nghiệp/shop | ❌ UI có, backend không có route `DELETE` nào — luôn lỗi |
| Admin: thống kê tổng quan (`/admin/statistics`) | ❌ Route không tồn tại — tab luôn lỗi/rỗng |
| Tin tức: đăng bài (ADMIN/BUSINESS), xem/like/comment (mọi role) | ✅ Thật |
| Cửa hàng & Sản phẩm: xem công khai, doanh nghiệp tạo/quản lý, admin duyệt | ✅ Thật |
| Cổng thông tin doanh nghiệp: Tổng quan/Thống kê/Cài đặt | ❌ Mock — chưa có backend self-service |
| `ShopPage.tsx` (gói dịch vụ nền tảng: xác thực, bảo hiểm, quảng cáo) | ⚠️ Orphaned — không được `App.tsx` gọi tới ở đâu cả |

Khi thêm tính năng mới cho một trong các mục "❌"/"⚠️" ở trên, cần làm cả hai phía (route/schema/service ở backend + wiring thật ở frontend) — dùng agent `page-builder` (frontend) / `api-builder` (backend) đã cấu hình trong `.claude/agents/` của từng repo để triển khai đúng theo convention hiện có, thay vì chỉ nối service function vào mock data có sẵn.
