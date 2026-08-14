# Âm thanh — Hành trình theo chân Bác

**Các file âm thanh GỐC (tự tổng hợp bằng code, an toàn bản quyền) đã có sẵn** và
đang chạy — bấm nút loa góc phải để bật. Muốn thay bằng nhạc thật thì ghi đè đúng
tên file. Thiếu file nào thì phần đó **im lặng, không lỗi**.

Sinh lại các file gốc bất cứ lúc nào: `node scripts/generate-audio.mjs`

## File (đang dùng)

| Đường dẫn | Vai trò | Nội dung hiện tại (gốc) |
|---|---|---|
| `public/audio/ambient.wav` | **Nhạc nền** (loop suốt trang) | Pad trang nghiêm (A thứ ngũ cung), loop liền mạch 24s. |
| `public/audio/sfx/ship-1911.wav` | Chương **1911** | Sóng biển + còi tàu. |
| `public/audio/sfx/mountain-1941.wav` | Chương **1941** | Gió núi + chim rừng. |
| `public/audio/sfx/crowd-1945.wav` | Chương **1945** | Đám đông rì rào khẽ (nền). |
| `public/audio/sfx/declaration-1945.mp3` | Chương **1945** | **Tiếng thật — bản ghi Bác đọc Tuyên ngôn Độc lập.** *Chưa có* → bạn tự bổ sung. |

> **Tuyên ngôn Độc lập (tiếng thật):** đây là bản ghi lịch sử — tôi không tự tải
> được. Bạn tải bản ghi (nguồn có quyền sử dụng: kho lưu trữ chính thống / tư liệu
> giáo dục), đặt tên `declaration-1945.mp3` vào `public/audio/sfx/`. Nó sẽ phát MỘT
> LẦN khi cuộn tới chương 1945 (không loop), trên nền tiếng đám đông khẽ. Bảo đảm
> quyền sử dụng trước khi công khai.

> Thay bằng nhạc thật: ghi đè cùng tên `.wav`, HOẶC dùng `.mp3` và sửa đường dẫn
> trong `components/AudioController.tsx`. Nguồn miễn phí bản quyền gợi ý:
> Pixabay Music / Sound Effects (không cần ghi công), Free Music Archive (CC0/CC-BY),
> Freesound.org (kiểm giấy phép từng file).

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

## Lồng tiếng theo chương (voiceover)
- File: `public/audio/voice/part-1.m4a` (mở đầu → 1920), `part-2.m4a` (30 năm → kết).
- Khi bật âm thanh và cuộn tới một chương, hệ thống **phát đúng đoạn** trong file
  (đặt `currentTime`), tự dừng ở cuối đoạn, và **hạ nhạc nền** cho rõ giọng.
- **Chỉnh mốc thời gian:** mở `data/narration.ts`, sửa `start`/`end` (giây) từng
  chương cho khớp giọng đọc. Đây là các số ƯỚC LƯỢNG — nghe rồi tinh chỉnh.

## ⚠️ Bản quyền
Chỉ dùng nhạc/âm thanh bạn có quyền (mua, tự làm, hoặc CC0/royalty-free đúng giấy
phép). Nếu giấy phép yêu cầu ghi công (CC-BY), thêm dòng credit ở mục "Về dự án".
