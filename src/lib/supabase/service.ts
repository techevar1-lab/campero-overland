/**
 * Cliente Supabase con service role. Usar SOLO en rutas server-side
 * (API routes, server actions). Bypassa RLS — nunca exponer al cliente.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readEnv } from "@/lib/env";

let cachedClient: SupabaseClient | null = null;

export function createServiceClient(): SupabaseClient {
  if (cachedClient) return cachedClient;
  const env = readEnv("supabase");
  if (!env.success) {
    throw new Error(
      `Supabase no configurado. Faltan vars: ${env.missing.join(", ")}`,
    );
  }
  cachedClient = createClient(
    env.data.NEXT_PUBLIC_SUPABASE_URL,
    env.data.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
  return cachedClient;
}
