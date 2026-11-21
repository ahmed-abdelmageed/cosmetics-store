import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const columns = [
    {
      title: t("shop"),
      links: [
        { href: "/shop", label: tNav("shop") },
        { href: "/shop?gender=women", label: tNav("women") },
        { href: "/shop?gender=men", label: tNav("men") },
        { href: "/shop?onSale=1", label: tNav("offers") },
      ],
    },
    {
      title: t("account"),
      links: [
        { href: "/login", label: t("signIn") },
        { href: "/register", label: t("register") },
        { href: "/cart", label: t("cart") },
      ],
    },
  ];

  return (
    <footer className="bg-cream border-t border-line mt-auto">
      <div className="container-app py-12 md:py-16 grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1.4fr] gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-2xl text-ink">Lumière</span>
          <p className="text-ink/60 text-sm leading-6 mt-3 max-w-xs">{t("tagline")}</p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-ink mb-4">{col.title}</h4>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink/65 hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-1">
          <h4 className="text-sm font-semibold text-ink mb-4">{t("contact")}</h4>
          <ul className="space-y-2.5 text-sm text-ink/65">
            <li>
              <a href="mailto:support@lumiere-cosmetics.com" className="hover:text-ink">
                support@lumiere-cosmetics.com
              </a>
            </li>
            <li>
              <a href="tel:01000000000" className="hover:text-ink" dir="ltr">
                01000000000
              </a>
            </li>
            <li className="pt-1 text-ink/50">{t("cod")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-app py-5 text-xs text-ink/50">
          © {new Date().getFullYear()} Lumière Cosmetics. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
