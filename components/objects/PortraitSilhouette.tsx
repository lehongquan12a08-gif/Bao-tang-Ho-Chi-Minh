import { forwardRef } from 'react';

/**
 * SYMBOLIC portrait — a dignified line/silhouette illustration, deliberately
 * NOT a photographic likeness. Per the project's content rules we never present
 * a fabricated image as a historical photograph. This is an abstract tribute
 * form (bust in raking light) meant to be read as symbolic, and it should be
 * accompanied by a visible "hình tượng trưng" caption.
 *
 * To use a real, rights-cleared archival photograph instead, replace this
 * component's output with an <img className="archival"> inside the same layer.
 */
const PortraitSilhouette = forwardRef<SVGSVGElement, { className?: string }>(
  function PortraitSilhouette({ className = '' }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 400 520"
        className={className}
        role="img"
        aria-label="Hình tượng trưng — chân dung Chủ tịch Hồ Chí Minh (minh họa biểu tượng)"
      >
        <defs>
          <linearGradient id="portraitFill" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#F4EBD8" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#D9C9A8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#6A4932" stopOpacity="0.7" />
          </linearGradient>
          <radialGradient id="portraitLight" cx="42%" cy="34%" r="65%">
            <stop offset="0%" stopColor="#FFF7E4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFF7E4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fadeBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="60%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#080808" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Bust silhouette: high forehead, gentle profile turn, shoulders */}
        <path
          d="M200 60
             C 150 60 120 100 116 150
             C 113 186 120 210 128 232
             C 134 250 128 262 118 272
             C 96 292 70 300 54 320
             C 34 344 26 392 24 440
             L 24 520 L 376 520 L 376 440
             C 374 392 366 344 346 320
             C 330 300 304 292 282 272
             C 272 262 266 250 272 232
             C 280 210 287 186 284 150
             C 280 100 250 60 200 60 Z"
          fill="url(#portraitFill)"
        />

        {/* raking light on the brow / cheek */}
        <ellipse cx="170" cy="170" rx="70" ry="90" fill="url(#portraitLight)" />

        {/* subtle contour lines suggesting form without depicting features */}
        <path
          d="M150 150 C 156 200 150 250 130 268"
          fill="none"
          stroke="#6A4932"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <path
          d="M250 150 C 244 200 250 250 270 268"
          fill="none"
          stroke="#6A4932"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />

        {/* dissolve into the darkness at the base */}
        <rect x="0" y="0" width="400" height="520" fill="url(#fadeBottom)" />
      </svg>
    );
  }
);

export default PortraitSilhouette;
