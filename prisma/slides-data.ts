// Homepage hero slides. Images are cropped square by Unsplash's CDN for the hero's circular
// frame; `crop=faces` keeps faces in frame, `crop=entropy` keeps the busiest area.
// Words wrapped in *stars* in a title are highlighted with an underline on the homepage.
const img = (id: string, crop: "faces" | "entropy") =>
  `https://images.unsplash.com/photo-${id}?w=1200&h=1200&fit=crop&crop=${crop}&q=80&auto=format`;

export const slidesData = [
  {
    id: "slide_1",
    titleEn: "Makeup that *lasts* all day",
    titleAr: "مكياج *يدوم معاكي* طول اليوم",
    subtitleEn: "Lipsticks, palettes and foundations from brands you know — all original.",
    subtitleAr: "روج وباليتات وكريم أساس من ماركات بتعرفيها، وكلها أصلية.",
    image: img("1522335789203-aabd1fc54bc9", "entropy"),
    link: "/shop?category=makeup",
    order: 0,
    active: true,
  },
  {
    id: "slide_2",
    titleEn: "Skincare that *shows results*",
    titleAr: "روتين عناية *بنتيجة واضحة*",
    subtitleEn: "Serums, moisturisers and cleansers matched to your skin type.",
    subtitleAr: "سيروم ومرطبات وغسول يناسبوا نوع بشرتك.",
    image: img("1596462502278-27bfdc403348", "entropy"),
    link: "/shop?category=skincare",
    order: 1,
    active: true,
  },
  {
    id: "slide_3",
    titleEn: "Grooming, *done properly*",
    titleAr: "عناية رجالي *على أصولها*",
    subtitleEn: "Shaving kits, beard oils and fragrances for everyday confidence.",
    subtitleAr: "أطقم حلاقة وزيوت للدقن وعطور تديك ثقة كل يوم.",
    image: img("1621607512214-68297480165e", "entropy"),
    link: "/shop?gender=men",
    order: 2,
    active: true,
  },
  {
    id: "slide_4",
    titleEn: "Offers on *the favourites*",
    titleAr: "عروض على *المنتجات المفضلة*",
    subtitleEn: "Hand-picked products at their best prices, while stock lasts.",
    subtitleAr: "منتجات مختارة بأحسن أسعارها، لحد نفاد الكمية.",
    image: img("1583241800698-e8ab01830a07", "entropy"),
    link: "/shop?onSale=1",
    order: 3,
    active: true,
  },
];
