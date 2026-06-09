"use client";

import { useTranslations } from "next-intl";
import {
  LayeredPreview,
  hasRender,
} from "@/components/configurador/LayeredPreview";
import { useConfigurator } from "@/lib/configurator/context";
import { getAccessoryVariant } from "@/lib/configurator/data";
import type { AddonGroup, ConfiguratorState } from "@/lib/configurator/types";
import { formatPrice } from "@/lib/format";

/**
 * Panel preview del configurador. Se enriquece según el estado:
 * - Pasos 1-2 (sin vehicle/use): placeholder.
 * - Paso 3+: producto efectivo + peso + volumen + total.
 * - Paso 5+: además, compartimentos por accesorio (vacío → relleno).
 *
 * El render esquemático SVG real (vista superior del producto con los
 * compartimentos dimensionados) se agrega en iteraciones posteriores.
 */
export function PreviewPanel() {
  const t = useTranslations("Configurator.preview");
  const { state, totals } = useConfigurator();

  if (!totals) {
    return (
      <aside className="rounded-sm border-[0.5px] border-green-deep/10 bg-cream-pure">
        <div className="flex min-h-[420px] items-center justify-center px-8 py-12 text-center">
          <p className="max-w-[260px] font-sans text-sm leading-[1.6] text-ink-soft">
            {t("placeholder")}
          </p>
        </div>
      </aside>
    );
  }

  const { product, weightKg, volumeL, total } = totals;

  return (
    <aside className="overflow-hidden rounded-sm border-[0.5px] border-green-deep/10 bg-cream-pure">
      {hasRender(product.id) ? (
        <LayeredPreview
          productId={product.id}
          addons={state.addons}
          productLabel={product.title}
        />
      ) : (
        <div className="relative flex aspect-square items-end bg-green-medium p-[18px]">
          <span className="font-mono text-[10px] uppercase tracking-[2px] text-cream/40">
            [ {product.shortTitle.toUpperCase()} ]
          </span>
        </div>
      )}

      <div className="space-y-5 p-6">
        <header>
          <p className="font-serif text-base leading-[1.3] text-green-deep">
            {product.shortTitle}
          </p>
          <p className="mt-0.5 font-serif text-sm italic text-ink-soft">
            {product.subtitle}
          </p>
        </header>

        <Compartments addons={state.addons} t={t} />

        <dl className="space-y-3 border-t-[0.5px] border-green-deep/10 pt-4">
          <Stat label={t("weightLabel")} value={`${weightKg} kg`} />
          <Stat label={t("volumeLabel")} value={`${volumeL} L`} />
          <Stat
            label={t("totalLabel")}
            value={formatPrice(total)}
            emphasis
          />
        </dl>
      </div>
    </aside>
  );
}

function Compartments({
  addons,
  t,
}: {
  addons: ConfiguratorState["addons"];
  t: ReturnType<typeof useTranslations<"Configurator.preview">>;
}) {
  const slots: { group: AddonGroup; label: string }[] = [
    { group: "water", label: t("compartmentWater") },
    { group: "fridge", label: t("compartmentFridge") },
    { group: "power", label: t("compartmentPower") },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 border-t-[0.5px] border-green-deep/10 pt-4">
      {slots.map(({ group, label }) => {
        const variant = getAccessoryVariant(addons[group]);
        const filled = variant !== null;
        return (
          <div
            key={group}
            className={
              filled
                ? "flex flex-col items-center justify-center gap-1 rounded-sm bg-ochre px-2 py-3 text-center"
                : "flex flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-green-deep/25 px-2 py-3 text-center"
            }
          >
            <span
              className={
                filled
                  ? "font-mono text-[8px] uppercase tracking-[1.5px] text-cream/85"
                  : "font-mono text-[8px] uppercase tracking-[1.5px] text-ink-soft"
              }
            >
              {label}
            </span>
            <span
              className={
                filled
                  ? "font-mono text-[11px] tracking-[0.5px] text-cream"
                  : "font-mono text-[11px] tracking-[0.5px] text-ink-soft/60"
              }
            >
              {filled ? variant.size : t("compartmentEmpty")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Stat({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="font-mono text-[9px] uppercase tracking-[2px] text-ink-soft">
        {label}
      </dt>
      <dd
        className={
          emphasis
            ? "font-mono text-[13px] tracking-[0.5px] text-ochre"
            : "font-mono text-[12px] tracking-[0.5px] text-green-deep"
        }
      >
        {value}
      </dd>
    </div>
  );
}
