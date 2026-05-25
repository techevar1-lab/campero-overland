/**
 * Endpoint TEMPORAL de diagnóstico para MercadoPago.
 *
 * Verifica qué cuenta corresponde al MERCADOPAGO_ACCESS_TOKEN cargado en
 * Vercel. Llama a /users/me de la API de MP y devuelve datos clave.
 *
 * Protegido por un query param `key=campero2026` para evitar acceso
 * casual. ELIMINAR este archivo una vez resuelto el problema del webhook.
 */
import { NextResponse, type NextRequest } from "next/server";
import { readEnv } from "@/lib/env";

const DEBUG_KEY = "campero2026";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== DEBUG_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const mpEnv = readEnv("mercadopago");
  if (!mpEnv.success) {
    return NextResponse.json(
      { error: "mp_not_configured", missing: mpEnv.missing },
      { status: 503 },
    );
  }

  const token = mpEnv.data.MERCADOPAGO_ACCESS_TOKEN;

  try {
    const response = await fetch("https://api.mercadopago.com/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    return NextResponse.json({
      mpResponseStatus: response.status,
      tokenInfo: {
        first10: token.slice(0, 10),
        last4: token.slice(-4),
        length: token.length,
      },
      mpAccount: {
        id: json.id,
        nickname: json.nickname,
        site_id: json.site_id,
        country_id: json.country_id,
        email: json.email,
        // Si es test user, suele tener "TESTUSER" en nickname o email
        userType: json.user_type,
        status: json.status,
      },
      rawSample: {
        id: json.id,
        nickname: json.nickname,
        site_id: json.site_id,
        first_name: json.first_name,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "mp_call_failed", detail: String(err) },
      { status: 502 },
    );
  }
}
