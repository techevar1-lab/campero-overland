/**
 * Tipos centrales del configurador. Estado, acciones y constantes
 * compartidas entre reducer, storage, calculations y la UI.
 *
 * Convenciones:
 * - `step` es 0-indexed (0..5). La UI muestra `step + 1` (PASO 1 DE 6).
 * - Las selecciones obligatorias arrancan en `null` salvo `material`,
 *   que tiene un default sustentable ("recycled") por el brief.
 */

export type Vehicle = "jimny3" | "jimny5" | "other";
export type UseMode = "outside" | "inside";
export type MaterialId = "recycled" | "birch";
export type AddonGroup = "water" | "fridge" | "power";

export type Step = 0 | 1 | 2 | 3 | 4 | 5;

export const TOTAL_STEPS = 6;
export const FIRST_STEP: Step = 0;
export const LAST_STEP: Step = 5;

/** Envío flat en Chile (CLP). */
export const SHIPPING_AMOUNT = 25000;

export type ConfiguratorState = {
  step: Step;
  vehicle: Vehicle | null;
  use: UseMode | null;
  model: string | null;
  material: MaterialId;
  addons: Record<AddonGroup, string | null>;
  email: string;
};

export type ConfiguratorAction =
  | { type: "SET_VEHICLE"; vehicle: Vehicle }
  | { type: "SET_USE"; use: UseMode }
  | { type: "SET_MODEL"; modelId: string }
  | { type: "SET_MATERIAL"; material: MaterialId }
  | { type: "SET_ADDON"; group: AddonGroup; variantId: string | null }
  | { type: "SET_EMAIL"; email: string }
  | { type: "GO_NEXT" }
  | { type: "GO_BACK" }
  | { type: "RESET" }
  | { type: "HYDRATE"; state: ConfiguratorState };
