/**
 * Cálculos en tiempo real del configurador. Derivan de:
 * - producto seleccionado (data/productos.json)
 * - material seleccionado (data/materiales.json) → multiplicadores
 * - accesorios seleccionados (data/accesorios.json) → suma directa
 * - envío flat (constante en types.ts)
 *
 * Toda la moneda viaja como `Price` ({amount, currency}) según el brief.
 */
import type { Price } from "@/lib/format";
import {
  getAccessoryVariant,
  getMaterial,
  getProduct,
  type AccessoryVariant,
  type Material,
  type Product,
} from "./data";
import { getEffectiveModel } from "./state";
import {
  SHIPPING_AMOUNT,
  type AddonGroup,
  type ConfiguratorState,
} from "./types";

export type ConfiguratorTotals = {
  subtotal: Price;
  shipping: Price;
  total: Price;
  basePrice: Price;
  addonsPrice: Price;
  weightKg: number;
  volumeL: number;
  product: Product;
  material: Material;
  selectedAddons: AccessoryVariant[];
};

/**
 * Calcula precios, peso y volumen del Campero configurado.
 * Devuelve `null` si todavía no hay producto seleccionado (paso < 3).
 */
export function computeTotals(
  state: ConfiguratorState,
): ConfiguratorTotals | null {
  const product = getProduct(getEffectiveModel(state));
  if (!product) return null;

  const material = getMaterial(state.material);

  const selectedAddons = (Object.keys(state.addons) as AddonGroup[])
    .map((g) => getAccessoryVariant(state.addons[g]))
    .filter((a): a is AccessoryVariant => a !== null);

  const basePrice = Math.round(
    product.price.amount * material.priceMultiplier,
  );
  const addonsPrice = selectedAddons.reduce(
    (sum, a) => sum + a.price.amount,
    0,
  );
  const subtotal = basePrice + addonsPrice;
  const total = subtotal + SHIPPING_AMOUNT;

  const weightKg =
    Math.round(
      (product.baseWeight * material.weightFactor +
        selectedAddons.reduce((sum, a) => sum + a.addWeight, 0)) *
        10,
    ) / 10;

  const volumeL = Math.round(
    product.baseVolume * material.volumeFactor +
      selectedAddons.reduce((sum, a) => sum + a.addVolume, 0),
  );

  return {
    basePrice: { amount: basePrice, currency: "CLP" },
    addonsPrice: { amount: addonsPrice, currency: "CLP" },
    subtotal: { amount: subtotal, currency: "CLP" },
    shipping: { amount: SHIPPING_AMOUNT, currency: "CLP" },
    total: { amount: total, currency: "CLP" },
    weightKg,
    volumeL,
    product,
    material,
    selectedAddons,
  };
}
