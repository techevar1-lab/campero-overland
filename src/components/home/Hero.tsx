import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("HomePage.Hero");

  return (
    <section className="relative isolate overflow-hidden bg-green-deep text-cream">
      {/* Sol ocre decorativo (top-right) */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-8 top-8 h-16 w-16 rounded-full bg-ochre opacity-90 md:right-20 md:top-15 md:h-24 md:w-24"
      />

      {/* Montañas SVG (bottom) */}
      <svg
        aria-hidden
        viewBox="0 0 1200 340"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[340px] w-full opacity-40"
      >
        <polygon
          points="0,340 0,200 160,80 320,180 480,40 640,160 800,60 960,180 1120,80 1200,140 1200,340"
          fill="var(--color-green-light)"
        />
        <polygon
          points="0,340 0,260 200,160 380,240 580,180 780,220 980,140 1200,200 1200,340"
          fill="var(--color-green-medium)"
        />
        <polygon
          points="0,340 0,290 180,250 400,290 620,260 840,280 1060,250 1200,270 1200,340"
          fill="var(--color-green-deep)"
        />
      </svg>

      {/* Contenido principal */}
      <div className="relative mx-auto flex min-h-[540px] w-full max-w-7xl flex-col justify-center px-6 py-20 sm:px-12 lg:px-20">
        <div className="max-w-xl">
          <p className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
            <span aria-hidden className="inline-block h-px w-8 bg-ochre" />
            {t("label")}
          </p>

          <h1 className="mb-7 font-serif text-5xl leading-none tracking-[-1.5px] text-cream sm:text-6xl">
            {t.rich("title", {
              em: (chunks) => (
                <em className="italic text-ochre">{chunks}</em>
              ),
              br: () => <br />,
            })}
          </h1>

          <p className="mb-9 max-w-md font-sans text-[15px] leading-[1.6] text-cream/75">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="/configurador"
              className="inline-flex items-center justify-center bg-ochre px-8 py-[15px] font-sans text-[13px] font-medium tracking-[0.5px] text-cream transition-colors hover:bg-ochre-dark"
            >
              {t("ctaPrimary")}
            </Link>
            <a
              href="#sistema"
              className="inline-flex items-center justify-center border-[0.5px] border-cream/50 bg-transparent px-8 py-[15px] font-sans text-[13px] font-medium tracking-[0.5px] text-cream transition-colors hover:bg-cream/5"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>

        {/* Stats (bottom-right en desktop, debajo del contenido en mobile) */}
        <dl className="mt-12 flex flex-wrap gap-9 lg:absolute lg:bottom-8 lg:right-20 lg:mt-0">
          <div>
            <dt className="mb-1.5 font-mono text-[9px] uppercase tracking-[2px] text-ochre">
              {t("statArmedLabel")}
            </dt>
            <dd className="font-serif text-3xl tracking-[-1px] text-cream">
              {t("statArmedValue")}
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-mono text-[9px] uppercase tracking-[2px] text-ochre">
              {t("statNoToolsLabel")}
            </dt>
            <dd className="font-serif text-3xl italic tracking-[-1px] text-cream">
              {t("statNoToolsValue")}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
