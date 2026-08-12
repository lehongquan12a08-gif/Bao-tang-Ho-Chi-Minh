// ---------------------------------------------------------------------------
//  generate-audio.mjs — tổng hợp âm thanh GỐC (an toàn bản quyền) bằng code.
//  Xuất WAV 16-bit (không cần thư viện). Chạy: node scripts/generate-audio.mjs
//  Nhạc nền = pad trang nghiêm (loop liền mạch nhờ tần số bội của 1/L).
//  SFX = gió/sóng/đám đông từ noise (loop bằng crossfade).
// ---------------------------------------------------------------------------
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'audio');
mkdirSync(join(OUT, 'sfx'), { recursive: true });

// ---- WAV writer -----------------------------------------------------------
function writeWav(path, sampleRate, channels) {
  const numCh = channels.length;
  const numSamples = channels[0].length;
  const blockAlign = numCh * 2;
  const dataSize = numSamples * blockAlign;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + dataSize, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(numCh, 22); buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * blockAlign, 28); buf.writeUInt16LE(blockAlign, 32);
  buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(dataSize, 40);
  let off = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numCh; c++) {
      let s = Math.max(-1, Math.min(1, channels[c][i]));
      buf.writeInt16LE((s < 0 ? s * 32768 : s * 32767) | 0, off); off += 2;
    }
  }
  writeFileSync(path, buf);
}

function normalize(arr, peak = 0.85) {
  let m = 0; for (const v of arr) m = Math.max(m, Math.abs(v));
  if (m > 0) { const g = peak / m; for (let i = 0; i < arr.length; i++) arr[i] *= g; }
  return arr;
}

// crossfade the tail into the head so a noise buffer loops seamlessly
function seamless(sr, seconds, fill, fade = 0.5) {
  const N = Math.floor(sr * seconds);
  const F = Math.floor(sr * fade);
  const gen = new Float64Array(N + F);
  fill(gen, sr);
  const out = new Float64Array(N);
  for (let i = 0; i < N; i++) out[i] = gen[i];
  for (let k = 0; k < F; k++) {
    const w = k / F;
    out[k] = gen[k] * w + gen[k + N] * (1 - w);
  }
  return out;
}

// one-pole filters
function lowpass(x, fc, sr) {
  const a = 1 - Math.exp(-2 * Math.PI * fc / sr);
  const y = new Float64Array(x.length); let p = 0;
  for (let i = 0; i < x.length; i++) { p += a * (x[i] - p); y[i] = p; }
  return y;
}
function highpass(x, fc, sr) { const lp = lowpass(x, fc, sr); const y = new Float64Array(x.length); for (let i = 0; i < x.length; i++) y[i] = x[i] - lp[i]; return y; }
function whiteN(n) { const a = new Float64Array(n); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1; return a; }

// ============================================================
// 1) NHẠC NỀN — pad trang nghiêm, loop liền mạch
// ============================================================
function makeAmbient() {
  const sr = 32000, L = 24, N = sr * L;
  const base = 1 / L;                       // snap freqs to multiples → perfect loop
  const snap = (f) => Math.round(f / base) * base;
  // A-minor pentatonic drone (A C D E G) — solemn but hopeful
  const layers = [
    { f: 55.00, g: 0.10, lfo: 1 / L, pan: 0.0 },
    { f: 110.00, g: 0.13, lfo: 2 / L, pan: -0.3 },
    { f: 164.81, g: 0.11, lfo: 1 / L, pan: 0.3 },  // E3 (fifth)
    { f: 220.00, g: 0.09, lfo: 3 / L, pan: -0.2 },
    { f: 261.63, g: 0.055, lfo: 2 / L, pan: 0.4 }, // C4 (minor third)
    { f: 329.63, g: 0.05, lfo: 1 / L, pan: -0.4 }, // E4
    { f: 659.25, g: 0.022, lfo: 4 / L, pan: 0.2 }, // shimmer
  ];
  const Lc = new Float64Array(N), Rc = new Float64Array(N);
  for (const ly of layers) {
    const f = snap(ly.f), f2 = snap(ly.f * 1.004); // gentle detune pair
    const lfo = snap(ly.lfo);
    const ph = Math.random() * Math.PI * 2;
    const gl = 0.5 - ly.pan * 0.5, gr = 0.5 + ly.pan * 0.5; // equal-power-ish
    for (let i = 0; i < N; i++) {
      const t = i / sr;
      const amp = ly.g * (0.62 + 0.38 * Math.sin(2 * Math.PI * lfo * t + ph));
      const s = amp * (Math.sin(2 * Math.PI * f * t) + 0.6 * Math.sin(2 * Math.PI * f2 * t)) * 0.6;
      Lc[i] += s * gl; Rc[i] += s * gr;
    }
  }
  // whole-mix slow breathing
  for (let i = 0; i < N; i++) {
    const b = 0.85 + 0.15 * Math.sin(2 * Math.PI * (1 / L) * (i / sr));
    Lc[i] *= b; Rc[i] *= b;
  }
  normalize(Lc, 0.7); normalize(Rc, 0.7);
  writeWav(join(OUT, 'ambient.wav'), sr, [Lc, Rc]);
  console.log('✓ ambient.wav');
}

// ============================================================
// 2) 1911 — sóng biển + còi tàu
// ============================================================
function makeShip() {
  const sr = 22050, sec = 20;
  const out = seamless(sr, sec, (g, sr) => {
    const n = g.length;
    let base = lowpass(whiteN(n), 600, sr);
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      // wave swell: layered slow sines
      const sw = 0.5 + 0.5 * Math.sin(2 * Math.PI * (1 / 6.3) * t) * Math.sin(2 * Math.PI * (1 / 4.1) * t + 1);
      g[i] = base[i] * (0.25 + 0.55 * Math.max(0, sw));
    }
    // foghorn: two-tone, twice, inside the loop interior
    const horn = (start, dur, f1, f2) => {
      for (let i = 0; i < n; i++) {
        const t = i / sr - start; if (t < 0 || t > dur) continue;
        const env = Math.sin(Math.PI * (t / dur)) ** 2;      // smooth in/out
        g[i] += 0.22 * env * (Math.sin(2 * Math.PI * f1 * t) + 0.7 * Math.sin(2 * Math.PI * f2 * t)) * 0.6;
      }
    };
    horn(4.0, 2.2, 115, 87);
    horn(13.0, 2.4, 110, 82);
  });
  normalize(out, 0.8);
  writeWav(join(OUT, 'sfx', 'ship-1911.wav'), sr, [out]);
  console.log('✓ ship-1911.wav');
}

// ============================================================
// 3) 1941 — gió núi + chim rừng
// ============================================================
function makeMountain() {
  const sr = 22050, sec = 18;
  const out = seamless(sr, sec, (g, sr) => {
    const n = g.length;
    // Gentle, steady mountain breeze — NO synthetic birds (they sounded fake),
    // NO low rumble (that read as ocean). Just airy wind with soft organic drift.
    const air = highpass(lowpass(whiteN(n), 2600, sr), 800, sr); // airy band
    const warm = highpass(lowpass(whiteN(n), 700, sr), 320, sr); // faint mid body
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      // slow, irregular drift at incommensurate rates → organic, never a wave swell
      const env = 0.78 + 0.22 * Math.sin(2 * Math.PI * (1 / 9.0) * t) * Math.sin(2 * Math.PI * (1 / 6.5) * t + 0.7);
      g[i] = air[i] * env * 0.5 + warm[i] * env * 0.12;
    }
  });
  normalize(out, 0.5);
  writeWav(join(OUT, 'sfx', 'mountain-1941.wav'), sr, [out]);
  console.log('✓ mountain-1941.wav');
}

// ============================================================
// 4) 1945 — đám đông rì rào (khẽ)
// ============================================================
function makeCrowd() {
  const sr = 22050, sec = 16;
  const out = seamless(sr, sec, (g, sr) => {
    const n = g.length;
    // murmur = band-passed noise around speech range
    const murmur = highpass(lowpass(whiteN(n), 900, sr), 250, sr);
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      const fl = 0.5 + 0.5 * Math.sin(2 * Math.PI * (1 / 3.3) * t) * Math.sin(2 * Math.PI * (1 / 2.1) * t + 0.5);
      g[i] = murmur[i] * (0.4 + 0.5 * fl);
    }
    // sparse soft "voices" — short low tones, overlapping
    for (let k = 0; k < 40; k++) {
      const start = Math.random() * (sec - 1);
      const f = 130 + Math.random() * 220;
      const dur = 0.25 + Math.random() * 0.4;
      for (let i = 0; i < n; i++) {
        const t = i / sr - start; if (t < 0 || t > dur) continue;
        const env = Math.sin(Math.PI * (t / dur)) ** 2;
        g[i] += 0.03 * env * Math.sin(2 * Math.PI * f * t);
      }
    }
  });
  normalize(out, 0.62);
  writeWav(join(OUT, 'sfx', 'crowd-1945.wav'), sr, [out]);
  console.log('✓ crowd-1945.wav');
}

const only = process.argv[2];
if (only === 'mountain') { makeMountain(); }
else { makeAmbient(); makeShip(); makeMountain(); makeCrowd(); }
console.log('Done →', OUT);
