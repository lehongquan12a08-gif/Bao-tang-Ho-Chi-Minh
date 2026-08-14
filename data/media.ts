// Mục "Nghe & Xem" — video nhúng từ YouTube (nhúng iframe là hợp pháp).
// Thay/thêm bằng LINK CHÍNH THỨC bạn muốn: chỉ cần lấy phần id trong URL
//   https://www.youtube.com/watch?v=<ID>  →  id: '<ID>'
export interface MediaItem {
  id: string; // YouTube video id
  title: string;
  kind: string; // 'Bài hát' | 'Phim · Kịch' | 'Tư liệu' ...
  by?: string;
}

export const MEDIA: MediaItem[] = [
  { id: 'KGf0T3fdv8k', title: 'Ai yêu Bác Hồ Chí Minh hơn thiếu niên nhi đồng', kind: 'Bài hát', by: 'Nhạc: Phong Nhã' },
  { id: 'SpK4hTcVDqE', title: 'Như có Bác trong ngày vui đại thắng', kind: 'Bài hát', by: 'Nhạc: Phạm Tuyên · Thu thanh 30/4/1975' },
  // Dán thêm link chính thức của bạn vào đây, ví dụ:
  // { id: 'XXXXXXXX', title: 'Hồ Chí Minh đẹp nhất tên Người', kind: 'Bài hát' },
  // { id: 'XXXXXXXX', title: 'Trích đoạn kịch / phim tài liệu về Bác', kind: 'Phim · Kịch' },
  // { id: 'XXXXXXXX', title: 'Bác Hồ đọc Tuyên ngôn Độc lập (video tư liệu)', kind: 'Tư liệu' },
];
