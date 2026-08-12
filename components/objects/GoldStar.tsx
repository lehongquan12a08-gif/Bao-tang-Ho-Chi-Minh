import { forwardRef } from 'react';

interface GoldStarProps {
  className?: string;
  /** Adds the ambient breathing glow animation. */
  breathe?: boolean;
}

/**
 * The gold five-pointed star of the Vietnamese flag — UPRIGHT (one point up),
 * perfectly symmetric, with a subtle "folded" facet (light/dark halves per arm)
 * for a touch of dimension. Never rotate this in animation; it should always
 * read as the flag star.
 *
 * Geometry: outer points at angles -90°,-18°,54°,126°,198°; inner points offset
 * by 36°; centre at (100,100).
 */
const GoldStar = forwardRef<SVGSVGElement, GoldStarProps>(function GoldStar(
  { className = '', breathe = false },
  ref
) {
  // Right (lighter) facets: C, O_i, j_i.  Left (darker) facets: C, j_{i-1}, O_i.
  const right = [
    '100,100 100,22 117.6,75.7',
    '100,100 174.2,75.9 128.5,109.3',
    '100,100 145.8,163.1 100,130',
    '100,100 54.2,163.1 71.5,109.3',
    '100,100 25.8,75.9 82.4,75.7',
  ];
  const left = [
    '100,100 82.4,75.7 100,22',
    '100,100 117.6,75.7 174.2,75.9',
    '100,100 128.5,109.3 145.8,163.1',
    '100,100 100,130 54.2,163.1',
    '100,100 71.5,109.3 25.8,75.9',
  ];

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
          <stop offset="0%" stopColor="#FFCD00" stopOpacity="0.5" />
          <stop offset="42%" stopColor="#DA251D" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#DA251D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="starLight" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#FFE889" />
          <stop offset="100%" stopColor="#FFCD00" />
        </linearGradient>
        <linearGradient id="starDark" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#E8B92A" />
          <stop offset="100%" stopColor="#C79412" />
        </linearGradient>
      </defs>

      {/* ambient halo */}
      <circle cx="100" cy="100" r="100" fill="url(#starHalo)" />

      {/* folded facets — symmetric */}
      <g>
        {left.map((pts, i) => (
          <polygon key={`l${i}`} points={pts} fill="url(#starDark)" />
        ))}
        {right.map((pts, i) => (
          <polygon key={`r${i}`} points={pts} fill="url(#starLight)" />
        ))}
      </g>

      {/* crisp outline */}
      <polygon
        points="100,22 117.6,75.7 174.2,75.9 128.5,109.3 145.8,163.1 100,130 54.2,163.1 71.5,109.3 25.8,75.9 82.4,75.7"
        fill="none"
        stroke="#FFE889"
        strokeWidth="0.8"
        strokeOpacity="0.45"
      />
    </svg>
  );
});

export default GoldStar;
