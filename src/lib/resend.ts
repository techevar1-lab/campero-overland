/**
 * Cliente Resend para emails transaccionales. Solo server-side.
 */
import { Resend } from "resend";
import { readEnv } from "@/lib/env";

let cachedClient: Resend | null = null;

export function resendClient(): { client: Resend; from: string } {
  const env = readEnv("resend");
  if (!env.success) {
    throw new Error(
      `Resend no configurado. Faltan vars: ${env.missing.join(", ")}`,
    );
  }
  if (!cachedClient) {
    cachedClient = new Resend(env.data.RESEND_API_KEY);
  }
  return { client: cachedClient, from: env.data.RESEND_FROM_EMAIL };
}
