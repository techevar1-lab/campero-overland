"use client";

import { useTranslations } from "next-intl";
import { OptionCard } from "@/components/configurador/OptionCard";
import { StepHeader } from "@/components/configurador/StepHeader";
import { Link } from "@/i18n/navigation";
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

        {state.vehicle === "other" ? (
          <Link
            href="/a-medida?from=configurador-go"
            className="group flex items-start justify-between gap-4 rounded-sm border-[0.5px] border-green-deep/15 bg-cream-pure p-5 transition-colors hover:border-green-deep/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre"
          >
            <div className="flex-1">
              <p className="font-serif text-lg leading-[1.3] text-green-deep">
                {t("bespokeTitle")}
              </p>
              <p className="mt-1 font-sans text-[13px] leading-[1.5] text-ink-soft">
                {t("bespokeSubtitle")}
              </p>
            </div>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[1px] text-ochre transition-colors group-hover:text-green-deep">
              {t("bespokeBadge")}
            </span>
          </Link>
        ) : null}
      </div>

      {state.vehicle !== "other" ? (
        <div className="mt-4 border-t-[0.5px] border-green-deep/10 pt-4">
          <Link
            href={`/a-medida?from=configurador&type=modify&model=${product.id}`}
            className="font-mono text-[10px] uppercase tracking-[1.5px] text-ochre transition-colors hover:text-green-deep focus-visible:underline focus-visible:outline-none"
          >
            {t("resizeCta")}
          </Link>
          <p className="mt-1.5 font-sans text-[12px] leading-[1.5] text-ink-soft">
            {t("resizeHelper")}
          </p>
        </div>
      ) : null}
    </>
  );
}
