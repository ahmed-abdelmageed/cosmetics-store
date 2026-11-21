import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { pickLocale } from "@/i18n/pick-locale";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";
import DeleteProductButton from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const t = await getTranslations("admin");
  const locale = await getLocale();
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{t("products")}</h1>
          <p className="text-sm text-ink/50 mt-1">{t("productsCount", { count: products.length })}</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary !py-2 !px-4">
          <Plus size={16} /> {t("newProduct")}
        </Link>
      </div>

      <div className="card overflow-hidden">
        {products.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/50">{t("noProducts")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-ink/50 border-b border-line bg-ink/[0.015]">
                  <th className="text-start font-medium px-4 py-2.5">{t("name")}</th>
                  <th className="text-start font-medium px-4 py-2.5">{t("category")}</th>
                  <th className="text-start font-medium px-4 py-2.5">{t("collection")}</th>
                  <th className="text-end font-medium px-4 py-2.5">{t("price")}</th>
                  <th className="text-end font-medium px-4 py-2.5">{t("discount")}</th>
                  <th className="text-end font-medium px-4 py-2.5">{t("stock")}</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0 hover:bg-ink/[0.015]">
                    <td className="px-4 py-2.5">
                      <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded overflow-hidden bg-cream shrink-0">
                          {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />}
                        </div>
                        <span className="font-medium text-ink group-hover:underline underline-offset-4 line-clamp-1">
                          {pickLocale(locale, p.nameEn, p.nameAr)}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-ink/65">
                      {p.category ? pickLocale(locale, p.category.nameEn, p.category.nameAr) : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-ink/65">{t(`gender_${p.gender}`)}</td>
                    <td className="px-4 py-2.5 text-end tabular-nums whitespace-nowrap">{formatPrice(p.price)}</td>
                    <td className="px-4 py-2.5 text-end tabular-nums text-ink/65">
                      {p.discountActive && p.discountPercent > 0 ? `${p.discountPercent}%` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-end tabular-nums">
                      <span
                        className={
                          p.stock === 0 ? "text-red-700 font-medium" : p.stock <= 5 ? "text-brand-700 font-medium" : "text-ink/70"
                        }
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${p.id}`}
                          title={t("edit")}
                          className="p-1.5 rounded text-ink/50 hover:text-ink hover:bg-ink/5"
                        >
                          <Pencil size={15} />
                        </Link>
                        <DeleteProductButton id={p.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
