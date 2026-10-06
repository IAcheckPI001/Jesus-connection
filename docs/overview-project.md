# Tổng quan kiến trúc dự án

## 1. Mục tiêu và nguyên tắc

Monorepo gồm hai ứng dụng độc lập:

- `backend/`: Next.js App Router, Prisma và PostgreSQL/Supabase; cung cấp API, session, phân quyền và truy cập dữ liệu.
- `frontend/`: React, Vite, TypeScript, React Router và TanStack Query; hiển thị giao diện và gọi API qua `apiClient`.

Hai ứng dụng chưa dùng package types chung. Các hợp đồng request/response được mô tả riêng ở mỗi project và phải được cập nhật đồng thời khi thay đổi API.

Các nguyên tắc nền:

- TypeScript bật `erasableSyntaxOnly`: dùng union type, object `as const` và type alias; không dùng `enum`, `namespace` hay parameter properties.
- Session được lưu ở bảng `phien_dang_nhap`; cookie `sid` là `httpOnly`. Backend xác thực qua `requireAuth`.
- Quyền xem lớp và quyền ghi lớp là hai chính sách riêng. Quyền xem toàn cục không tự cấp quyền import/sửa.
- CORS được cấu hình tập trung trong `backend/src/proxy.ts` từ `ALLOWED_ORIGINS`.
- `VITE_API_URL` đã có `/api`; service chỉ truyền phần path phía sau, ví dụ `auth/me` hoặc `thieu-nhi`.
- Import hiện có bước parse và preview; chưa có bước ghi dữ liệu vào DB.

## 2. Tổ chức thư mục

```text
backend/
  prisma/                         Schema và cấu hình Prisma
  src/
    app/api/                       Route handlers theo URL
    lib/
      config/                      Cấu hình server, hiện gồm CORS
      permissions/                 Guard và phép kiểm quyền
      services/                    Nghiệp vụ và truy cập dữ liệu
      session/                     Cookie, session và requireAuth
    types/                         DTO và kiểu dữ liệu backend

frontend/
  src/
    components/                    Component dùng lại, chia common/auth/dashboard
    constants/                     Nhãn, giá trị mặc định và ràng buộc UI
    contexts/                      Trạng thái xác thực dùng chung
    hooks/                         Hook giao diện và dữ liệu
    layouts/                       Khung trang và dashboard
    pages/                         Route-level components
    services/                      API client và service theo domain
    styles/                        Token toàn cục và dashboard
    types/                         DTO, form model và response type frontend
    utils/                         Hàm thuần dùng lại
```

### Route hiện có

| Method và path | Mục đích | Bảo vệ |
|---|---|---|
| `POST /api/auth/login` | Tạo session và cookie `sid` | Public để đăng nhập |
| `POST /api/auth/logout` | Xóa session hiện tại | `requireAuth` |
| `POST /api/auth/logout-all` | Xóa mọi session của tài khoản | `requireAuth` |
| `GET /api/auth/me` | Trả user hiện tại | `requireAuth` |
| `GET /api/chi-doan` | Danh sách lớp người dùng được xem | `requireAuth` và lọc theo quyền xem |
| `GET /api/thieu-nhi` | Danh sách đoàn sinh của một lớp | `requireClassViewAccess` |
| `GET /api/home-page` | Dữ liệu trang chủ mẫu | Public |
| `POST /api/thieu-nhi/import/preview` | Validate và đối chiếu preview với dữ liệu cùng lớp | `requireClassAccess`; chỉ đọc DB |

Route mới đặt theo kebab-case. Trong App Router, mỗi endpoint vẫn dùng file `route.ts` tại thư mục phản ánh path.

## 3. Quy ước đặt tên

| Thành phần | Quy ước | Ví dụ |
|---|---|---|
| API path và segment URL | kebab-case | `home-page`, `logout-all`, `thieu-nhi/import/preview` |
| Component và component folder | PascalCase | `ClassPicker/ClassPicker.tsx` |
| Hook, service, utility và biến | camelCase | `useThieuNhiList`, `importService`, `selectedClassId` |
| Type/interface | PascalCase | `ResolvedPermission`, `ImportPreviewRow` |
| Hằng số | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE`, `IMPORT_FILE_CONSTRAINTS` |
| Component stylesheet | `<Component>.module.scss` | `ImportExcelModal.module.scss` |
| DTO/API field | camelCase | `soDienThoai`, `assignedClasses`, `ngaySinh` |
| Tên cột/model DB | Theo schema hiện tại, chủ yếu snake_case | `ten_tai_khoan`, `ngay_sinh` |

Backend dùng alias `@/src/...` nhất quán. Frontend dùng đường dẫn tương đối theo cấu hình Vite hiện tại. Không trộn hai kiểu import trong cùng một file. Tên Prisma/DB chỉ được chuyển thành camelCase tại ranh giới API, ví dụ `toPublicUser` và mapper trong service.

## 4. Frontend: luồng dữ liệu và tìm kiếm

`apiClient` là nơi ghép `VITE_API_URL`, gửi cookie với `credentials: 'include'`, đọc JSON và chuẩn hóa lỗi. Service gọi endpoint tương đối với `/api`, không tự thêm `/api` lần nữa.

`useThieuNhiList` dùng query key:

```ts
['thieu-nhi', taiKhoanId, classId, {
  page,
  pageSize,
  search,
  trangThai,
  includeAttendance,
}]
```

Từng lớp và từng bộ lọc có cache riêng. Tìm kiếm được debounce trước khi gọi API; đổi lớp hoặc điều kiện lọc tạo query khác. Tìm một lớp khác dùng chính hook/API đó với `classId` mới. Tìm xuyên nhiều lớp, nếu được bổ sung, phải là chức năng riêng và backend tự ràng buộc tập lớp theo quyền; `ClassPicker` hiện chỉ nhận một `selectedId`.

Backend kiểm tra UUID lớp, quyền xem, trang, kích thước trang, từ khóa và trạng thái. `pageSize` được nhận trong giới hạn 1–100. Truy vấn chỉ lấy dữ liệu thuộc `classId`; tìm kiếm chuẩn hóa dấu tiếng Việt ở backend.

Khi logout, frontend xóa cache bằng `queryClient.clear()` để dữ liệu query không được dùng lại ở session khác.

## 5. Xác thực và phân quyền

### Session

`sessionService` tạo token ngẫu nhiên trong `phien_dang_nhap`. `sessionCookie` đặt, đọc và xóa cookie `sid`. `requireAuth` đọc cookie, xác thực session server-side rồi gọi `resolvePermissions(taiKhoanId)`.

### `ResolvedPermission`

`resolvePermissions` trả một snapshot quyền đã tổng hợp từ các phân công đang hiệu lực:

- `roles`: các role hiệu lực.
- `assignedClasses`: lớp gắn với phân công phụ trách lớp được chấp nhận.
- `viewableClasses`: lớp được xem qua phân công lớp/ngành.
- `editableClasses`: hiện lấy từ các lớp được phân công, dùng làm cơ sở cho thao tác ghi theo lớp.
- `canViewAllChildren`: quyền xem toàn bộ; gồm nhóm role đọc toàn cục và nhóm quản lý BAN_HC được cấu hình.

Đây là dữ liệu đầu vào cho guard, không tự bảo vệ route nếu route không gọi guard.

### Hai guard lớp

- `requireClassViewAccess(classId)`: gọi `requireAuth`; chấp nhận quyền xem toàn cục hoặc lớp thuộc `viewableClasses`.
- `requireClassAccess(classId)`: gọi `requireAuth`; chỉ chấp nhận lớp thuộc `editableClasses`. Quyền đọc toàn cục không cấp quyền import/sửa.

Route đọc danh sách dùng guard xem. Route import/ghi theo lớp dùng guard ghi. Endpoint liệt kê lớp không có một `classId` cố định nên xác thực trước, sau đó lọc từng lớp bằng `canViewClass`.

## 6. Import Excel

### Preview hiện tại

1. `ImportExcelModal` kiểm tra nhanh đuôi, dung lượng và file rỗng bằng `validateSelectedFile`.
2. `parseImportExcel` dùng `xlsx` phía frontend để đọc sheet đầu, ánh xạ header và chuyển ngày sang `YYYY-MM-DD`.
3. Frontend gửi các trường dữ liệu cần thiết cùng `classId` tới `POST /api/thieu-nhi/import/preview`.
4. Backend gọi `requireClassAccess`, giới hạn số dòng/trường, validate lại dữ liệu và tính trùng trong file.
5. Backend chỉ đọc đoàn sinh thuộc đúng lớp, trả về lỗi/cảnh báo và không ghi DB.
6. `ImportPreviewTable` cho phép sửa hoặc đánh dấu bỏ dòng. Sau khi chỉnh sửa, cảnh báo trùng trên dòng đã sửa bị xóa; commit về sau vẫn phải validate lại toàn bộ.

Frontend validation chỉ để phản hồi nhanh, không phải ranh giới bảo mật. Preview gửi dữ liệu đã parse, không gửi file Excel gốc lên backend. Nếu sau này muốn backend nhận và parse file gốc, cần thêm thư viện xử lý workbook ở backend cùng kiểm tra dung lượng/định dạng phía server.

### Chưa triển khai

Nút xác nhận chưa có endpoint commit. Khi bổ sung, backend phải xác thực và kiểm quyền lần nữa, validate dữ liệu cuối, xác định chính sách dòng trùng/lỗi, rồi ghi theo transaction và lưu thông tin kiểm toán. Không được tin `fieldErrors`, `duplicateInFile`, `dbDuplicate` hay `removed` do client gửi.

Quy tắc trùng hiện tại đánh dấu khi trùng họ tên **hoặc** ngày sinh. Trùng ngày sinh riêng có thể cảnh báo quá rộng; cần chốt quy tắc nghiệp vụ trước khi dùng làm điều kiện chặn ghi.

## 7. CSS và design tokens

- CSS Modules là cách viết style component; dùng `.module.scss`.
- Dashboard dùng `frontend/src/styles/dashboard-tokens.css`; biến đặt `--dash-*` và chỉ khai báo trong `.dashboard-scope`.
- `frontend/src/index.css` giữ token trang chủ/đăng nhập. Hai bộ token không gộp vào nhau.
- Các trang danh sách đoàn sinh dùng stylesheet dùng chung `DoanSinhListPage.module.scss`; component con giữ stylesheet theo tên component.

## 8. Các phần còn là placeholder

- `GET /api/home-page` hiện trả mảng dữ liệu mẫu.
- Điểm số trong danh sách hiện được trả `null` cho các trường điểm chưa nối dữ liệu.
- Import có preview và kiểm tra DB; chưa có commit/ghi DB.
- Một số hành động dashboard như xuất danh sách và tạo phiếu điểm danh chưa triển khai.
