/**
 * Cliente MercadoPago (Chile). Solo server-side.
 *
 * - `mpClient()` instancia el cliente con el access token.
 *
 * Nota sobre webhooks: la verificación HMAC nativa de MP no se está
 * usando porque MP firma con un secret distinto al que muestra el panel
 * (root cause sin diagnosticar). El webhook usa fetch-based validation
 * en su lugar: consulta el payment en la API de MP con nuestro token
 * y si responde 200 lo considera legítimo. Ver src/app/api/webhook/mp.
 */
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
