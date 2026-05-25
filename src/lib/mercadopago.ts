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
 *
 * Importante: `dataId` se convierte a lowercase porque MP a veces envía
 * IDs con mayúsculas pero firma sobre lowercase (causa frecuente de 401).
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

  // Log temporal para diagnóstico de 401s. Quitar después de validar.
  const log = {
    hasSignatureHeader: Boolean(signatureHeader),
    hasTs: Boolean(ts),
    hasHash: Boolean(hash),
    receivedHashPrefix: hash?.slice(0, 12),
    receivedHashLength: hash?.length,
    dataIdRaw: dataId,
    dataIdLowercased: String(dataId).toLowerCase(),
    requestId,
    ts,
    secretLength: secret?.length ?? 0,
    secretFirst4: secret?.slice(0, 4),
  };

  if (!ts || !hash) {
    console.warn("[mp.verifySignature] missing parts", log);
    return false;
  }

  const manifest = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  const match =
    expected.length === hash.length &&
    crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(hash, "hex"),
    );

  if (!match) {
    console.warn("[mp.verifySignature] mismatch", {
      ...log,
      manifest,
      expectedPrefix: expected.slice(0, 12),
      expectedLength: expected.length,
    });
  }

  return match;
}
