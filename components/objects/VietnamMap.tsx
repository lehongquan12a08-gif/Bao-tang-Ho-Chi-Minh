import { forwardRef } from 'react';

/**
 * Bản đồ Việt Nam — stylised S-curve silhouette rendered as a dark metallic
 * relief with a travelling gold light (North → South). Not a survey-accurate
 * map; a symbolic sculpture of the homeland.
 */
const VietnamMap = forwardRef<
  SVGSVGElement,
  { className?: string; lightRef?: React.Ref<SVGCircleElement> }
>(function VietnamMap({ className = '', lightRef }, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 300 520"
      className={className}
      aria-label="Bản đồ Việt Nam (hình tượng trưng)"
    >
      <defs>
        <linearGradient id="mapMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a1512" />
          <stop offset="50%" stopColor="#8F1713" />
          <stop offset="100%" stopColor="#2a0f0d" />
        </linearGradient>
        <radialGradient id="travelLight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE47A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFCD00" stopOpacity="0" />
        </radialGradient>
        <clipPath id="mapClip">
          <path d="M120 30 C 150 34 168 60 158 96 C 150 124 132 140 140 168 C 150 200 186 214 196 250 C 208 292 190 320 172 352 C 158 378 168 402 158 430 C 150 456 128 476 112 470 C 100 466 104 442 110 420 C 118 390 100 372 96 344 C 90 306 118 288 120 254 C 122 224 96 210 92 180 C 88 150 110 138 108 108 C 106 78 96 54 106 40 C 112 32 116 30 120 30 Z" />
        </clipPath>
      </defs>

      {/* body */}
      <path
        d="M120 30 C 150 34 168 60 158 96 C 150 124 132 140 140 168 C 150 200 186 214 196 250 C 208 292 190 320 172 352 C 158 378 168 402 158 430 C 150 456 128 476 112 470 C 100 466 104 442 110 420 C 118 390 100 372 96 344 C 90 306 118 288 120 254 C 122 224 96 210 92 180 C 88 150 110 138 108 108 C 106 78 96 54 106 40 C 112 32 116 30 120 30 Z"
        fill="url(#mapMetal)"
        stroke="#D4A72C"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />

      {/* travelling light, clipped to the map */}
      <g clipPath="url(#mapClip)">
        <circle ref={lightRef} cx="120" cy="60" r="70" fill="url(#travelLight)" />
      </g>

      {/* archipelago dots — Hoàng Sa / Trường Sa gesture */}
      <g fill="#D4A72C" opacity="0.65">
        <circle cx="220" cy="250" r="2.5" />
        <circle cx="234" cy="300" r="2" />
        <circle cx="244" cy="360" r="2.5" />
        <circle cx="232" cy="410" r="2" />
      </g>
    </svg>
  );
});

export default VietnamMap;
