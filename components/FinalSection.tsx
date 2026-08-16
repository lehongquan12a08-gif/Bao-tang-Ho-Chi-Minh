'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import GoldStar from '@/components/objects/GoldStar';
import TextureBg from '@/components/TextureBg';
import Portrait from '@/components/Portrait';

export default function FinalSection() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 70%',
          end: 'center center',
          scrub: 1,
        },
      });

      tl.fromTo(q('.final-star'), { opacity: 0, scale: 0.5 }, { opacity: 0.65, scale: 1 }, 0)
        .fromTo(q('.final-portrait'), { opacity: 0, scale: 1.1, y: 40 }, { opacity: 1, scale: 1, y: 0 }, 0.1)
        .fromTo(q('.final-name'), { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.4)
        .fromTo(q('.final-dates'), { opacity: 0 }, { opacity: 1 }, 0.6);
    },
    { scope: root }
  );

  return (
    <section
      id="final"
      ref={root}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-vn-black py-[16vh]"
    >
      <TextureBg src="/images/stars-lite.webp" className="opacity-45" />

      <div className="final-star will-transform pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[56%] opacity-0">
        <GoldStar breathe className="h-[46vh] w-[46vh]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="final-portrait will-transform flex flex-col items-center">
          <Portrait src="/images/photos/portrait-final.webp" heightClass="h-[62vh]" />
        </div>
        <h2 className="final-name will-transform headline-mega mt-2 text-vn-ivory text-glow-gold">
          HỒ CHÍ MINH
        </h2>
        <p className="final-dates will-transform mt-2 font-serif-hist text-xl tracking-[0.4em] text-vn-gold md:text-2xl">
          1890 — 1969
        </p>
      </div>
    </section>
  );
}
