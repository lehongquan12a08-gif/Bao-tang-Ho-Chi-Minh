'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import GoldStar from '@/components/objects/GoldStar';
import TextureBg from '@/components/TextureBg';

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

      // -- Phase A : the date assembles (each fully clears before the next) --
      tl.fromTo(q('.d-02'), { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1 }, 0.02)
        .to(q('.d-02'), { opacity: 0, scale: 0.7 }, 0.09)
        .fromTo(q('.d-09'), { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1 }, 0.11)
        .to(q('.d-09'), { opacity: 0, scale: 0.7 }, 0.18)
        .fromTo(q('.d-1945'), { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1 }, 0.2)
        .to(q('.d-1945'), { opacity: 0, scale: 0.7 }, 0.28)
        .fromTo(q('.d-full'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.32)
        .to(q('.d-full'), { opacity: 0, y: -30 }, 0.42);

      // -- Phase B : Ba Đình scene (after the date is fully gone) -----------
      tl.fromTo(q('.scene'), { opacity: 0 }, { opacity: 1 }, 0.44)
        .fromTo(q('.s-build'), { scale: 1.1 }, { scale: 1, ease: 'none' }, 0.44)
        .fromTo(q('.s-decl'), { yPercent: 8, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, ease: 'none' }, 0.46)
        .fromTo(q('.badinh-label'), { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.48)
        .to(q('.scene'), { opacity: 0 }, 0.56);

      // -- Phase C : black → deep red → ĐỘC LẬP / TỰ DO --------------------
      tl.to(q('.bg-1945'), { backgroundColor: '#8F1713', ease: 'none' }, 0.56)
        .to(q('.silk-45'), { opacity: 0.7, ease: 'none' }, 0.56)
        .fromTo(q('.star-45'), { opacity: 0, scale: 0.6, rotate: -20 }, { opacity: 0.5, scale: 1, rotate: 0 }, 0.6)
        .fromTo(q('.w-doclap'), { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1 }, 0.64)
        .to(q('.w-doclap'), { opacity: 0, y: -60 }, 0.78)
        .fromTo(q('.w-tudo'), { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1 }, 0.82);
    },
    { scope: root }
  );

  return (
    <section id="chapter-1945" ref={root} className="relative h-[560vh]">
      <div className="bg-1945 sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-vn-black">
        {/* red-silk atmosphere, fades in with the finale */}
        <TextureBg src="/images/silk.webp" className="silk-45 z-0 opacity-0" />

        {/* gold star behind the finale words */}
        <div className="star-45 will-transform pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 opacity-0">
          <GoldStar className="h-[64vh] w-[64vh]" />
        </div>

        {/* date fragments */}
        <span className="d-02 will-transform absolute z-[5] headline-year text-vn-ivory">02</span>
        <span className="d-09 will-transform absolute z-[5] headline-year text-vn-ivory">09</span>
        <span className="d-1945 will-transform absolute z-[5] headline-year text-vn-ivory">1945</span>
        <span className="d-full will-transform absolute z-[5] headline-mega text-vn-gold text-glow-gold">
          02.09.1945
        </span>

        {/* Ba Đình 1945 — historical photographs */}
        <div className="scene pointer-events-none absolute inset-0 z-[3] opacity-0">
          {/* faint Ba Đình square atmosphere */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/photos/badinh.webp"
            alt=""
            className="s-build will-transform absolute inset-0 h-full w-full object-cover opacity-[0.22]"
          />
          {/* scrim so the label + centrepiece read cleanly */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 55%, rgba(8,8,8,0.35) 0%, rgba(8,8,8,0.55) 55%, rgba(8,8,8,0.92) 100%)',
            }}
          />

          <p className="badinh-label will-transform absolute left-1/2 top-[14%] -translate-x-1/2 whitespace-nowrap font-display text-2xl uppercase tracking-[0.3em] text-vn-ivory md:text-4xl">
            Quảng trường Ba Đình
          </p>

          {/* centrepiece: Tuyên ngôn Độc lập */}
          <div className="s-decl will-transform absolute left-1/2 top-[57%] w-[48vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/photos/declaration-1945.webp"
              alt="Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa"
              className="photo-cine w-full shadow-2xl"
              style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}
            />
          </div>
        </div>

        {/* finale words */}
        <h2 className="w-doclap will-transform absolute z-[6] headline-mega font-serif-hist font-black text-vn-ivory">
          ĐỘC LẬP
        </h2>
        <h2 className="w-tudo will-transform absolute z-[6] headline-mega font-serif-hist font-black text-vn-ivory opacity-0">
          TỰ DO
        </h2>
      </div>
    </section>
  );
}
