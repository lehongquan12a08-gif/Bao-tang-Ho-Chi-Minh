'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { setLenis } from '@/lib/lenisStore';

/**
 * Bootstraps Lenis smooth scrolling and wires it into GSAP's ticker so that
 * ScrollTrigger stays perfectly in sync with the smoothed scroll position.
 *
 * Mount this ONCE, near the root of the app. It is a no-op on the server and
 * respects `prefers-reduced-motion`.
 */
export function useSmoothScroll(): void {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      // Skip smooth scroll entirely — ScrollTrigger still works on native scroll.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    // Drive Lenis from GSAP's rAF loop and keep ScrollTrigger updated.
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Share the instance so UI controls (auto-scroll) can drive it.
    setLenis(lenis);

    // Dev-only: expose instances so scroll wiring can be verified from the console.
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as Record<string, unknown>).__lenis = lenis;
      (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
    }

    // Recalculate after fonts / images settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const settle = window.setTimeout(refresh, 600);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
      window.removeEventListener('load', refresh);
      window.clearTimeout(settle);
    };
  }, []);
}
