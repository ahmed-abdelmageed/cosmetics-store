import type { Metadata } from "next";
import { Cairo, Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import Providers from "@/components/providers";

const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: {
    default: "Lumière Cosmetics — Authentic Beauty & Skincare",
    template: "%s · Lumière Cosmetics",
  },
  description:
    "Shop authentic cosmetics, skincare and fragrances for him and her. Daily offers, fast delivery and cash on delivery.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const isAr = locale === "ar";
  const fonts = {
    fontFamily: isAr ? "var(--font-cairo)" : "var(--font-inter)",
    "--font-display-family": isAr ? "var(--font-cairo)" : "var(--font-playfair)",
  } as React.CSSProperties;

  return (
    <html
      lang={locale}
      dir={isAr ? "rtl" : "ltr"}
      className={`${cairo.variable} ${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground" style={fonts}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
