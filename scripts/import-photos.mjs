// ---------------------------------------------------------------------------
//  import-photos.mjs
//  Nhập ảnh tư liệu DO NGƯỜI DÙNG cung cấp (rights do người dùng chịu trách
//  nhiệm), tối ưu sang WebP và đặt vào public/images/photos.
//  Chạy: `node scripts/import-photos.mjs`
// ---------------------------------------------------------------------------
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = 'C:/Users/PC/Downloads/Anh_Bac_Ho_MKT/images';
const OUT = join(__dirname, '..', 'public', 'images', 'photos');
mkdirSync(OUT, { recursive: true });

// nguồn → tên đích, chiều rộng tối đa
const MAP = [
  ['003.jpg', 'portrait.webp', 1200],      // Hero + Final — chân dung chính diện
  ['035.jpg', 'young.webp', 1000],         // Nguyễn Ái Quốc (trẻ)
  ['032.jpg', 'ship-1911.webp', 1400],     // 1911 — ra đi tìm đường cứu nước
  ['004.jpg', 'doc-1.webp', 900],          // máy đánh chữ
  ['043.jpg', 'doc-2.webp', 900],          // viết
  ['045.jpg', 'doc-3.webp', 900],          // bàn làm việc
  ['044.jpg', 'doc-4.webp', 900],          // đọc tài liệu
  ['046.jpg', 'doc-5.webp', 900],          // viết ngoài trời
  ['039.jpg', 'mountain-1941.webp', 1400], // 1941 — Việt Bắc
  ['047.jpg', 'badinh.webp', 1400],        // 1945 — quảng trường
  ['049.jpg', 'declaration-1945.webp', 1400], // 1945 — Tuyên ngôn Độc lập
];

const run = async () => {
  for (const [src, dst, w] of MAP) {
    await sharp(join(SRC, src))
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(join(OUT, dst));
    console.log('✓', src, '→', dst);
  }
  console.log('Done →', OUT);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
