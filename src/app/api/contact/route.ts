import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { readEnv } from "@/lib/env";
import { resendClient } from "@/lib/resend";

const ContactPayloadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.enum(["general", "product", "support", "other"]),
  message: z.string().min(10).max(2000),
});

const SUBJECT_LABEL: Record<z.infer<typeof ContactPayloadSchema>["subject"], string> = {
  general: "Consulta general",
  product: "Sobre un producto",
  support: "Soporte postventa",
  other: "Otro",
};

/**
 * Recibe consultas del form `/contacto` y las envía por email a la
 * casilla `hola@camperooverland.cl`. Sin persistencia: el inbox actúa
 * como bandeja de entrada.
 */
export async function POST(req: NextRequest) {
  const resendEnv = readEnv("resend");
  if (!resendEnv.success) {
    return NextResponse.json(
      {
        error: "backend_not_configured",
        missing: resendEnv.missing,
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = ContactPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { name, email, subject, message } = parsed.data;

  try {
    const { client, from } = resendClient();
    await client.emails.send({
      from,
      to: "hola@camperooverland.cl",
      replyTo: email,
      subject: `[Contacto · ${SUBJECT_LABEL[subject]}] ${name}`,
      text:
        `Nombre: ${name}\n` +
        `Email: ${email}\n` +
        `Asunto: ${SUBJECT_LABEL[subject]}\n` +
        `\n` +
        `${message}\n`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] resend error", err);
    return NextResponse.json(
      { error: "send_failed" },
      { status: 502 },
    );
  }
}
