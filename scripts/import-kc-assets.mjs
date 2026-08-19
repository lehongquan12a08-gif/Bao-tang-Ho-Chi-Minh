// Import the VNR asset pack into the khang-chien-chong-phap project:
// unicode names → ascii, resize ≤1600px, convert to webp. Run from the
// hanh-trinh folder (sharp lives here); outputs go to the KC project.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'C:/Users/PC/Documents/OneDrive/Pictures/VNR-20260818T170356Z-1-001/VNR';
const DST = 'C:/Users/PC/Documents/OneDrive/Pictures/khang-chien-chong-phap/public/images/kc';
fs.mkdirSync(DST, { recursive: true });

const dirs = fs.readdirSync(SRC, { withFileTypes: true });
const findDir = (prefix) => {
  const d = dirs.find((e) => e.isDirectory() && e.name.startsWith(prefix));
  return d ? path.join(SRC, d.name) : null;
};
const pick = (dir, prefix) => {
  if (!dir) return null;
  const f = fs.readdirSync(dir).find((n) => n.trim().startsWith(prefix));
  return f ? path.join(dir, f) : null;
};

const d46 = findDir('1946');
const d47 = findDir('1947');
const d50 = findDir('1950');
const d51 = findDir('1951');
const d54 = findDir('1953');
const d56 = d54 ? pickDir(d54, '56') : null;
function pickDir(parent, prefix) {
  const e = fs.readdirSync(parent, { withFileTypes: true }).find((x) => x.isDirectory() && x.name.startsWith(prefix));
  return e ? path.join(parent, e.name) : null;
}
const dyn = dirs.find((e) => e.isDirectory() && /ngh/i.test(e.name)); // Ý nghĩa
const dynPath = dyn ? path.join(SRC, dyn.name) : null;

const jobs = [
  [pick(SRC, 'Mở đầu'), 'modau'],
  [pick(d46, 'H1'), 'y46-h1'],
  [pick(d46, 'H2'), 'y46-h2'],
  [pick(d47, 'H1'), 'y47-h1'],
  [pick(d47, 'H2'), 'y47-h2'],
  [pick(d47, 'H3'), 'y47-h3'],
  [pick(d50, 'H1'), 'y50-h1'],
  [pick(d50, 'H2'), 'y50-h2'],
  [pick(d51, 'Chủ tịch'), 'y51-hcm'],
  [pick(d51, 'Ảnh 1'), 'y51-a1'],
  [pick(d51, 'Ảnh 2'), 'y51-a2'],
  [pick(d51, 'Ảnh 3'), 'y51-a3'],
  [pick(d51, 'Ảnh 4'), 'y51-a4'],
  [pick(d54, 'Ảnh 1'), 'y54-a1'],
  [pick(d54, 'Ảnh 2'), 'y54-a2'],
  [pick(d54, 'Ảnh 3'), 'y54-a3'],
  [pick(d54, 'Ảnh 4'), 'y54-a4'],
  [pick(d54, 'Ảnh 5'), 'y54-a5'],
  [pick(d54, 'Ảnh bộ đội'), 'y54-keophao'],
  [pick(d56, 'Bộ đội kéo pháo'), 'd56-1'],
  [pick(d56, 'Công tác giao thông'), 'd56-2'],
  [pick(d56, 'Người dân'), 'd56-3'],
  [pick(d56, 'Thanh niên'), 'd56-4'],
  [pick(d56, 'Đội quân xe thồ'), 'd56-5'],
  [pick(dynPath, 'Chiến thắng'), 'yn-dbp'],
  [pick(dynPath, 'Ảnh 1'), 'yn-a1'],
  [pick(dynPath, 'Ảnh 2'), 'yn-a2'],
];

for (const [src, out] of jobs) {
  if (!src) {
    console.log('MISSING:', out);
    continue;
  }
  const dst = path.join(DST, out + '.webp');
  const img = sharp(src);
  const m = await img.metadata();
  const w = Math.min(1600, m.width || 1600);
  await img.resize({ width: w }).webp({ quality: 82 }).toFile(dst);
  const kb = Math.round(fs.statSync(dst).size / 1024);
  console.log('ok', out + '.webp', `${m.width}x${m.height}→${w}w`, kb + 'KB');
}
console.log('DONE images');
