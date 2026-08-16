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
    // Touch devices (phones/tablets): skip Lenis. Its per-frame smoothing on top
    // of the scrubbed ScrollTriggers overloads phones (freezing + audio stutter);
    // native scrolling is stable there and ScrollTrigger works fine on it.
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (prefersReduced || isTouch) {
      // Native scroll — no Lenis. Drive ScrollTrigger from the native scroll
      // event so the scrubbed animations still advance.
      const onScroll = () => ScrollTrigger.update();
      window.addEventListener('scroll', onScroll, { passive: true });
      if (process.env.NODE_ENV !== 'production') {
        (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
      }
      ScrollTrigger.refresh();
      const refresh = () => ScrollTrigger.refresh();
      // Only refresh on a real WIDTH change (orientation) — NOT the height-only
      // resize the mobile URL bar fires on every scroll (that would "repeat" the
      // first section).
      let lastW = window.innerWidth;
      const onResize = () => {
        if (window.innerWidth !== lastW) {
          lastW = window.innerWidth;
          refresh();
        }
      };
      window.addEventListener('load', refresh);
      window.addEventListener('resize', onResize);
      const settle = window.setTimeout(refresh, 600);
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('load', refresh);
        window.removeEventListener('resize', onResize);
        window.clearTimeout(settle);
      };
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

    // Recalculate when the viewport size changes — notably entering/leaving
    // browser fullscreen (F11), which changes innerHeight and would otherwise
    // leave the pinned/sticky sections misaligned. Debounced so it runs once the
    // new layout has settled; it only recomputes positions (safe, non-visual).
    let rt = 0;
    const doRefresh = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        // preserve HOW FAR through the page we are across the refresh, so
        // entering/leaving F11 (which changes the total scrollable height)
        // keeps the same story point instead of jumping.
        const maxBefore = document.documentElement.scrollHeight - window.innerHeight;
        const frac = maxBefore > 0 ? window.scrollY / maxBefore : 0;
        lenis.resize();
        ScrollTrigger.refresh();
        const maxAfter = document.documentElement.scrollHeight - window.innerHeight;
        lenis.scrollTo(frac * maxAfter, { immediate: true, force: true });
      }, 160);
    };
    // Only refresh on a real WIDTH change (orientation / window resize / F11) —
    // NOT the height-only resize the mobile URL bar fires on every scroll, which
    // would reset the pinned sections and make the first one "repeat".
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      doRefresh();
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('fullscreenchange', doRefresh);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
      window.removeEventListener('load', refresh);
      window.clearTimeout(settle);
      window.clearTimeout(rt);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('fullscreenchange', doRefresh);
    };
  }, []);
}
