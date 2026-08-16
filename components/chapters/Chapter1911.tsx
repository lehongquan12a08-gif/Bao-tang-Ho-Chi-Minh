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

      // full-bleed archival photo — barely any zoom (keeps the man's face intact)
      tl.fromTo(
        q('.ship'),
        { scale: 1.0 },
        { scale: 1.04, ease: 'none' },
        0
      );

      // the ship rides the leading edge of the gold line as it fills.
      tl.fromTo(q('.ship-svg'), { left: '6%' }, { left: '94%', ease: 'none' }, 0)
        .fromTo(q('.journey-fill'), { scaleX: 0.06 }, { scaleX: 0.94, ease: 'none' }, 0);

      // three-word headline builds — quicker (all in view earlier)
      tl.fromTo(q('.w-radi'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.04)
        .fromTo(q('.w-tim'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.16)
        .fromTo(q('.w-cuu'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.28);
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
        {/* full-bleed archival photo — object-position top keeps the man's full
            face in frame; the navbar auto-hides on scroll so it never covers it */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/photos/ship-1911.webp"
          alt="Con tàu rời bến — hành trình ra đi tìm đường cứu nước (1911)"
          className="ship will-transform pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          style={{ filter: 'sepia(0.32) contrast(1.05) brightness(0.85)', objectPosition: 'center top' }}
        />

        {/* vignette scrim — darker in the centre (for the text), lighter at the
            edges so the man on the right stays lit */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 75% 95% at 50% 48%, rgba(8,8,8,0.72) 0%, rgba(8,8,8,0.45) 42%, rgba(8,8,8,0.1) 72%, rgba(8,8,8,0) 100%)',
          }}
        />
        {/* soft bottom gradient so the journey line reads */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[30vh] bg-gradient-to-t from-vn-black/85 to-transparent" />

        {/* original harbour-mist texture (generated asset) */}
        <TextureBg src="/images/mist-lite.webp" className="z-[1] opacity-25 mix-blend-overlay" />

        {/* year — a clear gold number ABOVE the headline (never overlaps it) */}
        <div
          className="pointer-events-none absolute left-1/2 top-[9%] z-[2] -translate-x-1/2 font-serif-hist font-bold leading-none"
          style={{
            fontSize: 'clamp(48px, 6vw, 104px)',
            letterSpacing: '0.06em',
            color: 'rgba(255, 205, 0, 0.16)',
            WebkitTextStroke: '1.6px rgba(255, 205, 0, 0.6)',
          }}
        >
          1911
        </div>

        {/* headline — centred, nudged down so the year sits clear above it */}
        <div className="absolute left-1/2 top-[56%] z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center">
          <span className="w-radi will-transform headline-mega text-vn-ivory text-glow-gold">RA ĐI</span>
          <span className="w-tim will-transform font-display text-3xl uppercase tracking-[0.3em] text-vn-gold md:text-5xl">
            Tìm đường
          </span>
          <span className="w-cuu will-transform headline-mega text-vn-ivory text-glow-gold">CỨU NƯỚC</span>
        </div>

        {/* symbolic horizontal journey — the ship sails along this gold line */}
        <div className="absolute bottom-[15vh] z-20 flex w-full max-w-3xl flex-col items-center px-8">
          <div className="relative h-px w-full bg-white/15">
            <div className="journey-fill absolute inset-y-0 left-0 w-full origin-left bg-vn-gold-antique" />
            {/* ship sits ON the line and rides the leading edge of the fill */}
            <div className="ship-svg will-transform pointer-events-none absolute bottom-0 left-0 z-10 w-[20vw] max-w-[240px] -translate-x-1/2">
              <Ship className="h-auto w-full" />
            </div>
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
