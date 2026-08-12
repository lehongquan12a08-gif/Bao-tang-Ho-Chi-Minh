'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Background music (loops the whole time) + per-chapter ambience that
// cross-fades based on which section is in view. Drop the files listed in
// public/audio/README.md and it plays; if a file is missing it stays silent
// (no errors), so the site works with or without audio.
const AMBIENT_SRC = '/audio/ambient.wav';
const AMBIENT_VOL = 0.22;

// `loop: false` = a one-shot clip (e.g. the real Tuyên ngôn recording) that
// plays once when the chapter is entered, instead of looping.
const SFX: { id: string; src: string; vol: number; loop?: boolean }[] = [
  { id: 'chapter-1911', src: '/audio/sfx/ship-1911.wav', vol: 0.3 },
  { id: 'chapter-1941', src: '/audio/sfx/mountain-1941.wav', vol: 0.28 },
  { id: 'chapter-1945', src: '/audio/sfx/crowd-1945.wav', vol: 0.12 },
  // Real recording of the Declaration of Independence — drop the file to enable.
  { id: 'chapter-1945', src: '/audio/sfx/declaration-1945.mp3', vol: 0.8, loop: false },
];

const LS_KEY = 'httcb-audio';

// smooth volume fade (also plays/pauses at the ends)
const fades = new Map<HTMLAudioElement, number>();
function fadeTo(el: HTMLAudioElement, target: number, ms = 900) {
  const prev = fades.get(el);
  if (prev) cancelAnimationFrame(prev);
  if (target > 0 && el.paused) el.play().catch(() => {});
  const from = el.volume;
  const start = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / ms);
    el.volume = Math.max(0, Math.min(1, from + (target - from) * p));
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
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const enabledRef = useRef(false);

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
      m.set(s.src, a); // key by src so two clips can share a chapter id
    }
    sfxRef.current = m;

    return () => {
      amb.pause();
      m.forEach((a) => a.pause());
    };
  }, []);

  // cross-fade to the SFX of whichever chapter is centred in the viewport
  const applyActiveSfx = useCallback(() => {
    if (!enabledRef.current) return;
    const mid = window.innerHeight / 2;
    let active: string | null = null;
    for (const s of SFX) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) {
        active = s.id;
        break;
      }
    }
    for (const s of SFX) {
      const a = sfxRef.current.get(s.src);
      if (!a) continue;
      if (active === s.id) {
        if (s.loop === false && a.paused) a.currentTime = 0; // replay from start
        fadeTo(a, s.vol, s.loop === false ? 400 : 1400);
      } else {
        fadeTo(a, 0, 900);
      }
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
    if (ambientRef.current) fadeTo(ambientRef.current, AMBIENT_VOL, 1400);
    applyActiveSfx();
  }, [applyActiveSfx]);

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
  }, []);

  // restore preference — browsers block audio until a user gesture, so if the
  // user had it on we resume on their first interaction.
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

  // scroll → update which chapter ambience plays
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        applyActiveSfx();
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [applyActiveSfx]);

  // pause everything when the tab is hidden
  useEffect(() => {
    const onVis = () => {
      if (!enabledRef.current) return;
      if (document.hidden) {
        ambientRef.current?.pause();
        sfxRef.current.forEach((a) => a.pause());
      } else {
        ambientRef.current?.play().catch(() => {});
        applyActiveSfx();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [applyActiveSfx]);

  return (
    <>
      {/* speaker toggle */}
      <button
        type="button"
        onClick={() => (enabled ? disable() : enable())}
        aria-label={enabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        aria-pressed={enabled}
        className="group fixed bottom-7 right-6 z-[95] flex h-[46px] w-[46px] items-center justify-center rounded-full border border-vn-gold-antique/40 bg-[rgba(8,8,8,0.5)] backdrop-blur-sm transition-colors duration-300 hover:border-vn-gold md:bottom-9 md:right-9"
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
        {/* soft pulse when playing */}
        {enabled && (
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-vn-gold/30" style={{ animationDuration: '3s' }} />
        )}
      </button>

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
