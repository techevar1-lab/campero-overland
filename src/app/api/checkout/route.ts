import { Preference } from "mercadopago";
import { NextResponse, type NextRequest } from "next/server";
import { computeTotals } from "@/lib/configurator/calculations";
import { CheckoutPayloadSchema } from "@/lib/configurator/schema";
import type { ConfiguratorState } from "@/lib/configurator/types";
import { readEnv, siteUrl } from "@/lib/env";
import { mpClient } from "@/lib/mercadopago";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Crea una preferencia de MercadoPago y devuelve `init_point` para
 * redirigir al checkout de MP.
 *
 * Flujo:
 * 1. Valida el body con Zod (CheckoutPayloadSchema)
 * 2. Recomputa totals server-side (no confía del cliente)
 * 3. Inserta en `configurations` (Supabase service role)
 * 4. Crea preferencia MP con items, back_urls, notification_url
 * 5. Devuelve { initPoint, configurationId }
 */
export async function POST(req: NextRequest) {
  // Check env vars antes de aceptar el request: si el backend no está
  // configurado, fallamos rápido con un mensaje claro.
  const mpEnv = readEnv("mercadopago");
  const sbEnv = readEnv("supabase");
  if (!mpEnv.success || !sbEnv.success) {
    const missing = [
      ...(!mpEnv.success ? mpEnv.missing : []),
      ...(!sbEnv.success ? sbEnv.missing : []),
    ];
    return NextResponse.json(
      {
        error: "backend_not_configured",
        message:
          "El backend de checkout no está configurado. Falta configurar variables de entorno.",
        missing,
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = CheckoutPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_payload",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }
  const payload = parsed.data;

  // Reconstruir un ConfiguratorState para que computeTotals haga su trabajo
  // con los mismos helpers que usa la UI.
  const state: ConfiguratorState = {
    step: 5,
    vehicle: payload.vehicle,
    use: payload.use,
    model: payload.model,
    material: payload.material,
    addons: payload.addons,
    email: payload.email,
  };

  const totals = computeTotals(state);
  if (!totals) {
    return NextResponse.json(
      {
        error: "invalid_configuration",
        message: "El producto referenciado no existe.",
      },
      { status: 400 },
    );
  }

  // Persistir la configuración antes de crear la preferencia. Si MP falla
  // después, el registro queda como huérfano pero recuperable.
  const supabase = createServiceClient();
  const { data: configRow, error: insertError } = await supabase
    .from("configurations")
    .insert({
      email: payload.email,
      vehicle: payload.vehicle,
      use_mode: payload.use,
      model: payload.model,
      material: payload.material,
      addons: payload.addons,
      total_amount: totals.total.amount,
      currency: totals.total.currency,
      weight_kg: totals.weightKg,
      volume_l: totals.volumeL,
    })
    .select("id")
    .single();

  if (insertError || !configRow) {
    console.error("[checkout] supabase insert error", insertError);
    return NextResponse.json(
      { error: "persistence_failed" },
      { status: 500 },
    );
  }

  const configurationId = configRow.id as string;

  // Construir los items para MP. Un line item por pieza para
  // transparencia en el checkout.
  const items = [
    {
      id: `${configurationId}-base`,
      title: `${totals.product.title} · ${totals.material.name}`,
      description: totals.product.description,
      quantity: 1,
      unit_price: totals.basePrice.amount,
      currency_id: "CLP",
    },
    ...totals.selectedAddons.map((addon) => ({
      id: `${configurationId}-${addon.id}`,
      title: addon.fullName,
      quantity: 1,
      unit_price: addon.price.amount,
      currency_id: "CLP",
    })),
    {
      id: `${configurationId}-shipping`,
      title: "Envío a todo Chile",
      quantity: 1,
      unit_price: totals.shipping.amount,
      currency_id: "CLP",
    },
  ];

  try {
    const preference = new Preference(mpClient());
    const result = await preference.create({
      body: {
        items,
        payer: { email: payload.email },
        back_urls: {
          success: `${siteUrl()}/es-CL/confirmacion?status=success`,
          failure: `${siteUrl()}/es-CL/confirmacion?status=failure`,
          pending: `${siteUrl()}/es-CL/confirmacion?status=pending`,
        },
        auto_return: "approved",
        notification_url: `${siteUrl()}/api/webhook/mp`,
        external_reference: configurationId,
        metadata: { configuration_id: configurationId },
      },
    });

    if (!result.init_point) {
      console.error("[checkout] MP did not return init_point", result);
      return NextResponse.json(
        { error: "mp_no_init_point" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      initPoint: result.init_point,
      configurationId,
    });
  } catch (err) {
    console.error("[checkout] MP preference error", err);
    return NextResponse.json(
      { error: "mp_preference_failed" },
      { status: 502 },
    );
  }
}
