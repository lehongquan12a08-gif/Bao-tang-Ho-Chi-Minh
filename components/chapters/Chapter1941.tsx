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

      // camera pushes in: photo zooms slowly, ridge bands drift at the base
      tl.to(q('.m-photo'), { yPercent: -6, scale: 1.14, ease: 'none' }, 0)
        .to(q('.m-back'), { yPercent: 8, ease: 'none' }, 0)
        .to(q('.m-mid'), { yPercent: 4, ease: 'none' }, 0)
        .to(q('.m-fore'), { yPercent: -6, ease: 'none' }, 0)
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
          style={{ filter: 'grayscale(0.3) contrast(1.05) brightness(0.6)' }}
        />

        {/* scrim for legibility */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 42%, rgba(8,10,9,0.35) 0%, rgba(8,10,9,0.4) 45%, rgba(7,11,10,0.92) 100%)',
          }}
        />

        {/* ridge silhouettes — a low band at the base only */}
        <svg
          className="m-back will-transform absolute bottom-0 z-[2] h-[26vh] w-full"
          viewBox="0 0 1440 260"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <path d="M0 260 L0 150 L240 90 L480 140 L720 70 L960 135 L1200 85 L1440 145 L1440 260 Z" fill="#131d1b" />
        </svg>
        <svg
          className="m-mid will-transform absolute bottom-0 z-[2] h-[20vh] w-full"
          viewBox="0 0 1440 260"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <path d="M0 260 L0 180 L300 110 L560 180 L820 100 L1080 175 L1300 125 L1440 175 L1440 260 Z" fill="#0c1412" />
        </svg>
        <svg
          className="m-fore will-transform absolute bottom-0 z-[2] h-[15vh] w-full"
          viewBox="0 0 1440 260"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <path d="M0 260 L0 210 L360 150 L680 220 L1000 150 L1320 215 L1440 185 L1440 260 Z" fill="#060a09" />
        </svg>

        {/* atmospheric fog band */}
        <div
          className="fog will-transform pointer-events-none absolute inset-x-0 top-[45%] h-[30vh]"
          style={{
            background:
              'linear-gradient(180deg, transparent, rgba(244,235,216,0.14), transparent)',
            filter: 'blur(8px)',
          }}
        />

        {/* text */}
        <div className="relative z-20 flex flex-col items-center text-center">
          <h2 className="txt-1941 will-transform headline-year text-vn-ivory/90 text-glow-gold">
            1941
          </h2>
          <p className="txt-trove will-transform mt-2 font-display text-4xl uppercase tracking-[0.35em] text-vn-gold md:text-6xl">
            Trở về
          </p>
          <p className="txt-30 will-transform mt-8 font-body text-[13px] uppercase tracking-[0.3em] text-vn-ivory/70 md:text-base">
            Sau 30 năm xa Tổ quốc
          </p>
        </div>
      </div>
    </section>
  );
}
