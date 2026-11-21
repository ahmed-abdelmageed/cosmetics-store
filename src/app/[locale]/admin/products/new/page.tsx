import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import ProductForm from "@/components/admin/product-form";

export default async function NewProductPage() {
  const t = await getTranslations("admin");
  const categories = await prisma.category.findMany({ orderBy: { nameEn: "asc" } });
  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-[13px] text-ink/55 hover:text-ink mb-3">
        <ChevronLeft size={15} className="rtl:rotate-180" /> {t("products")}
      </Link>
      <h1 className="text-2xl font-semibold text-ink mb-6">{t("newProduct")}</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
