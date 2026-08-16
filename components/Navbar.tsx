'use client';

import { useEffect, useRef, useState } from 'react';
import type Lenis from 'lenis';
import { NAV_LINKS } from '@/data/timeline';
import { onLenis } from '@/lib/lenisStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  // Hide the bar while scrolling DOWN (so it never covers the content); reveal
  // it near the top or when scrolling back up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y < 90) setHidden(false);
      // small down-threshold so the slow auto-scroll (~3-4px/frame) also hides it
      else if (y > lastY.current + 2) setHidden(true);
      else if (y < lastY.current - 8) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // Lenis (desktop) doesn't fire native scroll during its smooth / auto-scroll,
    // so also listen to Lenis's own scroll event — otherwise the bar wouldn't
    // hide while auto-scrolling.
    let bound: Lenis | null = null;
    const off = onLenis((l) => {
      if (bound) bound.off('scroll', onScroll);
      bound = l;
      if (l) l.on('scroll', onScroll);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (bound) bound.off('scroll', onScroll);
      off();
    };
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <nav
      className={[
        'fixed inset-x-0 top-0 z-[100] transition-all duration-500 ease-cinematic',
        hidden && !open ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
        scrolled || open
          ? 'bg-[rgba(8,8,8,0.65)] backdrop-blur-[12px] border-b border-white/[0.08]'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10">
        <a
          href="#hero"
          className="group flex items-center gap-2.5"
          aria-label="Về đầu trang"
          onClick={() => setOpen(false)}
        >
          <span className="inline-block h-2 w-2 rotate-45 bg-vn-gold transition-transform duration-500 group-hover:rotate-[135deg]" />
          <span className="font-display text-[12.5px] font-semibold uppercase tracking-[0.16em] text-vn-ivory sm:text-[15px] sm:tracking-[0.28em]">
            Hành trình theo chân Bác
          </span>
        </a>

        {/* desktop links */}
        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative font-body text-[13px] font-light uppercase tracking-[0.14em] text-vn-ivory/70 transition-colors duration-300 hover:text-vn-ivory"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-vn-gold transition-all duration-400 ease-cinematic group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
          className="relative z-[110] flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={[
              'block h-[1.5px] w-6 bg-vn-ivory transition-all duration-300',
              open ? 'translate-y-[6.5px] rotate-45' : '',
            ].join(' ')}
          />
          <span
            className={[
              'block h-[1.5px] w-6 bg-vn-ivory transition-all duration-300',
              open ? 'opacity-0' : 'opacity-100',
            ].join(' ')}
          />
          <span
            className={[
              'block h-[1.5px] w-6 bg-vn-ivory transition-all duration-300',
              open ? '-translate-y-[6.5px] -rotate-45' : '',
            ].join(' ')}
          />
        </button>
      </div>

      {/* mobile overlay menu */}
      <div
        className={[
          'fixed inset-0 z-[105] flex flex-col items-center justify-center gap-8 bg-[rgba(8,8,8,0.96)] backdrop-blur-md transition-all duration-500 md:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="font-display text-2xl uppercase tracking-[0.22em] text-vn-ivory/90 transition-colors duration-300 hover:text-vn-gold"
            style={{
              transitionDelay: open ? `${100 + i * 60}ms` : '0ms',
              transform: open ? 'translateY(0)' : 'translateY(14px)',
              opacity: open ? 1 : 0,
            }}
          >
            {link.label}
          </a>
        ))}
        <span className="mt-6 h-px w-16 bg-vn-gold-antique/50" />
        <p className="eyebrow text-vn-gold-antique">1890 — 1969</p>
      </div>
    </nav>
  );
}
