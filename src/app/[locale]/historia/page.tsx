import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Params = { locale: string };

const BLOCKS = [
  { order: "01", titleKey: "originTitle", paragraphsKey: "originParagraphs" },
  { order: "02", titleKey: "systemTitle", paragraphsKey: "systemParagraphs" },
  { order: "03", titleKey: "processTitle", paragraphsKey: "processParagraphs" },
  { order: "04", titleKey: "southTitle", paragraphsKey: "southParagraphs" },
  { order: "05", titleKey: "bespokeTitle", paragraphsKey: "bespokeParagraphs" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("History");
  return {
    title: `Historia · Campero Overland`,
    description: t("subtitle"),
  };
}

export default async function HistoriaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("History");
  const tCta = await getTranslations("HomePage.CtaFinal");
  const tProduct = await getTranslations("Product");

  return (
    <article>
      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 pb-20 pt-20 sm:px-12 lg:px-20">
          <h1 className="mb-6 font-serif text-4xl leading-[1.1] tracking-[-0.5px] text-green-deep sm:text-[44px]">
            {t("title")}
          </h1>
          <p className="font-sans text-[17px] leading-[1.6] text-ink-soft">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* BLOQUES */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 sm:px-12 lg:px-20">
          {BLOCKS.map((block, i) => {
            const paragraphs = t.raw(`blocks.${block.paragraphsKey}`) as string[];
            const isLast = i === BLOCKS.length - 1;
            return (
              <section
                key={block.order}
                className={
                  isLast
                    ? "py-16"
                    : "border-b-[0.5px] border-green-deep/10 py-16"
                }
              >
                <header className="mb-8">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
                    {block.order}
                  </p>
                  <h2 className="font-serif text-3xl leading-[1.15] tracking-[-0.3px] text-green-deep sm:text-[32px]">
                    {t(`blocks.${block.titleKey}`)}
                  </h2>
                </header>
                <div className="space-y-5">
                  {paragraphs.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="font-sans text-[15px] leading-[1.65] text-ink"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-green-deep text-cream">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-12 lg:px-20">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
            {tCta("label")}
          </p>
          <h2 className="mb-8 font-serif text-[32px] leading-[1.15] tracking-[-0.5px] text-cream">
            {tCta.rich("title", {
              em: (chunks) => (
                <em className="italic text-ochre">{chunks}</em>
              ),
              br: () => <br />,
            })}
          </h2>
          <Link
            href="/configurador"
            className="inline-flex items-center justify-center bg-ochre px-9 py-4 font-sans text-[13px] font-medium tracking-[0.5px] text-cream transition-colors hover:bg-ochre-dark"
          >
            {tProduct("cta")}
          </Link>
        </div>
      </section>
    </article>
  );
}
