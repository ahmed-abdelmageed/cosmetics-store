import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);
const locales = routing.locales as readonly string[];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const hasLocalePrefix = locales.includes(segments[0]);
  const locale = hasLocalePrefix ? segments[0] : routing.defaultLocale;
  const pathWithoutLocale = "/" + segments.slice(hasLocalePrefix ? 1 : 0).join("/");

  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as { role?: string } | undefined)?.role;

  if (pathWithoutLocale.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/${locale}/login?callbackUrl=/${locale}/admin`, req.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  if (pathWithoutLocale.startsWith("/checkout")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/${locale}/login?callbackUrl=/${locale}/checkout`, req.url));
    }
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
