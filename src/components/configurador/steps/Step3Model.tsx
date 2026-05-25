"use client";

import { useTranslations } from "next-intl";
import { OptionCard } from "@/components/configurador/OptionCard";
import { StepHeader } from "@/components/configurador/StepHeader";
import { useConfigurator } from "@/lib/configurator/context";
import { getEffectiveModel } from "@/lib/configurator/state";
import { formatPrice, type Price } from "@/lib/format";

export function Step3Model() {
  const t = useTranslations("Configurator.step3");
  const { state, totals, dispatch } = useConfigurator();

  // totals usa el modelo efectivo, así que `product` está disponible
  // apenas hay vehicle + use seleccionados.
  const product = totals?.product;

  if (!product) {
    return (
      <>
        <StepHeader question={t("question")} helper={t("helper")} />
        <p className="font-sans text-sm text-ink-soft">
          Define vehículo y modo de viaje primero.
        </p>
      </>
    );
  }

  const isSelected = getEffectiveModel(state) === product.id;

  return (
    <>
      <StepHeader question={t("question")} helper={t("helper")} />

      <div
        role="radiogroup"
        aria-label={t("question")}
        className="flex flex-col gap-2"
      >
        <OptionCard
          title={product.title}
          subtitle={product.description}
          selected={isSelected}
          onSelect={() =>
            dispatch({ type: "SET_MODEL", modelId: product.id })
          }
          badge={
            <span className="font-mono text-[12px] tracking-[0.5px] text-ochre">
              {formatPrice(product.price as Price)}
            </span>
          }
        />
      </div>
    </>
  );
}
