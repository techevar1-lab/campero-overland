/**
 * Lookups sobre los JSONs estáticos de `/data/`. Funciones puras: no tocan
 * el estado del configurador, solo traducen ids a registros completos.
 */
import accesoriosData from "@data/accesorios.json";
import materialesData from "@data/materiales.json";
import productosData from "@data/productos.json";
import type { MaterialId, UseMode, Vehicle } from "./types";

export type Product = (typeof productosData.products)[number];
export type Material = (typeof materialesData.materials)[number];
export type AccessoryVariant =
  (typeof accesoriosData.groups)[number]["variants"][number];

export function getProduct(id: string | null): Product | null {
  if (!id) return null;
  return productosData.products.find((p) => p.id === id) ?? null;
}

export function getMaterial(id: MaterialId): Material {
  const material = materialesData.materials.find((m) => m.id === id);
  if (!material) {
    throw new Error(`Material no encontrado: ${id}`);
  }
  return material;
}

export function getAccessoryVariant(
  variantId: string | null,
): AccessoryVariant | null {
  if (!variantId) return null;
  for (const group of accesoriosData.groups) {
    const variant = group.variants.find((v) => v.id === variantId);
    if (variant) return variant;
  }
  return null;
}

/**
 * Para una combinación vehículo + modo de viaje, devuelve el id del
 * primer modelo recomendado según `_modelsByPath` en productos.json.
 *
 * En V1 hay un solo modelo por combinación, pero la estructura admite
 * múltiples para expansión futura.
 */
export function getModelForPath(
  vehicle: Vehicle,
  use: UseMode,
): string | null {
  const key = `${vehicle}_${use}`;
  const lookup = productosData._modelsByPath as Record<
    string,
    string[] | string
  >;
  const ids = lookup[key];
  if (!Array.isArray(ids)) return null;
  return ids[0] ?? null;
}
