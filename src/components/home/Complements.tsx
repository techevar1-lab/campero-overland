import { Check, Droplet, Refrigerator, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

type Tile =
  | { kind: "brand"; icon: ReactNode; brand: string; variants: string }
  | { kind: "ready"; icon: ReactNode; label: string };

function Tile({ tile }: { tile: Tile }) {
  const iconBoxBg =
    tile.kind === "ready" ? "bg-green-deep" : "bg-ochre-warm";
  const primaryLabel = tile.kind === "ready" ? null : tile.brand;
  const secondaryLabel =
    tile.kind === "ready" ? tile.label : tile.variants;
  const secondaryColor =
    tile.kind === "ready" ? "text-green-deep" : "text-ink-soft";

  return (
    <div className="text-center">
      <div
        className={`mb-2 flex aspect-square items-center justify-center rounded-[4px] ${iconBoxBg}`}
      >
        {tile.icon}
      </div>
      <p
        className="font-serif text-[13px] text-green-deep"
        aria-hidden={primaryLabel === null}
      >
        {primaryLabel ?? " "}
      </p>
      <p
        className={`mt-0.5 font-mono text-[9px] uppercase tracking-[1px] ${secondaryColor}`}
      >
        {secondaryLabel}
      </p>
    </div>
  );
}

export function Complements() {
  const t = useTranslations("HomePage.Complements");

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
    },
    {
      kind: "ready",
      icon: <Check aria-hidden {...iconProps} />,
      label: t("items.ready"),
    },
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
          <ul className="flex flex-wrap gap-2">
            {[t("tagRefrigeration"), t("tagEnergy"), t("tagWater")].map(
              (tag) => (
                <li
                  key={tag}
                  className="rounded-sm bg-green-deep px-3.5 py-2 font-mono text-[10px] uppercase tracking-[1px] text-cream"
                >
                  {tag}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="rounded-sm border-[0.5px] border-green-deep/15 bg-cream p-6">
          <div className="grid grid-cols-2 gap-4">
            {tiles.map((tile, i) => (
              <Tile key={i} tile={tile} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
