import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { formatPrice, getFinalPrice } from "@/lib/utils";
import { pickLocale } from "@/i18n/pick-locale";
import AddToCartButton from "@/components/add-to-cart-button";
import { Link } from "@/i18n/navigation";
import { ImageOff } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  if (!product) return notFound();

  const t = await getTranslations("product");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const name = pickLocale(locale, product.nameEn, product.nameAr);
  const description = pickLocale(locale, product.descriptionEn, product.descriptionAr);
  const categoryName = product.category
    ? pickLocale(locale, product.category.nameEn, product.category.nameAr)
    : null;
  const finalPrice = getFinalPrice(product.price, product.discountPercent, product.discountActive);
  const hasDiscount = product.discountActive && product.discountPercent > 0;

  return (
    <div className="container-app py-8 md:py-12">
      <nav className="text-xs text-ink/50 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-ink">{tNav("home")}</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ink">{tNav("shop")}</Link>
        {categoryName && product.category && (
          <>
            <span>/</span>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-ink">{categoryName}</Link>
          </>
        )}
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
      <div className="relative aspect-[4/5] bg-cream rounded-md overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-ink/25">
            <ImageOff size={32} />
            <span className="text-xs">{tCommon("noImage")}</span>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-4 start-4 bg-white text-brand-800 text-xs font-semibold px-2 py-1 rounded-[3px]">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      <div>
        {categoryName && (
          <p className="text-ink/50 text-sm mb-2">{categoryName}</p>
        )}
        <h1 className="font-display text-3xl md:text-4xl text-ink leading-tight mb-4">{name}</h1>
        <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-line">
          <span className="text-xl font-medium text-ink">{formatPrice(finalPrice)}</span>
          {hasDiscount && (
            <span className="text-ink/40 line-through">{formatPrice(product.price)}</span>
          )}
        </div>
        <p className="text-ink/70 leading-7 mb-6 whitespace-pre-line">{description}</p>
        <p className="text-sm mb-6">
          {product.stock > 0 ? (
            <span className="text-emerald-700">{t("inStock")} ({product.stock})</span>
          ) : (
            <span className="text-red-700">{t("outOfStock")}</span>
          )}
        </p>

        <AddToCartButton
          product={{
            id: product.id,
            name,
            price: finalPrice,
            image: product.images[0],
            stock: product.stock,
          }}
        />
      </div>
      </div>
    </div>
  );
}
