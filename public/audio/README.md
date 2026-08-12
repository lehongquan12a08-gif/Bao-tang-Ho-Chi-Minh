# Âm thanh — Hành trình theo chân Bác

Bỏ các file dưới đây vào đúng đường dẫn là web tự phát (bấm nút loa góc phải để
bật). Thiếu file nào thì phần đó **im lặng, không lỗi** — web vẫn chạy bình thường.

## File cần có

| Đường dẫn | Vai trò | Gợi ý âm |
|---|---|---|
| `public/audio/ambient.mp3` | **Nhạc nền** (loop suốt trang) | Trang nghiêm, không lời: đàn bầu / sáo / dây + drone điện ảnh. ~2–4 phút, loop mượt. |
| `public/audio/sfx/ship-1911.mp3` | Chương **1911** | Còi tàu xa + sóng biển nhẹ (loop). |
| `public/audio/sfx/mountain-1941.mp3` | Chương **1941** | Gió núi + chim rừng (loop). |
| `public/audio/sfx/crowd-1945.mp3` | Chương **1945** | Đám đông rì rào rất khẽ (loop). |

## Yêu cầu kỹ thuật
- Định dạng: **`.mp3`** (tương thích mọi trình duyệt). Có thể thêm bản `.webm/opus`
  nếu muốn nhẹ hơn (khi đó sửa đường dẫn trong `components/AudioController.tsx`).
- **Chuẩn hóa âm lượng** trước (các track không chênh nhau). Hệ thống đã hạ nền
  ~20% và SFX ~25% nên file gốc để mức bình thường là được.
- Loop **liền mạch** (không có khoảng lặng đầu/cuối) — quan trọng với nhạc nền.
- Dung lượng: nén vừa phải (nhạc nền ~2–4MB, SFX < 1MB mỗi file).

## Chỉnh âm lượng / thêm chương
Sửa hằng số trong `components/AudioController.tsx`:
- `AMBIENT_VOL` — âm lượng nhạc nền (0–1).
- Mảng `SFX` — thêm/bớt `{ id: '<id-section>', src, vol }`. `id` phải trùng
  thuộc tính `id` của `<section>` chương (vd. `chapter-1941`).

## ⚠️ Bản quyền
Chỉ dùng nhạc/âm thanh bạn có quyền (mua, tự làm, hoặc CC0/royalty-free đúng giấy
phép). Nếu giấy phép yêu cầu ghi công (CC-BY), thêm dòng credit ở mục "Về dự án".
