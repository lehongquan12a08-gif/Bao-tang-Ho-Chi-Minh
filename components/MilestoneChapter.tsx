'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import type { Milestone, MilestoneSymbol } from '@/data/milestones';
import TextureBg from '@/components/TextureBg';
import GoldStar from '@/components/objects/GoldStar';

function Symbol({ kind }: { kind: MilestoneSymbol }) {
  const cls = 'h-[34vh] w-auto opacity-[0.16]';
  if (kind === 'star') return <GoldStar className={cls} />;
  if (kind === 'letter')
    return (
      <svg viewBox="0 0 200 200" className={cls} aria-hidden="true">
        <rect x="40" y="55" width="120" height="90" rx="3" fill="none" stroke="#D4A72C" strokeWidth="2.5" />
        <path d="M40 60 L100 105 L160 60" fill="none" stroke="#D4A72C" strokeWidth="2.5" />
        <line x1="55" y1="120" x2="145" y2="120" stroke="#D4A72C" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="55" y1="132" x2="120" y2="132" stroke="#D4A72C" strokeWidth="1.5" strokeOpacity="0.5" />
      </svg>
    );
  if (kind === 'sickle')
    return (
      <svg viewBox="0 0 200 200" className={cls} aria-hidden="true">
        {/* sickle */}
        <path d="M60 150 C 40 110 70 70 120 62 C 96 78 92 104 118 108 C 96 118 74 132 60 150 Z" fill="none" stroke="#FFCD00" strokeWidth="3" />
        {/* hammer */}
        <rect x="86" y="70" width="8" height="80" rx="3" transform="rotate(-38 90 110)" fill="#FFCD00" />
        <rect x="70" y="60" width="46" height="16" rx="4" transform="rotate(-38 93 68)" fill="#FFCD00" />
      </svg>
    );
  // flag
  return (
    <svg viewBox="0 0 200 140" className={cls} aria-hidden="true">
      <path d="M40 20 Q 90 6 140 20 T 170 24 L 170 96 Q 120 82 70 96 T 40 92 Z" fill="#DA251D" opacity="0.9" />
      <polygon points="100,38 106,56 125,56 110,68 116,86 100,75 84,86 90,68 75,56 94,56" fill="#FFCD00" />
      <line x1="40" y1="14" x2="40" y2="130" stroke="#D4A72C" strokeWidth="3" />
    </svg>
  );
}

export default function MilestoneChapter({ milestone: m }: { milestone: Milestone }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
      tl.to(q('.m-bgphoto'), { scale: 1.1, ease: 'none' }, 0)
        .to(q('.m-symbol'), { yPercent: -8, rotate: 4, ease: 'none' }, 0)
        .fromTo(q('.m-year'), { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, 0.08)
        .fromTo(q('.m-head'), { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.28)
        .fromTo(q('.m-key'), { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1 }, 0.44)
        .fromTo(q('.m-cap'), { opacity: 0 }, { opacity: 1 }, 0.6);
    },
    { scope: root }
  );

  return (
    <section id={m.id} ref={root} className="relative h-[240vh]" style={{ background: m.background }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        {/* symbolic layer (fallback / atmosphere) */}
        <TextureBg src="/images/stars.webp" className="opacity-30" />
        <div className="m-symbol will-transform pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
          <Symbol kind={m.symbol} />
        </div>

        {/* real archival photo (optional slot) — hidden if the file is absent */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={m.image}
          alt=""
          className="m-bgphoto will-transform pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover opacity-45"
          style={{ filter: 'grayscale(0.2) contrast(1.05) brightness(0.7)' }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />

        {/* scrim */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(8,8,8,0.35) 0%, rgba(8,8,8,0.55) 55%, rgba(8,8,8,0.92) 100%)' }}
        />

        {/* text */}
        <div className="relative z-20 flex flex-col items-center text-center">
          <p className="eyebrow mb-5 text-vn-gold-antique">{m.eyebrow}</p>
          <h2 className="m-year will-transform headline-year text-vn-ivory text-glow-gold">{m.year}</h2>
          <h3 className="m-head will-transform mt-4 max-w-3xl font-display text-2xl font-semibold uppercase tracking-[0.14em] text-vn-ivory md:text-4xl">
            {m.heading}
          </h3>
          <p className="m-key will-transform mt-8 font-serif-hist text-3xl font-black uppercase tracking-[0.2em] text-vn-gold md:text-5xl">
            {m.keyText}
          </p>
          <p className="m-cap will-transform mx-auto mt-8 max-w-xl font-serif-hist text-base italic leading-relaxed text-vn-ivory/75 md:text-lg">
            {m.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
