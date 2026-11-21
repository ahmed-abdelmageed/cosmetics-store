import { PrismaClient } from "@prisma/client";
import { slidesData } from "./slides-data";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@lumiere.com";
  const adminPassword = "Admin123!";
  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Store Admin",
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
    },
  });

  const categoriesData = [
    { nameEn: "Skincare", nameAr: "العناية بالبشرة", slug: "skincare" },
    { nameEn: "Makeup", nameAr: "المكياج", slug: "makeup" },
    { nameEn: "Haircare", nameAr: "العناية بالشعر", slug: "haircare" },
    { nameEn: "Perfumes", nameAr: "العطور", slug: "perfumes" },
    { nameEn: "Shaving & Grooming", nameAr: "الحلاقة والعناية", slug: "grooming" },
  ];

  const categories = [];
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
    categories.push(cat);
  }
  const [skincare, makeup, haircare, perfumes, grooming] = categories;

  const productsData = [
    {
      nameEn: "Vitamin C Serum",
      nameAr: "سيروم فيتامين سي",
      slug: "vitamin-c-serum",
      descriptionEn: "An antioxidant serum that purifies skin and gives it a natural glow.",
      descriptionAr: "سيروم مضاد للأكسدة ينقي البشرة ويمنحها إشراقة طبيعية.",
      price: 450,
      discountPercent: 20,
      discountActive: true,
      stock: 30,
      images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800"],
      categoryId: skincare.id,
      gender: "WOMEN" as const,
      featured: true,
    },
    {
      nameEn: "Daily Face Moisturizer",
      nameAr: "كريم مرطب للوجه",
      slug: "face-moisturizer",
      descriptionEn: "A daily moisturizing cream suitable for all skin types.",
      descriptionAr: "كريم مرطب يومي مناسب لجميع أنواع البشرة.",
      price: 300,
      discountPercent: 0,
      discountActive: false,
      stock: 50,
      images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800"],
      categoryId: skincare.id,
      gender: "UNISEX" as const,
      featured: true,
    },
    {
      nameEn: "Matte Long-Lasting Lipstick",
      nameAr: "روج مطفي طويل الثبات",
      slug: "matte-lipstick",
      descriptionEn: "A matte lipstick with all-day wear and gorgeous shades.",
      descriptionAr: "روج بتركيبة مطفية وثبات يدوم طوال اليوم بألوان جذابة.",
      price: 180,
      discountPercent: 15,
      discountActive: true,
      stock: 60,
      images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800"],
      categoryId: makeup.id,
      gender: "WOMEN" as const,
      featured: true,
    },
    {
      nameEn: "Nourishing Shampoo",
      nameAr: "شامبو مغذي للشعر",
      slug: "nourishing-shampoo",
      descriptionEn: "A sulfate-free shampoo that nourishes hair and adds shine.",
      descriptionAr: "شامبو خالٍ من الكبريتات يغذي الشعر ويمنحه لمعاناً.",
      price: 220,
      discountPercent: 0,
      discountActive: false,
      stock: 40,
      images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800"],
      categoryId: haircare.id,
      gender: "UNISEX" as const,
      featured: false,
    },
    {
      nameEn: "Floral Perfume for Her",
      nameAr: "عطر فلورال نسائي",
      slug: "floral-perfume",
      descriptionEn: "A floral fragrance for women with long-lasting notes.",
      descriptionAr: "عطر نسائي فواح برائحة الزهور يدوم طويلاً.",
      price: 650,
      discountPercent: 10,
      discountActive: true,
      stock: 25,
      images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800"],
      categoryId: perfumes.id,
      gender: "WOMEN" as const,
      featured: true,
    },
    {
      nameEn: "Volumizing Mascara",
      nameAr: "ماسكرا فولومايزينج",
      slug: "volumizing-mascara",
      descriptionEn: "A mascara that adds volume and length without clumping.",
      descriptionAr: "ماسكرا تمنح رموشك كثافة وطولاً بدون تكتل.",
      price: 150,
      discountPercent: 0,
      discountActive: false,
      stock: 45,
      images: ["https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=800"],
      categoryId: makeup.id,
      gender: "WOMEN" as const,
      featured: false,
    },
    {
      nameEn: "Men's Woody Cologne",
      nameAr: "عطر رجالي خشبي",
      slug: "mens-woody-cologne",
      descriptionEn: "A bold woody fragrance for men with a long-lasting trail.",
      descriptionAr: "عطر رجالي بنفحات خشبية قوية وثبات يدوم طويلاً.",
      price: 720,
      discountPercent: 15,
      discountActive: true,
      stock: 35,
      images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800"],
      categoryId: perfumes.id,
      gender: "MEN" as const,
      featured: true,
    },
    {
      nameEn: "Beard Grooming Oil",
      nameAr: "زيت العناية باللحية",
      slug: "beard-grooming-oil",
      descriptionEn: "A nourishing oil that softens and shapes the beard.",
      descriptionAr: "زيت مغذي يعمل على تنعيم اللحية وتهذيبها.",
      price: 260,
      discountPercent: 0,
      discountActive: false,
      stock: 40,
      images: ["https://images.unsplash.com/photo-1621607512214-68297480165e?w=800"],
      categoryId: grooming.id,
      gender: "MEN" as const,
      featured: true,
    },
    {
      nameEn: "Men's Face Wash",
      nameAr: "غسول وجه رجالي",
      slug: "mens-face-wash",
      descriptionEn: "A refreshing daily face wash for men's skin.",
      descriptionAr: "غسول منعش للاستخدام اليومي مناسب لبشرة الرجال.",
      price: 190,
      discountPercent: 10,
      discountActive: true,
      stock: 55,
      images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800"],
      categoryId: skincare.id,
      gender: "MEN" as const,
      featured: false,
    },
    {
      nameEn: "Classic Shaving Kit",
      nameAr: "طقم حلاقة كلاسيكي",
      slug: "classic-shaving-kit",
      descriptionEn: "A complete shaving kit for a smooth, irritation-free shave.",
      descriptionAr: "طقم حلاقة متكامل للحصول على حلاقة ناعمة بدون تهيج.",
      price: 380,
      discountPercent: 0,
      discountActive: false,
      stock: 20,
      images: ["https://images.unsplash.com/photo-1503236823255-94609f598e71?w=800"],
      categoryId: grooming.id,
      gender: "MEN" as const,
      featured: false,
    },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  for (const s of slidesData) {
    await prisma.slide.upsert({ where: { id: s.id }, update: {}, create: s });
  }

  console.log("Seed completed. Admin login:", adminEmail, "/", adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
