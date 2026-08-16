// 4 mốc bổ sung theo kịch bản. Ảnh tư liệu do người dùng cung cấp — đặt vào
// public/images/photos/ đúng tên `image`; thiếu ảnh thì hiện lớp biểu tượng
// (typography + hoạ tiết) thay thế, không lỗi.
export type MilestoneSymbol = 'letter' | 'flag' | 'sickle' | 'star';

export interface Milestone {
  id: string;
  year: string;
  eyebrow: string;
  heading: string;
  keyText: string; // câu "nhấn" lớn
  caption: string;
  image: string;
  symbol: MilestoneSymbol;
  background: string;
  // true = show the image small & whole (no zoom/crop) — for documents/paintings;
  // false/undefined = full-bleed cinematic background
  contain?: boolean;
}

export const MILESTONES: Record<string, Milestone> = {
  y1919: {
    id: 'chapter-1919',
    year: '1919',
    eyebrow: 'Hội nghị Versailles · Pháp',
    heading: 'Bản yêu cầu của nhân dân An Nam',
    keyText: 'TIẾNG NÓI CHÍNH NGHĨA',
    caption:
      'Một tên tuổi mới xuất hiện — Nguyễn Ái Quốc — thay mặt những người An Nam yêu nước gửi bản Yêu cầu đòi quyền tự do, bình đẳng cho dân tộc.',
    image: '/images/photos/m1919.webp',
    symbol: 'letter',
    background: 'linear-gradient(180deg, #080808 0%, #1a140c 50%, #080808 100%)',
    contain: true, // a document — show it whole, not zoomed
  },
  y1920: {
    id: 'chapter-1920',
    year: '1920',
    eyebrow: 'Tháng 12 · Đại hội Tours',
    heading: 'Bước ngoặt tại Đại hội Tours',
    keyText: 'TÌM THẤY CHÂN LÝ',
    caption:
      '“Đây là cái cần thiết cho chúng ta, đây là con đường giải phóng chúng ta!” — Nguyễn Ái Quốc trở thành người Cộng sản đầu tiên của Việt Nam.',
    image: '/images/photos/m1920.webp',
    symbol: 'flag',
    background: 'linear-gradient(180deg, #080808 0%, #2a0f0d 55%, #080808 100%)',
  },
  y1930: {
    id: 'chapter-1930',
    year: '1930',
    eyebrow: '3 · 2 · 1930 · Hương Cảng',
    heading: 'Thành lập Đảng Cộng sản Việt Nam',
    keyText: 'NGỌN HẢI ĐĂNG',
    caption:
      'Nguyễn Ái Quốc chủ trì hội nghị hợp nhất các tổ chức cộng sản — cách mạng Việt Nam từ đây có một đội tiên phong lãnh đạo.',
    image: '/images/photos/m1930.webp',
    symbol: 'sickle',
    background: 'radial-gradient(ellipse at center, #2a0f0d 0%, #080808 72%)',
    contain: true, // a painting with many figures — show it whole, not cropped
  },
  y1954: {
    id: 'chapter-1954',
    year: '1954',
    eyebrow: 'Chiến dịch lịch sử',
    heading: 'Chiến thắng Điện Biên Phủ',
    keyText: 'LỪNG LẪY NĂM CHÂU',
    caption:
      '“Lừng lẫy năm châu, chấn động địa cầu” — đập tan ách thống trị của thực dân Pháp, bảo vệ vững chắc nền độc lập vừa giành được.',
    image: '/images/photos/m1954.webp',
    symbol: 'flag',
    background: 'linear-gradient(180deg, #080808 0%, #12100e 45%, #080808 100%)',
  },
};
