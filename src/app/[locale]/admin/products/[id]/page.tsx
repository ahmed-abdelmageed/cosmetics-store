import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import ProductForm from "@/components/admin/product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("admin");
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
  ]);
  if (!product) return notFound();

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-[13px] text-ink/55 hover:text-ink mb-3">
        <ChevronLeft size={15} className="rtl:rotate-180" /> {t("products")}
      </Link>
      <h1 className="text-2xl font-semibold text-ink mb-6">{t("editProduct")}</h1>
      <ProductForm categories={categories} initial={product} />
    </div>
  );
}
