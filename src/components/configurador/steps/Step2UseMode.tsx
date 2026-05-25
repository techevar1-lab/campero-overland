"use client";

import { useTranslations } from "next-intl";
import { OptionCard } from "@/components/configurador/OptionCard";
import { StepHeader } from "@/components/configurador/StepHeader";
import { useConfigurator } from "@/lib/configurator/context";
import type { UseMode } from "@/lib/configurator/types";

const USE_OPTIONS: { id: UseMode; titleKey: string; subKey: string }[] = [
  { id: "outside", titleKey: "outside", subKey: "outsideSub" },
  { id: "inside", titleKey: "inside", subKey: "insideSub" },
];

export function Step2UseMode() {
  const t = useTranslations("Configurator.step2");
  const { state, dispatch } = useConfigurator();

  return (
    <>
      <StepHeader question={t("question")} helper={t("helper")} />

      <div
        role="radiogroup"
        aria-label={t("question")}
        className="flex flex-col gap-2"
      >
        {USE_OPTIONS.map((option) => (
          <OptionCard
            key={option.id}
            title={t(`options.${option.titleKey}`)}
            subtitle={t(`options.${option.subKey}`)}
            selected={state.use === option.id}
            onSelect={() => dispatch({ type: "SET_USE", use: option.id })}
          />
        ))}
      </div>
    </>
  );
}
