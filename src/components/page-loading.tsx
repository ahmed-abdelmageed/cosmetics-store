import { useTranslations } from "next-intl";
import Spinner from "./spinner";

export default function PageLoading() {
  const t = useTranslations("common");
  return (
    <div className="container-app py-24 flex flex-col items-center justify-center gap-3">
      <Spinner size={28} />
      <p className="text-ink/50 text-sm">{t("loading")}</p>
    </div>
  );
}
