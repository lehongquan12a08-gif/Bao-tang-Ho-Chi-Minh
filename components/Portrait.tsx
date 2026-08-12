/**
 * Shared portrait treatment used by BOTH Hero and Final so they are identical.
 * Layers (back → front):
 *   1. dark radial backing — hides whatever sits behind (star / starfield) so
 *      nothing bleeds through the masked photo onto the face.
 *   2. the photograph, faded at the edges (portrait-mask) so it dissolves into
 *      darkness instead of showing a hard bright rectangle.
 *   3. a vignette that darkens the photo's own bright background at the edges.
 */
export default function Portrait({
  src = '/images/photos/portrait.webp',
  heightClass = 'h-[62vh]',
  className = '',
}: {
  src?: string;
  heightClass?: string;
  className?: string;
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* 1 · dark backing */}
      <div
        className="pointer-events-none absolute -inset-x-[6%] -inset-y-[4%]"
        style={{
          background:
            'radial-gradient(ellipse 60% 64% at 50% 42%, #080808 68%, rgba(8,8,8,0) 100%)',
        }}
      />
      {/* 2 · photograph */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Chân dung Chủ tịch Hồ Chí Minh"
        className={`relative block w-auto object-contain photo-cine portrait-mask ${heightClass}`}
      />
      {/* 3 · vignette to dissolve the bright background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 54% 60% at 50% 40%, transparent 46%, rgba(8,8,8,0.96) 100%)',
        }}
      />
    </div>
  );
}
