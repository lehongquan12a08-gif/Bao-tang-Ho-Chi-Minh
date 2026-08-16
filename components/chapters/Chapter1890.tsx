'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import TextureBg from '@/components/TextureBg';

const PLACES = ['Kim Liên', 'Nam Đàn', 'Nghệ An'];

export default function Chapter1890() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Làng Sen backdrop drifts gently (parallax)
      gsap.fromTo(
        q('.langsen'),
        { yPercent: 8, scale: 1.08 },
        {
          yPercent: -4,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      );

      // the thin gold timeline draws itself
      gsap.fromTo(
        q('.tl-line'),
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: q('.tl-line'),
            start: 'top 75%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      id="chapter-1890"
      ref={root}
      className="relative h-[240vh]"
      style={{
        background:
          'linear-gradient(180deg, #080808 0%, #241812 30%, #3a2a1c 55%, #241812 100%)',
      }}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        {/* Làng Sen — quê Bác (Kim Liên): full-bleed, graded warm */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/photos/langsen.webp"
          alt="Nhà tranh nơi Chủ tịch Hồ Chí Minh sinh ra, Làng Sen — Kim Liên"
          className="langsen will-transform pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          style={{
            filter: 'sepia(0.5) saturate(0.8) brightness(0.7) contrast(1.05)',
          }}
        />

        {/* dark scrim so headings stay legible over the photo */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(10,7,5,0.55) 0%, rgba(10,7,5,0.35) 40%, rgba(8,8,8,0.9) 100%)',
          }}
        />

        {/* original aged-paper texture (generated asset) */}
        <TextureBg src="/images/paper-lite.webp" className="z-[1] opacity-[0.22] mix-blend-overlay" />

        {/* faint historical texture wash */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 20%, rgba(244,235,216,0.25), transparent 40%), radial-gradient(circle at 75% 80%, rgba(106,73,50,0.4), transparent 45%)',
          }}
        />

        <p className="eyebrow relative z-10 mb-6 text-vn-gold-antique">Chương 01</p>

        <h2 className="headline-year relative z-10 text-vn-ivory">1890</h2>

        <h3 className="font-display relative z-10 mt-4 text-4xl font-semibold uppercase tracking-[0.2em] text-vn-ivory md:text-6xl">
          Từ Làng Sen
        </h3>
        <p className="relative z-10 mt-4 font-serif-hist text-lg italic text-vn-ivory/70 md:text-xl">
          Nơi một hành trình bắt đầu
        </p>

        {/* thin gold timeline + place names */}
        <div className="relative z-10 mt-12 flex w-full max-w-md flex-col items-center">
          <div className="tl-line h-px w-full origin-left bg-vn-gold-antique/70" />
          <div className="mt-4 flex w-full items-center justify-between">
            {PLACES.map((p) => (
              <span
                key={p}
                className="font-body text-[11px] uppercase tracking-[0.24em] text-vn-ivory/60"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
