import { useTranslations } from "next-intl";

function StageCase() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 140"
      className="h-32 w-auto text-green-deep"
    >
      <rect
        x="30"
        y="38"
        width="140"
        height="78"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="30"
        y="62"
        width="140"
        height="2"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M82 38 V24 H118 V38"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="100" cy="89" r="2.4" fill="currentColor" opacity="0.6" />
      <rect
        x="148"
        y="84"
        width="14"
        height="10"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.45"
      />
    </svg>
  );
}

function StagePieces() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 140"
      className="h-32 w-auto text-green-deep"
    >
      {/* Panel base */}
      <polygon
        points="40,108 160,108 178,124 22,124"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {/* Panel pared trasera */}
      <polygon
        points="40,108 160,108 160,72 40,72"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.85"
      />
      {/* Panel divisor flotando */}
      <polygon
        points="60,56 140,56 140,42 60,42"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.55"
      />
      {/* Panel tapa flotando */}
      <polygon
        points="50,26 150,26 150,16 50,16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.35"
      />
      {/* Líneas guía de ensamble */}
      <line
        x1="100"
        y1="30"
        x2="100"
        y2="42"
        stroke="var(--color-ochre)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <line
        x1="100"
        y1="60"
        x2="100"
        y2="72"
        stroke="var(--color-ochre)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

function StageAssembled() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 140"
      className="h-32 w-auto text-green-deep"
    >
      {/* Caja base con perspectiva isométrica */}
      <polygon
        points="36,114 132,114 164,98 68,98"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <polygon
        points="36,114 36,52 68,36 68,98"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <polygon
        points="36,52 132,52 164,36 68,36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <polygon
        points="132,114 132,52 164,36 164,98"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {/* Compartimentos en la cara superior */}
      <line
        x1="68"
        y1="68"
        x2="132"
        y2="68"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="100"
        y1="36"
        x2="100"
        y2="98"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Acentos ocres: compartimentos con accesorio */}
      <rect
        x="70"
        y="38"
        width="28"
        height="28"
        fill="var(--color-ochre)"
        opacity="0.18"
      />
      <rect
        x="102"
        y="70"
        width="28"
        height="26"
        fill="var(--color-ochre)"
        opacity="0.18"
      />
    </svg>
  );
}

export function Sistema() {
  const t = useTranslations("HomePage.Sistema");

  const stages = [
    { num: "01", label: t("stage1Label"), title: t("stage1Title"), body: t("stage1Body"), Svg: StageCase },
    { num: "02", label: t("stage2Label"), title: t("stage2Title"), body: t("stage2Body"), Svg: StagePieces },
    { num: "03", label: t("stage3Label"), title: t("stage3Title"), body: t("stage3Body"), Svg: StageAssembled },
  ];

  return (
    <section
      id="sistema"
      className="scroll-mt-20 border-t-[0.5px] border-green-deep/10 bg-cream"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-12 lg:px-20">
        <header className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
            {t("label")}
          </p>
          <h2 className="mb-5 font-serif text-4xl leading-[1.15] tracking-[-0.5px] text-green-deep sm:text-[40px]">
            {t.rich("title", {
              em: (chunks) => <em className="italic text-ochre">{chunks}</em>,
            })}
          </h2>
          <p className="font-sans text-[15px] leading-[1.6] text-ink-soft">
            {t("subtitle")}
          </p>
        </header>

        <ol className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {stages.map((stage) => (
            <li key={stage.num} className="flex flex-col">
              <div className="mb-6 flex h-40 items-end justify-center border-b-[0.5px] border-green-deep/10 pb-2">
                <stage.Svg />
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[2px] text-ochre">
                  {stage.num}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[2px] text-ink-soft">
                  {stage.label}
                </span>
              </div>
              <h3 className="mb-3 mt-2 font-serif text-[22px] leading-[1.2] text-green-deep">
                {stage.title}
              </h3>
              <p className="font-sans text-[13px] leading-[1.65] text-ink-soft">
                {stage.body}
              </p>
            </li>
          ))}
        </ol>

        <dl className="mt-16 grid grid-cols-3 gap-6 border-t-[0.5px] border-green-deep/10 pt-10 text-center">
          <div>
            <dt className="mb-1.5 font-mono text-[9px] uppercase tracking-[2px] text-ochre">
              {t("statTimeLabel")}
            </dt>
            <dd className="font-serif text-2xl tracking-[-0.5px] text-green-deep">
              {t("statTimeValue")}
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-mono text-[9px] uppercase tracking-[2px] text-ochre">
              {t("statToolsLabel")}
            </dt>
            <dd className="font-serif text-2xl tracking-[-0.5px] text-green-deep">
              {t("statToolsValue")}
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 font-mono text-[9px] uppercase tracking-[2px] text-ochre">
              {t("statReversibleLabel")}
            </dt>
            <dd className="font-serif text-2xl tracking-[-0.5px] text-green-deep">
              {t("statReversibleValue")}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
