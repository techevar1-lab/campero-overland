import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

type RouteParams = { locale: string };

const SECTIONS = [
  "provider",
  "acceptance",
  "products",
  "order",
  "payment",
  "billing",
  "manufacturing",
  "shipping",
  "rightOfWithdrawal",
  "warranty",
  "liability",
  "changes",
  "jurisdiction",
  "contact",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal.terms");
  return {
    title: `${t("title")} · Campero Overland`,
    description: t("intro"),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal");

  return (
    <LegalPage
      title={t("terms.title")}
      intro={t("terms.intro")}
      lastUpdate={t("lastUpdate")}
      draftNotice={t("draftNotice")}
    >
      {SECTIONS.map((section) => (
        <LegalSection
          key={section}
          title={t(`terms.sections.${section}Title` as never)}
        >
          {t(`terms.sections.${section}Body` as never)}
        </LegalSection>
      ))}
    </LegalPage>
  );
}
