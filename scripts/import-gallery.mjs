// Import ảnh Làng Sen (chương 1890) + bộ ảnh cho mục "Tư liệu" (gallery).
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = 'C:/Users/PC/Downloads/Anh_Bac_Ho_MKT/images';
const DL = 'C:/Users/PC/Downloads';
const PHOTOS = join(__dirname, '..', 'public', 'images', 'photos');
const GAL = join(PHOTOS, 'gallery');
mkdirSync(GAL, { recursive: true });

// Làng Sen — quê Bác (Kim Liên)
await sharp(join(DL, 'lang-sen-que-bac-3_1629338576.webp'))
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(join(PHOTOS, 'langsen.webp'));
console.log('✓ langsen.webp');

// Bộ ảnh Tư liệu (thứ tự khớp data/gallery.ts)
const GALLERY = [
  '005', '008', '011', '013', '015', '017', '019', '020',
  '023', '025', '028', '029', '030', '034', '040', '042',
];

let i = 1;
for (const n of GALLERY) {
  const dst = `g-${String(i).padStart(2, '0')}.webp`;
  await sharp(join(SRC, `${n}.jpg`))
    .resize({ width: 820, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(join(GAL, dst));
  console.log('✓', dst, '←', n);
  i++;
}

console.log('Done.');
