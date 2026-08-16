'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins once, on the client only.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Ignore the mobile URL-bar show/hide resize — otherwise every scroll on a
  // phone fires a resize → ScrollTrigger.refresh() → the pinned sections jump
  // and scrubbed animations reset (looks like the first section "repeats").
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, useGSAP };
