'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import GoldStar from '@/components/objects/GoldStar';
import TextureBg from '@/components/TextureBg';

/**
 * 1945 — three cleanly separated acts (no overlapping text):
 *   A. the date assembles (02 → 09 → 1945 → 02.09.1945)
 *   B. the Ba Đình / Tuyên ngôn Độc lập photograph, held on screen
 *   C. deep red → ĐỘC LẬP → TỰ DO, under the upright gold star
 * Each element is only ever visible during its own act.
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

      // ---- Act A : the date assembles -----------------------------------
      const frag = (sel: Element[], at: number) =>
        tl.fromTo(sel, { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.05 }, at)
          .to(sel, { opacity: 0, scale: 0.75, duration: 0.04 }, at + 0.07);
      frag(q('.d-02'), 0.02);
      frag(q('.d-09'), 0.14);
      frag(q('.d-1945'), 0.26);
      tl.fromTo(q('.d-full'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.05 }, 0.38)
        .to(q('.d-full'), { opacity: 0, y: -24, duration: 0.05 }, 0.46);

      // ---- Act B : the photograph (held) --------------------------------
      tl.fromTo(q('.scene'), { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.52)
        .fromTo(q('.s-decl'), { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.06 }, 0.53)
        .fromTo(q('.badinh-label'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.04 }, 0.55)
        // HOLD 0.59 → 0.68
        .to(q('.scene'), { opacity: 0, duration: 0.05 }, 0.68);

      // ---- Act C : red → ĐỘC LẬP → TỰ DO --------------------------------
      tl.to(q('.bg-1945'), { backgroundColor: '#8F1713', duration: 0.06, ease: 'none' }, 0.66)
        .to(q('.silk-45'), { opacity: 0.7, duration: 0.06, ease: 'none' }, 0.66)
        .fromTo(q('.star-45'), { opacity: 0, scale: 0.7 }, { opacity: 0.5, scale: 1, duration: 0.06 }, 0.7)
        .fromTo(q('.w-doclap'), { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 1, duration: 0.05 }, 0.74)
        .to(q('.w-doclap'), { opacity: 0, y: -50, duration: 0.05 }, 0.85)
        .fromTo(q('.w-tudo'), { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 1, duration: 0.05 }, 0.89);
    },
    { scope: root }
  );

  return (
    <section id="chapter-1945" ref={root} className="relative h-[620vh]">
      <div className="bg-1945 sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-vn-black">
        {/* red-silk atmosphere for the finale */}
        <TextureBg src="/images/silk.webp" className="silk-45 z-0 opacity-0" />

        {/* upright gold star behind the finale words */}
        <div className="star-45 pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 opacity-0">
          <GoldStar className="h-[64vh] w-[64vh]" />
        </div>

        {/* Act A — date fragments */}
        <span className="d-02 will-transform absolute z-[5] headline-year text-vn-ivory opacity-0">02</span>
        <span className="d-09 will-transform absolute z-[5] headline-year text-vn-ivory opacity-0">09</span>
        <span className="d-1945 will-transform absolute z-[5] headline-year text-vn-ivory opacity-0">1945</span>
        <span className="d-full will-transform absolute z-[5] headline-mega text-vn-gold text-glow-gold opacity-0">
          02.09.1945
        </span>

        {/* Act B — the photograph */}
        <div className="scene pointer-events-none absolute inset-0 z-[3] opacity-0">
          {/* faint Ba Đình atmosphere */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/photos/badinh.webp"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.18]"
          />
          <div className="absolute inset-0 bg-vn-black/55" />

          <p className="badinh-label will-transform absolute left-1/2 top-[9%] -translate-x-1/2 whitespace-nowrap font-display text-2xl uppercase tracking-[0.3em] text-vn-ivory md:text-4xl">
            Quảng trường Ba Đình
          </p>

          {/* centrepiece: Tuyên ngôn Độc lập — outer div centres (untouched by
              GSAP), inner .s-decl is animated so centring never gets overridden */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="s-decl will-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/photos/declaration-1945.webp"
                alt="Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa"
                className="h-auto max-h-[62vh] w-auto max-w-[52vw] object-contain"
                style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.75)' }}
              />
            </div>
          </div>
        </div>

        {/* Act C — finale words */}
        <h2 className="w-doclap will-transform absolute z-[6] headline-mega font-serif-hist font-black text-vn-ivory opacity-0">
          ĐỘC LẬP
        </h2>
        <h2 className="w-tudo will-transform absolute z-[6] headline-mega font-serif-hist font-black text-vn-ivory opacity-0">
          TỰ DO
        </h2>
      </div>
    </section>
  );
}
