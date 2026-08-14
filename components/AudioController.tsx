'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NARRATION, NARRATION_FILES, type NarrationCue } from '@/data/narration';

// per-chapter voiceover volume (relative to master)
const NARR_VOL = 0.98;

// Background music (loops) + per-chapter ambience. Some clips are `loop:false`
// one-shots (e.g. the real Tuyên ngôn recording) that fire inside a scroll
// `range` (fraction of the section) so they hit exactly at the right moment.
// Drop files per public/audio/README.md; missing files stay silent (no errors).
// Bump when a generated audio file changes so browsers fetch the new version
// instead of a cached copy of the same filename.
const V = 'v=5';
const AMBIENT_SRC = `/audio/ambient.wav?${V}`;
const AMBIENT_VOL = 0.22;

type Sfx = { id: string; src: string; vol: number; loop?: boolean; range?: [number, number] };
const SFX: Sfx[] = [
  { id: 'chapter-1911', src: `/audio/sfx/ship-1911.wav?${V}`, vol: 0.3 },
  { id: 'chapter-1941', src: `/audio/sfx/mountain-1941.wav?${V}`, vol: 0.3 },
  { id: 'chapter-1945', src: `/audio/sfx/crowd-1945.wav?${V}`, vol: 0.12 },
  // Bác đọc Tuyên ngôn — plays once when the Ba Đình scene is on screen.
  { id: 'chapter-1945', src: '/audio/sfx/declaration-1945.mp3', vol: 0.9, loop: false, range: [0.44, 0.74] },
];

const LS_KEY = 'httcb-audio';
const LS_VOL = 'httcb-vol';
const clamp = (x: number) => Math.max(0, Math.min(1, x));

const fades = new Map<HTMLAudioElement, number>();
function fadeTo(el: HTMLAudioElement, target: number, ms = 900) {
  const prev = fades.get(el);
  if (prev) cancelAnimationFrame(prev);
  if (target > 0 && el.paused) el.play().catch(() => {});
  const from = el.volume;
  const start = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / ms);
    el.volume = clamp(from + (target - from) * p);
    if (p < 1) fades.set(el, requestAnimationFrame(tick));
    else {
      fades.delete(el);
      if (target <= 0) el.pause();
    }
  };
  fades.set(el, requestAnimationFrame(tick));
}

export default function AudioController() {
  const [enabled, setEnabled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [vol, setVol] = useState(0.8);

  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const enabledRef = useRef(false);
  const masterRef = useRef(0.8);
  const duckRef = useRef(false);
  const ambTargetRef = useRef(-1);

  // narration (per-chapter voiceover, played as segments of 2 files)
  const narrRef = useRef<Map<1 | 2, HTMLAudioElement>>(new Map());
  const narrActiveRef = useRef<string | null>(null);
  const narrEndRef = useRef(0);
  const narrElRef = useRef<HTMLAudioElement | null>(null);

  // create audio elements once
  useEffect(() => {
    const amb = new Audio(AMBIENT_SRC);
    amb.loop = true;
    amb.volume = 0;
    amb.preload = 'auto';
    ambientRef.current = amb;

    const m = new Map<string, HTMLAudioElement>();
    for (const s of SFX) {
      const a = new Audio(s.src);
      a.loop = s.loop !== false;
      a.volume = 0;
      a.preload = 'none';
      m.set(s.src, a);
    }
    sfxRef.current = m;

    // narration files (2 parts) — stop each at its current segment's end
    const nm = new Map<1 | 2, HTMLAudioElement>();
    ([1, 2] as const).forEach((part) => {
      const a = new Audio(NARRATION_FILES[part]);
      a.preload = 'auto';
      a.volume = 0;
      a.addEventListener('timeupdate', () => {
        if (a === narrElRef.current && a.currentTime >= narrEndRef.current) a.pause();
      });
      nm.set(part, a);
    });
    narrRef.current = nm;

    let v = 0.8;
    try {
      const sv = localStorage.getItem(LS_VOL);
      if (sv != null) v = clamp(parseFloat(sv));
    } catch {
      /* ignore */
    }
    masterRef.current = v;
    setVol(v);

    return () => {
      amb.pause();
      m.forEach((a) => a.pause());
      nm.forEach((a) => a.pause());
    };
  }, []);

  // update which ambience plays, honouring scroll `range` + master volume + duck
  const apply = useCallback(() => {
    if (!enabledRef.current) return;
    const master = masterRef.current;
    const mid = window.innerHeight / 2;
    let ducking = false;

    for (const s of SFX) {
      const a = sfxRef.current.get(s.src);
      if (!a) continue;
      const el = document.getElementById(s.id);
      let active = false;
      if (el) {
        if (s.range) {
          const scrollable = el.offsetHeight - window.innerHeight;
          const scrolled = -el.getBoundingClientRect().top;
          const p = scrollable > 0 ? scrolled / scrollable : 0;
          active = p >= s.range[0] && p <= s.range[1];
        } else {
          const r = el.getBoundingClientRect();
          active = r.top <= mid && r.bottom >= mid;
        }
      }
      if (active) {
        if (s.loop === false) {
          ducking = true;
          if (a.paused) a.currentTime = 0;
        }
        fadeTo(a, s.vol * master, s.loop === false ? 300 : 1400);
      } else {
        fadeTo(a, 0, 900);
      }
    }

    // --- narration: play the current chapter's voiceover segment ---------
    let narrCue: NarrationCue | null = null;
    for (const c of NARRATION) {
      const el = document.getElementById(c.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) {
        narrCue = c;
        break;
      }
    }
    if (narrCue) {
      if (narrCue.id !== narrActiveRef.current) {
        const a = narrRef.current.get(narrCue.part);
        narrRef.current.forEach((other) => {
          if (other !== a) other.pause();
        });
        if (a) {
          narrActiveRef.current = narrCue.id;
          narrEndRef.current = narrCue.end;
          try {
            a.currentTime = narrCue.start;
          } catch {
            /* ignore */
          }
          a.volume = clamp(NARR_VOL * master);
          a.play().catch(() => {});
          narrElRef.current = a;
        }
      }
    } else if (narrActiveRef.current) {
      narrRef.current.forEach((a) => a.pause());
      narrActiveRef.current = null;
      narrElRef.current = null;
    }
    if (narrElRef.current && !narrElRef.current.paused) ducking = true;

    duckRef.current = ducking;
    const ambTarget = AMBIENT_VOL * master * (ducking ? 0.3 : 1);
    if (ambientRef.current && Math.abs(ambTarget - ambTargetRef.current) > 0.001) {
      ambTargetRef.current = ambTarget;
      fadeTo(ambientRef.current, ambTarget, 700);
    }
  }, []);

  const enable = useCallback(() => {
    enabledRef.current = true;
    setEnabled(true);
    setShowPrompt(false);
    try {
      localStorage.setItem(LS_KEY, 'on');
    } catch {
      /* ignore */
    }
    ambTargetRef.current = -1; // force ambient re-fade
    apply();
  }, [apply]);

  const disable = useCallback(() => {
    enabledRef.current = false;
    setEnabled(false);
    try {
      localStorage.setItem(LS_KEY, 'off');
    } catch {
      /* ignore */
    }
    if (ambientRef.current) fadeTo(ambientRef.current, 0, 600);
    sfxRef.current.forEach((a) => fadeTo(a, 0, 600));
    narrRef.current.forEach((a) => a.pause());
    narrActiveRef.current = null;
    narrElRef.current = null;
  }, []);

  // volume slider — apply instantly to whatever is playing
  const onVolume = useCallback((v: number) => {
    masterRef.current = v;
    setVol(v);
    try {
      localStorage.setItem(LS_VOL, String(v));
    } catch {
      /* ignore */
    }
    if (!enabledRef.current) return;
    if (ambientRef.current && !ambientRef.current.paused) {
      ambientRef.current.volume = clamp(AMBIENT_VOL * v * (duckRef.current ? 0.3 : 1));
      ambTargetRef.current = AMBIENT_VOL * v * (duckRef.current ? 0.3 : 1);
    }
    for (const s of SFX) {
      const a = sfxRef.current.get(s.src);
      if (a && !a.paused) a.volume = clamp(s.vol * v);
    }
    if (narrElRef.current && !narrElRef.current.paused) {
      narrElRef.current.volume = clamp(NARR_VOL * v);
    }
  }, []);

  // restore on/off preference (needs a user gesture to actually start audio)
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LS_KEY);
    } catch {
      /* ignore */
    }
    if (saved === 'on') {
      const resume = () => {
        enable();
        window.removeEventListener('pointerdown', resume);
        window.removeEventListener('wheel', resume);
        window.removeEventListener('keydown', resume);
      };
      window.addEventListener('pointerdown', resume, { once: true });
      window.addEventListener('wheel', resume, { once: true, passive: true });
      window.addEventListener('keydown', resume, { once: true });
      return () => {
        window.removeEventListener('pointerdown', resume);
        window.removeEventListener('wheel', resume);
        window.removeEventListener('keydown', resume);
      };
    }
    if (saved === null) {
      const t = window.setTimeout(() => setShowPrompt(true), 1600);
      return () => window.clearTimeout(t);
    }
  }, [enable]);

  // scroll → re-evaluate
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply();
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [apply]);

  // pause when the tab is hidden
  useEffect(() => {
    const onVis = () => {
      if (!enabledRef.current) return;
      if (document.hidden) {
        ambientRef.current?.pause();
        sfxRef.current.forEach((a) => a.pause());
        narrRef.current.forEach((a) => a.pause());
        narrActiveRef.current = null; // replay current chapter's line on return
        narrElRef.current = null;
      } else {
        ambientRef.current?.play().catch(() => {});
        apply();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [apply]);

  return (
    <>
      <div className="fixed bottom-7 right-6 z-[95] flex items-center gap-3 md:bottom-9 md:right-9">
        {/* volume slider (shows when sound is on) */}
        {enabled && (
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(vol * 100)}
            onChange={(e) => onVolume(Number(e.target.value) / 100)}
            aria-label="Âm lượng"
            className="vol-slider hidden w-24 sm:block"
          />
        )}

        {/* speaker toggle */}
        <button
          type="button"
          onClick={() => (enabled ? disable() : enable())}
          aria-label={enabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          aria-pressed={enabled}
          className="group relative flex h-[46px] w-[46px] items-center justify-center rounded-full border border-vn-gold-antique/40 bg-[rgba(8,8,8,0.5)] backdrop-blur-sm transition-colors duration-300 hover:border-vn-gold"
        >
          <span className="relative flex h-4 w-4 items-center justify-center text-vn-gold">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
              {enabled ? (
                <>
                  <path d="M16 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 6a8 8 0 0 1 0 12" className="opacity-70" />
                </>
              ) : (
                <path d="M17 9l4 6M21 9l-4 6" />
              )}
            </svg>
          </span>
          {enabled && (
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-vn-gold/30" style={{ animationDuration: '3s' }} />
          )}
        </button>
      </div>

      {/* first-visit prompt */}
      {showPrompt && !enabled && (
        <div className="fixed bottom-[84px] right-6 z-[96] flex max-w-[260px] flex-col gap-3 border border-white/10 bg-[rgba(8,8,8,0.9)] p-4 backdrop-blur-md md:bottom-[96px] md:right-9">
          <p className="font-body text-[12px] leading-relaxed text-vn-ivory/85">
            Bật âm thanh để trải nghiệm trọn vẹn hành trình.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={enable}
              className="border border-vn-gold-antique/60 px-4 py-2 font-body text-[11px] uppercase tracking-[0.18em] text-vn-ivory transition-colors duration-300 hover:bg-vn-gold-antique hover:text-vn-black"
            >
              Bật
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPrompt(false);
                try {
                  localStorage.setItem(LS_KEY, 'off');
                } catch {
                  /* ignore */
                }
              }}
              className="px-3 py-2 font-body text-[11px] uppercase tracking-[0.18em] text-vn-ivory/50 transition-colors duration-300 hover:text-vn-ivory"
            >
              Bỏ qua
            </button>
          </div>
        </div>
      )}
    </>
  );
}
