// ---------------------------------------------------------------------------
//  generate-assets.mjs
//  Sinh toàn bộ ảnh nền / kết cấu GỐC (không dùng ảnh có bản quyền) cho triển
//  lãm. Mỗi asset dựng bằng SVG (gradient + feTurbulence) rồi rasterize sang
//  WebP bằng sharp. Chạy: `node scripts/generate-assets.mjs`
// ---------------------------------------------------------------------------
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'images');
mkdirSync(OUT, { recursive: true });

const W = 1600;
const H = 1000;

/** Wrap raw inner SVG in a sized root. */
const svg = (inner, w = W, h = H) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;

/** A reusable film-grain / fibre turbulence layer. */
const grain = (freq, oct, seed, opacity, w = W, h = H) => `
  <filter id="g${seed}"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${seed}" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/></filter>
  <rect width="${w}" height="${h}" filter="url(#g${seed})" opacity="${opacity}"/>`;

// ---- 1. Aged sepia paper (1890 + document cards) --------------------------
const paper = svg(`
  <defs>
    <radialGradient id="pg" cx="42%" cy="38%" r="80%">
      <stop offset="0%" stop-color="#f3e9d0"/>
      <stop offset="55%" stop-color="#e2d0a8"/>
      <stop offset="100%" stop-color="#b89a68"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#pg)"/>
  ${grain('0.012 0.02', 4, 7, 0.28)}
  ${grain('0.9', 2, 11, 0.05)}
  <rect width="${W}" height="${H}" fill="#3a2410" opacity="0.0"/>
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <radialGradient id="vig" cx="50%" cy="50%" r="60%">
    <stop offset="60%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#3a2410" stop-opacity="0.5"/>
  </radialGradient>`);

// ---- 2. Cool harbour mist (1911) ------------------------------------------
const mist = svg(`
  <defs>
    <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d1620"/>
      <stop offset="60%" stop-color="#16232c"/>
      <stop offset="100%" stop-color="#0a0f13"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="72%" r="55%">
      <stop offset="0%" stop-color="#d4a72c" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#d4a72c" stop-opacity="0"/>
    </radialGradient>
    <filter id="fog"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves="3" seed="21"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.86  0 0 0 0 0.82  0 0 0 0.6 0"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#mg)"/>
  <rect width="${W}" height="${H}" filter="url(#fog)" opacity="0.20"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${grain('0.9', 2, 5, 0.04)}`);

// ---- 3. Forest fog mountains atmosphere (1941) ----------------------------
const forest = svg(`
  <defs>
    <linearGradient id="fgd" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a1210"/>
      <stop offset="55%" stop-color="#12211d"/>
      <stop offset="100%" stop-color="#070d0b"/>
    </linearGradient>
    <filter id="mfog"><feTurbulence type="fractalNoise" baseFrequency="0.003 0.010" numOctaves="4" seed="33"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.80  0 0 0 0 0.83  0 0 0 0 0.76  0 0 0 0.5 0"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fgd)"/>
  <rect width="${W}" height="${H}" filter="url(#mfog)" opacity="0.18"/>
  ${grain('0.9', 2, 9, 0.05)}`);

// ---- 4. Deep red silk atmosphere (1945 finale) ----------------------------
const silk = svg(`
  <defs>
    <radialGradient id="sg" cx="50%" cy="45%" r="75%">
      <stop offset="0%" stop-color="#c81f18"/>
      <stop offset="45%" stop-color="#8f1713"/>
      <stop offset="100%" stop-color="#3a0d0b"/>
    </radialGradient>
    <filter id="silkf"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.02" numOctaves="3" seed="44"/>
      <feDisplacementMap in="SourceGraphic" scale="18"/></filter>
    <filter id="fibre"><feTurbulence type="turbulence" baseFrequency="0.002 0.05" numOctaves="2" seed="8"/>
      <feColorMatrix type="saturate" values="0"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sg)"/>
  <rect width="${W}" height="${H}" filter="url(#fibre)" opacity="0.08"/>
  <radialGradient id="rvig" cx="50%" cy="50%" r="60%">
    <stop offset="55%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#1a0605" stop-opacity="0.7"/>
  </radialGradient>
  <rect width="${W}" height="${H}" fill="url(#rvig)"/>`);

// ---- 5. Starfield (hero + dark chapters) ----------------------------------
function starfield() {
  // deterministic pseudo-random star positions (no Math.random for reproducibility)
  let s = 1234567;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  let dots = '';
  for (let i = 0; i < 240; i++) {
    const x = (rnd() * W).toFixed(1);
    const y = (rnd() * H).toFixed(1);
    const r = (rnd() * 1.3 + 0.2).toFixed(2);
    const o = (rnd() * 0.5 + 0.15).toFixed(2);
    const gold = rnd() > 0.82;
    dots += `<circle cx="${x}" cy="${y}" r="${r}" fill="${gold ? '#FFCD00' : '#F4EBD8'}" opacity="${o}"/>`;
  }
  return svg(`<rect width="${W}" height="${H}" fill="#080808"/>${dots}`);
}

// NOTE: film grain is provided by an inline SVG in globals.css, so no raster
// grain tile is generated here (it compresses poorly and would be redundant).

const jobs = [
  ['paper.webp', paper, 82],
  ['mist.webp', mist, 80],
  ['forest.webp', forest, 80],
  ['silk.webp', silk, 82],
  ['stars.webp', starfield(), 80],
];

const run = async () => {
  for (const [name, markup, q] of jobs) {
    const buf = Buffer.from(markup);
    await sharp(buf, { density: 150 })
      .webp({ quality: q })
      .toFile(join(OUT, name));
    console.log('✓', name);
  }
  console.log('Done →', OUT);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
