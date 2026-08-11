// Mục "Tư liệu" — ảnh do người dùng cung cấp. Chú thích cố ý ngắn gọn, mang
// tính chủ đề (không gán niên đại/sự kiện cụ thể để tránh sai lệch).

export interface GalleryItem {
  src: string;
  caption: string;
  /** true → ô lớn (span 2 hàng) để nhịp điệu editorial. */
  tall?: boolean;
}

export const GALLERY: GalleryItem[] = [
  { src: '/images/photos/gallery/g-01.webp', caption: 'Với đồng bào' },
  { src: '/images/photos/gallery/g-02.webp', caption: 'Ngôi nhà sàn', tall: true },
  { src: '/images/photos/gallery/g-03.webp', caption: 'Ân cần dặn dò' },
  { src: '/images/photos/gallery/g-04.webp', caption: 'Giữa đời thường' },
  { src: '/images/photos/gallery/g-05.webp', caption: 'Với bà con nông dân', tall: true },
  { src: '/images/photos/gallery/g-06.webp', caption: 'Niềm vui gặp gỡ' },
  { src: '/images/photos/gallery/g-07.webp', caption: 'Với các cháu thiếu nhi' },
  { src: '/images/photos/gallery/g-08.webp', caption: 'Yêu thương các cháu', tall: true },
  { src: '/images/photos/gallery/g-09.webp', caption: 'Tuổi thơ vui ca' },
  { src: '/images/photos/gallery/g-10.webp', caption: 'Với đồng bào' },
  { src: '/images/photos/gallery/g-11.webp', caption: 'Bàn tay lao động' },
  { src: '/images/photos/gallery/g-12.webp', caption: 'Đọc sách cùng cháu nhỏ', tall: true },
  { src: '/images/photos/gallery/g-13.webp', caption: 'Với các chiến sĩ' },
  { src: '/images/photos/gallery/g-14.webp', caption: 'Những năm bôn ba' },
  { src: '/images/photos/gallery/g-15.webp', caption: 'Trên đường công tác' },
  { src: '/images/photos/gallery/g-16.webp', caption: 'Những ngày bình dị' },
];
