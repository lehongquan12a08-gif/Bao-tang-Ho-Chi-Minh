import sharp from 'sharp';
import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join('public', 'images', 'photos');
const MAP = [
  ['Ai-Quoc-3.jpg', 'm1919.webp'],
  ['Nguyen-Ai-Quoc.jpg', 'm1920.webp'],
  ['images.jpg', 'm1954.webp'],
];
// the Điện Biên / baolamdong file has a long name — match by prefix
const baolam = readdirSync(DIR).find((f) => f.startsWith('baolamdong'));
if (baolam) MAP.push([baolam, 'm1930.webp']);

for (const [src, dst] of MAP) {
  await sharp(join(DIR, src))
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(DIR, dst));
  console.log('✓', src, '→', dst);
  try {
    unlinkSync(join(DIR, src));
    console.log('  (đã xoá', src + ')');
  } catch {
    /* ignore */
  }
}
console.log('Done.');
