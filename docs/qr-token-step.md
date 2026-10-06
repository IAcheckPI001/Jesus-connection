Kế hoạch cấp QR định danh cho thiếu nhi

## Tóm tắt

Mỗi thiếu nhi có một QR riêng, chứa token ngẫu nhiên. Backend lưu hash của token; frontend nhận token một lần để tạo và in thẻ. Đổi API cấp mã sang `/api/thieu-nhi/{id}/qr-token`.

Với import Excel, **chỉ cấp QR sau khi import đã lưu thành công**. Đây là bước riêng sau commit, không gắn việc tạo QR vào preview hay cùng transaction nhập dữ liệu. Như vậy lỗi cấp QR không làm hỏng hoặc phải rollback danh sách thiếu nhi vừa import; có thể cấp bù sau.

## Thay đổi chính

- **Backend:** thêm `qr_token_hash VARCHAR(64) UNIQUE NULL` vào `doan_sinh`. Sinh token bằng bộ tạo ngẫu nhiên mật mã, lưu SHA-256 dạng hex; không lưu token thô hoặc trả hash cho frontend.
- **API cấp một mã:** `POST /api/thieu-nhi/{id}/qr-token`. Bắt buộc đăng nhập và có quyền ghi đúng lớp qua `requireClassAccess`; xác minh thiếu nhi thuộc lớp đó. Cấp lại sẽ thay hash để vô hiệu hóa mã cũ.
- **API cấp hàng loạt sau import:** thêm `POST /api/thieu-nhi/qr-tokens/batch`, nhận danh sách ID thiếu nhi vừa import và trả token một lần cho các mã được cấp. Backend xác minh các em thuộc lớp được phép ghi. Không gọi API này trong bước preview.
- **Frontend:** sau khi import commit thành công, hiển thị thao tác “Tạo mã QR và in thẻ”. Gọi API hàng loạt, tạo ảnh QR tại trình duyệt và dàn trang in/PDF. Token chỉ giữ trong bộ nhớ của luồng cấp/in; không ghi vào local storage hay hồ sơ.
- Mã QR chỉ chứa token opaque; thông tin cần nhìn trên thẻ như họ tên, mã đoàn sinh và lớp được in riêng dưới dạng chữ. Cấp lại thẻ sẽ tạo mã mới, QR cũ hết hiệu lực.

## Kiểm tra và nghiệm thu

- Database từ chối hash trùng; hồ sơ chưa cấp mã vẫn được lưu với giá trị `NULL`.
- Người chỉ có quyền xem không cấp được mã; người có quyền ghi chỉ cấp được cho thiếu nhi thuộc lớp được phân công.
- Token thô chỉ xuất hiện trong response cấp mã; hash không bị trả về hoặc ghi log.
- Import thành công nhưng cấp QR thất bại vẫn giữ nguyên dữ liệu đã import; người dùng có thể chạy lại bước cấp QR.
- QR cũ không còn tra cứu được sau khi cấp lại; QR mới ánh xạ đúng thiếu nhi.
- Frontend tạo được trang in/PDF từ kết quả cấp mã mà không lưu token lâu dài.

## Giả định

- Luồng import hiện mới có preview; API commit chưa được triển khai. QR chỉ được cấp sau khi commit thành công.
- Mỗi em chỉ có một QR đang hiệu lực. Nếu phản hồi cấp hàng loạt bị mất sau khi backend đã lưu hash, thao tác cấp lại sẽ xoay mã; thẻ cũ khi đó không còn hiệu lực.
