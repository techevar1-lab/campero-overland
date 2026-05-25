"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { OptionCard } from "@/components/configurador/OptionCard";
import accesoriosData from "@data/accesorios.json";
import { formatPrice, type Price } from "@/lib/format";

type Group = (typeof accesoriosData.groups)[number];
type Variant = Group["variants"][number];

export function AccessoryGroup({
  group,
  selectedVariantId,
  onChange,
}: {
  group: Group;
  selectedVariantId: string | null;
  onChange: (variantId: string | null) => void;
}) {
  const t = useTranslations("Configurator.step5");
  const [detailOpen, setDetailOpen] = useState(false);

  const selectedVariant = selectedVariantId
    ? group.variants.find((v) => v.id === selectedVariantId)
    : null;

  return (
    <section className="space-y-4">
      <header>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[2px] text-ochre">
          {group.label}
        </p>
        <p className="font-sans text-[13px] leading-[1.5] text-ink-soft">
          {group.description}
        </p>
      </header>

      <div
        role="radiogroup"
        aria-label={group.label}
        className="flex flex-col gap-2"
      >
        {group.variants.map((variant) => (
          <VariantRow
            key={variant.id}
            variant={variant}
            selected={variant.id === selectedVariantId}
            onSelect={() => {
              onChange(variant.id);
              setDetailOpen(false);
            }}
            impactLabel={t("impactLine", {
              weight: variant.addWeight,
              volume: variant.addVolume,
            })}
          />
        ))}
        <OptionCard
          title={t("noneOption")}
          selected={selectedVariantId === null}
          onSelect={() => {
            onChange(null);
            setDetailOpen(false);
          }}
        />
      </div>

      {selectedVariant ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setDetailOpen((prev) => !prev)}
            className="font-mono text-[10px] uppercase tracking-[2px] text-ochre transition-colors hover:text-green-deep focus-visible:outline-none focus-visible:underline"
            aria-expanded={detailOpen}
          >
            {detailOpen ? t("detailHide") : t("detailToggle")}
          </button>
          {detailOpen ? (
            <p className="font-sans text-[13px] leading-[1.6] text-ink-soft">
              {selectedVariant.longDescription}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function VariantRow({
  variant,
  selected,
  onSelect,
  impactLabel,
}: {
  variant: Variant;
  selected: boolean;
  onSelect: () => void;
  impactLabel: string;
}) {
  return (
    <OptionCard
      title={variant.fullName}
      subtitle={impactLabel}
      selected={selected}
      onSelect={onSelect}
      badge={
        <span className="font-mono text-[12px] tracking-[0.5px] text-ochre">
          {formatPrice(variant.price as Price)}
        </span>
      }
    />
  );
}
