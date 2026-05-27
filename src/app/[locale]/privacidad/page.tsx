import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

type RouteParams = { locale: string };

const SECTIONS = [
  "who",
  "data",
  "use",
  "share",
  "cookies",
  "retention",
  "rights",
  "minors",
  "security",
  "changes",
  "contact",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal.privacy");
  return {
    title: `${t("title")} · Campero Overland`,
    description: t("intro"),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal");

  return (
    <LegalPage
      title={t("privacy.title")}
      intro={t("privacy.intro")}
      lastUpdate={t("lastUpdate")}
      draftNotice={t("draftNotice")}
    >
      {SECTIONS.map((section) => (
        <LegalSection
          key={section}
          title={t(`privacy.sections.${section}Title` as never)}
        >
          {t(`privacy.sections.${section}Body` as never)}
        </LegalSection>
      ))}
    </LegalPage>
  );
}
