# Báo cáo khung giao diện dashboard

## Nội dung đã triển khai

- Thêm `DashboardLayout` tại `/dashboard` với hai cột trên desktop: sidebar và vùng nội dung `Outlet`.
- Sidebar desktop có hai chế độ: mở rộng mặc định khi vào trang và thu gọn theo `--dash-rail-width`. Nút trên sidebar đổi trạng thái; vùng nội dung tự giãn và transition theo token. Trạng thái thu gọn chỉ tồn tại trong state của layout.
- Sidebar desktop và mobile drawer dùng chung `NavItem` và mảng `menuItems` cho ba route Điểm danh, Thiếu nhi, Hỗ trợ. `NavLink` đánh dấu trang đang mở.
- Thêm `UserMenu` nhận `name`, `roleLabel`, `avatarUrl`; avatar dùng ảnh nếu có, nếu không thì hiện chữ cái đầu. Dữ liệu mẫu: Cao Van Dong, Chủ nhiệm lớp.
- Mobile có topbar và drawer dạng modal. Drawer đóng bằng nút X, overlay, Escape hoặc chọn mục; khóa cuộn nền, giữ Tab trong drawer và trả focus về nút hamburger khi đóng.
- Thêm ba trang placeholder chỉ có tiêu đề. Route `/dashboard` chuyển đến `/dashboard/thieu-nhi`.
- Tách token dashboard vào `.dashboard-scope`. Token mới `--dash-overlay` cung cấp màu phủ nền của drawer; breakpoint 1024px được khai báo một lần trong stylesheet dashboard.
- Bổ sung DataTable dùng chung và ThieuNhiRow định nghĩa các cột danh sách đoàn sinh; ghép StatsBar, ClassPicker, SearchInput, Pagination và dữ liệu giả vào trang `/dashboard/thieu-nhi`.
- Đã xóa trang xem thử components và route `/dev/components`. **Card cha chứa ClassPicker không được đặt `overflow: hidden`**, nếu không panel absolute có thể bị cắt.
- Bổ sung layout mobile cho trang Thiếu Nhi: StatsBar giữ ba mục trên một hàng, toolbar xếp dọc, bảng dùng bộ cột mobile và pagination căn giữa. Thêm FabMenu với ba action UI, đóng bằng click ngoài/Escape và điều hướng menu bằng phím mũi tên.
- Token responsive mới: `--dash-stat-icon-size-mobile: 34px`, `--dash-stat-icon-glyph-size-mobile: 18px` và `--dash-fab-size: 52px`; cả ba là **giá trị ước lượng theo ảnh mẫu**.

## Kiểm tra

- `npm run build`: thành công.
- ESLint cho các tệp dashboard, route và `main.tsx`: thành công.
- `npm run lint`: còn lỗi có sẵn tại `src/hooks/useHomePage.ts:28`, quy tắc `react-hooks/set-state-in-effect` do gọi `fetchData()` đồng bộ trong effect. Hook này nằm ngoài phạm vi file được phép sửa nên được giữ nguyên.
- Responsive breakpoint review: tại 1024px, các style desktop còn hiệu lực, FAB bị ẩn và bộ cột desktop được render; tại 1023px, bộ cột mobile được render, nút chi tiết bị ẩn, toolbar xếp dọc và FAB xuất hiện; tại 768px các quy tắc mobile tiếp tục áp dụng và wrapper bảng cho phép cuộn ngang; tại 375px cùng bộ quy tắc áp dụng trong viewport hẹp, bảng vẫn nằm trong vùng cuộn ngang. Không hoàn tất kiểm tra trực quan live ở các viewport vì browser tích hợp không attach được vào trang localhost.
