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
 *
 * Prueba múltiples variantes del manifest hasta que alguna matchee.
 * Loggea cuál variante fue la ganadora (si alguna lo es) para que
 * podamos consolidar la implementación.
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

  if (!ts || !hash) {
    console.warn("[mp.verifySignature] missing parts", {
      hasSignatureHeader: Boolean(signatureHeader),
      hasTs: Boolean(ts),
      hasHash: Boolean(hash),
    });
    return false;
  }

  const dataIdLower = String(dataId).toLowerCase();
  const dataIdRaw = String(dataId);

  // Catálogo de variantes a probar.
  const variants: Array<{ name: string; manifest: string }> = [
    {
      name: "lowercase+trailing-semi",
      manifest: `id:${dataIdLower};request-id:${requestId};ts:${ts};`,
    },
    {
      name: "lowercase+no-trailing-semi",
      manifest: `id:${dataIdLower};request-id:${requestId};ts:${ts}`,
    },
    {
      name: "raw+trailing-semi",
      manifest: `id:${dataIdRaw};request-id:${requestId};ts:${ts};`,
    },
    {
      name: "raw+no-trailing-semi",
      manifest: `id:${dataIdRaw};request-id:${requestId};ts:${ts}`,
    },
  ];

  for (const variant of variants) {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(variant.manifest)
      .digest("hex");

    if (
      expected.length === hash.length &&
      crypto.timingSafeEqual(
        Buffer.from(expected, "hex"),
        Buffer.from(hash, "hex"),
      )
    ) {
      console.log("[mp.verifySignature] MATCH", {
        winningVariant: variant.name,
        manifest: variant.manifest,
      });
      return true;
    }
  }

  // Ninguna variante matcheó: log detallado.
  console.warn("[mp.verifySignature] NO match (probadas 4 variantes)", {
    receivedHashPrefix: hash.slice(0, 12),
    receivedHashLength: hash.length,
    dataIdRaw,
    dataIdLower,
    requestId,
    ts,
    secretLength: secret.length,
    secretFirst4: secret.slice(0, 4),
    secretLast4: secret.slice(-4),
    expectedPerVariant: variants.map((v) => ({
      name: v.name,
      manifest: v.manifest,
      expected: crypto
        .createHmac("sha256", secret)
        .update(v.manifest)
        .digest("hex")
        .slice(0, 12),
    })),
  });

  return false;
}
