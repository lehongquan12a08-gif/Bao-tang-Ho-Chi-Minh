import { forwardRef } from 'react';

interface GoldStarProps {
  className?: string;
  /** Adds the ambient breathing glow animation. */
  breathe?: boolean;
}

/**
 * Symbolic 3D-feel five-pointed star (ngôi sao vàng).
 * Built from layered SVG facets + radial light so it reads as a sculpted
 * object under raking light rather than a flat icon.
 */
const GoldStar = forwardRef<SVGSVGElement, GoldStarProps>(function GoldStar(
  { className = '', breathe = false },
  ref
) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      className={className}
      style={breathe ? { animation: 'star-breathe 5s ease-in-out infinite' } : undefined}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="starHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFCD00" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#DA251D" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#DA251D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="starFaceA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE47A" />
          <stop offset="55%" stopColor="#FFCD00" />
          <stop offset="100%" stopColor="#D4A72C" />
        </linearGradient>
        <linearGradient id="starFaceB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4A72C" />
          <stop offset="100%" stopColor="#8a6a12" />
        </linearGradient>
      </defs>

      {/* ambient halo */}
      <circle cx="100" cy="100" r="100" fill="url(#starHalo)" />

      {/* Left facets (shadow side) */}
      <g>
        <polygon points="100,18 118,74 100,100" fill="url(#starFaceB)" />
        <polygon points="182,74 124,80 100,100" fill="url(#starFaceA)" />
        <polygon points="150,168 112,120 100,100" fill="url(#starFaceB)" />
        <polygon points="50,168 88,120 100,100" fill="url(#starFaceA)" />
        <polygon points="18,74 76,80 100,100" fill="url(#starFaceB)" />
        {/* symmetrical bright facets */}
        <polygon points="100,18 82,74 100,100" fill="url(#starFaceA)" />
        <polygon points="182,74 124,80 124,80" fill="url(#starFaceA)" />
      </g>

      {/* crisp outline star for definition */}
      <polygon
        points="100,14 117.6,68.2 174.9,68.2 128.6,101.8 146.3,156 100,122.4 53.7,156 71.4,101.8 25.1,68.2 82.4,68.2"
        fill="none"
        stroke="#FFE47A"
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
    </svg>
  );
});

export default GoldStar;
