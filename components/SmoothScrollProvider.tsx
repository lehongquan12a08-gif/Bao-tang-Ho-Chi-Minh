'use client';

import { useSmoothScroll } from '@/hooks/useGSAPScroll';

/**
 * Thin client wrapper that boots Lenis + GSAP ScrollTrigger sync.
 * Renders nothing; mount once inside the root layout.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useSmoothScroll();
  return <>{children}</>;
}
