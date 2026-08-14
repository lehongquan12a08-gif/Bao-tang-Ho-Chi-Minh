// ---------------------------------------------------------------------------
//  DÒNG THỜI GIAN — Verified historical milestones
//  Nguồn tham khảo: Bảo tàng Hồ Chí Minh, Hồ Chí Minh Toàn tập (NXB CTQG).
//  Chỉ dùng các dữ kiện & năm đã được kiểm chứng. Không tự sáng tác trích dẫn.
// ---------------------------------------------------------------------------

export interface TimelineEntry {
  id: string;
  year: string;
  short: string;
}

/** Các mốc hiển thị trên thanh Timeline Indicator (phải màn hình desktop). */
export const timelineMarkers: TimelineEntry[] = [
  { id: 'hero', year: '1890', short: 'Sinh ra' },
  { id: 'chapter-1911', year: '1911', short: 'Ra đi tìm đường' },
  { id: 'chapter-1919', year: '1919', short: 'Bản yêu cầu An Nam' },
  { id: 'chapter-1920', year: '1920', short: 'Đại hội Tours' },
  { id: 'chapter-1930', year: '1930', short: 'Thành lập Đảng' },
  { id: 'chapter-1941', year: '1941', short: 'Trở về Tổ quốc' },
  { id: 'chapter-1945', year: '1945', short: 'Tuyên ngôn Độc lập' },
  { id: 'chapter-1954', year: '1954', short: 'Điện Biên Phủ' },
  { id: 'final', year: '1969', short: 'Trọn một cuộc đời' },
];

/** Trích dẫn đã được kiểm chứng, dùng cho Quote Section. */
export const verifiedQuote = {
  text: 'KHÔNG CÓ GÌ QUÝ HƠN ĐỘC LẬP, TỰ DO',
  attribution: 'Chủ tịch Hồ Chí Minh',
  context: 'Lời kêu gọi, 17 tháng 7 năm 1966',
};

export const NAV_LINKS = [
  { label: 'Hành trình', href: '#hero' },
  { label: 'Dòng thời gian', href: '#chapter-1911' },
  { label: 'Tư liệu', href: '#gallery' },
  { label: 'Nghe & Xem', href: '#media' },
  { label: 'Về dự án', href: '#footer' },
];
