'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { playChime } from '@/lib/uiSound';
import { setDeclVideo } from '@/lib/declVideo';

/**
 * 1945 — two acts:
 *   A. the date builds up and HOLDS  (02 · 09 · 1945)
 *   B. the Ba Đình scene, where the Tuyên ngôn Độc lập video plays and is held
 *      on screen while Bác reads (AudioController drives playback).
 */
export default function Chapter1945() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      // ---- Act A : the date builds and holds (no flashing/black) ---------
      tl.call(playChime, [0], 0.02)
        .fromTo(q('.g-02'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.015 }, 0.02)
        .call(playChime, [1], 0.04)
        .fromTo(q('.g-09'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.015 }, 0.04)
        .call(playChime, [2], 0.06)
        .fromTo(q('.g-1945'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.015 }, 0.06)
        // whole date holds, then lifts away before the scene
        .to(q('.date-line'), { opacity: 0, y: -30, duration: 0.05 }, 0.34);

      // ---- Act B : the Ba Đình scene + video (held to the end) -----------
      tl.fromTo(q('.scene'), { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.38)
        .fromTo(q('.s-decl'), { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.05 }, 0.4)
        .fromTo(q('.badinh-label'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.04 }, 0.42);
      // the scene stays on screen for the rest of the section
    },
    { scope: root }
  );

  return (
    <section id="chapter-1945" ref={root} className="relative h-[380vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-vn-black">
        {/* Act A — the date, built up and held */}
        <div className="date-line will-transform absolute z-[5] flex items-baseline gap-4 md:gap-8">
          <span className="g-02 will-transform headline-mega text-vn-ivory opacity-0">02</span>
          <span className="headline-mega text-vn-gold/70">·</span>
          <span className="g-09 will-transform headline-mega text-vn-ivory opacity-0">09</span>
          <span className="headline-mega text-vn-gold/70">·</span>
          <span className="g-1945 will-transform headline-mega text-vn-gold text-glow-gold opacity-0">1945</span>
        </div>

        {/* Act B — the Ba Đình scene with the Tuyên ngôn video */}
        <div className="scene absolute inset-0 z-[3] opacity-0">
          {/* faint Ba Đình atmosphere */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/photos/badinh.webp"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18]"
          />
          <div className="pointer-events-none absolute inset-0 bg-vn-black/55" />

          <p className="badinh-label will-transform pointer-events-none absolute left-1/2 top-[9%] -translate-x-1/2 whitespace-nowrap font-display text-2xl uppercase tracking-[0.3em] text-vn-ivory md:text-4xl">
            Quảng trường Ba Đình
          </p>

          {/* centrepiece: Tuyên ngôn Độc lập video — outer div centres (untouched
              by GSAP), inner .s-decl is animated so centring never gets overridden */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="s-decl will-transform">
              {/* Bác đọc Tuyên ngôn — video tư liệu (AudioController tự phát khi
                  cuộn tới cảnh Ba Đình); poster là ảnh tĩnh nên trước khi phát
                  vẫn thấy khung hình quen thuộc */}
              <video
                ref={setDeclVideo}
                src="/video/tuyen-ngon-1945.mp4"
                poster="/images/photos/declaration-1945.webp"
                playsInline
                preload="auto"
                controls
                className="h-auto max-h-[62vh] w-auto max-w-[52vw] object-contain"
                style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.75)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
