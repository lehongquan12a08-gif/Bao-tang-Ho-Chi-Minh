'use client';

import { useState } from 'react';
import { MEDIA, type MediaItem } from '@/data/media';

function MediaCard({ item }: { item: MediaItem }) {
  const [play, setPlay] = useState(false);
  return (
    <figure className="group relative overflow-hidden border border-white/10 bg-vn-black/40">
      <div className="relative aspect-video overflow-hidden">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlay(true)}
            aria-label={`Phát: ${item.title}`}
            className="absolute inset-0 h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`}
              alt=""
              className="h-full w-full object-cover opacity-70 transition duration-500 group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-vn-black/70 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-vn-gold/70 bg-vn-red/85 transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 text-vn-ivory" aria-hidden="true">
                  <polygon points="6,4 20,12 6,20" fill="currentColor" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="p-4">
        <span className="font-body text-[10px] uppercase tracking-[0.22em] text-vn-gold-antique">
          {item.kind}
        </span>
        <p className="mt-1 font-serif-hist text-lg leading-tight text-vn-ivory">{item.title}</p>
        {item.by && (
          <p className="mt-1 font-body text-[11px] text-vn-ivory/50">{item.by}</p>
        )}
      </figcaption>
    </figure>
  );
}

export default function MediaSection() {
  if (!MEDIA.length) return null;
  return (
    <section
      id="media"
      className="relative px-6 py-[16vh]"
      style={{ background: 'linear-gradient(180deg, #080808 0%, #12100e 50%, #080808 100%)' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="eyebrow mb-6 text-vn-gold-antique">Âm nhạc · Sân khấu · Tư liệu</p>
          <h2 className="headline-mega text-vn-ivory text-glow-gold">NGHE &amp; XEM</h2>
          <div className="gold-line mx-auto mt-8 w-40" />
          <p className="mx-auto mt-8 max-w-xl font-serif-hist text-lg italic leading-relaxed text-vn-ivory/70">
            Những bài ca, hoạt cảnh và thước phim về Người — bấm để mở.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {MEDIA.map((m) => (
            <MediaCard key={m.id} item={m} />
          ))}
        </div>

        <p className="mt-10 text-center font-body text-[11px] uppercase tracking-[0.2em] text-vn-ivory/30">
          Video nhúng từ nguồn công khai · vui lòng dùng bản chính thức, đúng bản quyền
        </p>
      </div>
    </section>
  );
}
