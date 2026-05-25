/**
 * Cliente MercadoPago (Chile). Solo server-side.
 *
 * - `mpClient()` instancia el cliente con el access token.
 * - `verifyMpSignature()` valida la firma HMAC de los webhooks de MP.
 */
import crypto from "node:crypto";
import { MercadoPagoConfig } from "mercadopago";
import { readEnv } from "@/lib/env";

let cachedClient: MercadoPagoConfig | null = null;

export function mpClient(): MercadoPagoConfig {
  if (cachedClient) return cachedClient;
  const env = readEnv("mercadopago");
  if (!env.success) {
    throw new Error(
      `MercadoPago no configurado. Faltan vars: ${env.missing.join(", ")}`,
    );
  }
  cachedClient = new MercadoPagoConfig({
    accessToken: env.data.MERCADOPAGO_ACCESS_TOKEN,
  });
  return cachedClient;
}

/**
 * Verifica la firma HMAC del webhook según docs de MP.
 * Header esperado: `x-signature: ts=...,v1=...`
 * Manifest: `id:{dataId};request-id:{requestId};ts:{ts};`
 */
export function verifyMpSignature({
  signatureHeader,
  requestId,
  dataId,
  secret,
}: {
  signatureHeader: string;
  requestId: string;
  dataId: string;
  secret: string;
}): boolean {
  const parts = signatureHeader.split(",").map((s) => s.trim());
  const ts = parts.find((p) => p.startsWith("ts="))?.slice(3);
  const hash = parts.find((p) => p.startsWith("v1="))?.slice(3);
  if (!ts || !hash) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  // Comparación timing-safe
  if (expected.length !== hash.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(hash, "hex"),
  );
}
