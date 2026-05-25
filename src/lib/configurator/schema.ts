/**
 * Schemas Zod compartidos entre cliente y server-side. La fuente única
 * de validación: el storage local, el body del POST /api/checkout y
 * cualquier futuro CSV/import usan los mismos schemas.
 */
import { z } from "zod";
import type { ConfiguratorState } from "./types";

export const VehicleSchema = z.enum(["jimny3", "jimny5", "other"]);
export const UseModeSchema = z.enum(["outside", "inside"]);
export const MaterialSchema = z.enum(["recycled", "birch"]);
export const StepSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const AddonsSchema = z.object({
  water: z.string().nullable(),
  fridge: z.string().nullable(),
  power: z.string().nullable(),
});

export const ConfiguratorStateSchema = z.object({
  step: StepSchema,
  vehicle: VehicleSchema.nullable(),
  use: UseModeSchema.nullable(),
  model: z.string().nullable(),
  material: MaterialSchema,
  addons: AddonsSchema,
  email: z.string(),
}) satisfies z.ZodType<ConfiguratorState>;

/**
 * Schema del body del POST /api/checkout. Más estricto que el estado
 * libre: vehicle, use y model son obligatorios; email debe ser válido.
 * La totals la recomputa el server, no se confía del cliente.
 */
export const CheckoutPayloadSchema = z.object({
  vehicle: VehicleSchema,
  use: UseModeSchema,
  model: z.string().min(1),
  material: MaterialSchema,
  addons: AddonsSchema,
  email: z.string().email(),
});

export type CheckoutPayload = z.infer<typeof CheckoutPayloadSchema>;
