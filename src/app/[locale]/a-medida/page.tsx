import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { CustomDesignForm } from "@/components/a-medida/CustomDesignForm";

type Params = { locale: string };

const STEPS = [
  { orderKey: "s1Order", titleKey: "s1Title", bodyKey: "s1Body" },
  { orderKey: "s2Order", titleKey: "s2Title", bodyKey: "s2Body" },
  { orderKey: "s3Order", titleKey: "s3Title", bodyKey: "s3Body" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("CustomDesign.hero");
  return {
    title: "Campero a medida · Campero Overland",
    description: t("subtitle"),
  };
}

export default async function AMedidaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("CustomDesign.hero");

  return (
    <article>
      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-20 sm:px-12 lg:px-20">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
            {t("label")}
          </p>
          <h1 className="mb-6 font-serif text-4xl leading-[1.1] tracking-[-0.5px] text-green-deep sm:text-[44px]">
            {t.rich("title", {
              em: (chunks) => <em className="italic text-ochre">{chunks}</em>,
            })}
          </h1>
          <p className="font-sans text-[17px] leading-[1.6] text-ink-soft">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="border-y-[0.5px] border-green-deep/10 bg-ochre-soft">
        <div className="mx-auto max-w-5xl px-6 py-12 sm:px-12 lg:px-20">
          <p className="mb-8 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
            {t("stepsLabel")}
          </p>
          <ol className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.orderKey}>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[2px] text-ochre">
                  {t(`steps.${step.orderKey}` as never)}
                </p>
                <h2 className="mb-2 font-serif text-xl leading-[1.2] text-green-deep">
                  {t(`steps.${step.titleKey}` as never)}
                </h2>
                <p className="font-sans text-[14px] leading-[1.6] text-ink-soft">
                  {t(`steps.${step.bodyKey}` as never)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-2xl px-6 py-16 sm:px-12 lg:px-20">
          <Suspense fallback={null}>
            <CustomDesignForm />
          </Suspense>
        </div>
      </section>
    </article>
  );
}
