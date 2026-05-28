# Campero Overland

E-commerce + configurador interactivo para venta de mobiliario portátil de camperización para SUV overland. Mercado: Chile (MVP), expansión a Argentina (V2).

Live: [camperooverland.cl](https://camperooverland.cl)

## Stack

- **Frontend**: Next.js 16 (App Router) · React 19 · TypeScript strict
- **Estilos**: Tailwind CSS v4 (sin archivos CSS custom)
- **i18n**: `next-intl` (`es-CL` activo; `en` y `es-AR` preparados)
- **DB**: Supabase (Postgres + RLS)
- **Pagos**: MercadoPago (Checkout Pro, Chile)
- **Email transaccional**: Resend
- **Hosting**: Vercel
- **DNS + Email Routing**: Cloudflare
- **Validación**: Zod

## Estructura

```
src/
  app/[locale]/         → rutas localizadas (home, configurador, producto,
                          historia, faq, contacto, confirmacion, privacidad, terminos)
  app/api/              → /checkout, /webhook/mp, /contact
  components/           → ui base + secciones home + configurador + legal
  i18n/                 → routing, request config, navigation helpers
  lib/configurator/     → state machine (reducer, totals, storage, data)
  lib/                  → utils (format, supabase, mp, resend, env)
data/                   → JSONs estáticos (productos, accesorios, materiales)
messages/               → traducciones (es-CL.json)
docs/                   → especificación: configurador, copy, diseño, integraciones
supabase/               → schema SQL inicial
```

## Comandos

```bash
npm run dev          # localhost:3000
npm run build        # build de producción
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
```

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar. Las API routes manejan
vars faltantes con respuesta 503 limpia (no crashean el build).

```
# Supabase (Settings → API en dashboard.supabase.com)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# MercadoPago (developers.mercadopago.cl → tu app → Credenciales)
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=

# Resend (resend.com → API Keys; dominio verificado primero)
RESEND_API_KEY=
RESEND_FROM_EMAIL=ventas@camperooverland.cl

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # en prod: https://camperooverland.cl
```

> El webhook de MercadoPago usa validación por fetch (consulta el pago a la
> API de MP) en vez de verificación HMAC, por eso no requiere
> `MERCADOPAGO_WEBHOOK_SECRET`.

## Setup inicial de Supabase

Una sola vez, después de crear el proyecto:

1. SQL Editor → New query
2. Pegar el contenido de `supabase/schema.sql`
3. Run

Crea 3 tablas (`configurations`, `orders`, `order_status_history`) con RLS habilitado.

## Deploy

Cada push a `main` redeployea automáticamente en Vercel. Las variables de
entorno se configuran en Vercel → Settings → Environment Variables (mismas
vars que `.env.local`, con `NEXT_PUBLIC_SITE_URL=https://camperooverland.cl`).

## Documentación

Especificaciones detalladas en `docs/`:

- `docs/configurador.md` — flujo de 6 pasos, lógica condicional, cálculos
- `docs/copy.md` — textos del sitio en es-CL
- `docs/diseno.md` — sistema visual (paleta, tipografía, espaciado)
- `docs/integraciones.md` — guía de MercadoPago, Supabase, Resend

Convenciones para colaboradores: `CLAUDE.md` en la raíz.

## Licencia

Privado. Todos los derechos reservados.
