'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { playChime } from '@/lib/uiSound';

interface WordCascadeProps {
  words: string[];
  /** Background gradient / color for the section. */
  background?: string;
  /** Highlight color applied to words listed in `accent`. */
  accentWords?: string[];
  id?: string;
  /** Small time/label shown at the top of the section (e.g. "1911 — 1941"). */
  eyebrow?: string;
  /** vh height per word — controls dwell time. */
  perWordVh?: number;
  className?: string;
}

/**
 * A pinned black-screen typographic interlude. Each word fades/scales in and
 * out in sequence as the user scrolls — the connective tissue between chapters
 * (e.g. TUỔI TRẺ → HỌC HỎI → TÌM KIẾM → MỘT CON ĐƯỜNG).
 */
export default function WordCascade({
  words,
  background = '#080808',
  accentWords = [],
  id,
  eyebrow,
  perWordVh = 90,
  className = '',
}: WordCascadeProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const items = q('.cascade-word');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      items.forEach((el, i) => {
        const at = i * 1;
        // a soft chime as each word materialises (only when sound is on)
        tl.call(playChime, [i], at + 0.08);
        tl.fromTo(
          el,
          { opacity: 0, scale: 0.82, filter: 'blur(6px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 0.6 },
          at
        );
        // fade the previous word out (except the last, which lingers)
        if (i < items.length) {
          tl.to(
            el,
            { opacity: 0, scale: 1.35, filter: 'blur(4px)', ease: 'power2.in', duration: 0.5 },
            at + 0.55
          );
        }
      });
    },
    { scope: root }
  );

  return (
    <section
      id={id}
      ref={root}
      className={`relative ${className}`}
      style={{ height: `${words.length * perWordVh + 40}vh`, background }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        {eyebrow && (
          <p className="eyebrow absolute left-1/2 top-[12%] -translate-x-1/2 whitespace-nowrap text-vn-gold-antique">
            {eyebrow}
          </p>
        )}
        {words.map((w, i) => {
          const accent = accentWords.includes(w);
          return (
            <h2
              key={`${w}-${i}`}
              className={[
                'cascade-word will-transform headline-mega absolute select-none text-center',
                accent ? 'text-vn-red' : 'text-vn-ivory',
              ].join(' ')}
            >
              {w}
            </h2>
          );
        })}
      </div>
    </section>
  );
}
