'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import TextureBg from '@/components/TextureBg';
import Ship from '@/components/objects/Ship';

const STOPS = ['Việt Nam', 'Châu Á', 'Châu Âu', 'Thế giới'];

export default function Chapter1911() {
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

      // full-bleed archival photo — slow Ken Burns push
      tl.fromTo(
        q('.ship'),
        { scale: 1.05, xPercent: -3 },
        { scale: 1.2, xPercent: 3, ease: 'none' },
        0
      );

      // the ship sails across the lower frame
      tl.fromTo(
        q('.ship-svg'),
        { xPercent: -70 },
        { xPercent: 70, ease: 'none' },
        0
      );

      // three-word headline builds
      tl.fromTo(q('.w-radi'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.05)
        .fromTo(q('.w-tim'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.28)
        .fromTo(q('.w-cuu'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.5);

      // horizontal journey timeline fills
      tl.fromTo(
        q('.journey-fill'),
        { scaleX: 0 },
        { scaleX: 1, ease: 'none' },
        0.15
      );
    },
    { scope: root }
  );

  return (
    <section
      id="chapter-1911"
      ref={root}
      className="relative h-[320vh]"
      style={{
        background:
          'linear-gradient(180deg, #241812 0%, #0d1418 45%, #080808 100%)',
      }}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* full-bleed archival photograph — ra đi tìm đường cứu nước (1911) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/photos/ship-1911.webp"
          alt="Con tàu rời bến — hành trình ra đi tìm đường cứu nước (1911)"
          className="ship will-transform pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          style={{ filter: 'sepia(0.35) contrast(1.05) brightness(0.72)' }}
        />

        {/* scrim for legibility */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(8,8,8,0.45) 0%, rgba(8,8,8,0.35) 40%, rgba(8,8,8,0.88) 100%)',
          }}
        />

        {/* original harbour-mist texture (generated asset) */}
        <TextureBg src="/images/mist.webp" className="z-[1] opacity-30 mix-blend-overlay" />

        {/* symbolic ship sailing across the lower frame */}
        <div className="ship-svg will-transform pointer-events-none absolute bottom-[20vh] left-1/2 z-[2] w-[32vw] max-w-[420px] -translate-x-1/2 opacity-80">
          <Ship className="h-auto w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]" />
        </div>

        {/* year, faint behind */}
        <h2 className="headline-year pointer-events-none absolute top-[8%] z-[2] text-white/[0.08]">
          1911
        </h2>

        {/* three-word headline */}
        <div className="relative z-20 flex flex-col items-center gap-1 text-center">
          <span className="w-radi will-transform headline-mega text-vn-ivory text-glow-gold">RA ĐI</span>
          <span className="w-tim will-transform font-display text-3xl uppercase tracking-[0.3em] text-vn-gold md:text-5xl">
            Tìm đường
          </span>
          <span className="w-cuu will-transform headline-mega text-vn-ivory text-glow-gold">CỨU NƯỚC</span>
        </div>

        {/* symbolic horizontal journey */}
        <div className="absolute bottom-[12vh] z-20 flex w-full max-w-3xl flex-col items-center px-8">
          <div className="relative h-px w-full bg-white/15">
            <div className="journey-fill absolute inset-y-0 left-0 w-full origin-left bg-vn-gold-antique" />
          </div>
          <div className="mt-4 flex w-full items-center justify-between">
            {STOPS.map((s) => (
              <span
                key={s}
                className="font-body text-[11px] uppercase tracking-[0.22em] text-vn-ivory/60"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
