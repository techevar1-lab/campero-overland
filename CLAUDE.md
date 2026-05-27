# Campero Overland

E-commerce + configurador interactivo para venta de mobiliario portátil de camperización para SUVs overland. Mercado: Chile MVP, expansión a Argentina V2.

## Comandos

- `npm run dev` — Servidor desarrollo (puerto 3000)
- `npm run build` — Build producción
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check

## Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript strict
- **Estilos**: Tailwind CSS v4, sin CSS custom files
- **i18n**: `next-intl` (preparado desde día 1; arranca solo en español)
- **DB + Auth + Storage**: Supabase
- **Pagos**: MercadoPago (Chile)
- **Email transaccional**: Resend
- **Hosting**: Vercel
- **Dominio**: camperooverland.cl (Cloudflare Registrar)
- **Analytics**: Vercel Analytics

## Arquitectura

```
/app
  /[locale]              → rutas localizadas (es-CL hoy, en, es-AR después)
    /page.tsx            → home
    /configurador        → árbol de decisiones 6 pasos
    /producto/[slug]     → detalle por SKU
    /historia            → manifiesto + storytelling
    /faq, /contacto
    /checkout, /confirmacion
  /api
    /checkout            → crea preferencia MercadoPago
    /webhook/mp          → webhook de pagos
/components/ui           → primitivos reutilizables (Button, Card, etc)
/components/configurador → componentes del configurador
/lib                     → utilidades, clients (supabase, mp, resend)
/data                    → JSONs estáticos: productos, accesorios, materiales
/messages                → archivos i18n (es-CL.json, etc)
/public                  → logos, assets estáticos
```

## Convenciones de código

- TypeScript strict mode, sin `any`
- Named exports, no default exports (excepto `page.tsx`, `layout.tsx`)
- Tailwind utility classes; usar variables de tema definidas en `tailwind.config.ts`
- Server Components por default; Client Components solo cuando hay interactividad
- Form state con React `useState`/`useReducer`, sin librerías externas para forms del configurador
- Validación con Zod en API routes
- Manejo de moneda: SIEMPRE objetos `{ amount: number, currency: "CLP" }`, nunca números sueltos

## Contexto del negocio

**Qué se vende**: 6 SKUs base de muebles modulares para SUV. Cada SKU se fabrica bajo pedido en 15 días hábiles. El cliente configura: vehículo → modo de viaje → modelo → material → accesorios → resumen y pago.

**Materiales**: 2 opciones. Terciado de abedul báltico es la versión premium estándar (precio listado en productos.json). Plástico reciclado PET/HDPE es el default sustentable: −20% en el mueble (no afecta accesorios), −30% en peso.

**Accesorios opcionales**: refrigeración (Alpicool X18/X30), energía (EcoFlow River 3/Plus/Pro), bidón con bomba (6L/10L/19L). Cada producto tiene compartimentos dimensionados para estos accesorios; si el cliente no los compra, el espacio queda libre.

**Envío**: flat-rate $25.000 CLP a todo Chile.

**Garantía**: 12 meses.

## Identidad visual (resumen)

- **Paleta**: verde profundo `#04342C`, verde medio `#0F4632`, ocre `#B8763A`, crema `#FAF7F0`, crema cálido `#F0E2CF`
- **Tipografía**: Fraunces (serif, títulos) + Geist Sans (body) + Geist Mono (etiquetas/números)
- **Tono**: editorial sobrio + hero épico cinematográfico
- **No usar**: emojis, sombras pesadas, gradientes brillantes, esquinas muy redondeadas (max border-radius: 8px)

Detalle completo en @docs/diseno.md

## Documentación referenciada

Lee solo cuando sea relevante a la tarea actual:

- **@docs/configurador.md** — flujo completo del árbol de decisiones (6 pasos, lógica condicional, qué se muestra en cada panel)
- **@docs/copy.md** — todos los textos del sitio en español-Chile
- **@docs/diseno.md** — sistema visual completo: paleta, tipografía, espaciados, componentes
- **@docs/integraciones.md** — cómo conectar MercadoPago, Supabase, Resend
- **@data/productos.json** — los 6 SKUs con precios, dimensiones, peso/volumen base
- **@data/accesorios.json** — Alpicool, EcoFlow, bidones con marca/modelo/descripción técnica
- **@data/materiales.json** — abedul vs reciclado con multiplicadores

## Reglas IMPORTANTES

- **NUNCA** commitear archivos `.env` ni claves de API (MercadoPago, Supabase, Resend)
- **NUNCA** hardcodear textos UI; siempre desde `messages/es-CL.json`
- **NUNCA** hardcodear precios; siempre desde `data/productos.json` o `data/accesorios.json`
- **SIEMPRE** validar webhooks de MercadoPago verificando la firma antes de procesar
- **SIEMPRE** estructurar precios como `{ amount, currency }` aunque hoy solo haya CLP
- Antes de crear un componente nuevo, revisar si ya existe en `/components/ui`
- Antes de crear una página nueva, leer @docs/configurador.md o @docs/copy.md según corresponda

## Flujo de trabajo

1. Para features nuevas: crear branch desde `main` (`git checkout -b feat/nombre`)
2. Cada feature debe pasar `npm run lint` y `npm run typecheck` antes de PR
3. Commits descriptivos, en español o inglés (consistente por commit)
4. No mergear a `main` sin que el build de Vercel pase
5. Variables de entorno en `.env.local` (desarrollo) y Vercel Environment Variables (producción)

## Estado del proyecto

**Fase actual**: bootstrap. Sin código todavía. Mockups visuales del home y configurador disponibles en `/assets/mockup-home.html` y `/assets/mockup-configurador.html` como referencia visual exacta.

**Orden de construcción** (ver PRIMEROS-PASOS.md):
1. Setup Next.js + Tailwind + i18n
2. Sistema de componentes UI base
3. Home (la página completa)
4. Configurador (la pieza más compleja)
5. Páginas de apoyo (producto, historia, faq, contacto)
6. Integraciones (MercadoPago, Supabase, emails)
7. Backoffice via Supabase Studio
