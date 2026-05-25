import { Payment } from "mercadopago";
import { NextResponse, type NextRequest } from "next/server";
import { OrderConfirmation } from "@/emails/OrderConfirmation";
import { computeTotals } from "@/lib/configurator/calculations";
import type {
  AddonGroup,
  ConfiguratorState,
  MaterialId,
  UseMode,
  Vehicle,
} from "@/lib/configurator/types";
import { readEnv, siteUrl } from "@/lib/env";
import { mpClient, verifyMpSignature } from "@/lib/mercadopago";
import { resendClient } from "@/lib/resend";
import { createServiceClient } from "@/lib/supabase/service";

type ConfigurationRow = {
  id: string;
  email: string;
  vehicle: Vehicle;
  use_mode: UseMode;
  model: string;
  material: MaterialId;
  addons: Record<AddonGroup, string | null>;
};

/**
 * Webhook de MercadoPago. MP envía notificaciones a esta URL cuando
 * cambia el estado de un pago. CRÍTICO: validar la firma HMAC antes de
 * procesar el body.
 *
 * Cuando el pago queda en `approved`:
 * 1. Inserta un registro en `orders` (idempotente por mp_payment_id)
 * 2. Envía email de confirmación con Resend
 *
 * Idempotencia: si el mismo mp_payment_id ya existe en orders, no
 * duplicamos el envío.
 */
export async function POST(req: NextRequest) {
  const mpEnv = readEnv("mercadopago");
  const sbEnv = readEnv("supabase");
  if (!mpEnv.success || !sbEnv.success) {
    return NextResponse.json(
      { error: "backend_not_configured" },
      { status: 503 },
    );
  }

  const signatureHeader = req.headers.get("x-signature");
  const requestId = req.headers.get("x-request-id");
  if (!signatureHeader || !requestId) {
    return NextResponse.json(
      { error: "missing_signature_headers" },
      { status: 400 },
    );
  }

  let body: { type?: string; data?: { id?: string } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400 },
    );
  }

  const dataId = body?.data?.id;
  if (!dataId) {
    return NextResponse.json(
      { error: "missing_data_id" },
      { status: 400 },
    );
  }

  const validSignature = verifyMpSignature({
    signatureHeader,
    requestId,
    dataId,
    secret: mpEnv.data.MERCADOPAGO_WEBHOOK_SECRET,
  });
  if (!validSignature) {
    return NextResponse.json(
      { error: "invalid_signature" },
      { status: 401 },
    );
  }

  // Solo procesamos eventos de tipo "payment". MP también envía
  // notificaciones de merchant_order, plan, etc.
  if (body.type !== "payment") {
    return NextResponse.json({ received: true });
  }

  let payment;
  try {
    payment = await new Payment(mpClient()).get({ id: dataId });
  } catch (err) {
    console.error("[webhook] MP payment fetch error", err);
    return NextResponse.json(
      { error: "mp_payment_fetch_failed" },
      { status: 502 },
    );
  }

  if (payment.status !== "approved") {
    // Para estados no-aprobados, registrar pero no enviar email.
    // (En V2 podríamos persistir el intento fallido también.)
    return NextResponse.json({ received: true, status: payment.status });
  }

  const configurationId = payment.external_reference;
  if (!configurationId) {
    return NextResponse.json(
      { error: "missing_configuration_id" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();

  // Idempotencia: si ya hay un order con este mp_payment_id, no duplicar.
  const paymentId = String(payment.id);
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("mp_payment_id", paymentId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true, idempotent: true });
  }

  const { data: configRow, error: configError } = await supabase
    .from("configurations")
    .select("id, email, vehicle, use_mode, model, material, addons")
    .eq("id", configurationId)
    .single<ConfigurationRow>();

  if (configError || !configRow) {
    console.error("[webhook] config lookup failed", configError);
    return NextResponse.json(
      { error: "configuration_not_found" },
      { status: 404 },
    );
  }

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      configuration_id: configurationId,
      mp_payment_id: paymentId,
      status: "paid",
      customer_email: configRow.email,
    })
    .select("id")
    .single();

  if (orderError || !orderRow) {
    console.error("[webhook] order insert failed", orderError);
    return NextResponse.json(
      { error: "order_insert_failed" },
      { status: 500 },
    );
  }

  // Construir totals para el email reusando los mismos helpers que la UI.
  const reconstructedState: ConfiguratorState = {
    step: 5,
    vehicle: configRow.vehicle,
    use: configRow.use_mode,
    model: configRow.model,
    material: configRow.material,
    addons: configRow.addons,
    email: configRow.email,
  };
  const totals = computeTotals(reconstructedState);

  if (totals) {
    try {
      const { client, from } = resendClient();
      await client.emails.send({
        from,
        to: configRow.email,
        subject: `¡Tu Campero está en producción! Pedido #${orderRow.id.slice(0, 8)}`,
        react: OrderConfirmation({
          orderId: orderRow.id as string,
          customerEmail: configRow.email,
          totals,
          siteUrl: siteUrl(),
        }),
      });
    } catch (err) {
      console.error("[webhook] resend send failed", err);
      // No bloqueamos el webhook: el pago ya está confirmado en MP y el
      // order está guardado. El email se puede reenviar manualmente desde
      // el backoffice.
    }
  }

  return NextResponse.json({ received: true, orderId: orderRow.id });
}
