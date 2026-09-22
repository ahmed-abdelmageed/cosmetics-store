import { prisma } from "@/lib/prisma";
import CategoriesManager from "@/components/admin/categories-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { nameEn: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <CategoriesManager categories={categories} />
    </div>
  );
}
