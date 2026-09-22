import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Package, ShoppingBag, Images, Tags } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const t = await getTranslations("admin");
  const [productsCount, ordersCount, slidesCount, categoriesCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.slide.count(),
    prisma.category.count(),
  ]);

  const cards = [
    { label: t("products"), value: productsCount, icon: Package },
    { label: t("orders"), value: ordersCount, icon: ShoppingBag },
    { label: t("slides"), value: slidesCount, icon: Images },
    { label: t("categories"), value: categoriesCount, icon: Tags },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("overview")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-neutral-200 rounded-xl p-5">
            <c.icon className="text-amber-600 mb-2" />
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
