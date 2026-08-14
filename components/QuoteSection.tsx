'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { verifiedQuote } from '@/data/timeline';

// Verified quote, split into cadence groups. "ĐỘC LẬP" / "TỰ DO" get red accent.
const GROUPS: { text: string; accent?: boolean }[] = [
  { text: 'KHÔNG CÓ GÌ' },
  { text: 'QUÝ HƠN' },
  { text: 'ĐỘC LẬP', accent: true },
  { text: 'TỰ DO', accent: true },
];

export default function QuoteSection() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q('.qline'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.35,
          scrollTrigger: { trigger: root.current, start: 'top 60%' },
        }
      );
      gsap.fromTo(
        q('.qattr'),
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          delay: 1.4,
          scrollTrigger: { trigger: root.current, start: 'top 60%' },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="quote"
      className="relative h-[220vh]"
      style={{ backgroundColor: '#F4EBD8' }}
    >
      {/* pinned so the quote is held on screen while the auto-scroll lingers */}
      <div className="sticky top-0 flex h-screen items-center justify-center px-6 py-[10vh]">
      <div className="mx-auto max-w-5xl text-center">
        <blockquote className="font-serif-hist font-black leading-[1.05] text-vn-charcoal">
          <span className="mb-6 block text-3xl text-vn-red/60">“</span>
          {GROUPS.map((g) => (
            <span
              key={g.text}
              className={[
                'qline block',
                g.accent ? 'text-vn-red' : 'text-vn-charcoal',
              ].join(' ')}
              style={{ fontSize: 'clamp(40px, 7vw, 110px)' }}
            >
              {g.text}
            </span>
          ))}
        </blockquote>

        <p className="qattr mt-14 font-body text-sm uppercase tracking-[0.28em] text-vn-brown">
          — {verifiedQuote.attribution}
        </p>
        <p className="qattr mt-2 font-body text-[11px] uppercase tracking-[0.2em] text-vn-brown/60">
          {verifiedQuote.context}
        </p>
      </div>
      </div>
    </section>
  );
}
