import Navbar from '@/components/Navbar';
import TimelineIndicator from '@/components/TimelineIndicator';
import AutoScrollButton from '@/components/AutoScrollButton';
import AudioController from '@/components/AudioController';
import Hero from '@/components/Hero';
import Chapter1890 from '@/components/chapters/Chapter1890';
import WordCascade from '@/components/WordCascade';
import Chapter1911 from '@/components/chapters/Chapter1911';
import NguyenAiQuoc from '@/components/chapters/NguyenAiQuoc';
import Chapter1941 from '@/components/chapters/Chapter1941';
import Chapter1945 from '@/components/chapters/Chapter1945';
import QuoteSection from '@/components/QuoteSection';
import VietnamMapSection from '@/components/VietnamMapSection';
import FinalSection from '@/components/FinalSection';
import Gallery from '@/components/Gallery';
import MediaSection from '@/components/MediaSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <TimelineIndicator />
      <AutoScrollButton />
      <AudioController />

      <main>
        {/* 01 · The cinematic entry */}
        <Hero />

        {/* 02 · 1890 — Từ Làng Sen */}
        <Chapter1890 />

        {/* Transition typography · 1890 → 1911 */}
        <WordCascade
          words={['TUỔI TRẺ', 'HỌC HỎI', 'TÌM KIẾM', 'MỘT CON ĐƯỜNG']}
          perWordVh={80}
        />

        {/* 03 · 1911 — Ra đi tìm đường cứu nước */}
        <Chapter1911 />

        {/* 04 · 30 NĂM — the great search */}
        <WordCascade
          id="chapter-30-nam"
          words={['30', 'NĂM', 'MỘT HÀNH TRÌNH', 'ĐI TÌM', 'CON ĐƯỜNG', 'CHO DÂN TỘC']}
          accentWords={['30']}
          perWordVh={80}
        />

        {/* 05 · Nguyễn Ái Quốc — the archive */}
        <NguyenAiQuoc />

        {/* 06 · 1941 — Trở về Tổ quốc */}
        <Chapter1941 />

        {/* 07 · 1945 — Độc lập, Tự do */}
        <Chapter1945 />

        {/* 08 · Verified quote */}
        <QuoteSection />

        {/* 09 · Việt Nam */}
        <VietnamMapSection />

        {/* Closing typography */}
        <WordCascade
          words={['MỘT CUỘC ĐỜI', 'VÌ DÂN', 'VÌ NƯỚC']}
          perWordVh={85}
        />

        {/* 10 · The circle closes */}
        <FinalSection />

        {/* 11 · Tư liệu — archive gallery */}
        <Gallery />

        {/* 12 · Nghe & Xem — media */}
        <MediaSection />

        {/* Ending */}
        <Footer />
      </main>
    </>
  );
}
