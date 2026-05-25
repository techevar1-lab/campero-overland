/**
 * Persistencia del estado del configurador en localStorage. Permite que
 * el usuario refresque la página sin perder su selección. Después del pago
 * exitoso se limpia con `clearConfiguratorState`.
 *
 * Validación con Zod en la lectura: si el JSON guardado quedó en un shape
 * inválido (cambio de versión, manipulación manual), se descarta y arranca
 * con `initialState`.
 */
import { z } from "zod";
import type { ConfiguratorState } from "./types";

const STORAGE_KEY = "campero:configurator";

const StepSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

const StateSchema = z.object({
  step: StepSchema,
  vehicle: z.enum(["jimny3", "jimny5", "other"]).nullable(),
  use: z.enum(["outside", "inside"]).nullable(),
  model: z.string().nullable(),
  material: z.enum(["recycled", "birch"]),
  addons: z.object({
    water: z.string().nullable(),
    fridge: z.string().nullable(),
    power: z.string().nullable(),
  }),
  email: z.string(),
}) satisfies z.ZodType<ConfiguratorState>;

export function loadConfiguratorState(): ConfiguratorState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = StateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveConfiguratorState(state: ConfiguratorState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage puede estar bloqueado (modo privado, quota llena).
    // Fallar en silencio: la sesión sigue en memoria.
  }
}

export function clearConfiguratorState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
