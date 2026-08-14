'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NARRATION, NARRATION_FILES, type NarrationCue } from '@/data/narration';
import { narrationState } from '@/lib/narrationState';

// The voice recordings are a bit quiet, so lift them with a Web Audio gain
// (can exceed 1.0, unlike element.volume). Master slider still scales it.
const NARR_BOOST = 2.8;
// makeup gain after the compressor — lifts the overall voice level
const VOICE_MAKEUP = 1.5;
// the Tuyên ngôn recording is also a voice — lift it close to the narration
const DECL_SRC = '/audio/sfx/declaration-1945.mp3';
const DECL_BOOST = 2.5;
// the section fraction band the Tuyên ngôn recording scrubs — the Ba Đình photo
// act, held on screen while Bác reads. It only fires AFTER the 1945 narration
// has finished (its scroll band ends at 0.46), so the two voices never overlap.
const DECL_SCROLL: [number, number] = [0.44, 0.63];
// how much the supporting sounds (music + waves/wind/crowd) drop while a voice
// (narration or the Tuyên ngôn recording) is speaking
const AMBIENT_DUCK = 0.18;
const SFX_DUCK = 0.22;

// Background music (loops) + per-chapter ambience. Some clips are `loop:false`
// one-shots (e.g. the real Tuyên ngôn recording) that fire inside a scroll
// `range` (fraction of the section) so they hit exactly at the right moment.
// Drop files per public/audio/README.md; missing files stay silent (no errors).
// Bump when a generated audio file changes so browsers fetch the new version
// instead of a cached copy of the same filename.
const V = 'v=5';
const AMBIENT_SRC = `/audio/ambient.wav?${V}`;
const AMBIENT_VOL = 0.18;

// `voice: true` = a spoken clip (kept loud, ducks everything else).
type Sfx = { id: string; src: string; vol: number; loop?: boolean; range?: [number, number]; voice?: boolean };
const SFX: Sfx[] = [
  // supporting ambience — deliberately quiet
  { id: 'chapter-1911', src: `/audio/sfx/ship-1911.wav?${V}`, vol: 0.16 },
  { id: 'chapter-1941', src: `/audio/sfx/mountain-1941.wav?${V}`, vol: 0.14 },
  { id: 'chapter-1945', src: `/audio/sfx/crowd-1945.wav?${V}`, vol: 0.09 },
  // Bác đọc Tuyên ngôn — a voice clip, fires on the Ba Đình scene AFTER the
  // 1945 narration has finished (narration band ends at 0.46).
  { id: 'chapter-1945', src: DECL_SRC, vol: 1.0, loop: false, voice: true, range: [0.4, 0.72] },
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
  const narrStartRef = useRef(0);
  const narrEndRef = useRef(0);
  const narrElRef = useRef<HTMLAudioElement | null>(null);
  const narrCtxRef = useRef<AudioContext | null>(null);
  const narrWatchRef = useRef<number | null>(null);
  const declFiredRef = useRef(false); // Tuyên ngôn one-shot: fire once per visit

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

    // narration files (2 parts)
    const nm = new Map<1 | 2, HTMLAudioElement>();
    ([1, 2] as const).forEach((part) => {
      const a = new Audio(NARRATION_FILES[part]);
      a.preload = 'auto';
      a.volume = 0;
      nm.set(part, a);
    });
    narrRef.current = nm;

    // route narration through a Web Audio gain so the quiet voice can be lifted
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        const ctx = new AC();
        narrCtxRef.current = ctx;
        // compressor tames peaks so the boost doesn't distort, then a makeup
        // gain lifts the overall (louder) level
        const comp = ctx.createDynamicsCompressor();
        const makeup = ctx.createGain();
        makeup.gain.value = VOICE_MAKEUP;
        comp.connect(makeup);
        makeup.connect(ctx.destination);
        nm.forEach((a) => {
          const src = ctx.createMediaElementSource(a);
          const g = ctx.createGain();
          g.gain.value = NARR_BOOST;
          src.connect(g);
          g.connect(comp);
        });
        // route the Tuyên ngôn recording through the same boost (a bit lower)
        const decl = m.get(DECL_SRC);
        if (decl) {
          const dsrc = ctx.createMediaElementSource(decl);
          const dg = ctx.createGain();
          dg.gain.value = DECL_BOOST;
          dsrc.connect(dg);
          dg.connect(comp);
        }
      }
    } catch {
      /* Web Audio unavailable → narration plays at element volume */
    }

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

  // stop the active narration exactly at its segment end (frame-accurate)
  const stopNarrWatch = useCallback(() => {
    if (narrWatchRef.current != null) {
      cancelAnimationFrame(narrWatchRef.current);
      narrWatchRef.current = null;
    }
  }, []);
  const narrWatch = useCallback(() => {
    const a = narrElRef.current;
    if (!a || a.paused) {
      stopNarrWatch();
      return;
    }
    if (a.currentTime >= narrEndRef.current) {
      a.pause();
      stopNarrWatch();
      // segment finished — publish the final state so the auto-scroll moves on
      // (apply() is scroll-driven and won't run while the page barely moves)
      narrationState.progress = 1;
      narrationState.playing = false;
      narrationState.speaking = false;
      return;
    }
    // publish the audio clock so the auto-scroll can lock the scroll to the voice
    const dur = narrEndRef.current - narrStartRef.current;
    narrationState.progress = dur > 0 ? clamp((a.currentTime - narrStartRef.current) / dur) : 0;
    narrationState.playing = true;
    narrationState.speaking = true;
    narrWatchRef.current = requestAnimationFrame(narrWatch);
  }, [stopNarrWatch]);

  // update which ambience plays, honouring scroll `range` + master volume + duck
  const apply = useCallback(() => {
    if (!enabledRef.current) return;
    const master = masterRef.current;
    const mid = window.innerHeight / 2;

    // 1) narration — play the current chapter's voiceover segment ----------
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
          narrStartRef.current = narrCue.start;
          narrEndRef.current = narrCue.end;
          try {
            a.currentTime = narrCue.start;
          } catch {
            /* ignore */
          }
          a.volume = clamp(master); // Web Audio gain adds the boost on top
          narrCtxRef.current?.resume().catch(() => {});
          a.play().catch(() => {});
          narrElRef.current = a;
          narrationState.activeId = narrCue.id;
          narrationState.progress = 0;
          narrationState.playing = true;
          narrationState.scroll0 = narrCue.scroll ? narrCue.scroll[0] : 0;
          narrationState.scroll1 = narrCue.scroll ? narrCue.scroll[1] : 1;
          stopNarrWatch();
          narrWatchRef.current = requestAnimationFrame(narrWatch);
        }
      }
    } else if (narrActiveRef.current) {
      narrRef.current.forEach((a) => a.pause());
      narrActiveRef.current = null;
      narrElRef.current = null;
      narrationState.activeId = null;
      narrationState.playing = false;
      stopNarrWatch();
    }

    // 2) which SFX are active? (and is a voice clip among them?) -----------
    const activeMap = new Map<string, boolean>();
    let declActive = false;
    for (const s of SFX) {
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
      activeMap.set(s.src, active);
      // a voice clip only keeps the "voice" flag until it has finished playing —
      // otherwise it would hold the auto-scroll forever after the clip ends
      if (active && s.voice) {
        const de = sfxRef.current.get(s.src);
        if (!de || !de.ended) declActive = true;
      }
    }
    // don't stack two voices: the Tuyên ngôn recording takes over from narration
    if (declActive && narrElRef.current && !narrElRef.current.paused) {
      narrElRef.current.pause();
      stopNarrWatch();
    }
    const narrPlaying = narrElRef.current ? !narrElRef.current.paused : false;
    const voice = declActive || narrPlaying;
    narrationState.speaking = voice; // any audible voice
    if (declActive) {
      // the Tuyên ngôn recording takes over as the scrubbing voice: hold on the
      // Ba Đình photo (DECL_SCROLL) and glide across it as Bác reads
      const de = sfxRef.current.get(DECL_SRC);
      const d = de && isFinite(de.duration) ? de.duration : 0;
      narrationState.activeId = 'chapter-1945';
      narrationState.scroll0 = DECL_SCROLL[0];
      narrationState.scroll1 = DECL_SCROLL[1];
      narrationState.progress = de && d > 0 ? clamp(de.currentTime / d) : 0;
      narrationState.playing = !!(de && !de.paused && !de.ended);
    } else {
      narrationState.playing = narrPlaying; // only the narration drives the scrub
    }

    // 3) set SFX volumes — supporting ambience ducks under a voice ---------
    for (const s of SFX) {
      const a = sfxRef.current.get(s.src);
      if (!a) continue;
      if (activeMap.get(s.src)) {
        if (s.voice) {
          // fire once on entering range; don't restart while still in range
          // (even after it ends) — that would trap the auto-scroll on a loop
          if (!declFiredRef.current) {
            declFiredRef.current = true;
            try {
              a.currentTime = 0;
            } catch {
              /* ignore */
            }
            fadeTo(a, s.vol * master, 300);
          }
        } else {
          fadeTo(a, s.vol * master * (voice ? SFX_DUCK : 1), 700);
        }
      } else {
        if (s.voice) declFiredRef.current = false; // re-arm for next visit
        fadeTo(a, 0, 900);
      }
    }

    // 4) background music --------------------------------------------------
    duckRef.current = voice;
    const ambTarget = AMBIENT_VOL * master * (voice ? AMBIENT_DUCK : 1);
    if (ambientRef.current && Math.abs(ambTarget - ambTargetRef.current) > 0.001) {
      ambTargetRef.current = ambTarget;
      fadeTo(ambientRef.current, ambTarget, 700);
    }
  }, [narrWatch, stopNarrWatch]);

  const enable = useCallback(() => {
    enabledRef.current = true;
    setEnabled(true);
    setShowPrompt(false);
    try {
      localStorage.setItem(LS_KEY, 'on');
    } catch {
      /* ignore */
    }
    narrCtxRef.current?.resume().catch(() => {});
    narrationState.enabled = true;
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
    declFiredRef.current = false;
    stopNarrWatch();
    narrationState.speaking = false;
    narrationState.playing = false;
    narrationState.activeId = null;
    narrationState.progress = 0;
    narrationState.enabled = false;
  }, [stopNarrWatch]);

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
    const d = duckRef.current;
    if (ambientRef.current && !ambientRef.current.paused) {
      const t = AMBIENT_VOL * v * (d ? AMBIENT_DUCK : 1);
      ambientRef.current.volume = clamp(t);
      ambTargetRef.current = t;
    }
    for (const s of SFX) {
      const a = sfxRef.current.get(s.src);
      if (a && !a.paused) {
        a.volume = clamp(s.voice ? s.vol * v : s.vol * v * (d ? SFX_DUCK : 1));
      }
    }
    if (narrElRef.current && !narrElRef.current.paused) {
      narrElRef.current.volume = clamp(v); // Web Audio gain applies the boost
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

  // also re-evaluate on a low-frequency tick: while the auto-scroll HOLDS for a
  // voice (no scrolling), scroll events stop firing — this keeps the audio state
  // (e.g. detecting when a voice clip has finished) fresh so it never deadlocks.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (enabledRef.current) apply();
    }, 200);
    return () => window.clearInterval(id);
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
        declFiredRef.current = false;
        narrationState.speaking = false;
        narrationState.playing = false;
        narrationState.activeId = null;
        stopNarrWatch();
      } else {
        ambientRef.current?.play().catch(() => {});
        apply();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [apply, stopNarrWatch]);

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
