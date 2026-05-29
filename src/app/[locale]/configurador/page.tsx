import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConfiguratorClient } from "@/components/configurador/ConfiguratorClient";
import { ConfiguratorProvider } from "@/lib/configurator/context";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Configurator");
  return {
    title: "Configurador · Campero Overland",
    description: t("metaDescription"),
  };
}

export default function ConfiguradorPage() {
  return (
    <ConfiguratorProvider>
      <ConfiguratorClient />
    </ConfiguratorProvider>
  );
}
