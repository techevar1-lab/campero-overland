import Image from "next/image";
import { useTranslations } from "next-intl";
import productosData from "@data/productos.json";
import renderAnchors from "@data/renderAnchors.json";
import { Link } from "@/i18n/navigation";
import { formatPrice, type Price } from "@/lib/format";

type Product = (typeof productosData.products)[number];

const CATALOG_PHOTOS: Record<string, string | undefined> = (
  renderAnchors as { catalog?: Record<string, string> }
).catalog ?? {};

// Placeholder técnico que se muestra dentro del cuadro verde mientras no
// hay foto editorial del producto en `renderAnchors.catalog`.
const PLACEHOLDER_LABELS: Record<string, string> = {
  j3_org: "JIMNY 3P · ORG",
  j3_cama1: "JIMNY 3P · CAMA",
  j5_org: "JIMNY 5P · ORG",
  j5_cama2: "JIMNY 5P · CAMA",
  go_org: "GO · ORG",
  go_cama: "GO · CAMA",
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  const orderNumber = String(index + 1).padStart(2, "0");
  const placeholder = PLACEHOLDER_LABELS[product.id] ?? product.id.toUpperCase();
  const photoSrc = CATALOG_PHOTOS[product.id];

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block focus:outline-none"
    >
      <div className="relative mb-3.5 aspect-[4/3] overflow-hidden border-[0.5px] border-green-deep/10 transition-opacity group-hover:opacity-95 group-focus-visible:ring-2 group-focus-visible:ring-ochre group-focus-visible:ring-offset-2">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-end bg-green-medium p-[18px]">
            <span className="font-mono text-[10px] uppercase tracking-[2px] text-cream/40">
              [ {placeholder} ]
            </span>
          </div>
        )}
        {/* Número de orden — sobre la foto o el placeholder. Lleva un
            gradiente sutil detrás para que se lea sobre cualquier fondo. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />
        <span className="absolute left-3.5 top-3.5 font-mono text-[10px] uppercase tracking-[2px] text-cream">
          {orderNumber}
        </span>
      </div>

      <div className="mb-1 font-serif text-[17px] leading-[1.25] text-green-deep">
        {product.shortTitle}
        <br />
        <span className="font-serif text-sm italic text-ink-soft">
          {product.subtitle}
        </span>
      </div>

      <div className="mt-2 font-mono text-[12px] tracking-[0.5px] text-ochre">
        {formatPrice(product.price as Price)}
      </div>
    </Link>
  );
}

export function Catalog() {
  const t = useTranslations("HomePage.Catalog");
  const products = productosData.products;

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 pb-[60px] pt-10 sm:px-12 lg:px-20">
        <div className="mb-8">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
            {t("label")}
          </p>
          <h2 className="font-serif text-3xl tracking-[-0.5px] text-green-deep sm:text-[32px]">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
