import Image from "next/image";
import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/hero-slider";
import ProductCard from "@/components/product-card";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { pickLocale } from "@/i18n/pick-locale";
import { BadgeCheck, Tag, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

const MEN_IMAGE = "https://images.unsplash.com/photo-1621607512214-68297480165e?w=1200";
const WOMEN_IMAGE = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200";
const PROMO_IMAGE = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200";

type CardProduct = Parameters<typeof ProductCard>[0]["product"];

function ProductRow({
  title,
  href,
  linkLabel,
  products,
}: {
  title: string;
  href: string;
  linkLabel: string;
  products: CardProduct[];
}) {
  if (products.length === 0) return null;
  return (
    <section>
      <SectionHeader title={title} href={href} linkLabel={linkLabel} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 mb-6 md:mb-8">
      <h2 className="font-display text-2xl md:text-3xl text-ink">{title}</h2>
      {href && linkLabel && (
        <Link href={href} className="shrink-0 text-sm text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export default async function Home() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  const [slides, offers, featured, newArrivals, categories] = await Promise.all([
    prisma.slide.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.product.findMany({ where: { discountActive: true }, take: 4, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { featured: true }, take: 4, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({
      take: 6,
      include: { products: { take: 1, select: { images: true }, orderBy: { createdAt: "desc" } } },
    }),
  ]);

  const services = [
    { icon: BadgeCheck, title: t("badge1Title"), sub: t("badge1Sub") },
    { icon: Truck, title: t("badge3Title"), sub: t("badge3Sub") },
    { icon: Tag, title: t("badge2Title"), sub: t("badge2Sub") },
  ];

  const collections = [
    { href: "/shop?gender=women", title: t("forHer"), cta: t("shopWomen"), image: WOMEN_IMAGE },
    { href: "/shop?gender=men", title: t("forHim"), cta: t("shopMen"), image: MEN_IMAGE },
  ];

  return (
    <div>
      <HeroSlider slides={slides} />

      <section className="border-b border-line bg-white">
        <div className="container-app grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-line">
          {services.map((s) => (
            <div key={s.title} className="flex items-center gap-3 py-4 sm:py-5 sm:justify-center sm:px-4">
              <s.icon size={20} strokeWidth={1.5} className="text-brand-700 shrink-0" />
              <div className="leading-tight">
                <p className="text-sm font-medium text-ink">{s.title}</p>
                <p className="text-xs text-ink/55 mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="container-app py-14 md:py-20 space-y-16 md:space-y-24">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {collections.map((c) => (
            <Link key={c.href} href={c.href} className="group relative block overflow-hidden rounded-md aspect-[4/3] bg-cream">
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent to-50%" />
              <div className="absolute bottom-0 start-0 p-6 md:p-8 text-white">
                <h2 className="font-display text-3xl md:text-4xl mb-2">{c.title}</h2>
                <span className="text-sm underline underline-offset-4 decoration-white/60 group-hover:decoration-white">
                  {c.cta}
                </span>
              </div>
            </Link>
          ))}
        </section>

        {categories.length > 0 && (
          <section>
            <SectionHeader title={t("shopByCategory")} href="/shop" linkLabel={t("viewAll")} />
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5">
              {categories.map((c) => {
                const name = pickLocale(locale, c.nameEn, c.nameAr);
                const img = c.products[0]?.images[0];
                return (
                  <Link key={c.id} href={`/shop?category=${c.slug}`} className="group">
                    <div className="relative aspect-square rounded-md overflow-hidden bg-cream">
                      {img && (
                        <Image
                          src={img}
                          alt={name}
                          fill
                          sizes="(max-width: 1024px) 33vw, 16vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <p className="mt-2.5 text-sm text-ink group-hover:underline underline-offset-4">{name}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <ProductRow title={t("newArrivals")} href="/shop" linkLabel={t("viewAll")} products={newArrivals} />

        <section className="grid grid-cols-1 md:grid-cols-2 bg-cream rounded-md overflow-hidden">
          <div className="relative min-h-[260px] md:min-h-[420px]">
            <Image src={PROMO_IMAGE} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="p-8 md:p-14 flex flex-col justify-center items-start">
            <h2 className="font-display text-3xl md:text-4xl text-ink leading-tight mb-4">{t("promoTitle")}</h2>
            <p className="text-ink/65 leading-relaxed mb-8 max-w-md">{t("promoSub")}</p>
            <Link href="/shop?onSale=1" className="btn-primary">
              {t("promoCta")}
            </Link>
          </div>
        </section>

        <ProductRow title={t("offers")} href="/shop?onSale=1" linkLabel={t("viewAll")} products={offers} />
        <ProductRow title={t("bestSellers")} href="/shop" linkLabel={t("viewAll")} products={featured} />
      </div>
    </div>
  );
}
