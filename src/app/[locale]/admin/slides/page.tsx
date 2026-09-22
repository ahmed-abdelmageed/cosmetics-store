import { prisma } from "@/lib/prisma";
import SlidesManager from "@/components/admin/slides-manager";

export const dynamic = "force-dynamic";

export default async function AdminSlidesPage() {
  const slides = await prisma.slide.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Homepage Slider</h1>
      <SlidesManager slides={slides} />
    </div>
  );
}
