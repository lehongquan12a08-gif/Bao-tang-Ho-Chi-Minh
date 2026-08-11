# HÀNH TRÌNH THEO CHÂN BÁC

> Một hành trình – Một lý tưởng – Một cuộc đời vì dân tộc

Triển lãm số tương tác (interactive digital exhibition) về cuộc đời Chủ tịch Hồ
Chí Minh, kể chuyện bằng **scroll cinematic**: người xem cuộn qua từng giai đoạn
lịch sử như xem một bộ phim tài liệu được điều khiển bằng chuột.

## Công nghệ

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** — bảng màu nhận diện Việt Nam
- **GSAP + ScrollTrigger** — toàn bộ scene scroll phức tạp (scrub timelines)
- **Lenis** — smooth scroll, đồng bộ với GSAP ticker
- SVG symbolic 3D objects + 2.5D parallax (không dùng Three.js → nhẹ, dễ kiểm soát)

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:3000
```

Build production:

```bash
npm run build && npm run start
```

## Cấu trúc

```
app/
  layout.tsx            # fonts (next/font), metadata, SmoothScroll + FilmGrain
  page.tsx              # ráp toàn bộ trình tự trải nghiệm
  globals.css           # biến màu VN, typography, film grain, utilities
components/
  Navbar.tsx            # nav trong suốt → blur khi scroll
  TimelineIndicator.tsx # thanh năm dọc bên phải (gold progress)
  Hero.tsx              # 380vh sticky, timeline 3 giai đoạn (star zoom)
  WordCascade.tsx       # interlude typography (30 NĂM, transitions…)
  ParallaxImage.tsx     # 1 layer parallax 2.5D
  Reveal.tsx            # reveal on-enter chậm rãi
  QuoteSection.tsx      # trích dẫn đã kiểm chứng (nền ngà)
  VietnamMapSection.tsx # bản đồ VN + ánh sáng vàng Bắc→Nam
  FinalSection.tsx      # khép vòng tròn — chân dung trở lại
  Footer.tsx            # ending + CTA
  objects/              # SVG biểu tượng: GoldStar, LotusFlower, Ship,
                        #   PortraitSilhouette, VietnamMap
  chapters/             # Chapter1890 / 1911 / NguyenAiQuoc / 1941 / 1945
hooks/
  useGSAPScroll.ts      # Lenis ⇄ GSAP ScrollTrigger
  useImageSequence.ts   # nạp image sequence (Blender render) vào Canvas
data/
  timeline.ts           # mốc thời gian, nav, trích dẫn
lib/
  gsap.ts               # đăng ký plugin
```

## Nguyên tắc nội dung (quan trọng)

Trang mang tính **giáo dục – lịch sử – văn hóa – tri ân**, thể hiện Chủ tịch Hồ
Chí Minh một cách trang trọng.

- **Chân dung, bản đồ, vật thể đều là minh họa biểu tượng (SVG)** — cố ý *không*
  phải ảnh tư liệu thật, có ghi chú "Hình tượng trưng / Minh họa biểu tượng".
- **Không tự sáng tác trích dẫn.** Câu trong `QuoteSection` là câu đã được kiểm
  chứng ("Không có gì quý hơn độc lập, tự do", 17/7/1966). Trước khi đưa vào sử
  dụng chính thức, hãy đối chiếu mọi dữ kiện với nguồn chính thống (Bảo tàng Hồ
  Chí Minh, *Hồ Chí Minh Toàn tập* — NXB Chính trị Quốc gia).

### Ảnh nền / kết cấu (asset gốc, an toàn bản quyền)

Toàn bộ ảnh raster trong trang được **sinh bằng code**, không dùng ảnh của bên
thứ ba: `scripts/generate-assets.mjs` dựng SVG (gradient + `feTurbulence`) rồi
rasterize sang WebP bằng `sharp`. Chạy lại bất cứ lúc nào:

```bash
npm run assets   # → public/images/*.webp
```

| Asset | Dùng ở | Ý nghĩa |
|-------|--------|---------|
| `paper.webp` | 1890, thẻ tư liệu Nguyễn Ái Quốc | giấy cũ sepia |
| `mist.webp` | 1911 | sương bến cảng |
| `forest.webp` | 1941 | sương rừng Việt Bắc |
| `silk.webp` | 1945 (finale) | lụa đỏ, hiện dần khi nền chuyển đỏ |
| `stars.webp` | Hero, Việt Nam, Final | trời sao mờ |

Film grain vẫn là inline SVG trong `globals.css`. Chèn qua component
`components/TextureBg.tsx`.

### Thay bằng ảnh tư liệu / render 3D thật

Nếu bạn có **ảnh tư liệu được cấp quyền hợp lệ**, thay `PortraitSilhouette`
bằng `<img className="archival" … />` trong cùng lớp (`.hero-portrait` /
`.final-portrait`). Class `.archival` (trong `globals.css`) đã xử lý sẵn
grayscale + mask gradient để ảnh hòa vào layout.

Với **3D cinematic bằng Blender**: render image sequence (WebP/AVIF, 80–120 frame
desktop) vào `public/sequences/<object>/frame-{n}.webp`, rồi dùng
`useImageSequence` + một `<canvas>` nối `drawFrame` với `ScrollTrigger { scrub }`.
Hook đã viết sẵn logic object-fit: cover và DPR.

## Hiệu năng & responsive

- Chỉ animate `transform` / `opacity` / `filter` (có kiểm soát) + `will-change`.
- Tôn trọng `prefers-reduced-motion` (tắt smooth scroll + grain).
- Mobile: typography `clamp()` riêng, timeline dọc ẩn ở `<lg`.
- First Load JS ≈ 157 kB (đã build kiểm chứng).

## Ghi chú

`window.__lenis` / `window.__ST` chỉ được expose ở môi trường **dev** để tiện
kiểm tra wiring từ console; không xuất hiện trong bản production.
