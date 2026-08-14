// A tiny "chime" cue played when isolated words appear (WordCascade, the 1945
// date). Gated on the sound being enabled, ducked under a voice, and scaled by
// the master volume. Uses a small pool of Audio elements so quick successions
// can overlap. Pitch is nudged per word for a gentle melodic feel.
import { narrationState } from './narrationState';

const SRC = '/audio/sfx/chime.wav?v=2';
const RATES = [1, 1.12, 0.94, 1.06, 0.88, 1.18];

let pool: HTMLAudioElement[] = [];
let idx = 0;
let last = 0;

export function initUiSound() {
  if (typeof Audio === 'undefined' || pool.length) return;
  for (let i = 0; i < 4; i++) {
    const a = new Audio(SRC);
    a.preload = 'auto';
    a.volume = 0;
    pool.push(a);
  }
}

// `seq` varies the pitch (word index); `base` is the peak volume before scaling.
export function playChime(seq = 0, base = 0.4) {
  if (!narrationState.enabled) return;
  const now = Date.now();
  if (now - last < 90) return; // throttle scrub jitter / rapid re-fires
  last = now;
  if (!pool.length) initUiSound();
  const a = pool[idx];
  idx = (idx + 1) % pool.length;
  if (!a) return;
  const master = narrationState.volume;
  const duck = narrationState.speaking ? 0.4 : 1; // stay under the voice
  a.playbackRate = RATES[((seq % RATES.length) + RATES.length) % RATES.length];
  a.volume = Math.max(0, Math.min(1, base * master * duck));
  try {
    a.currentTime = 0;
  } catch {
    /* ignore */
  }
  a.play().catch(() => {});
}
