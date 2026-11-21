import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import SlidesManager from "@/components/admin/slides-manager";

export const dynamic = "force-dynamic";

export default async function AdminSlidesPage() {
  const t = await getTranslations("admin");
  const slides = await prisma.slide.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-6">{t("slides")}</h1>
      <SlidesManager slides={slides} />
    </div>
  );
}
