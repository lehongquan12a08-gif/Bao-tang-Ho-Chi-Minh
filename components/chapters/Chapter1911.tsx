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

      // full-bleed archival photo — very gentle push (keeps the man in frame)
      tl.fromTo(
        q('.ship'),
        { scale: 1.03 },
        { scale: 1.1, ease: 'none' },
        0
      );

      // the ship rides the leading edge of the gold line as it fills.
      tl.fromTo(q('.ship-svg'), { left: '6%' }, { left: '94%', ease: 'none' }, 0)
        .fromTo(q('.journey-fill'), { scaleX: 0.06 }, { scaleX: 0.94, ease: 'none' }, 0);

      // three-word headline builds
      tl.fromTo(q('.w-radi'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.05)
        .fromTo(q('.w-tim'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.28)
        .fromTo(q('.w-cuu'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.5);
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
        {/* full-bleed archival photograph — the young man stays clear on the RIGHT */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/photos/ship-1911.webp"
          alt="Con tàu rời bến — hành trình ra đi tìm đường cứu nước (1911)"
          className="ship will-transform pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          style={{ filter: 'sepia(0.32) contrast(1.05) brightness(0.85)', objectPosition: 'center' }}
        />

        {/* LEFT scrim only — darkens the text side, leaves the man on the right lit */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(90deg, rgba(8,8,8,0.94) 0%, rgba(8,8,8,0.75) 28%, rgba(8,8,8,0.3) 52%, rgba(8,8,8,0) 74%)',
          }}
        />
        {/* soft bottom gradient so the journey line reads */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[30vh] bg-gradient-to-t from-vn-black/85 to-transparent" />

        {/* original harbour-mist texture (generated asset) */}
        <TextureBg src="/images/mist.webp" className="z-[1] opacity-25 mix-blend-overlay" />

        {/* year, faint behind the title */}
        <h2 className="headline-year pointer-events-none absolute left-[6%] top-[14%] z-[2] text-white/[0.07]">
          1911
        </h2>

        {/* headline — anchored LEFT so it never covers the man on the right */}
        <div className="absolute left-[6%] top-1/2 z-20 flex max-w-[46vw] -translate-y-1/2 flex-col items-start gap-1 text-left">
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
