'use client';

import { useEffect, useRef, useState } from 'react';
import { timelineMarkers } from '@/data/timeline';

/**
 * Vertical timeline rail (desktop only). A gold progress line grows with page
 * scroll; the marker nearest the viewport centre is highlighted in gold.
 */
export default function TimelineIndicator() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>(timelineMarkers[0].id);
  const [railHover, setRailHover] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);

      // active section = the marker section closest to viewport centre
      const mid = window.innerHeight / 2;
      let best = timelineMarkers[0].id;
      let bestDist = Infinity;
      for (const m of timelineMarkers) {
        const el = document.getElementById(m.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = m.id;
        }
      }
      setActiveId(best);
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed right-8 top-1/2 z-[90] hidden -translate-y-1/2 lg:block">
      {/* pl-24 is a transparent hover pad so getting NEAR the rail reveals every
          year label at once, not just the marker directly under the cursor */}
      <div
        className="pointer-events-auto relative flex flex-col items-end gap-8 pl-24"
        onMouseEnter={() => setRailHover(true)}
        onMouseLeave={() => setRailHover(false)}
      >
        {/* base rail */}
        <div className="absolute right-[3px] top-2 h-[calc(100%-16px)] w-px bg-white/15" />
        {/* progress rail */}
        <div
          className="absolute right-[3px] top-2 w-px origin-top bg-vn-gold"
          style={{
            height: `calc((100% - 16px) * ${progress})`,
            boxShadow: '0 0 8px rgba(255,205,0,0.6)',
          }}
        />

        {timelineMarkers.map((m) => {
          const active = m.id === activeId;
          return (
            <a
              key={m.id}
              href={`#${m.id}`}
              className="pointer-events-auto group flex items-center gap-3"
            >
              <span
                className={[
                  'font-body text-[11px] uppercase tracking-[0.2em] transition-all duration-500',
                  active
                    ? 'text-vn-gold opacity-100'
                    : railHover
                      ? 'text-white/45 opacity-100'
                      : 'text-white/30 opacity-0 group-hover:opacity-100',
                ].join(' ')}
              >
                {m.year}
              </span>
              <span
                className={[
                  'h-[7px] w-[7px] rotate-45 border transition-all duration-500',
                  active
                    ? 'scale-125 border-vn-gold bg-vn-gold'
                    : 'border-white/40 bg-transparent',
                ].join(' ')}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
