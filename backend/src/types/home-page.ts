

export interface HomePage {
  id: number;
  weekNumber: number;       // Tuần thứ mấy trong năm
  year: number;
  title: string;            // Tiêu đề tổng kết tuần
  summary: string;          // Tóm tắt ngắn hiển thị ở trang chủ
  content: string;          // Nội dung chi tiết
  totalChildren: number;    // Số thiếu nhi tham gia
  activities: string[];     // Danh sách hoạt động trong tuần
  publishedAt: string;      // ISO date string
  coverImage?: string;
}
