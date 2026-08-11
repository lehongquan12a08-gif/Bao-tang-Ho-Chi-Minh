// Ghép 57 ảnh nguồn thành 1 bảng liên hệ có đánh số để chọn nhanh.
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'C:/Users/PC/Downloads/Anh_Bac_Ho_MKT/images';
const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();

const COLS = 8;
const CW = 224;
const CH = 150;
const GAP = 4;
const rows = Math.ceil(files.length / COLS);
const W = COLS * (CW + GAP);
const H = rows * (CH + GAP);

const cells = [];
const labels = [];

for (let i = 0; i < files.length; i++) {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  const x = c * (CW + GAP);
  const y = r * (CH + GAP);
  const thumb = await sharp(join(SRC, files[i]))
    .resize(CW, CH, { fit: 'cover' })
    .jpeg({ quality: 70 })
    .toBuffer();
  cells.push({ input: thumb, left: x, top: y });
  const n = files[i].replace(/\.[^.]+$/, '');
  labels.push(
    `<rect x="${x}" y="${y}" width="34" height="18" fill="#000" opacity="0.7"/>` +
      `<text x="${x + 4}" y="${y + 13}" font-family="monospace" font-size="12" fill="#FFCD00">${n}</text>`
  );
}

const overlay = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${labels.join('')}</svg>`
);

await sharp({ create: { width: W, height: H, channels: 3, background: '#111' } })
  .composite([...cells, { input: overlay, left: 0, top: 0 }])
  .jpeg({ quality: 72 })
  .toFile(join('scripts', 'contact-sheet.jpg'));

console.log('OK', files.length, 'ảnh →', W + 'x' + H);
