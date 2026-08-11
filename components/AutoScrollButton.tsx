'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getLenis } from '@/lib/lenisStore';

// Cinematic auto-scroll pace, in pixels per second (documentary-slow).
const SPEED = 240;
const RING = 2 * Math.PI * 15; // circumference for r=15 progress ring

export default function AutoScrollButton() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const playingRef = useRef(false);
  const fallbackRaf = useRef<number | null>(null);
  const lastTs = useRef<number>(0);

  const maxScroll = () =>
    document.documentElement.scrollHeight - window.innerHeight;

  // --- stop / pause -----------------------------------------------------
  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    if (fallbackRaf.current !== null) {
      cancelAnimationFrame(fallbackRaf.current);
      fallbackRaf.current = null;
    }
    const lenis = getLenis();
    // Cancel a running Lenis tween by snapping its target to the current pos.
    if (lenis) {
      const cur = (lenis as unknown as { scroll: number }).scroll ?? window.scrollY;
      lenis.scrollTo(cur, { immediate: true, force: true });
    }
  }, []);

  // --- native rAF fallback (reduced-motion / no Lenis) ------------------
  const fallbackStep = useCallback(
    (ts: number) => {
      if (!playingRef.current) return;
      const dt = lastTs.current ? (ts - lastTs.current) / 1000 : 0;
      lastTs.current = ts;
      const next = window.scrollY + SPEED * dt;
      window.scrollTo(0, next);
      if (window.scrollY >= maxScroll() - 2) {
        pause();
        return;
      }
      fallbackRaf.current = requestAnimationFrame(fallbackStep);
    },
    [pause]
  );

  // --- play -------------------------------------------------------------
  const play = useCallback(() => {
    const max = maxScroll();
    const lenis = getLenis();
    let start = lenis
      ? ((lenis as unknown as { scroll: number }).scroll ?? window.scrollY)
      : window.scrollY;

    // If we're already at the very bottom, restart from the top.
    if (start >= max - 4) {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      start = 0;
    }

    playingRef.current = true;
    setPlaying(true);

    const remaining = Math.max(0, max - start);
    const duration = Math.max(4, remaining / SPEED);

    if (lenis) {
      lenis.scrollTo(max, {
        duration,
        easing: (t: number) => t, // linear = steady cinematic glide
        onComplete: () => {
          playingRef.current = false;
          setPlaying(false);
        },
      });
    } else {
      lastTs.current = 0;
      fallbackRaf.current = requestAnimationFrame(fallbackStep);
    }
  }, [fallbackStep]);

  const toggle = useCallback(() => {
    if (playingRef.current) pause();
    else play();
  }, [pause, play]);

  // --- track scroll progress + auto-stop on user interaction ------------
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = maxScroll();
        const p = max > 0 ? window.scrollY / max : 0;
        setProgress(p);
        setAtEnd(p >= 0.995);
        ticking = false;
      });
    };

    // Any genuine user input cancels autoplay (our programmatic scroll does
    // NOT emit these events, so they are always user-initiated).
    const onUserIntent = () => {
      if (playingRef.current) pause();
    };
    const onKey = (e: KeyboardEvent) => {
      if (
        ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(
          e.key
        )
      ) {
        onUserIntent();
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('wheel', onUserIntent, { passive: true });
    window.addEventListener('touchstart', onUserIntent, { passive: true });
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', onUserIntent);
      window.removeEventListener('touchstart', onUserIntent);
      window.removeEventListener('keydown', onKey);
      if (fallbackRaf.current !== null) cancelAnimationFrame(fallbackRaf.current);
    };
  }, [pause]);

  const label = playing ? 'Tạm dừng' : atEnd ? 'Lướt lại' : 'Tự động lướt';

  return (
    <button
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Tạm dừng tự động lướt' : 'Tự động lướt qua hành trình'}
      className="group fixed bottom-7 left-6 z-[95] flex items-center gap-3 md:bottom-9 md:left-9"
    >
      <span className="relative flex h-[46px] w-[46px] items-center justify-center">
        {/* progress ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(244,235,216,0.15)" strokeWidth="1.5" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="#FFCD00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.15s linear' }}
          />
        </svg>

        {/* play / pause glyph */}
        <span className="relative flex h-3.5 w-3.5 items-center justify-center text-vn-gold transition-transform duration-300 group-hover:scale-110">
          {playing ? (
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
              <rect x="1.5" y="1" width="3" height="10" fill="currentColor" />
              <rect x="7.5" y="1" width="3" height="10" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 translate-x-[1px]" aria-hidden="true">
              <polygon points="2,1 11,6 2,11" fill="currentColor" />
            </svg>
          )}
        </span>
      </span>

      <span className="font-body text-[11px] uppercase tracking-[0.24em] text-vn-ivory/70 transition-colors duration-300 group-hover:text-vn-ivory">
        {label}
      </span>
    </button>
  );
}
