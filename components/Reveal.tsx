'use client';

import { useRef, ReactNode, ElementType } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

interface RevealProps {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
}

/**
 * Simple, tasteful on-enter reveal (opacity + translateY). Deliberately slow
 * and deliberate to keep the museum-exhibition tone. Batched per element.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  y = 60,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 82%',
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
