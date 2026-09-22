import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="bg-neutral-900 text-neutral-50 mt-16">
      <div className="container-app py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-2">Lumière Cosmetics</h3>
          <p className="text-neutral-300 text-sm leading-6">{t("tagline")}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t("quickLinks")}</h4>
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>{tNav("home")}</li>
            <li>{tNav("shop")}</li>
            <li>{tNav("offers")}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t("contact")}</h4>
          <p className="text-sm text-neutral-300">support@lumiere-cosmetics.com</p>
          <p className="text-sm text-neutral-300">01000000000</p>
        </div>
      </div>
      <div className="text-center text-xs text-neutral-400 py-4 border-t border-neutral-800">
        © {new Date().getFullYear()} Lumière Cosmetics. {t("rights")}
      </div>
    </footer>
  );
}
