import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product-card";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { pickLocale } from "@/i18n/pick-locale";
import Reveal from "@/components/reveal";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; onSale?: string; gender?: string; q?: string }>;
}) {
  const { category, onSale, gender, q } = await searchParams;
  const t = await getTranslations("shop");
  const locale = await getLocale();
  const genderFilter = gender?.toUpperCase();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(category ? { category: { slug: category } } : {}),
        ...(onSale ? { discountActive: true } : {}),
        ...(genderFilter === "MEN" || genderFilter === "WOMEN" ? { gender: genderFilter } : {}),
        ...(q
          ? {
              OR: [
                { nameEn: { contains: q, mode: "insensitive" } },
                { nameAr: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
  ]);

  const pageTitle = onSale
    ? t("offers")
    : genderFilter === "MEN"
      ? t("men")
      : genderFilter === "WOMEN"
        ? t("women")
        : category
          ? pickLocale(locale, categories.find((c) => c.slug === category)?.nameEn, categories.find((c) => c.slug === category)?.nameAr)
          : t("title");

  return (
    <div className="container-app py-10 md:py-14">
      <h1 className="font-display text-3xl md:text-4xl mb-8 animate-rise">{pageTitle}</h1>

      <div className="flex gap-2 flex-wrap mb-8 pb-8 border-b border-line animate-rise" style={{ animationDelay: "100ms" }}>
        <Link
          href="/shop"
          className={`px-4 py-2 rounded-[4px] text-sm border transition-colors ${
            !category && !onSale && !gender ? "bg-ink text-white border-ink" : "bg-white border-line text-ink/75 hover:border-ink"
          }`}
        >
          {t("all")}
        </Link>
        <Link
          href="/shop?gender=men"
          className={`px-4 py-2 rounded-[4px] text-sm border transition-colors ${
            genderFilter === "MEN" ? "bg-ink text-white border-ink" : "bg-white border-line text-ink/75 hover:border-ink"
          }`}
        >
          {t("men")}
        </Link>
        <Link
          href="/shop?gender=women"
          className={`px-4 py-2 rounded-[4px] text-sm border transition-colors ${
            genderFilter === "WOMEN" ? "bg-ink text-white border-ink" : "bg-white border-line text-ink/75 hover:border-ink"
          }`}
        >
          {t("women")}
        </Link>
        <Link
          href="/shop?onSale=1"
          className={`px-4 py-2 rounded-[4px] text-sm border transition-colors ${
            onSale ? "bg-ink text-white border-ink" : "bg-white border-line text-ink/75 hover:border-ink"
          }`}
        >
          {t("offers")}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className={`px-4 py-2 rounded-[4px] text-sm border transition-colors ${
              category === c.slug ? "bg-ink text-white border-ink" : "bg-white border-line text-ink/75 hover:border-ink"
            }`}
          >
            {pickLocale(locale, c.nameEn, c.nameAr)}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-ink/50">{t("noProducts")}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
