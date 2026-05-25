/**
 * Acceso tipado a variables de entorno con fallback graceful.
 *
 * Las variables se LEEN bajo demanda (no en import time) para que rutas
 * no relacionadas puedan funcionar aunque el .env esté incompleto.
 *
 * Patrón de uso en route handlers:
 *   const env = readEnv("mercadopago");
 *   if (!env.success) return missingEnvResponse(env.missing);
 */
import { z } from "zod";

const SupabaseEnv = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const MercadoPagoEnv = z.object({
  MERCADOPAGO_ACCESS_TOKEN: z.string().min(1),
  MERCADOPAGO_PUBLIC_KEY: z.string().min(1),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().min(1),
});

const ResendEnv = z.object({
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),
});

const SiteEnv = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

type EnvGroup = "supabase" | "mercadopago" | "resend" | "site";

const schemas = {
  supabase: SupabaseEnv,
  mercadopago: MercadoPagoEnv,
  resend: ResendEnv,
  site: SiteEnv,
} as const;

type EnvShape<G extends EnvGroup> = z.infer<(typeof schemas)[G]>;

export type EnvResult<G extends EnvGroup> =
  | { success: true; data: EnvShape<G> }
  | { success: false; group: G; missing: string[] };

export function readEnv<G extends EnvGroup>(group: G): EnvResult<G> {
  const parsed = schemas[group].safeParse(process.env);
  if (parsed.success) {
    return { success: true, data: parsed.data as EnvShape<G> };
  }
  const missing = parsed.error.issues.map((issue) =>
    issue.path.join("."),
  );
  return { success: false, group, missing };
}

/**
 * Para la página de confirmación que necesita NEXT_PUBLIC_SITE_URL. En
 * build sin esa var, devolvemos el origin del runtime cuando podamos.
 */
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
