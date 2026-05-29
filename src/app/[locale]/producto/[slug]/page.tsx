import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import materialesData from "@data/materiales.json";
import productosData from "@data/productos.json";
import { siteUrl } from "@/lib/env";
import { Link } from "@/i18n/navigation";
import { formatPrice, type Price } from "@/lib/format";

type RouteParams = { locale: string; slug: string };

type Dimensions = { length: number; width: number; height: number; unit: string };

const PRICE_FACTORS = materialesData.materials.map((m) => m.priceMultiplier);
const WEIGHT_FACTORS = materialesData.materials.map((m) => m.weightFactor);
const MIN_PRICE_FACTOR = Math.min(...PRICE_FACTORS);
const MIN_WEIGHT_FACTOR = Math.min(...WEIGHT_FACTORS);
const MAX_WEIGHT_FACTOR = Math.max(...WEIGHT_FACTORS);

export function generateStaticParams() {
  return productosData.products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productosData.products.find((p) => p.slug === slug);
  if (!product) return { title: "Modelo no encontrado · Campero Overland" };
  return {
    title: `${product.title} · Campero Overland`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = productosData.products.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const t = await getTranslations("Product");
  const tHome = await getTranslations("HomePage.Catalog");

  const priceFrom: Price = {
    amount: Math.round(product.price.amount * MIN_PRICE_FACTOR),
    currency: "CLP",
  };

  // JSON-LD Product (schema.org). Fabricación bajo pedido (MadeToOrder),
  // precio "desde" en CLP. Cuando haya fotos reales, agregar `image: [...]`.
  const base = siteUrl().replace(/\/$/, "");
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    brand: { "@type": "Brand", name: "Campero Overland" },
    category: "Outdoor & Camping > Vehicle Camping Furniture",
    offers: {
      "@type": "Offer",
      priceCurrency: priceFrom.currency,
      price: priceFrom.amount,
      availability: "https://schema.org/MadeToOrder",
      url: `${base}/${locale}/producto/${product.slug}`,
      seller: { "@type": "Organization", name: "Campero Overland" },
    },
  } as const;

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-6 pb-12 pt-10 sm:px-12 lg:px-20">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 font-mono text-[10px] uppercase tracking-[2px] text-ink-soft"
          >
            <Link
              href="/"
              className="transition-colors hover:text-green-deep"
            >
              {t("breadcrumb")}
            </Link>
            <span aria-hidden className="mx-2 text-ink-soft/40">
              /
            </span>
            <span className="text-green-deep">{product.shortTitle}</span>
          </nav>

          <h1 className="mb-4 max-w-3xl font-serif text-4xl leading-[1.1] tracking-[-0.5px] text-green-deep sm:text-[44px]">
            {product.title}
          </h1>
          <p className="max-w-2xl font-sans text-[15px] leading-[1.6] text-ink-soft">
            {product.description}
          </p>
        </div>
      </section>

      {/* IMAGEN PLACEHOLDER (reemplazar por carrusel de fotos reales) */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-6 sm:px-12 lg:px-20">
          <div className="relative flex aspect-[4/3] items-end overflow-hidden rounded-sm bg-green-medium p-8">
            <span className="font-mono text-[11px] uppercase tracking-[2px] text-cream/40">
              [ {product.shortTitle.toUpperCase()} · {product.subtitle.toUpperCase()} ]
            </span>
          </div>
        </div>
      </section>

      {/* PRICE + CTA */}
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-6 py-12 sm:px-12 lg:px-20">
          <div className="flex flex-col items-start justify-between gap-6 border-t-[0.5px] border-green-deep/10 pt-10 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[2px] text-ink-soft">
                {t("priceFromLabel")}
              </p>
              <p className="font-serif text-3xl tracking-[-0.5px] text-ochre sm:text-4xl">
                {formatPrice(priceFrom)}
              </p>
              <p className="mt-2 font-sans text-[12px] italic text-ink-soft">
                {t("priceFinalHint")}
              </p>
            </div>
            <Link
              href="/configurador"
              className="inline-flex items-center justify-center bg-ochre px-8 py-4 font-sans text-[13px] font-medium tracking-[0.5px] text-cream transition-colors hover:bg-ochre-dark"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-16 sm:px-12 lg:px-20">
          <h2 className="mb-10 font-serif text-2xl tracking-[-0.3px] text-green-deep sm:text-[28px]">
            {t("specsTitle")}
          </h2>
          <dl className="grid grid-cols-1 gap-x-12 gap-y-8 border-t-[0.5px] border-green-deep/10 pt-8 sm:grid-cols-2">
            <Spec
              label={t("specsDimensions")}
              value={formatDimensions(product.dimensions.assembled)}
            />
            <Spec
              label={t("specsBag")}
              value={formatDimensions(product.dimensions.bag)}
            />
            {product.hasBed && "bed" in product.dimensions ? (
              <Spec
                label={t("specsBed")}
                value={formatDimensions(
                  (product.dimensions as { bed: Dimensions }).bed,
                )}
              />
            ) : null}
            <Spec
              label={t("specsWeight")}
              value={formatWeightRange(product.baseWeight)}
              hint={t("specsWeightHint")}
            />
            <Spec
              label={t("specsVolume")}
              value={`${product.baseVolume} L`}
            />
            <Spec
              label={t("specsLoad")}
              value={`${product.loadCapacity.amount} ${product.loadCapacity.unit}`}
            />
            <Spec
              label={t("specsMaterials")}
              value={t("specsMaterialsValue")}
            />
            <Spec
              label={t("specsAddons")}
              value={t("specsAddonsValue")}
            />
          </dl>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-ochre-soft">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:px-12 lg:px-20">
          <h2 className="mb-10 font-serif text-2xl tracking-[-0.3px] text-green-deep sm:text-[28px]">
            {t("howItWorks.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Step
              order="01"
              title={t("howItWorks.step1Title")}
              body={t("howItWorks.step1Body")}
            />
            <Step
              order="02"
              title={t("howItWorks.step2Title")}
              body={t("howItWorks.step2Body")}
            />
            <Step
              order="03"
              title={t("howItWorks.step3Title")}
              body={t("howItWorks.step3Body")}
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-green-deep text-cream">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-12 lg:px-20">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
            {tHome("label")}
          </p>
          <h2 className="mb-8 font-serif text-[32px] leading-[1.15] tracking-[-0.5px] text-cream">
            {product.title}
          </h2>
          <Link
            href="/configurador"
            className="inline-flex items-center justify-center bg-ochre px-9 py-4 font-sans text-[13px] font-medium tracking-[0.5px] text-cream transition-colors hover:bg-ochre-dark"
          >
            {t("cta")}
          </Link>
        </div>
      </section>
    </article>
  );
}

function Spec({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div>
      <dt className="mb-2 font-mono text-[10px] uppercase tracking-[2px] text-ink-soft">
        {label}
      </dt>
      <dd className="font-sans text-[15px] text-green-deep">{value}</dd>
      {hint ? (
        <p className="mt-1 font-sans text-[11px] italic text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Step({
  order,
  title,
  body,
}: {
  order: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[2px] text-ochre">
        Paso {order}
      </p>
      <h3 className="mb-2 font-serif text-xl leading-[1.2] text-green-deep">
        {title}
      </h3>
      <p className="font-sans text-[13px] leading-[1.65] text-ink-soft">
        {body}
      </p>
    </div>
  );
}

function formatDimensions(d: Dimensions): string {
  return `${d.length} × ${d.width} × ${d.height} ${d.unit}`;
}

function formatWeightRange(baseWeight: number): string {
  const min = baseWeight * MIN_WEIGHT_FACTOR;
  const max = baseWeight * MAX_WEIGHT_FACTOR;
  const minStr = Number.isInteger(min) ? min.toString() : min.toFixed(1);
  const maxStr = Number.isInteger(max) ? max.toString() : max.toFixed(1);
  return minStr === maxStr ? `${minStr} kg` : `${minStr} – ${maxStr} kg`;
}
