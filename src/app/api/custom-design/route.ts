import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { readEnv } from "@/lib/env";
import { resendClient } from "@/lib/resend";

/**
 * Solicitudes de "Campero a medida" (diseño custom o redimensionar un
 * modelo existente). No hay pago: la solicitud se envía por email a la
 * arquitecta, quien cotiza, agenda y responde. Sin persistencia: el inbox
 * actúa como bandeja de leads.
 *
 * Destino configurable vía CUSTOM_DESIGN_EMAIL; fallback a la casilla de
 * contacto general si no está seteada.
 */

const COMPANY = ["solo", "couple", "kids", "group"] as const;
const SLEEP = ["inside", "outside", "both"] as const;

const PayloadSchema = z
  .object({
    vehicle: z.string().min(2).max(120),
    year: z.string().min(1).max(20),
    requestType: z.enum(["modify", "custom"]),
    // modify
    modifyModel: z.string().max(120).optional(),
    modifyChanges: z.string().max(2000).optional(),
    // custom
    company: z.array(z.enum(COMPANY)).max(4).optional(),
    kidsAges: z.string().max(120).optional(),
    sleep: z.enum(SLEEP).optional(),
    elements: z.string().max(2000).optional(),
    notes: z.string().max(2000).optional(),
    // meeting
    wantsMeeting: z.boolean(),
    availability: z.string().max(300).optional(),
    // contact
    name: z.string().min(2).max(120),
    email: z.string().email(),
    phone: z.string().max(40).optional(),
    // contexto opcional (ej. viene del configurador)
    source: z.string().max(80).optional(),
    // Honeypot anti-spam: input oculto que un usuario no completa.
    website: z.string().max(200).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.requestType === "modify") {
      if (!data.modifyModel || data.modifyModel.trim().length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["modifyModel"],
          message: "modifyModel requerido",
        });
      }
      if (!data.modifyChanges || data.modifyChanges.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["modifyChanges"],
          message: "modifyChanges muy corto",
        });
      }
    } else {
      if (!data.company || data.company.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["company"],
          message: "company requerido",
        });
      }
      if (!data.sleep) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sleep"],
          message: "sleep requerido",
        });
      }
    }
  });

type Payload = z.infer<typeof PayloadSchema>;

const COMPANY_LABEL: Record<(typeof COMPANY)[number], string> = {
  solo: "Solo/a",
  couple: "En pareja",
  kids: "Con niños",
  group: "Con amigos / grupo",
};

const SLEEP_LABEL: Record<(typeof SLEEP)[number], string> = {
  inside: "Dentro del vehículo",
  outside: "Fuera (carpa de techo / camping)",
  both: "Mixto (algunos dentro, otros fuera)",
};

function buildEmailText(data: Payload): string {
  const lines: string[] = [];
  lines.push(`Nombre: ${data.name}`);
  lines.push(`Email: ${data.email}`);
  if (data.phone) lines.push(`Teléfono: ${data.phone}`);
  lines.push("");
  lines.push(`Vehículo: ${data.vehicle} (${data.year})`);
  lines.push("");

  if (data.requestType === "modify") {
    lines.push("TIPO: Modificar un modelo existente");
    lines.push(`Modelo base: ${data.modifyModel ?? "—"}`);
    lines.push(`Cambios solicitados:`);
    lines.push(data.modifyChanges ?? "—");
  } else {
    lines.push("TIPO: Diseño 100% a medida");
    const company = (data.company ?? [])
      .map((c) => COMPANY_LABEL[c])
      .join(", ");
    lines.push(`Viaja: ${company || "—"}`);
    if (data.kidsAges) lines.push(`Edades de niños: ${data.kidsAges}`);
    lines.push(`Dónde duermen: ${data.sleep ? SLEEP_LABEL[data.sleep] : "—"}`);
    if (data.elements) {
      lines.push("");
      lines.push("Elementos a incorporar:");
      lines.push(data.elements);
    }
    if (data.notes) {
      lines.push("");
      lines.push("Notas adicionales:");
      lines.push(data.notes);
    }
  }

  lines.push("");
  lines.push(
    `¿Quiere videollamada de 15 min?: ${data.wantsMeeting ? "Sí" : "No"}`,
  );
  if (data.wantsMeeting && data.availability) {
    lines.push(`Disponibilidad: ${data.availability}`);
  }
  if (data.source) {
    lines.push("");
    lines.push(`Origen: ${data.source}`);
  }
  lines.push("");
  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  const resendEnv = readEnv("resend");
  if (!resendEnv.success) {
    return NextResponse.json(
      { error: "backend_not_configured", missing: resendEnv.missing },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = PayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Honeypot lleno → bot. Devolvemos 200 silencioso (no avisamos al bot).
  if (data.website && data.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const to =
    process.env.CUSTOM_DESIGN_EMAIL?.trim() || "hola@camperooverland.cl";
  const typeLabel =
    data.requestType === "modify" ? "Modificar modelo" : "Diseño a medida";

  try {
    const { client, from } = resendClient();
    await client.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `[A medida · ${typeLabel}] ${data.name}`,
      text: buildEmailText(data),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[custom-design] resend error", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
