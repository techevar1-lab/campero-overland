import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function AMedida() {
  const t = useTranslations("HomePage.CustomDesign");

  const bullets = [t("bullet1"), t("bullet2"), t("bullet3")];

  return (
    <section className="border-t-[0.5px] border-green-deep/10 bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 sm:px-12 lg:grid-cols-2 lg:gap-[60px] lg:px-20">
        <div>
          <p className="mb-[18px] font-mono text-[10px] uppercase tracking-[3px] text-ochre">
            {t("label")}
          </p>
          <h2 className="mb-[18px] font-serif text-[36px] leading-[1.15] tracking-[-0.5px] text-green-deep">
            {t.rich("title", {
              em: (chunks) => <em className="italic text-ochre">{chunks}</em>,
              br: () => <br />,
            })}
          </h2>
          <p className="font-sans text-sm leading-[1.65] text-ink-soft">
            {t("body")}
          </p>
        </div>

        <div className="rounded-sm border-[0.5px] border-green-deep/15 bg-cream-pure p-8">
          <ul className="space-y-3.5">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <Check
                  aria-hidden
                  width={18}
                  height={18}
                  strokeWidth={1.6}
                  className="mt-0.5 shrink-0 text-ochre"
                />
                <span className="font-sans text-[14px] leading-[1.5] text-green-deep">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/a-medida"
            className="mt-7 inline-flex items-center justify-center bg-ochre px-8 py-[15px] font-sans text-[13px] font-medium tracking-[0.5px] text-cream transition-colors hover:bg-ochre-dark"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
