'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { GALLERY } from '@/data/gallery';

/**
 * TƯ LIỆU — an editorial archive grid of historical photographs. Items reveal
 * in a soft stagger on scroll; a few span two rows for rhythm. No rounded
 * cards — sharp frames with a thin ivory hairline, caption on hover.
 */
export default function Gallery() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q('.gitem'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: { each: 0.06, from: 'start' },
          scrollTrigger: { trigger: q('.ggrid'), start: 'top 85%' },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      id="gallery"
      ref={root}
      className="relative bg-vn-black px-6 py-[16vh]"
      style={{
        background:
          'linear-gradient(180deg, #080808 0%, #12100e 50%, #080808 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="eyebrow mb-6 text-vn-gold-antique">Kho lưu trữ</p>
          <h2 className="headline-mega text-vn-ivory text-glow-gold">TƯ LIỆU</h2>
          <div className="gold-line mx-auto mt-8 w-40" />
          <p className="mx-auto mt-8 max-w-xl font-serif-hist text-lg italic leading-relaxed text-vn-ivory/70">
            Những khoảnh khắc bình dị mà thiêng liêng trong cuộc đời vì dân, vì nước.
          </p>
        </div>

        <div className="ggrid grid auto-rows-[220px] grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {GALLERY.map((g) => (
            <figure
              key={g.src}
              className={[
                'gitem will-transform group relative overflow-hidden',
                g.tall ? 'row-span-2' : '',
              ].join(' ')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                className="photo-cine h-full w-full object-cover grayscale-[0.15] transition-all duration-700 ease-cinematic group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="pointer-events-none absolute inset-0 border border-vn-ivory/10" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />
              <figcaption className="absolute bottom-0 left-0 translate-y-1 p-4 font-body text-[12px] uppercase tracking-[0.18em] text-vn-ivory/85 transition-transform duration-500 group-hover:translate-y-0">
                <span className="mr-2 text-vn-gold">—</span>
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-10 text-center font-body text-[11px] uppercase tracking-[0.2em] text-vn-ivory/30">
          Ảnh tư liệu lịch sử · vui lòng bảo đảm quyền sử dụng
        </p>
      </div>
    </section>
  );
}
