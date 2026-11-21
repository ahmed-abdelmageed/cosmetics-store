import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { formatPrice, getFinalPrice } from "@/lib/utils";
import { pickLocale } from "@/i18n/pick-locale";
import AddToCartButton from "@/components/add-to-cart-button";
import ProductGallery from "@/components/product-gallery";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import { BadgeCheck, ChevronDown, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

function Details({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-line">
      <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown size={17} className="text-ink/50 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="pb-5 text-sm text-ink/70 leading-7">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  if (!product) return notFound();

  const [t, tNav, tCommon, tHome, locale, related] = await Promise.all([
    getTranslations("product"),
    getTranslations("nav"),
    getTranslations("common"),
    getTranslations("home"),
    getLocale(),
    prisma.product.findMany({
      where: {
        id: { not: product.id },
        ...(product.categoryId ? { categoryId: product.categoryId } : { gender: product.gender }),
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const name = pickLocale(locale, product.nameEn, product.nameAr);
  const description = pickLocale(locale, product.descriptionEn, product.descriptionAr);
  const categoryName = product.category ? pickLocale(locale, product.category.nameEn, product.category.nameAr) : null;
  const finalPrice = getFinalPrice(product.price, product.discountPercent, product.discountActive);
  const hasDiscount = product.discountActive && product.discountPercent > 0;

  return (
    <div className="container-app py-8 md:py-12">
      <nav className="text-xs text-ink/50 mb-6 flex items-center gap-2 animate-fade">
        <Link href="/" className="hover:text-ink transition-colors">{tNav("home")}</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ink transition-colors">{tNav("shop")}</Link>
        {categoryName && product.category && (
          <>
            <span>/</span>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-ink transition-colors">
              {categoryName}
            </Link>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-8 md:gap-14 items-start">
        <div className="animate-fade">
          <ProductGallery
            images={product.images}
            alt={name}
            noImageLabel={tCommon("noImage")}
            badge={hasDiscount ? `-${product.discountPercent}%` : undefined}
          />
        </div>

        <div className="md:sticky md:top-24">
          {categoryName && (
            <p className="text-ink/50 text-sm mb-2 animate-rise" style={{ animationDelay: "80ms" }}>
              {categoryName}
            </p>
          )}
          <h1
            className="font-display text-3xl md:text-4xl text-ink leading-tight mb-4 animate-rise"
            style={{ animationDelay: "140ms" }}
          >
            {name}
          </h1>
          <div className="flex items-baseline gap-3 mb-2 animate-rise" style={{ animationDelay: "200ms" }}>
            <span className="text-2xl font-medium text-ink">{formatPrice(finalPrice)}</span>
            {hasDiscount && <span className="text-ink/40 line-through">{formatPrice(product.price)}</span>}
          </div>
          <p className="text-sm mb-7 animate-rise flex items-center gap-2" style={{ animationDelay: "240ms" }}>
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
            {product.stock > 0 ? (
              <span className="text-ink/70">{t("inStock")}</span>
            ) : (
              <span className="text-red-700">{t("outOfStock")}</span>
            )}
          </p>

          <div className="animate-rise" style={{ animationDelay: "300ms" }}>
            <AddToCartButton
              product={{ id: product.id, name, price: finalPrice, image: product.images[0], stock: product.stock }}
            />
          </div>

          <div className="mt-8 border-t border-line animate-rise" style={{ animationDelay: "380ms" }}>
            <Details title={t("description")} open>
              <p className="whitespace-pre-line">{description}</p>
            </Details>
            <Details title={t("delivery")}>
              <p className="flex items-start gap-2.5 mb-2">
                <Truck size={16} className="mt-1 shrink-0 text-brand-700" /> {t("deliveryText")}
              </p>
              <p className="flex items-start gap-2.5">
                <BadgeCheck size={16} className="mt-1 shrink-0 text-brand-700" /> {t("authenticText")}
              </p>
            </Details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 md:mt-28">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl text-ink mb-6 md:mb-8">{t("related")}</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/shop" className="btn-secondary">
              {tHome("viewAll")}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
