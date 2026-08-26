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
Giao diện dạng "bảng tin" (like/comment/share) với bài viết cảnh báo lừa đảo. **Toàn bộ dữ liệu là mock tĩnh trong component** (không gọi service nào) — chưa có backend cho tin tức/bài viết dù `adminService.ts` có sẵn `getNews/createNews/updateNews/deleteNews` gọi `/admin/news` — **route này không tồn tại ở backend**, các hàm đó hiện không dùng được.

### Tra cứu (`lookup` — `LookupPage.tsx`)
Ô tìm kiếm số điện thoại/tên/MST..., trả về cả doanh nghiệp uy tín lẫn cảnh báo lừa đảo liên quan. Gọi `GET /search` — **kết nối API thật**. Nhận `initialQuery` từ ô tìm kiếm ở trang chủ.

### Gian hàng (`shop`, `shop-detail` — `ShopPage.tsx`, `ShopsListPage.tsx`, `ShopDetailPage.tsx`)
Giao diện danh sách sản phẩm/dịch vụ và trang chi tiết 1 gian hàng (đánh giá, thông tin liên hệ, sản phẩm). **Toàn bộ dữ liệu là mock tĩnh khai báo trực tiếp trong component** (mảng `products`, không import service nào) — backend hiện **không có** khái niệm "shop"/gian hàng (không có bảng, không có route). Coi đây là demo UI, không phải tính năng đang chạy thật.

## Trang xác thực (không có Header/Footer)

### Đăng nhập / Đăng ký (`login`, `register` — `LoginPage.tsx`, `RegisterPage.tsx`)
Gọi `POST /auth/login` / `POST /auth/register` thật. Sau đăng nhập, `App.tsx` tự điều hướng theo `role`: `ADMIN` → `admin`, `BUSINESS` → `business-portal`, còn lại → `home`.

## Trang theo vai trò (role-gated, không có Header/Footer)

### Cổng thông tin doanh nghiệp (`business-portal` — `BusinessPortal.tsx`, role `BUSINESS`)
Giao diện dashboard nhiều tab cho chủ doanh nghiệp (tổng quan, sản phẩm, đơn hàng, thống kê...). **Phần lớn là UI/mock** — backend chưa có endpoint self-service nào cho role `BUSINESS` tự sửa dữ liệu doanh nghiệp của mình (xem `chongluadao-be/docs/FEATURES.md` mục 3); trang này hiện chủ yếu trình bày giao diện, chưa gắn đầy đủ với dữ liệu thật.

### Trang quản trị (`admin` — `AdminDashboard.tsx` + các tab con, role `ADMIN`)
- **Tổng quan** (`AdminOverviewTab.tsx`): số liệu thống kê, gọi `adminService.getStatistics()` → `GET /admin/statistics`. **Route này không tồn tại ở backend** (không có route/controller/service nào tên `statistics` trong `chongluadao-be/src`) — tab này sẽ luôn lỗi/rỗng khi chạy thật.
- **Người dùng** (`AdminUsersTab.tsx`): xem/tạo/sửa user qua `adminService.getUsers/createUser/updateUser` — khớp `GET/POST/PATCH /admin/users` thật. Nút xoá gọi `adminService.deleteUser()` → `DELETE /admin/users/:id`, nhưng route này không tồn tại.
- **Báo cáo** (`AdminReportsTab.tsx`): xem/lọc/duyệt/sửa report — khớp `GET/PATCH /admin/reports*`, **kết nối API thật**. Nút xoá report (nếu có trong UI) gọi `adminService.deleteReport()` → `DELETE /admin/reports/:id`, route này cũng **không tồn tại**.
- **Doanh nghiệp** (`AdminBusinessesTab.tsx`): xem/tạo/duyệt/từ chối/sửa doanh nghiệp — khớp `/admin/businesses*`, **kết nối API thật**. Tương tự, `deleteBusiness()` → `DELETE /admin/businesses/:id` không tồn tại.
- **Quản lý gian hàng** (phần `ShopManagementTab` trong `AdminDashboard.tsx`): dùng `mockShops` khai báo cứng trong component, **không gọi API** dù `adminService.ts` có sẵn `getShops/updateShop/deleteShop` — các hàm này không được trang gọi tới, và backend cũng chưa có bảng/route `shops` tương ứng.

**Lưu ý chung quan trọng**: backend hiện **không định nghĩa bất kỳ route `DELETE` nào** (không có `router.delete(...)` ở file route nào cả) — mọi hàm `deleteX` trong `adminService.ts` (`deleteUser`, `deleteReport`, `deleteBusiness`, `deleteNews`, `deleteShop`) đều gọi vào endpoint không tồn tại và sẽ luôn nhận `404`. Nếu cần chức năng xoá thật, phải thêm route `DELETE` tương ứng ở backend trước (dùng skill `add-endpoint`).

## Tổng kết: tính năng nào là thật, tính năng nào là mock

| Tính năng | Trạng thái |
|---|---|
| Đăng ký / đăng nhập / phân quyền | ✅ Thật |
| Gửi tố cáo lừa đảo + upload ảnh | ✅ Thật |
| Tra cứu (search) | ✅ Thật |
| Danh sách doanh nghiệp uy tín (công khai) | ✅ Thật |
| Admin: xem/tạo/sửa user, report, doanh nghiệp | ✅ Thật |
| Admin: **xoá** user/report/doanh nghiệp/tin tức/shop | ❌ UI có, backend không có route `DELETE` nào — luôn lỗi |
| Admin: thống kê tổng quan (`/admin/statistics`) | ❌ Route không tồn tại — tab luôn lỗi/rỗng |
| Trang Tin tức | ❌ Mock — chưa có backend |
| Trang/Quản lý Gian hàng (Shop) | ❌ Mock — chưa có backend |
| Cổng thông tin doanh nghiệp (self-service) | ❌ Phần lớn mock — chưa có backend self-service |

Khi thêm tính năng mới cho một trong các mục "❌"/"⚠️" ở trên, cần làm cả hai phía (route/schema/service ở backend + wiring thật ở frontend) — dùng agent `page-builder` (frontend) / `api-builder` (backend) đã cấu hình trong `.claude/agents/` của từng repo để triển khai đúng theo convention hiện có, thay vì chỉ nối service function vào mock data có sẵn.
