import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CtaFinal() {
  const t = useTranslations("HomePage.CtaFinal");

  return (
    <section className="bg-green-deep text-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-12 lg:px-20">
        <p className="mb-3.5 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
          {t("label")}
        </p>
        <h2 className="mb-4 font-serif text-[36px] leading-[1.15] tracking-[-0.5px] text-cream">
          {t.rich("title", {
            em: (chunks) => <em className="italic text-ochre">{chunks}</em>,
            br: () => <br />,
          })}
        </h2>
        <p className="mx-auto mb-8 max-w-[480px] font-sans text-sm leading-[1.65] text-cream/70">
          {t("subtitle")}
        </p>
        <Link
          href="/configurador"
          className="inline-flex items-center justify-center bg-ochre px-9 py-4 font-sans text-[13px] font-medium tracking-[0.5px] text-cream transition-colors hover:bg-ochre-dark"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
