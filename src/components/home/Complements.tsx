"use client";

import { Check, Droplet, Refrigerator, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { FichaTecnicaModal } from "@/components/complements/FichaTecnicaModal";
import { FichaAgua } from "@/components/complements/fichas/FichaAgua";
import accesoriosData from "@data/accesorios.json";
import { formatPrice, type Price } from "@/lib/format";

type FichaId = "water" | "fridge" | "power";

type GroupId = "fridge" | "power" | "water";

type Variant = {
  id: string;
  size: string;
  fullName: string;
  longDescription: string;
  price: Price;
};

type AccesoriosData = {
  groups: {
    id: string;
    variants: {
      id: string;
      size: string;
      fullName: string;
      longDescription: string;
      price: Price;
    }[];
  }[];
};

const data = accesoriosData as unknown as AccesoriosData;

type Tile =
  | {
      kind: "brand";
      icon: ReactNode;
      brand: string;
      variants: string;
      ficha?: FichaId;
    }
  | { kind: "ready"; icon: ReactNode; label: string };

function Tile({
  tile,
  onOpenFicha,
  fichaAriaLabel,
}: {
  tile: Tile;
  onOpenFicha?: (id: FichaId) => void;
  fichaAriaLabel?: string;
}) {
  const isInteractive =
    tile.kind === "brand" && Boolean(tile.ficha) && Boolean(onOpenFicha);

  const iconBoxBase =
    tile.kind === "ready"
      ? "bg-green-deep"
      : isInteractive
        ? "bg-ochre-warm transition-colors group-hover:bg-ochre/20"
        : "bg-ochre-warm";

  const primaryLabel = tile.kind === "ready" ? null : tile.brand;
  const secondaryLabel =
    tile.kind === "ready" ? tile.label : tile.variants;
  const secondaryColor =
    tile.kind === "ready" ? "text-green-deep" : "text-ink-soft";

  const primaryColor = isInteractive
    ? "text-green-deep transition-colors group-hover:text-ochre"
    : "text-green-deep";

  const inner = (
    <>
      <div
        className={`mb-2 flex aspect-square items-center justify-center rounded-[4px] ${iconBoxBase}`}
      >
        {tile.icon}
      </div>
      <p
        className={`font-serif text-[13px] ${primaryColor}`}
        aria-hidden={primaryLabel === null}
      >
        {primaryLabel ?? " "}
      </p>
      <p
        className={`mt-0.5 font-mono text-[9px] uppercase tracking-[1px] ${secondaryColor}`}
      >
        {secondaryLabel}
      </p>
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        aria-label={fichaAriaLabel}
        aria-haspopup="dialog"
        onClick={() => onOpenFicha?.(tile.ficha as FichaId)}
        className="group flex cursor-pointer flex-col text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ochre"
      >
        {inner}
      </button>
    );
  }

  return <div className="text-center">{inner}</div>;
}

function getVariants(groupId: GroupId): Variant[] {
  const group = data.groups.find((g) => g.id === groupId);
  if (!group) return [];
  return group.variants;
}

function VariantList({ groupId }: { groupId: GroupId }) {
  const variants = getVariants(groupId);
  return (
    <ul
      id={`complements-panel-${groupId}`}
      role="region"
      className="mt-4 divide-y-[0.5px] divide-green-deep/10 border-[0.5px] border-green-deep/10 bg-cream-pure"
    >
      {variants.map((v) => (
        <li
          key={v.id}
          className="flex items-baseline justify-between gap-4 px-4 py-3"
        >
          <span className="font-serif text-[14px] leading-tight text-green-deep">
            {v.fullName}
          </span>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[1px] text-ochre">
            {formatPrice(v.price)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Complements() {
  const t = useTranslations("HomePage.Complements");
  const tFicha = useTranslations("FichaAgua");
  const [activeGroup, setActiveGroup] = useState<GroupId | null>(null);
  const [openFicha, setOpenFicha] = useState<FichaId | null>(null);

  const iconProps = {
    width: 44,
    height: 44,
    strokeWidth: 1.2,
    className: "text-ochre",
  } as const;

  const tiles: Tile[] = [
    {
      kind: "brand",
      icon: <Refrigerator aria-hidden {...iconProps} />,
      brand: t("items.fridgeBrand"),
      variants: t("items.fridgeVariants"),
    },
    {
      kind: "brand",
      icon: <Zap aria-hidden {...iconProps} />,
      brand: t("items.powerBrand"),
      variants: t("items.powerVariants"),
    },
    {
      kind: "brand",
      icon: <Droplet aria-hidden {...iconProps} />,
      brand: t("items.waterBrand"),
      variants: t("items.waterVariants"),
      ficha: "water",
    },
    {
      kind: "ready",
      icon: <Check aria-hidden {...iconProps} />,
      label: t("items.ready"),
    },
  ];

  const chipGroups: { id: GroupId; label: string }[] = [
    { id: "fridge", label: t("tagRefrigeration") },
    { id: "power", label: t("tagEnergy") },
    { id: "water", label: t("tagWater") },
  ];

  return (
    <section className="border-t-[0.5px] border-green-deep/10 bg-ochre-soft">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 sm:px-12 lg:grid-cols-2 lg:gap-[60px] lg:px-20">
        <div>
          <p className="mb-[18px] font-mono text-[10px] uppercase tracking-[3px] text-ochre">
            {t("label")}
          </p>
          <h2 className="mb-[18px] font-serif text-[36px] leading-[1.15] tracking-[-0.5px] text-green-deep">
            {t.rich("title", {
              em: (chunks) => (
                <em className="italic text-ochre">{chunks}</em>
              ),
              br: () => <br />,
            })}
          </h2>
          <p className="mb-6 font-sans text-sm leading-[1.65] text-ink-soft">
            {t.rich("body", {
              brand: (chunks) => (
                <strong className="font-medium text-green-deep">
                  {chunks}
                </strong>
              ),
            })}
          </p>
          <div
            role="tablist"
            aria-label={t("chipsAriaLabel")}
            className="flex flex-wrap gap-2"
          >
            {chipGroups.map((g) => {
              const active = activeGroup === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-expanded={active}
                  aria-controls={`complements-panel-${g.id}`}
                  onClick={() =>
                    setActiveGroup((current) =>
                      current === g.id ? null : g.id,
                    )
                  }
                  className={`rounded-sm px-3.5 py-2 font-mono text-[10px] uppercase tracking-[1px] transition-colors ${
                    active
                      ? "bg-ochre text-cream"
                      : "bg-green-deep text-cream hover:bg-green-medium"
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>

          {activeGroup ? <VariantList groupId={activeGroup} /> : null}
        </div>

        <div className="rounded-sm border-[0.5px] border-green-deep/15 bg-cream p-6">
          <div className="grid grid-cols-2 gap-4">
            {tiles.map((tile, i) => (
              <Tile
                key={i}
                tile={tile}
                onOpenFicha={setOpenFicha}
                fichaAriaLabel={
                  tile.kind === "brand" && tile.ficha
                    ? t("fichaTileAriaLabel", { brand: tile.brand })
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>

      <FichaTecnicaModal
        open={openFicha === "water"}
        onClose={() => setOpenFicha(null)}
        ariaLabel={tFicha("modalAriaLabel")}
      >
        <FichaAgua />
      </FichaTecnicaModal>
    </section>
  );
}
