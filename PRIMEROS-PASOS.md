# Primeros pasos para Claude Code

Esta es una guía paso a paso. Empezar por aquí.

## 1. Bootstrap del proyecto Next.js

```bash
npx create-next-app@latest campero-overland \
  --typescript --tailwind --app --src-dir --import-alias "@/*" \
  --eslint --no-turbopack

cd campero-overland
```

Cuando pregunte por configuraciones interactivas, elegir:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes
- src/ directory: Yes
- Import alias: `@/*`

## 2. Mover archivos del brief al proyecto

Una vez creado el proyecto, hay que copiar los archivos de este brief al proyecto:

```bash
# Desde la raíz del proyecto creado:
mkdir -p docs data public/logos public/mockups

# Copiar (asumiendo que el brief está en ../campero-overland-brief/)
cp ../campero-overland-brief/CLAUDE.md .
cp ../campero-overland-brief/docs/* docs/
cp ../campero-overland-brief/data/* data/
cp ../campero-overland-brief/assets/logo_v1_transp.png public/logos/logo-color.png
cp ../campero-overland-brief/assets/logo_v5_transp.png public/logos/logo-mono-crema.png
cp ../campero-overland-brief/assets/mockup-home.html public/mockups/
```

## 3. Instalar dependencias del stack

```bash
# Internacionalización
npm install next-intl

# Database + Auth + Storage
npm install @supabase/supabase-js @supabase/ssr

# Pagos
npm install mercadopago

# Emails
npm install resend

# Validación
npm install zod

# Utilidades (clsx para condicional de Tailwind classes)
npm install clsx tailwind-merge

# Iconos (si querés Lucide para iconografía consistente)
npm install lucide-react
```

## 4. Configurar fuentes

Las tipografías Fraunces, Geist Sans y Geist Mono están en Google Fonts. Setear en `src/app/[locale]/layout.tsx` usando `next/font/google`.

## 5. Setup de i18n

Seguir la guía oficial de next-intl con App Router:
- Crear `src/i18n.ts`
- Crear `src/middleware.ts`
- Crear `messages/es-CL.json` con los textos (ver @docs/copy.md)
- Configurar `next.config.mjs` con el plugin de next-intl

Estructura de URLs final:
- `/` → redirige a `/es-CL`
- `/es-CL` → home
- `/es-CL/configurador` → configurador
- (futuro) `/en` y `/es-AR`

## 6. Variables de entorno

Crear `.env.local` con las claves (NO commitear):

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
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Todas las claves se obtienen creando cuentas en cada servicio. Para arrancar el dev local, alcanza con que estén vacías (solo la app falla cuando intenta integrarse de verdad).

## 7. Setup de Supabase

Crear estas tablas mínimas en Supabase Studio:

```sql
-- Configuraciones guardadas por usuarios
CREATE TABLE configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL,
  vehicle TEXT NOT NULL,
  use_mode TEXT NOT NULL,
  model TEXT NOT NULL,
  material TEXT NOT NULL,
  addons JSONB NOT NULL DEFAULT '{}',
  total_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CLP',
  weight_kg NUMERIC,
  volume_l NUMERIC
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  configuration_id UUID REFERENCES configurations(id),
  mp_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_address JSONB,
  notes TEXT
);

-- Cambios de estado para producción
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  status TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);
```

Estados posibles del pedido: `pending` → `paid` → `in_production` → `ready_to_ship` → `shipped` → `delivered`. Cancelable con `cancelled`.

## 8. Setup de MercadoPago

1. Crear cuenta en https://www.mercadopago.cl/developers/
2. Crear una aplicación nueva
3. Tomar el Access Token (modo TEST primero) y el Public Key
4. Configurar webhook URL: `https://camperooverland.cl/api/webhook/mp`
5. Guardar el Webhook Secret

## 9. Setup de Resend

1. Crear cuenta en https://resend.com/
2. Verificar el dominio `camperooverland.cl` (requiere agregar registros DNS en Cloudflare)
3. Crear API key

## 10. Primer commit y deploy

```bash
git init
git add .
git commit -m "Initial commit: project setup with stack and brief"
git remote add origin git@github.com:tu-usuario/campero-overland.git
git push -u origin main
```

Conectar el repo a Vercel desde https://vercel.com/new — autodetecta Next.js.

## Orden recomendado de construcción

Una vez todo configurado, construir en este orden:

1. **Sistema de UI base** (`/src/components/ui/`)
   - Button, Card, Input, Container, etc
   - Basado en @docs/diseno.md

2. **Layout global** (`src/app/[locale]/layout.tsx`)
   - Header con logo V5 + nav
   - Footer
   - Configuración de fuentes

3. **Home** (`src/app/[locale]/page.tsx`)
   - Replicar visualmente @assets/mockup-home.html
   - Usar componentes UI ya construidos

4. **Configurador** (`src/app/[locale]/configurador/`)
   - Lógica del árbol según @docs/configurador.md
   - Estado en memoria (useReducer)
   - Panel preview reactivo
   - Al final: guardar en Supabase y crear preferencia MP

5. **Páginas restantes**: producto, historia, faq, contacto, checkout, confirmacion

6. **Integraciones backend**: API routes para checkout y webhook MP, emails con Resend
