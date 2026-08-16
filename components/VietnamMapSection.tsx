'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import GoldStar from '@/components/objects/GoldStar';
import TextureBg from '@/components/TextureBg';

/**
 * VIỆT NAM — a flag-inspired finale panel: the gold star of the national flag
 * over a deep-red silk field, framed by darkness. Replaces the earlier stylised
 * map, which read poorly. Clean, unmistakably Vietnamese, no inaccurate outline.
 */
export default function VietnamMapSection() {
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

      // red silk field expands into view; star settles; wordmark rises
      tl.fromTo(q('.vn-field'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0)
        .fromTo(q('.vn-star'), { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none' }, 0.05)
        .fromTo(q('.vn-title'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.3)
        .fromTo(q('.vn-motto'), { opacity: 0 }, { opacity: 1 }, 0.45);
    },
    { scope: root }
  );

  return (
    <section
      id="map"
      ref={root}
      className="relative h-[220vh]"
      style={{
        background:
          'radial-gradient(ellipse at center, #12100e 0%, #080808 70%)',
      }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <TextureBg src="/images/stars-lite.webp" className="opacity-40" />

        {/* red silk field of the flag */}
        <div className="vn-field will-transform relative flex h-[62vh] w-[62vh] items-center justify-center overflow-hidden rounded-[2px]">
          <TextureBg src="/images/silk-lite.webp" className="scale-110" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 40%, rgba(58,13,11,0.7) 100%)',
            }}
          />
          {/* gold star of the national flag */}
          <GoldStar breathe className="vn-star will-transform relative z-10 h-[34vh] w-[34vh]" />
        </div>

        {/* red ambient glow bleeding into the dark */}
        <div
          className="pointer-events-none absolute h-[80vh] w-[80vh] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(218,37,29,0.22) 0%, transparent 62%)',
          }}
        />

        <div className="vn-title will-transform absolute bottom-[12vh] z-20 flex flex-col items-center text-center">
          <h2 className="headline-mega text-vn-ivory text-glow-gold">VIỆT NAM</h2>
          <p className="vn-motto mt-3 font-body text-sm uppercase tracking-[0.3em] text-vn-gold-antique md:text-base">
            Độc lập · Tự do · Hạnh phúc
          </p>
        </div>
      </div>
    </section>
  );
}
