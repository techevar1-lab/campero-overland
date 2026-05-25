import { useTranslations } from "next-intl";

const TOTAL_STEPS = 6;

export function ProgressBar({ currentStep }: { currentStep: number }) {
  const t = useTranslations("Configurator.progress");

  return (
    <div className="w-full">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
        {t("label", { current: currentStep, total: TOTAL_STEPS })}
      </p>
      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-label={t("label", {
          current: currentStep,
          total: TOTAL_STEPS,
        })}
        className="flex gap-1.5"
      >
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const reached = i + 1 <= currentStep;
          return (
            <div
              key={i}
              className={`h-0.5 flex-1 transition-colors ${
                reached ? "bg-ochre" : "bg-green-deep/15"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
