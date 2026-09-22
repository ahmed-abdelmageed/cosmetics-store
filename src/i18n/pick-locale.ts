export function pickLocale<T extends string | null | undefined>(locale: string, en: T, ar: T): T {
  return locale === "ar" ? ar : en;
}
