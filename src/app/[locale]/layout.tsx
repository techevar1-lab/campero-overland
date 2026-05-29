import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { siteUrl } from "@/lib/env";
import { routing } from "@/i18n/routing";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Campero Overland — Camper portátil para SUV overland",
  description:
    "Mobiliario portátil de camperización para SUV overland. Sistema de ensambles sin tornillos. Diseñado en Pucón, Chile.",
  openGraph: {
    siteName: "Campero Overland",
    locale: "es_CL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04342C",
};

/**
 * JSON-LD Organization (schema.org). Lo lee Google para el panel de marca
 * y rich results. Imágenes/redes sociales se agregan cuando estén.
 */
const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Campero Overland",
  url: siteUrl(),
  logo: `${siteUrl().replace(/\/$/, "")}/icon.png`,
  email: "hola@camperooverland.cl",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pucón",
    addressRegion: "La Araucanía",
    addressCountry: "CL",
  },
} as const;

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
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("Navigation");

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          // JSON-LD estático, contenido seguro (sin entrada de usuario).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <NextIntlClientProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ochre focus:px-4 focus:py-2 focus:font-sans focus:text-[13px] focus:text-cream"
          >
            {t("skipToContent")}
          </a>
          <Header />
          <main id="main-content" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
