import fs from 'node:fs';

// Bake the ambient music quieter into a NEW file so it stays low even on iOS
// (where element.volume is ignored). Desktop compensates via ambientVolRef.
const src = 'public/audio/ambient.wav';
const dst = 'public/audio/ambient-lo.wav';
const SCALE = 0.3;

const buf = fs.readFileSync(src);
// 44-byte canonical WAV header, 16-bit PCM samples after it
const out = Buffer.from(buf); // copy (header preserved)
for (let i = 44; i + 1 < out.length; i += 2) {
  const s = out.readInt16LE(i);
  out.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(s * SCALE))), i);
}
fs.writeFileSync(dst, out);
console.log('wrote', dst, (out.length / 1024).toFixed(0) + 'KB', 'scaled', SCALE);
