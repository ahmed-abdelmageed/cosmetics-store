import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product-card";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { pickLocale } from "@/i18n/pick-locale";

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
    <div className="container-app py-8">
      <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>

      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/shop"
          className={`px-4 py-1.5 rounded-full text-sm border ${
            !category && !onSale && !gender ? "bg-amber-600 text-white border-amber-600" : "border-neutral-300"
          }`}
        >
          {t("all")}
        </Link>
        <Link
          href="/shop?gender=men"
          className={`px-4 py-1.5 rounded-full text-sm border ${
            genderFilter === "MEN" ? "bg-amber-600 text-white border-amber-600" : "border-neutral-300"
          }`}
        >
          {t("men")}
        </Link>
        <Link
          href="/shop?gender=women"
          className={`px-4 py-1.5 rounded-full text-sm border ${
            genderFilter === "WOMEN" ? "bg-amber-600 text-white border-amber-600" : "border-neutral-300"
          }`}
        >
          {t("women")}
        </Link>
        <Link
          href="/shop?onSale=1"
          className={`px-4 py-1.5 rounded-full text-sm border ${
            onSale ? "bg-amber-600 text-white border-amber-600" : "border-neutral-300"
          }`}
        >
          {t("offers")}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              category === c.slug ? "bg-amber-600 text-white border-amber-600" : "border-neutral-300"
            }`}
          >
            {pickLocale(locale, c.nameEn, c.nameAr)}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">{t("noProducts")}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
