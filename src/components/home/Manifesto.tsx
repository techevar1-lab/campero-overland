import { useTranslations } from "next-intl";

export function Manifesto() {
  const t = useTranslations("HomePage.Manifesto");

  return (
    <section>
      <div className="mx-auto max-w-[680px] px-6 pb-[60px] pt-20 text-center sm:px-12 lg:px-20">
        <p className="mb-[18px] font-mono text-[10px] uppercase tracking-[3px] text-ochre">
          {t("label")}
        </p>
        <blockquote className="mb-6 font-serif text-[26px] italic leading-[1.4] text-green-deep">
          &ldquo;{t("quote")}&rdquo;
        </blockquote>
        <p className="font-sans text-[11px] uppercase tracking-[2px] text-ink-soft">
          {t("author")}
        </p>
      </div>
    </section>
  );
}
