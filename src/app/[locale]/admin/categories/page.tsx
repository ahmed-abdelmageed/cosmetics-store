import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import CategoriesManager from "@/components/admin/categories-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const t = await getTranslations("admin");
  const categories = await prisma.category.findMany({
    orderBy: { nameEn: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-ink mb-6">{t("categories")}</h1>
      <CategoriesManager categories={categories} />
    </div>
  );
}
