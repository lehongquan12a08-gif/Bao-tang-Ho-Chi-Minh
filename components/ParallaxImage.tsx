'use client';

import { useRef, ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

interface ParallaxLayerProps {
  children: ReactNode;
  /** Negative = moves up faster than scroll (foreground); positive = slower. */
  speed?: number;
  className?: string;
}

/**
 * A single 2.5D parallax layer. Stack several with different `speed` values
 * inside a `relative` container to build cinematic depth (background architecture
 * slow, crowd medium, foreground fast).
 */
export default function ParallaxLayer({
  children,
  speed = 0,
  className = '',
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: ref, dependencies: [speed] }
  );

  return (
    <div ref={ref} className={`will-transform ${className}`}>
      {children}
    </div>
  );
}
