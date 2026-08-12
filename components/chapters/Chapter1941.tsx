'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import TextureBg from '@/components/TextureBg';

export default function Chapter1941() {
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

      // camera pushes in: photo zooms slowly
      tl.to(q('.m-photo'), { yPercent: -6, scale: 1.14, ease: 'none' }, 0)
        .to(q('.fog'), { yPercent: -10, opacity: 0.7, ease: 'none' }, 0)
        .fromTo(q('.txt-1941'), { opacity: 0, y: 60 }, { opacity: 1, y: 0 }, 0.1)
        .fromTo(q('.txt-trove'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.35)
        .fromTo(q('.txt-30'), { opacity: 0 }, { opacity: 1 }, 0.6);
    },
    { scope: root }
  );

  return (
    <section
      id="chapter-1941"
      ref={root}
      className="relative h-[300vh]"
      style={{
        background:
          'linear-gradient(180deg, #080808 0%, #101a18 40%, #0a1210 100%)',
      }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* full-bleed archival photograph — Việt Bắc (1941) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/photos/mountain-1941.webp"
          alt="Núi rừng Việt Bắc"
          className="m-photo will-transform pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          style={{ filter: 'grayscale(0.3) contrast(1.05) brightness(0.74)', objectPosition: 'center 8%' }}
        />

        {/* scrim: dark at the top (behind the year), clear over the faces below */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,10,9,0.9) 0%, rgba(8,10,9,0.55) 28%, rgba(8,10,9,0.2) 52%, rgba(8,10,9,0.35) 75%, rgba(7,11,10,0.92) 100%)',
          }}
        />

        {/* soft dark gradient at the base (grounds the scene, no hard shapes) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[28vh] bg-gradient-to-t from-vn-black to-transparent" />

        {/* atmospheric fog band */}
        <div
          className="fog will-transform pointer-events-none absolute inset-x-0 top-[45%] h-[30vh]"
          style={{
            background:
              'linear-gradient(180deg, transparent, rgba(244,235,216,0.14), transparent)',
            filter: 'blur(8px)',
          }}
        />

        {/* text — anchored high so the photographed faces stay clear below */}
        <div className="absolute top-[8%] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center text-center">
          <h2 className="txt-1941 will-transform headline-year text-vn-ivory text-glow-gold">
            1941
          </h2>
          <p className="txt-trove will-transform mt-5 font-display text-4xl uppercase tracking-[0.35em] text-vn-gold md:mt-7 md:text-6xl">
            Trở về
          </p>
          <p className="txt-30 will-transform mt-5 font-body text-[13px] uppercase tracking-[0.3em] text-vn-ivory/75 md:text-base">
            Sau 30 năm xa Tổ quốc
          </p>
        </div>
      </div>
    </section>
  );
}
