import { useTranslations } from "next-intl";

const TOTAL_STEPS = 6;

type ProgressBarProps = {
  currentStep: number;
  onStepSelect?: (step: number) => void;
};

export function ProgressBar({ currentStep, onStepSelect }: ProgressBarProps) {
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
          const oneIndexed = i + 1;
          const reached = oneIndexed <= currentStep;
          const isCurrent = oneIndexed === currentStep;
          const canSelect = reached && !isCurrent && Boolean(onStepSelect);

          if (canSelect) {
            return (
              <button
                key={i}
                type="button"
                onClick={() => onStepSelect?.(i)}
                aria-label={t("goTo", {
                  step: oneIndexed,
                  total: TOTAL_STEPS,
                })}
                className="group flex h-4 flex-1 cursor-pointer items-center bg-transparent p-0"
              >
                <span className="block h-0.5 w-full bg-ochre transition-opacity group-hover:opacity-60" />
              </button>
            );
          }

          return (
            <div
              key={i}
              aria-hidden
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
