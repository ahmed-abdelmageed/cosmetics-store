import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { formatPrice, getFinalPrice } from "@/lib/utils";
import { pickLocale } from "@/i18n/pick-locale";
import AddToCartButton from "@/components/add-to-cart-button";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  if (!product) return notFound();

  const t = await getTranslations("product");
  const locale = await getLocale();
  const name = pickLocale(locale, product.nameEn, product.nameAr);
  const description = pickLocale(locale, product.descriptionEn, product.descriptionAr);
  const categoryName = product.category
    ? pickLocale(locale, product.category.nameEn, product.category.nameAr)
    : null;
  const finalPrice = getFinalPrice(product.price, product.discountPercent, product.discountActive);
  const hasDiscount = product.discountActive && product.discountPercent > 0;

  return (
    <div className="container-app py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="relative aspect-square bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">No image</div>
        )}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-amber-600 text-white text-sm font-bold px-3 py-1 rounded-full">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      <div>
        {categoryName && (
          <p className="text-neutral-500 text-sm font-medium mb-2">{categoryName}</p>
        )}
        <h1 className="text-3xl font-bold mb-3">{name}</h1>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-amber-700">{formatPrice(finalPrice)}</span>
          {hasDiscount && (
            <span className="text-gray-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>
        <p className="text-gray-600 leading-7 mb-6 whitespace-pre-line">{description}</p>
        <p className="text-sm mb-6">
          {product.stock > 0 ? (
            <span className="text-green-600 font-medium">{t("inStock")} ({product.stock})</span>
          ) : (
            <span className="text-red-600 font-medium">{t("outOfStock")}</span>
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
  );
}
