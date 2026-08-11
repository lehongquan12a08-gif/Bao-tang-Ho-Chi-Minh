import { forwardRef } from 'react';

/**
 * Con tàu (steamship) — the Amiral Latouche-Tréville era vessel motif for
 * 1911, "Ra đi tìm đường cứu nước". A stylised silhouette, not a specific
 * documented ship rendering.
 */
const Ship = forwardRef<SVGSVGElement, { className?: string }>(function Ship(
  { className = '' },
  ref
) {
  return (
    <svg ref={ref} viewBox="0 0 420 176" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2a1c" />
          <stop offset="100%" stopColor="#11100E" />
        </linearGradient>
        <linearGradient id="smoke" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#6A4932" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6A4932" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* smoke plumes */}
      <path d="M150 60 C 140 30 175 25 165 5 C 200 15 185 45 205 55 Z" fill="url(#smoke)" opacity="0.5" />
      <path d="M205 55 C 195 25 230 22 220 4 C 255 14 240 42 260 52 Z" fill="url(#smoke)" opacity="0.4" />

      {/* hull */}
      <path
        d="M40 130 L 380 130 L 350 175 L 78 175 Z"
        fill="url(#hull)"
        stroke="#D4A72C"
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />
      {/* deck house */}
      <rect x="120" y="96" width="180" height="34" fill="#2a2018" stroke="#D4A72C" strokeOpacity="0.3" />
      {/* funnels */}
      <rect x="150" y="60" width="26" height="40" fill="#8F1713" />
      <rect x="205" y="60" width="26" height="40" fill="#8F1713" />
      {/* masts */}
      <line x1="90" y1="40" x2="90" y2="130" stroke="#D4A72C" strokeWidth="2" strokeOpacity="0.6" />
      <line x1="330" y1="40" x2="330" y2="130" stroke="#D4A72C" strokeWidth="2" strokeOpacity="0.6" />
      {/* portholes */}
      <g fill="#FFCD00" opacity="0.8">
        <circle cx="150" cy="150" r="4" />
        <circle cx="185" cy="150" r="4" />
        <circle cx="220" cy="150" r="4" />
        <circle cx="255" cy="150" r="4" />
        <circle cx="290" cy="150" r="4" />
      </g>

    </svg>
  );
});

export default Ship;
