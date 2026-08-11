import { forwardRef } from 'react';

/**
 * Hoa sen (lotus) — symbol of Làng Sen / Kim Liên, where the journey begins.
 * Layered petals with an antique-gold gradient over ivory.
 */
const LotusFlower = forwardRef<SVGSVGElement, { className?: string }>(
  function LotusFlower({ className = '' }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 300 260"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="petalOuter" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#8F1713" />
            <stop offset="60%" stopColor="#DA251D" />
            <stop offset="100%" stopColor="#F4EBD8" />
          </linearGradient>
          <linearGradient id="petalInner" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#D4A72C" />
            <stop offset="100%" stopColor="#FFE47A" />
          </linearGradient>
          <radialGradient id="lotusGlow" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#FFCD00" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFCD00" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="150" cy="210" rx="150" ry="46" fill="url(#lotusGlow)" />

        {/* outer petals */}
        <g fill="url(#petalOuter)" stroke="#F4EBD8" strokeOpacity="0.25" strokeWidth="1">
          <path d="M150 210 C 70 170 40 100 60 120 C 90 150 130 190 150 210 Z" />
          <path d="M150 210 C 230 170 260 100 240 120 C 210 150 170 190 150 210 Z" />
          <path d="M150 210 C 90 150 70 70 95 95 C 120 130 140 185 150 210 Z" />
          <path d="M150 210 C 210 150 230 70 205 95 C 180 130 160 185 150 210 Z" />
        </g>

        {/* inner petals */}
        <g fill="url(#petalInner)" stroke="#8F1713" strokeOpacity="0.25" strokeWidth="1">
          <path d="M150 212 C 118 150 128 74 150 40 C 172 74 182 150 150 212 Z" />
          <path d="M150 212 C 120 160 118 96 138 78 C 148 130 150 190 150 212 Z" />
          <path d="M150 212 C 180 160 182 96 162 78 C 152 130 150 190 150 212 Z" />
        </g>
      </svg>
    );
  }
);

export default LotusFlower;
