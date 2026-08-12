'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

interface Doc {
  label: string;
  sub: string;
  photo: string;
  x: string;
  y: string;
  rot: number;
  depth: number; // parallax factor
  w: string;
}

// A scattered archive: photographs of a life spent writing and seeking a path.
// Neutral labels — no fabricated dates — to avoid mis-attributing years.
const DOCS: Doc[] = [
  { label: 'Bên máy đánh chữ', sub: 'Người viết', photo: '/images/photos/doc-1.webp', x: '7%', y: '16%', rot: -6, depth: 0.16, w: '230px' },
  { label: 'Những trang viết', sub: 'Bản thảo', photo: '/images/photos/doc-2.webp', x: '65%', y: '11%', rot: 5, depth: 0.28, w: '210px' },
  { label: 'Bàn làm việc', sub: 'Miệt mài', photo: '/images/photos/doc-3.webp', x: '19%', y: '57%', rot: -3, depth: 0.22, w: '205px' },
  { label: 'Nghiên cứu', sub: 'Tài liệu', photo: '/images/photos/doc-4.webp', x: '60%', y: '60%', rot: 7, depth: 0.34, w: '230px' },
  { label: 'Trang bản thảo', sub: 'Từng con chữ', photo: '/images/photos/doc-5.webp', x: '77%', y: '50%', rot: 4, depth: 0.14, w: '200px' },
];

export default function NguyenAiQuoc() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      q('.doc').forEach((el) => {
        const depth = Number((el as HTMLElement).dataset.depth ?? 0.2);
        gsap.fromTo(
          el,
          { yPercent: 40 * (1 + depth), opacity: 0 },
          {
            yPercent: -60 * depth,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section
      id="chapter-nguyen-ai-quoc"
      ref={root}
      className="relative overflow-hidden py-[24vh]"
      style={{
        background:
          'linear-gradient(180deg, #080808 0%, #17110c 50%, #080808 100%)',
      }}
    >
      {/* scattered archival photographs */}
      <div className="pointer-events-none absolute inset-0">
        {DOCS.map((d) => (
          <div
            key={d.label}
            className="doc will-transform absolute"
            data-depth={d.depth}
            style={{
              left: d.x,
              top: d.y,
              width: d.w,
              transform: `rotate(${d.rot}deg)`,
            }}
          >
            <div
              className="relative aspect-[3/4] w-full overflow-hidden"
              style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.photo}
                alt=""
                className="photo-cine absolute inset-0 h-full w-full object-cover"
              />
              {/* ivory border to feel like a print */}
              <div className="absolute inset-0 border-[6px] border-vn-ivory/85" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="font-serif-hist text-lg leading-tight text-vn-ivory">
                  {d.label}
                </p>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-vn-gold-antique">
                  {d.sub}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* featured young portrait + headline + note */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <div className="mx-auto mb-8 w-[210px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/photos/young.webp"
            alt="Chân dung Nguyễn Ái Quốc thời trẻ"
            className="photo-cine mx-auto w-full object-contain"
            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
          />
        </div>
        <p className="eyebrow mb-6 text-vn-gold-antique">Người đi tìm đường</p>
        <h2 className="headline-mega text-vn-ivory text-glow-gold">
          NGUYỄN ÁI QUỐC
        </h2>
        <p className="mx-auto mt-8 max-w-xl font-serif-hist text-lg italic leading-relaxed text-vn-ivory/75 md:text-xl">
          Từ những trang báo, những bản thảo và bao năm bôn ba, một con đường cho
          dân tộc dần được định hình.
        </p>
      </div>
    </section>
  );
}
