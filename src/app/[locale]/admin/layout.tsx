import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { LayoutDashboard, Package, Images, ShoppingBag, Tags } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("admin");

  const links = [
    { href: "/admin", label: t("overview"), icon: LayoutDashboard },
    { href: "/admin/products", label: t("products"), icon: Package },
    { href: "/admin/categories", label: t("categories"), icon: Tags },
    { href: "/admin/slides", label: t("slides"), icon: Images },
    { href: "/admin/orders", label: t("orders"), icon: ShoppingBag },
  ];

  return (
    <div className="container-app py-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
      <aside className="bg-white border border-neutral-200 rounded-2xl p-4 h-fit">
        <h2 className="font-bold text-amber-700 mb-4 px-2">{t("dashboard")}</h2>
        <nav className="flex md:flex-col gap-1 flex-wrap">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50"
            >
              <l.icon size={18} />
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
