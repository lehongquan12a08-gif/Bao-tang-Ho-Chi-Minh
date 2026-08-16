'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import type { Milestone, MilestoneSymbol } from '@/data/milestones';
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
      // gentle Ken Burns only on full-bleed photos (contained images stay still)
      if (!m.contain) tl.fromTo(q('.m-bgphoto'), { scale: 1.08 }, { scale: 1, ease: 'none' }, 0);
      else tl.fromTo(q('.m-frame'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.05 }, 0.02);
      // reveal earlier/tighter so the text keeps up with the voiceover
      tl.fromTo(q('.m-year'), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.05 }, 0.03)
        .fromTo(q('.m-head'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.05 }, 0.1)
        .fromTo(q('.m-key'), { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 0.05 }, 0.18)
        .fromTo(q('.m-cap'), { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.26);
    },
    { scope: root }
  );

  // documents / paintings: a small, whole image beside the text (no zoom/crop)
  if (m.contain) {
    return (
      <section id={m.id} ref={root} className="relative h-[240vh]" style={{ background: m.background }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 md:flex-row md:gap-16 md:px-10">
            {/* text */}
            <div className="order-2 flex-1 text-center md:order-1 md:text-left">
              <p className="eyebrow mb-5 text-vn-gold-antique">{m.eyebrow}</p>
              <h2 className="m-year will-transform font-serif-hist text-7xl font-black leading-none text-vn-ivory text-glow-gold md:text-8xl">
                {m.year}
              </h2>
              <h3 className="m-head will-transform mt-4 font-display text-xl font-semibold uppercase tracking-[0.14em] text-vn-ivory md:text-3xl">
                {m.heading}
              </h3>
              <p className="m-key will-transform mt-6 font-serif-hist text-2xl font-black uppercase tracking-[0.2em] text-vn-gold md:text-4xl">
                {m.keyText}
              </p>
              <p className="m-cap will-transform mx-auto mt-7 max-w-xl font-serif-hist text-base italic leading-relaxed text-vn-ivory/75 md:mx-0 md:text-lg">
                {m.caption}
              </p>
            </div>

            {/* small, whole image */}
            <div className="m-frame will-transform relative order-1 w-full max-w-sm md:order-2 md:w-[42%] md:max-w-md">
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[3px] border border-vn-gold-antique/25 bg-vn-black/70 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <Symbol kind={m.symbol} />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.image}
                  alt={m.heading}
                  className="relative h-full w-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <p className="mt-3 text-center font-body text-[10px] uppercase tracking-[0.22em] text-vn-ivory/35">
                Tư liệu · {m.year}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={m.id} ref={root} className="relative h-[240vh]" style={{ background: m.background }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* symbolic fallback (shows only if the photo is missing) */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <Symbol kind={m.symbol} />
        </div>

        {/* full-bleed archival photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={m.image}
          alt={m.heading}
          className="m-bgphoto will-transform pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover"
          style={{ objectPosition: 'center', filter: 'contrast(1.04) brightness(0.9)' }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />

        {/* scrims — dark on the left (behind the text) fading right so the subject
            stays lit, plus a soft bottom gradient for mobile legibility */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              'linear-gradient(90deg, rgba(8,8,8,0.94) 0%, rgba(8,8,8,0.78) 30%, rgba(8,8,8,0.35) 58%, rgba(8,8,8,0.05) 82%, rgba(8,8,8,0) 100%)',
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[38vh] bg-gradient-to-t from-vn-black/85 to-transparent" />

        {/* text — left-weighted, vertically centred */}
        <div className="relative z-20 flex h-full items-center">
          <div className="max-w-2xl px-6 sm:px-10 md:px-16">
            <p className="eyebrow mb-5 text-vn-gold-antique">{m.eyebrow}</p>
            <h2 className="m-year will-transform font-serif-hist text-7xl font-black leading-none text-vn-ivory text-glow-gold md:text-8xl">
              {m.year}
            </h2>
            <h3 className="m-head will-transform mt-4 font-display text-xl font-semibold uppercase tracking-[0.14em] text-vn-ivory md:text-3xl">
              {m.heading}
            </h3>
            <p className="m-key will-transform mt-6 font-serif-hist text-2xl font-black uppercase tracking-[0.2em] text-vn-gold md:text-4xl">
              {m.keyText}
            </p>
            <p className="m-cap will-transform mt-7 max-w-xl font-serif-hist text-base italic leading-relaxed text-vn-ivory/75 md:text-lg">
              {m.caption}
            </p>
          </div>
        </div>

        {/* small archival caption, bottom-right */}
        <p className="absolute bottom-6 right-8 z-20 font-body text-[10px] uppercase tracking-[0.22em] text-vn-ivory/35">
          Tư liệu · {m.year}
        </p>
      </div>
    </section>
  );
}
