-- Schema mínimo de Supabase para Campero Overland.
-- Ejecutar en Supabase Studio → SQL Editor.
-- Idempotente: usar `if not exists` donde aplica para re-runs seguros.

-- ─────────────────────────────────────────────────────────────────────
-- Tabla: configurations
-- Cada configuración generada por el cliente desde /configurador. Se
-- inserta ANTES de iniciar el pago en MercadoPago. Posteriormente, el
-- webhook crea un `order` referenciando esta configuración.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists configurations (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz       default now(),
  email         text   not null,
  vehicle       text   not null,
  use_mode      text   not null,
  model         text   not null,
  material      text   not null,
  addons        jsonb  not null default '{}'::jsonb,
  total_amount  integer not null,
  currency      text   not null default 'CLP',
  weight_kg     numeric,
  volume_l      numeric
);

-- ─────────────────────────────────────────────────────────────────────
-- Tabla: orders
-- Generada por el webhook de MercadoPago cuando un pago queda en
-- `approved`. Referencia la configuration original.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz       default now(),
  configuration_id  uuid references configurations(id),
  mp_payment_id     text unique,
  status            text   not null default 'pending',
  customer_email    text   not null,
  customer_name     text,
  customer_address  jsonb,
  notes             text
);

-- Index para idempotencia del webhook.
create unique index if not exists orders_mp_payment_id_idx
  on orders(mp_payment_id);

-- ─────────────────────────────────────────────────────────────────────
-- Tabla: order_status_history
-- Log de cambios de estado para producción. Estados:
-- pending → paid → in_production → ready_to_ship → shipped → delivered
-- (`cancelled` como alternativo).
-- ─────────────────────────────────────────────────────────────────────
create table if not exists order_status_history (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references orders(id),
  status      text not null,
  changed_at  timestamptz       default now(),
  notes       text
);

-- ─────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────

alter table configurations enable row level security;
alter table orders enable row level security;
alter table order_status_history enable row level security;

-- configurations: cualquiera (anónimo o autenticado) puede INSERT. No
-- hay políticas de SELECT/UPDATE/DELETE públicas — solo service_role.
drop policy if exists "Anyone can insert configurations" on configurations;
create policy "Anyone can insert configurations" on configurations
  for insert with check (true);

-- orders: sin políticas públicas. Solo service_role (usado en el webhook
-- y el backoffice).
