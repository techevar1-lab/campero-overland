"use client";

import { useTranslations } from "next-intl";
import { AccessoryGroup } from "@/components/configurador/AccessoryGroup";
import { StepHeader } from "@/components/configurador/StepHeader";
import accesoriosData from "@data/accesorios.json";
import { useConfigurator } from "@/lib/configurator/context";
import type { AddonGroup } from "@/lib/configurator/types";

export function Step5Accessories() {
  const t = useTranslations("Configurator.step5");
  const { state, dispatch } = useConfigurator();

  const noneSelected = Object.values(state.addons).every((v) => v === null);

  return (
    <>
      <StepHeader question={t("question")} helper={t("helper")} />

      <div className="space-y-10">
        {accesoriosData.groups.map((group) => (
          <AccessoryGroup
            key={group.id}
            group={group}
            selectedVariantId={state.addons[group.id as AddonGroup]}
            onChange={(variantId) =>
              dispatch({
                type: "SET_ADDON",
                group: group.id as AddonGroup,
                variantId,
              })
            }
          />
        ))}
      </div>

      {noneSelected ? (
        <p className="mt-8 font-sans text-[13px] leading-[1.5] text-ochre">
          {t("skipWarning")}
        </p>
      ) : null}
    </>
  );
}
