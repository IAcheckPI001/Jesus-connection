# Báo cáo rà soát cấu trúc dự án

**Ngày rà soát:** 30/09/2026  
**Phạm vi:** `backend/` (Next.js App Router, Prisma, PostgreSQL/Supabase) và `frontend/` (React, Vite, TypeScript).  
**Phương pháp:** đọc tĩnh cấu trúc, cấu hình và mã nguồn; không chạy ứng dụng, không sửa mã nguồn và không truy cập giá trị bí mật trong `.env`.

## 1. Tóm tắt

Dự án đã tách frontend và backend thành hai ứng dụng độc lập, có lớp service/hook phía React, Route Handler phía Next.js, và dùng session server-side lưu trong PostgreSQL cùng cookie `HttpOnly`. Cấu trúc này có nền tảng hợp lý cho mô hình SPA gọi API.

Hiện tại luồng đăng nhập chưa nối hoàn chỉnh từ UI đến API: URL frontend mặc định không khớp route Next.js; kiểu dữ liệu response không khớp; trạng thái đăng nhập không được khôi phục khi tải lại trang; và route dashboard không được bảo vệ. Backend có helper xác thực và phân quyền, nhưng proxy chỉ đặt CORS header, không xác thực hoặc chặn truy cập. Dữ liệu dashboard chính hiện vẫn lấy từ mock, chưa đi qua API.

Các vấn đề ưu tiên cao nhất là bảo vệ mọi API có dữ liệu thật ở backend, thống nhất hợp đồng/đường dẫn API, hoàn chỉnh khôi phục session và sửa biểu thức kiểm tra vai trò đang loại `PHU_LOP` khỏi quyền.

## 2. Cấu trúc và quy ước đặt file

### Backend

- `backend/src/app/` đang dùng App Router đúng hướng: `api/<resource>/route.ts` cho endpoint, cùng `layout.tsx`, `page.tsx` và CSS toàn cục.
- Logic được tách ra `src/lib/services`, `src/lib/session`, `src/lib/permissions`, `src/lib/config`, `src/lib/constants`; kiểu API ở `src/types`. Đây là phân tầng dễ lần theo ở quy mô hiện tại.
- Route `homePage` dùng camelCase, trong khi `auth`, `logout-all` dùng chữ thường/kebab-case. Nên chuẩn hóa resource path thành chữ thường/kebab-case (`home-page` hoặc `home`) và giữ nhất quán tên file/folder.
- Import alias chưa đồng nhất: có cả `@/src/lib/...` và import tương đối như `../prisma`. Nên chọn một cách (thường alias nhất quán) để tránh đường dẫn tương đối dài và dễ gãy khi di chuyển file.
- `src/app/page.tsx`, `layout.tsx`, `globals.css` và các ảnh mặc định Next.js còn là nội dung scaffold. Nếu Next chỉ làm API, trang scaffold tạo một bề mặt UI không chủ định; nếu có chủ ý phục vụ trang này, nên ghi rõ phạm vi hai ứng dụng và domain triển khai.
- `prisma7.config.ts` khai báo `prisma/migrations`, nhưng danh sách file dự án chỉ có `prisma/schema.prisma`, không thấy migration được quản lý. Nếu schema được quản lý trực tiếp trên Supabase thì cần ghi rõ quy trình và nguồn sự thật; nếu không, thiếu migration làm giảm khả năng tái tạo DB ở môi trường mới.
- Prisma schema cấu hình output client trong `src/generated/prisma`; code import client từ vị trí đó. Generated client không nằm trong danh sách file nguồn được quản lý, vì vậy quy trình cài đặt/build cần đảm bảo `prisma generate` chạy trước khi biên dịch và deploy.
- `README.md` backend vẫn là hướng dẫn Next.js scaffold, chưa mô tả biến môi trường, Prisma/Supabase, migration/generate, route API hay cách chạy cùng frontend. `CLAUDE.md` chỉ chuyển tiếp tới `AGENTS.md`; đây là hướng dẫn công cụ, không thay thế tài liệu vận hành dự án.

### Frontend

- `frontend/src/` đã phân chia theo `pages`, `layouts`, `components`, `hooks`, `services`, `types`, `utils`, `constants`, `mocks`, `assets`, `styles`. Cách chia này nhìn chung phù hợp với SPA hiện tại.
- Tên component dùng PascalCase và hook/service/type dùng camelCase; CSS module đặt cạnh component/page. Tuy vậy, quy ước CSS chưa thống nhất: phần lớn là `.module.scss`, còn Excel modal dùng `.module.css`.
- `types` chứa cả kiểu miền dữ liệu và kiểu luồng import/UI (`types/importFile.ts`), còn cấu trúc dashboard phân theo component lồng nhiều tầng. Có thể giữ cách này ở quy mô hiện tại; nếu phát triển thêm nên nhóm theo feature (auth, thiếu nhi, import) để service, hook, type và UI cùng miền nằm gần nhau.
- Tài liệu đang nằm ở `frontend/src/docs/`; đây là vị trí không phù hợp cho tài liệu dự án và có thể bị xem như nội dung thuộc bundle/source. File `frontend/src/docs/structure-project-reported.md` hiện rỗng (0 byte). Báo cáo này được đặt ở `docs/structure-project-reported.md` tại gốc dự án theo yêu cầu.
- Hai thư mục `backend/` và `frontend/` có package riêng, nhưng không có cấu hình workspace/root script chung được thấy trong danh sách file. Người vận hành cần chuyển thư mục để cài/chạy/lint/build từng phần; nên cân nhắc tài liệu lệnh gốc hoặc workspace nếu muốn chuẩn hóa CI.

## 3. Components và mã có dấu hiệu dư thừa/chưa dùng

- Không thấy bằng chứng `DashboardLayout/Sidebar.tsx` và `components/Sidebar.tsx` là hai component trùng chức năng hoàn toàn: một component dùng cho dashboard, component còn lại được `MainLayout` dùng ở trang chính. Tuy nhiên, tên `Sidebar` trùng nhau dễ gây nhầm khi import; có thể đổi tên theo ngữ cảnh (`DashboardSidebar`, `PublicSidebar`).
- `components/Sidebar.tsx` điều hướng tới `/reports`, `/classes`, `/activities`, nhưng `App.tsx` không khai báo các route này. Các liên kết này dẫn tới trang không được định nghĩa; cần bổ sung route hoặc cập nhật menu theo trang hiện có.
- `DashboardLayout/Sidebar.tsx` và `MobileDrawer.tsx` chia sẻ `menuItems` và `NavItem`, nên phần điều hướng đã tái sử dụng hợp lý. Tuy nhiên, thông tin `UserMenu` đang hard-code tên/role ở cả desktop và mobile; nó chưa dùng session thực và bị lặp dữ liệu.
- `useThieuNhiList` và `useLopOptions` đều dùng `mocks/thieuNhiMock.ts`; đây là giao diện mẫu chứ chưa phải dữ liệu backend. `useThieuNhiList` giả lập chờ 300 ms và refetch vẫn tính lại mock, dễ khiến người đọc hiểu nhầm đã có tải dữ liệu API.
- `services/authService.ts` khai báo `getCurrentUser` và `logout`, nhưng trong frontend hiện chỉ có `login` được gọi. Backend có endpoint `/api/auth/logout-all` nhưng frontend không có hàm service tương ứng. `useAuth` cũng chưa có logout hoặc khởi tạo phiên.
- Trong backend, các helper `findUserById`, `getAllUsers`, `createUser`, `updateUser` ở `lib/services/authService.ts` không được dùng bởi route hiện có. Nên xác định đây là API dự kiến hay mã bỏ dở; đặc biệt `createUser`/`updateUser` ghi trực tiếp `mat_khau`, nên nếu được gọi với mật khẩu thô sẽ lưu mật khẩu không hash, trái với giả định `bcrypt.compare` trong login.
- `UserMenu` chỉ là nút hiển thị, chưa có hành động mở menu/logout; `MobileTopbar` có nút tìm kiếm chỉ hiển thị, chưa nối hành vi. Đây là phần UI chưa hoàn chỉnh hơn là component dư thừa.

## 4. Luồng Frontend → API

### Những gì đang có

- `services/apiClient.ts` là điểm gọi `fetch` tập trung: thêm JSON header, `credentials: 'include'`, parse lỗi và đóng gói `ApiError`. `authService.ts` và `homePageService.ts` dùng lại client; đây là hướng tổ chức phù hợp.
- `VITE_API_URL` được dùng làm base URL và không có fallback. Nếu cấu hình thiếu, lỗi được ném ở client. `vite.config.ts` không khai báo proxy `/api`, do vậy local development phụ thuộc URL môi trường và CORS thật.
- `frontend/src/services/authService.ts` gọi `/auth/login`, `/auth/me`, `/auth/logout`, trong khi Next.js route nằm tại `/api/auth/...`. `homePageService.ts` gọi `/homePage`, còn backend có `/api/homePage`. Chúng chỉ khớp nếu `VITE_API_URL` được đặt bao gồm hậu tố `/api`; điều này cần được quy định rõ hoặc thống nhất endpoint có prefix `/api` trong client.
- Kiểu frontend `AuthUser` khai báo `username`, `fullName`, `role`; backend `toPublicUser` trả `id`, `so_dien_thoai`, `ten_thanh`, `ho_ten`, `roles`, `assignedClasses`. Backend login còn trả thêm `canAccessDashboard`, nhưng `LoginResponse` không khai báo. Vì vậy TypeScript hiện không phản ánh JSON runtime và UI không thể dùng đúng thông tin user/quyền.
- `useAuth` chỉ thực hiện login rồi điều hướng dashboard. Nó in user ra console, không lưu vào auth context/store, không gọi `/me` khi tải ứng dụng, và không sử dụng `canAccessDashboard`. Sau refresh, frontend không biết trạng thái session dù cookie vẫn còn.
- React Router khai báo `/dashboard` trực tiếp bằng `DashboardLayout`, không có route guard/loading xác thực. Người chưa đăng nhập vẫn vào được trang giao diện dashboard; đây chưa phải bypass dữ liệu nếu API bảo vệ đúng, nhưng UI không được bảo vệ và dễ che khuất việc backend endpoint chưa kiểm soát.
- Home page dùng API thật/hard-coded từ backend, nhưng response backend có `week`, trong khi frontend type định nghĩa `weekNumber`, `year`, `summary`, `content`, `activities`, `publishedAt`. Page hiện chỉ đọc `id` và `title`, các trường còn lại không gây lỗi ở render này nhưng hợp đồng đang sai.
- API client trả lỗi 401 chung dưới dạng `ApiError`, nhưng chưa có chính sách toàn cục khi session hết hạn (ví dụ đồng bộ trạng thái đăng nhập/điều hướng login). Chưa có hủy request/timeout; đây là cải tiến vận hành, ưu tiên thấp hơn các lỗi hợp đồng và bảo vệ route.

### Hướng xử lý

1. Chốt quy ước URL API (base URL là origin backend hay origin kèm `/api`) và sửa thống nhất tất cả service theo quy ước đó; bổ sung cấu hình proxy Vite nếu muốn local dev cùng origin.
2. Định nghĩa hợp đồng response chung đúng với JSON backend, gồm user và quyền dashboard; tốt hơn nữa dùng schema kiểm tra runtime cho body login và response API.
3. Tạo một nguồn trạng thái auth cấp ứng dụng: gọi `/me` lúc khởi động, phân biệt loading/anonymous/authenticated, cung cấp login/logout và xử lý 401; route dashboard dùng guard cho UX.
4. Giữ xác thực và kiểm tra quyền ở từng API backend. Route guard React chỉ là trải nghiệm điều hướng, không phải ranh giới bảo mật.
5. Thay dữ liệu mẫu bằng endpoint có phân trang/lọc phù hợp sau khi API nghiệp vụ được xây; bỏ mock hoặc đặt rõ cờ demo khi không còn dùng.

## 5. Đăng nhập, session và bảo mật

### Điểm tốt

- Mật khẩu được so sánh qua `bcrypt.compare`; response lỗi đăng nhập không phân biệt tài khoản không tồn tại và sai mật khẩu.
- Session tạo token ngẫu nhiên 32 byte, lưu server-side trong `phien_dang_nhap`; cookie `sid` đặt `HttpOnly`, `SameSite=Lax`, `Path=/`, thời hạn 7 ngày và `Secure` khi `NODE_ENV=production`.
- Logout xóa session hiện tại; logout-all yêu cầu session hợp lệ trước khi xóa session của tài khoản.
- `toPublicUser` chỉ trả các trường công khai thay vì trả nguyên bản ghi tài khoản có trường `mat_khau`.

### Rủi ro cần xử lý

| Mức | Vấn đề và tác động | Hướng xử lý |
|---|---|---|
| **P0** | Chưa có API nghiệp vụ nào trong danh sách hiện tại dùng `requireAuth`/permission guard; endpoint home page cũng trả dữ liệu không xác thực. Khi nối DB thật, chỉ bảo vệ route React là không đủ, client có thể gọi API trực tiếp. | Bắt buộc xác thực và phân quyền theo resource/action trong từng Route Handler (hoặc tầng service dùng chung); kiểm tra cả phạm vi lớp trước đọc/ghi. Viết ma trận role/action rõ ràng. |
| **P1** | `canAccessDashboard` chỉ được trả về sau login nhưng frontend không dùng; ngoài ra `App.tsx` không có guard. Bất kỳ ai cũng có thể tải dashboard UI. | Đồng bộ `/me` và dùng guard UI để điều hướng; vẫn kiểm tra tương tự ở backend cho từng API. |
| **P1** | `roles.includes(ROLES.CHU_NHIEM_LOP || ROLES.PHU_LOP)` luôn kiểm tra `CHU_NHIEM_LOP` vì toán tử `||` trả về vế đầu tiên truthy. Người chỉ có `PHU_LOP` không được công nhận ở `dashboard.ts` và `classPermission.ts`. | Kiểm tra từng role riêng (ví dụ `includes(A) || includes(B)`) hoặc dùng tập role cho phép; thêm coverage cho từng role. |
| **P1** | `resolvePermissions` ghi chú lấy phân công niên khóa hiện tại nhưng chỉ lọc `trang_thai = dang_phan_cong`, không lọc `id_nien_khoa` theo niên khóa hiện hành. Role/lớp từ niên khóa cũ có thể còn hiệu lực. | Xác định nguồn niên khóa hiện hành và lọc theo nó trong truy vấn; xác nhận quyền khi dùng API, không chỉ lúc đăng nhập. |
| **P1** | Route login parse body trực tiếp rồi truy vấn/so sánh mà không xác thực kiểu, độ dài hoặc định dạng. JSON sai/missing username/password có thể thành lỗi 500 hoặc gọi bcrypt với giá trị không hợp lệ. Không thấy giới hạn thử đăng nhập. | Validate body bằng schema, giới hạn kích thước/định dạng đầu vào, trả lỗi 400 nhất quán; thêm rate limit và theo dõi đăng nhập thất bại phù hợp. |
| **P1** | Token session được lưu nguyên văn trong cột `ma_phien`. Rò rỉ DB đồng nghĩa có thể dùng token để chiếm phiên trước hạn. | Lưu hash có khóa/cryptographic digest của token; chỉ gửi token gốc trong cookie và tra bằng hash. Bổ sung thu hồi/rotation theo chính sách. |
| **P1** | Cookie dùng `SameSite=Lax`. Nếu frontend và API được deploy trên hai site khác nhau, cookie thường không được gửi trong fetch cross-site; đổi sang `None` thì cần `Secure` và biện pháp CSRF. `SameSite` không thay thế việc đánh giá CSRF cho cookie-auth. | Chốt topology/domain frontend-backend; ưu tiên cùng site hoặc reverse proxy. Nếu cần cross-site, cấu hình `SameSite=None; Secure`, kiểm tra `Origin`/CSRF token cho request thay đổi dữ liệu. |
| **P2** | `logout-all` có backend nhưng UI/service chưa cung cấp; `getCurrentUser` có service nhưng chưa được gọi. Danh sách session có service nhưng chưa có route UI/API. | Hoàn chỉnh theo nhu cầu sản phẩm; nếu không dùng, xóa helper/endpoint bỏ dở sau khi thống nhất phạm vi. |
| **P2** | `createSession` nhận `userAgent` nhưng không ghi `ten_thiet_bi`; thông tin thiết bị trong session sẽ không được lưu. `x-forwarded-for` được nhận trực tiếp làm IP, có thể giả mạo nếu proxy hạ tầng chưa thiết lập trust. | Lưu user-agent sau khi chuẩn hóa; chỉ tin forwarded IP từ proxy/load balancer đã cấu hình tin cậy. |
| **P2** | `createUser`/`updateUser` ghi `mat_khau` thẳng; nếu truyền mật khẩu chưa hash sẽ lưu dạng rõ. | Tách hàm tạo/cập nhật credential và hash tại một service duy nhất; tránh API CRUD tài khoản trả password hash. |
| **P2** | Cookie 7 ngày khớp DB expiration, nhưng chưa có rotation/refresh. `getSessionByToken` cập nhật `truy_cap_cuoi` kiểu fire-and-forget; lỗi bị nuốt, làm mất độ chính xác audit. | Chốt chính sách session (absolute/idle timeout, rotation); ghi nhận cập nhật last-seen có kiểm soát hoặc chuyển sang cơ chế ít ghi DB hơn. |

## 6. Proxy / CORS

- Backend dùng `src/proxy.ts` và `matcher: '/api/:path*'`, chỉ thêm CORS response headers cho origin khớp chính xác danh sách `ALLOWED_ORIGINS`; xử lý `OPTIONS` bằng 204. Với Next.js 16.3.6, quy ước tên `proxy.ts` và export `proxy` là đúng; Next.js 16 đổi tên convention `middleware` thành `proxy` ([tài liệu Next.js Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)).
- Proxy hiện là CORS/preflight handler, không đọc cookie, không gọi `requireAuth`, không trả 401/redirect, và không gắn context người dùng. Vì vậy không nên mô tả hoặc xem nó là middleware bảo vệ API.
- CORS là quy tắc trình duyệt, không phải xác thực: gọi API từ server/client không phải trình duyệt vẫn có thể truy cập endpoint. Mỗi handler vẫn phải tự kiểm tra session/quyền.
- Header allowlist cho credentials, methods và headers tương đối rõ; cần đảm bảo `ALLOWED_ORIGINS` được cấu hình theo origin đầy đủ (scheme/host/port) ở từng môi trường. `isOriginAllowed` chỉ exact match.
- Không thấy `Vary: Origin`. Nếu có nhiều origin được cho phép và response được cache, cần tránh cache response CORS theo origin sai; thiết lập `Vary: Origin` hoặc chính sách cache phù hợp.
- `homePage/route.ts` lại tự đặt `Access-Control-Allow-Origin: http://localhost:5173`, trái với cấu hình CORS tập trung và có thể tạo header CORS mâu thuẫn/khó dự đoán khi đi qua proxy. Nên để một nơi chịu trách nhiệm CORS.
- Proxy trả 204 cho mọi `OPTIONS` trong matcher, kể cả route không có handler OPTIONS riêng. Nên kiểm tra header preflight yêu cầu thực tế và xử lý nhất quán methods/headers; hiện `apiClient` chỉ dùng GET/POST/PUT/DELETE nên danh sách cơ bản đáp ứng các lời gọi đó.

## 7. Prisma, Supabase và tổ chức API

- `src/lib/prisma.ts` dùng `PrismaPg` và `DATABASE_URL` cho runtime; `prisma7.config.ts` dùng `DIRECT_URL` cho Prisma CLI/migrations. Tách pooled URL/runtime với direct URL/migration là thiết kế thường dùng với Supabase, nhưng cần ghi rõ trong tài liệu môi trường và xác nhận deploy secrets được cấu hình đúng.
- Route handlers gọi service/Prisma trực tiếp; chưa có lớp thống nhất để validate input, chuẩn hóa response/error, transaction hoặc logging. Khi thêm endpoint nghiệp vụ, nên có quy ước handler mỏng → schema validation → service → permission check/DB, tránh mỗi route tự xử lý khác nhau.
- `authService.ts` trộn thao tác xác thực và CRUD tài khoản chung. Nên thu hẹp service theo miền và chỉ export thao tác thật sự cần; thao tác nhạy cảm quản lý tài khoản nên có quyền quản trị và không chia sẻ trực tiếp với route đăng nhập.
- `homePage/route.ts` trả dữ liệu mẫu hard-coded, đồng thời có CORS riêng; chưa dùng Prisma dù dự án có Supabase DB. Đây là endpoint demo, không phải triển khai dữ liệu nghiệp vụ.
- Có unique constraint cho `phien_dang_nhap.ma_phien` và thêm index cùng cột; index thứ hai có thể dư vì unique index đã phục vụ tra cứu chính xác. Xác nhận với DB thực tế/EXPLAIN trước khi bỏ, vì schema được introspect từ DB có thể phản ánh index cần giữ vì lý do khác.

## 8. Kế hoạch xử lý đề xuất

1. **Chặn rủi ro bảo mật trước khi có dữ liệu thật:** xác thực/phân quyền mỗi API; sửa role `PHU_LOP`; xác định niên khóa hiện tại; validate login và đặt rate limit.
2. **Khớp luồng đăng nhập end-to-end:** thống nhất `/api` prefix, types response, `/me` khi tải app, trạng thái auth và guard dashboard; bỏ log user khỏi console.
3. **Cố định session và CORS theo deployment:** chọn topology domain, rà SameSite/CSRF, hash token trong DB, dùng forwarded IP đáng tin cậy, gom CORS vào proxy/config và thêm Vary/cache phù hợp.
4. **Hoàn thiện data contract/API:** thay mocks cho dashboard khi endpoint nghiệp vụ sẵn sàng; đồng bộ type `homePage`; quy chuẩn lỗi/API response.
5. **Chuẩn hóa cấu trúc và vận hành:** đưa tài liệu về root `docs/`, cập nhật README, chuẩn hóa tên route/import/CSS, quyết định migration là nguồn sự thật hay quy trình đồng bộ DB, và thêm lệnh workspace/CI nếu cần.

## 9. Giới hạn rà soát

Đây là rà soát tĩnh trên file hiện có. Không chạy build/lint/test, không kết nối Supabase, không đọc nội dung `.env`, không xác minh CORS/cookie trên domain triển khai thực tế và không kiểm tra dữ liệu/session đang tồn tại trong DB. Do đó, cấu hình hạ tầng, domain frontend/backend, nội dung migration trên Supabase và trạng thái hash của mật khẩu hiện hữu cần được xác minh riêng trước khi kết luận vận hành.
