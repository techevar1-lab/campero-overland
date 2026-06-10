import { useTranslations } from "next-intl";
import productosData from "@data/productos.json";
import renderAnchors from "@data/renderAnchors.json";
import { JimnyFrame } from "@/components/home/JimnyFrame";
import { Link } from "@/i18n/navigation";
import { formatPrice, type Price } from "@/lib/format";

const RENDERED_PRODUCTS: Record<string, { src: string } | undefined> = (
  renderAnchors as { products: Record<string, { src: string }> }
).products;

type Product = (typeof productosData.products)[number];

// Placeholder técnico que se muestra dentro del cuadro verde mientras no hay
// fotos de producto reales. Cuando lleguen las fotos, se reemplaza por <Image>.
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

  // Si el producto tiene render base y el vehículo es Jimny 3p, mostramos
  // el composite Jimny + producto. Si no, placeholder verde.
  const render = RENDERED_PRODUCTS[product.id];
  const showJimnyComposite =
    render !== undefined && product.vehicle === "jimny3";

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block focus:outline-none"
    >
      <div
        className={`relative mb-3.5 aspect-square overflow-hidden transition-opacity group-hover:opacity-95 group-focus-visible:ring-2 group-focus-visible:ring-ochre group-focus-visible:ring-offset-2 ${
          showJimnyComposite
            ? "border-[0.5px] border-green-deep/10 bg-cream-pure"
            : "flex items-end bg-green-medium p-[18px]"
        }`}
      >
        {showJimnyComposite ? (
          <JimnyFrame
            src={render.src}
            alt={product.title}
            orderNumber={orderNumber}
          />
        ) : (
          <>
            <span className="absolute left-3.5 top-3.5 font-mono text-[9px] uppercase tracking-[2px] text-ochre">
              {orderNumber}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[2px] text-cream/40">
              [ {placeholder} ]
            </span>
          </>
        )}
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
