'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import GoldStar from '@/components/objects/GoldStar';
import TextureBg from '@/components/TextureBg';
import Portrait from '@/components/Portrait';

/**
 * HERO — the cinematic entry. A ~360vh scroll surface with a pinned (sticky)
 * 100vh stage. Clean, layered composition (no crossing text): portrait above,
 * title anchored at the bottom over a scrim. One scrubbed timeline plays:
 *   1. depth reveal (parallax layers ease in, star turns)
 *   2. title + portrait recede
 *   3. the gold star scales up and swallows the frame, black → Vietnam red,
 *      handing off to Chapter 1890.
 */
export default function Hero() {
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

      // --- Phase 1 : depth & light ---------------------------------------
      tl.to(q('.hero-portrait'), { scale: 1.08, yPercent: -3, ease: 'none' }, 0)
        .to(q('.hero-star'), { scale: 1.15, ease: 'none' }, 0)
        .to(q('.hero-scrollhint'), { opacity: 0, ease: 'none' }, 0.12);

      // --- Phase 2 : title + portrait recede QUICKLY (fully gone by ~0.5) -
      tl.to(q('.hero-title'), { scale: 1.06, opacity: 0, y: -30, ease: 'none', duration: 0.18 }, 0.3)
        .to(q('.hero-portrait'), { opacity: 0, scale: 1.12, ease: 'power2.in', duration: 0.16 }, 0.34);

      // --- Phase 3 : dive through the star (only AFTER the face is gone) --
      tl.to(q('.hero-star'), { scale: 9, ease: 'power1.in' }, 0.54)
        .to(
          q('.hero-bg'),
          {
            background:
              'radial-gradient(ellipse at center, #DA251D 0%, #8F1713 55%, #080808 100%)',
            ease: 'none',
          },
          0.58
        )
        .to(q('.hero-redwash'), { opacity: 1, ease: 'power2.in' }, 0.82);
    },
    { scope: root }
  );

  return (
    <section id="hero" ref={root} className="relative h-[360vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* background layer */}
        <div
          className="hero-bg will-transform absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, #1a0b09 0%, #0d0605 55%, #080808 100%)',
          }}
        />

        {/* faint original starfield */}
        <TextureBg src="/images/stars-lite.webp" className="opacity-50" />

        {/* symbolic gold star, behind the portrait */}
        <div className="hero-star will-transform pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 opacity-40">
          <GoldStar breathe className="h-[40vh] w-[40vh]" />
        </div>

        {/* portrait — historical photograph, sits in the upper stage */}
        <div className="hero-portrait will-transform absolute left-1/2 top-[7vh] z-10 -translate-x-1/2">
          <Portrait heightClass="h-[62vh]" />
        </div>

        {/* bottom scrim so the title always stays legible over the portrait */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[52vh] bg-gradient-to-t from-vn-black via-vn-black/85 to-transparent" />

        {/* title block, anchored at the bottom (never crosses the face) */}
        <div className="hero-title will-transform pointer-events-none absolute inset-x-0 bottom-[15vh] z-30 flex flex-col items-center text-center">
          <h1 className="headline-mega select-none leading-none text-vn-ivory text-glow-gold">
            HỒ CHÍ MINH
          </h1>
          <p className="mt-4 font-serif-hist text-lg tracking-[0.4em] text-vn-gold md:text-2xl">
            1890&nbsp;—&nbsp;1969
          </p>
          <p className="mt-3 max-w-xl px-6 font-body text-[12px] font-light uppercase leading-relaxed tracking-[0.24em] text-vn-ivory/65 md:text-sm">
            Hành trình của một con người gắn với hành trình của dân tộc
          </p>
        </div>

        {/* scroll hint — thin animated line only (no text, avoids overlap) */}
        <div className="hero-scrollhint pointer-events-none absolute bottom-5 left-1/2 z-40 -translate-x-1/2">
          <span className="scroll-hint-line" />
        </div>

        {/* final red wash that seals the transition into 1890 */}
        <div className="hero-redwash pointer-events-none absolute inset-0 z-50 bg-vn-red opacity-0" />
      </div>
    </section>
  );
}
