import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = 'public/images';
// only the ones actually referenced (forest is unused)
const textures = ['silk', 'paper', 'mist', 'stars'];

async function make(stem, maxW, q = 80) {
  const src = path.join(root, stem + '.webp');
  const dst = path.join(root, stem + '-lite.webp');
  if (!fs.existsSync(src)) return console.log('skip (missing)', src);
  const m = await sharp(src).metadata();
  const buf = await sharp(src).resize({ width: maxW }).webp({ quality: q }).toBuffer();
  fs.writeFileSync(dst, buf); // brand-new file — not locked by OneDrive
  const nm = await sharp(buf).metadata();
  console.log('wrote', path.basename(dst), m.width + 'x' + m.height, '->', nm.width + 'x' + nm.height,
    Math.round(fs.statSync(src).size / 1024) + 'KB->' + Math.round(buf.length / 1024) + 'KB',
    Math.round((nm.width * nm.height * 4) / 1048576) + 'MB decoded');
}

(async () => {
  for (const t of textures) await make(t, 1280);
})();
