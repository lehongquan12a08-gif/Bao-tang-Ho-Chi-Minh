'use client';

import { useEffect, useState } from 'react';
import { NAV_LINKS } from '@/data/timeline';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={[
        'fixed inset-x-0 top-0 z-[100] transition-all duration-500',
        scrolled
          ? 'bg-[rgba(8,8,8,0.65)] backdrop-blur-[12px] border-b border-white/[0.08]'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#hero"
          className="group flex items-center gap-3"
          aria-label="Về đầu trang"
        >
          <span className="inline-block h-2 w-2 rotate-45 bg-vn-gold transition-transform duration-500 group-hover:rotate-[135deg]" />
          <span className="font-display text-[15px] font-semibold uppercase tracking-[0.28em] text-vn-ivory md:text-[16px]">
            Hành trình theo chân Bác
          </span>
        </a>

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
      </div>
    </nav>
  );
}
