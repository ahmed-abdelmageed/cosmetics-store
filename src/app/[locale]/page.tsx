import { prisma } from "@/lib/prisma";
import HeroSlider from "@/components/hero-slider";
import ProductCard from "@/components/product-card";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { pickLocale } from "@/i18n/pick-locale";
import { Sparkles, Tag, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  const [slides, offers, featured, categories, menProducts, womenProducts] = await Promise.all([
    prisma.slide.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.product.findMany({ where: { discountActive: true }, take: 4, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { featured: true }, take: 4, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ take: 8 }),
    prisma.product.findMany({ where: { gender: "MEN" }, take: 4, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { gender: "WOMEN" }, take: 4, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="container-app py-6 space-y-14">
      <HeroSlider slides={slides} />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 flex items-center gap-3 border border-neutral-200">
          <Sparkles className="text-amber-600" />
          <div>
            <p className="font-semibold">{t("badge1Title")}</p>
            <p className="text-xs text-gray-500">{t("badge1Sub")}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 flex items-center gap-3 border border-neutral-200">
          <Tag className="text-amber-600" />
          <div>
            <p className="font-semibold">{t("badge2Title")}</p>
            <p className="text-xs text-gray-500">{t("badge2Sub")}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 flex items-center gap-3 border border-neutral-200">
          <Truck className="text-amber-600" />
          <div>
            <p className="font-semibold">{t("badge3Title")}</p>
            <p className="text-xs text-gray-500">{t("badge3Sub")}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">{t("shopByGender")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/shop?gender=men"
            className="relative rounded-2xl overflow-hidden h-40 flex items-end p-6 bg-gradient-to-br from-slate-800 to-slate-600 text-white"
          >
            <span className="text-2xl font-bold">{t("forHim")}</span>
          </Link>
          <Link
            href="/shop?gender=women"
            className="relative rounded-2xl overflow-hidden h-40 flex items-end p-6 bg-gradient-to-br from-amber-700 to-amber-500 text-white"
          >
            <span className="text-2xl font-bold">{t("forHer")}</span>
          </Link>
        </div>
      </section>

      {categories.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">{t("shopByCategory")}</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className="px-5 py-2 rounded-full bg-white border border-neutral-300 hover:bg-amber-600 hover:text-white transition-colors text-sm font-medium"
              >
                {pickLocale(locale, c.nameEn, c.nameAr)}
              </Link>
            ))}
          </div>
        </section>
      )}

      {offers.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t("offers")}</h2>
            <Link href="/shop?onSale=1" className="text-amber-600 text-sm font-medium">
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {offers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {menProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t("forHim")}</h2>
            <Link href="/shop?gender=men" className="text-amber-600 text-sm font-medium">
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {menProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {womenProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t("forHer")}</h2>
            <Link href="/shop?gender=women" className="text-amber-600 text-sm font-medium">
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {womenProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t("bestSellers")}</h2>
            <Link href="/shop" className="text-amber-600 text-sm font-medium">
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
