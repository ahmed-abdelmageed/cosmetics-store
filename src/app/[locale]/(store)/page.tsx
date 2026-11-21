import Image from "next/image";
import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/hero-slider";
import HomeProductTabs from "@/components/home-product-tabs";
import Carousel from "@/components/carousel";
import Parallax from "@/components/parallax";
import Reveal from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { pickLocale } from "@/i18n/pick-locale";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const MEN_IMAGE = "https://images.unsplash.com/photo-1621607512214-68297480165e?w=1400";
const WOMEN_IMAGE = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400";
const PROMO_IMAGE = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1400";

function SectionHeader({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <Reveal className="flex items-end justify-between gap-6 mb-7 md:mb-9">
      <h2 className="font-display text-2xl md:text-3xl text-ink">{title}</h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="shrink-0 text-sm text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink transition-colors"
        >
          {linkLabel}
        </Link>
      )}
    </Reveal>
  );
}

export default async function Home() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  const [slides, offers, featured, newArrivals, categories, productsCount, categoriesCount] = await Promise.all([
    prisma.slide.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.product.findMany({ where: { discountActive: true }, take: 10, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { featured: true }, take: 10, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ take: 10, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({
      take: 12,
      include: { products: { take: 1, select: { images: true }, orderBy: { createdAt: "desc" } } },
    }),
    prisma.product.count(),
    prisma.category.count(),
  ]);

  const collections = [
    { href: "/shop?gender=women", title: t("forHer"), sub: t("womenSub"), cta: t("shopWomen"), image: WOMEN_IMAGE },
    { href: "/shop?gender=men", title: t("forHim"), sub: t("menSub"), cta: t("shopMen"), image: MEN_IMAGE },
  ];

  return (
    <div>
      <HeroSlider slides={slides} stats={{ products: productsCount, categories: categoriesCount }} />


      <div className="container-app py-14 md:py-20 space-y-20 md:space-y-28">
        {/* Categories rail */}
        {categories.length > 0 && (
          <section>
            <SectionHeader title={t("shopByCategory")} href="/shop" linkLabel={t("viewAll")} />
            <Reveal delay={100}>
              <Carousel itemClassName="w-[38%] sm:w-[24%] lg:w-[15.5%]">
                {categories.map((c) => {
                  const name = pickLocale(locale, c.nameEn, c.nameAr);
                  const img = c.products[0]?.images[0];
                  return (
                    <Link key={c.id} href={`/shop?category=${c.slug}`} className="group block text-center">
                      <div className="relative aspect-square rounded-full overflow-hidden bg-cream ring-1 ring-line transition-[box-shadow] duration-500 group-hover:ring-ink/40 group-hover:ring-offset-4 group-hover:ring-offset-background">
                        {img && (
                          <Image
                            src={img}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 38vw, (max-width: 1024px) 24vw, 200px"
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                          />
                        )}
                      </div>
                      <p className="mt-3 text-sm text-ink transition-colors group-hover:text-brand-700">{name}</p>
                    </Link>
                  );
                })}
              </Carousel>
            </Reveal>
          </section>
        )}

        {/* Collections: on desktop the hovered panel widens */}
        <section>
          <SectionHeader title={t("collectionsTitle")} />
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 md:h-[520px]">
            {collections.map((c, i) => (
              <div
                key={c.href}
                className="md:flex-1 md:hover:flex-[1.45] md:min-w-0 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
              <Reveal delay={i * 120} className="h-full">
                <Link href={c.href} className="group relative block h-full overflow-hidden rounded-md bg-cream aspect-[4/3] md:aspect-auto">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6 md:p-9 text-white">
                    <h3 className="font-display text-3xl md:text-5xl mb-2">{c.title}</h3>
                    <p className="text-sm text-white/80 max-w-xs mb-4 md:mb-0 md:max-h-0 md:opacity-0 md:group-hover:max-h-20 md:group-hover:opacity-100 md:group-hover:mb-5 transition-all duration-500 overflow-hidden">
                      {c.sub}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium bg-white text-ink rounded-[4px] px-5 py-2.5 transition-transform duration-300 group-hover:-translate-y-0.5">
                      {c.cta}
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* Tabbed product rail */}
        <Reveal>
          <HomeProductTabs
            title={t("featuredTitle")}
            viewAllLabel={t("viewAll")}
            tabs={[
              { key: "new", label: t("newArrivals"), href: "/shop", products: newArrivals },
              { key: "best", label: t("bestSellers"), href: "/shop", products: featured },
              { key: "offers", label: t("offers"), href: "/shop?onSale=1", products: offers },
            ]}
          />
        </Reveal>
      </div>

      {/* Promo with parallax image */}
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 overflow-hidden">
          <Parallax className="absolute inset-x-0 -top-[20%] -bottom-[20%]">
            <Image src={PROMO_IMAGE} alt="" fill sizes="100vw" className="object-cover opacity-70" />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-ink/85 via-ink/50 to-transparent" />
        </div>
        <div className="relative container-app py-24 md:py-36">
          <div className="max-w-lg text-white">
            <Reveal>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.1] mb-5">{t("promoTitle")}</h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-white/75 leading-relaxed mb-9">{t("promoSub")}</p>
            </Reveal>
            <Reveal delay={240}>
              <Link
                href="/shop?onSale=1"
                className="group inline-flex items-center gap-2 bg-white text-ink hover:bg-cream px-7 py-3.5 rounded-[4px] text-sm font-medium transition-colors"
              >
                {t("promoCta")}
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
