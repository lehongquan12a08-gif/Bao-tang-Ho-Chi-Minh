import type { CSSProperties } from 'react';

interface TextureBgProps {
  src: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Full-bleed decorative texture layer (aged paper, red silk, mist, stars…).
 * All assets are ORIGINAL, generated procedurally in `scripts/generate-assets.mjs`
 * — no third-party or copyrighted imagery.
 */
export default function TextureBg({ src, className = '', style }: TextureBgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className={`texture-bg pointer-events-none absolute inset-0 h-full w-full object-cover ${className}`}
      style={style}
    />
  );
}
