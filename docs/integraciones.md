# Integraciones backend

Cómo conectar Supabase (DB + Auth + Storage), MercadoPago (pagos) y Resend (emails).

## Supabase

### Setup inicial

1. Crear proyecto en https://supabase.com/dashboard
2. Tomar las URLs y claves desde Settings → API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo para backend, NUNCA expuesta al cliente)

### Schema mínimo

Ver `PRIMEROS-PASOS.md` para el SQL inicial.

### Cliente

Crear dos clientes:

**Cliente público** (`src/lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from "@supabase/ssr"

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

**Cliente server** (`src/lib/supabase/server.ts`)
```typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const createClient = async () => {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        }
      }
    }
  )
}
```

### RLS (Row Level Security)

Habilitar RLS en todas las tablas. Políticas mínimas:

```sql
-- configurations: anyone puede INSERT (incluso anónimos), nadie puede leer/editar excepto service_role
ALTER TABLE configurations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert configurations" ON configurations
  FOR INSERT WITH CHECK (true);

-- orders: igual, solo backend puede leer
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- (sin política de SELECT/UPDATE pública)
```

## MercadoPago

### Setup

1. Crear cuenta de desarrollador en https://www.mercadopago.cl/developers/
2. Crear aplicación
3. Tomar las credenciales TEST primero:
   - Access Token (formato: `TEST-xxxxxxxxxxxxx-xxx`)
   - Public Key

### Flujo de checkout

**1. Crear preferencia desde API route** (`src/app/api/checkout/route.ts`)

```typescript
import { MercadoPagoConfig, Preference } from "mercadopago"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
})

const CheckoutSchema = z.object({
  configurationId: z.string().uuid(),
  email: z.string().email(),
  total: z.object({
    amount: z.number().int().positive(),
    currency: z.literal("CLP")
  }),
  items: z.array(z.object({
    title: z.string(),
    quantity: z.number().int().positive(),
    unit_price: z.number().int().positive()
  }))
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const data = CheckoutSchema.parse(body)
  
  const preference = new Preference(client)
  const result = await preference.create({
    body: {
      items: data.items.map(i => ({
        id: data.configurationId,
        title: i.title,
        quantity: i.quantity,
        unit_price: i.unit_price,
        currency_id: "CLP"
      })),
      payer: { email: data.email },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmacion?status=success`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmacion?status=failure`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmacion?status=pending`
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/mp`,
      external_reference: data.configurationId,
      metadata: { configuration_id: data.configurationId }
    }
  })
  
  return NextResponse.json({ init_point: result.init_point })
}
```

**2. Webhook handler** (`src/app/api/webhook/mp/route.ts`)

CRÍTICO: validar la firma del webhook antes de procesar. MercadoPago manda un header `x-signature` con la firma HMAC.

```typescript
import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { createServiceClient } from "@/lib/supabase/service"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
})

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature")
  const requestId = req.headers.get("x-request-id")
  
  if (!signature || !requestId) {
    return NextResponse.json({ error: "Missing headers" }, { status: 400 })
  }
  
  // Validar firma (ver docs MP para detalle)
  const [tsRaw, hashRaw] = signature.split(",")
  const ts = tsRaw.split("=")[1]
  const hash = hashRaw.split("=")[1]
  
  const body = await req.json()
  const dataId = body?.data?.id
  
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const expected = crypto
    .createHmac("sha256", process.env.MERCADOPAGO_WEBHOOK_SECRET!)
    .update(manifest)
    .digest("hex")
  
  if (expected !== hash) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }
  
  // Procesar el pago
  if (body.type === "payment") {
    const payment = await new Payment(client).get({ id: dataId })
    const supabase = createServiceClient()
    
    if (payment.status === "approved") {
      // Crear order desde la configuration
      await supabase.from("orders").insert({
        configuration_id: payment.external_reference,
        mp_payment_id: payment.id?.toString(),
        status: "paid",
        customer_email: payment.payer?.email
      })
      
      // Disparar email de confirmación (ver sección Resend)
    }
  }
  
  return NextResponse.json({ received: true })
}
```

## Resend

### Setup

1. Crear cuenta en https://resend.com/
2. Verificar dominio `camperooverland.cl` (requiere registros DNS SPF, DKIM en Cloudflare)
3. Crear API key

### Cliente

`src/lib/resend.ts`
```typescript
import { Resend } from "resend"
export const resend = new Resend(process.env.RESEND_API_KEY!)
```

### Templates de email

Crear cada template como un componente React en `src/emails/`:

- `OrderConfirmation.tsx` — pago confirmado, inicio de fabricación
- `ProductionReady.tsx` — listo para despacho
- `ShippingNotification.tsx` — despachado con tracking
- `DeliveryFollowUp.tsx` — entrega + feedback

### Envío después del webhook

Dentro del webhook MP, después de crear el order:

```typescript
import { OrderConfirmationEmail } from "@/emails/OrderConfirmation"

await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL!,
  to: payment.payer.email,
  subject: `¡Tu Campero está en producción! Pedido #${orderId}`,
  react: OrderConfirmationEmail({ order, configuration })
})
```

## i18n (next-intl)

### Setup

`src/i18n.ts`
```typescript
import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default
}))
```

`src/middleware.ts`
```typescript
import createMiddleware from "next-intl/middleware"

export default createMiddleware({
  locales: ["es-CL"],  // agregar "en", "es-AR" cuando se necesite
  defaultLocale: "es-CL",
  localePrefix: "always"
})

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
}
```

### Uso en componentes

```typescript
import { useTranslations } from "next-intl"

export function Hero() {
  const t = useTranslations("home.hero")
  return <h1>{t("title")}</h1>
}
```

## Multi-moneda preparation

Aunque hoy solo hay CLP, estructurar precios siempre como:

```typescript
type Price = { amount: number; currency: "CLP" | "USD" | "ARS" }
```

Cuando llegue Argentina, agregar conversión en runtime usando una tabla de tipos de cambio actualizada diariamente.

## Variables de entorno (resumen)

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=ventas@camperooverland.cl

# App
NEXT_PUBLIC_SITE_URL=https://camperooverland.cl
```

Vercel los configura por entorno (Development / Preview / Production).
