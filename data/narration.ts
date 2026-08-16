// LỒNG TIẾNG THEO CHƯƠNG — phát đúng ĐOẠN trong 2 file voice (không cần cắt file).
// Khi cuộn tới một chương, hệ thống đặt currentTime = start, phát tới end rồi dừng.
//
//  Part 1 = /audio/voice/part-1.m4a  (~86.7s)  — mở đầu → 1920
//  Part 2 = /audio/voice/part-2.m4a  (~153.5s) — 30 năm → kết
//
//  ⚠️ CÁC MỐC DƯỚI ĐÂY LÀ ƯỚC LƯỢNG. Bạn nghe 2 file rồi chỉnh `start`/`end`
//     (đơn vị: giây) cho khớp giọng đọc. Chỉ sửa số, không cần đụng code.
export interface NarrationCue {
  id: string; // id của <section> chương
  part: 1 | 2;
  start: number; // giây
  end: number; // giây
  // dải cuộn con (0..1) của section mà đoạn này quét qua. Mặc định cả section
  // [0,1]. Với 1945: thuyết minh chỉ quét băng đầu để đọc XONG rồi mới tới bản
  // ghi Tuyên ngôn (xem DECL_SCROLL trong AudioController).
  scroll?: [number, number];
}

export const NARRATION_FILES: Record<1 | 2, string> = {
  1: '/audio/voice/part-1.m4a',
  2: '/audio/voice/part-2.m4a',
};

export const NARRATION: NarrationCue[] = [
  // ── Part 1 (mở đầu → 1920) ──────────────────────────────
  { id: 'hero', part: 1, start: 0, end: 15 },
  { id: 'chapter-1890', part: 1, start: 15, end: 31 },
  { id: 'chapter-1911', part: 1, start: 31, end: 52 },
  { id: 'chapter-1919', part: 1, start: 52, end: 66 },
  { id: 'chapter-1920', part: 1, start: 66, end: 86 },
  // ── Part 2 (30 năm → kết) ───────────────────────────────
  { id: 'chapter-nguyen-ai-quoc', part: 2, start: 0, end: 24 },
  { id: 'chapter-1930', part: 2, start: 24, end: 39 },
  { id: 'chapter-1941', part: 2, start: 39, end: 60 },
  // thuyết minh 1945 chỉ quét băng đầu (chữ ngày tháng); đọc xong mới tới bản
  // ghi Tuyên ngôn ở băng giữa (DECL_SCROLL), rồi ĐỘC LẬP / TỰ DO
  { id: 'chapter-1945', part: 2, start: 60, end: 74, scroll: [0, 0.3] },
  { id: 'chapter-1954', part: 2, start: 83, end: 98 },
  { id: 'map', part: 2, start: 98, end: 116 },
  // lời khép lại: mở trên ảnh chân dung Bác (final) rồi TIẾP TỤC đọc trong khi
  // lướt qua trọn phần Tư liệu (gallery) — hình và tiếng cùng khép lại
  { id: 'final', part: 2, start: 116, end: 130 },
  { id: 'gallery', part: 2, start: 130, end: 153 },
  // Nghe & Xem (media), footer — để im, người xem tự xem
];
