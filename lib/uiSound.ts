// A "chime" cue played when isolated words appear (WordCascade, the 1945 date).
// Gated on the sound being enabled, ducked under a voice, scaled by the master
// volume. Routed through a Web Audio gain so it can be lifted well above the
// element-volume ceiling (the tone is low/warm, which reads quiet otherwise).
// A small pool of sources lets quick successions overlap; pitch is nudged per
// word for a gentle melodic feel.
import { narrationState } from './narrationState';

const SRC = '/audio/sfx/chime.wav?v=5';
const RATES = [1, 1.12, 0.94, 1.06, 0.88, 1.18];
const BOOST = 2.3; // Web Audio gain — lifts the warm tone so it clearly carries

let pool: HTMLAudioElement[] = [];
let idx = 0;
let last = 0;
let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let touch = false; // phones distort the deep tone — play it higher & softer

// Re-wake the chime context if the OS suspended it (mobile does this a lot).
export function resumeUiSound() {
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
}

export function initUiSound() {
  if (typeof Audio === 'undefined' || pool.length) return;
  // shared gain → limiter → destination: the gain lets the warm tone exceed the
  // element-volume ceiling; the limiter catches peaks so it never clips (no buzz)
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) {
      // phone speakers distort a boosted low tone — use a gentler gain on touch
      touch =
        typeof matchMedia !== 'undefined' &&
        matchMedia('(hover: none) and (pointer: coarse)').matches;
      ctx = new AC();
      gain = ctx.createGain();
      gain.gain.value = touch ? 0.9 : BOOST;
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -6;
      limiter.knee.value = 6;
      limiter.ratio.value = 20;
      limiter.attack.value = 0.002;
      limiter.release.value = 0.15;
      gain.connect(limiter);
      limiter.connect(ctx.destination);
    }
  } catch {
    /* Web Audio unavailable → chime plays at element volume */
  }
  for (let i = 0; i < 4; i++) {
    const a = new Audio(SRC);
    a.preload = 'auto';
    a.volume = 0;
    if (ctx && gain) {
      try {
        ctx.createMediaElementSource(a).connect(gain);
      } catch {
        /* ignore — falls back to element output */
      }
    }
    pool.push(a);
  }
}

// `seq` varies the pitch (word index); `base` is the peak volume before scaling.
export function playChime(seq = 0, base = 0.7) {
  if (!narrationState.enabled) return;
  const now = Date.now();
  if (now - last < 90) return; // throttle scrub jitter / rapid re-fires
  last = now;
  if (!pool.length) initUiSound();
  ctx?.resume().catch(() => {});
  const a = pool[idx];
  idx = (idx + 1) % pool.length;
  if (!a) return;
  const master = narrationState.volume;
  const duck = narrationState.speaking ? 0.4 : 1; // stay under the voice
  const rate = RATES[((seq % RATES.length) + RATES.length) % RATES.length];
  // on phones shift the tone ~an octave up into the mid range (small speakers
  // reproduce it cleanly — the deep tone was distorting) and play it softer
  a.playbackRate = touch ? rate * 1.9 : rate;
  a.volume = Math.max(0, Math.min(1, (touch ? base * 0.7 : base) * master * duck));
  try {
    a.currentTime = 0;
  } catch {
    /* ignore */
  }
  a.play().catch(() => {});
}
