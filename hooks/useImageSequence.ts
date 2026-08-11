'use client';

import { useEffect, useRef, useState } from 'react';

interface ImageSequenceOptions {
  /** Path template, e.g. `/sequences/ship/frame-{n}.webp` where {n} is zero-padded. */
  pathTemplate: string;
  frameCount: number;
  /** Number of digits to zero-pad the frame index to (default 3 → 001, 002 …). */
  pad?: number;
  /** 1-based index of the first frame on disk (default 1). */
  startAt?: number;
}

interface ImageSequenceReturn {
  images: HTMLImageElement[];
  loaded: boolean;
  progress: number;
  /** Draw a given frame (0..frameCount-1) into a canvas, object-fit: cover. */
  drawFrame: (
    canvas: HTMLCanvasElement | null,
    frame: number
  ) => void;
}

/**
 * Preloads a Blender-rendered image sequence (PNG/WebP/AVIF) and exposes a
 * canvas draw helper. Connect `frame` to a GSAP ScrollTrigger scrub value to
 * play cinematic 3D objects without shipping a full WebGL scene.
 *
 * This hook is intentionally decoupled from any specific asset so real render
 * sequences can be dropped into /public/sequences later. See README.
 */
export function useImageSequence({
  pathTemplate,
  frameCount,
  pad = 3,
  startAt = 1,
}: ImageSequenceOptions): ImageSequenceReturn {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let done = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 0; i < frameCount; i++) {
      const n = String(i + startAt).padStart(pad, '0');
      const img = new Image();
      img.src = pathTemplate.replace('{n}', n);
      img.onload = img.onerror = () => {
        if (cancelled) return;
        done += 1;
        setProgress(done / frameCount);
        if (done === frameCount) setLoaded(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, [pathTemplate, frameCount, pad, startAt]);

  const drawFrame = (canvas: HTMLCanvasElement | null, frame: number) => {
    if (!canvas) return;
    const imgs = imagesRef.current;
    const idx = Math.max(0, Math.min(frameCount - 1, Math.round(frame)));
    const img = imgs[idx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth * dpr;
    const ch = canvas.clientHeight * dpr;
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }

    // object-fit: cover
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  return { images: imagesRef.current, loaded, progress, drawFrame };
}
