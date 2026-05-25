"use client";

import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import { StepHeader } from "@/components/configurador/StepHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import materialesData from "@data/materiales.json";
import { useConfigurator } from "@/lib/configurator/context";
import type { MaterialId } from "@/lib/configurator/types";

type Material = (typeof materialesData.materials)[number];
type BadgeVariant = "eco" | "premium";

function MaterialCard({
  material,
  selected,
  onSelect,
}: {
  material: Material;
  selected: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations("Configurator.step4");
  const variant = material.badge.variant as BadgeVariant;

  // Si hay descuento sobre el precio base del mobiliario, lo mostramos
  // como pista cerca del badge. (priceMultiplier 1 = sin cambio)
  const discountPercent =
    material.priceMultiplier < 1
      ? Math.round((1 - material.priceMultiplier) * 100)
      : 0;

  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <Card
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      selected={selected}
      onClick={onSelect}
      onKeyDown={handleKey}
      className="flex cursor-pointer flex-col gap-3 transition-colors hover:border-green-deep/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-serif text-lg leading-[1.3] text-green-deep">
            {material.name}
          </p>
          <p className="mt-1 font-sans text-[13px] leading-[1.5] text-ink-soft">
            {material.shortDescription}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge variant={variant}>{material.badge.text}</Badge>
          {discountPercent > 0 ? (
            <span className="font-mono text-[10px] uppercase tracking-[1px] text-ochre">
              {t("discountHint", { percent: discountPercent })}
            </span>
          ) : null}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t-[0.5px] border-green-deep/10 pt-3">
        <Attribute label={t("labels.weight")} value={material.attributes.weight} />
        <Attribute
          label={t("labels.aesthetic")}
          value={material.attributes.aesthetic}
        />
      </dl>
    </Card>
  );
}

function Attribute({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[9px] uppercase tracking-[2px] text-ink-soft">
        {label}
      </dt>
      <dd className="font-sans text-[13px] text-green-deep">{value}</dd>
    </div>
  );
}

export function Step4Material() {
  const t = useTranslations("Configurator.step4");
  const { state, dispatch } = useConfigurator();

  return (
    <>
      <StepHeader question={t("question")} helper={t("helper")} />

      <div
        role="radiogroup"
        aria-label={t("question")}
        className="flex flex-col gap-2"
      >
        {materialesData.materials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            selected={state.material === material.id}
            onSelect={() =>
              dispatch({
                type: "SET_MATERIAL",
                material: material.id as MaterialId,
              })
            }
          />
        ))}
      </div>
    </>
  );
}
