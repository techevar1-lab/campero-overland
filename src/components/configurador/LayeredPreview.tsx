"use client";

import Image from "next/image";
import renderAnchors from "@data/renderAnchors.json";
import type { ConfiguratorState } from "@/lib/configurator/types";

/**
 * Preview en vivo del configurador como composición de capas:
 * - Imagen base del producto (render PNG con transparencia).
 * - Por cada accesorio seleccionado, un PNG suelto posicionado por anchor
 *   (cx, cy, w) en fracción del lienzo, anclado por su centro vía
 *   `transform: translate(-50%, -50%)`. La altura del accesorio sale
 *   natural por la proporción intrínseca del PNG (no requiere `h`).
 *
 * Si el producto todavía no tiene render en `data/renderAnchors.json`,
 * el componente devuelve null y el panel cae al placeholder verde.
 */

type AnchorPoint = { cx: number; cy: number; w: number };
type AddonGroup = "water" | "fridge" | "power";

type ProductAnchors = {
  src: string;
  // [width, height] del PNG base (en px). Se relaja a number[] porque el
  // JSON no infiere tuples.
  aspect: number[];
  anchors: Record<AddonGroup, AnchorPoint | null>;
};

const PRODUCTS: Record<string, ProductAnchors | undefined> = (
  renderAnchors as {
    products: Record<string, ProductAnchors>;
  }
).products;

const ACCESSORIES: Record<string, string | null> = (
  renderAnchors as { accessories: Record<string, string | null> }
).accessories;

export function hasRender(productId: string): boolean {
  return Boolean(PRODUCTS[productId]);
}

export function LayeredPreview({
  productId,
  addons,
  productLabel,
}: {
  productId: string;
  addons: ConfiguratorState["addons"];
  productLabel: string;
}) {
  const product = PRODUCTS[productId];
  if (!product) return null;

  const aspectW = product.aspect[0] ?? 1;
  const aspectH = product.aspect[1] ?? 1;

  type Layer = {
    group: AddonGroup;
    accSrc: string;
    anchor: AnchorPoint;
    variantId: string;
  };
  const layers = (["water", "fridge", "power"] as AddonGroup[])
    .map<Layer | null>((group) => {
      const variantId = addons[group];
      if (!variantId) return null;
      const anchor = product.anchors[group];
      const accSrc = ACCESSORIES[variantId] ?? null;
      if (!anchor || !accSrc) return null;
      return { group, accSrc, anchor, variantId };
    })
    .filter((l): l is Layer => l !== null);

  return (
    <div
      className="relative w-full bg-cream-pure"
      style={{ aspectRatio: `${aspectW} / ${aspectH}` }}
    >
      <Image
        src={product.src}
        alt={`Render: ${productLabel}`}
        fill
        sizes="(max-width: 1024px) 100vw, 400px"
        className="object-contain"
        priority
      />
      {layers.map((layer) => (
        <div
          key={layer.group}
          className="absolute transition-opacity duration-500 ease-out"
          style={{
            left: `${layer.anchor.cx * 100}%`,
            top: `${layer.anchor.cy * 100}%`,
            width: `${layer.anchor.w * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Image
            src={layer.accSrc}
            alt=""
            width={500}
            height={500}
            sizes="80px"
            className="h-auto w-full"
          />
        </div>
      ))}
    </div>
  );
}
