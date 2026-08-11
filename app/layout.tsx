import type { Metadata, Viewport } from 'next';
import {
  Cormorant_Garamond,
  Playfair_Display,
  Be_Vietnam_Pro,
} from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import FilmGrain from '@/components/FilmGrain';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HÀNH TRÌNH THEO CHÂN BÁC',
  description:
    'Một hành trình – Một lý tưởng – Một cuộc đời vì dân tộc. Triển lãm số tương tác về cuộc đời Chủ tịch Hồ Chí Minh.',
  keywords: ['Hồ Chí Minh', 'lịch sử Việt Nam', 'triển lãm số', 'độc lập tự do'],
};

export const viewport: Viewport = {
  themeColor: '#080808',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${cormorant.variable} ${playfair.variable} ${beVietnam.variable}`}
    >
      <body className="bg-vn-black text-vn-ivory antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <FilmGrain />
      </body>
    </html>
  );
}
