"use client";

import { useTranslations } from "next-intl";
import { OptionCard } from "@/components/configurador/OptionCard";
import { StepHeader } from "@/components/configurador/StepHeader";
import { useConfigurator } from "@/lib/configurator/context";
import type { Vehicle } from "@/lib/configurator/types";

const VEHICLE_OPTIONS: { id: Vehicle; titleKey: string; subKey: string }[] = [
  { id: "jimny3", titleKey: "jimny3", subKey: "jimny3Sub" },
  { id: "jimny5", titleKey: "jimny5", subKey: "jimny5Sub" },
  { id: "other", titleKey: "other", subKey: "otherSub" },
];

export function Step1Vehicle() {
  const t = useTranslations("Configurator.step1");
  const { state, dispatch } = useConfigurator();

  return (
    <>
      <StepHeader question={t("question")} helper={t("helper")} />

      <div
        role="radiogroup"
        aria-label={t("question")}
        className="flex flex-col gap-2"
      >
        {VEHICLE_OPTIONS.map((option) => (
          <OptionCard
            key={option.id}
            title={t(`options.${option.titleKey}`)}
            subtitle={t(`options.${option.subKey}`)}
            selected={state.vehicle === option.id}
            onSelect={() =>
              dispatch({ type: "SET_VEHICLE", vehicle: option.id })
            }
          />
        ))}
      </div>
    </>
  );
}
